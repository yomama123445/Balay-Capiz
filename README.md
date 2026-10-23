# Tahan — Verified Student Housing & Utility Transparency

**Tahan** (`https://tahan.cheyngadgets.site`) is an offline-ready, cross-platform student boarding house and dormitory discovery platform built to bring electric utility transparency, BFP fire safety verification, and street flood profiles to university towns across the Philippines—starting with its flagship pilot in **Roxas City, Capiz** (**Hercor College**, **CapSU Main**, and **Filamer Christian University**).

## Core Platform Capabilities
* **Electric Grid Rate Transparency:** Compare each property's declared and tenant-reported electricity rate against the local electric cooperative or utility baseline (`₱11.42/kWh` CAPELCO in Roxas City, with regional support for MORE Power in Iloilo, Negros Power in Bacolod, and Meralco in Metro Manila).
* **BFP Fire Safety & Flood Elevation:** Filter boarding houses by Bureau of Fire Protection (BFP) Fire Safety Inspection Certificate (`FSIC`) verification, dedicated fire exits, and historical monsoon flood elevation.
* **500m Campus Map Radar:** Interactive OpenStreetMap + Leaflet.js radar with 500m walking rings, native GPS proximity detection, and offline tile caching.
* **4-Point Inspection & Saved Shortlist:** Schedule visits, split rent across roommates, and verify sub-meters, morning water pressure, fire exits, and cell signal on site.
* **Gated Host Portal & 30-Day Listing Renewal:** Protected property owner portal with real BFP certificate file uploads, vacancy slot steppers, and 30-day freshness renewal.

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

## Live Deployment & Mobile Packaging

* **Production Web & PWA:** Hosted on Vercel at [https://tahan.cheyngadgets.site](https://tahan.cheyngadgets.site)
* **Compiled Android Installer:** [BalayCapiz-v1.0.0.apk](BalayCapiz-v1.0.0.apk) (`android/app/build/outputs/apk/debug/app-debug.apk` — 9.2 MB)
* **Rebuild Android APK:**
  ```bash
  npm run android:apk:debug
  ```

## Project Documentation
* [SHIPPING_PLAN.md](SHIPPING_PLAN.md) — End-to-end multi-platform roadmap and progress sheet.
* [STORE_LISTING.md](STORE_LISTING.md) — Google Play & Apple App Store copy, keywords, and keystore signing guide.
* [PRIVACY_POLICY.md](PRIVACY_POLICY.md) — RA 10173 & App Store compliant privacy policy.
* [TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md) — Platform disclosures, 30-day listing expiry, and tenancy review rules.
* [public/campus-qr-poster.html](public/campus-qr-poster.html) — Print-ready A4 QR code poster for university gates.
