export interface GalleryImageResponse {
  id: number;
  titre: string;
  description?: string;
  url: string;
  categorie: string;
  isPublic: boolean;
  formationId?: number;
  dateCreation: string;
}
