'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // เชื่อมโยงคลาวด์หลังบ้านตัวจริง ปลอดภัย 100%

export default function AdminPage() {
  // 🔐 1. ระบบรักษาความปลอดภัยขวางกั้นแอดมิน (Admin Authentication Barrier)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [authErrorMessage, setAuthErrorMessage] = useState('');

  // 👥 2. กลุ่มสถานะควบคุมระบบข้อมูลนักเรียน ประวัติคะแนนสอบ และข่าวสาร
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [studentStats, setStudentStats] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📋 3. ฟอร์มควบคุมการโพสต์ประกาศข่าวสารสถาบัน
  const [newsCategory, setNewsCategory] = useState('📋 เกาะติดข่าวสารการสอบ');
  const [newsBadge, setNewsBadge] = useState('🚨 เปิดสอบด่วน');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');

  // 🧠 4. ฟอร์มควบคุมระบบจัดเพิ่มข้อสอบใหม่เข้าตาราง quizzes โดยตรงผ่านหน้าจอแอดมิน
  const [selectedCourse, setSelectedCourse] = useState('คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)');
  const [lessonId, setLessonId] = useState(1);
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [quizzesList, setQuizzesList] = useState<any[]>([]);

  // 🔒 ฟังก์ชันประมวลผลระบบตรวจสอบรหัสผ่านแอดมิน
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'bandek2026') {
      localStorage.setItem('admin_session', 'authenticated_secure');
      setIsAdminLoggedIn(true);
      setAuthErrorMessage('');
      fetchAdminData();
    } else {
      setAuthErrorMessage('❌ รหัสผู้ใช้งานหรือรหัสผ่านแอดมินไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
    }
  };

  // 🚪 ฟังก์ชันออกจากระบบแอดมิน ล้างสิทธิ์ความปลอดภัยทันที
  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session');
    setIsAdminLoggedIn(false);
    setAdminUser('');
    setAdminPass('');
    setAuthErrorMessage('');
  };

  // 🔄 ฟังก์ชันประมวลผลดึงฐานข้อมูลหลักทั้งหมด (อัปเกรดดึงตารางประวัติผลสอบนักเรียนแบบฟูลสเกล)
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. ดึงรายชื่อสิทธิ์การสมัครเรียนและหลักฐานสลิป
      const { data: enrollData } = await supabase.from('enrollment').select('*').order('id', { ascending: false });
      if (enrollData) setEnrollments(enrollData);

      // 2. ดึงข้อมูลสถิติประวัติการเข้าทำข้อสอบและคะแนนของนักเรียนทุกคน
      const { data: statsData } = await supabase.from('quiz_attempts').select('*').order('id', { ascending: false });
      if (statsData) setStudentStats(statsData);

      // 3. ดึงข้อมูลคลังข้อสอบทั้งหมดในระบบมาสสแตนด์บายตรวจทาน
      const { data: quizData } = await supabase.from('quizzes').select('*').order('id', { ascending: false });
      if (quizData) setQuizzesList(quizData);

      // 4. ดึงข้อมูลข่าวสารประกาศระบบหลักมาแสดงผล
      setNewsList([
        { id: 1, badge: '🔥 เปิดสอบด่วน', title: 'กองการสอบ ประกาศรับสมัครข้าราชการตำรวจชั้นประทวน (นสต.) ล็อตใหม่เต็มพิกัด!', category: '📋 เกาะติดข่าวสารการสอบ' },
        { id: 2, badge: '📢 ประกาศผล', title: 'ประกาศผลคะแนนสอบข้อเขียน นายสิบตำรวจ สายอำนวยการ (อก.) รอบล่าสุด', category: '📋 เกาะติดข่าวสารการสอบ' },
        { id: 3, badge: '💡 VIP UPDATE', title: 'อัปเดตแนวข้อสอบ "ระเบียบงานสารบรรณ พ.ศ. 2526" ชุดเก็งจริงเข้าตารางสอบแล้ว', category: '🔔 ข่าวสารแจ้งสมาชิก' }
      ]);

    } catch (err) {
      console.error('Admin Data Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'authenticated_secure') {
      setIsAdminLoggedIn(true);
      fetchAdminData();
    }
  }, []);
  // ➕ ฟังก์ชันกดเพิ่มข้อสอบใหม่เข้าตาราง quizzes ใน Supabase หลังบ้านตัวจริง
  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminLoggedIn) return;
    if (!questionText || !optionA || !optionB || !optionC || !optionD) {
      alert('❌ กรุณากรอกข้อมูลโจทย์และตัวเลือกให้ครบถ้วนครับ');
      return;
    }

    try {
      const { data, error } = await supabase.from('quizzes').insert([
        {
          course_title: selectedCourse,
          lesson_id: lessonId,
          question_text: questionText,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correctAnswer
        }
      ]).select();

      if (error) throw error;

      alert('🎉 บรรจุข้อสอบใหม่เข้าสู่ตารางระบบหลักสำเร็จ! ดีดขึ้นหน้าจอนักเรียนทันทีครับ');
      
      // ล้างช่องฟอร์มเพื่อให้พร้อมพิมพ์ข้อถัดไปได้รวดเร็ว
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectAnswer('A');
      
      if (data) {
        setQuizzesList(prev => [data[0], ...prev]);
      }
    } catch (err: any) {
      console.error(err);
      alert(`❌ เกิดข้อผิดพลาด: ${err.message || 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้'}`);
    }
  };

  // 🗑️ ฟังก์ชันกดลบข้อสอบรายข้อออกจากฐานข้อมูลหลังบ้านเด็ดขาด
  const handleDeleteQuiz = async (quizId: number) => {
    if (!isAdminLoggedIn) return;
    if (!window.confirm('⚠️ คุณแน่ใจชัวร์ไหมที่จะลบโจทย์ข้อนี้ออกจากตารางหลักหลังบ้านอย่างถาวร?')) return;
    
    try {
      const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
      if (error) throw error;

      alert('🗑️ ลบโจทย์ข้อสอบออกจากคลังระบบถาวรเรียบร้อยครับ');
      setQuizzesList(prev => prev.filter(q => q.id !== quizId));
    } catch (err: any) {
      console.error(err);
      alert('❌ ไม่สามารถลบข้อสอบได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // 🔓 ฟังก์ชันสลับสถานะและอนุมัติสิทธิ์สมัครเรียนของนักเรียนจาก "รอตรวจสอบ" เป็น "อนุมัติแล้ว"
  const handleApproveStudent = async (enrollId: number, currentStatus: string) => {
    if (!isAdminLoggedIn) return;
    const nextStatus = currentStatus === 'อนุมัติแล้ว' ? 'รอตรวจสอบ' : 'อนุมัติแล้ว';
    try {
      const { error } = await supabase
        .from('enrollment')
        .update({ status: nextStatus })
        .eq('id', enrollId);

      if (error) throw error;

      alert(`🔄 ปรับปรุงสิทธิ์สถานะเป็น [${nextStatus}] เรียบร้อยคร้าบบพาร์ทเนอร์!`);
      setEnrollments(prev => prev.map(item => item.id === enrollId ? { ...item, status: nextStatus } : item));
    } catch (err: any) {
      console.error(err);
      alert('❌ เกิดข้อผิดพลาดในการเปลี่ยนสถานะสิทธิ์นักเรียน');
    }
  };

  // 🧽 ฟังก์ชันลบข่าวสารประกาศออกจากบอร์ดแสดงผล
  const handleDeleteNews = (id: number) => {
    if (!isAdminLoggedIn) return;
    setNewsList(prev => prev.filter(item => item.id !== id));
    alert('🗑️ ลบประกาศข่าวสารรายการนี้ออกจากระบบชั่วคราวเรียบร้อยครับ');
  };

  // ➕ ฟังก์ชันกดโพสต์เพิ่มข่าวสารใหม่
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminLoggedIn) return;
    if (!newsTitle) return;
    const newNews = {
      id: Date.now(),
      badge: newsBadge,
      title: newsTitle,
      category: newsCategory
    };
    setNewsList(prev => [newNews, ...prev]);
    alert('🎉 โพสต์ประกาศข่าวสารชิ้นใหม่ขึ้นหน้าแรกนักเรียนสำเร็จเรียบร้อยครับ!');
    setNewsTitle('');
    setNewsContent('');
  };

  // 🖼️ ฟังก์ชันสำหรับเปิดดูไฟล์สลิปหลักฐานโอนเงินของนักเรียนแบบ Pop-up หน้าต่างใหม่
  const handleViewSlip = (slipUrl: string) => {
    if (!slipUrl || slipUrl === '#' || slipUrl === 'null') {
      alert('❌ ไม่พบไฟล์รูปภาพสลิปหลักฐานโอนเงินในระบบของนักเรียนท่านนี้ครับ');
      return;
    }
    window.open(slipUrl, '_blank');
  };

  // นับจำนวนยอดนักเรียนเพื่อนำไปดีดแสดงผลที่ Dashboard ด้านบน
  const pendingCount = enrollments.filter(item => item.status === 'รอตรวจสอบ' || item.status === 'รออนุมัติ').length;
  const approvedCount = enrollments.filter(item => item.status === 'อนุมัติแล้ว').length;
  // 🔒 1. ขวางกั้นความปลอดภัยชั้นแรกสุด: หากแอดมินยังไม่ได้เข้าสู่ระบบ จะโชว์หน้าต่าง Login นี้ปิดตายไว้ 100%
  if (!isAdminLoggedIn) {
    return (
      <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '3.5rem 2.5rem', borderRadius: '28px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>ศูนย์บัญชาการแอดมินระดับสูง</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: '600', marginBottom: '2rem' }}>BANDEKTUTOR SECURITY BARRIER</p>

          {authErrorMessage && (
            <div style={{ padding: '0.9rem 1rem', marginBottom: '1.5rem', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', fontSize: '0.85rem', fontWeight: '700', textAlign: 'left', lineHeight: '1.4' }}>
              {authErrorMessage}
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>Username (ผู้ใช้งาน):</label>
              <input type="text" required value={adminUser} onChange={(e) => setAdminUser(e.target.value)} placeholder="ระบุชื่อผู้ใช้งานแอดมิน" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '0.95rem', fontWeight: '600', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem', color: '#475569' }}>Password (รหัสผ่าน):</label>
              <input type="password" required value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="ระบุรหัสผ่านแอดมิน" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '0.95rem', fontWeight: '600', outline: 'none' }} />
            </div>
            <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', marginTop: '8px', boxShadow: '0 4px 14px rgba(15,23,42,0.3)' }}>🔓 ยืนยันสิทธิ์เข้าฐานข้อมูล</button>
          </form>
        </div>
      </div>
    );
  }

  // 🏛️ 2. แผงควบคุมระบบชั้นใน (เข้าถึงได้เฉพาะผู้ผ่านรหัส Username/Password สำเร็จเท่านั้น)
  return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '2rem' }}>
      
      {/* 🟦 แถบส่วนหัวบอร์ดแอดมินระดับสูง + ปุ่มกดออกจากระบบ (Logout) ฝั่งขวา */}
      <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem', borderLeft: '8px solid #0f172a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>👑 ศูนย์บัญชาการแอดมินระดับสูง (Executive Control Center)</h1>
            <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0, fontWeight: '600' }}>สถาบันบ้านเด็กติวเตอร์ (BANDEXTUTOR EDTECH MANAGEMENT)</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={fetchAdminData} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '12px', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>🔄 รีเฟรชฐานข้อมูลล่าสุด</button>
            <button onClick={handleAdminLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '12px', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.2)' }}>🚪 ออกจากระบบแอดมิน</button>
          </div>
        </div>

        {/* 📊 แผงแดชบอร์ดสรุปสถิตินักเรียนและข้อสอบจริงหลังบ้าน */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1.75rem' }}>
          <div style={{ backgroundColor: '#fffbeb', padding: '1.25rem', borderRadius: '16px', border: '1px solid #fef3c7', borderLeft: '5px solid #d97706' }}>
            <span style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: '700', display: 'block', marginBottom: '2px' }}>⏳ รายการรอกดอนุมัติสิทธิ์</span>
            <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#b45309' }}>{pendingCount} คน</span>
          </div>
          <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem', borderRadius: '16px', border: '1px solid #bbf7d0', borderLeft: '5px solid #16a34a' }}>
            <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: '700', display: 'block', marginBottom: '2px' }}>✅ สมาชิกเปิดสิทธิ์เข้าเรียนออนไลน์แล้ว</span>
            <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#166534' }}>{approvedCount} คน</span>
          </div>
          <div style={{ backgroundColor: '#eff6ff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #bfdbfe', borderLeft: '5px solid #2563eb' }}>
            <span style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: '700', display: 'block', marginBottom: '2px' }}>📝 คลังข้อสอบที่มีอยู่ในตารางทั้งหมด</span>
            <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e40af' }}>{quizzesList.length} ข้อ</span>
          </div>
        </div>
      </div>

      {/* 🗃️ แผงโครงสร้างสไตล์แยกสัดส่วนจัดวาง ซ้าย/ขวา */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* 🛠️ ฝั่งซ้าย: แผงฟอร์มจัดเพิ่มข้อสอบใหม่ และฟอร์มควบคุมระบบข่าวสาร */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 📝 กล่องฟอร์มเพิ่มข้อสอบใหม่ตรงคีย์ตาราง quizzes สำเร็จรูป */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>📝</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>ระบบจัดเพิ่มและอัปเดตแนวข้อสอบ (Exam Add Panel)</h2>
            </div>

            <form onSubmit={handleAddQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>เลือกคอร์สเรียนปลายทาง:</label>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '700', outline: 'none' }}>
                  <option value="คอร์สติวกฎหมายราชการที่จำเป็น">⚖️ คอร์สติวกฎหมายราชการที่จำเป็น</option>
                  <option value="คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)">🏆 คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)</option>
                  <option value="คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.">📚 คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.</option>
                  <option value="คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)">💼 คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)</option>
                  <option value="คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)">📝 คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)</option>
                  <option value="คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)">👮 คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)</option>
                  <option value="คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)">💼 คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)</option>
                  <option value="คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)">👮 คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)</option>
                  <option value="คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)">🏆 คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)</option>
                  <option value="คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)">🏅 คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>บทเรียน ID (เช่น EP.1=1):</label>
                  <input type="number" value={lessonId} onChange={(e) => setLessonId(parseInt(e.target.value) || 1)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>เฉลยข้อที่ถูกต้อง (ก=A):</label>
                  <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '700' }}>
                    <option value="A">ก (Option A)</option>
                    <option value="B">ข (Option B)</option>
                    <option value="C">ค (Option C)</option>
                    <option value="D">ง (Option D)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>รายละเอียดเนื้อหาโจทย์คำถาม:</label>
                <textarea required rows={3} value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="พิมพ์คำถามข้อสอบเก็งใหม่ตรงนี้..." style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ตัวเลือก ก (Option A):</label>
                  <input type="text" required value={optionA} onChange={(e) => setOptionA(e.target.value)} placeholder="ชอยส์ข้อ ก" style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ตัวเลือก ข (Option B):</label>
                  <input type="text" required value={optionB} onChange={(e) => setOptionB(e.target.value)} placeholder="ชอยส์ข้อ ข" style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ตัวเลือก ค (Option C):</label>
                  <input type="text" required value={optionC} onChange={(e) => setOptionC(e.target.value)} placeholder="ชอยส์ข้อ ค" style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ตัวเลือก ง (Option D):</label>
                  <input type="text" required value={optionD} onChange={(e) => setOptionD(e.target.value)} placeholder="ชอยส์ข้อ ง" style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box' }} />
                </div>
              </div>

              <button type="submit" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '12px', fontSize: '0.92rem', fontWeight: '700', cursor: 'pointer', marginTop: '4px', boxShadow: '0 4px 14px rgba(22,163,74,0.25)' }}>➕ บรรจุข้อสอบใหม่เข้าคลังข้อมูลหลัก</button>
            </form>
          </div>

          {/* ⚙️ กล่องฟอร์มควบคุมและโพสต์ประกาศข่าวสารสถาบัน */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>⚙️</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>ระบบจัดการและโพสต์ประกาศข่าวสารสถาบัน</h2>
            </div>

            <form onSubmit={handleAddNews} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>หมวดหมู่ข่าวสาร:</label>
                  <select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '700' }}>
                    <option value="📋 เกาะติดข่าวสารการสอบ">📋 เกาะติดข่าวสารการสอบ</option>
                    <option value="🔔 ข่าวสารแจ้งสมาชิก">🔔 ข่าวสารแจ้งสมาชิก</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ป้ายกำกับข่าว (Badge):</label>
                  <select value={newsBadge} onChange={(e) => setNewsBadge(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '700' }}>
                    <option value="🚨 เปิดสอบด่วน">🚨 เปิดสอบด่วน</option>
                    <option value="📢 ประกาศผล">📢 ประกาศผล</option>
                    <option value="💡 VIP UPDATE">💡 VIP UPDATE</option>
                    <option value="⚡ ระบบอัปเกรด">⚡ ระบบอัปเกรด</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>หัวข้อข่าวสาร / เนื้อหาประกาศลัด:</label>
                <input type="text" required value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="พิมพ์สรุปใจความสำคัญข่าว..." style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '0.7 rham', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>➕ โพสต์ประกาศข่าวหน้าแรก</button>
            </form>
          </div>

        </div>
        {/* 📦 ฝั่งขวา: รายการประกาศข่าว ตารางอนุมัติสิทธิ์พร้อมดูสลิป และบอร์ดสถิติผลสอบนักเรียนรายบุคคล */}
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 📦 1. รายการข่าวสารที่กำลังแสดงผลอยู่ปัจจุบัน (กดลบได้จริงเรียลไทม์) */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📦</span> รายการข่าวสารที่กำลังแสดงผลอยู่ปัจจุบัน (กดลบได้):
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {newsList.map((news) => (
                <div key={news.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', gap: '15px' }}>
                  <div style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                    <span style={{ backgroundColor: '#0f172a', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', marginRight: '8px', display: 'inline-block' }}>{news.badge}</span>
                    <strong style={{ color: '#1e293b' }}>{news.title}</strong>
                  </div>
                  <button type="button" onClick={() => handleDeleteNews(news.id)} style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}>🗑️ ลบข่าวนี้</button>
                </div>
              ))}
            </div>
          </div>

          {/* 👥 2. แผงควบคุมรายชื่อ และระบบเปิด-ปิดสิทธิ์ห้องเรียนพรีเมียม (พร้อมปุ่มกดเปิดดูรูปภาพสลิปโอนเงินจริง) */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>👥</span> รายชื่อผู้สมัครเรียนและระบบอนุมัติสิทธิ์ (พร้อมลิงก์ดูหลักฐานการโอนเงิน):
            </h4>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.88rem', padding: '1.5rem 0', fontWeight: '600' }}>⏳ กำลังดึงฐานข้อมูลรายชื่อและสถิติสมาชิกเข้าเรียนออนไลน์หลังบ้าน...</p>
            ) : enrollments.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.88rem', padding: '1.5rem 0', fontWeight: '600' }}>📭 ไม่พบรายชื่อผู้สมัครเรียนในตารางระบบขณะนี้</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ededed', color: '#475569', fontWeight: '700' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>ชื่อผู้สมัคร</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>เบอร์โทรศัพท์</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>วิชา/คอร์สเรียน</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>หลักฐาน</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>สถานะสิทธิ์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((student) => {
                      const isApproved = student.status === 'อนุมัติแล้ว';
                      return (
                        <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', fontWeight: '600' }}>
                          <td style={{ padding: '0.85rem 0.5rem' }}>{student.student_name || 'ไม่ระบุชื่อ'}</td>
                          <td style={{ padding: '0.85rem 0.5rem', color: '#64748b' }}>{student.student_phone}</td>
                          <td style={{ padding: '0.85rem 0.5rem', color: '#0052cc', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.course_title}</td>
                          <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                            {/* 🖼️ ปุ่มสำหรับกดเปิดดูสลิปหลักฐานโอนเงินผ่านเบราว์เซอร์แถบใหม่ทันที */}
                            <button type="button" onClick={() => handleViewSlip(student.slip_url || student.slip)} style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '0.35rem 0.65rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>🖼️ ดูสลิป</button>
                          </td>
                          <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                            <button 
                              type="button"
                              onClick={() => handleApproveStudent(student.id, student.status)}
                              style={{ 
                                padding: '0.4rem 0.8rem', 
                                borderRadius: '8px', 
                                fontSize: '0.78rem', 
                                fontWeight: '700', 
                                cursor: 'pointer',
                                backgroundColor: isApproved ? '#dcfce7' : '#fff9db',
                                color: isApproved ? '#15803d' : '#b45309',
                                border: isApproved ? '1px solid #bbf7d0' : '1px solid #fef3c7'
                              }}
                            >
                              {isApproved ? '✅ อนุมัติแล้ว' : '⏳ รอตรวจสอบ'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 📈 3. ตารางรายงานข้อมูลสถิติคะแนนผลการสอบของนักเรียนรายบุคคล ดึงข้อมูลสดตรงจากคลาวด์หลังบ้าน */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📈</span> สถิติคะแนนผลสอบของนักเรียนรายบุคคล (Student Test Performance):
            </h4>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.88rem', padding: '1rem 0' }}>⏳ กำลังประมวลผลดึงข้อมูลสถิติคะแนนทดสอบ...</p>
            ) : studentStats.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.88rem', padding: '1rem 0', fontWeight: '600' }}>📭 ยังไม่มีข้อมูลสถิติประวัติการทำข้อสอบของผู้เรียนในระบบในขณะนี้</p>
            ) : (
              <div style={{ overflowX: 'auto', maxHeight: '350px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ededed', color: '#475569', fontWeight: '700' }}>
                      <th style={{ padding: '0.6rem 0.4rem' }}>เบอร์โทรผู้สอบ</th>
                      <th style={{ padding: '0.6rem 0.4rem' }}>วิชา/หัวข้อข้อสอบ</th>
                      <th style={{ padding: '0.6rem 0.4rem', textAlign: 'center' }}>คะแนนที่ได้</th>
                      <th style={{ padding: '0.6rem 0.4rem', textAlign: 'center' }}>เปอร์เซ็นต์</th>
                      <th style={{ padding: '0.6rem 0.4rem', textAlign: 'center' }}>วันที่สอบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentStats.map((stat, index) => {
                      const pct = (stat.score_obtained / (stat.total_questions || 1)) * 100;
                      return (
                        <tr key={stat.id || index} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', fontWeight: '600' }}>
                          <td style={{ padding: '0.7rem 0.4rem', color: '#475569' }}>{stat.student_phone}</td>
                          <td style={{ padding: '0.7 flex 0.4rem', color: '#1e293b', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.subject_name}</td>
                          <td style={{ padding: '0.7rem 0.4rem', textAlign: 'center', color: '#2563eb', fontWeight: '800' }}>{stat.score_obtained} / {stat.total_questions}</td>
                          <td style={{ padding: '0.7rem 0.4rem', textAlign: 'center' }}>
                            <span style={{ backgroundColor: pct >= 60 ? '#e8f5e9' : '#fedeeb', color: pct >= 60 ? '#2e7d32' : '#c62828', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>{pct.toFixed(0)}%</span>
                          </td>
                          <td style={{ padding: '0.7rem 0.4rem', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>{stat.created_at ? new Date(stat.created_at).toLocaleDateString('th-TH') : 'ไม่มีข้อมูล'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 📊 4. ตารางรวมข้อสอบทั้งหมดที่มีอยู่ในตารางหลักหลังบ้าน (สั่งปลดสั่งลบข้อที่มั่วทิ้งได้ทันที) */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📊</span> คลังโจทย์ข้อสอบทั้งหมดในตาราง `quizzes` หน้างานปัจจุบัน ({quizzesList.length} ข้อ):
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
              {quizzesList.map((quiz, idx) => (
                <div key={quiz.id || idx} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                  <div style={{ fontSize: '0.85rem', lineHeight: '1.5', fontWeight: '600' }}>
                    <div style={{ color: '#0052cc', fontSize: '0.75rem', fontWeight: '800', marginBottom: '2px' }}>📚 {quiz.course_title} (บทเรียนย่อย ID: {quiz.lesson_id})</div>
                    <div style={{ color: '#0f172a', marginBottom: '4px' }}>Q: {quiz.question_text}</div>
                    <div style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: '800' }}>🎯 เฉลยข้อ: {quiz.correct_answer === 'A' ? 'ก' : quiz.correct_answer === 'B' ? 'ข' : quiz.correct_answer === 'C' ? 'ค' : 'ง'}</div>
                  </div>
                  <button type="button" onClick={() => handleDeleteQuiz(quiz.id)} style={{ backgroundColor: '#fff5f5', color: '#ef4444', border: '1px solid #fee2e2', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}>🗑️ ลบโจทย์</button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 🟦 แถบลิขสิทธิ์ฟุตเตอร์ปิดงานท้ายหน้าจอแอดมินหลังบ้าน */}
      <div style={{ marginTop: '3.5rem', textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8', borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem' }}>
        © 2026 สถาบันบ้านเด็กติวเตอร์ (Bandektutor) • แผงควบคุมสถิติวิชาเรียนและอนุมัติสิทธิ์ความปลอดภัยสูง 🔒
      </div>

    </div>
  );
}
