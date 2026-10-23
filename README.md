# BalayCapiz — Roxas City Student Housing Portal

**BalayCapiz** (`ph.edu.hercor.balaycapiz`) is an offline-ready, cross-platform civic-tech student boarding house and dormitory discovery application built for **Hercor College (Lawaan & Riverside)**, **Capiz State University (CapSU Main)**, and **Filamer Christian University** in Roxas City, Capiz.

## Core Features
* **CAPELCO Rate Transparency:** Compare each property's declared and student-reported electricity rate against the official CAPELCO residential baseline (`₱11.42/kWh`) and calculate personalized monthly appliance bills.
* **BFP Fire Safety & Flood Elevation:** Filter boarding houses across Lawaan, Fuentes Drive, Tiza, Banica, and Roxas Avenue by Bureau of Fire Protection (BFP) Fire Safety Inspection Certificate (`FSIC`) status and monsoon street elevation.
* **500m Campus Map Radar:** Interactive OpenStreetMap + Leaflet.js radar with 500m walking rings, native GPS proximity detection, and offline tile caching.
* **4-Point Inspection & Saved Shortlist:** Schedule visits, compare rooms side by side, and verify sub-meters, morning water pressure, fire exits, and cell signal on site.
* **Hybrid Cloud + Offline-First Storage:** Works out of the box with local storage and automatically syncs with Supabase PostgreSQL when `.env.local` credentials are configured.

## Quick Start (Local Development)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Cloud Database Setup (Supabase)

1. Create a free project at [Supabase](https://supabase.com) (Singapore `ap-southeast-1` region).
2. Run the SQL migration in [supabase/migrations/001_initial_schema.sql](supabase/migrations/001_initial_schema.sql) inside the Supabase SQL Editor.
3. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`.
4. Seed the initial Roxas City dataset:
   ```bash
   npm run db:seed
   ```

## Mobile Packaging (Android APK / AAB & iOS)

1. Install Capacitor native packages and initialize Android/iOS projects:
   ```bash
   npm run cap:install
   npm run cap:add:android
   npm run cap:add:ios
   ```
2. Copy the pre-configured Android manifest with GPS, Camera, and Dialer/SMS intent queries:
   ```bash
   cp native-templates/android/AndroidManifest.xml android/app/src/main/AndroidManifest.xml
   ```
3. Build the web bundle and sync with native shells:
   ```bash
   npm run build:mobile
   ```
4. Build a debug APK for direct phone installation:
   ```bash
   npm run android:apk:debug
   ```

## Project Documentation & Store Kit
* [SHIPPING_PLAN.md](SHIPPING_PLAN.md) — End-to-end multi-platform shipping roadmap.
* [STORE_LISTING.md](STORE_LISTING.md) — Google Play & Apple App Store copy, keywords, and keystore signing guide.
* [PRIVACY_POLICY.md](PRIVACY_POLICY.md) — RA 10173 & App Store compliant privacy policy.
* [TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md) — Platform disclosures, 30-day listing expiry, and tenancy review rules.
* [public/campus-qr-poster.html](public/campus-qr-poster.html) — Print-ready A4 QR code poster for university gates.
