-- ============================================================================
-- BalayCapiz — Production Supabase PostgreSQL Schema & RLS Migration
-- Target Region: ap-southeast-1 (Singapore)
-- Course: FE101 — Hercor College Computer Science Department (Roxas City, Capiz)
-- ============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Campuses Reference Table
CREATE TABLE IF NOT EXISTS public.campuses (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  short_name VARCHAR(60) NOT NULL,
  barangay VARCHAR(80) NOT NULL,
  address VARCHAR(200) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  student_count_note TEXT,
  trike_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Roxas City Campuses
INSERT INTO public.campuses (id, name, short_name, barangay, address, lat, lng, student_count_note, trike_note)
VALUES
  ('hercor-lawaan', 'Hercor College — Lawaan Campus', 'Hercor Lawaan', 'Brgy. Lawaan', 'Km. 1, Lawaan Highway, Roxas City, Capiz', 11.5584, 122.7538, 'Primary CS, IT, Criminology & Engineering hub', '₱15 standard tricycle fare from Robinson''s / Lawaan terminal'),
  ('capsu-main', 'Capiz State University — Main Campus', 'CapSU Main', 'Fuentes Drive', 'Fuentes Drive, Brgy. IX / Tiza, Roxas City, Capiz', 11.5836, 122.7556, 'Education, Architecture, Industrial Tech & Arts', 'Walkable corridor along Fuentes Drive, Tiza & Banica'),
  ('filamer', 'Filamer Christian University', 'Filamer (FCU)', 'Roxas Avenue', 'Roxas Avenue, Brgy. VIII, Roxas City, Capiz', 11.5888, 122.7525, 'Nursing, Medical Tech, Business & Hospitality', 'Central downtown corridor near Panay River bridge'),
  ('hercor-riverside', 'Hercor College — Riverside Campus', 'Hercor Riverside', 'Roxas Avenue', 'Roxas Avenue, Downtown Roxas City, Capiz', 11.5853, 122.7512, 'Healthcare, Senior High & Maritime programs', '400m south of Filamer along Roxas Avenue')
ON CONFLICT (id) DO NOTHING;

-- 2. Verified Boarding House Listings Table
CREATE TABLE IF NOT EXISTS public.listings (
  id VARCHAR(80) PRIMARY KEY,
  title VARCHAR(140) NOT NULL,
  local_subtitle VARCHAR(180) NOT NULL DEFAULT '',
  barangay VARCHAR(80) NOT NULL,
  street_address VARCHAR(220) NOT NULL,
  nearest_campus VARCHAR(40) NOT NULL REFERENCES public.campuses(id),
  distance_meters INT NOT NULL CHECK (distance_meters >= 0),
  walk_minutes INT NOT NULL DEFAULT 5,
  trike_fare_php NUMERIC(6,2) NOT NULL DEFAULT 0,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  monthly_rent_php NUMERIC(8,2) NOT NULL CHECK (monthly_rent_php > 0),
  room_type VARCHAR(40) NOT NULL,
  gender_policy VARCHAR(40) NOT NULL,
  total_slots INT NOT NULL DEFAULT 1,
  available_slots INT NOT NULL DEFAULT 1,
  water_included BOOLEAN NOT NULL DEFAULT TRUE,
  water_note TEXT DEFAULT '',
  -- CAPELCO & Safety Compliance
  capelco_standard BOOLEAN NOT NULL DEFAULT TRUE,
  declared_kwh_rate NUMERIC(6,2) NOT NULL DEFAULT 11.42,
  crowdsourced_kwh_rate NUMERIC(6,2) NOT NULL DEFAULT 11.42,
  metering_type VARCHAR(60) NOT NULL DEFAULT 'Individual CAPELCO Sub-meter',
  flood_risk VARCHAR(20) NOT NULL CHECK (flood_risk IN ('Low', 'Medium', 'High')),
  flood_history_note TEXT DEFAULT '',
  elevation_meters_above_street NUMERIC(4,2) NOT NULL DEFAULT 0.5,
  bfp_verified BOOLEAN NOT NULL DEFAULT FALSE,
  bfp_cert_number VARCHAR(60),
  bfp_inspection_date VARCHAR(60),
  fire_extinguishers_count INT NOT NULL DEFAULT 1,
  has_dedicated_fire_exit BOOLEAN NOT NULL DEFAULT TRUE,
  gate_security TEXT DEFAULT '',
  curfew_policy TEXT DEFAULT '',
  visitor_policy TEXT DEFAULT '',
  brownout_backup TEXT DEFAULT '',
  -- Amenities
  wifi_included BOOLEAN NOT NULL DEFAULT TRUE,
  wifi_speed_note TEXT DEFAULT '',
  has_study_area BOOLEAN NOT NULL DEFAULT FALSE,
  has_kitchen_access BOOLEAN NOT NULL DEFAULT TRUE,
  has_laundry_area BOOLEAN NOT NULL DEFAULT TRUE,
  has_private_cr BOOLEAN NOT NULL DEFAULT FALSE,
  has_water_tank BOOLEAN NOT NULL DEFAULT FALSE,
  has_covered_moto_parking BOOLEAN NOT NULL DEFAULT FALSE,
  -- Landlord Contact & Verification
  landlord_name VARCHAR(120) NOT NULL,
  landlord_local_call_name VARCHAR(80) NOT NULL,
  landlord_initials VARCHAR(8) NOT NULL DEFAULT 'LL',
  landlord_since_year INT NOT NULL DEFAULT 2024,
  landlord_phone VARCHAR(30) NOT NULL,
  landlord_kyc_verified BOOLEAN NOT NULL DEFAULT TRUE,
  landlord_response_note TEXT DEFAULT '',
  -- 30-Day Auto-Expiration Lifecycle
  days_until_expiry INT NOT NULL DEFAULT 30,
  last_updated_date VARCHAR(60) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  -- Visual Theme JSONB
  visual_palette JSONB NOT NULL DEFAULT '{"roofColor":"#1E293B","wallColor":"#F8FAFC","accentColor":"#D97706","foliageTone":"#15803D","architecturalStyle":"concrete-two-storey"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Verified Student Tenancy Reviews Table
CREATE TABLE IF NOT EXISTS public.tenant_reviews (
  id VARCHAR(80) PRIMARY KEY,
  listing_id VARCHAR(80) NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_initials VARCHAR(8) NOT NULL,
  program_and_year VARCHAR(120) NOT NULL,
  stay_period VARCHAR(80) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(160) NOT NULL,
  comment TEXT NOT NULL,
  reported_kwh_rate NUMERIC(6,2) NOT NULL DEFAULT 11.42,
  verification_method VARCHAR(60) NOT NULL DEFAULT 'Student ID + Receipt Verified',
  verified_student_id_url TEXT,
  verified_date VARCHAR(60) NOT NULL,
  landlord_reply JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Scheduled Room Inspections / Visits Table
CREATE TABLE IF NOT EXISTS public.scheduled_visits (
  id VARCHAR(80) PRIMARY KEY,
  listing_id VARCHAR(80) NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  listing_title VARCHAR(140) NOT NULL,
  barangay VARCHAR(80) NOT NULL,
  street_address VARCHAR(220) NOT NULL,
  landlord_name VARCHAR(120) NOT NULL,
  landlord_call_name VARCHAR(80) NOT NULL,
  landlord_phone VARCHAR(30) NOT NULL,
  monthly_rent_php NUMERIC(8,2) NOT NULL,
  visit_date VARCHAR(40) NOT NULL,
  visit_time_slot VARCHAR(80) NOT NULL,
  student_name VARCHAR(120) NOT NULL,
  student_phone VARCHAR(30) NOT NULL,
  student_campus VARCHAR(40) NOT NULL,
  occupants_count INT NOT NULL DEFAULT 1,
  status VARCHAR(40) NOT NULL DEFAULT 'Pending Landlord',
  inspection_notes TEXT DEFAULT '',
  checklist JSONB NOT NULL DEFAULT '{"checkedSubMeter":false,"testedMorningWater":false,"verifiedFireExit":false,"checkedCellSignal":false}'::jsonb,
  created_at VARCHAR(60) NOT NULL,
  inserted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast campus, price, and compliance filtering
CREATE INDEX IF NOT EXISTS idx_listings_campus ON public.listings(nearest_campus);
CREATE INDEX IF NOT EXISTS idx_listings_rent ON public.listings(monthly_rent_php);
CREATE INDEX IF NOT EXISTS idx_listings_compliance ON public.listings(capelco_standard, bfp_verified, flood_risk);
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON public.tenant_reviews(listing_id);

-- 30-Day Listing Renewal Function
CREATE OR REPLACE FUNCTION public.renew_listing_30_days(target_listing_id VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE public.listings
  SET
    days_until_expiry = 30,
    expires_at = NOW() + INTERVAL '30 days',
    is_archived = FALSE,
    last_updated_date = TO_CHAR(NOW(), 'FMMonth DD, YYYY'),
    updated_at = NOW()
  WHERE id = target_listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row-Level Security (RLS)
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_visits ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies (Zero-Login Discovery for Students & Parents)
CREATE POLICY "Allow public read access on campuses"
  ON public.campuses FOR SELECT USING (true);

CREATE POLICY "Allow public read access on active listings"
  ON public.listings FOR SELECT USING (is_archived = false);

CREATE POLICY "Allow public read access on verified reviews"
  ON public.tenant_reviews FOR SELECT USING (true);

CREATE POLICY "Allow public read access on visits"
  ON public.scheduled_visits FOR SELECT USING (true);

-- Public Insert/Update Policies for MVP Demo & Field Survey Operations
CREATE POLICY "Allow public insert on listings"
  ON public.listings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on listings"
  ON public.listings FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on tenant_reviews"
  ON public.tenant_reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on tenant_reviews"
  ON public.tenant_reviews FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on scheduled_visits"
  ON public.scheduled_visits FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on scheduled_visits"
  ON public.scheduled_visits FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on scheduled_visits"
  ON public.scheduled_visits FOR DELETE USING (true);

-- Storage Buckets for BFP Certificates & Student ID Proofs
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('property-photos', 'property-photos', true),
  ('verification-docs', 'verification-docs', false)
ON CONFLICT (id) DO NOTHING;
