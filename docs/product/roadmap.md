# Feuille de route produit

| Jalon | État |
|---|---|
| Facturation SaaS (Stripe, quotas, entitlements) | Socle en place |
| Gestion des factures (CRUD, numérotation, TVA) | Socle en place, éditeur à écrire |
| Formats électroniques (Factur-X, UBL, CII) | Modèle canonique défini, adaptateurs à écrire |
| Routage électronique | Simulateur uniquement |
| E-reporting | Simulateur uniquement |
| Candidature Plateforme Agréée | À venir |
| Interopérabilité officielle | À venir |
| Immatriculation | À venir |

## Prochain incrément

1. Éditeur de facture avec calcul en temps réel et enregistrement de brouillon
2. Finalisation transactionnelle : réservation du numéro, gel du snapshot des parties
3. Génération PDF côté serveur
4. Paiements et affectations, mise à jour du statut de règlement
5. CRUD clients, fournisseurs, catalogue
6. Devis et conversion en facture
