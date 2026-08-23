import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  ShoppingCart,
  Truck,
  Banknote,
  Send,
  FolderOpen,
  UsersRound,
  Settings,
  CreditCard,
} from "lucide-react";

/**
 * §22 / §58 — Structure de navigation cible.
 *
 * `href` n'est renseigné que pour les écrans réellement construits. Les autres
 * sont affichés en clair avec la mention « Bientôt » : ce sont des repères de
 * feuille de route, pas des liens. Un élément sans `href` n'est jamais
 * cliquable, ce qui évite les 404 que produisait la sidebar précédente.
 */
export interface NavItem {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly href?: string;
}

export interface NavGroup {
  readonly title?: string;
  readonly items: readonly NavItem[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    items: [{ label: "Accueil", icon: LayoutDashboard, href: "/dashboard" }],
  },
  {
    title: "Ventes",
    items: [
      { label: "Factures", icon: Receipt },
      { label: "Devis", icon: FileText },
      { label: "Clients", icon: Users },
    ],
  },
  {
    title: "Achats",
    items: [
      { label: "Factures reçues", icon: ShoppingCart },
      { label: "Fournisseurs", icon: Truck },
    ],
  },
  {
    title: "Finances",
    items: [{ label: "Paiements", icon: Banknote }],
  },
  {
    title: "Facturation électronique",
    items: [{ label: "Suivi des factures", icon: Send }],
  },
  {
    title: "Organisation",
    items: [
      { label: "Documents", icon: FolderOpen },
      { label: "Équipe", icon: UsersRound },
      { label: "Abonnement", icon: CreditCard, href: "/abonnement" },
      { label: "Paramètres", icon: Settings },
    ],
  },
];

/** Fil d'Ariane : libellé lisible d'une route de l'application. */
export const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Accueil",
  "/abonnement": "Abonnement",
  "/abonnement/succes": "Activation",
};
