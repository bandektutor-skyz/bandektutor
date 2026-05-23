'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

export default function ClassroomLoginPage() {
  const router = useRouter();
  const [phoneInput, setPhoneInput] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    const savedPhone = localStorage.getItem('user_phone');
    const savedName = localStorage.getItem('user_name');
    const savedCourse = localStorage.getItem('user_selected_course');
    if (savedPhone && savedName && savedCourse) {
      redirectUser(savedCourse, savedPhone, savedName);
    }
  }, []);

  const redirectUser = (courseTitle: string, phone: string, name: string) => {
    const params = `?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}&course=${encodeURIComponent(courseTitle)}`;
    if (courseTitle.includes('Pre-test')) {
      router.push(`/classroom/pretest${params}`);
    } else if (courseTitle.includes('ลุยข้อสอบ')) {
      router.push(`/classroom/quiz${params}`);
    } else {
      router.push(`/classroom/vdo${params}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage('⏳ กำลังประมวลผลทะเบียนสิทธิ์เรียนทั้งหมดของคุณ...');
    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('student_name, student_phone, course_title')
        .eq('student_phone', phoneInput.trim())
        .eq('status', 'อนุมัติแล้ว');

      if (error) throw error;

      if (data && data.length > 0) {
        // แกะชื่อผู้เรียนจากแถวแรกสุด (Index 0)
        const sName = data[0].student_name;
        
        // สกัดคัดกรองรายชื่อคอร์สทั้งหมดมัดกวาดเป็นอาเรย์
        const allCourseTitles = data.map((item: any) => item.course_title as string);
        const uniqueCourses = Array.from(new Set(allCourseTitles));
        
        localStorage.setItem('user_phone', phoneInput.trim());
        localStorage.setItem('user_name', sName);
        localStorage.setItem('user_my_courses', JSON.stringify(uniqueCourses));
        localStorage.setItem('user_selected_course', uniqueCourses[0]); // ตั้งต้นคอร์สแรก
        
        setLoginMessage('✅ ยินดีต้อนรับ! พบสิทธิ์เรียนทั้งหมดเรียบร้อย กำลังนำทางท่านไป...');
        redirectUser(uniqueCourses[0], phoneInput.trim(), sName);
      } else {
        setLoginMessage('❌ ไม่พบเบอร์โทรศัพท์นี้ในระบบ หรือสิทธิ์ยังไม่ได้รับการอนุมัติ');
      }
    } catch (err) {
      setLoginMessage('❌ เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '3rem 2.5rem', borderRadius: '24px', maxWidth: '#460px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>เข้าสู่ห้องเรียนออนไลน์</h2>
        <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '2rem' }}>กรุณากรอกเบอร์โทรศัพท์ที่ใช้สมัครเพื่อตรวจสอบสิทธิ์วิชาเรียนครับ</p>
        {loginMessage && (
          <div style={{ padding: '0.9rem 1rem', marginBottom: '1.5rem', borderRadius: '12px', backgroundColor: loginMessage.includes('❌') ? '#fef2f2' : '#eff6ff', color: loginMessage.includes('❌') ? '#991b1b' : '#1e40af', border: `1px solid ${loginMessage.includes('❌') ? '#fca5a5' : '#bfdbfe'}`, fontSize: '0.88rem', fontWeight: '700', textAlign: 'left' }}>
            {loginMessage}
          </div>
        )}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.88rem', color: '#475569' }}>เบอร์โทรศัพท์ของคุณ:</label>
            <input type="tel" required value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="กรอกเบอร์โทร 10 หลัก" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', boxSizing: 'border-box', fontSize: '1rem', fontWeight: '600', outline: 'none' }} />
          </div>
          <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>🔓 ยืนยันสิทธิ์เข้าเรียน</button>
        </form>
      </div>
    </div>
  );
}
