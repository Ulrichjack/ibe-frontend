---
name: context-governance
description: "OBLIGATOIRE AVANT de modifier: CLAUDE.md, AGENTS.md, AGENT.md, .claude/skills/*, .claude/hooks/*, docs/, README.md, ou créer un nouveau skill projet. Déclencheurs: « ajouter une règle », « documenter », « où mettre », « nouveau skill », modification de CLAUDE.md ou de la doc racine. NE PAS utiliser pour: écrire des composants Angular, des templates HTML ou du CSS."
---

# Gouvernance du contexte — IBE Frontend

## PRIMARY RESPONSIBILITY

Décider OÙ va chaque information documentaire, faire respecter le budget de `CLAUDE.md`
et le format des skills projet, pour que Claude, Codex et les autres agents partagent
le même contexte sans le voir enfler à chaque session.

## USE THIS SKILL WHEN

- On s'apprête à modifier `CLAUDE.md`, `AGENTS.md`, `AGENT.md`, un skill projet, un hook,
  `docs/` ou `README.md`.
- On hésite sur l'emplacement d'une nouvelle règle, convention ou information projet.
- On crée un nouveau skill projet (template obligatoire ci-dessous).

## DO NOT USE THIS SKILL WHEN

- On écrit un composant Angular, un service, un template ou du CSS (→ `CLAUDE.md` et
  `docs/design-system.md` suffisent).

## TRIGGERS

`CLAUDE.md`, `AGENTS.md`, `skill`, `documentation projet`, `règle`, `convention`,
`où mettre`, `gouvernance`, `docs/`.

## OWNED DIRECTORIES

- `CLAUDE.md`, `AGENTS.md`, `AGENT.md`, `README.md`
- `.claude/skills/`, `.claude/hooks/`, `.claude/settings.json`, `.claude/memory/`
- `docs/`

## REQUIRED DEPENDENCIES

- Hook `.claude/hooks/check-context-budget.sh` (déclaré dans `.claude/settings.json`) —
  applique le budget de `CLAUDE.md` automatiquement.
- Hook `.claude/hooks/sync-memory.sh` — sauvegarde la mémoire projet dans `.claude/memory/`
  (versionnée git) ; `restore` sur une nouvelle machine.

## RELATED DOCUMENTATION

- Mécanisme d'origine : repo `trafric-website`, `.claude/skills/context-governance/SKILL.md`.

---

## Budget

| Fichier | Budget | Application |
|---------|--------|-------------|
| `CLAUDE.md` | **120 lignes max** | Hook automatique — bloque tout dépassement |
| `MEMORY.md` (mémoire) | index d'une ligne par mémoire | Détail dans des fichiers thématiques |
| Un skill | ~120 lignes | Au-delà, scinder ou renvoyer vers `docs/` |

## Règles de placement — où va quoi

| Contenu | Emplacement |
|---------|-------------|
| Règle nécessaire à CHAQUE session (stack, secrets, commandes, conventions non négociables) | `CLAUDE.md` — compact |
| Tokens de design, palette, typographie, anatomie des composants UI | `docs/design-system.md` |
| Workflow déclenché par un TYPE de tâche (déploiement, migration, refonte) | Skill dans `.claude/skills/<nom>/` |
| Installation, fonctionnalités, déploiement, contexte métier long | `README.md` |
| Point d'entrée agents tiers | `AGENTS.md` / `AGENT.md` (pointeurs uniquement) |
| Fait de session non dérivable du repo | Mémoire projet (`~/.claude/projects/<slug>/memory/`) — jamais `CLAUDE.md` |

## Procédure OBLIGATOIRE avant de modifier CLAUDE.md

1. **Skill d'abord** : règle liée à un type de tâche ? → créer/enrichir le skill ;
   `CLAUDE.md` reçoit au plus 1 ligne dans « Workflows → Skills ».
2. **Référence ensuite** : donnée consultable ? → `docs/`.
3. **Lien enfin** : la ressource existe ? → pointer, ne pas dupliquer.
4. **CLAUDE.md en dernier recours** : seulement si nécessaire à chaque session,
   en 1-3 lignes, en condensant l'existant si le budget approche.

Toute modification de `CLAUDE.md` doit le laisser plus petit ou égal, sauf justification explicite.

## Template OBLIGATOIRE pour tout skill projet

Frontmatter : `name` + `description` au format machine :
`"OBLIGATOIRE pour: <périmètre>. Déclencheurs: <mots-clés>. NE PAS utiliser pour: <exclusions>."`

Sections, dans cet ordre, avant le contenu : `PRIMARY RESPONSIBILITY`, `USE THIS SKILL WHEN`,
`DO NOT USE THIS SKILL WHEN`, `TRIGGERS`, `OWNED DIRECTORIES`, `REQUIRED DEPENDENCIES`,
`OPTIONAL DEPENDENCIES`, `RELATED DOCUMENTATION`.

## Checklist avant commit documentaire

- [ ] `wc -l CLAUDE.md` ≤ 120 ; skills ≤ ~120 lignes.
- [ ] Une information = un propriétaire ; les autres fichiers pointent.
- [ ] Aucun secret (clé Cloudinary signée, mot de passe admin, token) dans un fichier versionné.
- [ ] Nouveaux skills conformes au template.

## Anti-patterns (interdits)

- Coller dans `CLAUDE.md` le détail d'une feature livrée (→ commit / CHANGELOG).
- Recopier une table ou un flow déjà documenté (→ lien).
- Documenter deux fois « pour être sûr » (→ une source, des pointeurs).
- Stocker un état temporaire dans `CLAUDE.md` (→ mémoire projet).
