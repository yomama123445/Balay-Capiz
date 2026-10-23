# BalayCapiz — App Store & Google Play Store Submission Kit

Use the copy, metadata, and commands below when submitting **BalayCapiz** to the **Google Play Console** or **Apple App Store Connect**, or when distributing the signed `.apk` directly to Roxas City students.

---

## 1. Core App Store Metadata

* **App Name (30 chars max):** `BalayCapiz: Roxas Dorm Finder`
* **Full Title (50 chars max):** `BalayCapiz — Roxas City Student Housing Portal`
* **Application ID / Bundle ID:** `ph.edu.hercor.balaycapiz`
* **Version:** `1.0.0` (Version Code `1`)
* **Primary Category:** Education / Lifestyle
* **Content Rating:** Everyone / 4+
* **Price:** Free (₱0.00 — No In-App Purchases, No Ads)

---

## 2. Short Description (Google Play — 80 Characters Max)

```text
Verified student dorms & boarding houses near Hercor, CapSU & Filamer in Roxas.
```
*(79 characters)*

---

## 3. Full Store Description (Google Play & Apple App Store)

```text
Finding a safe, honest boarding house in Roxas City shouldn't mean walking street-by-street under the Capiz heat or scrolling through outdated Facebook posts with hidden utility markups.

BalayCapiz is the verified student housing and utility transparency portal built specifically for students and parents relocating to Roxas City, Capiz for:
• Hercor College (Lawaan & Riverside Campuses)
• Capiz State University (CapSU Main Campus — Fuentes Drive)
• Filamer Christian University (Roxas Avenue)

WHY STUDENTS & PARENTS USE BALAYCAPIZ:
1. CAPELCO Sub-Meter Rate Transparency
Compare each boarding house's declared electricity rate against the official CAPELCO residential baseline (~₱11.42/kWh) before you move in. Use the built-in Interactive Appliance Bill Planner to estimate your true monthly cost (Base Rent + Fan, Laptop, Rice Cooker, or Aircon load).

2. BFP Fire Safety & Monsoon Flood Profiles
Filter rooms in Lawaan, Fuentes Drive, Tiza, Banica, and Roxas Avenue by Bureau of Fire Protection (BFP) Fire Safety Inspection Certificate (FSIC) status, dedicated fire exits, and street elevation flood history.

3. Campus Proximity & 500m Walking Radar
Inspect exact GPS walking distances and tricycle fare zones around every campus gate on an offline-ready OpenStreetMap radar.

4. 4-Point Physical Inspection Checklist & Saved Shortlist
Schedule room visits, compare up to 3 boarding houses side by side, and check off sub-meters, morning water pressure, fire exits, and cell signal during your visit.

5. One-Tap Direct Landlord Contact (₱0 Broker Fee)
Call or text verified local landlords (Nanay, Tatay, Tita, Manong) directly using your phone's native dialer and SMS—with zero middleman markups.

6. Works Offline
Built for real Capiz connectivity—cached map tiles, saved rooms, and landlord numbers remain accessible even when mobile data drops.
```

---

## 4. Search Keywords (App Store / ASO)

```text
Roxas City boarding house, Capiz student dorm, Hercor College Lawaan, CapSU Main dorm, Filamer housing, CAPELCO calculator, bedspace Roxas, apartment Capiz
```

---

## 5. Step-by-Step Build & Release Commands

### A. Initialize Native Android & iOS Projects (Run Once)
```bash
npm run cap:install
npm run cap:add:android
npm run cap:add:ios
```
After creating the `android/` folder, copy the pre-configured manifest:
```bash
cp native-templates/android/AndroidManifest.xml android/app/src/main/AndroidManifest.xml
```

### B. Build Debug APK (For Direct Phone Testing & QR Download)
```bash
npm run android:apk:debug
```
* **Output Path:** `android/app/build/outputs/apk/debug/app-debug.apk`
* You can share this `.apk` via Google Drive, USB, or QR code for immediate installation on any Android phone.

### C. Generate Private Release Keystore (For Google Play Store)
```bash
keytool -genkey -v \
  -keystore balaycapiz-release.keystore \
  -alias balaycapiz \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### D. Build Signed Production Bundle (`.aab` for Google Play)
```bash
npm run android:aab:release
```
* **Output Path:** `android/app/build/outputs/bundle/release/app-release.aab`
