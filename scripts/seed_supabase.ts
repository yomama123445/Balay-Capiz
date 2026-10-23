/**
 * BalayCapiz — Automated Database Seeding Script for Supabase
 * Usage:
 *   1. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in .env.local
 *   2. Run `npm run db:seed`
 */

import dotenv from 'dotenv';
import path from 'path';
import { CAMPUSES, INITIAL_LISTINGS } from '../src/data/roxasHousingData';
import { INITIAL_SCHEDULED_VISITS } from '../src/types/appTypes';
import {
  mapListingToDbRow,
  mapReviewToDbRow,
  mapVisitToDbRow,
} from '../src/services/housingService';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

async function upsertTable(table: string, rows: unknown[], conflictKey = 'id') {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${conflictKey}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(rows),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed upserting ${table}: ${response.status} ${text}`);
  }
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('your-project-id')) {
    console.error(
      'Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local'
    );
    process.exit(1);
  }

  console.log(`Seeding BalayCapiz database at ${SUPABASE_URL}...`);

  const campusRows = CAMPUSES.map((c) => ({
    id: c.id,
    name: c.name,
    short_name: c.shortName,
    barangay: c.barangay,
    address: c.address,
    lat: c.lat,
    lng: c.lng,
    student_count_note: c.studentCountNote,
    trike_note: c.trikeNote,
  }));

  await upsertTable('campuses', campusRows);
  console.log(`✓ Seeded ${campusRows.length} Roxas City campuses.`);

  const listingRows = INITIAL_LISTINGS.map(mapListingToDbRow);
  await upsertTable('listings', listingRows);
  console.log(`✓ Seeded ${listingRows.length} verified boarding house listings.`);

  const reviewRows = INITIAL_LISTINGS.flatMap((l) =>
    l.reviews.map((r) => mapReviewToDbRow(l.id, r))
  );
  await upsertTable('tenant_reviews', reviewRows);
  console.log(`✓ Seeded ${reviewRows.length} verified student tenancy reviews.`);

  const visitRows = INITIAL_SCHEDULED_VISITS.map(mapVisitToDbRow);
  await upsertTable('scheduled_visits', visitRows);
  console.log(`✓ Seeded ${visitRows.length} scheduled room inspections.`);

  console.log('BalayCapiz Supabase seeding complete!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
