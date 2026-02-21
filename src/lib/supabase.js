import { createClient } from '@supabase/supabase-js';

// ⚠️ Replace these with YOUR values from Supabase dashboard
// Settings → API → Project URL and anon/public key
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
