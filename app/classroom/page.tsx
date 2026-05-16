'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function ClassroomPage() {
  // ระบบจัดการสถานะล็อกอินและการเข้าถึงสิทธิ์
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // [แก้ไขจุดที่ 1] ปรับประเภทตัวแปรให้เป็น string เพื่อรองรับชื่อคอร์สเดี่ยว ป้องกันไม่ให้ขึ้น Error ตรงบรรทัด 94 ทันที!
  const [myCourses, setMyCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // ระบบจัดการป๊อปอัปข้อสอบกากบาท และตัวแปรคำนวณคะแนนจริง
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [liveExamScore, setLiveExamScore] = useState('ยังไม่ได้ทดสอบ 🎯');

  // [แก้ไขจุดที่ 2] จัดวางตำแหน่งตัวแปรสถิติให้อยู่ส่วนบนสุดของฟังก์ชัน เพื่อให้โค้ดด้านล่างดึงข้อมูลไปใช้ได้ ไร้ปัญหาดึงค่าล้มเหลว!
  const studentStats = {
    progress: '75%',
    completedLessons: 3,
    examScore: '19/20 คะแนน (ผ่านเกณฑ์ระดับสูง 🏆)'
  };

  // คลังข้อมูลบทเรียนอัปเกรดเพิ่ม "ชุดคำถามและเฉลยละเอียดข้อสอบตำรวจ/ก.พ." ประจำแต่ละ EP จริง!
  const allCoursesContent: any = {
    '🥇 คอร์สติวสอบ ก.พ. ภาค ก. (ฉบับผ่านชัวร์)': [
      { 
        id: 1, 
        title: 'ก.พ. EP 1: เจาะลึกโครงสร้างข้อสอบ ก.พ. และเทคนิคการเตรียมตัว', 
        duration: '15:20 นาที', 
        youtubeid: 'g9z7FstC4j0',
        quizQuestions: [
          { q: 'ข้อใดเป็นสัดส่วนของเกณฑ์การสอบผ่านวิชาความรู้ความสามารถทั่วไป ของ ป.ตรี?', a: 'ก', options: { ก: 'ต้องได้คะแนนไม่ต่ำกว่า 60%', ข: 'ต้องได้คะแนนไม่ต่ำกว่า 50%', ค: 'ต้องได้คะแนนไม่ต่ำกว่า 65%', ง: 'ต้องได้คะแนนไม่ต่ำกว่า 70%' }, detail: 'เฉลย ก: ระดับปริญญาตรีและโท ต้องผ่านเกณฑ์ 60% ส่วนปริญญาตรีเกียรตินิยมไม่มีข้อยกเว้นครับ' }
        ]
      },
      { 
        id: 2, 
        title: 'ก.พ. EP 2: คณิตศาสตร์ - เทคนิคคิดเลขเร็วและการหา ห.ร.ม. / ค.ร.น.', 
        duration: '45:10 นาที', 
        youtubeid: '7P6F_S87Fls',
        quizQuestions: [
          { q: 'เลข 12 และ 18 มี ห.ร.ม. ตรงกับข้อใด?', a: 'ข', options: { ก: '3', ข: '6', ค: '36', ง: '2' }, detail: 'เฉลย ข: ตัวหารร่วมที่มากที่สุดของ 12 และ 18 คือ 6 (12/6=2, 18/6=3) ครับ' }
        ]
      }
    ],
    '👮 คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)': [
      { 
        id: 1, 
        title: 'นสต.ปราบปราม EP 1: ความสามารถทั่วไป - แนวข้อสอบคณิตศาสตร์ตำรวจ อนุกรมและสมการลัด', 
        duration: '35:40 นาที', 
        youtubeid: 'g9z7FstC4j0',
        quizQuestions: [
          { q: 'ข้อสอบอนุกรมตำรวจ: 2, 4, 8, 16, ... ตัวเลขถัดไปคือข้อใด?', a: 'ค', options: { ก: '20', ข: '24', ค: '32', ง: '64' }, detail: 'เฉลย ค: อนุกรมชุดนี้มีความสัมพันธ์แบบคูณ 2 เพิ่มขึ้นเรื่อยๆ (16 x 2 = 32) ครับ' },
          { q: 'สมการตำรวจ: 3x + 5 = 20 ค่าของ x ตรงกับข้อใด?', a: 'ก', options: { ก: '5', ข: '15', ค: '4', ง: '3' }, detail: 'เฉลย ก: ย้าย 5 ไปลบออกซ้ายเหลือ 15 ย้าย 3 ไปหาร 15 ได้ผลลัพธ์เป็น 5 ครับ' }
        ]
      },
      { 
        id: 2, 
        title: 'นสต.ปราบปราม EP 2: กฎหมายเบื้องต้นที่ประชาชนควรรู้ - เจาะลึกกฎหมายอาญาสำหรับตำรวจปราบปราม', 
        duration: '55:15 นาที', 
        youtubeid: '7P6F_S87Fls',
        quizQuestions: [
          { q: 'การกระทำความผิดในข้อใดจัดเป็นความผิดลหุโทษตามประมวลกฎหมายอาญา?', a: 'ง', options: { ก: 'ข้อหาลักทรัพย์จำคุก 3 ปี', ข: 'ข้อหาทำร้ายร่างกายสาหัส', ค: 'ข้อหาฆ่าผู้อื่นโดยเจตนา', ง: 'ความผิดที่มีโทษจำคุกไม่เกิน 1 เดือน หรือปรับไม่เกิน 10,000 บาท' }, detail: 'เฉลย ง: ตามกฎหมายอาญามาตรา 102 ความผิดลหุโทษคือโทษคุกไม่เกิน 1 เดือน หรือปรับไม่เกินหมื่นบาทครับ' }
        ]
      }
    ],
    '💼 คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)': [
      { 
        id: 1, 
        title: 'นสต.อำนวยการ EP 1: ระเบียบงานสารบรรณ พ.ศ. 2526 - เจาะลึกชนิดของหนังสือราชการและรูปแบบการพิมพ์', 
        duration: '32:50 นาที', 
        youtubeid: 'g9z7FstC4j0',
        quizQuestions: [
          { q: 'หนังสือราชการตามระเบียบงานสารบรรณ พ.ศ. 2526 มีทั้งหมดกี่ชนิด?', a: 'ข', options: { ก: '4 ชนิด', ข: '6 ชนิด', ค: '5 ชนิด', ง: '8 ชนิด' }, detail: 'เฉลย ข: หนังสือราชการมี 6 ชนิด ได้แก่ หนังสือภายนอก ภายใน ประทับตรา สั่งการ ประชาสัมพันธ์ และหนังสือที่เจ้าหน้าที่ทำขึ้นครับ' }
        ]
      }
    ]
  };

  // แสตนด์บายสถานะบทเรียนเดี่ยวที่กำลังเปิดเล่น
  const [currentlesson, setCurrentlesson] = useState<any>(null);

  // ฟังก์ชันพิเศษดึงประวัติทุกคอร์สของเบอร์โทรศัพท์นี้โดยตรงจากหลังบ้าน Supabase
  const loadStudentCourses = async (phone: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('course_title')
        .eq('student_phone', phone.trim())
        .eq('status', 'อนุมัติแล้ว');

      if (error) throw error;

      if (data && data.length > 0) {
        const courseList = data.map((item: any) => item.course_title);
        const uniqueCourses = Array.from(new Set(courseList));
        
        setMyCourses(uniqueCourses);
        // [แก้ไขจุดที่ 3] ส่งค่าวิชาแรกในกล่อง (index 0) ที่เป็นข้อความปกติลงไป เพื่อแก้ไขบั๊ก SetStateAction ตัวแรกสุด!
        setSelectedCourse(uniqueCourses[0]); 
        
        setStudentName(name);
        setIsAuthenticated(true);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    const savedPhone = localStorage.getItem('user_phone');
    const savedName = localStorage.getItem('user_name');
    if (savedPhone && savedName) {
      loadStudentCourses(savedPhone, savedName);
    }
  }, []);

  useEffect(() => {
    if (selectedCourse && allCoursesContent[selectedCourse]) {
      setCurrentlesson(allCoursesContent[selectedCourse]);
      setQuizSubmitted(false);
      setSelectedAnswers({});
    }
  }, [selectedCourse]);
  // ฟังก์ชันส่องตรวจสอบเบอร์โทรศัพท์พร้อมรวบรวมรายชื่อคอร์สทั้งหมด
  const handleCheckLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage('⏳ กำลังตรวจสอบสิทธิ์และคอร์สทั้งหมดที่คุณสมัคร...');

    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('*')
        .eq('student_phone', phoneInput.trim())
        .eq('status', 'อนุมัติแล้ว');

      if (error) throw error;

      if (data && data.length > 0) {
        const courseList = data.map((item: any) => item.course_title);
        const uniqueCourses = Array.from(new Set(courseList));
        
        setMyCourses(uniqueCourses);
        setSelectedCourse(uniqueCourses[0]); // แก้ไขคัดเฉพาะค่าเดี่ยวแรกสุดที่เป็นตัวอักษร
        setStudentName(data[0].student_name);
        setIsAuthenticated(true);
        setLoginMessage('');
        
        localStorage.setItem('user_phone', phoneInput.trim());
        localStorage.setItem('user_name', data[0].student_name);
        localStorage.setItem('user_course', uniqueCourses[0]);
      } else {
        setLoginMessage('❌ ไม่พบสิทธิ์เข้าเรียน! เบอร์โทรนี้อาจจะยังไม่ได้สมัคร หรือแอดมินยังไม่ได้กดอนุมัติสลิปโอนเงินครับ');
      }
    } catch (error: any) {
      setLoginMessage(`❌ ระบบหลังบ้านติดขัด: ${error.message}`);
    }
  };

  // ฟังก์ชันจัดการจังหวะที่นักเรียนคลิกเลือกคำตอบช้อยส์ (ก ข ค ง)
  const handleSelectOption = (questionIndex: number, optionKey: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionKey
    });
  };

  // ฟังก์ชันคำนวณคะแนนสอบจริง และส่งค่าไปอัปเดตบนแถบกล่องสถิติ Pre-Test
  const handleQuizSubmit = (e: React.FormEvent, questions: any[]) => {
    e.preventDefault();
    let correctCount = 0;

    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.a) {
        correctCount++;
      }
    });

    setQuizSubmitted(true);
    setLiveExamScore(`${correctCount} / ${questions.length} คะแนน ✨`);
  };

  // คัดกรองบทเรียนปัจจุบันตามคอร์สเรียนที่เลือกใน Dropdown
  const currentCourseLessons = allCoursesContent[selectedCourse] || [];
  
  // ป้องกันการโหลดสลับวิชาแล้วหาค่าเริ่มต้นไม่เจอ
  const activeLesson = (currentlesson && currentlesson.title && currentCourseLessons.some((l: any) => l.id === currentlesson.id))
    ? currentlesson 
    : (currentCourseLessons[0] || { id: 0, title: 'ไม่มีข้อมูลวิชา', duration: '', youtubeid: '', quizQuestions: [] });

  // ค้นหารายการคำถามข้อสอบของบทเรียน (EP) ปัจจุบัน
  const activeQuestions = activeLesson.quizQuestions || [];

  // แสดงหน้าต่างล็อกอินคัดกรองเบอร์โทรศัพท์ (หากนักเรียนพิมพ์ลิงก์ห้องเรียนตรงๆ หรือล็อกเอาท์ไป)
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

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ส่วนหัวของห้องเรียนออนไลน์ (Header) */}
      <header style={{ backgroundColor: '#0052cc', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>✍️ ระบบห้องเรียนออนไลน์ | บ้านเด็กติวเตอร์</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: '#28a745', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              👤 ผู้เรียน: คุณ {studentName}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 'bold' }}>🔄 สลับคอร์สเรียนหลัก:</label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setCurrentlesson(null);
                }}
                style={{ backgroundColor: '#ffffff', color: '#111', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}
              >
                {myCourses.map((cName, idx) => (
                  <option key={idx} value={cName}>{cName}</option>
                ))}
              </select>
            </div>
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

      {/* แผงข้อมูลแดชบอร์ดสถิติผู้เรียน */}
      <section style={{ maxWidth: '1400px', width: '100%', margin: '1.5rem auto 0 auto', padding: '0 1rem', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '5px solid #0052cc' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>📈 ความคืบหน้าการเรียนคอร์สนี้</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#0052cc' }}>{studentStats.progress}</span>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '5px solid #28a745' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>📚 บทเรียนที่ติวสำเร็จแล้ว</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#28a745' }}>{studentStats.completedLessons} / {currentCourseLessons.length} EP</span>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '5px solid #ff9f43' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>🎯 คะแนนทำข้อสอบ (EP ปัจจุบัน)</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ff9f43' }}>{liveExamScore}</span>
          </div>
        </div>
      </section>

      {/* ส่วนเนื้อหาห้องเรียน */}
      <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', maxWidth: '1400px', width: '100%', margin: '1.5rem auto', padding: '0 1rem', gap: '1.5rem', boxSizing: 'border-box' }}>
        
        {/* ฝั่งซ้าย: เครื่องเล่นวิดีโอ */}
        <div style={{ flex: 2, minWidth: '350px' }}>
          <div style={{ backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {activeLesson && activeLesson.youtubeid ? (
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
            ) : (
              <div style={{ color: 'white', textAlign: 'center', padding: '20% 0', fontWeight: 'bold' }}>⏳ กำลังเลือกบทเรียนและเตรียมวิดีโอ...</div>
            )}
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#111', fontSize: '1.3rem' }}>{activeLesson.title || 'กำลังโหลดบทเรียน...'}</h2>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: '#e6f0ff', padding: '1.2rem', borderRadius: '8px' }}>
              <span style={{ color: '#0052cc', fontWeight: 'bold', fontSize: '0.95rem' }}>📄 สรุปเนื้อหาลัด เอกสาร PDF และแนวข้อสอบประจำวิชา</span>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => alert(`📥 ระบบกำลังดาวน์โหลดเอกสารประกอบการสอน...`)}
                  style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                  📥 ดาวน์โหลดเอกสารติว (.PDF)
                </button>
                
                <button 
                  onClick={() => {
                    if (activeQuestions.length === 0) {
                      alert('📝 บทเรียนนี้ยังไม่มีชุดข้อสอบในระบบคลังปัจจุบันครับ');
                    } else {
                      setShowQuizModal(true);
                    }
                  }}
                  style={{ backgroundColor: '#ff9f43', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 6px rgba(255,159,67,0.3)' }}
                >
                  📝 ทำแบบทดสอบออนไลน์ประจำบทเรียน
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: รายการ Playlist วิชาเรียน */}
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem', borderBottom: '2px solid #0052cc', paddingBottom: '0.5rem' }}>
            📚 เนื้อหาบทเรียนในคอร์สติว ({currentCourseLessons.length} วิชา)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentCourseLessons.map((lesson: any) => {
              const isPlaying = activeLesson && lesson.id === activeLesson.id;
              return (
                <div 
                  key={lesson.id}
                  onClick={() => {
                    setCurrentlesson(lesson);
                    setQuizSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  style={{ padding: '1rem', borderRadius: '8px', cursor: 'pointer', border: isPlaying ? '2px solid #0052cc' : '1px solid #e1e8ed', backgroundColor: isPlaying ? '#e6f0ff' : '#fff', transition: 'all 0.2s' }}
                >
                  <p style={{ margin: '0 0 0.2rem 0', fontWeight: 'bold', color: isPlaying ? '#0052cc' : '#333', fontSize: '0.95rem' }}>{lesson.title}</p>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>{lesson.duration}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 📝 [ป๊อปอัปชุดข้อสอบกากบาทพรีเมียม] */}
      {showQuizModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', zIndex: 2000, alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '600px', width: '95%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '1.4rem', margin: '0 0 1.5rem 0', borderBottom: '2px solid #ff9f43', paddingBottom: '0.5rem', color: '#222' }}>
              📝 คลังข้อสอบประจำบทเรียน: {activeLesson.title}
            </h3>
            
            <form onSubmit={(e) => handleQuizSubmit(e, activeQuestions)}>
              {activeQuestions.map((q: any, qIdx: number) => (
                <div key={qIdx} style={{ marginBottom: '1.8rem', borderBottom: '1px dashed #eee', paddingBottom: '1rem' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#111', marginBottom: '0.8rem' }}>ข้อ {qIdx + 1}: {q.q}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {Object.keys(q.options).map((optKey) => {
                      const isSelected = selectedAnswers[qIdx] === optKey;
                      const isCorrectOpt = q.a === optKey;
                      
                      let optBg = '#fff';
                      let optBorder = '1px solid #ccc';
                      
                      if (isSelected) {
                        optBg = '#e6f0ff';
                        optBorder = '2px solid #0052cc';
                      }
                      if (quizSubmitted) {
                        if (isCorrectOpt) { optBg = '#e6ffed'; optBorder = '2px solid #28a745'; }
                        else if (isSelected) { optBg = '#fff0f0'; optBorder = '2px solid #dc3545'; }
                      }

                      return (
                        <div 
                          key={optKey}
                          onClick={() => handleSelectOption(qIdx, optKey)}
                          style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: optBorder, backgroundColor: optBg, cursor: quizSubmitted ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', transition: 'all 0.15s' }}
                        >
                          <span style={{ fontWeight: 'bold', color: isSelected ? '#0052cc' : '#555' }}>{optKey}.</span>
                          <span style={{ color: '#333' }}>{q.options[optKey]}</span>
                        </div>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div style={{ marginTop: '1rem', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#fcf8e3', border: '1px solid #faebcc', color: '#8a6d3b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      💡 {q.detail}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', position: 'sticky', bottom: 0, backgroundColor: '#fff', padding: '1rem 0 0 0' }}>
                <button type="button" onClick={() => setShowQuizModal(false)} style={{ backgroundColor: '#666', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>
                  ปิดหน้าต่าง
                </button>
                {!quizSubmitted && (
                  <button type="submit" style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', flex: 2 }}>
                    📤 ส่งคำตอบตรวจคะแนน
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
