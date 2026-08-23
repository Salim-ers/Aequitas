import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Receipt,
  RotateCcw,
  Users,
  Truck,
  Banknote,
  Repeat,
  BellRing,
  GitCompare,
  Webhook,
  KeyRound,
  ShieldCheck,
  Fingerprint,
  ScrollText,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoicePreview } from "@/components/marketing/invoice-preview";

const CYCLE = [
  { icon: FileText, title: "Devis", body: "Rédigez, envoyez, suivez l'acceptation, convertissez en facture en un clic." },
  { icon: Receipt, title: "Factures", body: "Numérotation séquentielle, calcul de TVA multi-taux, remises, échéances." },
  { icon: RotateCcw, title: "Avoirs", body: "Rectifiez une facture émise sans jamais réécrire l'original." },
  { icon: Users, title: "Clients", body: "SIREN, TVA intracommunautaire, conditions de règlement par client." },
  { icon: Truck, title: "Fournisseurs", body: "Recevez, rapprochez et suivez vos factures d'achat au même endroit." },
  { icon: Banknote, title: "Paiements", body: "Règlements partiels, multiples, affectés à plusieurs factures." },
];

const AUTOMATION = [
  { icon: Repeat, title: "Factures récurrentes", body: "Un modèle, une fréquence, et la facture part sans vous." },
  { icon: BellRing, title: "Relances", body: "Avant échéance, le jour J, en retard : le message et le rythme sont les vôtres." },
  { icon: GitCompare, title: "Rapprochement", body: "Affectez un encaissement à une ou plusieurs factures, le solde suit." },
  { icon: Webhook, title: "Webhooks", body: "Vos systèmes sont notifiés dès qu'une facture change d'état." },
];

const SECURITY = [
  { icon: Lock, title: "Chiffrement", body: "En transit et au repos, sur toute la chaîne." },
  { icon: Fingerprint, title: "Double authentification", body: "Protégez l'accès aux données fiscales de l'entreprise." },
  { icon: ScrollText, title: "Journal d'audit", body: "Chaque action sensible est horodatée et conservée." },
  { icon: ShieldCheck, title: "Permissions", body: "Six rôles, vérifiés côté serveur à chaque requête." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
          <div>
            <p className="eyebrow">Facturation d&apos;entreprise — France</p>
            <h1 className="mt-5 font-semibold text-[2.75rem] leading-[1.08] tracking-[-0.015em] text-ink sm:text-[3.5rem]">
              La facturation électronique,
              <br />
              <span className="text-blue">simplement.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
              Aequitas centralise vos factures, vos paiements et vos obligations de
              facturation électronique dans une plateforme moderne conçue pour les
              entreprises françaises.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/inscription">
                <Button size="lg">
                  Commencer gratuitement
                  <ArrowRight />
                </Button>
              </Link>
              <Link href="/fonctionnalites">
                <Button size="lg" variant="secondary">
                  Découvrir Aequitas
                </Button>
              </Link>
            </div>

            <p className="mt-5 text-[13px] text-faint">
              Essai de 14 jours. Aucune carte requise pour créer votre compte.
            </p>
          </div>

          <div className="lg:pl-4">
            <InvoicePreview />
          </div>
        </div>
      </section>

      {/* Cycle de facturation */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="eyebrow">Le cycle complet</p>
          <h2 className="mt-4 max-w-2xl font-semibold text-[2rem] leading-tight tracking-[-0.01em] text-ink">
            Tout votre cycle de facturation
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Du devis accepté au règlement encaissé, sans ressaisie et sans tableur
            intermédiaire.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {CYCLE.map((item) => (
              <div key={item.title} className="bg-surface p-6">
                <item.icon className="size-5 text-blue" aria-hidden="true" />
                <h3 className="mt-4 text-[15px] font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facturation électronique */}
      <section className="border-b border-line bg-surface-2">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="eyebrow">Formats et transmissions</p>
              <h2 className="mt-4 font-semibold text-[2rem] leading-tight tracking-[-0.01em] text-ink">
                Facturation électronique
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Aequitas structure vos factures autour d&apos;un modèle canonique, puis
                les rend dans le format attendu. Les contrôles, le cycle de vie et
                l&apos;e-reporting reposent sur cette même base.
              </p>
              <p className="mt-4 rounded-[var(--radius)] border border-line-strong bg-surface px-4 py-3 text-[13px] leading-relaxed text-muted">
                Les fonctionnalités réglementaires sont déployées progressivement en
                fonction de l&apos;avancement de l&apos;immatriculation Aequitas.
              </p>
              <Link
                href="/facturation-electronique"
                className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-blue hover:underline"
              >
                Comprendre le calendrier
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <dl className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2">
              {[
                ["Factur-X", "PDF/A-3 avec données structurées embarquées."],
                ["UBL", "Rendu à partir du même modèle canonique."],
                ["CII", "Adaptateur distinct, mêmes données source."],
                ["Contrôles", "Validation avant transmission, rapport détaillé."],
                ["Transmissions", "File d'envoi, statuts, reprise sur échec."],
                ["Cycle de vie", "Chaque changement d'état est daté et conservé."],
              ].map(([term, description]) => (
                <div key={term} className="bg-surface p-5">
                  <dt className="text-[14px] font-medium text-ink">{term}</dt>
                  <dd className="mt-1.5 text-[13px] leading-relaxed text-muted">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Automatisation */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="eyebrow">Automatisation</p>
          <h2 className="mt-4 font-semibold text-[2rem] leading-tight tracking-[-0.01em] text-ink">
            Ce qui se répète n&apos;a pas à être refait
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {AUTOMATION.map((item) => (
              <div key={item.title}>
                <item.icon className="size-5 text-warning" aria-hidden="true" />
                <h3 className="mt-4 text-[15px] font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API */}
      <section className="border-b border-line bg-ink text-canvas">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-warning">Plateforme API-first</p>
            <h2 className="mt-4 font-semibold text-[2rem] leading-tight tracking-[-0.01em] text-canvas">
              Vos systèmes facturent aussi
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-faint">
              Chaque action disponible dans l&apos;interface l&apos;est aussi par API :
              clients, articles, devis, factures, paiements. Clés révocables, webhooks
              signés, journal des livraisons.
            </p>
            <Link
              href="/developers"
              className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-warning hover:underline"
            >
              Lire la documentation
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <pre className="overflow-x-auto rounded-[var(--radius-lg)] border border-white/10 bg-black/25 p-5 font-mono text-[12.5px] leading-relaxed text-faint">
            <code>{`curl https://api.aequitas.fr/v1/invoices \\
  -H "Authorization: Bearer aeq_live_..." \\
  -d customer_id="cus_8f21" \\
  -d issue_date="2026-08-23" \\
  -d "lines[0][description]=Prestation" \\
  -d "lines[0][quantity]=3" \\
  -d "lines[0][unit_price_ht]=780.00" \\
  -d "lines[0][tax_rate_id]=fr-standard-20"`}</code>
          </pre>
        </div>
      </section>

      {/* Sécurité */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="eyebrow">Sécurité</p>
          <h2 className="mt-4 font-semibold text-[2rem] leading-tight tracking-[-0.01em] text-ink">
            Des données fiscales méritent mieux qu&apos;un mot de passe
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY.map((item) => (
              <div key={item.title}>
                <item.icon className="size-5 text-blue" aria-hidden="true" />
                <h3 className="mt-4 text-[15px] font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <Link
            href="/securite"
            className="mt-10 inline-flex items-center gap-1.5 text-[14px] font-medium text-blue hover:underline"
          >
            Voir les mesures en place
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* CTA final */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-24 text-center">
          <h2 className="mx-auto max-w-2xl font-semibold text-[2.25rem] leading-tight tracking-[-0.015em] text-ink">
            Passez à la facturation nouvelle génération.
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/inscription">
              <Button size="lg">
                Commencer gratuitement
                <ArrowRight />
              </Button>
            </Link>
            <Link href="/tarifs">
              <Button size="lg" variant="secondary">
                Voir les tarifs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
