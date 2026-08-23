import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/src/database/client";
import {
  organizations,
  organizationSettings,
  memberships,
  subscriptions,
  customers,
  products,
  invoices,
  invoiceLines,
  payments,
  paymentAllocations,
  usageMetrics,
} from "@/src/database/schema";
import { computeDocumentTotals, type TaxableLine } from "@/src/tax/tax-engine";
import { reserveDocumentNumber } from "@/src/invoices/numbering";
import { Money } from "@/src/lib/money";
import { currentPeriod } from "@/src/billing/entitlements";

/**
 * Bac à sable de test.
 *
 * Les données sont écrites dans une organisation dédiée et jetable, jamais
 * dans une organisation réelle. Elles passent par le domaine réel — moteur
 * de TVA, arithmétique Money, séquence de numérotation transactionnelle —
 * de sorte que le jeu de test exerce le code de production et non une
 * imitation. C'est ce qui rend l'exercice utile.
 */

/** Marqueurs d'identification. Les deux doivent être réunis pour une purge. */
export const SANDBOX_SLUG = "bac-a-sable-aequitas";
export const SANDBOX_MARKER = "sandbox";

export class SandboxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SandboxError";
  }
}

/**
 * Générateur déterministe (xorshift32).
 * Deux exécutions produisent le même jeu : un écart constaté vient du code,
 * pas du hasard.
 */
function makeRandom(seed: number) {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 100_000) / 100_000;
  };
}

const CUSTOMERS = [
  { companyName: "Delaunay & Associés", city: "Paris", postalCode: "75008", siren: "812445903", terms: 30 },
  { companyName: "Atelier Verdier", city: "Lyon", postalCode: "69002", siren: "519220774", terms: 45 },
  { companyName: "Groupe Marceau", city: "Bordeaux", postalCode: "33000", siren: "447901328", terms: 30 },
  { companyName: "Studio Bellac", city: "Nantes", postalCode: "44000", siren: "902118465", terms: 15 },
  { companyName: "Fonderie de l'Ouest", city: "Rennes", postalCode: "35000", siren: "384775012", terms: 60 },
  { companyName: "Cabinet Rivoire", city: "Lille", postalCode: "59000", siren: "751093886", terms: 30 },
];

const CATALOGUE = [
  { name: "Accompagnement — jour", unit: "jour", unitPriceHT: "780.00", taxRateId: "fr-standard-20" },
  { name: "Développement — jour", unit: "jour", unitPriceHT: "650.00", taxRateId: "fr-standard-20" },
  { name: "Maintenance — mois", unit: "mois", unitPriceHT: "290.00", taxRateId: "fr-standard-20" },
  { name: "Formation — session", unit: "session", unitPriceHT: "1200.00", taxRateId: "fr-intermediate-10" },
  { name: "Reprise d'historique", unit: "forfait", unitPriceHT: "2400.00", taxRateId: "fr-standard-20" },
];

export interface SandboxState {
  exists: boolean;
  organizationId: string | null;
  legalName: string | null;
  createdAt: Date | null;
  counts: { customers: number; invoices: number; payments: number };
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

/** Retrouve l'organisation bac à sable, et seulement elle. */
async function findSandbox() {
  const db = getDb();
  const [row] = await db
    .select()
    .from(organizations)
    .where(
      and(
        eq(organizations.slug, SANDBOX_SLUG),
        eq(organizations.onboardingStep, SANDBOX_MARKER),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function getSandboxState(): Promise<SandboxState> {
  const org = await findSandbox();
  if (!org) {
    return {
      exists: false,
      organizationId: null,
      legalName: null,
      createdAt: null,
      counts: { customers: 0, invoices: 0, payments: 0 },
    };
  }

  const db = getDb();
  const [counts] = await db
    .select({
      customers: sql<number>`(select count(*) from customers where organization_id = ${org.id}::uuid)`,
      invoices: sql<number>`(select count(*) from invoices where organization_id = ${org.id}::uuid)`,
      payments: sql<number>`(select count(*) from payments where organization_id = ${org.id}::uuid)`,
    })
    .from(organizations)
    .where(eq(organizations.id, org.id));

  return {
    exists: true,
    organizationId: org.id,
    legalName: org.legalName,
    createdAt: org.createdAt,
    counts: {
      customers: Number(counts?.customers ?? 0),
      invoices: Number(counts?.invoices ?? 0),
      payments: Number(counts?.payments ?? 0),
    },
  };
}

export interface SeedResult {
  organizationId: string;
  customers: number;
  invoices: number;
  payments: number;
  totalTTC: string;
}

/**
 * Crée le bac à sable s'il n'existe pas et y écrit un jeu de données complet.
 * `ownerUserId` reçoit une adhésion OWNER pour pouvoir basculer dedans.
 */
export async function seedSandbox(ownerUserId: string): Promise<SeedResult> {
  const db = getDb();
  const existing = await findSandbox();
  if (existing) {
    throw new SandboxError(
      "Le bac à sable existe déjà. Supprimez-le avant d'en générer un nouveau.",
    );
  }

  const random = makeRandom(20260823);
  const today = new Date();

  return db.transaction(async (tx) => {
    const [org] = await tx
      .insert(organizations)
      .values({
        slug: SANDBOX_SLUG,
        legalName: "Bac à sable — Aequitas",
        legalForm: "SAS",
        siren: "000000000",
        siret: "00000000000000",
        vatNumber: "FR00000000000",
        addressLine1: "1 rue de la Démonstration",
        postalCode: "75001",
        city: "Paris",
        country: "FR",
        email: "bac-a-sable@aequitas.fr",
        // Marqueur : aucun parcours normal ne produit cette valeur.
        onboardingStep: SANDBOX_MARKER,
        onboardingCompletedAt: new Date(),
      })
      .returning();

    if (!org) throw new SandboxError("Création du bac à sable impossible");

    await tx.insert(organizationSettings).values({ organizationId: org.id });

    await tx.insert(memberships).values({
      organizationId: org.id,
      userId: ownerUserId,
      role: "OWNER",
      status: "ACTIVE",
    });

    // TRIALING plutôt qu'ACTIVE : le bac à sable ne simule pas un paiement
    // Stripe qui n'a pas eu lieu. L'accès applicatif est ouvert (§115).
    await tx.insert(subscriptions).values({
      organizationId: org.id,
      plan: "pro",
      status: "TRIALING",
      trialEndsAt: addDays(today, 14),
    });

    const insertedCustomers = await tx
      .insert(customers)
      .values(
        CUSTOMERS.map((c) => ({
          organizationId: org.id,
          type: "COMPANY" as const,
          companyName: c.companyName,
          email: `contact@${c.companyName.toLowerCase().replace(/[^a-z]+/g, "")}.fr`,
          siren: c.siren,
          postalCode: c.postalCode,
          city: c.city,
          country: "FR",
          paymentTermsDays: c.terms,
        })),
      )
      .returning({ id: customers.id, terms: customers.paymentTermsDays });

    await tx.insert(products).values(
      CATALOGUE.map((p) => ({
        organizationId: org.id,
        name: p.name,
        type: "SERVICE" as const,
        unit: p.unit,
        unitPriceHT: p.unitPriceHT,
        taxRateId: p.taxRateId,
      })),
    );

    let invoiceCount = 0;
    let paymentCount = 0;
    // Le quota est mensuel : seules les factures du mois courant le consomment.
    let invoicesThisPeriod = 0;
    const period = currentPeriod();
    let grandTotal = Money.zero();

    // Vingt-quatre factures réparties sur douze mois, avec des situations
    // volontairement variées : brouillon, émise, réglée, partielle, en retard.
    for (let index = 0; index < 24; index += 1) {
      const customer = insertedCustomers[index % insertedCustomers.length]!;
      const issueDate = addDays(today, -Math.floor(random() * 330) - 2);
      const dueDate = addDays(issueDate, customer.terms);

      const lineCount = 1 + Math.floor(random() * 3);
      const rawLines: TaxableLine[] = Array.from({ length: lineCount }, () => {
        const item = CATALOGUE[Math.floor(random() * CATALOGUE.length)]!;
        return {
          quantity: String(1 + Math.floor(random() * 12)),
          unitPriceHT: item.unitPriceHT,
          discountPercent: random() > 0.8 ? "10" : "0",
          taxRateId: item.taxRateId,
        };
      });

      // Les totaux viennent du moteur de TVA réel, jamais d'un calcul ad hoc.
      const totals = computeDocumentTotals(rawLines);

      const roll = random();
      const isDraft = roll < 0.12;
      const overdue = !isDraft && dueDate < today && roll < 0.32;
      const fullyPaid = !isDraft && !overdue && roll > 0.5;
      const partiallyPaid = !isDraft && !overdue && !fullyPaid && roll > 0.34;

      const number = isDraft
        ? null
        : await reserveDocumentNumber(tx, org.id, "INVOICE", {
            prefix: "AEQ",
            year: issueDate.getUTCFullYear(),
          });

      const paid = fullyPaid
        ? totals.totalTTC
        : partiallyPaid
          ? totals.totalTTC.mul("0.4").round()
          : Money.zero();
      const balance = totals.totalTTC.sub(paid);

      const [invoice] = await tx
        .insert(invoices)
        .values({
          organizationId: org.id,
          customerId: customer.id,
          kind: "INVOICE",
          number,
          businessStatus: isDraft ? "DRAFT" : "SENT",
          paymentStatus: fullyPaid
            ? "PAID"
            : overdue
              ? "OVERDUE"
              : partiallyPaid
                ? "PARTIALLY_PAID"
                : "UNPAID",
          electronicStatus: isDraft ? "NOT_APPLICABLE" : "GENERATED",
          issueDate: isoDate(issueDate),
          dueDate: isoDate(dueDate),
          currency: "EUR",
          totalHT: totals.totalHT.toDb(),
          totalTax: totals.totalTax.toDb(),
          totalTTC: totals.totalTTC.toDb(),
          amountPaid: paid.toDb(),
          balanceDue: balance.toDb(),
          vatBreakdown: totals.vatBreakdown.map((entry) => ({
            taxRateId: entry.taxRateId,
            label: entry.label,
            rate: entry.rate,
            categoryCode: entry.categoryCode,
            baseHT: entry.baseHT.toDb(),
            taxAmount: entry.taxAmount.toDb(),
          })),
          issuedAt: isDraft ? null : issueDate,
          sentAt: isDraft ? null : issueDate,
          createdByUserId: ownerUserId,
        })
        .returning({ id: invoices.id });

      if (!invoice) throw new SandboxError("Insertion de facture impossible");

      await tx.insert(invoiceLines).values(
        rawLines.map((line, position) => {
          const computed = totals.lines[position]!;
          const item = CATALOGUE.find((c) => c.taxRateId === line.taxRateId) ?? CATALOGUE[0]!;
          return {
            organizationId: org.id,
            invoiceId: invoice.id,
            position,
            description: item.name,
            unit: item.unit,
            quantity: line.quantity,
            unitPriceHT: line.unitPriceHT,
            discountPercent: line.discountPercent ?? "0",
            taxRateId: line.taxRateId,
            netHT: computed.netHT.toDb(),
            taxAmount: computed.taxAmount.toDb(),
            totalTTC: computed.totalTTC.toDb(),
          };
        }),
      );

      if (paid.gt(0)) {
        const receivedAt = addDays(issueDate, Math.floor(random() * customer.terms));
        const [payment] = await tx
          .insert(payments)
          .values({
            organizationId: org.id,
            customerId: customer.id,
            direction: "INBOUND",
            method: "BANK_TRANSFER",
            amount: paid.toDb(),
            currency: "EUR",
            receivedAt: isoDate(receivedAt),
            reference: `VIR-${String(index + 1).padStart(4, "0")}`,
            createdByUserId: ownerUserId,
          })
          .returning({ id: payments.id });

        if (payment) {
          await tx.insert(paymentAllocations).values({
            organizationId: org.id,
            paymentId: payment.id,
            invoiceId: invoice.id,
            amount: paid.toDb(),
          });
          paymentCount += 1;
        }
      }

      if (!isDraft) grandTotal = grandTotal.add(totals.totalTTC);
      if (isoDate(issueDate).slice(0, 7) === period) invoicesThisPeriod += 1;
      invoiceCount += 1;
    }

    // Le compteur de quota doit refléter ce qui vient d'être écrit, sur la
    // seule période qu'il mesure — sans quoi la jauge afficherait douze mois
    // de factures comme consommés ce mois-ci.
    await tx.insert(usageMetrics).values({
      organizationId: org.id,
      metric: "invoices_created",
      period,
      value: invoicesThisPeriod,
    });

    return {
      organizationId: org.id,
      customers: insertedCustomers.length,
      invoices: invoiceCount,
      payments: paymentCount,
      totalTTC: grandTotal.toDb(),
    };
  });
}

/**
 * Supprime le bac à sable et tout ce qui en dépend.
 *
 * La suppression n'est possible que sur une ligne portant à la fois le slug
 * et le marqueur du bac à sable : aucune organisation réelle ne peut être
 * atteinte par cette fonction, même si un identifiant arbitraire est fourni.
 * Le reste part par cascade (`onDelete: "cascade"` sur organization_id).
 */
export async function purgeSandbox(): Promise<{ deleted: boolean }> {
  const db = getDb();
  const result = await db
    .delete(organizations)
    .where(
      and(
        eq(organizations.slug, SANDBOX_SLUG),
        eq(organizations.onboardingStep, SANDBOX_MARKER),
      ),
    )
    .returning({ id: organizations.id });

  return { deleted: result.length > 0 };
}
