# Trajectoire réglementaire

## Règle qui prime sur toutes les autres

Aucune spécification officielle n'est devinée. Lorsqu'une règle de mapping, un code
ou une contrainte de format n'est pas connu avec certitude, le code lève
`RegulatoryConfigurationError` ou marque le point `PENDING_OFFICIAL_SPEC`. Il ne
produit jamais une valeur plausible.

## Ce qui est affiché à l'utilisateur

Tant qu'aucun canal officiel n'est raccordé, toute opération de transmission porte
`simulated: true` et l'interface affiche « Environnement de simulation ». La mention
« Envoyé à la DGFiP » est interdite en dehors d'un envoi réellement effectué.

Le pied de page et la page `/conformite` portent la mention d'absence
d'immatriculation. Aucun logo officiel n'est utilisé.

## Architecture

```
CanonicalInvoice
      │
      ├─→ FacturXAdapter ─┐
      ├─→ UBLAdapter      ├─→ document sérialisé
      └─→ CIIAdapter     ─┘
      │
      └─→ ElectronicInvoiceGateway ─→ transmission
```

Les ports vivent dans `src/regulatory/ports`. Les seules implémentations existantes
sont dans `src/regulatory/adapters/simulator`.

## Migration future du cœur réglementaire

Le frontend ne référence jamais un adaptateur : uniquement `getElectronicInvoiceGateway()`
et ses voisins. Déplacer le cœur vers une infrastructure qualifiée revient à écrire un
adaptateur HTTP et à changer le contenu de `src/regulatory/registry.ts`. Aucune page,
aucun formulaire, aucune requête métier n'a besoin d'être touché.

## État

| Étape | État |
|---|---|
| Modèle canonique | Défini |
| Adaptateurs de format | À écrire |
| Génération PDF/A-3 | À écrire |
| Transmissions | Simulateur uniquement |
| E-reporting | Simulateur uniquement |
| Candidature Plateforme Agréée | À venir |
