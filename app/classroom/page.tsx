'use client';
import { useState } from 'react';
import { supabase } from '../../supabaseClient'; // เชื่อมฐานข้อมูลเช็คสิทธิ์เบอร์โทรศัพท์

export default function ClassroomPage() {
  // 1. คลังข้อมูลบทเรียน ก.พ. พิมพ์เล็กล้วน
  const lessons = [
    { id: 1, title: 'EP 1: เจาะลึกโครงสร้างข้อสอบ ก.พ. และเทคนิคการเตรียมตัว', duration: '15:20 นาที', youtubeid: 'g9z7FstC4j0' },
    { id: 2, title: 'EP 2: คณิตศาสตร์ - เทคนิคคิดเลขเร็วและการหา ห.ร.ม. / ค.ร.น.', duration: '45:10 นาที', youtubeid: 'Jg7W_mX95uU' },
    { id: 3, title: 'EP 3: ภาษาไทย - การอุปมาอุปไมย จับจุดสังเกตคำคีย์เวิร์ด', duration: '30:15 นาที', youtubeid: 'O9YwE8_O5rI' },
    { id: 4, title: 'EP 4: กฎหมายข้าราชการ - สรุป พ.ร.บ. ระเบียบบริหารราชการแผ่นดิน', duration: '55:40 นาที', youtubeid: '7P6F_S87Fls' },
  ];

  // ระบบจัดการสถานะล็อกอินและการเข้าถึงสิทธิ์
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [studentName, setStudentName] = useState('');

  // [จุดแก้ไขสำคัญสุด] ใส่ [0] ต่อท้ายคำว่า lessons เพื่อระบุเจาะจงบทเรียนเดี่ยวตัวแรกสุด แก้ไขปัญหา Error ทั้ง 6 จุดทันที!
  const [currentlesson, setCurrentlesson] = useState(lessons[0]);

  // ฟังก์ชันส่องตรวจสอบเบอร์โทรศัพท์ในตาราง enrollment
  const handleCheckLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage('⏳ กำลังตรวจสอบสิทธิ์การเข้าเรียนจากหลังบ้าน...');

    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('*')
        .eq('student_phone', phoneInput.trim())
        .eq('status', 'อนุมัติแล้ว');

      if (error) throw error;

      if (data && data.length > 0) {
        setStudentName(data[0].student_name); // ดึงรายชื่อนักเรียนตัวจริงมาแสดง
        setIsAuthenticated(true);
        setLoginMessage('');
      } else {
        setLoginMessage('❌ ไม่พบสิทธิ์เข้าเรียน! เบอร์โทรนี้อาจจะยังไม่ได้สมัคร หรือแอดมินยังไม่ได้กดอนุมัติสลิปโอนเงินครับ');
      }
    } catch (error: any) {
      setLoginMessage(`❌ ระบบหลังบ้านติดขัด: ${error.message}`);
    }
  };

  // แสดงหน้าต่างล็อกอินคัดกรองเบอร์โทรศัพท์ (หากยังไม่ผ่านด่านความปลอดภัย)
  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e1e8ed' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ fontSize: '1.6rem', color: '#111', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>เข้าสู่ห้องเรียนออนไลน์</h2>
          <p style={{ color: '#666', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: '1.5' }}>
            เฉพาะนักเรียนคอร์สพรีเมียมที่ชำระเงินและได้รับการอนุมัติระบบแล้วเท่านั้น กรุณากรอกเบอร์โทรศัพท์ที่ใช้สมัครเพื่อตรวจสอบสิทธิ์ครับ
          </p>

          {loginMessage && (
            <div style={{ padding: '0.8rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: loginMessage.includes('❌') ? '#fff0f0' : '#e6f0ff', color: loginMessage.includes('❌') ? '#dc3545' : '#0052cc', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'left', lineHeight: '1.4' }}>
              {loginMessage}
            </div>
          )}

          <form onSubmit={handleCheckLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>เบอร์โทรศัพท์ของคุณ:</label>
              <input 
                type="tel" 
                required 
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="กรอกเบอร์โทร 10 หลัก เช่น 0812345678" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1rem' }} 
              />
            </div>
            <button type="submit" style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(0,82,204,0.25)' }}>
              🔓 ยืนยันสิทธิ์เข้าเรียน
            </button>
            <button type="button" onClick={() => window.location.href = '/'} style={{ backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'center', marginTop: '0.5rem' }}>
              ↩️ กลับหน้าหลักเว็บ
            </button>
          </form>
        </div>
      </div>
    );
  }
  // ส่วนแสดงหน้าจอห้องเรียนออนไลน์ (จะเปิดไฟเขียวให้แสดงผล ทันทีหลังจากกรอกเบอร์โทรที่อนุมัติแล้วสำเร็จ)
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ส่วนหัวของห้องเรียนออนไลน์ (Header) แสดงชื่อนักเรียนตัวจริงจากฐานข้อมูล */}
      <header style={{ backgroundColor: '#0052cc', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>✍️ ระบบห้องเรียนออนไลน์ | บ้านเด็กติวเตอร์</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.2rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>คอร์ส: ติวสอบ ก.พ. ภาค ก. (ฉบับผ่านชัวร์)</p>
            <span style={{ backgroundColor: '#28a745', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              👤 ผู้เรียน: คุณ {studentName}
            </span>
          </div>
        </div>
        <button 
          onClick={() => { setIsAuthenticated(false); window.location.href = '/'; }}
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ↩️ ออกจากห้องเรียน
        </button>
      </header>

      {/* ส่วนเนื้อหาห้องเรียนแบบสองฝั่ง */}
      <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', maxWidth: '1400px', width: '100%', margin: '1.5rem auto', padding: '0 1rem', gap: '1.5rem' }}>
        
        {/* ฝั่งซ้าย: หน้าจอเล่นวิดีโอพรีเมียม (ดึงค่าบทเรียนเดี่ยวได้ถูกต้อง ไร้บั๊กพิมพ์ใหญ่) */}
        <div style={{ flex: 2, minWidth: '350px' }}>
          <div style={{ backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <iframe
              key={currentlesson.id}
              width="100%"
              height="100%"
              src={`https://youtube.com{currentlesson.youtubeid}?autoplay=1`}
              title={currentlesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
          
          {/* รายละเอียดใต้คลิปวิดีโอ */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#111', fontSize: '1.3rem' }}>{currentlesson.title}</h2>
            <p style={{ color: '#666', margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>🕒 ระยะเวลาเรียน: {currentlesson.duration}</p>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e6f0ff', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ color: '#0052cc', fontWeight: 'bold', fontSize: '0.95rem' }}>📄 ชีทสรุปสูตรลัดและแนวข้อสอบสำหรับ EP นี้ (.PDF)</span>
              <button 
                onClick={() => alert('📥 ระบบกำลังดาวน์โหลดเอกสารประกอบการสอน...')}
                style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ดาวน์โหลดชีท
              </button>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: แถบรายการบทเรียนทั้งหมด */}
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem', borderBottom: '2px solid #0052cc', paddingBottom: '0.5rem' }}>
            📚 เนื้อหาบทเรียนในคอร์ส ({lessons.length} บทเรียน)
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {lessons.map((lesson) => {
              const isPlaying = lesson.id === currentlesson.id;
              return (
                <div 
                  key={lesson.id}
                  onClick={() => setCurrentlesson(lesson)}
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    border: isPlaying ? '2px solid #0052cc' : '1px solid #e1e8ed',
                    backgroundColor: isPlaying ? '#e6f0ff' : '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  <p style={{ margin: '0 0 0.2rem 0', fontWeight: 'bold', color: isPlaying ? '#0052cc' : '#333', fontSize: '0.95rem' }}>
                    {lesson.title}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>{lesson.duration}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
