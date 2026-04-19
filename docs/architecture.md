# Architecture

## Stack

- Nuxt 4
- Vue 3 (Composition API)
- TypeScript
- Tailwind CSS 4
- Pinia

## Main Directories

- `pages`: route pages
- `components`: reusable UI
- `stores`: global state and derived selectors
- `composables`: shared logic hooks
- `types`: DTO/domain typing
- `shared`: constants/helpers

## Data Strategy

Current implementation relies on browser persistence (localStorage) and in-memory state hydration via Pinia.
