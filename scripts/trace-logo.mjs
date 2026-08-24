import { chromium } from "@playwright/test";
import fs from "node:fs";

/**
 * Vectorisation du logo de référence.
 *
 * Le PNG est composé d'aplats géométriques : on construit un masque binaire
 * par famille de couleur, on suit les arêtes entre pixels pleins et vides
 * pour obtenir des boucles fermées, puis on simplifie (Douglas-Peucker).
 * Les escaliers de pixels se recollapsent alors en droites franches, ce qui
 * restitue exactement les biseaux du dessin d'origine.
 */

const b64 = fs.readFileSync("public/brand/aequitas-logo-source.png").toString("base64");
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<canvas id='c'></canvas>");

const result = await page.evaluate(async ({ b64, tolerance, wordTolerance }) => {
  const img = new Image();
  img.src = "data:image/png;base64," + b64;
  await img.decode();
  const W = img.width, H = img.height;
  const canvas = document.getElementById("c");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, W, H).data;

  /** Classe un pixel : 1 = navy, 2 = rouge, 0 = fond. */
  function classify(i) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b);
    if (max > 200 && Math.abs(r - g) < 40 && Math.abs(g - b) < 40) return 0; // fond clair
    if (r > 120 && g < 110 && b < 110) return 2; // rouge
    if (b > r && b > 60 && r < 120) return 1; // navy
    // Pixels d'anticrénelage : rattachés à la teinte dominante.
    return r > b ? 2 : 1;
  }

  const kind = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) kind[p] = classify(p * 4);

  function maskFor(target) {
    const m = new Uint8Array(W * H);
    for (let p = 0; p < W * H; p++) m[p] = kind[p] === target ? 1 : 0;
    return m;
  }

  function bounds(m) {
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++)
        if (m[y * W + x]) {
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
    return { x0, y0, x1, y1 };
  }

  /** Boucles fermées longeant la frontière du masque. */
  function contours(m) {
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : m[y * W + x]);
    const edges = new Map(); // "x,y" -> [[x2,y2], ...]
    const push = (ax, ay, bx, by) => {
      const k = ax + "," + ay;
      if (!edges.has(k)) edges.set(k, []);
      edges.get(k).push([bx, by]);
    };

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (!at(x, y)) continue;
        // Orientation constante : l'intérieur reste du même côté.
        if (!at(x, y - 1)) push(x + 1, y, x, y);
        if (!at(x - 1, y)) push(x, y, x, y + 1);
        if (!at(x, y + 1)) push(x, y + 1, x + 1, y + 1);
        if (!at(x + 1, y)) push(x + 1, y + 1, x + 1, y);
      }
    }

    const loops = [];
    for (const [startKey, outs] of edges) {
      while (outs.length) {
        const loop = [];
        let [cx, cy] = startKey.split(",").map(Number);
        let guard = 0;
        while (guard++ < 4_000_000) {
          const k = cx + "," + cy;
          const list = edges.get(k);
          if (!list || list.length === 0) break;
          const [nx, ny] = list.pop();
          loop.push([cx, cy]);
          cx = nx; cy = ny;
          if (cx === Number(startKey.split(",")[0]) && cy === Number(startKey.split(",")[1])) break;
        }
        if (loop.length > 8) loops.push(loop);
        else break;
      }
    }
    return loops;
  }

  /** Douglas-Peucker : recollapse les escaliers de pixels en droites. */
  function simplify(points, eps) {
    if (points.length < 3) return points;
    const keep = new Uint8Array(points.length);
    keep[0] = keep[points.length - 1] = 1;
    const stack = [[0, points.length - 1]];
    while (stack.length) {
      const [s, e] = stack.pop();
      const [x1, y1] = points[s], [x2, y2] = points[e];
      let best = -1, bestD = eps;
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      for (let i = s + 1; i < e; i++) {
        const [px, py] = points[i];
        const d = Math.abs(dy * px - dx * py + x2 * y1 - y2 * x1) / len;
        if (d > bestD) { bestD = d; best = i; }
      }
      if (best !== -1) { keep[best] = 1; stack.push([s, best], [best, e]); }
    }
    return points.filter((_, i) => keep[i]);
  }

  function toPath(loops, ox, oy, scale, eps) {
    let d = "";
    for (const loop of loops) {
      const s = simplify(loop, eps);
      if (s.length < 3) continue;
      d += "M" + s.map(([x, y]) =>
        `${(+((x - ox) * scale).toFixed(2))} ${(+((y - oy) * scale).toFixed(2))}`
      ).join("L") + "Z";
    }
    return d;
  }

  const navy = maskFor(1), red = maskFor(2);
  const bn = bounds(navy), br = bounds(red);
  const box = {
    x0: Math.min(bn.x0, br.x0), y0: Math.min(bn.y0, br.y0),
    x1: Math.max(bn.x1, br.x1), y1: Math.max(bn.y1, br.y1),
  };

  // Sépare le symbole du mot-marque : on cherche la bande horizontale vide
  // la plus large dans la moitié basse.
  const rowFilled = new Uint32Array(H);
  for (let y = 0; y < H; y++) {
    let c = 0;
    for (let x = 0; x < W; x++) if (navy[y * W + x] || red[y * W + x]) c++;
    rowFilled[y] = c;
  }
  let gapStart = -1, gapLen = 0, bestGap = -1, bestLen = 0;
  for (let y = box.y0; y <= box.y1; y++) {
    if (rowFilled[y] === 0) {
      if (gapStart === -1) gapStart = y;
      gapLen++;
      if (gapLen > bestLen) { bestLen = gapLen; bestGap = gapStart; }
    } else { gapStart = -1; gapLen = 0; }
  }
  const splitY = bestGap === -1 ? box.y1 : bestGap + Math.floor(bestLen / 2);

  function cropMask(m, yFrom, yTo) {
    const out = new Uint8Array(W * H);
    for (let y = yFrom; y <= yTo; y++)
      for (let x = 0; x < W; x++) out[y * W + x] = m[y * W + x];
    return out;
  }

  const markNavy = cropMask(navy, box.y0, splitY);
  const markRed = cropMask(red, box.y0, splitY);
  const mb1 = bounds(markNavy), mb2 = bounds(markRed);
  const mark = {
    x0: Math.min(mb1.x0, mb2.x0), y0: Math.min(mb1.y0, mb2.y0),
    x1: Math.max(mb1.x1, mb2.x1), y1: Math.max(mb1.y1, mb2.y1),
  };
  const size = Math.max(mark.x1 - mark.x0, mark.y1 - mark.y0) + 1;
  const scale = 64 / size;
  const ox = mark.x0 - ((size - (mark.x1 - mark.x0 + 1)) / 2);
  const oy = mark.y0 - ((size - (mark.y1 - mark.y0 + 1)) / 2);
  const eps = tolerance / scale;

  // Mot-marque : tout ce qui se trouve sous la séparation.
  const wordNavy = cropMask(navy, splitY, box.y1);
  const wordRed = cropMask(red, splitY, box.y1);
  const wb1 = bounds(wordNavy), wb2 = bounds(wordRed);
  const word = {
    x0: Math.min(wb1.x0, wb2.x0), y0: Math.min(wb1.y0, wb2.y0),
    x1: Math.max(wb1.x1, wb2.x1), y1: Math.max(wb1.y1, wb2.y1),
  };
  // Normalisé sur une hauteur de 100 : la largeur suit le dessin.
  const wordH = word.y1 - word.y0 + 1;
  const wordScale = 100 / wordH;
  const wordEps = wordTolerance / wordScale;
  const wordWidth = +(((word.x1 - word.x0 + 1) * wordScale).toFixed(2));

  return {
    splitY,
    markBox: mark,
    navy: toPath(contours(markNavy), ox, oy, scale, eps),
    red: toPath(contours(markRed), ox, oy, scale, eps),
    wordWidth,
    wordPath: toPath(contours(wordNavy), word.x0, word.y0, wordScale, wordEps)
      + toPath(contours(wordRed), word.x0, word.y0, wordScale, wordEps),
  };
}, { b64, tolerance: 0.3, wordTolerance: 1.1 });

console.log("séparation symbole/mot-marque à y =", result.splitY);
console.log("cadre du symbole :", JSON.stringify(result.markBox));
console.log("navy :", result.navy.length, "caractères");
console.log("rouge :", result.red.length, "caractères");
// Le composant et les fichiers statiques partagent ces deux tracés.
fs.writeFileSync("traced-logo.json", JSON.stringify(result, null, 1));
console.log("Tracés écrits dans traced-logo.json — reportez-les dans");
console.log("components/brand/aequitas-logo.tsx et public/brand/*.svg.");
await browser.close();
