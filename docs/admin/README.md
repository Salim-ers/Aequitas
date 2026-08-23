# Espace d'administration

Espace réservé à l'exploitant de l'instance, distinct de l'espace client.
Il sert à deux choses : surveiller l'état de l'instance, et disposer d'un jeu
de données de test cohérent.

## Accéder

L'accès dépend du **rôle plateforme** (`users.platform_role`), qui n'a rien à
voir avec le rôle tenu dans une organisation : être `OWNER` de son entreprise
n'ouvre aucun droit ici.

Il n'existe volontairement **aucune interface pour se promouvoir soi-même** —
ce serait une élévation de privilège à un clic. Le rôle s'accorde hors bande :

```sh
# 1. Créer le compte normalement via /inscription
# 2. Puis, avec le DATABASE_URL de l'environnement visé :
DATABASE_URL="postgres://…" npm run admin:grant -- vous@exemple.fr

# Pour retirer le rôle :
DATABASE_URL="postgres://…" npm run admin:grant -- vous@exemple.fr --revoke
```

`better-auth` déclare `platformRole` avec `input: false` : la colonne ne peut
pas être renseignée à l'inscription, même en forgeant la requête.

Une fois le rôle accordé, un bouton **Administration** apparaît en bas de la
navigation de l'espace applicatif.

## Ce que contient l'espace

| Écran | Rôle |
| --- | --- |
| Vue d'ensemble | Compteurs plateforme et état de configuration de l'instance |
| Organisations | Qui est hébergé, dans quel état d'abonnement — lecture seule |
| Journal d'audit | Les cent derniers événements sensibles, toutes organisations |
| Bac à sable | Génération et purge du jeu de données de test |

La vue Organisations n'expose **aucune donnée commerciale** : ni facture, ni
client, ni montant. Un administrateur plateforme voit qui est hébergé, pas le
contenu commercial de ses clients.

L'écran de configuration ne lit **que la présence** des variables
d'environnement, jamais leur valeur : cet espace ne doit pas devenir un moyen
commode de lire les secrets du déploiement.

## Bac à sable

Génère une organisation dédiée et jetable (`bac-a-sable-aequitas`) contenant
6 clients, 5 articles, 24 factures réparties sur douze mois et leurs
règlements, dans cinq situations de paiement différentes.

Les données passent par le **domaine réel** — moteur de TVA, arithmétique
`Money`, séquence de numérotation transactionnelle. Le jeu de test exerce donc
le code de production et non une imitation, ce qui est tout l'intérêt de
l'exercice. Le tirage est déterministe : deux générations produisent le même
jeu, donc un écart constaté vient du code et non du hasard.

### Activation

```sh
DEMO_SEED_ENABLED=true
```

Le drapeau est **ignoré lorsque `VERCEL_ENV` vaut `production`**
(`isDemoSeedEnabled()`, `src/lib/env.ts`) : aucune donnée de démonstration ne
peut être écrite en production, quelle que soit la configuration.

### Suppression

La purge ne peut atteindre qu'une ligne portant **à la fois** le slug
`bac-a-sable-aequitas` et le marqueur `onboarding_step = 'sandbox'` — une
valeur qu'aucun parcours d'inscription ne produit. Aucune organisation réelle
n'est accessible à cette opération, quel que soit l'identifiant transmis. La
suppression demande en outre une confirmation saisie au clavier.

## Notes de sécurité

- Le garde du `layout` protège le **rendu**. Il ne protège pas les actions
  serveur, qui sont des points d'entrée HTTP indépendants : chacune revérifie
  le rôle de son côté (`app/admin/actions.ts`).
- `/admin` est exclu de l'indexation par `robots.ts` et par les métadonnées de
  la route.
- Les opérations du bac à sable sont inscrites au journal d'audit.
