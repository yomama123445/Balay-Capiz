/**
 * BalayCapiz — Lightweight Zero-Dependency Supabase REST & Storage Client
 * Communicates directly with Supabase PostgREST (/rest/v1) and Storage (/storage/v1)
 * Works seamlessly across Web, PWA Service Worker, and Capacitor Android/iOS WebViews.
 */

const rawUrl =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL) ||
  '';
const rawAnonKey =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY) ||
  '';

export const SUPABASE_URL = rawUrl.replace(/\/$/, '');
export const SUPABASE_ANON_KEY = rawAnonKey.trim();

export function isSupabaseConfigured(): boolean {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    SUPABASE_URL.startsWith('https://') &&
    !SUPABASE_URL.includes('your-project-id') &&
    SUPABASE_ANON_KEY !== 'your-supabase-anon-public-key'
  );
}

function getHeaders(extraHeaders?: Record<string, string>): HeadersInit {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
}

export async function supabaseSelect<T>(
  table: string,
  query = 'select=*'
): Promise<{ data: T[] | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase not configured' };
  }
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errText = await response.text();
      return { data: null, error: errText || response.statusText };
    }
    const data = (await response.json()) as T[];
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export async function supabaseUpsert<T>(
  table: string,
  payload: unknown,
  onConflict = 'id'
): Promise<{ data: T[] | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase not configured' };
  }
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`,
      {
        method: 'POST',
        headers: getHeaders({
          Prefer: 'resolution=merge-duplicates,return=representation',
        }),
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      return { data: null, error: errText || response.statusText };
    }
    const data = (await response.json()) as T[];
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export async function supabaseUpdate<T>(
  table: string,
  matchQuery: string,
  payload: Record<string, unknown>
): Promise<{ data: T[] | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase not configured' };
  }
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchQuery}`, {
      method: 'PATCH',
      headers: getHeaders({
        Prefer: 'return=representation',
      }),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errText = await response.text();
      return { data: null, error: errText || response.statusText };
    }
    const data = (await response.json()) as T[];
    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export async function supabaseDelete(
  table: string,
  matchQuery: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase not configured' };
  }
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchQuery}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errText = await response.text();
      return { error: errText || response.statusText };
    }
    return { error: null };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export async function supabaseUploadFile(
  bucket: 'property-photos' | 'verification-docs',
  filePath: string,
  file: Blob | File
): Promise<{ publicUrl: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { publicUrl: null, error: 'Supabase not configured' };
  }
  try {
    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'x-upsert': 'true',
        },
        body: file,
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      return { publicUrl: null, error: errText || response.statusText };
    }
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
    return { publicUrl, error: null };
  } catch (err) {
    return {
      publicUrl: null,
      error: err instanceof Error ? err.message : 'Upload failed',
    };
  }
}
