# BalayCapiz — Cross-Platform Production & Shipping Roadmap

**Target Platforms:** Android (`.apk` / `.aab`), iOS (App Store / TestFlight), Web / PWA (Installable), Desktop (Optional Tauri v2)  
**Target Audience:** Students, parents, and landlords for Hercor College (Lawaan), CapSU Main, and Filamer Christian University in Roxas City, Capiz.  
**Core Civic Tech Features:** CAPELCO electricity rate transparency (~₱11/kWh baseline), BFP fire safety inspection verification, barangay flood risk tracking (Lawaan, Banica, Tiza), and one-tap landlord dialer/SMS.

---

## 1. Responsibilities Matrix

```
┌────────────────────────────────────────┬────────────────────────────────────────┐
│            AI Agent Tasks              │               User Tasks               │
│        (Code, Configs & Schemas)       │       (Accounts, Devices & Local SDKs) │
├────────────────────────────────────────┼────────────────────────────────────────┤
│ • Capacitor setup & native bridge cfg  │ • Install Android Studio & Android SDK │
│ • PWA service worker & cache tuning    │ • Install Xcode (for iOS builds on Mac)│
│ • Supabase schema, RLS & migration SQL │ • Create Supabase project & provide key│
│ • Real API integration in React        │ • Test on physical Android/iOS devices │
│ • AndroidManifest & Info.plist config  │ • Generate private keystore & passwords│
│ • Build scripts & bundle automation    │ • Register Google Play / Apple accounts│
│ • App Store metadata & privacy policy  │ • Field survey of 20–30 Roxas rentals  │
└────────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 2. Granular Implementation Phases

### Phase 1: Native Mobile Wrapper & PWA Hardening

#### AI Agent Tasks
1. **Install Capacitor Dependencies**:
   * Add `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, and `@capacitor/ios` to `package.json`.
2. **Generate Native Scaffold**:
   * Create and configure `capacitor.config.ts`:
     * `appId`: `ph.edu.hercor.balaycapiz`
     * `appName`: `BalayCapiz`
     * `webDir`: `dist`
     * `bundledWebRuntime`: `false`
3. **PWA & Offline Asset Optimization**:
   * Update `vite.config.ts` Workbox caching strategies:
     * Cache OpenStreetMap tiles (`https://*.tile.openstreetmap.org/*`) with `CacheFirst` strategy (250 entries, 30 days).
     * Cache Google Fonts and Leaflet static assets for offline startup.
     * Configure background sync fallback for offline review drafts.
4. **Build Automation Scripts**:
   * Add npm scripts:
     * `build:mobile`: `vite build && cap sync`
     * `open:android`: `cap open android`
     * `open:ios`: `cap open ios`

#### User Action Items
1. Download and install **Android Studio** (Hedgehog or newer) on your Mac.
2. In Android Studio, install:
   * Android SDK Platform 34 or 35.
   * Android SDK Build-Tools.
   * Android Virtual Device (AVD) or enable USB Debugging on your Android phone.
3. If targeting iOS, ensure Xcode and Command Line Tools are installed from the Mac App Store.

#### Acceptance Criteria
* `npm run build && npx cap sync` executes without path errors.
* Running `npx cap open android` opens Android Studio with all Java/Gradle dependencies resolved.

---

### Phase 2: Cloud Backend, Database & Storage (Supabase)

#### AI Agent Tasks
1. **SQL Schema & Migration Design**:
   * Create `supabase/migrations/001_initial_schema.sql` defining:
     * `properties`: ID, name, street address, barangay, rent amount, distance to campus (meters), campus ID, CAPELCO compliance flag, flood risk level, contact numbers, verified status, timestamps.
     * `property_photos`: Photo URLs, upload metadata, verified tags.
     * `bfp_certificates`: Inspection certificate scans, expiration dates, verified badge status.
     * `student_reviews`: Ratings, commentary, tenancy proof document URL, landlord reply.
     * `campuses`: Seed data for Hercor College Lawaan, CapSU Main Campus, and Filamer Christian University.
2. **Row-Level Security (RLS) Policies**:
   * Anonymous read access for public listings and verified reviews.
   * Authenticated/restricted write access for landlords managing their own listings.
3. **Supabase Client Integration**:
   * Install `@supabase/supabase-js`.
   * Create `src/lib/supabaseClient.ts` reading `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. **Data Service Migration**:
   * Refactor `src/data/roxasHousingData.ts` into a service layer (`src/services/housingService.ts`) supporting:
     * Live database queries with offline fallback to local cache.
     * Filtering by campus radius, maximum budget, CAPELCO standard, and BFP clearance.
     * Document upload pipeline for landlord safety files and student tenancy verification.

#### User Action Items
1. Navigate to [Supabase](https://supabase.com) and create a free account.
2. Click **New Project**, select region `Singapore (ap-southeast-1)` (lowest latency for Western Visayas).
3. Copy the `Project URL` and `anon public` API key.
4. Paste them into `.env.local`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Open the Supabase SQL Editor and execute the migration file generated by the agent.

#### Acceptance Criteria
* Frontend connects to Supabase and populates the feed with live database rows.
* Uploading a test document stores the file in the Supabase `verification-docs` storage bucket.

---

### Phase 3: Hardware Integrations & Native Permissions

#### AI Agent Tasks
1. **Plugin Integration**:
   * Install `@capacitor/geolocation`, `@capacitor/camera`, and `@capacitor/status-bar`.
2. **Native Platform Manifests**:
   * Configure `android/app/src/main/AndroidManifest.xml`:
     * Add `ACCESS_COARSE_LOCATION` and `ACCESS_FINE_LOCATION` for proximity filtering.
     * Add `CAMERA` and `READ_EXTERNAL_STORAGE` for photo/clearance submission.
     * Configure intent filters for `tel:` and `sms:` to open native phone dialers without browser navigation warnings.
   * Configure `ios/App/App/Info.plist`:
     * `NSLocationWhenInUseUsageDescription`: "BalayCapiz uses your location to calculate walking distance to Hercor, CapSU, or Filamer."
     * `NSCameraUsageDescription`: "BalayCapiz uses your camera to photograph rental agreements or BFP certificates."
3. **UI Hardware Hooks**:
   * Connect proximity buttons to native GPS location with campus boundary geofencing.

#### User Action Items
1. Run the app on a physical device.
2. Test device permission dialogues (accepting location and camera prompts).
3. Verify that tapping "Call Landlord" directly dials the phone app with the listed 09xx number.

#### Acceptance Criteria
* GPS returns accurate coordinates within Roxas City.
* Tapping landlord call or SMS invokes native phone actions instantly.

---

### Phase 4: Production Builds, Assets & Icons

#### AI Agent Tasks
1. **Asset Generation Pipeline**:
   * Produce standard icon and splash assets from SVG source:
     * Android mipmap icons (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`).
     * Adaptive icons (`ic_launcher.xml` and `ic_launcher_round.xml`).
     * iOS AppIcon asset catalog.
     * Splash screen themes matching BalayCapiz palette (`#0F172A` dark navy / `#FAF8F5` off-white).
2. **Build Configuration**:
   * Optimize `vite.config.ts` chunking:
     * Separate Leaflet and vendor chunks to prevent single large bundles.
     * Minimize initial bundle size under 300 KB for fast loading over 3G/4G connections.
3. **Android Gradle Configuration**:
   * Configure `android/app/build.gradle`:
     * Set `minSdkVersion = 22` (covers >98% of active Android phones in the Philippines).
     * Set `targetSdkVersion = 34` (Google Play compliance).
     * Configure release signing configs pointing to local keystore environment variables.

#### User Action Items
1. Generate your private release keystore:
   ```bash
   keytool -genkey -v -keystore balaycapiz-release.keystore -alias balaycapiz -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Store the `.keystore` file safely and keep passwords backed up.

#### Acceptance Criteria
* `cd android && ./gradlew assembleRelease` outputs a signed or unsigned `.apk`.
* `./gradlew bundleRelease` outputs an optimized `.aab` (Android App Bundle).

---

### Phase 5: App Store Submission & Legal Compliance

#### AI Agent Tasks
1. **Legal & Compliance Documents**:
   * Generate `PRIVACY_POLICY.md` tailored for Google Play / App Store requirements:
     * Explicit declaration of location usage (distance calculation, no background tracking).
     * Clear explanation of student ID uploads (verification only, never sold).
   * Generate `TERMS_OF_SERVICE.md` with disclaimers regarding landlord-tenant disputes and accuracy of citizen-reported data.
2. **Store Listing Copy**:
   * Short Description (80 characters): Verified Roxas City student housing near Hercor, CapSU, and Filamer.
   * Full Description: Detail the CAPELCO rate transparency, BFP fire clearance, flood zoning, and direct contact options.
   * Keyword list for Philippine student search intents.

#### User Action Items
1. Register a **Google Play Console** account ($25 one-time fee) at https://play.google.com/console.
2. Complete Google Play identity verification and Merchant profile.
3. Complete the Google Play Store questionnaires:
   * Target audience (18+ college students).
   * Data safety questionnaire (matching `PRIVACY_POLICY.md`).
   * News app / COVID-19 / Financial disclosures (Select 'No').
4. Upload screenshots and the signed `.aab` file to Internal or Closed Testing track.

#### Acceptance Criteria
* App review passes Google Play automated pre-launch reports.
* App link goes live on the Google Play Store or distributed as an installable APK.

---

### Phase 6: Roxas City Field Deployment & Seeding

#### AI Agent Tasks
1. **Bulk Ingestion Script**:
   * Provide a script (`scripts/seed_properties.ts`) to import housing surveys directly into Supabase.
2. **Public QR Landing Page**:
   * Generate a print-ready QR code poster connecting directly to the PWA / APK download page for bulletin boards at Hercor Lawaan Gate, CapSU Main, and Filamer.

#### User Action Items
1. Conduct the pre-launch survey around Lawaan, Banica, and Fuentes Drive to collect the initial 20–30 boarding houses (prices, amenities, CAPELCO sub-meter rates).
2. Distribute flyers or QR posters at university gates and student council boards.

---

## 3. Recommended Execution Sequence

1. **Step 1 (Agent)**: Install Capacitor and generate the Android native project.
2. **Step 2 (Agent)**: Write Supabase migration and data integration layer.
3. **Step 3 (User)**: Create Supabase project and provide credentials.
4. **Step 4 (Agent)**: Build production bundle and sync native Android project.
5. **Step 5 (User)**: Build and test APK in Android Studio / physical phone.
