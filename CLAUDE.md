# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

There are no test commands — the project has no test suite.

To reset all presentation data during development, run `localStorage.clear()` in the browser console.

## Architecture

React 19 + TypeScript SPA built with Vite. Routing via React Router DOM. No backend — all persistence uses `localStorage`.

### Application Routes

| Path | Description |
|------|-------------|
| `/` | Home / navigation hub |
| `/pizza` | Pizza drag-and-drop fraction simulator |
| `/fracciones` | Slide-based educational presentation |
| `/escalera` | Fraction ordering staircase game |
| `/don-fraccion` | Fraction-based shop simulator |
| `/admin/presentations` | Presentation management (requires auth) |

### Presentation System

The most complex subsystem. Three storage keys are used in localStorage:
- `presentation_data` — presentation and slide content
- `presentation_settings` — display configuration
- `presentation_stats` — usage tracking

Data flow: `PresentationService` (CRUD, async/await over localStorage) → `usePresentation` hook (state + navigation) → `SlideDeck` / `PresentationAdmin` components.

`SlideDeck` supports two modes:
```tsx
<SlideDeck />                                           // legacy static mode
<SlideDeck enableDatabase={true} presentationId="..." /> // DB mode
```

`MigrationHelper` (`src/utils/migrationHelper.ts`) converts legacy static slide data into the `Presentation` schema on first load.

### Admin Authentication

Implemented entirely client-side via `useAdminPermissions` hook. Session state is stored in `localStorage` keys `admin_session` and `admin_mode`.

- Dev credentials: username `Administrador`, password `admin123`
- In development mode (`import.meta.env.MODE === 'development'`), any password is accepted

This is a toy auth system — there is no real backend validation.

### Layout and Permissions

`<Layout showAdminAccess={true}>` renders a floating admin access button on educational pages. The admin panel at `/admin/presentations` uses `PresentationAdminPage` → `AdminAuth` → `PresentationAdmin` component chain.

### Key Libraries

- **Fraction.js** — precise fractional arithmetic
- **React DnD** — drag-and-drop in pizza and staircase simulators
- **Framer Motion** — page and element animations
- **Lottie React** — JSON-based animations in presentation slides
- **Canvas Confetti** — celebration effects
