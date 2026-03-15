# Frontiers Nuxt 3 Challenge

A SSR-first Nuxt 3 application demonstrating data fetching, TypeScript usage, and accessibility.

## Tech Stack
- **Framework**: Nuxt 3 (Vue 3, Vite, Nitro)
- **Language**: TypeScript
- **Utilities**: @vueuse/core
- **Data Source**: JSONPlaceholder (Posts & Users)

## Prerequisites
- **Node.js**: >= 18.x.x (Recommended: 20.x.x)
- **Package Manager**: npm, yarn, or pnpm

## Setup & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development Mode**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000/articles` to view the app.

3. **Production Build**
   ```bash
   npm run build
   npm run preview
   ```

## Key Features & Decisions

### SSR Strategy & Data Fetching
- **Server-Side Join**: The application fetches both `posts` and `users` from JSONPlaceholder and joins them on the server within the `useArticlesApi` composable. This provides a enriched data model (including author names) on the initial SSR render, avoiding secondary client-side fetches.
- **Dynamic Caching Keys**: `useAsyncData` uses a computed key that incorporates all search and pagination parameters (`q`, `author`, `page`, `pageSize`). This ensures that the server generates a unique payload for each specific view state, which is then hydrated correctly on the client.
- **URL-First State**: The URL is the single source of truth for the application state. All filters, search queries, and pagination parameters are synced with the route query, ensuring shareable links and consistent SSR output.

### TypeScript Integration
- **Strict Typing**: The project uses custom types defined in `types/article.ts` for all API responses and internal view models.
- **Typed Composables**: API logic and query management are encapsulated in typed composables (`useArticlesApi` and `useArticleQuery`), ensuring type safety across components.

### Accessibility & Markup
- **Semantic HTML**: Uses appropriate tags like `<main>`, `<header>`, `<article>`, `<section>`, and `<nav>`.
- **Accessible Forms**: Search and filter controls are wrapped in a `<form>` with properly linked `<label>` elements for screen readers.
- **Interactive States**: Pagination and loading states use ARIA attributes (`aria-label`, `aria-live`, `aria-current`) to improve the experience for assistive technologies.

## If I had more time...
1. **Testing**: Add unit tests for composables (Vitest) and E2E tests for the search/filter flows (Playwright).
2. **Focus Management**: Improve accessibility by automatically moving focus to the results container when pagination or filtering occurs.
3. **Skeleton Loading**: Implement skeleton screens for smoother transitions during client-side navigation.
4. **Error Boundaries**: Create more granular error states for specific API failures (e.g., individual user fetch failure).
5. **Caching**: Implement a more advanced server-side caching layer (e.g., using Nuxt's `server-only` caching) to reduce load on the public API.
