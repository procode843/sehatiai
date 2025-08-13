
# Sehati — صحتي (Next.js UI-only)
**Project:** Sehati — Arabic-first AI-assisted hospital finder (UI-only prototype)  
**Team:** كودرز (Coders)  
**Date:** 12 August 2025  
**Repo:** Frontend (Next.js, TypeScript, v0, Tailwind, shadcn/ui)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features (UI-only)](#key-features-ui-only)
3. [Tech Stack & Libraries](#tech-stack--libraries)
4. [Getting Started — Local Development](#getting-started--local-development)
   - Prerequisites
   - Installation
   - Environment variables
   - Running the app
5. [Data & Mocks](#data--mocks)
8. [Design & UX Notes](#design--ux-notes)
9. [Accessibility (A11y)](#accessibility-a11y)
10. [Internationalization (Arabic / RTL)](#internationalization-arabic--rtl)
11. [AI Suggestions (Client-side Simulation)](#ai-suggestions-client-side-simulation)
12. [Map Integration & MockMap Fallback](#map-integration--mockmap-fallback)
13. [Export / Import Features](#export--import-features)
14. [Local Persistence](#local-persistence)
15. [Testing & Storybook](#testing--storybook)
16. [Performance & UX Optimizations](#performance--ux-optimizations)
17. [Security & Privacy Notes (UI-level)](#security--privacy-notes-ui-level)
18. [Deployment Notes](#deployment-notes)
19. [Roadmap & Next Steps](#roadmap--next-steps)
20. [Contributing](#contributing)
21. [License](#license)
22. [Acknowledgements & References](#acknowledgements--references)

---

## Project Overview
**Sehati (صحتي)** is an Arabic-first, UI-only Next.js prototype that demonstrates a modern home/search experience for finding hospitals and medical agencies. The prototype focuses on a polished, accessible, RTL Arabic interface that includes:
- Natural-language search (text + optional voice using Web Speech API)
- Client-side AI-like suggestions (simulated rule-based generator)
- Interactive map view (Google Maps client-side integration) with a MockMap fallback
- Synchronized map + list UX, hospital detail drawer, filters, favorites, and export/import features
- No backend or network server code — all data and behavior is client-side for prototyping and demo purposes

This repository contains the UI implementation, sample local data, and supporting utilities to run the prototype offline or with a client-side Google Maps API key.

> ⚠️ Important: This is a prototyping UI-only project. It is **not** a medical device, and does **not** perform any real medical triage. The AI suggestion logic is a conservative local simulation for demo only and should **never** be used as clinical advice.

---

## Key Features (UI-only)
- Fully Arabic UI with RTL layout and Arabic microcopy
- Search bar with natural text and optional voice input (Web Speech API)
- Instant client-side autosuggest and search filtering
- Client-side `generateAISuggestions()` stub that outputs recommended specialties and hospital rankings, plus evidence highlights
- Interactive Map with markers, clustering, info windows; MockMap fallback for no API key
- Responsive List ↔ Map synchronization (click list item → focus map; click marker → highlight list)
- Hospital detail drawer with extended info and UI-only actions (Call, Directions link, Request Ambulance modal)
- Emergency red-flag detection UI with prominent Arabic banner (configurable rules)
- Local persistence: favorites, last search, and drafts stored in `localStorage`
- Export to JSON & client-side generated PDF of search results or single hospital details
- Upload PDF/image preview (no OCR or network)
- Configurable demo dataset (`data/hospitals.sample.json`)

---

## Tech Stack & Libraries
- **Framework:** Next.js (React, TypeScript) — pages router or app router as preferred
- **Styling:** Tailwind CSS (utility-first), RTL aware
- **UI Components:** shadcn/ui (where applicable), headless UI primitives
- **Forms & Validation:** react-hook-form + zod (client-side validation)
- **Map:** Google Maps JavaScript SDK (client-side) OR `MockMap` SVG-based fallback
- **Voice Input:** Browser Web Speech API (feature-detect fallback)
- **PDF Export:** `pdf-lib` or `jspdf` client-side (sample code uses `pdf-lib` recommended)
- **Icons:** lucide-react or similar (RTL-aware)
- **Persistence:** localStorage (wrapper helper)
- **Development:** Vercel v0 scaffolding (optional), Storybook (optional)
- **Testing:** Jest + React Testing Library (unit), Playwright or Cypress (E2E mock flows)
- **Bundling / Linting:** ESLint, Prettier, TypeScript checks

---

## Getting Started — Local Development

### Prerequisites
- Node.js LTS (>= 18 recommended)
- npm (>= 9) or yarn/pnpm
- Optional: Google Maps JS API key for live maps (client-only use)

### Installation
```bash
git clone <your-repo-url>
cd sehati-frontend
npm install
# or
# yarn install
# pnpm install
```

### Environment variables
Create a `.env.local` in the project root (this repo will respect env var usage client-side for the Maps key). Do **not** commit secrets.

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_client_side_maps_api_key_here
NEXT_PUBLIC_MAPS_ENABLED=true
```
- If `NEXT_PUBLIC_MAPS_ENABLED` is `false` or the API key is missing, the app loads the `MockMap` fallback automatically.
- The README includes instructions for substituting a client-side API key; no server fetching is required.

### Running the app
```bash
npm run dev
# or
# yarn dev
# pnpm dev
```
Open `http://localhost:3000` to view the Home/Search page.

---

## Data & Mocks
- `data/hospitals.sample.json` — a local JSON file with at least 12 diverse hospital entries. Each entry includes:
  - `id`, `name_ar`, `name_en` (optional), `coords: { lat, lng }`, `specialties: string[]`, `rating: number`, `hours: { open, close, openNow }`, `phone`, `photos: string[]`, `capacityFlag`, `services: string[]`, `insurance: string[]`, `address_ar`, and other metadata.
- `src/lib/generateAISuggestions.ts` — conservative rule-based suggestion engine. It accepts a search query and optional user profile and returns:
  - Suggested specialties (Arabic), top-ranked hospitals (with score), and evidence highlights (which keywords matched).
- `src/lib/mockMap.tsx` — MockMap fallback component used if Maps API key not present.

All sample datasets are for UI/demo only.

---

## Design & UX Notes
- Arabic-first microcopy: use short, clear Arabic phrases and avoid transliteration
- RTL layout: ensure components and flexbox order are RTL-friendly (use `dir="rtl"` at root)
- Mobile-first: prioritize vertical flow; supporters panel collapses to bottom sheet on small screens
- Visual hierarchy: large search bar, then suggestions, filters, then map/list

**Color & Typography**:
- Use calm medical palette (teal/blue for primary, red for emergency, neutrals for background), but ensure contrast for accessibility
- Fonts: Noto Kufi Arabic, or Inter Arabic if available; set appropriate `line-height` and `font-size` for Arabic legibility

---

## Accessibility (A11y)
- WCAG AA compliance targets: color contrast, focus rings, keyboard navigation
- ARIA roles and labels on interactive controls, such as `aria-label` on search, `role="listbox"` for suggestions, and `aria-expanded` for drawers
- Map controls should include skip links and accessible descriptions for markers and info windows
- Provide text alternatives for icons and images (`alt` attributes in Arabic)
- Large touch targets (min 44x44 CSS pixels) for mobile accessibility

---

## Internationalization (Arabic / RTL)
- The app is Arabic-first but prepared for i18n by using a simple `i18n` key map in `src/i18n/ar.ts` and `src/i18n/en.ts`
- Root `<html dir="rtl" lang="ar">` should be set in `_document.js/tsx` or via `next/head`
- Ensure numeric values (dates, distances) are formatted for Arabic locales (use `Intl` APIs)

---

## AI Suggestions (Client-side Simulation)
- `generateAISuggestions(query, {conditions?, meds?, vitals?})` contains deterministic rules mapping Arabic keywords to specialties.
- Example rule: `/(ألم صدر|ضيق تنفس|انقطاع) -> Cardiology/Emergency` with scoring formula that weights keyword matches and severity tokens.
- The function returns:
  ```ts
  interface AISuggestion {
    title_ar: string;
    score: number; // 0-100
    reasons: string[]; // short Arabic bullets
    hospitalIds: string[]; // pre-ranked ids from sample dataset
  }
  ```
- For demo realism, the UI simulates latency (200–900ms) and shows skeleton loaders while computing suggestions.

---

## Map Integration & MockMap Fallback
- The project uses a lightweight wrapper `src/components/MapView/MapView.tsx` that:
  - Dynamically loads Google Maps JS SDK when `NEXT_PUBLIC_MAPS_ENABLED=true` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` provided
  - Otherwise renders `MockMap` that draws hospital pins on a responsive SVG map (not full map capabilities but ideal for offline demos)
- Keep the map logic isolated so that swapping map providers (Mapbox, OSM) is straightforward

---

## Export / Import Features
- **Export JSON:** Serializes current search/filter state or a selected hospital to a downloadable JSON file (client-side `Blob` + `URL.createObjectURL`)
- **Export PDF:** Uses `pdf-lib`/`jspdf` to render a printable, Arabic-formatted PDF snapshot of hospital details or a compact search result list (client-only)
- **Import JSON:** Allows loading a previously exported JSON bundle (client-side parsing and validation with `zod`)

---

## Local Persistence
- Wrapper `src/utils/localStorage.ts` abstracts get/set/remove and namespaced keys:
  - `sehati:favorites`, `sehati:lastSearch`, `sehati:contacts`, `sehati:datasetVersion`, `sehati:drafts`
- Autosave mechanism throttles writes (debounce) and shows last-saved timestamp
- Clear data option in Settings with user confirmation modal

---

## Testing & Storybook
- Unit tests for UI logic (e.g., `generateAISuggestions` rules, distance calculations, emergency detection rules)
- Component tests with React Testing Library for `SearchBar`, `FiltersPanel`, `ResultsList`, and `AISuggestionsPanel`
- Optional E2E integration tests (Playwright/Cypress) using the MockMap to assert map-list sync flows
- Storybook stories for major components assist designers and QA in isolation

---

## Performance & UX Optimizations
- Use virtualization for long results lists (`react-window`) to maintain smooth scrolling
- Progressive marker rendering and clustering to avoid DOM overload on dense datasets
- Debounce search input and throttle autosave to prevent UI thrashing
- Lazy-load images in detail drawer and use low-quality image placeholders (LQIP)

---

## Security & Privacy Notes (UI-level)
- Warn users about storing private medical data in localStorage — provide clear consent modal before saving sensitive data
- Provide an obvious and accessible “Delete my data” action that clears localStorage keys and confirms deletion
- Avoid logging sensitive data to console in production builds
- This UI-only prototype does not transmit any data to remote servers (unless a developer explicitly integrates backend later)

---

## Deployment Notes
- This UI can be deployed to Vercel, Netlify, or static hosting. Steps:
  1. Set `NEXT_PUBLIC_MAPS_ENABLED` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` if you want live maps (client-only).
  2. `npm run build` and `npm run start` or use platform auto-deploy configuration.
- For demo environments, keep `NEXT_PUBLIC_MAPS_ENABLED=false` to rely on `MockMap` for fully offline demos

---

## Roadmap & Next Steps
**Short-term (now)**
- Polish RTL microcopy and Arabic localization strings with medical translation review
- Add clinician-reviewed sample data labels for evidence accuracy
- Implement Storybook and a small test-suite

**Medium-term**
- Replace rule-based AI with a server-side model or fine-tuned lightweight model (with rigorous clinical validation)
- Integrate secure backend for persistence and booking integrations (hospital systems) with HIPAA/region compliance planning
- Add user account sync (encrypted storage)

**Long-term**
- Clinical trials and regulatory assessment for any decision-support features
- EHR integrations and certified interoperability (FHIR)

---

## Contributing
Contributions are welcome — see CONTRIBUTING.md for guidelines (create issues, PRs, code style rules).
Basic suggestions:
- Fork the repo and create feature branches
- Follow the ESLint + Prettier rules; run `npm run lint` and `npm run test` before PR
- Write tests for new features and update Storybook stories

---

## License
MIT License — see `LICENSE` file.

---

<<<<<<< HEAD
=======
>>>>>>> main
