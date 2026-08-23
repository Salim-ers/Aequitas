# Décisions structurantes

## 1. Un seul projet Next.js

Pas de backend séparé. Les Route Handlers et les Server Actions couvrent l'API et les
mutations. L'architecture reste découpée par domaine dans `src/`, ce qui permettrait
d'extraire un service plus tard sans réécrire la logique métier.

## 2. Neon via pool WebSocket, pas HTTP

`drizzle-orm/neon-serverless` avec un `Pool` plutôt que `neon-http`, parce que la
numérotation de factures exige de vraies transactions SQL. Un driver sans transaction
rendrait impossible la garantie « pas de doublon, pas de trou ».

## 3. Numérotation par ligne de séquence, pas par `SEQUENCE` PostgreSQL

Une séquence native ne se remet pas à zéro par organisation et par année, et ses
valeurs sont consommées même en cas de rollback. On utilise donc une table
`invoice_sequences` avec `UPDATE … RETURNING` dans la transaction de finalisation,
plus un index unique `(organization_id, number)` comme garde-fou final.

Un brouillon ne consomme aucun numéro : `invoices.number` reste `NULL` jusqu'à la
finalisation.

## 4. TVA calculée par taux sur base agrégée

Calculer la TVA ligne à ligne puis sommer produit des écarts d'arrondi qui font
diverger le total TTC de la somme des lignes. On agrège d'abord les bases par taux,
puis on applique le taux une seule fois par tranche.

## 5. Idempotence par insertion préalable

Pour Stripe, l'événement est inséré dans `processed_webhooks` avant traitement.
L'unicité `(source, event_id)` fait qu'un rejeu ne peut pas entrer dans le handler.
Si le handler échoue, le verrou est supprimé pour que Stripe réessaie.

## 6. Le cache ne doit jamais fuir entre organisations

Les réponses sous `/(app)` et `/admin` portent `Cache-Control: private, no-store`.
Les layouts applicatifs sont `force-dynamic`. `resolveOrganizationContext` est mis en
cache par `React.cache`, dont la portée est la requête, jamais le déploiement.
