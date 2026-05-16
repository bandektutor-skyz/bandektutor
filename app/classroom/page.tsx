'use client';
import { useState } from 'react';

export default function ClassroomPage() {
  // คลังข้อมูลบทเรียนติวสอบ ก.พ. พิมพ์เล็กล้วน ปลอดภัย 100%
  const lessons = [
    { id: 1, title: 'EP 1: เจาะลึกโครงสร้างข้อสอบ ก.พ. และเทคนิคการเตรียมตัว', duration: '15:20 นาที', youtubeid: 'g9z7FstC4j0' },
    { id: 2, title: 'EP 2: คณิตศาสตร์ - เทคนิคคิดเลขเร็วและการหา ห.ร.ม. / ค.ร.น.', duration: '45:10 นาที', youtubeid: 'Jg7W_mX95uU' },
    { id: 3, title: 'EP 3: ภาษาไทย - การอุปมาอุปไมย จับจุดสังเกตคำคีย์เวิร์ด', duration: '30:15 นาที', youtubeid: 'O9YwE8_O5rI' },
    { id: 4, title: 'EP 4: กฎหมายข้าราชการ - สรุป พ.ร.บ. ระเบียบบริหารราชการแผ่นดิน', duration: '55:40 นาที', youtubeid: '7P6F_S87Fls' },
  ];

  // ดึงข้อมูลบทเรียนแรกสุดมาแสดงผลตอนเริ่มต้น
  const [currentlesson, setCurrentlesson] = useState(lessons[0]);

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ส่วนหัวของห้องเรียนออนไลน์ - ปรับปรุงปุ่มขากลับให้เสถียรไร้บั๊ก */}
      <header style={{ backgroundColor: '#0052cc', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>✍️ ระบบห้องเรียนออนไลน์ | บ้านเด็กติวเตอร์</h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>คอร์ส: ติวสอบ ก.พ. ภาค ก. (ฉบับผ่านชัวร์)</p>
        </div>
        
        {/* จุดแก้ไขสำคัญ: เปลี่ยนปุ่มขากลับให้กลายเป็นแท็กนำทางมาตรฐานสากลเพื่อไม่ให้ระบบเอ๋อ */}
        <a 
          href="/"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}
        >
          ↩️ กลับหน้าหลัก
        </a>
      </header>
      {/* ส่วนเนื้อหาห้องเรียนแบบสองฝั่ง */}
      <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', maxWidth: '1400px', width: '100%', margin: '1.5rem auto', padding: '0 1rem', gap: '1.5rem' }}>
        
        {/* ฝั่งซ้าย: หน้าจอเล่นวิดีโอพรีเมียม */}
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

        {/* ฝั่งขวา: แถบรายการบทเรียนทั้งหมด (แก้ฟังก์ชันคลิกเปลี่ยนวิชาสะกดพิมพ์เล็กตรงกันเป๊ะ) */}
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
