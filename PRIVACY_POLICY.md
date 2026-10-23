# Privacy Policy for BalayCapiz

**Effective Date:** October 23, 2026  
**App Name:** BalayCapiz — Roxas City Student Housing Portal  
**Package ID:** `ph.edu.hercor.balaycapiz`  
**Developer:** BalayCapiz Civic-Tech Team (Hercor College Computer Science Department, Roxas City, Capiz, Philippines)

---

## 1. Overview & Civic-Tech Mission

BalayCapiz is a student housing discovery and utility rate transparency platform built for students attending Hercor College (Lawaan & Riverside), Capiz State University (CapSU Main), and Filamer Christian University in Roxas City, Capiz. We are committed to protecting student and landlord privacy in accordance with the **Philippine Data Privacy Act of 2012 (Republic Act No. 10173)**, Google Play Store User Data policies, and Apple App Store Privacy guidelines.

---

## 2. Information We Collect & How It Is Used

### 2.1 Location Data (`ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`)
* **Purpose:** When you tap **"Near Me"** or use the Campus Proximity Map, BalayCapiz reads your device's GPS coordinates solely to calculate your walking distance to university gates and nearby boarding houses in Roxas City.
* **Retention & Sharing:** Location coordinates are processed locally on your device in real time. We **never** track your background location, store historical movement logs, or sell location data to third parties.

### 2.2 Camera & Photos (`CAMERA` / `READ_MEDIA_IMAGES`)
* **Purpose:** Used strictly when:
  1. A landlord voluntarily photographs or uploads a Bureau of Fire Protection (BFP) Fire Safety Inspection Certificate (FSIC) or property photo.
  2. A student voluntarily attaches a Student ID or redacted rental receipt to verify tenancy before publishing a boarding house review.
* **Retention & Sharing:** Verification documents are stored in restricted, access-controlled cloud buckets (Supabase Storage) and are never shared with advertisers.

### 2.3 Contact Details (Landlords & Visit Scheduling)
* **Purpose:** Landlord phone numbers listed on public boarding house profiles allow students and parents to initiate direct calls (`tel:`) or text messages (`sms:`) via their phone's native dialer. When a student schedules an inspection visit, their name and contact number are shared only with the respective boarding house landlord.

### 2.4 Local Device Storage (`localStorage` & Service Worker Cache)
* **Purpose:** Saved room shortlists, appliance kWh calculations, inspection checklists, and OpenStreetMap tiles are cached on your device so BalayCapiz continues working offline during mobile data dead zones or brownouts.

---

## 3. Data Security & Third-Party Services

* **Cloud Database:** Data is hosted on Supabase (PostgreSQL with Row-Level Security enabled) over encrypted HTTPS/TLS connections.
* **Maps:** Map tiles are loaded from OpenStreetMap (`tile.openstreetmap.org`) under the Open Database License (ODbL).
* **Zero Advertising or Data Brokers:** BalayCapiz contains no third-party ad networks, behavioral trackers, or analytics spyware.

---

## 4. User Rights & Data Deletion

Under Republic Act No. 10173 (Data Privacy Act of 2012), you have the right to access, correct, or request the deletion of your listing, review, or scheduled visit data at any time:
* **In-App Deletion:** You can delete scheduled visits, clear saved shortlists, or reset local datasets directly inside the **App & Data** menu.
* **Listing & Review Removal:** Landlords and students may request immediate removal of any listing or review by contacting the BalayCapiz team at `balaycapiz.support@hercor.edu.ph`.

---

## 5. Contact Us

For privacy questions, BFP verification inquiries, or data removal requests:
* **Team:** BalayCapiz Civic-Tech Group (FE101 — Hercor College CSD)
* **Location:** Km. 1, Brgy. Lawaan, Roxas City, Capiz 5800, Philippines
* **Email:** `balaycapiz.support@hercor.edu.ph`
