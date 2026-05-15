import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// สร้างตัวแปร Client สำหรับเรียกใช้งานฐานข้อมูล ดึงข้อสอบ หรือเช็คชื่อผู้ใช้
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
