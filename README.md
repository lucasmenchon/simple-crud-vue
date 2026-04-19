# SCV - Simple Crud Vue

Modern Contacts CRUD built with:
- **Nuxt 4** (v4.4) / **Vue 3** (Composition API + `<script setup>`)
- **Tailwind CSS 4** with custom design system
- **Pinia 3** for state management
- **TypeScript** / **Dark mode** / **localStorage** persistence

> Looking for the original Vue 2 version? Check the [`feat/v1`](../../tree/feat/v1) branch.

## Features
- Dark/Light mode toggle
- Stats dashboard (total, favorites, avg age, filtered count)
- Real-time search across all fields
- Contact categories (Personal, Work, Family, Other)
- Favorite contacts with star toggle
- Email and Notes fields
- Sortable columns (click headers)
- Filters by gender, category, favorites
- Table view AND Grid/Card view toggle
- Export/Import contacts to/from JSON
- Delete all with confirmation modal
- Beautiful animated UI with transitions
- Fully responsive design
- Animated toast notifications

## Getting Started
```bash
bun install
bun run dev      # Development server
bun run build    # Production build
bun run preview  # Preview production build
```

## Documentation

- Product overview: `docs/overview.md`
- Technical architecture: `docs/architecture.md`
- Migration prompt (optional Nuxt -> Vite + React): `docs/migration-prompt.md`
