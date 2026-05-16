'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function ClassroomPage() {
  // ระบบจัดการสถานะล็อกอินและคัดกรองเนื้อหา
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  const [userCourse, setUserCourse] = useState(''); // ใช้จำแนกคอร์สเรียนหลักของนักเรียนคนนั้น

  // 1. คลังข้อมูลบทเรียนอัปเกรดแยกตามประเภทคอร์สเรียนตัวจริง (ก.พ. / นสต.ปราบปราม / นสต.อำนวยการ)
  const allCoursesContent: any = {
    '🥇 คอร์สติวสอบ ก.พ. ภาค ก. (ฉบับผ่านชัวร์)': [
      { id: 1, title: 'ก.พ. EP 1: เจาะลึกโครงสร้างข้อสอบ ก.พ. และเทคนิคการเตรียมตัว', duration: '15:20 นาที', youtubeid: 'g9z7FstC4j0', quizUrl: 'https://google.com...' },
      { id: 2, title: 'ก.พ. EP 2: คณิตศาสตร์ - เทคนิคคิดเลขเร็วและการหา ห.ร.ม. / ค.ร.น.', duration: '45:10 นาที', youtubeid: '7P6F_S87Fls', quizUrl: 'https://google.com...' },
      { id: 3, title: 'ก.พ. EP 3: ภาษาไทย - การอุปมาอุปไมย จับจุดสังเกตคำคีย์เวิร์ด', duration: '30:15 นาที', youtubeid: 'O9YwE8_O5rI', quizUrl: 'https://google.com...' }
    ],
    '👮 คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)': [
      { id: 1, title: 'นสต.ปราบปราม EP 1: เจาะลึกระเบียบการสอบ วิชาความสามารถทั่วไป (คณิตตำรวจ)', duration: '25:40 นาที', youtubeid: 'g9z7FstC4j0', quizUrl: 'https://google.com...' },
      { id: 2, title: 'นสต.ปราบปราม EP 2: กฎหมายเบื้องต้นที่ประชาชนควรรู้และออกสอบบ่อย', duration: '50:15 นาที', youtubeid: '7P6F_S87Fls', quizUrl: 'https://google.com...' },
      { id: 3, title: 'นสต.ปราบปราม EP 3: สรุปแนวข้อสอบคอมพิวเตอร์และเทคโนโลยีสารสนเทศ', duration: '35:20 นาที', youtubeid: 'O9YwE8_O5rI', quizUrl: 'https://google.com...' }
    ],
    '💼 คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)': [
      { id: 1, title: 'นสต.อำนวยการ EP 1: เจาะลึกระเบียบงานสารบรรณ พ.ศ. 2526 และงานธุรการตำรวจ', duration: '30:50 นาที', youtubeid: 'g9z7FstC4j0', quizUrl: 'https://google.com...' },
      { id: 2, title: 'นสต.อำนวยการ EP 2: ภาษาต่างประเทศ (English) การจำหลักไวยากรณ์ทำคะแนน', duration: '45:30 นาที', youtubeid: '7P6F_S87Fls', quizUrl: 'https://google.com...' },
      { id: 3, title: 'นสต.อำนวยการ EP 3: สังคม วัฒนธรรม จริยธรรม และหลักธรรมาภิบาลตำรวจ', duration: '40:10 นาที', youtubeid: 'O9YwE8_O5rI', quizUrl: 'https://google.com...' }
    ]
  };

  // ดักจับสถานะวิชาเริ่มต้นที่เปิดเรียน (Default เป็นอาร์เรย์ว่างก่อนดึงข้อมูลสำเร็จ)
  const [currentlesson, setCurrentlesson] = useState<any>(null);

  // ระบบจำลองเก็บข้อมูลสถิติมัดใจผู้เรียน
  const studentStats = { progress: '65%', completedLessons: 2, examScore: '19/20 คะแนน (ผ่านเกณฑ์ขั้นสูง 👮🎯)' };

  // ระบบจดจำล็อกอินข้ามหน้าอัตโนมัติ
  useEffect(() => {
    const savedPhone = localStorage.getItem('user_phone');
    const savedName = localStorage.getItem('user_name');
    const savedCourse = localStorage.getItem('user_course');
    
    if (savedPhone && savedName && savedCourse) {
      setStudentName(savedName);
      setUserCourse(savedCourse);
      setIsAuthenticated(true);
      
      // ดึงบทเรียนแรกของคอร์สที่สมัครมาจัดลงเครื่องเล่นวิดีโอทันที
      const courseLessons = allCoursesContent[savedCourse] || allCoursesContent['🥇 คอร์สติวสอบ ก.พ. ภาค ก. (ฉบับผ่านชัวร์)'];
      setCurrentlesson(courseLessons[0]);
    }
  }, []);
  // ฟังก์ชันส่องตรวจสอบเบอร์โทรศัพท์พร้อมคัดแยกคอร์สเรียนจริงจากตาราง enrollment
  const handleCheckLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage('⏳ กำลังตรวจสอบสิทธิ์และวิชาที่สมัครจากหลังบ้าน...');

    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('*')
        .eq('student_phone', phoneInput.trim())
        .eq('status', 'อนุมัติแล้ว');

      if (error) throw error;

      if (data && data.length > 0) {
        const studentData = data[0];
        const matchedCourse = studentData.course_title;

        setStudentName(studentData.student_name);
        setUserCourse(matchedCourse);
        setIsAuthenticated(true);
        setLoginMessage('');
        
        // ดึงบทเรียนแรกของคอร์สที่สอดคล้องมาจัดลงตัวเล่นวิดีโอ
        const courseLessons = allCoursesContent[matchedCourse] || allCoursesContent['🥇 คอร์สติวสอบ ก.พ. ภาค ก. (ฉบับผ่านชัวร์)'];
        setCurrentlesson(courseLessons[0]);

        // สลักตั๋วความจำรวมถึงชื่อคอร์สลงเครื่องนักเรียน
        localStorage.setItem('user_phone', studentData.student_phone);
        localStorage.setItem('user_name', studentData.student_name);
        localStorage.setItem('user_course', matchedCourse);
      } else {
        setLoginMessage('❌ ไม่พบสิทธิ์เข้าเรียน! เบอร์โทรนี้อาจจะยังไม่ได้สมัคร หรือแอดมินยังไม่ได้กดอนุมัติสลิปโอนเงินครับ');
      }
    } catch (error: any) {
      setLoginMessage(`❌ ระบบหลังบ้านติดขัด: ${error.message}`);
    }
  };

  // แสดงหน้าต่างล็อกอินคัดกรองเบอร์โทรศัพท์ (หากนักเรียนพิมพ์ลิงก์ห้องเรียนตรงๆ หรือตั๋วหมดอายุ)
  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e1e8ed' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ fontSize: '1.6rem', color: '#111', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>เข้าสู่ห้องเรียนออนไลน์</h2>
          <p style={{ color: '#666', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: '1.5' }}>
            เฉพาะนักเรียนคอร์สพรีเมียมที่ชำระเงินและได้รับการอนุมัติระบบแล้วเท่านั้น กรุณากรอกเบอร์โทรศัพท์ที่ใช้สมัครเพื่อตรวจสอบสิทธิ์วิชาเรียนครับ
          </p>

          {loginMessage && (
            <div style={{ padding: '0.8rem', marginBottom: '1.5rem', borderRadius: '8px', backgroundColor: '#fff0f0', color: '#dc3545', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'left' }}>
              {loginMessage}
            </div>
          )}

          <form onSubmit={handleCheckLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>เบอร์โทรศัพท์ของคุณ:</label>
              <input type="tel" required value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="กรอกเบอร์โทร 10 หลัก เช่น 0812345678" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
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

  // ดึงรายการบทเรียนเฉพาะของคอร์สที่นักเรียนคนนั้นมีสิทธิ์เรียนจริง
  const currentCourseLessons = allCoursesContent[userCourse] || allCoursesContent['🥇 คอร์สติวสอบ ก.พ. ภาค ก. (ฉบับผ่านชัวร์)'];
  
  // ป้องกันการเอ๋อในจังหวะสลับสายข้อมูล State
  const activeLesson = currentlesson || currentCourseLessons[0];
  // ส่วนแสดงหน้าจอห้องเรียนออนไลน์อัปเกรดใหม่ (จะเปิดไฟเขียวให้แสดงผล ทันทีที่มีตั๋วล็อกอินหรือเช็คสิทธิ์เบอร์โทรผ่าน)
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ส่วนหัวของห้องเรียนออนไลน์ (Header) แสดงชื่อและวิชาจริงจากฐานข้อมูล */}
      <header style={{ backgroundColor: '#0052cc', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>✍️ ระบบห้องเรียนออนไลน์ | บ้านเด็กติวเตอร์</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>คอร์สเรียนของคุณ: <strong style={{ color: '#ff9f43' }}>{userCourse}</strong></p>
            <span style={{ backgroundColor: '#28a745', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              👤 ผู้เรียน: คุณ {studentName}
            </span>
          </div>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('user_phone');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_course');
            setIsAuthenticated(false);
            window.location.href = '/';
          }}
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ↩️ ออกจากห้องเรียน
        </button>
      </header>

      {/* แผงข้อมูลแดชบอร์ดสถิติผู้เรียนพรีเมียมคัดกรองแยกคอร์ส */}
      <section style={{ maxWidth: '1400px', width: '100%', margin: '1.5rem auto 0 auto', padding: '0 1rem', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '5px solid #0052cc' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>📈 ความคืบหน้าการเรียน</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#0052cc' }}>{studentStats.progress}</span>
            <div style={{ width: '100%', backgroundColor: '#eee', height: '6px', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
              <div style={{ width: studentStats.progress, backgroundColor: '#0052cc', height: '100%' }}></div>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '5px solid #28a745' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>📚 บทเรียนที่ติวสำเร็จ</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#28a745' }}>{studentStats.completedLessons} / {currentCourseLessons.length} EP</span>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '5px solid #ff9f43' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>🎯 คะแนนทดสอบจำลอง (Pre-Test)</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ff9f43' }}>{studentStats.examScore}</span>
          </div>
        </div>
      </section>

      {/* ส่วนเนื้อหาห้องเรียนแบบสองฝั่ง */}
      <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', maxWidth: '1400px', width: '100%', margin: '1.5rem auto', padding: '0 1rem', gap: '1.5rem', boxSizing: 'border-box' }}>
        
        {/* ฝั่งซ้าย: หน้าจอเล่นวิดีโอ */}
        <div style={{ flex: 2, minWidth: '350px' }}>
          <div style={{ backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <iframe
              key={activeLesson.id}
              width="100%"
              height="100%"
              src={`https://youtube.com{activeLesson.youtubeid}?autoplay=1`}
              title={activeLesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
          
          {/* รายละเอียดและปุ่มดาวน์โหลดชีท + ทำข้อสอบจำลอง */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#111', fontSize: '1.3rem' }}>{activeLesson.title}</h2>
            <p style={{ color: '#666', margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>🕒 ระยะเวลาเรียน: {activeLesson.duration}</p>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: '#e6f0ff', padding: '1.2rem', borderRadius: '8px' }}>
              <span style={{ color: '#0052cc', fontWeight: 'bold', fontSize: '0.95rem' }}>📄 ชีทสรุปสูตรลัด เอกสารประกอบการสอน และคลังแนวข้อสอบประจำบทเรียน (.PDF)</span>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => alert('📥 ระบบกำลังดาวน์โหลดชีทสรุปเนื้อหาตัวเต็ม...')}
                  style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                  📥 ดาวน์โหลดเอกสารติว
                </button>
                
                {/* ปุ่มฟีเจอร์ทำข้อสอบออนไลน์ลิงก์ตรงตามวิชาวิสัยทัศน์ของคุณ */}
                <button 
                  onClick={() => alert('📝 กำลังพาท่านข้ามหน้าต่างเปิดระบบคลังข้อสอบออนไลน์คัดกรองผล...')}
                  style={{ backgroundColor: '#ff9f43', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 6px rgba(255,159,67,0.3)' }}
                >
                  📝 ทำแบบทดสอบออนไลน์ประจำวิชา
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: แถบรายการบทเรียนทั้งหมดคัดแยกตรงวิชา */}
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem', borderBottom: '2px solid #0052cc', paddingBottom: '0.5rem' }}>
            📚 รายการบทเรียนในคอร์สติวของคุณ
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentCourseLessons.map((lesson: any) => {
              const isPlaying = lesson.id === activeLesson.id;
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
