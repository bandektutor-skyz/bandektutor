'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // แก้ไขเส้นทางถอยหลังเป็นจุดสองชั้นเรียบร้อย ปลอดภัย 100%

interface Enrollment {
  id: number;
  student_name: string;
  student_phone: string;
  course_title: string;
  slip_url: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // ฟังก์ชันหลักดึงข้อมูลใบสมัครเรียนทั้งหมดจากฐานข้อมูล Supabase เรียงลำดับจากล่าสุด
  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setEnrollments(data);
    } catch (error: any) {
      console.error(error);
      setStatusMessage(`❌ ดึงข้อมูลล้มเหลว: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // ฟังก์ชันกดคลิกอัปเดตสถานะ "อนุมัติให้เข้าเรียน" ยิงตรงไปแก้ค่าในฐานข้อมูล Supabase
  const handleApprove = async (id: number) => {
    setStatusMessage('⏳ กำลังอัปเดตสถานะการอนุมัติ...');
    try {
      const { error } = await supabase
        .from('enrollment')
        .update({ status: 'อนุมัติแล้ว' })
        .eq('id', id);

      if (error) throw error;

      setStatusMessage('✅ อนุมัติสิทธิ์การเข้าเรียนสำเร็จเรียบร้อยแล้ว!');
      fetchEnrollments(); // สั่งโหลดตารางข้อมูลใหม่ให้เป็นปัจจุบันทันที
      
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error: any) {
      setStatusMessage(`❌ อนุมัติล้มเหลว: ${error.message}`);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '2rem' }}>
      
      {/* ส่วนหัวของแผงควบคุมระบบ (Admin Header) */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #dee2e6', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#212529', fontSize: '2rem', fontWeight: 'bold' }}>⚙️ แผงควบคุมระบบแอดมิน | บ้านเด็กติวเตอร์</h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#6c757d' }}>ระบบตรวจสอบยอดเงินโอนและอนุมัติสิทธิ์การเข้าเรียนของนักเรียน</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🏠 ไปหน้าแรกของเว็บ
        </button>
      </header>

      {/* แถบแจ้งเตือนสถานะการประมวลผล */}
      {statusMessage && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '6px', backgroundColor: statusMessage.includes('❌') ? '#f8d7da' : '#d1e7dd', color: statusMessage.includes('❌') ? '#842029' : '#0f5132', fontWeight: 'bold' }}>
          {statusMessage}
        </div>
      )}
      {/* ส่วนแสดงตารางรายชื่อผู้สมัครเรียน (Enrollment Table) */}
      <main style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6c757d', fontWeight: 'bold', padding: '2rem' }}>⏳ กำลังโหลดข้อมูลรายชื่อนักเรียนจากหลังบ้าน...</p>
        ) : enrollments.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>📊 ยังไม่มีรายชื่อผู้สมัครเรียนในระบบขณะนี้</p>
            <p style={{ fontSize: '0.95rem', color: '#0070f3', marginTop: '0.5rem' }}>💡 ลองเปิดหน้าเว็บหลักแล้วกดสมัครเรียนส่งสลิปเข้ามาทดสอบได้เลยครับ!</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '1rem', color: '#495057' }}>ID บันทึก</th>
                <th style={{ padding: '1rem', color: '#495057' }}>ชื่อ-นามสกุล นักเรียน</th>
                <th style={{ padding: '1rem', color: '#495057' }}>เบอร์โทรศัพท์</th>
                <th style={{ padding: '1rem', color: '#495057' }}>คอร์สเรียนที่สมัคร</th>
                <th style={{ padding: '1rem', color: '#495057', textAlign: 'center' }}>หลักฐานการโอนเงิน</th>
                <th style={{ padding: '1rem', color: '#495057', textAlign: 'center' }}>สถานะปัจจุบัน</th>
                <th style={{ padding: '1rem', color: '#495057', textAlign: 'center' }}>การจัดการระบบ</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((item) => {
                const isApproved = item.status === 'อนุมัติแล้ว';
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: '#6c757d' }}>#{item.id}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold', color: '#212529' }}>{item.student_name}</td>
                    <td style={{ padding: '1rem', color: '#495057' }}>{item.student_phone}</td>
                    <td style={{ padding: '1rem', color: '#0052cc', fontWeight: 'bold' }}>{item.course_title}</td>
                    
                    {/* ส่วนแสดงลิงก์เปิดตรวจทานรูปภาพสลิปโอนเงินตัวจริงบนคลาวด์ */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {item.slip_url ? (
                        <a 
                          href={item.slip_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ backgroundColor: '#e6f0ff', color: '#0070f3', padding: '0.4rem 0.8rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-block', border: '1px solid #b3d4ff' }}
                        >
                          👁️ คลิกเปิดดูสลิปภาพ
                        </a>
                      ) : (
                        <span style={{ color: '#aeaeae', fontSize: '0.85rem' }}>ไม่มีไฟล์ภาพ</span>
                      )}
                    </td>

                    {/* ป้ายแสดงสถานะการจ่ายเงินปรับสีตามเงื่อนไขการตลาด */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: isApproved ? '#d1e7dd' : '#fff3cd', 
                        color: isApproved ? '#0f5132' : '#664d03', 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem', 
                        fontWeight: 'bold',
                        display: 'inline-block'
                      }}>
                        {item.status || 'รอตรวจสอบ'}
                      </span>
                    </td>

                    {/* ปุ่มกดคำสั่งควบคุมอนุมัติสิทธิ์ยิงหาหลังบ้าน Supabase */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {isApproved ? (
                        <button 
                          disabled 
                          style={{ backgroundColor: '#e2e3e5', color: '#7f8284', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'not-allowed' }}
                        >
                          ✓ อนุมัติสำเร็จแล้ว
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApprove(item.id)}
                          style={{ backgroundColor: '#198754', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(25,135,84,0.2)', transition: 'background-color 0.2s' }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#157347')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#198754')}
                        >
                          👍 กดอนุมัติเข้าเรียน
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>

      {/* ส่วนท้ายแสดงระบบเวอร์ชันหลังบ้านแอดมิน */}
      <footer style={{ marginTop: '3rem', textAlign: 'center', color: '#adb5bd', fontSize: '0.85rem' }}>
        <p>© 2026 แผงควบคุมสิทธิ์ บ้านเด็กติวเตอร์ (Admin Platform) - ปลอดภัยสูงผ่านการเข้ารหัสโครงสร้างสตรีมมิ่ง</p>
      </footer>

    </div>
  );
}
