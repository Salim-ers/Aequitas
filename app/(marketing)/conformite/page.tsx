import { permanentRedirect } from "next/navigation";

/**
 * Le statut réglementaire est traité par une seule page.
 * Cette URL est conservée parce qu'elle a pu être indexée ou partagée ;
 * elle pointe désormais vers la page canonique plutôt que d'entretenir
 * deux textes qui divergeraient au premier changement.
 */
export default function CompliancePage(): never {
  permanentRedirect("/demarche-pa");
}
