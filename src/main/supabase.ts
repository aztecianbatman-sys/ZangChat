import 'dotenv/config';
import {createClient} from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ozovnummecdkhdnnbvoi.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_YpzIj3fCr1urgugDIKKLDA_GYQ240Ot';

const url=process.env.SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
const key=process.env.SUPABASE_PUBLISHABLE_KEY ?? DEFAULT_SUPABASE_PUBLISHABLE_KEY;

if(!url||!key)throw new Error('Missing Supabase URL or publishable key.');

export const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
