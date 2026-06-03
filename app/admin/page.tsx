'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [authErrorMessage, setAuthErrorMessage] = useState('');

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [studentStats, setStudentStats] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [quizzesList, setQuizzesList] = useState<any[]>([]);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📰 State ระบบควบคุมฟอร์มข่าวสาร
  const [newsCategory, setNewsCategory] = useState('📋 เกาะติดข่าวสารการสอบ');
  const [newsBadge, setNewsBadge] = useState('🚨 เปิดสอบด่วน');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null); // ไอดีข่าวที่กำลังแก้ไข

  // 🏷️ State ระบบควบคุมฟอร์มคอร์สเรียน
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseDetail, setEditCourseDetail] = useState('');
  const [editCoursePrice, setEditCoursePrice] = useState(0);

  // 🔍 State ระบบค้นหาสมาชิก
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: enrollData } = await supabase.from('enrollment').select('*').order('id', { ascending: false });
      if (enrollData) setEnrollments(enrollData);

      const { data: statsData } = await supabase.from('quiz_attempts').select('*').order('id', { ascending: false });
      if (statsData) setStudentStats(statsData);

      const { data: quizData } = await supabase.from('quizzes').select('*').order('id', { ascending: false });
      if (quizData) setQuizzesList(quizData);

      const { data: dbNews } = await supabase.from('news').select('*').order('id', { ascending: false });
      if (dbNews) setNewsList(dbNews);

      const { data: courseData } = await supabase.from('courses').select('*').order('id', { ascending: true });
      if (courseData) setDbCourses(courseData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'authenticated_secure') {
      setIsAdminLoggedIn(true);
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, []);
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'bandek2026') {
      localStorage.setItem('admin_session', 'authenticated_secure');
      setIsAdminLoggedIn(true);
      setAuthErrorMessage('');
      fetchAdminData();
    } else {
      setAuthErrorMessage('❌ รหัสผู้ใช้งานหรือรหัสผ่านแอดมินไม่ถูกต้อง');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session');
    setIsAdminLoggedIn(false);
    setAdminUser('');
    setAdminPass('');
  };

  // 📰 ฟังก์ชันโพสต์ข่าวใหม่ หรือ อัปเดตข่าวสารเดิมแบบ 2-in-1 อัจฉริยะ
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle) {
      alert('❌ กรุณาพิมพ์หัวข้อประกาศข่าวก่อนกดบันทึกครับ');
      return;
    }
    try {
      const fullNewsTitle = `[${newsBadge}] [${newsCategory}] ${newsTitle}`;
      
      if (selectedNewsId) {
        // Mode: อัปเดตข้อมูลข่าวเดิม (Update)
        const { error } = await supabase
          .from('news')
          .update({ title: fullNewsTitle, content: newsContent || '-' })
          .eq('id', selectedNewsId);
        if (error) throw error;
        alert('✨ อัปเดตแก้ไขเนื้อหาประกาศข่าวสารสถาบันสำเร็จ! หน้าแรกเปลี่ยนตามทันทีครับ');
      } else {
        // Mode: โพสต์เพิ่มข่าวสารใหม่ (Insert)
        const { error } = await supabase
          .from('news')
          .insert([{ title: fullNewsTitle, content: newsContent || '-' }]);
        if (error) throw error;
        alert('🎉 บันทึกและโพสต์ประกาศข่าวสารใหม่เข้าสู่กระดานสำเร็จเรียบร้อยครับ!');
      }

      setNewsTitle('');
      setNewsContent('');
      setSelectedNewsId(null);
      fetchAdminData();
    } catch (err: any) {
      alert(`❌ เกิดข้อผิดพลาดในระบบข่าวสาร: ${err.message}`);
    }
  };

  // 📰 ฟังก์ชันกดเลือกข่าวสารจากตารางขึ้นมาพิมพ์แก้ไขบนฟอร์มด้านบน
  const handleSelectEditNews = (news: any) => {
    setSelectedNewsId(news.id);
    
    // สกัดทำความสะอาดตัดคีย์วงเล็บ [ป้าย] ออกเพื่อให้แอดมินพิมพ์แก้ไขเนื้อหาหัวข้อข่าวหลักได้คลีนๆ
    let rawTitle = news.title || '';
    rawTitle = rawTitle.replace(/\[.*?\]/g, '').trim();
    setNewsTitle(rawTitle);
    setNewsContent(news.content && news.content !== '-' ? news.content : '');
  };

  // 📰 ฟังก์ชันสั่งลบประกาศข่าวสารออกจากระบบคลาวด์เด็ดขาด
  const handleDeleteNews = async (newsId: number) => {
    if (!window.confirm('⚠️ คุณแน่ใจใช่ไหมว่าต้องการลบประกาศข่าวสารชิ้นนี้ออกจากระบบอย่างถาวร?')) return;
    try {
      const { error } = await supabase.from('news').delete().eq('id', newsId);
      if (error) throw error;
      alert('🗑️ ลบประกาศข่าวสารออกจากกระดานหน้าแรกและฐานข้อมูลสำเร็จเรียบร้อยครับ!');
      
      if (selectedNewsId === newsId) {
        setSelectedNewsId(null);
        setNewsTitle('');
        setNewsContent('');
      }
      fetchAdminData();
    } catch (err: any) {
      alert(`❌ ลบข่าวสารล้มเหลว: ${err.message}`);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourseTitle) {
      alert('❌ กรุณาเลือกคอร์สเรียนที่ต้องการแก้ไขจากช่องเมนูด้านล่างก่อนครับ');
      return;
    }
    try {
      const { error } = await supabase.from('courses').update({ description: editCourseDetail, price: editCoursePrice }).eq('title', editCourseTitle);
      if (error) throw error;
      alert('✨ อัปเดตราคาและข้อมูลคอร์สเรียนหน้าร้านสำเร็จเรียบร้อยครับ!');
      setEditCourseTitle(''); setEditCourseDetail(''); setEditCoursePrice(0);
      fetchAdminData();
    } catch (err: any) {
      alert(`❌ ปรับแต่งข้อมูลคอร์สล้มเหลว: ${err.message}`);
    }
  };

  const handleApproveStudent = async (enrollId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'อนุมัติแล้ว' ? 'รอตรวจสอบ' : 'อนุมัติแล้ว';
    try {
      const { error } = await supabase.from('enrollment').update({ status: nextStatus }).eq('id', enrollId);
      if (error) throw error;
      alert(`🔄 ปรับปรุงสิทธิ์สถานะนักเรียนสำเร็จครับพาร์ทเนอร์!`);
      fetchAdminData();
    } catch (err) {
      alert('❌ เกิดข้อผิดพลาดในการปรับสถานะนักเรียน');
    }
  };

  const handleViewSlip = (url: string) => {
    if (!url || url === 'null') {
      alert('❌ ไม่พบไฟล์หลักฐานสลิปโอนเงินในระบบของนักเรียนท่านนี้ครับ');
      return;
    }
    window.open(url, '_blank');
  };

  const pendingCount = enrollments.filter(item => item.status !== 'อนุมัติแล้ว').length;
  const approvedCount = enrollments.filter(item => item.status === 'อนุมัติแล้ว').length;

  const filteredEnrollments = enrollments.filter(item => {
    const nameMatch = item.student_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const phoneMatch = item.student_phone?.includes(searchQuery);
    return nameMatch || phoneMatch;
  });
  if (!isAdminLoggedIn) {
    return (
      <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '3.5rem 2.5rem', borderRadius: '28px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>ศูนย์บัญชาการแอดมินระดับสูง</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: '600', marginBottom: '2rem' }}>BANDEKTUTOR SECURITY BARRIER</p>
          {authErrorMessage && <div style={{ padding: '0.9rem 1rem', marginBottom: '1.5rem', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '0.85rem', fontWeight: '700' }}>{authErrorMessage}</div>}
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>Username:</label>
              <input type="text" required value={adminUser} onChange={(e) => setAdminUser(e.target.value)} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>Password:</label>
              <input type="password" required value={adminPass} onChange={(e) => setAdminPass(e.target.value)} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1' }} />
            </div>
            <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>🔓 ยืนยันสิทธิ์เข้าหลังบ้าน</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '2rem' }}>
      
      {/* Executive Control Main Panel Header */}
      <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2rem', borderLeft: '8px solid #0f172a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>👑 ศูนย์บัญชาการแอดมิน (Executive Control)</h1>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>ระบบจัดสรรคอร์สเรียน ข่าวสาร และประวัติผลคะแนนสอบนักเรียน</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchAdminData} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>🔄 รีเฟรชข้อมูล</button>
            <button onClick={handleAdminLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>🚪 ออกจากระบบ</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ backgroundColor: '#fffbeb', padding: '1.25rem', borderRadius: '16px', borderLeft: '5px solid #d97706' }}>
            <span style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: '700', display: 'block' }}>⏳ รายการสมัครรอกดอนุมัติสิทธิ์</span>
            <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#b45309' }}>{pendingCount} ใบสมัคร</span>
          </div>
          <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem', borderRadius: '16px', borderLeft: '5px solid #16a34a' }}>
            <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: '700', display: 'block' }}>✅ สมาชิกอนุมัติสิทธิ์เข้าเรียนแล้ว</span>
            <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#166534' }}>{approvedCount} ใบสมัคร</span>
          </div>
          <div style={{ backgroundColor: '#eff6ff', padding: '1.25rem', borderRadius: '16px', borderLeft: '5px solid #2563eb' }}>
            <span style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: '700', display: 'block' }}>📝 คลังข้อสอบทั้งหมดในระบบ</span>
            <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e40af' }}>{quizzesList.length} ข้อ</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* 🪟 📦 แผงเครื่องมือฝั่งซ้าย (Control Console Grid) */}
        <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 🏷️ กล่องที่ 1: กล่องฟอร์มปรับแต่งราคาข้อมูลคอร์สเรียน */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', marginBottom: '1.25rem' }}>🏷️ ระบบปรับแต่งราคาและข้อมูลคอร์สเรียน</h2>
            <form onSubmit={handleUpdateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select 
                value={editCourseTitle} 
                onChange={(e) => {
                  const titleName = e.target.value;
                  setEditCourseTitle(titleName);
                  const selected = dbCourses.find(c => c.title === titleName);
                  if (selected) {
                    setEditCourseDetail(selected.description || '');
                    setEditCoursePrice(selected.price || 0);
                  } else {
                    setEditCourseDetail(''); setEditCoursePrice(0);
                  }
                }} 
                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', fontWeight: '700', border: '1px solid #cbd5e1', outline: 'none' }}
              >
                <option value="">-- เลือกคอร์สเรียนที่จะแก้ไข --</option>
                <option value="คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)">👮 คอร์สติวสอบ นสต. สายปราบปราม</option>
                <option value="คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)">💼 คอร์สติวสอบ นสต. สาย อก.</option>
                <option value="คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)">📝 คอร์สลุยข้อสอบ ก.พ. ภาค ก.</option>
                <option value="คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)">👮‍♂️ คอร์สลุยข้อสอบ นสต. แยกวิชา</option>
                <option value="คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)">💼 คอร์สลุยข้อสอบ อก. แยกวิชา</option>
                <option value="คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)">🏆 คอร์ส Pre-test เสมือนจริง นสต.</option>
                <option value="คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)">🏅 คอร์ส Pre-test เสมือนจริง อก.</option>
                <option value="คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)">🏆 คอร์สติว ก.พ. ภาค ก. ผ่านชัวร์</option>
                <option value="คอร์สติวกฎหมายราชการที่จำเป็น">⚖️ คอร์สติวกฎหมายราชการที่จำเป็น</option>
                <option value="คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.">🏢 คอร์สติวสอบท้องถิ่น (อปท.)</option>
              </select>
              <input type="text" value={editCourseTitle} onChange={(e) => setEditCourseTitle(e.target.value)} placeholder="ชื่อคอร์สเรียนหน้าร้าน" style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '600', outline: 'none' }} />
              <input type="text" value={editCourseDetail} onChange={(e) => setEditCourseDetail(e.target.value)} placeholder="แก้ไขรายละเอียดคอร์ส" style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '600', outline: 'none' }} />
              <input type="number" value={editCoursePrice} onChange={(e) => setEditCoursePrice(parseInt(e.target.value) || 0)} placeholder="แก้ไขราคา (บาท)" style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none' }} />
              <button type="submit" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>💾 อัปเดตราคาข้อมูลคอร์สหน้าร้าน</button>
            </form>
          </div>
          {/* ⚙️ กล่องที่ 2: ระบบจัดการและโพสต์ประกาศควบคุมข่าวสาร (ฝั่งซ้าย) */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>⚙️ {selectedNewsId ? '📝 แก้ไขอัปเดตข่าวประกาศ' : '➕ โพสต์ประกาศข่าวสาร'}</h2>
              {selectedNewsId && <button onClick={() => { setSelectedNewsId(null); setNewsTitle(''); setNewsContent(''); }} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>🔄 สลับโหมดโพสต์ข่าวใหม่</button>}
            </div>
            <form onSubmit={handleSaveNews} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none' }}>
                <option value="📋 เกาะติดข่าวสารการสอบ">📋 เกาะติดข่าวสารการสอบ</option>
                <option value="🔔 ข่าวสารแจ้งสมาชิก">🔔 ข่าวสารแจ้งสมาชิก</option>
              </select>
              <select value={newsBadge} onChange={(e) => setNewsBadge(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '700', outline: 'none' }}>
                <option value="🚨 เปิดสอบด่วน">🚨 เปิดสอบด่วน</option>
                <option value="📢 ประกาศผล">📢 ประกาศผล</option>
                <option value="💡 VIP UPDATE">💡 VIP UPDATE</option>
                <option value="⚡ ระบบอัปเกรด">⚡ ระบบอัปเกรด</option>
              </select>
              <input type="text" required value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} placeholder="พิมพ์สรุปหัวข้อข่าวประกาศ..." style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '600', outline: 'none' }} />
              <input type="text" value={newsContent} onChange={(e) => setNewsContent(e.target.value)} placeholder="พิมพ์เนื้อหารายละเอียดข่าวสารเพิ่มเติม (ไม่บังคับกรอก...)" style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontWeight: '600', outline: 'none' }} />
              <button type="submit" style={{ backgroundColor: selectedNewsId ? '#16a34a' : '#0f172a', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
                {selectedNewsId ? '💾 บันทึกการแก้ไขข้อมูลประกาศ' : '➕ โพสต์ข่าวเข้าสู่กระดานหน้าแรก'}
              </button>
            </form>
          </div>

          {/* 📰 กล่องที่ 3: ตารางบอร์ดควบคุมรายการประกาศข่าวสาร CRUD (ย้ายมาฝั่งซ้ายใต้ฟอร์มกรอกข่าวเรียบร้อย!) */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '850', color: '#0f172a', margin: '0 0 1.25rem 0' }}>
              <span>📰</span> บอร์ดควบคุมรายการประกาศข่าวสารสถาบัน ({newsList.length} ข่าว)
            </h4>
            {newsList.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0', fontWeight: '600' }}>📭 ยังไม่มีข่าวประกาศในระบบ</p>
            ) : (
              <div style={{ overflowX: 'auto', maxHeight: '250px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ededed', color: '#475569', textAlign: 'left', fontWeight: '700' }}>
                      <th style={{ padding: '0.5rem' }}>เนื้อหาประกาศข่าวบนระบบคลาวด์</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', width: '120px' }}>จัดการระบบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsList.map((news) => (
                      <tr key={news.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b', fontWeight: '600' }}>
                        <td style={{ padding: '0.65rem 0.5rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {news.title}
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button type="button" onClick={() => handleSelectEditNews(news)} style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>📝 แก้ไข</button>
                          <button type="button" onClick={() => handleDeleteNews(news.id)} style={{ backgroundColor: '#fff5f5', color: '#e11d48', border: '1px solid #fecdd3', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>🗑️ ลบ</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
        </div> {/* ปิดแผงฝั่งซ้าย */}
        {/* 🪟 📦 แผงรายงานข้อมูลฝั่งขวา (Data Reports Console Grid) */}
        <div style={{ flex: '2 1 550px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* 👥 ตารางจัดสรรสิทธิ์ผู้สมัครเรียนและอนุมัติแยกคอร์ส */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>
                <span>👥</span> สิทธิ์ผู้สมัครเรียนและอนุมัติแยกคอร์ส ({filteredEnrollments.length})
              </h4>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 ค้นชื่อ หรือ เบอร์โทร..." 
                style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', outline: 'none', maxWidth: '240px', width: '100%' }}
              />
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>⏳ กำลังดึงข้อมูลสิทธิ์ออนไลน์...</p>
            ) : filteredEnrollments.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '1.5rem 0', fontWeight: '600' }}>📭 ไม่พบรายชื่อข้อมูลผู้เรียนที่ค้นหา</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ededed', color: '#475569', textAlign: 'left', fontWeight: '700' }}>
                      <th style={{ padding: '0.5rem' }}>ชื่อผู้สมัคร</th>
                      <th style={{ padding: '0.5rem' }}>เบอร์โทรศัพท์</th>
                      <th style={{ padding: '0.5rem' }}>คอร์สที่ระบุสิทธิ์</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>สลิป</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>สถานะสิทธิ์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnrollments.map((student) => {
                      const isApproved = student.status === 'อนุมัติแล้ว';
                      return (
                        <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', fontWeight: '600' }}>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{student.student_name}</td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#64748b' }}>{student.student_phone}</td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#0052cc', fontWeight: '700' }}>{student.course_title}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                            <button type="button" onClick={() => handleViewSlip(student.slip_url || student.slip)} style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>🖼️ ดูสลิป</button>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                            <button 
                              type="button"
                              onClick={() => handleApproveStudent(student.id, student.status)} 
                              style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', backgroundColor: isApproved ? '#dcfce7' : '#fff9db', color: isApproved ? '#15803d' : '#b45309', border: 'none' }}
                            >
                              {isApproved ? '✅ อนุมัติแล้ว' : '⏳ รอตรวจ'}
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

          {/* 📈 ตารางสถิติคะแนนการทำข้อสอบของนักเรียนรายบุคคล */}
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', margin: '0 0 1.25rem 0' }}>
              <span>📈</span> สถิติคะแนนผลสอบของนักเรียนรายบุคคล (Student Test Performance)
            </h4>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>⏳ กำลังโหลดสถิติข้อสอบ...</p>
            ) : studentStats.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '1rem 0', fontWeight: '600' }}>📭 ยังไม่มีข้อมูลสถิติประวัติการสอบในระบบ</p>
            ) : (
              <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ededed', color: '#475569', fontWeight: '700' }}>
                      <th style={{ padding: '0.5rem' }}>เบอร์โทรศัพท์</th>
                      <th style={{ padding: '0.5rem' }}>วิชา/บทเรียน</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>คะแนน</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>เปอร์เซ็นต์</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentStats.map((stat, index) => {
                      const pct = (stat.score_obtained / (stat.total_questions || 1)) * 100;
                      return (
                        <tr key={stat.id || index} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', fontWeight: '600' }}>
                          <td style={{ padding: '0.65rem 0.5rem' }}>{stat.student_phone}</td>
                          <td style={{ padding: '0.65rem 0.5rem', maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.subject_name}</td>
                          <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center', color: '#2563eb', fontWeight: '800' }}>{stat.score_obtained}/{stat.total_questions}</td>
                          <td style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>
                            <span style={{ backgroundColor: pct >= 60 ? '#e8f5e9' : '#fedeeb', color: pct >= 60 ? '#2e7d32' : '#c62828', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>{pct.toFixed(0)}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div> {/* ปิดแผงฝั่งขวา */}
      </div> {/* ปิดแผงย่อยหลัก flex */}

      {/* ฟุตเตอร์ระบบควบคุมความปลอดภัยส่วนแอดมิน */}
      <div style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8', borderTop: '1px solid #cbd5e1', paddingTop: '1.5rem' }}>
        © 2026 สถาบันบ้านเด็กติวเตอร์ (Bandektutor) • แผงควบคุมสถิติวิชาเรียนและอนุมัติสิทธิ์ความปลอดภัยสูง 🔒
      </div>

    </div>
  );
}
