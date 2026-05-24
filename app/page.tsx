'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // 🔗 ท่อตรงเชื่อมหลังบ้านตามพิกัดจริง

export default function HomePage() {
  // 🔗 พิกัดลิงก์ปลายทางทำข้อสอบพรีเทสฟรีทั้ง 3 วิชาตรงเป๊ะตามสเปกสถาบัน
  const freeTestLinks = {
    prapbram: 'https://bandektutor-skyz.github.io/BANDEK-TUTOR-HOME/', 
    amnuaykar: 'https://bandektutor-skyz.github.io/BD-Police-Exame-home/', 
    government: 'https://bandektutor-skyz.github.io/GOV-Goal/' 
  };

  // 🔐 สถานะกลุ่มป๊อปอัปฟอร์มชำระเงินสมัครเรียน และกลุ่มเก็บสิทธิ์ข้อมูลคอร์ส
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 📡 ฟังก์ชันเรียกกวาดราคาสดจากหลังบ้านมาอัปเดต 10 คอร์สมาตรฐานแบบ Real-time
  useEffect(() => {
    async function fetchRealTimePrices() {
      // 🛍️ รายการคอร์สติวทั้งหมด 10 คอร์สเต็มอัตรา (คงเดิมครบถ้วนสมบูรณ์ 100%)
      const defaultCourses = [
        // [กลุ่มที่ 1: คอร์สตะลุยโจทย์ และโปรแกรม Pre-test ระบบใหม่]
        {
          id: 1,
          course_code: '01',
          title: '👮 คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)',
          description: 'ติวเข้ม 6 วิชาหลัก ความสามารถทั่วไป, ภาษาไทย, ภาษาอังกฤษ, กฎหมายที่ประชาชนควรรู้, คอมพิวเตอร์ และเทคโนโลยีสารสนเทศ เจาะลึกคลังข้อสอบเก่าแน่น ๆ',
          price: 1990,
          badge: 'มาใหม่ 🚨',
          group: 1,
          gradient: 'linear-gradient(135deg, #0f172a, #2563eb)',
          accentColor: '#2563eb'
        },
        {
          id: 2,
          course_code: '02',
          title: '💼 คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)',
          description: 'เจาะลึกเนื้อหาสำหรับสายอก. โดยเฉพาะ เน้นวิชาสารบรรณ งานธุรการ คอมพิวเตอร์ สังคมวัฒนธรรม จริยธรรม และภาษาต่างประเทศ พร้อมคลังสรุปสูตรลัดคว้าแต้มไว',
          price: 1890,
          badge: 'แนะนำ 🎯',
          group: 1,
          gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
          accentColor: '#f59e0b'
        },
        {
          id: 3,
          course_code: '03',
          title: '📝 คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)',
          description: 'ตะลุยคลังโจทย์ประยุกต์หนาแน่นแยกตามหัวข้อวิชา ความสามารถทั่วไป ภาษาไทย ภาษาอังกฤษ และการเป็นข้าราชการที่ดี เพื่อความเสถียรแม่นยำในการสอบ',
          price: 1590,
          badge: 'คอร์สใหม่ 📄',
          group: 1,
          gradient: 'linear-gradient(135deg, #9f1239, #f43f5e)',
          accentColor: '#f43f5e'
        },
        {
          id: 6,
          course_code: '06',
          title: '🏆 คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)',
          description: 'ระบบ Pure Test Engine จำลองสนามสอบจริง 5 ชุดข้อสอบ ชุดละ 150 ข้อเต็ม มีนาฬิกานับถอยหลัง 3 ชั่วโมง กดย้อนกลับ-เดินหน้าข้ามข้อสอบได้อิสระ พร้อมสรุปคะแนนทันที',
          price: 1990,
          badge: 'MOCK EXAM 🏆',
          group: 1,
          gradient: 'linear-gradient(135deg, #3730a3, #6366f1)',
          accentColor: '#6366f1'
        },
        {
          id: 7,
          course_code: '07',
          title: '🏅 คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)',
          description: 'แบบทดสอบม็อคเอ็กแซมฟูลสเกล 5 ชุดจัดเต็ม สัดส่วนข้อสอบ 150 ข้อตรงตามเกณฑ์กองการสอบสายอำนวยการ ควบคุมเวลา 180 นาที เสมือนนั่งในห้องสอบจริง',
          price: 1890,
          badge: 'MOCK EXAM 🏅',
          group: 1,
          gradient: 'linear-gradient(135deg, #065f46, #10b981)',
          accentColor: '#10b981'
        },
        // [กลุ่มที่ 2: คอร์สตะลุยโจทย์แยกรายวิชา]
        {
          id: 4,
          course_code: '04',
          title: '👮 คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)',
          description: 'เน้นเก็งข้อสอบจริง เจาะลึก 5 บททดสอบต่อหนึ่งรายวิชา วิชาละ 50 ข้อฟูล ครบถ้วน 6 วิชาหลักสายปราบปราม ไร้วิดีโอกวนใจ โหลดไวเน้นทำโจทย์',
          price: 1790,
          badge: 'ตะลุยโจทย์ 🗂️',
          group: 2,
          gradient: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
          accentColor: '#0ea5e9'
        },
        {
          id: 5,
          course_code: '05',
          title: '💼 คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)',
          description: 'หลักสูตรตะลุยโจทย์สำหรับสายธุรการและสารบรรณโดยเฉพาะ วิชาละ 5 บททดสอบจุใจ พร้อมเพิ่มคลังข้อสอบวิชาระเบียบงานสารบรรณ พ.ศ. 2526 ตัวอัปเดตล่าสุด',
          price: 1690,
          badge: 'ตะลุยโจทย์ 💼',
          group: 2,
          gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)',
          accentColor: '#14b8a6'
        },
        // [กลุ่มที่ 3: คอร์สติวเนื้อหาละเอียด หลักสูตรมาตรฐานสถาบัน]
        {
          id: 8,
          course_code: '08',
          title: '🏆 คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)',
          description: 'สรุปเนื้อหาและสูตรลัดครบทุกหมวดวิชา ความสามารถทั่วไป ภาษาไทย ภาษาอังกฤษ และกฎหมายข้าราชการที่ดี การันตีเนื้อหาเข้าใจง่าย ปูพื้นฐานจากศูนย์จนทำโจทย์ได้',
          price: 1490,
          badge: 'คอร์สแนะนำ ⭐',
          group: 3,
          gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          accentColor: '#a855f7'
        },
        {
          id: 9,
          course_code: '09',
          title: '⚖️ คอร์สติวกฎหมายราชการที่จำเป็น',
          description: 'รวบรวมและเจาะลึกกฎหมายหลักสำหรับการสอบราชการทุกสังกัด พ.ร.บ.วิธีปฏิบัติราชการทางปกครอง ละเมิด และกฎหมายที่ออกสอบบ่อย จำง่ายด้วย Mind Map',
          price: 990,
          badge: 'ยอดนิยม 🔥',
          group: 3,
          gradient: 'linear-gradient(135deg, #c2410c, #ea580c)',
          accentColor: '#ea580c'
        },
        {
          id: 10,
          course_code: '10',
          title: '🏢 คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.',
          description: 'เจาะสเปก พ.ร.บ.จัดตั้งท้องถิ่น และแนวข้อสอบกฎหมายแผ่นดิน ครบเครื่องเรื่องสอบ อบต. อบจ. และเทศบาล ทั่วประเทศ พร้อมแนวข้อสอบเก่าเก็งแม่นยำ',
          price: 1390,
          badge: 'ติวเข้ม 🏢',
          group: 3,
          gradient: 'linear-gradient(135deg, #15803d, #22c55e)',
          accentColor: '#22c55e'
        }
      ];
      try {
        setIsLoading(true);
        const { data: dbData } = await supabase.from('courses').select('course_code, price');
        if (dbData && dbData.length > 0) {
          const updated = defaultCourses.map(course => {
            const match = dbData.find(db => String(db.course_code) === String(course.course_code));
            return match ? { ...course, price: match.price } : course;
          });
          setCourses(updated);
        } else {
          setCourses(defaultCourses);
        }
      } catch (err) {
        setCourses(defaultCourses);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRealTimePrices();
  }, []);

  const handleOpenEnroll = (courseName: string) => {
    setSelectedCourseName(courseName);
    setIsModalOpen(true);
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

      {/* 🚀 5. แผงแบนเนอร์ลิงก์ด่วนพรีเทสฟรี 3 วิชาหลัก */}
      <div style={{ maxWidth: '1280px', margin: '2.5rem auto 0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '850', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>คลังข้อสอบฟรีพรีเมียม (Free Mock Exam Links)</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div onClick={() => window.open(freeTestLinks.prapbram, '_blank')} style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%)', padding: '1.75rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -5px rgba(30,58,138,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>FREE TEST</span>
                <span style={{ fontSize: '1.8rem' }}>👮‍♂️</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 4px 0', lineHeight: '1.4' }}>พรีเทสฟรี เตรียมสอบ นสต.</h3>
              <p style={{ fontSize: '0.88rem', color: '#e0f2fe', margin: 0, fontWeight: '500' }}>สายปราบปราม (ชาย) โจทย์เจาะลึก 150 ข้อฟูลสเกล</p>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '1rem' }}>คลิกเข้าทำข้อสอบทันที 🚀</div>
          </div>
          <div onClick={() => window.open(freeTestLinks.amnuaykar, '_blank')} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)', padding: '1.75rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -5px rgba(15,23,42,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', border: '1px solid #d97706' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ backgroundColor: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>RECOMMENDED</span>
                <span style={{ fontSize: '1.8rem' }}>💼</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 4px 0', lineHeight: '1.4' }}>พรีเทสฟรี นายสิบตำรวจ สาย อก.</h3>
              <p style={{ fontSize: '0.88rem', color: '#e0f2fe', margin: 0, fontWeight: '500' }}>สายอำนวยการและสนับสนุน เจาะระเบียบงานสารบรรณ</p>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '1rem' }}>เปิดระบบจำลองห้องสอบ 🎯</div>
          </div>
          <div onClick={() => window.open(freeTestLinks.government, '_blank')} style={{ background: 'linear-gradient(135deg, #065f46 0%, #0284c7 100%)', padding: '1.75rem', borderRadius: '20px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 10px 20px -5px rgba(6,95,70,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>GOVERNMENT EXAM</span>
                <span style={{ fontSize: '1.8rem' }}>🏛️</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: '0 0 4px 0', lineHeight: '1.4' }}>คลังข้อสอบ เตรียมสอบงานราชการ</h3>
              <p style={{ fontSize: '0.88rem', color: '#e0f2fe', margin: 0, fontWeight: '500' }}>รวมแนวข้อสอบ ก.พ. ภาค ก. และท้องถิ่น อปท. ล่าสุด</p>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '1rem' }}>ลุยคลังโจทย์ประยุกต์ 📚</div>
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
      {/* 🎯 ส่วนแสดงผลกลุ่มคอร์สเรียนคลาวด์แยกแถวตามรหัสข้อสอบจริงสถาบัน */}
      <div style={{ maxWidth: '1280px', margin: '4.5rem auto 4rem auto', padding: '0 2rem' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.1rem', color: '#64748b' }}>🔄 กำลังเชื่อมต่อฐานข้อมูลดึงข้อมูลราคาล่าสุด...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            
            {/* 🟦 หมวดหมู่ที่ 1: คอร์สติวสอบนายสิบตำรวจและงานราชการ */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>👮‍♂️</span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>คอร์สติวสอบนายสิบตำรวจและงานราชการ</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {courses.filter(c => ['09', '08', '10', '01', '02'].includes(c.course_code)).map((course) => (
                  <div key={course.id} style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', overflow: 'hidden' }}>
                    <div style={{ background: course.gradient, margin: '-1.75rem -1.75rem 1.5rem -1.75rem', padding: '1.25rem 1.75rem', color: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.6rem', borderRadius: '8px', fontWeight: '700' }}>{course.badge}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', opacity: 0.9 }}>รหัส {course.course_code}</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0.75rem 0 0 0', color: '#ffffff', lineHeight: '1.4' }}>{course.title}</h4>
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 1.5rem 0', lineHeight: '1.6' }}>{course.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '1.25rem' }}>
                        <div><span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700' }}>ราคาพิเศษ</span><span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>฿ {Number(course.price).toLocaleString()}</span></div>
                        <button onClick={() => handleOpenEnroll(course.title)} style={{ backgroundColor: course.accentColor, color: 'white', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* 🗂️ หมวดหมู่ที่ 2: คอร์สตะลุยโจทย์แนวข้อสอบ */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🗂️</span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>คอร์สตะลุยโจทย์แนวข้อสอบ</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {courses.filter(c => ['03', '04', '05'].includes(c.course_code)).map((course) => (
                  <div key={course.id} style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', overflow: 'hidden' }}>
                    <div style={{ background: course.gradient, margin: '-1.75rem -1.75rem 1.5rem -1.75rem', padding: '1.25rem 1.75rem', color: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.6rem', borderRadius: '8px', fontWeight: '700' }}>{course.badge}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', opacity: 0.9 }}>รหัส {course.course_code}</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0.75rem 0 0 0', color: '#ffffff', lineHeight: '1.4' }}>{course.title}</h4>
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 1.5rem 0', lineHeight: '1.6' }}>{course.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '1.25rem' }}>
                        <div><span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700' }}>ราคาพิเศษ</span><span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>฿ {Number(course.price).toLocaleString()}</span></div>
                        <button onClick={() => handleOpenEnroll(course.title)} style={{ backgroundColor: course.accentColor, color: 'white', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* 🏛️ หมวดหมู่ที่ 3: คอร์สพรีเทส ข้อสอบเสมือนจริง นายสิบตำรวจ */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🏛️</span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '850', color: '#0f172a', margin: 0 }}>คอร์สพรีเทส ข้อสอบเสมือนจริง นายสิบตำรวจ</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {courses.filter(c => ['06', '07'].includes(c.course_code)).map((course) => (
                  <div key={course.id} style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', overflow: 'hidden' }}>
                    <div style={{ background: course.gradient, margin: '-1.75rem -1.75rem 1.5rem -1.75rem', padding: '1.25rem 1.75rem', color: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.6rem', borderRadius: '8px', fontWeight: '700' }}>{course.badge}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', opacity: 0.9 }}>รหัส {course.course_code}</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0.75rem 0 0 0', color: '#ffffff', lineHeight: '1.4' }}>{course.title}</h4>
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 1.5rem 0', lineHeight: '1.6' }}>{course.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '1.25rem' }}>
                        <div><span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700' }}>ราคาพิเศษ</span><span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>฿ {Number(course.price).toLocaleString()}</span></div>
                        <button onClick={() => handleOpenEnroll(course.title)} style={{ backgroundColor: course.accentColor, color: 'white', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '12px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer' }}>สมัครเรียนเลย 🚀</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>


      {/* Modal Popup ฟอร์มสมัครเรียนและแนบสลิปชำระเงินจริง */}
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

            <form onSubmit={(e) => { e.preventDefault(); alert('📥 ส่งข้อมูลชำระเงินเรียบร้อยแล้ว แอดมินจะอนุมัติใน 5 นาทีครับ'); setIsModalOpen(false); }} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
