'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 

export default function HomePage() {
  const freeTestLinks = {
    prapbram: 'https://bandektutor-skyz.github.io/BANDEK-TUTOR-HOME/',
    amnuaykar: 'https://bandektutor-skyz.github.io/BD-Police-Exame-home/',
    government: 'https://bandektutor-skyz.github.io/GOV-Goal/'
  };

  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [newsList, setNewsList] = useState<any[]>([]);
  
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [uploadedSlipUrl, setUploadedSlipUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 🔄 ดึงข้อมูลข่าวสารประกาศและข้อมูลคอร์สเรียนทั้งหมดจากคลาวด์หลังบ้านโดยตรง
  const fetchDataHome = async () => {
    try {
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
      if (newsData) setNewsList(newsData);

      const { data: coursesData } = await supabase.from('courses').select('*');
      if (coursesData) setCourses(coursesData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchDataHome();
  }, []);

  const handleOpenEnroll = (name: string) => {
    setSelectedCourseName(name);
    setIsModalOpen(true);
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('slips').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('slips').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setUploadedSlipUrl(data.publicUrl);
        alert('✅ อัปโหลดภาพสลิปเข้าสู่ระบบคลาวด์สำเร็จเรียบร้อยครับ!');
      }
    } catch (err: any) {
      alert(`❌ อัปโหลดภาพสลิปล้มเหลว: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

    // ➕ อัปเกรดฟังก์ชันส่งใบสมัครหน้าแรก ตัดฟิลด์ course_code ออกชั่วคราวเพื่อทะลวงบั๊ก Schema Cache บนหน้าเว็บจริง
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone) {
      alert('❌ กรุณากรอกชื่อและเบอร์โทรศัพท์ให้ครบถ้วนครับ');
      return;
    }
    if (!uploadedSlipUrl) {
      alert('❌ กรุณารอให้อัปโหลดภาพสลิปการโอนเงินสำเร็จก่อนกดส่งใบสมัครครับ');
      return;
    }

    try {
      // ยิงข้อมูลเฉพาะส่วนที่ผ่านฉลุยเข้าตาราง enrollment บนคลาวด์หลังบ้านรวดเดียวจบ
      const { error } = await supabase.from('enrollment').insert([
        {
          student_name: studentName,
          student_phone: studentPhone,
          course_title: selectedCourseName,
          status: 'รอตรวจสอบ',
          slip_url: uploadedSlipUrl
        }
      ]);

      if (error) throw error;

      alert(`📥 ส่งหลักฐานและใบสมัครคอร์ส "${selectedCourseName}" สำเร็จเรียบร้อย! ข้อมูลวิ่งตรงเข้าสู่หน้าจอแอดมินหลังบ้านพาร์ทเนอร์ทันทีครับ`);
      setIsModalOpen(false);
      setStudentName(''); setStudentPhone(''); setUploadedSlipUrl('');
    } catch (err: any) {
      console.error(err);
      alert(`❌ เกิดข้อผิดพลาดในการส่งใบสมัคร: ${err.message}`);
    }
  };



  const hoverStyle = (e: React.MouseEvent<HTMLDivElement>, bg: string) => {
    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
    e.currentTarget.style.boxShadow = `0 16px 24px ${bg}`;
  };

  const leaveStyle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
  };
  return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
     
      {/* 🎚️ แผงเมนูด้านบน (Navbar) คงดีไซน์เรียบหรูพร้อมปุ่ม LINE OA */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.4rem' }}>🏠</span>
            <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0052cc', letterSpacing: '-0.02em' }}>บ้านเด็กติวเตอร์</span>
          </div>
          <a href="https://lin.ee/ToWcfow" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', backgroundColor: '#06c755', color: '#ffffff', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 6px rgba(6,199,85,0.25)' }}>
            <span>💬</span> LINE Official
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/classroom" style={{ textDecoration: 'none', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.45rem 1.25rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '700', border: '1px solid #bfdbfe' }}>🚪 เข้าสู่ห้องเรียนออนไลน์</a>
          <button onClick={() => alert('🔐 ระบบเซสชันสมาชิกปลอดภัยดีครับ')} style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '0.45rem 1.25rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer' }}>🔓 เข้าระบบสมาชิก</button>
        </div>
      </div>

      {/* 🟦 1. แบนเนอร์หลักผืนใหญ่สีน้ำเงินของสถาบันด้านบนสุด */}
      <div style={{ background: 'linear-gradient(135deg, #0052cc 0%, #00a4ff 100%)', padding: '3.5rem 2rem', color: 'white', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,82,204,0.15)' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '900', margin: '0 0 0.5rem 0', letterSpacing: '-0.03em' }}>สถาบันบ้านเด็กติวเตอร์ (BANDEKTUTOR)</h1>
        <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#e0f2fe', margin: 0 }}>ศูนย์รวมคลังข้อสอบจำลองเสมือนจริง และระบบจับเวลาอัจฉริยะเพื่อความสำเร็จในการสอบราชการ</p>
      </div>

      {/* ⚡ 2. คลังข้อสอบฟรีพรีเมียม (กล่องทางเข้าทำข้อสอบฟรี 3 กล่องใหญ่ตามรูปภาพเป๊ะๆ) */}
      <div style={{ maxWidth: '1280px', margin: '2.5rem auto 0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '850', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>แบบทดสอบฟรี คลังข้อสอบพรีเทสนายสิบตำรวจ และคลังข้อสอบ ก.พ.(ภาค ก.)</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div onClick={() => window.open(freeTestLinks.prapbram, '_blank')} style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%)', padding: '1.75rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.2s ease-in-out', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => hoverStyle(e, 'rgba(30,58,138,0.4)')} onMouseLeave={leaveStyle}>
            <div><span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>ฟรีเทส นสต.</span><h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '6px 0 0 0' }}>พรีเทสฟรี เตรียมสอบ นสต.</h3><p style={{ fontSize: '0.85rem', color: '#e0f2fe', marginTop: '4px', margin: 0 }}>สายปราบปราม (ชาย) เจาะลึกแนวข้อสอบเหมือนจริง รวมข้อสอบทั้งหมด 5 ชุด 750 ข้อ</p></div>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.85rem' }}>คลิกเข้าทำข้อสอบทันที 🚀</div>
          </div>
          <div onClick={() => window.open(freeTestLinks.amnuaykar, '_blank')} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', padding: '1.75rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.2s ease-in-out', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #d97706', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => hoverStyle(e, 'rgba(15,23,42,0.4)')} onMouseLeave={leaveStyle}>
            <div><span style={{ fontSize: '0.72rem', backgroundColor: '#d97706', color: 'white', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>ฟรีเทส สาย อก.</span><h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '6px 0 0 0' }}>พรีเทสฟรี นายสิบตำรวจ สาย อก.</h3><p style={{ fontSize: '0.85rem', color: '#e0f2fe', marginTop: '4px', margin: 0 }}>สายอำนวยการและสนับสนุน เจาะลึกแนวข้อสอบเหมือนจริง รวมข้อสอบทั้งหมด 5 ชุด 750 ข้อ</p></div>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.85rem' }}>คลิกเข้าทำข้อสอบทันที 🎯</div>
          </div>
          <div onClick={() => window.open(freeTestLinks.government, '_blank')} style={{ background: 'linear-gradient(135deg, #065f46 0%, #0284c7 100%)', padding: '1.75rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.2s ease-in-out', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} onMouseEnter={(e) => hoverStyle(e, 'rgba(6,95,70,0.4)')} onMouseLeave={leaveStyle}>
            <div><span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>ฟรีเทส ก.พ.(ภาค ก.)</span><h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '6px 0 0 0' }}>คลังข้อสอบ เตรียมสอบงานราชการ</h3><p style={{ fontSize: '0.85rem', color: '#e0f2fe', marginTop: '4px', margin: 0 }}>รวมแนวข้อสอบ ก.พ. (ภาค ก.) ครบทุกวิชา</p></div>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.85rem' }}>คลิกเข้าทำข้อสอบทันที 📚</div>
          </div>
        </div>
      </div>

       {/* 🟦 3. กระดานประกาศแจ้งข่าวสารแยก 2 ฝั่ง (ดีไซน์แยก 3 ส่วน: ป้าย -> หัวข้อข่าว -> ข้อความรายละเอียด) */}
      <div style={{ maxWidth: '1280px', margin: '2.5rem auto 0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(48%, 1fr))', gap: '2rem' }}>
        
        {/* คอลัมน์ซ้าย: เกาะติดข่าวสารการสอบราชการ */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔥</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>เกาะติดข่าวสารการสอบราชการ</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {newsList.filter(n => n.title?.includes('📢') || n.title?.includes('🚨') || !n.title?.includes('VIP')).slice(0, 3).map((news) => {
              // ✂️ สกัดตัดเอาข้อความในวงเล็บเหลี่ยมของประเภทข่าว [📋 เกาะติดข่าวสาร...] ออกเพื่อความคลีน
              let cleanTitle = news.title ? news.title.replace(/\[📋 เกาะติดข่าวสารการสอบ\]/g, '').trim() : '';
              
              // 🔍 ดึงเอาเฉพาะค่าป้ายสถานะกล่องแรกออกมาโชว์ (เช่น 🚨 เปิดสอบด่วน หรือ 📢 ประกาศผล)
              const badgeMatch = cleanTitle.match(/\[(.*?)\]/);
              const badgeText = badgeMatch ? badgeMatch[1] : '📢 ข่าวด่วน';
              
              // ✂️ ตัดลบตัวครอบป้ายสถานะออกเพื่อให้เหลือเฉพาะชื่อหัวข้อเนื้อหาข่าวจริง ๆ
              cleanTitle = cleanTitle.replace(/\[.*?\]/g, '').trim();

              return (
                <div key={news.id} style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  {/* 1. ส่วนป้ายสถานะ (Badge) แยกบรรทัดด้านบนสุด */}
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#fef2f2', color: '#dc2626', padding: '3px 10px', borderRadius: '6px', fontWeight: '800', border: '1px solid #fee2e2', display: 'inline-block' }}>
                      {badgeText}
                    </span>
                  </div>
                  {/* 2. ส่วนหัวข้อข่าวหลัก (หัวข่าวตัวหนาเด่นชัด) */}
                  <h4 style={{ fontSize: '1.02rem', color: '#0f172a', margin: '0 0 8px 0', lineHeight: '1.4', fontWeight: '900' }}>
                    {cleanTitle}
                  </h4>
                  {/* 3. ส่วนรายละเอียดข่าวสาร (แสดงข้อความย่อยซ้อนท่อนลงมาใต้วิชาเรียนทันที) */}
                  {news.content && news.content !== '-' && (
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: '1.5', fontWeight: '500', borderTop: '1px dashed #f1f5f9', paddingTop: '8px', marginTop: '8px' }}>
                      {news.content.replace(/\[.*?\]/g, '').trim()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* คอลัมน์ขวา: ข่าวสารแจ้งสมาชิกสถาบัน */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔔</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>ข่าวสารแจ้งสมาชิกสถาบัน</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {newsList.filter(n => n.title?.includes('VIP') || n.title?.includes('⚡')).slice(0, 3).map((news) => {
              // ✂️ สกัดตัดเอาข้อความในวงเล็บเหลี่ยมของประเภทข่าว [🔔 ข่าวสารแจ้งสมาชิก] ออกชิ้นแรก
              let cleanTitle = news.title ? news.title.replace(/\[🔔 ข่าวสารแจ้งสมาชิก\]/g, '').trim() : '';
              
              // 🔍 ดึงเอาเฉพาะค่าป้ายสถานะกล่องแรกออกมาโชว์ (เช่น 💡 VIP UPDATE หรือ ⚡ ระบบอัปเกรด)
              const badgeMatch = cleanTitle.match(/\[(.*?)\]/);
              const badgeText = badgeMatch ? badgeMatch[1] : '💡 สมาชิก VIP';
              
              // ✂️ ตัดลบตัวครอบป้ายสถานะออกเพื่อให้เหลือเฉพาะชื่อหัวข้อเนื้อหาข่าวจริง ๆ
              cleanTitle = cleanTitle.replace(/\[.*?\]/g, '').trim();

              return (
                <div key={news.id} style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  {/* 1. ส่วนป้ายสถานะ (Badge) แยกบรรทัดด้านบนสุด */}
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#fffbeb', color: '#d97706', padding: '3px 10px', borderRadius: '6px', fontWeight: '800', border: '1px solid #fef3c7', display: 'inline-block' }}>
                      {badgeText}
                    </span>
                  </div>
                  {/* 2. ส่วนหัวข้อข่าวหลัก (หัวข่าวตัวหนาเด่นชัด) */}
                  <h4 style={{ fontSize: '1.02rem', color: '#0f172a', margin: '0 0 8px 0', lineHeight: '1.4', fontWeight: '900' }}>
                    {cleanTitle}
                  </h4>
                  {/* 3. ส่วนรายละเอียดข่าวสาร (แสดงข้อความย่อยซ้อนท่อนลงมาใต้วิชาเรียนทันที) */}
                  {news.content && news.content !== '-' && (
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: '1.5', fontWeight: '500', borderTop: '1px dashed #f1f5f9', paddingTop: '8px', marginTop: '8px' }}>
                      {news.content.replace(/\[.*?\]/g, '').trim()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>


      {/* 🏛️ หมวดหมู่ที่ 1: คอร์สติวเนื้อหาละเอียด (หลักสูตรมาตรฐานสถาบันมาสเตอร์เบส) */}
      <div style={{ maxWidth: '1280px', margin: '3.5rem auto 0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🏛️</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 850, color: '#0f172a', margin: 0 }}>คอร์สติวเนื้อหาละเอียด (คลิป VDO / ไฟล์ PDF. / แบบทดสอบ)</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

          {/* คอร์สที่ 1: นสต. สายปราบปราม */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.25rem 0.6`rem', borderRadius: '6px', fontWeight: '700' }}>มาใหม่ 🚨</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>👮‍♂️ คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>ติวเข้ม 6 วิชาหลัก ตรงตามหลักสูตรการสอบ พร้อมเจาะลึกคลังข้อสอบเก่าแน่นๆ</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)')?.price || 1990}</span>
              <button onClick={() => handleOpenEnroll('คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          {/* คอร์สที่ 2: นสต. สายอำนวยการ อก. */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#fffbeb', color: '#d97706', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>แนะนำ 🎯</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>💼 คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>ติวเข้ม 6 วิชาหลัก ตรงตามหลักสูตรการสอบ พร้อมเจาะลึกคลังข้อสอบเก่าแน่นๆ</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)')?.price || 1500}</span>
              <button onClick={() => handleOpenEnroll('คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          {/* คอร์สที่ 3: ก.พ. ภาค ก. ผ่านชัวร์ */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#fdf2f8', color: '#db2777', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>คอร์สแนะนำ ⭐</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>🏆 คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>สรุปเนื้อหาและติวเข้มครบทุกหมวดวิชา ความสามารถทั่วไป ภาษาไทย ภาษาอังกฤษ และกฎหมายข้าราชการที่ดี พร้อมแบบทดสอบประจำบทเรียน</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)')?.price || 1500}</span>
              <button onClick={() => handleOpenEnroll('คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          {/* คอร์สที่ 4: กฎหมายราชการที่จำเป็น */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#fff1f2', color: '#e11d48', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>ยอดนิยม 🔥</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>⚖️ คอร์สติวกฎหมายราชการที่จำเป็น</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>รวบรวมและเจาะลึกกฎหมายหลักสำหรับการสอบราชการทุกสังกัด พ.ร.บ.วิธีปฏิบัติราชการทางปกครอง และกฎหมายออกสอบบ่อย</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์สติวกฎหมายราชการที่จำเป็น')?.price || 990}</span>
              <button onClick={() => handleOpenEnroll('คอร์สติวกฎหมายราชการที่จำเป็น')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          {/* คอร์สที่ 5: ติวสอบท้องถิ่น อปท. */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>ติวเข้ม 🏢</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>🏢 คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>ติวเข้มครบเครื่องเรื่องสอบ อบต. อบจ. และเทศบาลทั่วประเทศ</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.')?.price || 1390}</span>
              <button onClick={() => handleOpenEnroll('🏢 คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

        </div>
      </div>
      {/* 🎯 หมวดหมู่ที่ 2: คอร์สตะลุยโจทย์แนวข้อสอบ และโปรแกรม Pre-test (ระบบคลาวด์อัจฉริยะ) */}
      <div style={{ maxWidth: '1280px', margin: '3.5rem auto 0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🎯</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>คอร์สตะลุยโจทย์แนวข้อสอบ ครบถ้วนตามหลักสูตรการสอบ (แยกรายวิชา)</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
         
          {/* คอร์สลุยข้อสอบ นสต. */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#f0f9ff', color: '#0284c7', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>ตะลุยโจทย์ 🗂️</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>👮‍♂️ คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>คอร์สตะลุยโจทย์ เจาะลึกแนวข้อสอบ ครบถ้วน 6 วิชาหลักสายปราบปราม รวมแนวข้อสอบมากกว่า 600 ข้อ</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)')?.price || 1790}</span>
              <button onClick={() => handleOpenEnroll('คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          {/* คอร์สลุยข้อสอบ อก. */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>ตะลุยโจทย์ 💼</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>💼 คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>คอร์สตะลุยข้อสอบ สาย อก. ครบตามหลักสูตรการสอบ พร้อมเพิ่มคลังข้อสอบวิชาระเบียบงานสารบรรณ</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)')?.price || 1690}</span>
              <button onClick={() => handleOpenEnroll('คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          {/* คอร์สลุยข้อสอบ ก.พ. */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#fff7ed', color: '#ea580c', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>คอร์สใหม่ 📄</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>📝 คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>ตะลุยคลังโจทย์แยกตามหัวข้อวิชา ความสามารถทั่วไป ภาษาไทย ภาษาอังกฤษ และการเป็นข้าราชการที่ดี</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)')?.price || 1590}</span>
              <button onClick={() => handleOpenEnroll('คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>


          {/* คอร์สที่ 11: คอร์สลุยข้อสอบ สาย อก./สพฐ.ตร. (รหัส 11) */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>ตะลุยโจทย์ 💼</span>
              <h4 style={{ fontSize: '1.02rem', fontWeight: '900', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>💼 คอร์สลุยข้อสอบ นายสิบตำรวจ สาย อก./สพฐ.ตร. (ตะลุยโจทย์แยกรายวิชา)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>คอร์สลุยข้อสอบ สาย อก./สพฐ.ตร. ครบตามหลักสูตรการสอบ 6 วิชา ใหม่ล่าสุด (ลุยข้อสอบ 12 ชุด 1,200 ข้อ)</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '950', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์สลุยข้อสอบ นายสิบตำรวจ สาย อก./สพฐ.ตร. (ตะลุยโจทย์แยกรายวิชา)')?.price || 1690}</span>
              <button onClick={() => handleOpenEnroll('คอร์สลุยข้อสอบ นายสิบตำรวจ สาย อก./สพฐ.ตร. (ตะลุยโจทย์แยกรายวิชา)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,82,204,0.15)' }}>สมัครเรียนเลย 🚀</button>
           </div>
          </div>
        </div>
      </div>


      {/* 🏆 หมวดหมู่ที่ 3: คอร์ส Pre-test ข้อสอบเสมือนจริง นายสิบตำรวจ */}
      <div style={{ maxWidth: '1280px', margin: '3.5rem auto 0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🏆</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>คอร์ส Pre-test ข้อสอบเสมือนจริง นายสิบตำรวจ (ระบบจับเวลาและสรุปคะแนน เสมือนจริง)</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

          {/* คอร์ส Pre-test นสต. */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>MOCK EXAM 🏆</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>🏆 คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลาทำข้อสอบ/สรุปคะแนน)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>พรีเทส นายสิบตำรวจ นสต.ระบบจำลองสนามสอบจริง ด้วยชุดข้อสอบ 5 ชุด ชุดละ 150 ข้อเต็ม มีนาฬิกานับถอยหลัง 3 ชั่วโมง สรุปคะแนนประเมินทันที</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)')?.price || 1990}</span>
              <button onClick={() => handleOpenEnroll('คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          {/* คอร์ส Pre-test สาย อก. */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#e2fbf0', color: '#0d9488', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>MOCK EXAM 🏅</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>🏅 คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลาทำข้อสอบ/สรุปคะแนน)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>พรีเทส นายสิบตำรวจ สาย อก.ระบบจำลองสนามสอบจริง ด้วยชุดข้อสอบ 5 ชุด ชุดละ 150 ข้อเต็ม มีนาฬิกานับถอยหลัง 3 ชั่วโมง สรุปคะแนนประเมินทันที</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)')?.price || 1880}</span>
              <button onClick={() => handleOpenEnroll('คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          {/* คอร์สที่ 12: คอร์ส Pre-test ข้อสอบเสมือนจริง สาย อก./สพฐ.ตร. (รหัส 12) */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#e2fbf0', color: '#0d9488', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>MOCK EXAM ⏱️</span>
              <h4 style={{ fontSize: '1.02rem', fontWeight: '900', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>🏆 คอร์ส Pre-test ข้อสอบเสมือนจริง สาย อก./สพฐ.ตร. ตามหลักสูตรใหม่ล่าสุด (จับเวลาทำข้อสอบ/สรุปคะแนน)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>พรีเทส นายสิบตำรวจ สาย อก./สพฐ.ตร. ครบตามหลักสูตรการสอบ 6 วิชา ใหม่ล่าสุด ด้วยชุดข้อสอบ 15 ชุด ชุดละ 150 ข้อเต็ม (รวมข้อสอบ 2,250 ข้อ)</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '950', color: '#0052cc' }}>฿ {courses.find(c => c.title === 'คอร์ส Pre-test ข้อสอบเสมือนจริง สาย อก./สพฐ.ตร. ตามหลักสูตรใหม่ล่าสุด (จับเวลาทำข้อสอบ/สรุปคะแนน)')?.price || 1880}</span>
              <button onClick={() => handleOpenEnroll('คอร์ส Pre-test ข้อสอบเสมือนจริง สาย อก./สพฐ.ตร. ตามหลักสูตรใหม่ล่าสุด (จับเวลาทำข้อสอบ/สรุปคะแนน)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,82,204,0.15)' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

        </div>
      </div>
      {/* 🔮 โครงสร้าง Modal ป๊อปอัปสมัครเรียนจริง ผูก State และระบบอัปโหลดไฟล์ภาพสลิปเข้า Storage */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem 2rem', borderRadius: '24px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', boxSizing: 'border-box' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>ขั้นตอนการชำระเงินสมัครเรียน</h3>
            <p style={{ color: '#475569', fontSize: '0.88rem', fontWeight: '700', margin: '0 0 1.5rem 0' }}>คุณเลือก: <span style={{ color: '#2563eb' }}>{selectedCourseName}</span></p>
            
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '14px', textAlign: 'left', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#166534', marginBottom: '4px' }}>🏦 ธนาคารกสิกรไทย (K-Bank)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#15803d', letterSpacing: '0.05em', marginBottom: '4px' }}>123-4-56789-0</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#166534' }}>ชื่อบัญชี: บจก. บ้านเด็กติวเตอร์ (ประเทศไทย)</div>
            </div>

            <form onSubmit={handleFormSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ชื่อ-นามสกุล ผู้สมัคร:</label>
                <input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="สมชาย ตั้งใจเรียน" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>เบอร์โทรศัพท์ติดต่อ:</label>
                <input type="tel" required value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} placeholder="095XXXXXXX" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>แนบภาพสลิปการโอนเงินจริง:</label>
                <input type="file" required accept="image/*" onChange={handleSlipUpload} style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                {isUploading && <p style={{ color: '#2563eb', fontSize: '0.78rem', fontWeight: '700', margin: '4px 0 0 0' }}>⏳ กำลังอัปโหลดภาพสลิปขึ้นระบบคลาวด์...</p>}
                {uploadedSlipUrl && <p style={{ color: '#16a34a', fontSize: '0.78rem', fontWeight: '700', margin: '4px 0 0 0' }}>✨ เตรียมพร้อมส่งข้อมูลหลักฐานเรียบร้อย</p>}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.75rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>ยกเลิก</button>
                <button type="submit" disabled={isUploading} style={{ flex: 2, background: isUploading ? '#cbd5e1' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                  {isUploading ? '⏳ กำลังบันทึก...' : '📩 ส่งใบสมัครเรียน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟦 ส่วนท้ายเว็บไซต์ Footer */}
      <div style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '2rem', textAlign: 'center', fontSize: '0.85rem', borderTop: '1px solid #1e293b', marginTop: '4rem' }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>© 2026 บ้านเด็กติวเตอร์ (Bandektutor) - สงวนลิขสิทธิ์ทุกประการ</p>
        <p style={{ margin: 0, color: '#64748b' }}>พัฒนาโดยสถาปัตยกรรม Next.js & Supabase Cloud Engine ระดับมืออาชีพ</p>
      </div>

    </div>
  );
}
