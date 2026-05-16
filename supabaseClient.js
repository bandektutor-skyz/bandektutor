import { createClient } from '@supabase/supabase-js';

// กุญแจและที่อยู่เซิร์ฟเวอร์ฐานข้อมูลของโปรเจกต์คุณโดยตรง
const supabaseUrl = 'https://tapfpgdaaidyrbmfouds.supabase.co';
const supabaseAnonKey = 'sb_publishable_fLoEfuAcX0bQabvcQGxxkQ_c_XNWlo3';

// สร้างฟังก์ชันตัวเชื่อมต่อเพื่อส่งออก (Export) ไปให้หน้าอื่นๆ เรียกใช้งาน
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
