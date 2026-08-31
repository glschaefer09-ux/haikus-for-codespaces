import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSyncConfigured } from '@shared/constants';

let client: SupabaseClient | null = null;

/** Lazily created — only ever called from code paths already gated by isSyncConfigured(). */
export function getSupabaseClient(): SupabaseClient {
  if (!isSyncConfigured()) {
    throw new Error('Cross PC Sync is not configured yet.');
  }
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}
