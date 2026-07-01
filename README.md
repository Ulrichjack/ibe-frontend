# Institut Beauty's Empire — Frontend

> Site vitrine et espace d'administration de l'Institut Beauty's Empire (IBE)
> Formation professionnelle beauté certifiée MINEFOP — Yaoundé, Cameroun

---

## Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Stack technique](#stack-technique)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement local](#développement-local)
- [Build et déploiement](#build-et-déploiement)
- [Structure des dossiers](#structure-des-dossiers)
- [Conventions de code](#conventions-de-code)

---

## Aperçu du projet

IBE Frontend est l'interface web de l'Institut Beauty's Empire. Il couvre deux espaces distincts :

**Site public** — Catalogue de formations, galerie des réalisations, témoignages d'étudiantes, formulaires de contact et de pré-inscription avec confirmation WhatsApp.

**Espace admin** — Tableau de bord de gestion : messages entrants, formations, newsletter, galerie, témoignages.

### Capture d'écran

```
┌─────────────────────────────────────────┐
│        Institut Beauty's Empire         │
│    Formations Beauté à Yaoundé, CMR     │
│                                         │
│  [Découvrir nos formations]  [Contact]  │
│                                         │
│  500+ étudiantes  •  23 formations      │
│  10+ ans d'expérience  •  98% réussite  │
└─────────────────────────────────────────┘
```

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| **Angular** | 20 | Framework principal |
| **Tailwind CSS v4** | Latest | Styling (avec `@theme`) |
| **Lucide Angular** | Latest | Iconographie |
| **RxJS** | 7.x | Gestion des flux asynchrones |
| **Cloudinary** | Upload preset | Upload et CDN des images |

### Choix d'architecture Angular

- **Standalone components** — Zéro `NgModule`
- **Zoneless** (`provideZonelessChangeDetection`) — Meilleure performance
- **Signals** — `signal()`, `computed()`, `input()`, `output()` — Gestion d'état réactive
- **OnPush** sur tous les composants — Change detection optimisée
- **`@if` / `@for` / `@defer`** — Nouvelle syntaxe Angular 17+
- **`NoPreloading`** — Adapté au réseau 3G/4G camerounais
- **`LOCALE_ID: fr-FR`** + `registerLocaleData` — `DatePipe` en français natif
- **`provideCloudinaryLoader`** — `NgOptimizedImage` avec srcset automatique

---

## Fonctionnalités

### Site public
- **Page d'accueil** — Hero animé, compteurs au scroll (IntersectionObserver natif), formations populaires depuis l'API, galerie, témoignages, newsletter WhatsApp
- **Catalogue formations** — Liste paginée, recherche en temps réel (debounce 400ms), barre de progression social proof
- **Détail formation** — Galerie de photos avec miniatures, onglets (Programme / Objectifs / Matériel), CTA sticky mobile, sidebar desktop, infos paiement Mobile Money
- **Galerie** — Grille responsive, filtres par catégorie, lightbox custom Angular (navigation clavier + swipe mobile)
- **Pages secondaires** — À propos, FAQ accordéon, Localisation (Google Maps embed)
- **Modaux** — Pré-inscription et contact avec validation Reactive Forms, confirmation WhatsApp post-soumission

### Espace admin (`/admin`)
- **Dashboard** — Stats en temps réel, messages récents, alertes urgences
- **Formations** — CRUD complet, toggle actif/inactif, upload Cloudinary, aperçu en temps réel, filtres
- **Messages** — Split view (liste + détail), filtres (type/statut), changement de statut, bouton WhatsApp direct
- **Newsletter** — Liste abonnés, lien catalogue WhatsApp, marquage "contacté"
- **Galerie** — Upload avec FormData, suppression, grille admin
- **Témoignages** — Création, toggle publication, suppression

### WhatsApp-first
Toutes les conversions passent par WhatsApp. Après chaque soumission de formulaire, le backend retourne un `whatsappConfirmationLink` que l'utilisateur clique pour envoyer lui-même le message (anti-spam).

---

## Architecture

```
src/app/
├── core/
│   ├── config/
│   │   └── lucide-icons.config.ts    # Catalogue des icônes Lucide
│   ├── guards/
│   │   └── admin.guard.ts            # Protection routes admin
│   ├── interceptors/
│   │   └── auth.interceptor.ts       # Injection Basic Auth header
│   └── services/
│       ├── auth.service.ts           # Login, token en Signal (sessionStorage)
│       └── toast.service.ts          # Notifications globales
│
├── features/
│   ├── home/                         # Page d'accueil (SMART)
│   ├── formations/
│   │   ├── data-access/              # Service + modèles TypeScript
│   │   ├── formation-list/           # Liste paginée (SMART)
│   │   └── formation-detail/         # Page détail (SMART)
│   ├── messages/
│   │   └── ui/
│   │       ├── contact-modal/        # Modal contact (SMART)
│   │       └── inscription-modal/    # Modal pré-inscription (SMART)
│   ├── gallery/
│   │   └── gallery-page/             # Galerie + lightbox (SMART)
│   ├── about/                        # Page À propos
│   ├── faq/                          # FAQ accordéon
│   ├── location/                     # Page localisation
│   ├── testimonial/
│   │   └── data-access/              # Modèles témoignages
│   └── admin/
│       ├── admin.routes.ts           # Routes admin lazy-loaded
│       └── ui/
│           ├── admin-login/
│           ├── admin-layout/         # Sidebar + topbar mobile
│           ├── admin-dashboard/
│           ├── formations-admin/
│           ├── formation-create/     # Création / modification
│           ├── messages-admin/       # Split view messages
│           ├── newsletter-admin/
│           ├── testimonials-admin/
│           └── gallery-admin/
│
└── shared/
    ├── models/
    │   ├── api-response.model.ts     # ApiResponse<T>, PageResponse<T>
    │   ├── gallery.model.ts
    │   └── newsletter.model.ts
    ├── pipes/
    │   └── currency-fcfa.pipe.ts     # Formatage FCFA
    ├── services/
    │   ├── formation.service.ts
    │   ├── message.service.ts
    │   ├── gallery.service.ts
    │   ├── newsletter.service.ts
    │   └── testimonial.service.ts
    └── ui/
        ├── header/                   # Navigation + menu mobile hamburger
        ├── footer/                   # 4 colonnes desktop / accordéon mobile
        ├── whatsapp-bubble/          # Bulle flottante fixe bas-droite
        ├── toast/                    # Notifications (success/error/warning/info)
        └── not-found/                # Page 404
```

### Pattern Smart / Dumb

Tous les composants suivent cette règle strictement :

**Smart** — Injecte des services, gère `ngOnInit`, charge les données, passe en `input()` aux enfants.
**Dumb** — Zéro `inject()`, uniquement `input()` et `output()`, `ChangeDetectionStrategy.OnPush`.

---

## Prérequis

```
Node.js   >= 18.x
npm       >= 9.x
Angular CLI >= 20.x
```

Le backend Spring Boot doit être démarré avant de lancer le frontend (voir `README` du repo backend).

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/<organisation>/ibe-frontend.git
cd ibe-frontend

# Installer les dépendances
npm install

# Vérifier la version Angular CLI
ng version
```

---

## Configuration

### Variables d'environnement

Les paramètres d'environnement sont dans `src/environments/`.

```
src/environments/
├── environment.ts           # Développement local
├── environment.staging.ts   # Staging (Render + Vercel)
└── environment.prod.ts      # Production (VPS)
```

```typescript
// environment.ts — exemple
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  actuatorUrl: 'http://localhost:8080/actuator/health',
  whatsappNumber: '237690000000',         // Numéro WhatsApp IBE
  whatsappMessage: "Bonjour IBE ! ...",
  cloudinaryCloudName: 'VOTRE_CLOUD_NAME',
  cloudinaryUploadPreset: 'VOTRE_PRESET', // Preset Cloudinary (unsigned)
};
```

> **⚠️ Important** : Ne jamais committer de vraies clés ou numéros sensibles. Utiliser des valeurs de test en local.

### Tailwind CSS v4

La palette et les tokens de design sont définis dans `src/styles.css` via la directive `@theme` :

```css
@import "tailwindcss";

@theme {
  --color-ibe-500: #9B5FC0;   /* Couleur signature (logo) */
  --color-ibe-600: #7E48A3;   /* CTA, liens actifs */
  --color-ibe-800: #472566;   /* Sidebar admin, footer */
  --color-ibe-wa:  #25D366;   /* EXCLUSIF WhatsApp — jamais utilisé ailleurs */
  /* ... */
}
```

---

## Développement local

```bash
# Démarrer le serveur de développement
ng serve

# L'application est accessible sur
http://localhost:4200
```

Le backend doit tourner sur `http://localhost:8080`. Voir le `README` du repo backend pour le démarrer via Docker Compose.

### Commandes utiles

```bash
# Générer un composant standalone avec OnPush
ng g c features/ma-feature/ui/mon-composant --standalone --change-detection OnPush

# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Lancer les tests
ng test

# Analyser le bundle
ng build --stats-json && npx webpack-bundle-analyzer dist/stats.json
```

---

## Build et déploiement

### Staging — Vercel

```bash
# Build staging
ng build --configuration staging

# vercel.json (déjà présent à la racine)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Connecter le dépôt à Vercel. Build command : `ng build --configuration staging`. Output : `dist/ibe-frontend/browser`.

### Production — VPS (Nginx)

```bash
# Build production
ng build --configuration production

# Copier le build vers le VPS
scp -r dist/ibe-frontend/browser/* user@vps:/var/www/ibe-frontend/browser/
```

La configuration Nginx est gérée par le repo backend (reverse proxy + SSL Certbot).

---

## Structure des dossiers — Vue rapide

```
ibe-frontend/
├── src/
│   ├── app/                  # Code source Angular
│   ├── assets/
│   │   └── img/              # Logo, photos campus, partenaires
│   └── environments/         # Configuration par environnement
├── angular.json              # Configuration Angular CLI
├── tailwind.config.js        # Palette + tokens (si v3) / @theme (si v4)
├── tsconfig.json
├── vercel.json               # Redirection SPA pour Vercel
└── README.md
```

---

## Conventions de code

### Langue
- Code (variables, méthodes, classes) : **anglais**
- Templates HTML, labels, messages utilisateur : **français**
- Commentaires dans le code : **français**

### Signals Angular
```typescript
// ✅ Bon — signal pour l'état local
formations = signal<FormationResponse[]>([]);
isLoading  = signal(true);

// ✅ Bon — computed pour les dérivés
filteredFormations = computed(() =>
  this.formations().filter(f => f.active)
);

// ❌ Éviter — BehaviorSubject si un signal suffit
```

### Responsive
```css
/* ✅ Mobile-first OBLIGATOIRE */
.element { /* styles mobile par défaut */ }
@media (min-width: 768px) { .element { /* tablet */ } }
@media (min-width: 1024px) { .element { /* desktop */ } }

/* ❌ Ne jamais faire */
@media (max-width: 768px) { .element { /* mobile en override */ } }
```

### Touch targets
Tous les éléments cliquables : minimum **48×48px**. La bulle WhatsApp : **56×56px**.
Tous les `<input>` : `font-size: 16px` minimum (évite le zoom automatique iOS Safari).

### Git

```
main            ← Production uniquement
  └── develop   ← Intégration
        ├── feature/frontend-setup-tailwind
        ├── feature/frontend-home
        ├── feature/frontend-formations
        ├── feature/frontend-messages-modals
        ├── feature/frontend-admin
        └── feature/frontend-pages-secondaires
```

Messages de commit :
```
feat: ajouter la page galerie avec lightbox custom
fix: corriger le bug ApiResponse success vs status
style: ajuster le CTA sticky mobile sur formation-detail
refactor: extraire la logique de pagination dans un composant dumb
```

---

## Contexte projet

**Institut Beauty's Empire (IBE)** est un institut de formation professionnelle beauté situé à Yaoundé, Cameroun. Il propose 23 formations certifiées MINEFOP dans les spécialités esthétique, coiffure, make-up et cosmétiques.

Le site est **WhatsApp-first** : l'audience camerounaise utilise principalement WhatsApp pour communiquer. Toutes les conversions (formulaire de contact, pré-inscription, newsletter) génèrent un lien `wa.me/` que l'utilisateur clique pour ouvrir WhatsApp avec un message pré-rempli — sans envoi automatique depuis le serveur.

Le site cible principalement des **appareils mobiles Android mid-range** (Samsung Galaxy A-series, Tecno, Infinix) sur connexion **3G/4G** — d'où le choix de `NoPreloading`, les images optimisées Cloudinary, et les skeleton loaders sur toutes les sections asynchrones.

---

*Frontend IBE — Angular 20 · Tailwind CSS v4 · Yaoundé, Cameroun*