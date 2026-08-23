import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Garde d'accès de l'espace plateforme.
 *
 * Ces vérifications sont statiques : elles lisent le code source plutôt que
 * de l'exécuter, parce que le comportement réel dépend d'une base de données
 * et d'une session. Elles attrapent la régression qui compte — un écran ou
 * une action ajoutés sans garde — sans rien exiger de l'environnement.
 */

const ADMIN_DIR = join(process.cwd(), "app", "admin");
const GUARD_CALL = "await requirePlatformAdmin(";

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const adminFiles = walk(ADMIN_DIR);
const pages = adminFiles.filter((f) => f.endsWith("page.tsx"));
const layouts = adminFiles.filter((f) => f.endsWith("layout.tsx"));

describe("Espace plateforme", () => {
  it("expose au moins un écran et un layout", () => {
    expect(pages.length).toBeGreaterThan(0);
    expect(layouts.length).toBeGreaterThan(0);
  });

  it.each(pages)("%s appelle le garde", (file) => {
    expect(readFileSync(file, "utf8")).toContain(GUARD_CALL);
  });

  it.each(layouts)("%s appelle le garde", (file) => {
    expect(readFileSync(file, "utf8")).toContain(GUARD_CALL);
  });

  it("chaque action serveur revérifie le rôle sans se fier au layout", () => {
    // Une action serveur est un point d'entrée HTTP indépendant : elle est
    // atteignable sans que le layout ait jamais été rendu.
    const source = readFileSync(join(ADMIN_DIR, "actions.ts"), "utf8");
    expect(source).toContain('"use server"');

    const exported = [...source.matchAll(/export async function (\w+)/g)].map((m) => m[1]);
    expect(exported.length).toBeGreaterThan(0);

    for (const name of exported) {
      const body = source.slice(source.indexOf(`export async function ${name}`));
      const end = body.indexOf("\nexport async function", 1);
      const scope = end === -1 ? body : body.slice(0, end);
      // Soit l'action appelle le garde, soit elle passe par guard() qui le fait.
      expect(
        scope.includes(GUARD_CALL) || scope.includes("guard()"),
        `${name} sans garde`,
      ).toBe(true);
    }

    expect(source).toContain(GUARD_CALL);
    // Second verrou : jamais de données de démonstration en production.
    expect(source).toContain("isDemoSeedEnabled");
  });

  it("aucun écran d'administration ne permet de modifier un rôle plateforme", () => {
    // Une interface de promotion serait une élévation de privilège à un clic.
    for (const file of adminFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(/platformRole\s*[:=]\s*["']?(ADMIN|SUPER_ADMIN)/);
      expect(source).not.toContain("platform_role");
    }
  });

  it("la purge du bac à sable ne peut atteindre qu'une organisation marquée", () => {
    const source = readFileSync(join(process.cwd(), "src", "admin", "sandbox.ts"), "utf8");
    const purge = source.slice(source.indexOf("export async function purgeSandbox"));

    // Les deux marqueurs doivent être exigés simultanément.
    expect(purge).toContain("SANDBOX_SLUG");
    expect(purge).toContain("SANDBOX_MARKER");
    // Aucun identifiant d'organisation arbitraire n'est accepté en paramètre.
    expect(purge).toMatch(/purgeSandbox\(\)/);
  });

  it("le diagnostic ne renvoie jamais la valeur d'une variable d'environnement", () => {
    const source = readFileSync(
      join(process.cwd(), "src", "admin", "diagnostics.ts"),
      "utf8",
    );
    // Seule la présence est testée : toute lecture doit être coercée en booléen.
    const reads = [...source.matchAll(/process\.env\[?[.\w"']+\]?/g)].map((m) => m[0]);
    for (const read of reads) {
      const line = source.split("\n").find((l) => l.includes(read)) ?? "";
      expect(line, `valeur potentiellement exposée : ${line.trim()}`).toMatch(
        /Boolean\(|present\(|=== |!== |\?\.trim\(\)/,
      );
    }
  });
});
