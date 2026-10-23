# Privacy Policy for Tahan

**Effective Date:** October 23, 2026  
**App Name:** Tahan — Verified Student Housing & Utility Transparency  
**Production Domain:** `https://tahan.cheyngadgets.site`  
**Package ID:** `ph.edu.hercor.balaycapiz`  
**Developer:** Tahan Civic-Tech Team (Roxas City, Capiz, Philippines)

---

## 1. Overview & Mission

Tahan (`https://tahan.cheyngadgets.site`) is a student housing discovery and utility rate transparency platform built for college students and parents across Philippine university hubs, starting with our flagship pilot in Roxas City, Capiz (Hercor College, Capiz State University, and Filamer Christian University). We are committed to protecting student and property owner privacy in accordance with the **Philippine Data Privacy Act of 2012 (Republic Act No. 10173)**, Google Play Store User Data policies, and Apple App Store Privacy guidelines.

---

## 2. Information We Collect & How It Is Used

### 2.1 Location Data (`ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`)
* **Purpose:** When you tap **"Near Me"** or use the Campus Proximity Map, Tahan reads your device's GPS coordinates solely to calculate your walking distance to university gates and nearby boarding houses.
* **Retention & Sharing:** Location coordinates are processed locally on your device in real time. We **never** track your background location, store historical movement logs, or sell location data to third parties.

### 2.2 Camera & Photos (`CAMERA` / `READ_MEDIA_IMAGES`)
* **Purpose:** Used strictly when:
  1. A property owner voluntarily uploads a Bureau of Fire Protection (BFP) Fire Safety Inspection Certificate (FSIC) or property photo.
  2. A student voluntarily attaches a Student ID or rental receipt to verify tenancy before publishing a boarding house review.
* **Retention & Sharing:** Verification documents are stored in restricted, access-controlled cloud buckets (Supabase Storage) and are never shared with advertisers.

### 2.3 Contact Details (Landlords & Visit Scheduling)
* **Purpose:** Property owner phone numbers listed on public boarding house profiles allow students and parents to initiate direct calls (`tel:`) or text messages (`sms:`) via their phone's native dialer. When a student schedules an inspection visit, their name and contact number are shared only with the respective boarding house owner.

### 2.4 Local Device Storage (`localStorage` & Service Worker Cache)
* **Purpose:** Saved room shortlists, appliance kWh calculations, inspection checklists, and OpenStreetMap tiles are cached on your device so Tahan continues working offline during mobile data dead zones or power outages.

---

## 3. Data Security & Third-Party Services

* **Cloud Database:** Data is hosted on Supabase (PostgreSQL with Row-Level Security enabled) over encrypted HTTPS/TLS connections.
* **Maps:** Map tiles are loaded from OpenStreetMap (`tile.openstreetmap.org`) under the Open Database License (ODbL).
* **Zero Advertising or Data Brokers:** Tahan contains no third-party ad networks, behavioral trackers, or analytics spyware.

---

## 4. User Rights & Data Deletion

Under Republic Act No. 10173 (Data Privacy Act of 2012), you have the right to access, correct, or request the deletion of your listing, review, or scheduled visit data at any time:
* **In-App Deletion:** You can delete scheduled visits, clear saved shortlists, or reset local datasets directly inside the **Download & Data** menu.
* **Listing & Review Removal:** Property owners and students may request immediate removal of any listing or review by contacting the Tahan team.
