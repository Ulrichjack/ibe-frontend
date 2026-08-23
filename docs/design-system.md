# Système de design — IBE

Source de vérité : `src/styles.css`. Ce document explique les intentions ;
les valeurs, elles, ne vivent qu'à un seul endroit, le bloc `@theme`.

## Direction

L'institut enseigne la couleur. La marque se présente donc comme **un nuancier** :
la palette violette d'IBE est traitée comme une palette de maquillage, avec ses pavés
de couleur pleins. C'est l'élément signature, et le seul endroit où le design hausse
la voix. Tout le reste — grilles, filets, typographie — reste sobre.

Registre visuel : magazine de beauté, pas plaquette d'école. Titres en sérif éditoriale,
mises en page asymétriques, filets fins plutôt qu'ombres portées.

## Couleur

La palette violette est **figée** : c'est l'identité de la marque, elle ne se renégocie pas.
Aucune teinte nouvelle, aucun hexadécimal en dur dans un template — uniquement les tokens
`ibe-*` déclarés dans `@theme`.

| Rôle | Token |
|---|---|
| Fond de page | `ibe-50` |
| Fonds de section clairs, badges | `ibe-100` |
| Filets, bordures | `ibe-200` |
| Icônes secondaires, texte sur fond sombre | `ibe-300` / `ibe-400` |
| Couleur du logo, pavés de nuancier | `ibe-500` |
| Boutons, liens, page active | `ibe-600` (survol : `ibe-700`) |
| Aplats sombres, footer, hero | `ibe-800` / `ibe-900` |
| Texte principal | `ibe-dark` — **jamais `#000`** |
| Texte secondaire | `ibe-muted` |
| WhatsApp | `ibe-wa` — **exclusif à WhatsApp**, jamais un vert décoratif |

## Typographie

Deux familles, deux rôles nets.

**Instrument Serif** (`font-serif`) — display. Une seule graisse existe : **400**.
Ne jamais lui appliquer `font-bold` ou `font-semibold` : le navigateur fabriquerait un
faux gras. Le contraste vient de la taille.

**Inter** (`font-sans`) — tout le reste : corps, boutons, formulaires, données, `h3`,
et l'intégralité de l'espace admin.

### Règle des 24px

La sérif à fort contraste se dégrade sur les écrans Android d'entrée de gamme visés par
le site. **En dessous de ~24px, on passe à Inter.** Conséquences appliquées dans le code :

- `h1`, `h2` → sérif. `h3` → Inter semibold.
- Prix, compteurs, quantités → Inter + `tabular-nums`, via `.figure-ibe`. Jamais la sérif :
  la règle vaut aussi pour les grands chiffres, où la sérif serait pourtant tentante.
- Libellés admin, tableaux, badges → Inter.
- Exception admise : une initiale d'avatar isolée, où la lisibilité n'est pas en jeu.

### Exergues et libellés

`0.6875rem`, semibold, majuscules, `letter-spacing: 0.18em`. C'est la troisième « voix »
typographique — obtenue sans troisième fichier de police.

## Composants signature

### `.eyebrow`

Exergue de section. Le pavé de nuancier est intégré en `::before` : aucun markup
supplémentaire dans les templates. Variante `.eyebrow--light` sur fond sombre.

```html
<p class="eyebrow">Le catalogue</p>
<p class="eyebrow eyebrow--light">Après la formation</p>
```

### `.masthead`

Bandeau de section : titre à gauche, chapeau à droite (`.masthead-lede`), empilés en
mobile. Remplace le titre centré générique et donne à toutes les sections la même ligne
d'horizon.

```html
<div class="masthead">
  <div>
    <p class="eyebrow">Le catalogue</p>
    <h2>Les formations les plus demandées</h2>
  </div>
  <p class="masthead-lede">Une phrase de contexte.</p>
</div>
```

### `.palette` / `.palette-chip`

Le nuancier des spécialités, sous le hero. Quatre pavés `ibe-500` → `ibe-800`, révélés
en cascade au chargement. Chaque pavé ouvre le catalogue filtré (`/formations?q=…`) :
la signature fait un vrai travail de navigation, elle ne décore pas.

Les couleurs sont portées par les modificateurs `.palette-chip--1` à `--4`, jamais par
le template.

## Structure

- Conteneur : `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Rythme vertical des sections : `py-20 lg:py-28`.
- Espacement interne : échelle ×8 (`s1`=8 … `s8`=64).
- **Filets plutôt qu'ombres.** `border-ibe-200` en séparateur ; les ombres sont réservées
  aux éléments réellement flottants (nuancier, barre de recherche, modales).
- Une ombre porte une couleur : elle passe donc par un token, jamais par un `rgba()`
  écrit dans un template — `shadow-ibe-float` (au-dessus d'un aplat sombre),
  `shadow-ibe-raised` (barre de recherche, toasts), `shadow-ibe-card` (cartes au survol),
  `shadow-ibe-wa` (bulle WhatsApp).
- Les repères numérotés (01 / 02 / 03) ne s'emploient que si le contenu est réellement
  une séquence. Deux campus ne le sont pas — ils portent une icône de lieu.
- Pas de carrousel quand tout tient à l'écran : cinq logos partenaires se posent en
  ligne centrée qui passe à la ligne. Un carrousel n'a de sens que s'il a quelque chose
  à arbitrer.

## Plancher de qualité

Non négociable, vérifié à chaque écran :

- **Cible tactile ≥ 48×48px** sur tout élément cliquable (56px pour la bulle WhatsApp).
- **`font-size: 16px` minimum** sur les `<input>` — en dessous, iOS Safari zoome au focus.
- **Focus clavier visible** partout : géré globalement par `:focus-visible` dans `@layer base`.
  `.on-dark` sur une section sombre bascule le liseré en blanc.
- **`prefers-reduced-motion`** respecté globalement.
- **Zéro CLS** : `width`/`height` explicites sur les images, skeletons aux dimensions
  exactes du contenu réel, largeur réservée sur les compteurs animés.
- **Mobile-first** : styles mobile par défaut, puis `min-width`. Jamais de `max-width`
  en override.

## Budget de police

4 fichiers Inter (400/500/600/700) + 2 fichiers Instrument Serif (400 + italique).
Poppins a été retiré : la display sérif reprend son rôle avec deux fichiers de moins.
Avant d'ajouter une police, se demander si un poids ou une variante existante suffit.
