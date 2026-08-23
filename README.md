# Aequitas

Plateforme de facturation électronique pour les entreprises françaises.
Application Next.js unique, déployée sur Vercel, base Neon PostgreSQL.

> Aequitas n'est pas actuellement présentée comme Plateforme Agréée tant que
> l'immatriculation correspondante n'a pas été délivrée par l'administration fiscale.

---

## Le workflow est le cloud

Il n'y a pas de procédure `localhost` dans ce dépôt. Le cycle est :

```
commit → push → Vercel Preview → CI (typecheck, tests, build) → merge → Production
```

`main` correspond à la production. Chaque pull request produit un Preview Deployment
sur lequel Playwright s'exécute.

---

## Mise en service

### 1. Dépôt et hébergement

Poussez ce dépôt sur GitHub, puis dans Vercel : **Add New › Project**, sélectionnez le
dépôt. Le framework est détecté automatiquement ; ne modifiez pas les commandes de build.

### 2. Base de données

Vercel › **Storage › Neon**. L'intégration injecte `DATABASE_URL` dans les trois
environnements. Aucune installation de PostgreSQL n'est nécessaire.

Appliquez ensuite le schéma : onglet **Actions** › workflow **Migrations** ›
*Run workflow* › environnement cible. Le workflow exécute `scripts/migrate.ts` contre
le `DATABASE_URL` du secret d'environnement GitHub correspondant.

### 3. Stockage de fichiers

Vercel › **Storage › Blob**. `BLOB_READ_WRITE_TOKEN` est injecté automatiquement.
Les documents privés ne reçoivent jamais d'URL publique permanente.

### 4. Stripe

Dans le tableau de bord Stripe :

1. Créez trois produits — Essentiel, Pro, Business — avec un prix récurrent mensuel
   en euros (29, 79, 199 € HT).
2. Relevez l'identifiant de chaque prix (`price_…`).
3. Créez un endpoint webhook vers `https://VOTRE-DOMAINE/api/webhooks/stripe`, abonné à :
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.paid`, `invoice.payment_failed`.
4. Relevez le secret de signature (`whsec_…`).

### 5. Variables d'environnement

Copiez les clés de `.env.example` dans Vercel › Settings › Environment Variables.
Production et Preview reçoivent des valeurs distinctes ; les clés Stripe de test
vont sur Preview, les clés live sur Production.

`AUTH_SECRET` se génère avec `openssl rand -base64 32`.

Ajoutez également `DATABASE_URL` dans les secrets GitHub (Settings › Environments)
pour que le workflow de migration puisse s'exécuter.

---

## Architecture

```
app/
  (marketing)/     Site public : landing, tarifs, conformité, sécurité, légal
  (auth)/          Connexion, inscription, mot de passe oublié
  (app)/           Espace client authentifié
  onboarding/      Création d'entreprise et souscription
  api/             Route Handlers : auth, billing, webhooks, contact, santé

src/
  auth/            Sessions, gardes d'accès, permissions résolues côté serveur
  billing/         Stripe, abonnements, entitlements, quotas
  config/plans.ts  Source de vérité unique des offres et des limites
  database/        Client Neon, schéma Drizzle, garde multi-tenant
  domain/          CanonicalInvoice — pivot entre l'UI et les formats
  invoices/        Numérotation séquentielle transactionnelle
  lib/             Money (Decimal), env, logger, utilitaires
  permissions/     Matrice rôle → permission
  regulatory/      Ports réglementaires et adaptateurs de simulation
  tax/             TaxEngine — taux versionnés, ventilation de TVA

drizzle/           Migrations SQL versionnées
tests/unit/        Vitest — argent, TVA, numérotation, offres
tests/e2e/         Playwright — exécuté contre les Preview Deployments
```

### Décisions structurantes

**L'argent ne passe jamais par `number`.** Tout montant est un `Money` adossé à
Decimal.js, stocké en `numeric(19,4)` et transporté en chaîne. `0.1 + 0.2` vaut
exactement `0.30`, vérifié par test.

**La TVA a un seul point d'entrée.** `computeDocumentTotals` calcule par taux sur la
base agrégée, pas ligne à ligne puis sommée. La remise pied de facture est répartie au
prorata, la dernière tranche absorbant l'écart d'arrondi. On ne trouvera nulle part
ailleurs un `montant * 0.20`.

**L'organisation vient de la session, jamais du navigateur.** Toute requête métier
passe par `scoped(table.organizationId, organizationId, …)`. Un `organizationId` reçu
d'un formulaire ou d'une URL n'est jamais utilisé tel quel.

**Le webhook Stripe est la source de vérité.** Arriver sur `/abonnement/succes` ne
débloque rien : la page interroge le serveur jusqu'à ce qu'un statut actif soit écrit
en base. L'événement est inséré dans `processed_webhooks` *avant* traitement ; le
conflit d'unicité rend tout rejeu sans effet, et le verrou est retiré en cas d'échec
pour laisser Stripe réessayer.

**Les droits sont centralisés.** `canUseFeature`, `checkLimit`, `incrementUsage`.
Aucun `if (plan === "PRO")` dispersé dans l'application.

**Le cœur réglementaire est isolé.** Les gateways sont des interfaces
(`src/regulatory/ports`) ; seuls des simulateurs les implémentent aujourd'hui, et
toute sortie porte `simulated: true`. Le jour où ce cœur devra vivre sur une
infrastructure qualifiée, seuls les adaptateurs changent.

**Rien d'inventé côté réglementation.** Une spécification officielle manquante lève
`RegulatoryConfigurationError` plutôt que de produire un mapping approximatif.

---

## Vérifications

| Commande | Ce qu'elle fait |
|---|---|
| `npm run typecheck` | TypeScript strict, `noUncheckedIndexedAccess` |
| `npm test` | Tests unitaires : argent, TVA, numérotation, offres |
| `npm run build` | Build de production Next.js |
| `npm run db:generate` | Génère une migration après modification du schéma |
| `npm run test:e2e` | Playwright — nécessite `PLAYWRIGHT_BASE_URL` |

La CI refuse une pull request dont le schéma Drizzle a changé sans migration
correspondante.

---

## État d'avancement

**En place** — socle monétaire et fiscal, schéma complet (39 tables), numérotation
séquentielle, isolation multi-tenant, entitlements et quotas, Stripe Checkout /
Portal / webhooks idempotents, site public, authentification, onboarding étape 1,
tableau de bord, ports réglementaires, CI, migrations cloud.

**À construire** — génération PDF, Factur-X / UBL / CII, avoirs, achats et imports,
paiements, équipe et invitations, API v1 et clés, webhooks sortants, back-office
plateforme, analytics MRR, crons de relance et de récurrence, e-reporting,
recherche globale et palette de commandes, mode sombre.

Voir `docs/` pour le détail par domaine.
