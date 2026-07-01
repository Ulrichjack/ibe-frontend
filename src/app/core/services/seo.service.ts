import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  /**
   * Configure le SEO complet d'une page
   */
  setPageSeo(pageTitle: string, description: string, image: string = '/assets/img/logo-ibe.webp') {
    const siteName = "Institut Beauty's Empire";
    const fullTitle = `${pageTitle} — ${siteName}`;
    const imageUrl = `https://ibe-yaounde.com${image}`;

    // 1. Titre de l'onglet
    this.title.setTitle(fullTitle);

    // 2. Balises Meta Standards
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // 3. Open Graph (Facebook, WhatsApp, LinkedIn)
    this.meta.updateTag({ property: 'og:site_name', content: siteName });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_CM' });

    // 4. Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

    // 5. Mise à jour de l'URL canonique
    this.updateCanonicalTag();
  }

  private updateCanonicalTag() {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', `https://ibe-yaounde.com${window.location.pathname}`);
  }

  /**
   * Génère le schéma JSON-LD pour l'organisation (SEO Local)
   */
  setOrganizationSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "VocationalSchool",
      "name": "Institut Beauty's Empire",
      "alternateName": "IBE Yaoundé",
      "description": "Centre de formation professionnelle aux métiers de la beauté à Yaoundé (Esthétique, Coiffure, Make-up).",
      "url": "https://ibe-yaounde.com",
      "logo": "https://ibe-yaounde.com/assets/img/logo-ibe.webp",
      "image": "https://ibe-yaounde.com/assets/img/ibe-ceremony.webp",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Entrée PMI Tsinga",
        "addressLocality": "Yaoundé",
        "addressRegion": "Centre",
        "addressCountry": "CM"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 3.8814715,
        "longitude": 11.5021876
      },
      "telephone": "+237690566836",
      "priceRange": "$$",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:30"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      ]
    };
    this.setJsonLd(schema, 'org-schema');
  }

  /**
   * Génère le schéma JSON-LD pour la FAQ
   */
  setFaqSchema(faqs: { question: string; answer: string }[]) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    this.setJsonLd(schema, 'faq-schema');
  }

  /**
   * Génère le schéma JSON-LD pour la Localisation (LocalBusiness)
   */
  setLocalBusinessSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Institut Beauty's Empire - Campus Tsinga & Nkoabang",
      "image": "https://ibe-yaounde.com/assets/img/ibe-ceremony.webp",
      "@id": "https://ibe-yaounde.com/#business",
      "url": "https://ibe-yaounde.com",
      "telephone": "+237690566836",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Entrée PMI Tsinga",
        "addressLocality": "Yaoundé",
        "addressRegion": "Centre",
        "addressCountry": "CM"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 3.8814715,
        "longitude": 11.5021876
      }
    };
    this.setJsonLd(schema, 'local-business-schema');
  }

  private setJsonLd(data: any, id: string) {
    const existingScript = this.document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }
    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}