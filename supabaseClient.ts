
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.',
  );
}

// Help diagnose environment mismatches without exposing secrets.
if (typeof window !== 'undefined') {
  (window as any).__SUPABASE_URL__ = supabaseUrl ?? null;
  (window as any).__SUPABASE_HAS_ANON_KEY__ = Boolean(supabaseAnonKey);
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
