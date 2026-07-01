export interface FormationResponse {
  id: number;
  nom: string;
  description: string;
  duree: string;
  prix: number;
  prixAvecReduction?: number;
  categorie: string;

  // --- NOUVEAUX CHAMPS ---
  fraisInscription: number;
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
  // -----------------------

  dateDemarrage?: string;
  nombrePlaces: number;
  placesRestantesAffichees: number;
  photoPrincipale?: string;
  photosGalerie?: string[];
  isPromoActive: boolean;
  slug: string;
}

export interface FormationCreateRequest {
  nom: string;
  description: string;
  duree: string;
  fraisInscription: number;
  prix: number;
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
  nombrePlaces: number;
  socialProofActif?: boolean;
  nombreInscritsAffiche?: number;
  photoPrincipale?: string;
  photosGalerie?: string[];
  enPromotion?: boolean;
  pourcentageReduction?: number;
  dateDebutPromo?: string;
  dateFinPromo?: string;
}
