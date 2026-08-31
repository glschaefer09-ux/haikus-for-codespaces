/**
 * Public, non-secret build-time config for the optional Cross PC Sync (Pro) tier.
 * The Supabase URL + anon key are safe to ship in the client — access is enforced
 * by Postgres Row Level Security, not by keeping these values secret.
 * Placeholders until a Supabase project is provisioned (see supabase/migrations).
 */
export const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL ?? 'https://YOUR-PROJECT.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY ?? 'YOUR-ANON-KEY';

export const SYNC_SUBSCRIPTION_PRICE_USD = 15;
export const SYNC_SUBSCRIPTION_INTERVAL = 'month';
export const APP_NAME = 'Cross PC AI';

/** True once a real Supabase project has been provisioned and its URL/anon key swapped in. */
export function isSyncConfigured(): boolean {
  return !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR-ANON-KEY');
}
