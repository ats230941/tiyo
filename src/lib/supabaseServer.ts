import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// This client must only be used server-side (uses service role key)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRole)
