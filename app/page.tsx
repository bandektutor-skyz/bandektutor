'use client';
import { useState } from 'react';
import { supabase } from '../supabaseClient'; // ดึงตัวเชื่อมต่อหลังบ้านตัวจริง

export default function HomePage() {
  // ระบบจัดการสถานะป็อปอัป และตัวแปรเก็บข้อมูลฟอร์มสมัครเรียน
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); // เก็บเบอร์โทรศัพท์ตอนล็อกอินพิมพ์
  const [displayStudentName, setDisplayStudentName] = useState(''); // แสดงชื่อจริงเมื่อเช็คผ่าน
  
  // ตัวแปรรับค่าจากฟอร์มแจ้งโอนเงิน
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [slipFile, setSlipFile] = useState<File | null>(null); // ช่องเก็บไฟล์รูปภาพสลิปจริง
  const [statusMessage, setStatusMessage] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  // คลังข้อมูลคอร์สเรียนเตรียมสอบข้าราชการและตำรวจครบถ้วน 5 คอร์สใหญ่
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
    },
    {
      id: 4,
      title: '👮 คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)',
      description: 'ติวเข้ม 6 วิชาหลัก ความสามารถทั่วไป, ภาษาไทย, ภาษาอังกฤษ, กฎหมายที่ประชาชนควรรู้, คอมพิวเตอร์ และเทคโนโลยีสารสนเทศ เจาะข้อสอบเก่าแน่น ๆ',
      price: 1990,
      badge: 'มาใหม่ 🚨'
    },
    {
      id: 5,
      title: '💼 คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)',
      description: 'เจาะลึกเนื้อหาสำหรับสายอก. โดยเฉพาะ เน้นวิชาสารบรรณ งานธุรการ คอมพิวเตอร์ สังคมวัฒนธรรม จริยธรรม และภาษาต่างประเทศ พร้อมสรุปสูตรลัด',
      price: 1890,
      badge: 'แนะนำ 🎯'
    }
  ];

  // ฟังก์ชันหลักดักจับไฟล์รูปภาพตอนที่นักเรียนเลือกไฟล์สลิป
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlipFile(e.target.files[0]);
    }
  };

  // ฟังก์ชันวิ่งไปเช็คข้อมูลใน Supabase พร้อมแจกตั๋วความจำข้ามหน้าต่างอัตโนมัติ
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrorMessage('⏳ กำลังตรวจสอบรายชื่อในฐานข้อมูลหลังบ้าน...');
    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('*')
        .eq('student_phone', username.trim())
        .eq('status', 'อนุมัติแล้ว');

      if (error) throw error;

      if (data && data.length > 0) {
        const currentStudent = data[0];
        setDisplayStudentName(currentStudent.student_name);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setLoginErrorMessage('');
        localStorage.setItem('user_phone', currentStudent.student_phone);
        localStorage.setItem('user_name', currentStudent.student_name);
        localStorage.setItem('user_course', currentStudent.course_title);
      } else {
        setIsLoggedIn(false);
        setLoginErrorMessage('❌ ไม่พบสิทธิ์! เบอร์โทรนี้ยังไม่ได้ลงทะเบียน หรือแอดมินยังไม่ได้กดอนุมัติเข้าเรียนครับ');
      }
    } catch (error: any) {
      setLoginErrorMessage(`❌ ระบบเชื่อมต่อผิดพลาด: ${error.message}`);
    }
  };

  // [จุดอัปเกรดสำคัญ] ฟังก์ชันส่งใบสมัครตัวฟูล สั่งอัปโหลดรูปภาพสลิปจริงขึ้น Storage และบันทึกลิงก์คู่รายชื่อ
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipFile) {
      setStatusMessage('❌ กรุณาแนบภาพสลิปการโอนเงินก่อนส่งระบบครับ');
      return;
    }

    setStatusMessage('⏳ กำลังอัปโหลดรูปภาพสลิปเข้าสู่ระบบคลาวด์...');
    let imageUrl = '';

    try {
      // 1. ตั้งชื่อไฟล์ใหม่ด้วยเบอร์โทร + เวลาปัจจุบันเพื่อไม่ให้ชื่อไฟล์ซ้ำกันในคลังคลาวด์
      const fileExt = slipFile.name.split('.').pop();
      const fileName = `${studentPhone}_${Date.now()}.${fileExt}`;

      // 2. สั่งยิงไฟล์รูปภาพตัวจริงเข้าสู่ Bucket หลังบ้านที่ชื่อว่า slips
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('slips')
        .upload(fileName, slipFile);

      if (uploadError) throw uploadError;

      // 3. ดึงลิงก์รูปภาพสาธารณะ (Public URL) ตัวจริงกลับมาใช้งาน
      const { data: publicUrlData } = supabase.storage
        .from('slips')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;

      setStatusMessage('⏳ บันทึกรูปภาพสำเร็จ กำลังบันทึกข้อมูลใบสมัครเรียน...');

      // 4. สั่งเซฟข้อมูลอักษรพร้อมตัว "ลิงก์รูปภาพสลิป" ตัวจริงลงตาราง enrollment หลังบ้าน
      const { error: insertError } = await supabase
        .from('enrollment')
        .insert([
          {
            student_name: studentName,
            student_phone: studentPhone,
            course_title: selectedCourse,
            slip_url: imageUrl // บันทึกลิงก์รูปภาพตัวจริงลงฐานข้อมูลอย่างสมบูรณ์แบบ
          }
        ]);

      if (insertError) throw insertError;

      setStatusMessage('✅ บันทึกใบสมัครสำเร็จและอัปโหลดสลิปเรียบร้อย! เจ้าหน้าที่จะตรวจสอบยอดเงินภายใน 15 นาทีครับ');
      
      setStudentName('');
      setStudentPhone('');
      setSlipFile(null);
      setTimeout(() => {
        setSelectedCourse(null);
        setStatusMessage('');
      }, 4000);

    } catch (error: any) {
      console.error(error);
      setStatusMessage(`❌ เกิดข้อผิดพลาดหลังบ้าน: ${error.message}`);
    }
  };

  return (
    <div style={{ fontFamily: '"ChulaCharasNew", "Helvetica Neue", sans-serif', color: '#333', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
      {/* 1. แถบเมนูด้านบน (Navbar) */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#0070f3', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
          🎓 บ้านเด็กติวเตอร์
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: '500', alignItems: 'center' }}>
          <span style={{ cursor: 'pointer', color: '#0070f3' }}>หน้าแรก</span>
          <span style={{ cursor: 'pointer', color: '#666' }} onClick={() => window.location.href = '/classroom'}>ห้องเรียนออนไลน์</span>
          
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#28a745', fontWeight: 'bold' }}>👤 สวัสดี, คุณ {displayStudentName}</span>
              <button 
                onClick={() => { 
                  localStorage.removeItem('user_phone');
                  localStorage.removeItem('user_name');
                  localStorage.removeItem('user_course');
                  setIsLoggedIn(false); 
                  setUsername(''); 
                }} 
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setShowLoginModal(true); setLoginErrorMessage(''); }}
              style={{ backgroundColor: '#0070f3', color: 'white', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 6px rgba(0,112,243,0.3)' }}
            >
              🔐 เข้าสู่ระบบนักเรียน
            </button>
          )}
        </div>
      </nav>

      {/* 2. ส่วนโปรโมทหลัก (Hero Section) */}
      <header style={{ padding: '5rem 2rem', textAlign: 'center', color: 'white', background: 'linear-gradient(135deg, #0052cc 0%, #00a4ff 100%)' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          สานฝันเส้นทางข้าราชการและผู้พิทักษ์สันติราษฎร์
        </h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
          เปลี่ยนเรื่องยากให้เป็นเรื่องง่าย โจทย์ยากแค่ไหนก็ผ่านฉลุยด้วยสูตรลัดเฉพาะตัว ติวจัดเต็มวิชาหลักเพื่อความสำเร็จของคุณวันนี้
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <a 
            href="/classroom"
            style={{ backgroundColor: '#fff', color: '#0052cc', border: 'none', padding: '0.8rem 2rem', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', textDecoration: 'none', display: 'inline-block' }}
          >
            🚀 คลิกเข้าสู่ห้องเรียนออนไลน์ตัวจริง
          </a>
        </div>
      </header>

      {/* 3. ส่วนแสดงรายชื่อคอร์สเรียน (Course Grid) */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#111', marginBottom: '0.5rem' }}>🎯 คอร์สติวสอบราชการและตำรวจยอดนิยม</h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>เลือกคอร์สที่ใช่เพื่ออนาคตข้าราชการที่มั่นคงของคุณ</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {courses.map((course) => (
            <div key={course.id} style={{ backgroundColor: '#fff', border: '1px solid #e1e8ed', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.03)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
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

        {/* ระบบแจ้งชำระเงินและฟอร์มรับรูปสลิปส่งเข้าคลาวด์ Storage */}
        {selectedCourse && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', zIndex: 1000, alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>💳</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', textAlign: 'center' }}>ขั้นตอนการชำระเงินสมัครเรียน</h3>
              <p style={{ color: '#555', marginBottom: '1rem', textAlign: 'center' }}>คุณเลือก: <strong style={{ color: '#0070f3' }}>{selectedCourse}</strong></p>
              
              <div style={{ backgroundColor: '#f0f4f8', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>🏦 <strong>ธนาคารกสิกรไทย (K-Bank)</strong></p>
                <p style={{ margin: '0 0 0.5rem 0' }}>เลขที่บัญชี: <strong>123-4-56789-0</strong></p>
                <p style={{ margin: 0 }}>ชื่อบัญชี: <strong>บจก. บ้านเด็กติวเตอร์ (ประเทศไทย)</strong></p>
              </div>

              {statusMessage && (
                <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', backgroundColor: statusMessage.includes('❌') ? '#fff0f0' : '#f6ffed', border: statusMessage.includes('❌') ? '1px solid #ffa39e' : '1px solid #b7eb8f', color: '#333', fontSize: '0.95rem', fontWeight: 'bold' }}>
                  {statusMessage}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.9rem' }}>ชื่อ-นามสกุล ผู้สมัคร:</label>
                  <input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="เช่น สมชาย ตั้งใจเรียน" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.9rem' }}>เบอร์โทรศัพท์ติดต่อ:</label>
                  <input type="tel" required value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} placeholder="เช่น 098-7654321" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.9rem' }}>แนบภาพสลิปการโอนเงิน:</label>
                  {/* ผูกฟังก์ชัน onChange เพื่อดักจับไฟล์รูปภาพสลิปจริงของคอร์สตำรวจ */}
                  <input type="file" required accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '0.5rem 0' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setSelectedCourse(null)} style={{ flex: 1, backgroundColor: '#666', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>ยกเลิก</button>
                  <button type="submit" style={{ flex: 2, backgroundColor: '#28a745', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📤 ส่งสลิปแจ้งชำระเงิน</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ป๊อปอัปฟอร์มเข้าสู่ระบบนักเรียน */}
        {showLoginModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', zIndex: 1000, alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>เข้าสู่ระบบนักเรียน</h3>
              
              {loginErrorMessage && (
                <div style={{ padding: '0.8rem', marginBottom: '1rem', borderRadius: '6px', backgroundColor: loginErrorMessage.includes('❌') ? '#fff0f0' : '#e6f0ff', color: loginErrorMessage.includes('❌') ? '#dc3545' : '#0052cc', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'left' }}>
                  {loginErrorMessage}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.9rem' }}>เบอร์โทรศัพท์ที่ใช้สมัครเรียน:</label>
                  <input 
                    type="tel" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="กรอกเบอร์โทร 10 หลักของคุณ" 
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', fontSize: '0.9rem' }}>รหัสผ่านความปลอดภัย (ใส่รหัสใดก็ได้):</label>
                  <input type="password" required placeholder="••••••••" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowLoginModal(false)} style={{ flex: 1, backgroundColor: '#666', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>ปิด</button>
                  <button type="submit" style={{ flex: 2, backgroundColor: '#0070f3', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🔓 ยืนยันเข้าสู่ระบบ</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* 4. ส่วนท้ายเว็บ */}
      <footer style={{ backgroundColor: '#111', color: '#888', padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid #222' }}>
        <p style={{ margin: 0, fontSize: '0.95rem' }}>© 2026 บ้านเด็กติวเตอร์ (Bandektutor) - สงวนลิขสิทธิ์ทุกประการ</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#555' }}>พัฒนาโดยแพลตฟอร์ม Next.js + Node.js ระดับมืออาชีพ</p>
      </footer>

    </div>
  );
}
