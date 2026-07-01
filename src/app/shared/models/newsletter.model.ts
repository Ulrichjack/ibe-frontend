export interface NewsletterSubscribeRequest {
  telephone: string;
  email?: string;
}

export interface NewsletterResponse {
  id: number;
  telephone: string;
  email?: string;
  dateInscription: string;
  contacte: boolean;
  whatsappCatalogueLink?: string;
}
