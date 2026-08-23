import { computeDocumentTotals } from "@/src/tax/tax-engine";
import { formatMoney } from "@/src/lib/money";

/**
 * Élément signature du hero.
 * Ce n'est pas une capture d'écran : les montants sont calculés à la
 * construction de la page par le moteur de TVA réellement utilisé par
 * l'application. Ce qui est montré est ce qui est fait.
 */

const DEMO_LINES = [
  {
    description: "Accompagnement — refonte du socle de facturation",
    unit: "jour",
    quantity: "12",
    unitPriceHT: "780.00",
    discountPercent: "0",
    taxRateId: "fr-standard-20",
  },
  {
    description: "Reprise et rapprochement des historiques",
    unit: "forfait",
    quantity: "1",
    unitPriceHT: "2400.00",
    discountPercent: "10",
    taxRateId: "fr-standard-20",
  },
  {
    description: "Support et maintenance — trimestre",
    unit: "mois",
    quantity: "3",
    unitPriceHT: "290.00",
    discountPercent: "0",
    taxRateId: "fr-intermediate-10",
  },
] as const;

export function InvoicePreview() {
  const totals = computeDocumentTotals(DEMO_LINES);

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-[0_24px_60px_-24px_rgba(11,22,20,0.28)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <div>
          <p className="font-semibold uppercase tracking-[0.2em] text-[11px] text-muted">Facture</p>
          <p className="tabular mt-0.5 text-[15px] font-medium text-ink">AEQ-2026-000148</p>
        </div>
        <span className="rounded-full bg-blue-soft px-2.5 py-1 text-[11px] font-medium text-blue">
          Émise
        </span>
      </div>

      <table className="w-full text-[13px]">
        <caption className="sr-only">Aperçu des lignes d&apos;une facture Aequitas</caption>
        <thead>
          <tr className="border-b border-line text-left">
            <th scope="col" className="px-5 py-2.5 font-medium text-muted">
              Désignation
            </th>
            <th scope="col" className="px-2 py-2.5 text-right font-medium text-muted">
              Qté
            </th>
            <th scope="col" className="px-2 py-2.5 text-right font-medium text-muted">
              PU HT
            </th>
            <th scope="col" className="px-5 py-2.5 text-right font-medium text-muted">
              Total HT
            </th>
          </tr>
        </thead>
        <tbody>
          {DEMO_LINES.map((line, index) => {
            const computed = totals.lines[index];
            return (
              <tr key={line.description} className="border-b border-line/60 last:border-0">
                <td className="px-5 py-3 text-ink-soft">
                  <span className="line-clamp-1">{line.description}</span>
                  {line.discountPercent !== "0" ? (
                    <span className="mt-0.5 block text-[11px] text-warning">
                      Remise {line.discountPercent} %
                    </span>
                  ) : null}
                </td>
                <td className="px-2 py-3 text-right text-muted">
                  {line.quantity} {line.unit}
                </td>
                <td className="px-2 py-3 text-right text-muted">
                  {formatMoney(line.unitPriceHT)}
                </td>
                <td className="px-5 py-3 text-right font-medium text-ink">
                  {computed ? formatMoney(computed.netHT.toDb()) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* L'échelle HT → TVA → TTC : le cœur du produit, montré tel quel. */}
      <dl className="space-y-2 border-t border-line bg-surface-2 px-5 py-4 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-muted">Total HT</dt>
          <dd className="tabular text-ink-soft">{formatMoney(totals.totalHT.toDb())}</dd>
        </div>
        {totals.vatBreakdown.map((entry) => (
          <div key={entry.taxRateId} className="flex justify-between">
            <dt className="text-muted">
              TVA {entry.rate.replace(".", ",")} % sur {formatMoney(entry.baseHT.toDb())}
            </dt>
            <dd className="tabular text-ink-soft">{formatMoney(entry.taxAmount.toDb())}</dd>
          </div>
        ))}
        <div className="beam flex justify-between border-t border-line-strong pt-3">
          <dt className="font-medium text-ink">Total TTC</dt>
          <dd className="tabular text-[17px] font-medium text-ink">
            {formatMoney(totals.totalTTC.toDb())}
          </dd>
        </div>
      </dl>
    </div>
  );
}
