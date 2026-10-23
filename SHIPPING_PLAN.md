# Tahan (formerly BalayCapiz) — Cross-Platform Production & Shipping Roadmap

**Brand Name:** **Tahan** *(formerly BalayCapiz — rebranded for nationwide scalability across Philippine university towns, with Roxas City, Capiz as the flagship launch market)*  
**Live Production Domain:** `https://tahan.cheyngadgets.site` (Hosted on Vercel, connected to GitHub CI/CD)  
**Target Platforms:** Web / PWA (`https://tahan.cheyngadgets.site`), Android (`.apk` / `.aab`), iOS (App Store / TestFlight), Desktop (Optional Tauri v2)  
**Flagship Pilot Market:** Hercor College (Lawaan & Riverside), CapSU Main, and Filamer Christian University in Roxas City, Capiz.

---

## 1. Live Progress & Milestone Tracker

| Milestone | Owner | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Phase 1: Capacitor & PWA Configuration** | Agent + User | **Completed** | `capacitor.config.ts`, `vite.config.ts`, Workbox offline tile/API caching configured. |
| **Phase 2: Supabase Schema & Hybrid Client** | Agent | **Completed** | `001_initial_schema.sql`, REST/Storage client, and `seed_supabase.ts` ready. |
| **Phase 3: Native Hardware Bridge & Manifests** | Agent | **Completed** | GPS proximity, native share, and Android 11+ `tel:`/`sms:` intent queries configured. |
| **Phase 4: Production Build & Android APK** | Agent + User | **Completed** | Vite 8 Rolldown build + JDK 21 Gradle build succeeded (`app-debug.apk` / 9.2 MB). |
| **Phase 5: GitHub Repo & Vercel Custom Domain** | User | **Completed** | Connected to GitHub and deployed live at `https://tahan.cheyngadgets.site`. |
| **Phase 6: Nationwide Rebrand to "Tahan"** | Agent + User | **Completed** | Unified brand across web, PWA manifest, Capacitor config, and Regional Hub selector. |
| **Phase 7: Professional UI/UX & Functional Overhaul** | Agent + User | **Completed** | Real file inputs with pitch demo helpers, Host Portal verification gate, URL deep linking, and de-vibed copy. |

---

## 2. Responsibilities Matrix

```
┌────────────────────────────────────────┬────────────────────────────────────────┐
│            AI Agent Tasks              │               User Tasks               │
│        (Code, Configs & Schemas)       │       (Accounts, Devices & Local SDKs) │
├────────────────────────────────────────┼────────────────────────────────────────┤
│ • Full codebase rebrand to "Tahan"     │ • Push updated commits to GitHub       │
│ • UI/UX overhaul (real file inputs,    │ • Create Supabase project & provide key│
│   Host Gate, clean copy, URL routing)  │ • Test APK on physical Android phones  │
│ • Capacitor setup & native bridge cfg  │ • Generate private keystore & passwords│
│ • Supabase schema, RLS & migration SQL │ • Register Google Play / Apple accounts│
│ • App Store metadata & privacy policy  │ • Field survey of 20–30 Roxas rentals  │
└────────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 3. Completed Implementation Phases (Phases 1–7)

### Phase 1: Native Mobile Wrapper & PWA Hardening (Completed)
* Configured Capacitor native runtime (`capacitor.config.ts`) and Android Gradle project (`android/`).
* Configured Workbox offline caching for OpenStreetMap tiles and Supabase REST endpoints in `vite.config.ts`.
* Resolved Vite 8 Rolldown `manualChunks` function signature and `esbuild` peer dependency conflict.

### Phase 2: Cloud Backend, Database & Storage Schema (Completed — Ready for Credentials)
* Created `supabase/migrations/001_initial_schema.sql` with tables for `campuses`, `listings`, `tenant_reviews`, and `scheduled_visits`, plus Row-Level Security (RLS) and Storage buckets (`property-photos`, `verification-docs`).
* Built zero-dependency hybrid cloud/local client (`src/lib/supabaseClient.ts` & `src/services/housingService.ts`) and CLI seeder (`scripts/seed_supabase.ts`).

### Phase 3: Hardware Integrations & Native Permissions (Completed)
* Configured `android/app/src/main/AndroidManifest.xml` with `ACCESS_FINE_LOCATION`, `CAMERA`, `READ_MEDIA_IMAGES`, and Android 11+ `<queries>` for `tel:`, `sms:`, and `geo:`.
* Added `src/utils/nativeBridge.ts` for GPS campus distance calculation and native sharing.

### Phase 4: Production Builds & Android APK Compilation (Completed)
* Patched `android/gradlew` to automatically select JDK 21 LTS over incompatible Java 25 (`major version 69`).
* Compiled installable Android package (`android/app/build/outputs/apk/debug/app-debug.apk` — 9.2 MB).

### Phase 5: GitHub Version Control & Vercel Custom Subdomain (Completed)
* Connected repository to GitHub for version control.
* Deployed live production web app on Vercel under custom subdomain: `https://tahan.cheyngadgets.site`.

### Phase 6: Nationwide Rebrand to "Tahan" & Multi-City Architecture (Completed)
* Rebranded app title, headers, PWA manifest (`manifest.webmanifest`), `capacitor.config.ts`, legal docs, and QR poster to **Tahan** (`https://tahan.cheyngadgets.site`).
* Added **Regional Hub Switcher** (`REGIONAL_HUBS` in `src/data/roxasHousingData.ts`) featuring **Roxas City, Capiz (Active Pilot — CAPELCO ₱11.42/kWh)** alongside nationwide expansion hubs (**Iloilo City — MORE Power ₱10.85/kWh**, **Bacolod City — Negros Power ₱11.10/kWh**, and **Metro Manila U-Belt — Meralco ₱11.85/kWh**).

### Phase 7: Production UX & Functional Overhaul (Completed)
* **Real File Pickers + Competition Demo Mode**: Replaced fake 1-click upload boxes in `ListingDetailModal.tsx` and `LandlordPortalView.tsx` with real `<input type="file" accept="image/*,.pdf" />` uploaders (with image thumbnail previews and file size readouts) plus a subtle *"Use sample for pitch demo"* button for live presentations.
* **Host Portal Verification Gate**: Separated student browsing from property management by gating the **Host Portal** behind a landlord sign-in screen (with a 1-click *"Enter Demo Host Session"* link for competition evaluators).
* **Shareable URL Deep Links & Browser History**: Synchronized `?room=...` and `?tab=...` query parameters with `window.history.pushState` and `popstate` so links shared from `https://tahan.cheyngadgets.site` open that exact property.
* **De-Vibed Typography & Dynamic Timestamps**: Removed robotic numbered headers (`01.`, `02.`, `VIEW 01`), stripped out developer stack jargon (`Leaflet.js`, `Service Worker Active`), and replaced hardcoded date strings with dynamic `Intl.DateTimeFormat` dates.
