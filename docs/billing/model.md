# Modèle de facturation SaaS

## Ne pas confondre deux objets

1. Les factures **créées par le client** dans Aequitas (tables `invoices`,
   `invoice_lines`, `payments`).
2. Les factures **Stripe émises par Aequitas** pour l'abonnement au service
   (tables `subscriptions`, `billing_events`, `stripe_customers`).

Ces deux ensembles ne se croisent jamais. Une facture d'abonnement n'apparaît pas
dans le chiffre d'affaires du client, et une facture client n'est jamais transmise à
Stripe.

## Cycle

```
Inscription → Création entreprise → Choix d'offre → Stripe Checkout
                                                          │
                                            webhook ──────┘
                                                │
                                     subscription.status = ACTIVE
                                                │
                                            Dashboard
```

`subscriptions.status = INCOMPLETE` est écrit à la création de l'entreprise.
Seul le webhook le fait passer à `TRIALING` ou `ACTIVE`.

## Statuts et accès

| Statut | Accès applicatif |
|---|---|
| `INCOMPLETE`, `INCOMPLETE_EXPIRED` | Non |
| `TRIALING`, `ACTIVE` | Oui |
| `PAST_DUE`, `GRACE_PERIOD` | Oui — bandeau de régularisation |
| `SUSPENDED`, `CANCELED` | Non — données conservées |

Aucune donnée client n'est supprimée automatiquement, quel que soit le statut.

## Quotas

`usage_metrics` porte un compteur par organisation, métrique et période
(`YYYY-MM` ou `lifetime`). L'incrément est atomique
(`ON CONFLICT … SET value = value + n`). À 80 % d'un quota, une notification est
émise ; à 100 %, la création est bloquée avec un appel à l'action vers l'offre
supérieure — jamais une perte de données.

## Changer un prix

`src/config/plans.ts` uniquement, plus le prix correspondant dans Stripe et la
variable d'environnement `STRIPE_PRICE_*`. Aucun montant n'est écrit en dur ailleurs.
