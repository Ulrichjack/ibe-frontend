export interface TestimonialResponse {
  id: number;
  nomEtudiant: string;
  formationSuivie: string;
  temoignage: string;
  note: number;
  photoUrl?: string;
  publie: boolean;
  dateCreation: string;
}

export interface TestimonialCreateRequest {
  nomEtudiant: string;
  formationSuivie: string;
  temoignage: string;
  note: number;
  photoUrl?: string;
  publie: boolean;
}
