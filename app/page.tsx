'use client';
import { useState } from 'react';

export default function HomePage() {
  // จำลองระบบสมัครเรียนเพื่อให้นักเรียนกดเล่นได้จริง
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // ข้อมูลคอร์สเรียนเชิงกลยุทธ์การตลาด (ดึงดูดผู้เรียนด้วยราคาและเนื้อหาที่ตรงจุด)
  const courses = [
    {
      id: 1,
      title: '🥇 คอร์สติวสอบ ก.พ. ภาค ก. (ฉบับผ่านชัวร์)',
      description: 'เจาะลึกวิชาคณิตศาสตร์ ภาษาไทย และภาษาอังกฤษ สรุปเทคนิคคิดเร็วที่ใช้สอบได้จริง พร้อมแนวข้อสอบเสมือนจริงกว่า 500 ข้อ',
      price: 1500,
      badge: 'ยอดนิยม 🔥'
    },
    {
      id: 2,
      title: '⚖️ คอร์สกฎหมายข้าราชการที่ดี (ทุกสนามสอบ)',
      description: 'สรุปพระราชบัญญัติและกฎหมายที่ออกสอบบ่อยที่สุด จำง่ายด้วยเทคนิคคำกลอนและ Mind Map อ่านจบพร้อมเก็บคะแนนเต็ม',
      price: 990,
      badge: 'คุ้มค่า 💡'
    },
    {
      id: 3,
      title: '🏛️ คอร์สติวสอบข้าราชการท้องถิ่น (ภาค ก. + ภาค ข.)',
      description: 'ติวเจาะลึกเก็งข้อสอบตรงประเด็นสำหรับสอบท้องถิ่นโดยเฉพาะ รวม พ.ร.บ. จัดตั้งท้องถิ่นครบทุกฉบับ พร้อมแนวข้อสอบเก่า',
      price: 2500,
      badge: 'แนะนำ ⭐'
    }
  ];

  return (
    <div style={{ fontFamily: '"ChulaCharasNew", "Helvetica Neue", sans-serif', color: '#333', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
      
      {/* 1. แถบเมนูด้านบน (Navbar) สไตล์สถาบันติวเตอร์ระดับพรีเมียม */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#0070f3', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🎓 บ้านเด็กติวเตอร์
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: '500' }}>
          <span style={{ cursor: 'pointer', color: '#0070f3' }}>หน้าแรก</span>
          <span style={{ cursor: 'pointer', color: '#666' }}>คอร์สทั้งหมด</span>
          <span style={{ cursor: 'pointer', color: '#666' }}>รีวิวผู้สอบผ่าน</span>
          <span style={{ cursor: 'pointer', color: '#666' }}>ติดต่อเรา</span>
        </div>
      </nav>

      {/* 2. ส่วนโปรโมทหลัก (Hero Section) วางจุดขายหลักของธุรกิจเพื่อดึงสายตานักเรียน */}
      <header style={{ padding: '5rem 2rem', textAlign: 'center', color: 'white', background: 'linear-gradient(135deg, #0052cc 0%, #00a4ff 100%)' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          สานฝันเส้นทางข้าราชการกับ "บ้านเด็กติวเตอร์"
        </h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
          เปลี่ยนเรื่องยากให้เป็นเรื่องง่าย อ่านเอง 3 เดือน ไม่เท่าติวกับเรา 3 ชั่วโมง อัปเดตเนื้อหาใหม่ล่าสุดปีล่าสุด เพื่ออัตราการสอบผ่านที่สูงที่สุดของคุณ
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button style={{ backgroundColor: '#fff', color: '#0052cc', border: 'none', padding: '0.8rem 2rem', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
            ทดลองเรียนฟรีวันนี้
          </button>
        </div>
      </header>
      {/* 3. ส่วนแสดงรายชื่อคอร์สเรียน (Course Grid) ดีไซน์สะอาด ลื่นไหล ไม่มีบั๊กฐานข้อมูล */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#111', marginBottom: '0.5rem' }}>🎯 คอร์สติวสอบราชการยอดนิยม</h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>เลือกคอร์สที่ใช่เพื่อความสำเร็จในอาชีพข้าราชการของคุณ</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {courses.map((course) => (
            <div key={course.id} style={{ backgroundColor: '#fff', border: '1px solid #e1e8ed', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.03)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              {/* รายละเอียดด้านบนของการ์ด */}
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ backgroundColor: '#e6f0ff', color: '#0070f3', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {course.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#111', marginBottom: '1rem', marginTop: 0, lineHeight: '1.4' }}>
                  {course.title}
                </h3>
                <p style={{ color: '#555', fontSize: '0.98rem', lineHeight: '1.6', margin: 0 }}>
                  {course.description}
                </p>
              </div>

              {/* ส่วนราคาและปุ่มกดด้านล่างของการ์ด */}
              <div style={{ padding: '1.5rem 2rem', backgroundColor: '#fafafa', borderTop: '1px solid #e1e8ed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#888', display: 'block' }}>ราคาคอร์ส</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111' }}>฿{course.price.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => setSelectedCourse(course.title)}
                  style={{ backgroundColor: '#0070f3', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 10px rgba(0,112,243,0.2)' }}
                >
                  สมัครเรียนเลย
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* ระบบจำลองป็อปอัปแสดงเมื่อนักเรียนกดสมัครเรียน */}
        {selectedCourse && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', zIndex: 1000, alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>เริ่มต้นเส้นทางข้าราชการของคุณ!</h3>
              <p style={{ color: '#555', marginBottom: '1.5rem' }}>คุณได้เลือกสมัคร: <strong>{selectedCourse}</strong></p>
              <p style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '2rem' }}>💡 ระบบการตลาดและการชำระเงิน พร้อมเชื่อมต่อในสเต็ปถัดไปครับ!</p>
              <button 
                onClick={() => setSelectedCourse(null)}
                style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. ส่วนท้ายเว็บ (Footer) แก้ไขบั๊กโค้ดสีเรียบร้อยแล้ว */}
      <footer style={{ backgroundColor: '#111', color: '#888', padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid #222' }}>
        <p style={{ margin: 0, fontSize: '0.95rem' }}>© 2026 บ้านเด็กติวเตอร์ (Bandektutor) - สงวนลิขสิทธิ์ทุกประการ</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#555' }}>พัฒนาโดยแพลตฟอร์ม Next.js + Node.js ระดับมืออาชีพ</p>
      </footer>

    </div>
  );
}
