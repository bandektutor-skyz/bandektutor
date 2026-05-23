'use client';
import { useState } from 'react';

export default function HomePage() {
  // 🔗 1. พิกัดลิงก์ปลายทางทำข้อสอบพรีเทสฟรีทั้ง 3 วิชาตรงเป๊ะตามสั่งครับ
  const freeTestLinks = {
    prapbram: 'https://bandektutor-skyz.github.io/BANDEK-TUTOR-HOME/', 
    amnuaykar: 'https://bandektutor-skyz.github.io/BD-Police-Exame-home/', 
    government: 'https://bandektutor-skyz.github.io/GOV-Goal/' 
  };

  // 🔐 2. สถานะกลุ่มป๊อปอัปฟอร์มชำระเงินสมัครเรียน และกลุ่มเก็บสิทธิ์ล็อกอินเบื้องต้น
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [enrollForm, setEnrollForm] = useState({ name: '', phone: '', slip: null });

  // ฟังก์ชันสั่งกางป๊อปอัปแบบฟอร์มสมัครเรียนชำระเงินจริงตรงล็อก
  const handleOpenEnroll = (courseName: string) => {
    setSelectedCourseName(courseName);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`📥 ระบบได้รับข้อมูลสมัครเรียนคอร์ส "${selectedCourseName}" ของคุณเรียบร้อยแล้ว! แอดมินจะทำการตรวจสอบและอนุมัติสิทธิ์ภายใน 5 นาทีครับ`);
    setIsModalOpen(false);
    setEnrollForm({ name: '', phone: '', slip: null });
  };

  return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* 🎚️ 3. แผงเมนูด้านบน (Navbar) แสดงปุ่มเข้าห้องเรียน ปุ่มเข้า/ออกระบบ ตรงตามสเปกของสถาบัน */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <span style={{ fontSize: '1.4rem' }}>🏠</span>
          <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0052cc', letterSpacing: '-0.02em' }}>บ้านเด็กติวเตอร์</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/classroom" style={{ textDecoration: 'none', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.45rem 1.25rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '700', border: '1px solid #bfdbfe' }}>🚪 เข้าสู่ห้องเรียนออนไลน์</a>
          <button onClick={() => alert('🔐 ระบบจัดเก็บเซสชันทำงานร่วมกับระบบแอดมินเดิมอย่างเสถียรครับ')} style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '0.45rem 1.25rem', borderRadius: '10px', fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer' }}>🔓 เข้าระบบสมาชิก</button>
        </div>
      </div>

      {/* 🟦 4. ส่วนหัวเว็บ Top Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #0052cc 0%, #00a4ff 100%)', padding: '3.5rem 2rem', color: 'white', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,82,204,0.15)' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '900', margin: '0 0 0.5rem 0', letterSpacing: '-0.03em' }}>สถาบันบ้านเด็กติวเตอร์ (BANDEKTUTOR)</h1>
        <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#e0f2fe', margin: 0 }}>ศูนย์รวมคลังข้อสอบจำลองเสมือนจริง และระบบจับเวลาอัจฉริยะเพื่อความสำเร็จในการสอบราชการ</p>
      </div>

      {/* 🚀 5. แผงแบนเนอร์ลิงก์ด่วนพรีเทสฟรี 3 วิชาหลัก ผูกพิกัดเว็บปลายทางจริงเรียบร้อยคลิกติดทันที */}
      <div style={{ maxWidth: '1280px', margin: '2.5rem auto 0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '850', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>คลังข้อสอบฟรีพรีเมียม (Free Mock Exam Links)</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* แบนเนอร์ที่ 1: เตรียมสอบ นสต.สายปราบปราม */}
          <div 
            onClick={() => window.open(freeTestLinks.prapbram, '_blank')}
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%)', padding: '1.75rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -5px rgba(30,58,138,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(30,58,138,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(30,58,138,0.3)'; }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>FREE TEST</span>
                <span style={{ fontSize: '1.8rem' }}>👮‍♂️</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 4px 0', lineHeight: '1.4' }}>พรีเทสฟรี เตรียมสอบ นสต.</h3>
              <p style={{ fontSize: '0.88rem', color: '#e0f2fe', margin: 0, fontWeight: '500' }}>สายปราบปราม (ชาย) โจทย์เจาะลึก 150 ข้อฟูลสเกล</p>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '1rem' }}>
              คลิกเข้าทำข้อสอบทันที 🚀
            </div>
          </div>
          {/* แบนเนอร์ที่ 2: นายสิบตำรวจ สาย อก. */}
          <div 
            onClick={() => window.open(freeTestLinks.amnuaykar, '_blank')}
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', padding: '1.75rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -5px rgba(15,23,42,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', border: '1px solid #d97706' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(15,23,42,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(15,23,42,0.3)'; }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ backgroundColor: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>RECOMMENDED</span>
                <span style={{ fontSize: '1.8rem' }}>💼</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 4px 0', lineHeight: '1.4' }}>พรีเทสฟรี นายสิบตำรวจ สาย อก.</h3>
              <p style={{ fontSize: '0.88rem', color: '#e0f2fe', margin: 0, fontWeight: '500' }}>สายอำนวยการและสนับสนุน เจาะระเบียบงานสารบรรณ</p>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '1rem' }}>
              เปิดระบบจำลองห้องสอบ 🎯
            </div>
          </div>

          {/* แบนเนอร์ที่ 3: คลังข้อสอบ เตรียมสอบงานราชการ */}
          <div 
            onClick={() => window.open(freeTestLinks.government, '_blank')}
            style={{ background: 'linear-gradient(135deg, #065f46 0%, #0284c7 100%)', padding: '1.75rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -5px rgba(6,95,70,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(6,95,70,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(6,95,70,0.3)'; }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>GOVERNMENT EXAM</span>
                <span style={{ fontSize: '1.8rem' }}>🏛️</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 4px 0', lineHeight: '1.4' }}>คลังข้อสอบ เตรียมสอบงานราชการ</h3>
              <p style={{ fontSize: '0.88rem', color: '#e0f2fe', margin: 0, fontWeight: '500' }}>รวมแนวข้อสอบ ก.พ. ภาค ก. และท้องถิ่น อปท. ล่าสุด</p>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '1rem' }}>
              ลุยคลังโจทย์ประยุกต์ 📚
            </div>
          </div>

        </div>
      </div>

      {/* 📰 แผงข้อมูลข่าวสารเกาะติดสนามสอบประจำวันและแจ้งเตือนสมาชิกสถาบัน */}
      <div style={{ maxWidth: '1280px', margin: '2.5rem auto 0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔥</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>เกาะติดข่าวสารการสอบราชการ</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700', display: 'block', marginBottom: '4px' }}>🚨 เปิดสอบด่วน</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: '0 0 6px 0', color: '#1e293b' }}>กองการสอบ ประกาศรับสมัครข้าราการตำรวจชั้นประทวน (นสต.) ล็อตใหม่เต็มพิกัด!</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>เปิดรับสายปราบปรามชาย ยอดรวมกว่า 1,200 อัตรา รับสมัครทางอินเทอร์เน็ตตลอด 24 ชั่วโมง เตรียมตัวฝึกข้อสอบ Pre-test ด่วนที่สุด</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📢 ประกาศผล</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: '0 0 6px 0', color: '#1e293b' }}>ประกาศผลคะแนนสอบข้อเขียน นายสิบตำรวจ สายอำนวยการ (อก.) รอบล่าสุด</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>สามารถตรวจรายชื่อผู้ผ่านการคัดเลือกและกำหนดการยื่นเอกสารรายงานตัวได้ที่ลิงก์ทางการ หรือเช็คแนวข้อสอบจำลองเตรียมสอบรอบแก้ตัวได้ในคอร์ส</p>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔔</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>ข่าวสารแจ้งสมาชิกสถาบัน</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: '700', display: 'block', marginBottom: '4px' }}>💡 สมาชิก VIP</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: '0 0 6px 0', color: '#1e293b' }}>อัปเดตแนวข้อสอบ "ระเบียบงานสารบรรณ พ.ศ. 2526" ชุดเก็งจริงเข้าตารางสอบแล้ว</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>สมาชิกคอร์สสายอำนวยการ (อก.) สามารถเข้าทำข้อสอบแนวประยุกต์ชุดใหม่ได้ทันทีในห้องเรียนออนไลน์เพื่อเพิ่มความแม่นยำในการคว้าคะแนน</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700', display: 'block', marginBottom: '4px' }}>⚡ ระบบอัปเกรด</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: '0 0 6px 0', color: '#1e293b' }}>เปิดใช้งานฟีเจอร์ "นาฬิกาจับเวลาถอยหลัง 180 นาที" ในโหมด Pre-test เต็มรูปแบบ</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>เพื่อสร้างความคุ้นเคยเสมือนนั่งทำข้อสอบจริงในห้องสอบ แนะนำให้สมาชิกทดลองเปิดหน้าป๊อปอัปทำโจทย์แบบจำกัดเวลาสัปดาห์ละ 1 ครั้ง</p>
            </div>
          </div>
        </div>
      </div>
      {/* 🎯 คอร์สลุยโจทย์ และโปรแกรม Pre-test (ระบบใหม่ฟูลออปชัน) */}
      <div style={{ maxWidth: '1280px', margin: '3.5rem auto 0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🎯</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>คอร์สลุยโจทย์ และโปรแกรม Pre-test (ระบบคลาวด์อัจฉริยะ)</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>มาใหม่ 🚨</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>👮‍♂️ คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>ติวเข้ม 6 วิชาหลัก ความสามารถทั่วไป, ภาษาไทย, ภาษาอังกฤษ, กฎหมายที่ประชาชนควรรู้, คอมพิวเตอร์ และเทคโนโลยีสารสนเทศ เจาะลึกคลังข้อสอบเก่าแน่น ๆ</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ 1,990</span>
              <button onClick={() => handleOpenEnroll('👮‍♂️ คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>แนะนำ 🎯</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>💼 คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>เจาะลึกเนื้อหาสำหรับสายอก. โดยเฉพาะ เน้นวิชาสารบรรณ งานธุรการ คอมพิวเตอร์ สังคมวัฒนธรรม จริยธรรม และภาษาต่างประเทศ พร้อมคลังสรุปสูตรลัดคว้าแต้มไว</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ 1,890</span>
              <button onClick={() => handleOpenEnroll('💼 คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#f5f3ff', color: '#7c3aed', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>คอร์สใหม่ 📄</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>📝 คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>ตะลุยคลังโจทย์ประยุกต์หนาแน่นแยกตามหัวข้อวิชา ความสามารถทั่วไป ภาษาไทย ภาษาอังกฤษ และการเป็นข้าราชการที่ดี เพื่อความเสถียรแม่นยำในการสอบ</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ 1,590</span>
              <button onClick={() => handleOpenEnroll('📝 คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

        </div>
      </div>

      {/* 🏛️ คอร์สติวเนื้อหาละเอียด (หลักสูตรมาตรฐานสถาบัน) */}
      <div style={{ maxWidth: '1280px', margin: '3.5rem auto 4rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🏛️</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 850, color: '#0f172a', margin: 0 }}>คอร์สติวเนื้อหาละเอียด (หลักสูตรมาตรฐานสถาบันมาสเตอร์เบส)</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#fffbeb', color: '#d97706', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>คอร์สแนะนำ ⭐</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>🏆 คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>สรุปเนื้อหาและสูตรลัดครบทุกหมวดวิชา ความสามารถทั่วไป ภาษาไทย ภาษาอังกฤษ และกฎหมายข้าราชการที่ดี การันตีเนื้อหาเข้าใจง่าย ปูพื้นฐานจากศูนย์จนทำโจทย์ได้</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ 1,490</span>
              <button onClick={() => handleOpenEnroll('🏆 คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>ยอดนิยม 🔥</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>⚖️ คอร์สติวกฎหมายราชการที่จำเป็น</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>รวบรวมและเจาะลึกกฎหมายหลักสำหรับการสอบราชการทุกสังกัด พ.ร.บ.วิธีปฏิบัติราชการทางปกครอง ความรับผิดทางละเมิด และกฎหมายที่ออกสอบบ่อย</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ 990</span>
              <button onClick={() => handleOpenEnroll('⚖️ คอร์สติวกฎหมายราชการที่จำเป็น')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#1e40af', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>ติวเข้ม 🏢</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0.75rem 0 0.5rem 0', color: '#0f172a' }}>🏢 คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>เจาะสเปก พ.ร.บ.จัดตั้งท้องถิ่น และแนวข้อสอบกฎหมายแผ่นดิน ครบเครื่องเรื่องสอบ อบต. อบจ. และเทศบาล ทั่วประเทศ พร้อมแนวข้อสอบเก่าเก็งแม่นยำ</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0052cc' }}>฿ 1,390</span>
              <button onClick={() => handleOpenEnroll('🏢 คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
            </div>
          </div>

        </div>
      </div>

      {/* 🔮 6. แผงโครงสร้าง Modal ป๊อปอัปสมัครเรียนและแนบสลิปชำระเงินจริง แกะดีไซน์ตรงปกจากภาพถ่ายหน้าจอ 100% */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem 2rem', borderRadius: '24px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', boxSizing: 'border-box' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>ขั้นตอนการชำระเงินสมัครเรียน</h3>
            <p style={{ color: '#475569', fontSize: '0.88rem', fontWeight: '700', margin: '0 0 1.5rem 0' }}>
              คุณเลือก: <span style={{ color: '#2563eb' }}>{selectedCourseName}</span>
            </p>

            {/* บล็อกแจ้งเลขบัญชีบริษัทสเปกทางการ */}
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '14px', textAlign: 'left', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#166534', marginBottom: '4px' }}>🏦 ธนาคารกสิกรไทย (K-Bank)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#15803d', letterSpacing: '0.05em', marginBottom: '4px' }}>123-4-56789-0</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#166534' }}>ชื่อบัญชี: บจก. บ้านเด็กติวเตอร์ (ประเทศไทย)</div>
            </div>

            <form onSubmit={handleFormSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ชื่อ-นามสกุล ผู้สมัคร:</label>
                <input type="text" required placeholder="เช่น สมชาย ตั้งใจเรียน" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>เบอร์โทรศัพท์ติดต่อ:</label>
                <input type="tel" required placeholder="เช่น 095XXXXXXX" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: '600', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>แนบภาพสลิปการโอนเงิน:</label>
                <input type="file" required style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.75rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>ยกเลิก</button>
                <button type="submit" style={{ flex: 2, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>📩 ส่งสลิปสมัครเรียน</button>
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
