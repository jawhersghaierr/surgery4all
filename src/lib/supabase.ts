import { createClient } from '@supabase/supabase-js'

// Fallback placeholder so createClient() doesn't throw when the backend is
// unconfigured (e.g. local dev, tests). Callers must gate real usage behind
// isBackendConfigured() in src/lib/data.ts — this client is never queried
// when unconfigured.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

// Server-side client (service role). Do NOT import in client components.
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
