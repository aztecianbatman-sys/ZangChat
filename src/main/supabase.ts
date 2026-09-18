import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../shared/database';
const url=process.env.SUPABASE_URL;
const key=process.env.SUPABASE_PUBLISHABLE_KEY;
if(!url||!key) throw new Error('Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY.');
export const supabase:SupabaseClient<Database>=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});