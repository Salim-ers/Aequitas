# Mesures de sécurité

## En place

- En-têtes : CSP restrictive, HSTS avec preload, `nosniff`, `frame-ancestors 'none'`,
  `Permissions-Policy`
- `Cache-Control: private, no-store` sur les routes applicatives
- Isolation multi-tenant : `organizationId` résolu depuis la session, `scoped()`
  obligatoire, `assertBelongsTo()` défensif après lecture
- Permissions : six rôles, matrice explicite, évaluation exclusivement côté serveur
- Mots de passe : douze caractères minimum, sessions à durée limitée
- Validation Zod sur toutes les entrées d'API et de Server Action
- Requêtes paramétrées via Drizzle — aucune concaténation SQL
- Vérification de signature des webhooks Stripe sur le corps brut
- Journal d'audit en ajout seul, avec liste noire de champs
- Logger structuré rejetant mots de passe, jetons, IBAN, XML et PDF
- Rôle plateforme séparé du rôle organisation

## À implémenter

- MFA et passkeys (plugins Better Auth)
- Rate limiting distribué sur login, inscription, réinitialisation, API, uploads
- Restrictions de type et de taille sur les uploads, avec analyse
- URLs signées à durée limitée pour les documents privés
- Révocation de session par appareil
- Rotation des clés API

## Ce qui n'est pas revendiqué

Aucune certification ISO 27001, aucune qualification SecNumCloud, aucun agrément.
La page `/securite` ne doit décrire que des mesures effectivement implémentées.
