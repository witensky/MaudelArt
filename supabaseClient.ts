
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.',
  );
}

const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

const fetchWithTimeout: typeof fetch = async (input, init) => {
  const timeoutController = new AbortController();

  // Combine any caller-provided signal with our timeout signal.
  let signal: AbortSignal = timeoutController.signal;
  if (init?.signal) {
    const anySignal = (AbortSignal as any).any;
    if (typeof anySignal === 'function') {
      signal = anySignal([init.signal, timeoutController.signal]);
    } else {
      // Fallback for older environments without AbortSignal.any().
      init.signal.addEventListener('abort', () => timeoutController.abort(), { once: true });
    }
  }

  const timeoutId = globalThis.setTimeout(() => timeoutController.abort(), DEFAULT_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal });
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
};

// Help diagnose environment mismatches without exposing secrets.
if (typeof window !== 'undefined') {
  (window as any).__SUPABASE_URL__ = supabaseUrl ?? null;
  (window as any).__SUPABASE_HAS_ANON_KEY__ = Boolean(supabaseAnonKey);
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: fetchWithTimeout,
  },
});
