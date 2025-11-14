# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Stack: Vite + React + TypeScript + Tailwind CSS + shadcn/ui, React Router, TanStack Query, Firebase (Auth + Firestore), optional Google GenAI.
- Entry: src/main.tsx mounts App; src/App.tsx wires providers and routes.
- Path alias: "@/*" -> "./src/*" via tsconfig and Vite alias.

Common commands
- Install deps: npm i
- Start dev server (Vite on port 8080): npm run dev
- Build (prod): npm run build
- Build (development mode): npm run build:dev
- Preview built app: npm run preview
- Lint: npm run lint
- Tests: no test runner is configured in this repo.

Architecture and flow
- App scaffolding (src/App.tsx)
  - Providers: TanStack Query (QueryClientProvider), shadcn Toasters (Toast/Sonner), TooltipProvider.
  - Router: BrowserRouter with routes
    - "/" -> src/pages/Index.tsx (acts as shell: shows HomePage for guests, AuthPage when "?auth=1", and a dashboard experience when authenticated)
    - "/counseling" and "/User" are gated: if no user, redirect to Index; otherwise render CounselingPage or UserRecord (some functionality merged into DashboardHome).
    - "*" -> NotFound.
- Auth and data (src/firebase.ts)
  - Initializes Firebase app; exports auth and Firestore db.
  - Sets browserLocalPersistence; onAuthStateChanged used in App and pages to derive user.
  - Firestore usage concentrates on the "users" collection storing profile fields: { uid, email, name, disease, requiresDiagnostic, createdAt, updatedAt } with serverTimestamp().
- Page shell and navigation
  - src/pages/Index.tsx owns the logged-in app shell, tracks activeSection (home/chat/resources/forum), and renders the corresponding feature component; includes a persistent mobile bottom and desktop top Navigation.
  - src/components/Navigation.tsx renders mobile bottom nav + desktop top nav; includes an always-visible EmergencyButton and optional Logout.
- Core features
  - Dashboard and diagnostic (src/components/DashboardHome.tsx)
    - Landing + feature cards + sidebar cards.
    - Merged diagnostic flow: 5-question MCQ; computeDisease maps answers to "Depression"/"Anxiety"/"Stress" via weighted scoring, then persists to Firestore (users/{uid}) with requiresDiagnostic=false.
    - Merged counseling preview: in-component curated list of counselors and sample sessions; selection state is local only.
  - User record (src/components/UserRecord.tsx)
    - Similar diagnostic logic; initializes a user profile doc if missing; shows stats, assessments, and upcoming items. Some UI/logic overlaps with DashboardHome; Index routes can still reach this screen directly.
  - AI chat (src/components/ChatPage.tsx)
    - Simple message loop; calls Google GenAI client-side using a constant GEMINI_API_KEY; returns a single-turn response; shows typing indicator and basic crisis toast when isEmergency is flagged.
    - To change the key or disable the feature, edit the GEMINI_API_KEY constant and related usage in ChatPage.
  - Resources (src/components/ResourcesPage.tsx)
    - Static catalog of resources (articles, audio, video) with search and category filters; external links open in a new tab; notes a future backend for secure content delivery.
  - Community (src/components/ForumPage.tsx)
    - In-memory anonymous posts/replies; UI demonstrates intended behavior; real-time backend not wired yet.
- UI system
  - shadcn/ui components live under src/components/ui/*, styled via Tailwind with theme tokens from tailwind.config.ts.
  - Global styles in src/index.css; Tailwind plugins configured in postcss.config.js and tailwind.config.ts.

Conventions and config
- Vite dev server listens on port 8080 (vite.config.ts). If port is occupied, pass --port to override: vite --port 3000.
- ESLint configured with typescript-eslint and React rules (eslint.config.js); TS is intentionally not strict in app config (see tsconfig.app.json); path aliases also set in tsconfig.json.
- Assets are under src/assets, with alias import (e.g., import hero from "@/assets/...").

Environment and external services
- Firebase config is defined inline in src/firebase.ts and used client-side for Auth and Firestore; no .env file is required for current setup.
- Google GenAI (Gemini) is used client-side in ChatPage via a hardcoded GEMINI_API_KEY constant; update src/components/ChatPage.tsx to change or remove this behavior.

Notes from README.md
- Tech stack matches the above; local dev is: npm i && npm run dev. The project originated from Lovable; publishing via Lovable is referenced in README.
