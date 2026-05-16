import { createClient } from '@supabase/supabase-js';

// วางค่าลิงก์และคีย์เชื่อมต่อของโปรเจกต์คุณโดยตรง
const supabaseUrl = 'https://tapfpgdaaidyrbmfouds.supabase.co';
const supabaseAnonKey = 'sb_publishable_fLoEfuAcX0bQabvcQGxxkQ_c_XNWlo3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
