export interface ContactCreateRequest {
  nom: string;
  telephone: string;
  email?: string;
  ville?: string;
  quartier?: string;
  sujet?: string;
  message: string;
  formationId?: number;
}

export interface PreInscriptionRequest {
  nom: string;
  telephone: string;
  email?: string;
  ville?: string;
  quartier?: string;
  formationId: number;
  disponibilites?: string;
  message?: string;
}

export interface MessageResponse {
  id: number;
  nom: string;
  telephone: string;
  formationNom?: string;
  whatsappConfirmationLink: string;
}

export interface MessageListResponse {
  id: number;
  type: 'CONTACT_GENERAL' | 'PRE_INSCRIPTION';
  statut: 'NON_LU' | 'LU' | 'TRAITE' | 'ARCHIVE';
  nom: string;
  telephone: string;
  sujet?: string;
  formationNom?: string;
  dateCreation: string;
}
