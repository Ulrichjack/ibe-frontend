export interface FormationResponse {
  id: number;
  nom: string;
  description: string;
  duree: string | null;
  prix: number | null;
  prixAvecReduction?: number | null;
  categorie: string;

  // --- NOUVEAUX CHAMPS ---
  fraisInscription: number | null;
  certificatDelivre: boolean;
  nomCertificat?: string;
  programme?: string;
  objectifs?: string;
  materielFourni?: string;
  horaires?: string;
  frequence?: string;
  pourcentageReduction?: number;
  dateFinPromo?: string;
  active: boolean;
  enPromotion?: boolean;
  socialProofActif?: boolean;
  nombreInscritsAffiche?: number;
  joursFormation?: string;
  dateFinInscription?: string;
  dateDebutPromo?: string;
  miseEnAvant?: boolean;
  ordreAffichage?: number | null;
  // -----------------------

  dateDemarrage?: string;
  nombrePlaces: number | null;
  placesRestantesAffichees: number;
  photoPrincipale?: string;
  photosGalerie?: string[];
  isPromoActive: boolean;
  slug: string;
}

export interface FormationCreateRequest {
  nom: string;
  description: string;
  duree: string | null;
  fraisInscription: number | null;
  prix: number | null;
  categorie: string;
  certificatDelivre?: boolean;
  nomCertificat?: string;
  programme?: string;
  objectifs?: string;
  materielFourni?: string;
  dateDemarrage?: string;
  dateFinInscription?: string;
  joursFormation?: string;
  horaires?: string;
  frequence?: string;
  nombrePlaces: number | null;
  socialProofActif?: boolean;
  nombreInscritsAffiche?: number;
  photoPrincipale?: string;
  photosGalerie?: string[];
  enPromotion?: boolean;
  pourcentageReduction?: number;
  dateDebutPromo?: string;
  dateFinPromo?: string;
}
