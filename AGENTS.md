# AGENTS.md — IBE Frontend

Point d'entrée pour Codex et tout agent IA tiers.

**Toutes les règles du projet vivent dans [`CLAUDE.md`](./CLAUDE.md).** Le lire en entier
avant toute modification. Ce fichier ne duplique aucune règle — il ne fait que pointer.

## À lire dans cet ordre

1. [`CLAUDE.md`](./CLAUDE.md) — stack, architecture, règles critiques, commandes.
2. [`docs/design-system.md`](./docs/design-system.md) — tokens, palette, typographie, composants UI.
3. [`README.md`](./README.md) — installation, fonctionnalités, déploiement.

## Avant de toucher à la documentation

Lire [`.claude/skills/context-governance/SKILL.md`](./.claude/skills/context-governance/SKILL.md) :
il décide où va chaque information et applique le budget de `CLAUDE.md` (120 lignes, hook bloquant).
