'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function ClassroomPage() {
  // ระบบจัดการสถานะล็อกอินและการเข้าถึงสิทธิ์
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // [จุดอัปเกรดสำคัญ] ตัวแปรเก็บรายชื่อคอร์สทั้งหมดที่นักเรียนเบอร์นี้สมัคร และสถานะคอร์สที่กำลังเลือกเรียนอยู่ขณะนั้น
  const [myCourses, setMyCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  // คลังข้อมูลบทเรียน ก.พ. และนายสิบตำรวจครบถ้วนไร้บั๊กตัวพิมพ์สับสน
  const allCoursesContent: any = {
    '🥇 คอร์สติวสอบ ก.พ. ภาค ก. (ฉบับผ่านชัวร์)': [
      { id: 1, title: 'ก.พ. EP 1: เจาะลึกโครงสร้างข้อสอบ ก.พ. และเทคนิคการเตรียมตัว', duration: '15:20 นาที', youtubeid: 'g9z7FstC4j0' },
      { id: 2, title: 'ก.พ. EP 2: คณิตศาสตร์ - เทคนิคคิดเลขเร็วและการหา ห.ร.ม. / ค.ร.น.', duration: '45:10 นาที', youtubeid: '7P6F_S87Fls' },
      { id: 3, title: 'ก.พ. EP 3: ภาษาไทย - การอุปมาอุปไมย จับจุดสังเกตคำคีย์เวิร์ด', duration: '30:15 นาที', youtubeid: 'O9YwE8_O5rI' }
    ],
    '👮 คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)': [
      { id: 1, title: 'นสต.ปราบปราม EP 1: ความสามารถทั่วไป - แนวข้อสอบคณิตศาสตร์ตำรวจ อนุกรมและสมการลัด', duration: '35:40 นาที', youtubeid: 'g9z7FstC4j0' },
      { id: 2, title: 'นสต.ปราบปราม EP 2: กฎหมายเบื้องต้นที่ประชาชนควรรู้ - เจาะลึกกฎหมายอาญาสำหรับตำรวจปราบปราม', duration: '55:15 นาที', youtubeid: '7P6F_S87Fls' },
      { id: 3, title: 'นสต.ปราบปราม EP 3: คอมพิวเตอร์และเทคโนโลยีสารสนเทศ - แนวข้อสอบเครือข่าย พรบ.คอมพิวเตอร์ และระบบสืบค้นข้อมูล', duration: '42:20 นาที', youtubeid: 'O9YwE8_O5rI' },
      { id: 4, title: 'นสต.ปราบปราม EP 4: ภาษาไทยตำรวจ - การสะกดคำ คำลักษณนาม และการอ่านจับใจความข้อสอบจริงสายปราบปราม', duration: '38:10 นาที', youtubeid: 'g9z7FstC4j0' },
      { id: 5, title: 'นสต.ปราบปราม EP 5: ภาษาอังกฤษตำรวจ - ตะลุยโจทย์ Grammar, Reading และศัพท์กฎหมายพื้นฐานในงานปราบปราม', duration: '48:30 นาที', youtubeid: '7P6F_S87Fls' }
    ],
    '💼 คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)': [
      { id: 1, title: 'นสต.อำนวยการ EP 1: ระเบียบงานสารบรรณ พ.ศ. 2526 - เจาะลึกชนิดของหนังสือราชการและรูปแบบการพิมพ์', duration: '32:50 นาที', youtubeid: 'g9z7FstC4j0' },
      { id: 2, title: 'นสต.อำนวยการ EP 2: ภาษาต่างประเทศ (English) - หลักไวยากรณ์ การอ่าน และการตอบอีเมลงานเอกสารภาษาอังกฤษ', duration: '45:30 นาที', youtubeid: '7P6F_S87Fls' },
      { id: 3, title: 'นสต.อำนวยการ EP 3: สังคม วัฒนธรรม จริยธรรม - ค่านิยมและหลักธรรมาภิบาลในงานธุรการสนับสนุนหน่วยงานตำรวจ', duration: '40:10 นาที', youtubeid: 'O9YwE8_O5rI' },
      { id: 4, title: 'นสต.อำนวยการ EP 4: คอมพิวเตอร์และเทคโนโลยีสารสนเทศ - เน้นการใช้ MS Office งานฐานข้อมูล และความปลอดภัยข้อมูลสารสนเทศ', duration: '44:15 นาที', youtubeid: 'g9z7FstC4j0' },
      { id: 5, title: 'นสต.อำนวยการ EP 5: ภาษาไทยธุรการ - การใช้ถ้อยคำราชการ ความถูกต้องทางไวยากรณ์ และการสรุปความหนังสือเวียน', duration: '36:25 นาที', youtubeid: '7P6F_S87Fls' }
    ]
  };

  // แสตนด์บายสถานะบทเรียนเดี่ยวที่กำลังเปิดเล่น
  const [currentlesson, setCurrentlesson] = useState<any>(null);

  const studentStats = { progress: '75%', completedLessons: 3, examScore: '19/20 คะแนน (ผ่านเกณฑ์ระดับสูง 🏆)' };

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
        // ดึงเฉพาะรายชื่อวิชาที่ไม่ซ้ำกันมารวบรวมลงในปุ่มตัวเลือก Dropdown
        const courseList = Array.from(new Set(data.map((item: any) => item.course_title)));
        setMyCourses(courseList);
        setSelectedCourse(courseList[0]); // กำหนดให้เปิดวิชาแรกสุดที่เจอมาจัดแสดงก่อน
        
        setStudentName(name);
        setIsAuthenticated(true);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  // ดักเช็คตั๋วความจำเมื่อเปิดจอและส่งไปค้นหาประวัติคอร์สเรียนทั้งหมดเรียลไทม์
  useEffect(() => {
    const savedPhone = localStorage.getItem('user_phone');
    const savedName = localStorage.getItem('user_name');
    if (savedPhone && savedName) {
      loadStudentCourses(savedPhone, savedName);
    }
  }, []);

  // สลับบทเรียนในเครื่องเล่นวิดีโอทันทีที่มีการเปลี่ยนแปลงสลับชื่อคอร์สใน Dropdown
  useEffect(() => {
    if (selectedCourse && allCoursesContent[selectedCourse]) {
      setCurrentlesson(allCoursesContent[selectedCourse][0]);
    }
  }, [selectedCourse]);
  // ฟังก์ชันส่องตรวจสอบเบอร์โทรศัพท์พร้อมรวบรวมรายชื่อคอร์สทั้งหมดที่ผ่านการอนุมัติ
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
        // ดึงเฉพาะชื่อคอร์สที่ไม่ซ้ำกันมารวมในลิสต์เมนู Dropdown
        const courseList = Array.from(new Set(data.map((item: any) => item.course_title)));
        
        setMyCourses(courseList);
        setSelectedCourse(courseList[0]); // บังคับเปิดคอร์สตัวแรกก่อน
        setStudentName(data[0].student_name);
        setIsAuthenticated(true);
        setLoginMessage('');
        
        // บันทึกตั๋วความจำฝังลงเครื่องคอมพิวเตอร์นักเรียน
        localStorage.setItem('user_phone', phoneInput.trim());
        localStorage.setItem('user_name', data[0].student_name);
        localStorage.setItem('user_course', courseList[0]);
      } else {
        setLoginMessage('❌ ไม่พบสิทธิ์เข้าเรียน! เบอร์โทรนี้อาจจะยังไม่ได้สมัคร หรือแอดมินยังไม่ได้กดอนุมัติสลิปโอนเงินครับ');
      }
    } catch (error: any) {
      setLoginMessage(`❌ ระบบหลังบ้านติดขัด: ${error.message}`);
    }
  };

  // แสดงหน้าต่างล็อกอินคัดกรองเบอร์โทรศัพท์ (หากนักเรียนพิมพ์ลิงก์ห้องเรียนตรงๆ หรือล็อกเอาท์ไป)
  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '16px', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e1e8ed' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ fontSize: '1.6rem', color: '#111', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>เข้าสู่ห้องเรียนออนไลน์</h2>
          <p style={{ color: '#666', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: '1.5' }}>
            กรุณากรอกเบอร์โทรศัพท์ที่ใช้สมัคร เพื่อเปิดระบบคลังวิชาเรียนของคุณทั้งหมดครับ
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

  // คัดกรองบทเรียนปัจจุบันตามคอร์สเรียนที่นักเรียนกำลังคลิกเลือกสลับใน Dropdown
  const currentCourseLessons = allCoursesContent[selectedCourse] || [];
  
  // ป้องกันการโหลดสลับวิชาแล้วหาค่าเริ่มต้นไม่เจอ
  const activeLesson = (currentlesson && currentlesson.title && currentCourseLessons.some((l: any) => l.id === currentlesson.id))
    ? currentlesson 
    : (currentCourseLessons[0] || { id: 0, title: 'ไม่มีข้อมูลวิชา', duration: '', youtubeid: '' });
  // ส่วนแสดงหน้าจอห้องเรียนออนไลน์ตัวฟูล (จะเปิดประตูให้อัตโนมัติเมื่อข้อมูลตั๋วเข้าคู่กับประวัติคอร์สหลังบ้าน)
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ส่วนหัวของห้องเรียนออนไลน์ (Header) แสดงชื่อผู้ติว และกล่อง Dropdown สลับคอร์สอัจฉริยะ */}
      <header style={{ backgroundColor: '#0052cc', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>✍️ ระบบห้องเรียนออนไลน์ | บ้านเด็กติวเตอร์</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: '#28a745', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              👤 ผู้เรียน: คุณ {studentName}
            </span>
            
            {/* [ฟีเจอร์ไม้เด็ด] กล่อง Dropdown แสดงรายชื่อคอร์สทั้งหมดที่นักเรียนคนนี้สมัครเรียนและได้รับอนุมัติจริง */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 'bold' }}>🔄 สลับคอร์สเรียนหลักของคุณ:</label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setCurrentlesson(null); // ล้างค่าบทเรียนย่อยชั่วคราวเพื่อโหลดคลิปของคอร์สใหม่
                }}
                style={{ backgroundColor: '#ffffff', color: '#111', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
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

      {/* แผงข้อมูลแดชบอร์ดสถิติผู้เรียน ปรับให้ดึงตัวแปรความยาวบทเรียนตามวิชาที่เลือกแบบอัตโนมัติ */}
      <section style={{ maxWidth: '1400px', width: '100%', margin: '1.5rem auto 0 auto', padding: '0 1rem', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '5px solid #0052cc' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>📈 ความคืบหน้าการเรียนคอร์สนี้</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#0052cc' }}>{studentStats.progress}</span>
            <div style={{ width: '100%', backgroundColor: '#eee', height: '6px', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
              <div style={{ width: studentStats.progress, backgroundColor: '#0052cc', height: '100%' }}></div>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '5px solid #28a745' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>📚 บทเรียนที่ติวสำเร็จแล้ว</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#28a745' }}>{studentStats.completedLessons} / {currentCourseLessons.length} EP</span>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '5px solid #ff9f43' }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>🎯 คะแนนทดสอบจำลอง (Pre-Test)</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ff9f43' }}>{studentStats.examScore}</span>
          </div>
        </div>
      </section>

      {/* ส่วนเนื้อหาห้องเรียนออนไลน์แบบสองฝั่ง */}
      <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', maxWidth: '1400px', width: '100%', margin: '1.5rem auto', padding: '0 1rem', gap: '1.5rem', boxSizing: 'border-box' }}>
        
        {/* ฝั่งซ้าย: หน้าจอเครื่องเล่นคลิปวิดีโอ */}
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
          
          {/* ข้อมูลบทเรียนและเอกสารแบบฝึกหัดดาวน์โหลดตามวิชา */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#111', fontSize: '1.3rem' }}>{activeLesson.title || 'กำลังโหลดบทเรียน...'}</h2>
            {activeLesson.duration && <p style={{ color: '#666', margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>🕒 ระยะเวลาเรียน: {activeLesson.duration}</p>}
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: '#e6f0ff', padding: '1.2rem', borderRadius: '8px' }}>
              <span style={{ color: '#0052cc', fontWeight: 'bold', fontSize: '0.95rem' }}>📄 สรุปเนื้อหาลัด เอกสาร PDF และแนวข้อสอบประจำวิชาของสายงานคุณ</span>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => alert(`📥 ระบบกำลังดาวน์โหลดเอกสารประกอบการสอนของวิชา: ${activeLesson.title}`)}
                  style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                >
                  📥 ดาวน์โหลดเอกสารติว (.PDF)
                </button>
                <button 
                  onClick={() => {
                    if (activeLesson.quizUrl) {
                      window.open(activeLesson.quizUrl, '_blank');
                    } else {
                      alert('📝 กำลังเตรียมระบบคลังข้อสอบออนไลน์ของบทเรียนนี้...');
                    }
                  }}
                  style={{ backgroundColor: '#ff9f43', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 6px rgba(255,159,67,0.3)' }}
                >
                  📝 做ทำแบบทดสอบออนไลน์ประจำบทเรียน
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: แถบรายการ Playlist รายวิชาที่จะสลับตัวหนังสือเปลี่ยนตามคอร์สเรียนใน Dropdown อัตโนมัติ */}
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.1rem', borderBottom: '2px solid #0052cc', paddingBottom: '0.5rem' }}>
            📚 เนื้อหาบทเรียนในคอร์สติวที่เลือก ({currentCourseLessons.length} วิชา)
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {currentCourseLessons.map((lesson: any) => {
              const isPlaying = activeLesson && lesson.id === activeLesson.id;
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
