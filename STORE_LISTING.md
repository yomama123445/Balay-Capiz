# Tahan — App Store & Google Play Store Submission Kit

Use the copy, metadata, and commands below when submitting **Tahan** (`https://tahan.cheyngadgets.site`) to the **Google Play Console** or **Apple App Store Connect**, or when distributing the `.apk` directly to students.

---

## 1. Core App Store Metadata

* **App Name (30 chars max):** `Tahan: Student Dorm Finder`
* **Full Title (50 chars max):** `Tahan — Verified Student Dorms & Housing`
* **Production Website:** `https://tahan.cheyngadgets.site`
* **Application ID / Bundle ID:** `ph.edu.hercor.balaycapiz`
* **Version:** `1.0.0` (Version Code `1`)
* **Primary Category:** Education / Lifestyle
* **Content Rating:** Everyone / 4+
* **Price:** Free (₱0.00 — No In-App Purchases, No Ads)

---

## 2. Short Description (Google Play — 80 Characters Max)

```text
Verified student dorms & boarding houses with transparent utility & safety data.
```
*(80 characters)*

---

## 3. Full Store Description (Google Play & Apple App Store)

```text
Finding a safe, honest student boarding house shouldn't mean walking street-by-street in the heat or scrolling through outdated social media listings with hidden utility markups.

Tahan is the verified student housing and utility transparency platform built for college students and parents across Philippine university hubs—starting with our flagship pilot in Roxas City, Capiz (Hercor College, Capiz State University, and Filamer Christian University) and expanding to Iloilo, Bacolod, and Metro Manila.

WHY STUDENTS & PARENTS USE TAHAN:
1. Electric Grid Rate Transparency
Compare each boarding house's declared electricity rate against the official local grid baseline (e.g., CAPELCO ₱11.42/kWh) before you move in. Use the built-in Appliance Bill Planner to estimate your true monthly cost (Base Rent + Fan, Laptop, Rice Cooker, or Aircon load).

2. BFP Fire Safety & Flood Elevation Profiles
Filter rooms by Bureau of Fire Protection (BFP) Fire Safety Inspection Certificate (FSIC) status, dedicated fire exits, and street elevation flood history.

3. Campus Proximity & 500m Walking Radar
Inspect exact GPS walking distances and public transit fare zones around university gates on an offline-ready map.

4. 4-Point Physical Inspection Checklist & Roommate Splitter
Schedule room viewings, split rent across roommates, compare up to 3 boarding houses side by side, and check off sub-meters, morning water pressure, fire exits, and cell signal during your visit.

5. Direct Landlord Contact (₱0 Broker Fee)
Call or text verified property owners directly using your phone's native dialer and SMS—with zero middleman markups.
```

---

## 4. Search Keywords (App Store / ASO)

```text
Tahan, student dorm Philippines, boarding house finder, Roxas City dorm, Hercor College, CapSU Main, Filamer housing, bedspace, utility calculator
```

---

## 5. Build & Release Commands

### A. Build Debug APK (For Direct Phone Testing & QR Download)
```bash
npm run android:apk:debug
```
* **Output Path:** `android/app/build/outputs/apk/debug/app-debug.apk` (also copied to `BalayCapiz-v1.0.0.apk`)

### B. Generate Private Release Keystore (For Google Play Store)
```bash
keytool -genkey -v \
  -keystore tahan-release.keystore \
  -alias tahan \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### C. Build Signed Production Bundle (`.aab` for Google Play)
```bash
npm run android:aab:release
```
* **Output Path:** `android/app/build/outputs/bundle/release/app-release.aab`
