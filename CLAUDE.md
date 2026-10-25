# IBE Frontend — Contexte projet

Site vitrine + espace admin de l'**Institut Beauty's Empire** (formations professionnelles :
beauté, informatique, élevage et autres filières à Yaoundé — Cameroun). Public cible : mobiles Android mid-range
sur 3G/4G. Toutes les conversions passent par **WhatsApp**.

## Stack

Angular 20 (standalone, **zoneless**, signals, OnPush partout) · Tailwind CSS v4 via
`@theme` dans `src/styles.css` · `@lucide/angular` · Cloudinary (CDN images) ·
backend Spring Boot séparé (`environment.apiUrl`) · déploiement Vercel (`vercel.json`).

## Architecture

```
src/app/
  core/       config (icônes Lucide) · guards (admin) · interceptors (Basic Auth) · services (auth, toast, seo)
  features/   home · formations (list/detail + data-access) · gallery · about · faq · location
              messages (modals contact + inscription) · testimonial · admin (routes lazy + ui/)
  shared/     models · pipes (currency-fcfa, cloudinary-optimize) · services (API) · ui (header, footer, toast, whatsapp-bubble, 404)
```

`app.html` bascule entre coquille publique (header/footer/bulle WA) et coquille admin
selon `isAdminRoute()`. Toutes les routes sont lazy (`loadComponent` / `loadChildren`),
`NoPreloading` assumé pour le réseau camerounais.

## Règles CRITIQUES

- **Aucun secret versionné.** `src/environments/*.ts` est traqué par git : il ne doit
  contenir que des valeurs **publiques** (URL API, numéro WhatsApp public, cloud name,
  upload preset *unsigned*). Jamais de clé API Cloudinary signée, de mot de passe admin
  ni de token. Le login admin passe par Basic Auth → `auth.interceptor.ts`, token en
  `sessionStorage` uniquement.
- **Design tokens seulement.** Les couleurs viennent exclusivement de `@theme`
  (`ibe-50…ibe-900`, `ibe-dark`, `ibe-muted`, `ibe-wa`, `ibe-success/warning/danger`).
  Jamais de hex en dur dans un template, jamais de `#000` (utiliser `ibe-dark`).
  `ibe-wa` est **exclusif à WhatsApp**.
- **Espacement ×8** (`s1`=8px … `s8`=64px) et rayons `sm/md/lg/xl/pill` du `@theme`.
- **Mobile-first strict** : styles mobile par défaut, puis `min-width`. Jamais de
  `max-width` en override.
- **Accessibilité tactile** : tout élément cliquable ≥ 48×48px, bulle WhatsApp 56×56px,
  tout `<input>` en `font-size: 16px` (sinon zoom auto iOS Safari).
- **Performance** : `loading="lazy"` + `width`/`height` explicites sur toute image
  non-LCP, `skeleton` aux mêmes dimensions que le contenu réel (zéro CLS), images
  distantes via le pipe `cloudinaryOptimize`.
- **Angular moderne** : `signal()` / `computed()` / `input()` / `output()`,
  `@if` / `@for` / `@defer`. Pas de `NgModule`, pas de `BehaviorSubject` si un signal
  suffit, pas de `*ngIf` / `*ngFor`.
- **Langue** : code en anglais, textes utilisateur et commentaires en français.

## Commandes

```bash
npm start                      # ng serve → http://localhost:4200 (backend attendu sur :8080)
npm run build                  # build production (fileReplacements → environment.prod.ts)
npx ng build --configuration development
npx tsc --noEmit               # vérification TypeScript
npm test                       # Karma + Jasmine
```

Budgets de build : 500 kB initial (warning) / 1 MB (erreur), 40 kB par style de composant.

## Workflows → Skills

| Situation | Ressource |
|---|---|
| Modifier `CLAUDE.md`, `AGENTS.md`, `docs/`, un skill ou un hook | `.claude/skills/context-governance/SKILL.md` |
| Design système, palette, typographie, refonte visuelle | `docs/design-system.md` |
| Détail fonctionnel, installation, déploiement | `README.md` |

## Pointeurs

- Point d'entrée agents tiers : `AGENTS.md` / `AGENT.md`
- Mémoire projet (faits de session) : `~/.claude/projects/-media-jack-MonHDD-CODE-ibe-frontend/memory/`,
  sauvegardée dans `.claude/memory/` par le hook `sync-memory.sh`.
