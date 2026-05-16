const { createClient } = require('@supabase/supabase-js');

// 1. ดึงค่าคีย์เชื่อมต่อจากระบบหลังบ้าน
const supabaseUrl = 'https://tapfpgdaaidyrbmfouds.supabase.co';
const supabaseAnonKey = 'sb_publishable_fLoEfuAcX0bQabvcQGxxkQ_c_XNWlo3';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedData() {
  console.log('⏳ กำลังยิงข้อมูลคอร์สเรียนเข้าฐานข้อมูล Supabase...');

  // 2. ข้อมูลคอร์สเรียนเตรียมสอบราชการที่คุณต้องการใส่ลงระบบ
  const courseData = {
    title: 'คอร์สติวสอบ ก.พ. ภาค ก. ฉบับผ่านชัวร์',
    description: 'สรุปเนื้อหาคณิตศาสตร์ ภาษาไทย และกฎหมายข้าราชการที่ดี ครบจบพร้อมสอบใน 30 วัน',
    price: 1500
  };

  // 3. สั่งบันทึกลงตาราง courses
  const { data, error } = await supabase
    .from('courses')
    .insert([courseData])
    .select();

  if (error) {
    console.error('❌ เกิดข้อผิดพลาดในการใส่ข้อมูล:', error.message);
  } else {
    console.log('✅ เติมข้อมูลคอร์สเรียนสำเร็จเรียบร้อยแล้ว!');
    console.log('ข้อมูลที่บันทึก:', data);
  }
}

seedData();
