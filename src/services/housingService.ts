/**
 * BalayCapiz — Hybrid Cloud + Offline-First Housing Data Service
 * Synchronizes Roxas City boarding houses, student reviews, and scheduled visits
 * between Supabase PostgreSQL and local device storage.
 */

import {
  BoardingHouseListing,
  CampusId,
  FloodRiskLevel,
  GenderPolicy,
  RoomType,
  TenantReview,
} from '../data/roxasHousingData';
import { ScheduledVisit } from '../types/appTypes';
import {
  isSupabaseConfigured,
  supabaseDelete,
  supabaseSelect,
  supabaseUpdate,
  supabaseUpsert,
} from '../lib/supabaseClient';

export interface DbListingRow {
  id: string;
  title: string;
  local_subtitle: string;
  barangay: string;
  street_address: string;
  nearest_campus: Exclude<CampusId, 'all'>;
  distance_meters: number;
  walk_minutes: number;
  trike_fare_php: number;
  lat: number;
  lng: number;
  monthly_rent_php: number;
  room_type: RoomType;
  gender_policy: GenderPolicy;
  total_slots: number;
  available_slots: number;
  water_included: boolean;
  water_note: string;
  capelco_standard: boolean;
  declared_kwh_rate: number;
  crowdsourced_kwh_rate: number;
  metering_type: BoardingHouseListing['meteringType'];
  flood_risk: FloodRiskLevel;
  flood_history_note: string;
  elevation_meters_above_street: number;
  bfp_verified: boolean;
  bfp_cert_number?: string;
  bfp_inspection_date?: string;
  fire_extinguishers_count: number;
  has_dedicated_fire_exit: boolean;
  gate_security: string;
  curfew_policy: string;
  visitor_policy: string;
  brownout_backup: string;
  wifi_included: boolean;
  wifi_speed_note: string;
  has_study_area: boolean;
  has_kitchen_access: boolean;
  has_laundry_area: boolean;
  has_private_cr: boolean;
  has_water_tank: boolean;
  has_covered_moto_parking: boolean;
  landlord_name: string;
  landlord_local_call_name: string;
  landlord_initials: string;
  landlord_since_year: number;
  landlord_phone: string;
  landlord_kyc_verified: boolean;
  landlord_response_note: string;
  days_until_expiry: number;
  last_updated_date: string;
  visual_palette: BoardingHouseListing['visualPalette'];
}

export interface DbReviewRow {
  id: string;
  listing_id: string;
  reviewer_name: string;
  reviewer_initials: string;
  program_and_year: string;
  stay_period: string;
  rating: number;
  title: string;
  comment: string;
  reported_kwh_rate: number;
  verification_method: TenantReview['verificationMethod'];
  verified_date: string;
  landlord_reply?: TenantReview['landlordReply'];
}

export interface DbVisitRow {
  id: string;
  listing_id: string;
  listing_title: string;
  barangay: string;
  street_address: string;
  landlord_name: string;
  landlord_call_name: string;
  landlord_phone: string;
  monthly_rent_php: number;
  visit_date: string;
  visit_time_slot: string;
  student_name: string;
  student_phone: string;
  student_campus: Exclude<CampusId, 'all'>;
  occupants_count: number;
  status: ScheduledVisit['status'];
  inspection_notes: string;
  checklist: ScheduledVisit['checklist'];
  created_at: string;
}

export function mapListingToDbRow(listing: BoardingHouseListing): DbListingRow {
  return {
    id: listing.id,
    title: listing.title,
    local_subtitle: listing.localSubtitle,
    barangay: listing.barangay,
    street_address: listing.streetAddress,
    nearest_campus: listing.nearestCampus,
    distance_meters: listing.distanceMeters,
    walk_minutes: listing.walkMinutes,
    trike_fare_php: listing.trikeFarePhp,
    lat: listing.lat,
    lng: listing.lng,
    monthly_rent_php: listing.monthlyRentPhp,
    room_type: listing.roomType,
    gender_policy: listing.genderPolicy,
    total_slots: listing.totalSlots,
    available_slots: listing.availableSlots,
    water_included: listing.waterIncluded,
    water_note: listing.waterNote,
    capelco_standard: listing.capelcoStandard,
    declared_kwh_rate: listing.declaredKwhRate,
    crowdsourced_kwh_rate: listing.crowdsourcedKwhRate,
    metering_type: listing.meteringType,
    flood_risk: listing.floodRisk,
    flood_history_note: listing.floodHistoryNote,
    elevation_meters_above_street: listing.elevationMetersAboveStreet,
    bfp_verified: listing.bfpVerified,
    bfp_cert_number: listing.bfpCertNumber,
    bfp_inspection_date: listing.bfpInspectionDate,
    fire_extinguishers_count: listing.fireExtinguishersCount,
    has_dedicated_fire_exit: listing.hasDedicatedFireExit,
    gate_security: listing.gateSecurity,
    curfew_policy: listing.curfewPolicy,
    visitor_policy: listing.visitorPolicy,
    brownout_backup: listing.brownoutBackup,
    wifi_included: listing.wifiIncluded,
    wifi_speed_note: listing.wifiSpeedNote,
    has_study_area: listing.hasStudyArea,
    has_kitchen_access: listing.hasKitchenAccess,
    has_laundry_area: listing.hasLaundryArea,
    has_private_cr: listing.hasPrivateCR,
    has_water_tank: listing.hasWaterTank,
    has_covered_moto_parking: listing.hasCoveredMotoParking,
    landlord_name: listing.landlordName,
    landlord_local_call_name: listing.landlordLocalCallName,
    landlord_initials: listing.landlordInitials,
    landlord_since_year: listing.landlordSinceYear,
    landlord_phone: listing.landlordPhone,
    landlord_kyc_verified: listing.landlordKycVerified,
    landlord_response_note: listing.landlordResponseNote,
    days_until_expiry: listing.daysUntilExpiry,
    last_updated_date: listing.lastUpdatedDate,
    visual_palette: listing.visualPalette,
  };
}

export function mapDbRowToListing(
  row: DbListingRow,
  reviews: TenantReview[]
): BoardingHouseListing {
  return {
    id: row.id,
    title: row.title,
    localSubtitle: row.local_subtitle,
    barangay: row.barangay,
    streetAddress: row.street_address,
    nearestCampus: row.nearest_campus,
    distanceMeters: Number(row.distance_meters),
    walkMinutes: Number(row.walk_minutes),
    trikeFarePhp: Number(row.trike_fare_php),
    lat: Number(row.lat),
    lng: Number(row.lng),
    monthlyRentPhp: Number(row.monthly_rent_php),
    roomType: row.room_type,
    genderPolicy: row.gender_policy,
    totalSlots: Number(row.total_slots),
    availableSlots: Number(row.available_slots),
    waterIncluded: Boolean(row.water_included),
    waterNote: row.water_note,
    capelcoStandard: Boolean(row.capelco_standard),
    declaredKwhRate: Number(row.declared_kwh_rate),
    crowdsourcedKwhRate: Number(row.crowdsourced_kwh_rate),
    meteringType: row.metering_type,
    floodRisk: row.flood_risk,
    floodHistoryNote: row.flood_history_note,
    elevationMetersAboveStreet: Number(row.elevation_meters_above_street),
    bfpVerified: Boolean(row.bfp_verified),
    bfpCertNumber: row.bfp_cert_number,
    bfpInspectionDate: row.bfp_inspection_date,
    fireExtinguishersCount: Number(row.fire_extinguishers_count),
    hasDedicatedFireExit: Boolean(row.has_dedicated_fire_exit),
    gateSecurity: row.gate_security,
    curfewPolicy: row.curfew_policy,
    visitorPolicy: row.visitor_policy,
    brownoutBackup: row.brownout_backup,
    wifiIncluded: Boolean(row.wifi_included),
    wifiSpeedNote: row.wifi_speed_note,
    hasStudyArea: Boolean(row.has_study_area),
    hasKitchenAccess: Boolean(row.has_kitchen_access),
    hasLaundryArea: Boolean(row.has_laundry_area),
    hasPrivateCR: Boolean(row.has_private_cr),
    hasWaterTank: Boolean(row.has_water_tank),
    hasCoveredMotoParking: Boolean(row.has_covered_moto_parking),
    landlordName: row.landlord_name,
    landlordLocalCallName: row.landlord_local_call_name,
    landlordInitials: row.landlord_initials,
    landlordSinceYear: Number(row.landlord_since_year),
    landlordPhone: row.landlord_phone,
    landlordKycVerified: Boolean(row.landlord_kyc_verified),
    landlordResponseNote: row.landlord_response_note,
    daysUntilExpiry: Number(row.days_until_expiry),
    lastUpdatedDate: row.last_updated_date,
    visualPalette: row.visual_palette,
    reviews,
  };
}

export function mapReviewToDbRow(listingId: string, review: TenantReview): DbReviewRow {
  return {
    id: review.id,
    listing_id: listingId,
    reviewer_name: review.reviewerName,
    reviewer_initials: review.reviewerInitials,
    program_and_year: review.programAndYear,
    stay_period: review.stayPeriod,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    reported_kwh_rate: review.reportedKwhRate,
    verification_method: review.verificationMethod,
    verified_date: review.verifiedDate,
    landlord_reply: review.landlordReply,
  };
}

export function mapDbRowToReview(row: DbReviewRow): TenantReview {
  return {
    id: row.id,
    reviewerName: row.reviewer_name,
    reviewerInitials: row.reviewer_initials,
    programAndYear: row.program_and_year,
    stayPeriod: row.stay_period,
    rating: Number(row.rating),
    title: row.title,
    comment: row.comment,
    reportedKwhRate: Number(row.reported_kwh_rate),
    verificationMethod: row.verification_method,
    verifiedDate: row.verified_date,
    landlordReply: row.landlord_reply,
  };
}

export function mapVisitToDbRow(visit: ScheduledVisit): DbVisitRow {
  return {
    id: visit.id,
    listing_id: visit.listingId,
    listing_title: visit.listingTitle,
    barangay: visit.barangay,
    street_address: visit.streetAddress,
    landlord_name: visit.landlordName,
    landlord_call_name: visit.landlordCallName,
    landlord_phone: visit.landlordPhone,
    monthly_rent_php: visit.monthlyRentPhp,
    visit_date: visit.visitDate,
    visit_time_slot: visit.visitTimeSlot,
    student_name: visit.studentName,
    student_phone: visit.studentPhone,
    student_campus: visit.studentCampus,
    occupants_count: visit.occupantsCount,
    status: visit.status,
    inspection_notes: visit.inspectionNotes,
    checklist: visit.checklist,
    created_at: visit.createdAt,
  };
}

export function mapDbRowToVisit(row: DbVisitRow): ScheduledVisit {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitle: row.listing_title,
    barangay: row.barangay,
    streetAddress: row.street_address,
    landlordName: row.landlord_name,
    landlordCallName: row.landlord_call_name,
    landlordPhone: row.landlord_phone,
    monthlyRentPhp: Number(row.monthly_rent_php),
    visitDate: row.visit_date,
    visitTimeSlot: row.visit_time_slot,
    studentName: row.student_name,
    studentPhone: row.student_phone,
    studentCampus: row.student_campus,
    occupantsCount: Number(row.occupants_count),
    status: row.status,
    inspectionNotes: row.inspection_notes,
    checklist: row.checklist,
    createdAt: row.created_at,
  };
}

/**
 * Fetches live listings and reviews from Supabase if configured.
 */
export async function fetchCloudDataset(): Promise<{
  listings: BoardingHouseListing[] | null;
  visits: ScheduledVisit[] | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { listings: null, visits: null, error: null };
  }

  const [listingsRes, reviewsRes, visitsRes] = await Promise.all([
    supabaseSelect<DbListingRow>('listings', 'select=*&is_archived=eq.false'),
    supabaseSelect<DbReviewRow>('tenant_reviews', 'select=*'),
    supabaseSelect<DbVisitRow>('scheduled_visits', 'select=*'),
  ]);

  if (listingsRes.error || !listingsRes.data) {
    return {
      listings: null,
      visits: null,
      error: listingsRes.error || 'Failed to fetch listings',
    };
  }

  const allReviews = reviewsRes.data || [];
  const mappedListings = listingsRes.data.map((row) => {
    const rowReviews = allReviews
      .filter((r) => r.listing_id === row.id)
      .map(mapDbRowToReview);
    return mapDbRowToListing(row, rowReviews);
  });

  const mappedVisits = visitsRes.data ? visitsRes.data.map(mapDbRowToVisit) : null;

  return {
    listings: mappedListings.length > 0 ? mappedListings : null,
    visits: mappedVisits,
    error: null,
  };
}

/**
 * Pushes current local listings and reviews to Supabase (used for one-click cloud sync).
 */
export async function syncLocalDatasetToCloud(
  listings: BoardingHouseListing[],
  visits: ScheduledVisit[]
): Promise<{ syncedCount: number; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      syncedCount: 0,
      error: 'Supabase credentials are not set in .env.local yet.',
    };
  }

  const dbListings = listings.map(mapListingToDbRow);
  const dbReviews = listings.flatMap((l) =>
    l.reviews.map((r) => mapReviewToDbRow(l.id, r))
  );
  const dbVisits = visits.map(mapVisitToDbRow);

  const lRes = await supabaseUpsert('listings', dbListings, 'id');
  if (lRes.error) {
    return { syncedCount: 0, error: lRes.error };
  }

  if (dbReviews.length > 0) {
    const rRes = await supabaseUpsert('tenant_reviews', dbReviews, 'id');
    if (rRes.error) {
      return { syncedCount: listings.length, error: rRes.error };
    }
  }

  if (dbVisits.length > 0) {
    await supabaseUpsert('scheduled_visits', dbVisits, 'id');
  }

  return { syncedCount: listings.length, error: null };
}

export async function pushSingleListingToCloud(listing: BoardingHouseListing) {
  if (!isSupabaseConfigured()) return;
  await supabaseUpsert('listings', [mapListingToDbRow(listing)], 'id');
}

export async function pushSingleReviewToCloud(
  listingId: string,
  review: TenantReview,
  newCrowdsourcedKwh: number
) {
  if (!isSupabaseConfigured()) return;
  await Promise.all([
    supabaseUpsert('tenant_reviews', [mapReviewToDbRow(listingId, review)], 'id'),
    supabaseUpdate('listings', `id=eq.${encodeURIComponent(listingId)}`, {
      crowdsourced_kwh_rate: newCrowdsourcedKwh,
    }),
  ]);
}

export async function pushSingleVisitToCloud(visit: ScheduledVisit) {
  if (!isSupabaseConfigured()) return;
  await supabaseUpsert('scheduled_visits', [mapVisitToDbRow(visit)], 'id');
}

export async function removeVisitFromCloud(visitId: string) {
  if (!isSupabaseConfigured()) return;
  await supabaseDelete('scheduled_visits', `id=eq.${encodeURIComponent(visitId)}`);
}
