'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../supabaseClient'; // เชื่อมต่อระบบฐานข้อมูลหลังบ้านเสถียร 100%

// ⏱️ คลังข้อมูลสารบัญแมปปิ้งข้อสอบพรีเทสกลุ่มที่ 3 (จับเวลา 180 นาทีฟูลสเกล พาร์ทที่ 1)
const pretestCoursesContent: { [key: string]: any[] } = {
  'คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)': [
    { id: 701, code: '9-1', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 1 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true },
    { id: 702, code: '9-2', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 2 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true },
    { id: 703, code: '9-3', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 3 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true },
    { id: 704, code: '9-4', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 4 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true },
    { id: 705, code: '9-5', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 5 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true }
  ],
  'คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)': [
    { id: 801, code: '10-1', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 1 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true },
    { id: 802, code: '10-2', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 2 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true },
    { id: 803, code: '10-3', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 3 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true },
    { id: 804, code: '10-4', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 4 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true },
    { id: 805, code: '10-5', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 5 ( 150 ข้อ เวลาสอบ 3 ชม.)', duration: 'โจทย์รวม 150 ข้อฟูลสเกล', isExamOnly: true }
  ]
};

function ClassroomPretestContent() {
      // 📍 กลุ่มสถานะตัวแปรสลับคอร์สเรียนมาตรฐานสถาบัน (ติดตั้งเพิ่มข้ามสายเรียน)
  const [myCourses, setMyCourses] = useState<string[]>([]);

  // 📍 เปิดระบบทะเบียน 10 คอร์สหลักอัตโนมัติประจำห้องจำลองสอบสนามจริง
  useEffect(() => {
    const masterCourses = [
      'คอร์สติวกฎหมายราชการที่จำเป็น', 'คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)', 'คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.',
      'คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)', 'คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)',
      'คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)', 'คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)',
      'คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)', 'คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)',
      'คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)'
    ];
    setMyCourses(masterCourses);
  }, []);

  // กลไกอัจฉริยะวิเคราะห์ชื่อคอร์สเพื่อดีดส่งผู้เรียนเปลี่ยนห้องเรียน (Redirect) ข้ามสายทันที
  const handleCourseChange = (nextCourse: string) => {
    const params = `?phone=${encodeURIComponent(studentPhone)}&name=${encodeURIComponent(studentName)}&course=${encodeURIComponent(nextCourse)}`;
    
    if (nextCourse.includes('Pre-test')) {
      router.push(`/classroom/pretest${params}`); // ⏱️ ดีดข้ามเข้าห้องกลุ่มจำลองสอบจับเวลา 180 นาที
    } else if (nextCourse.includes('ลุยข้อสอบ')) {
      router.push(`/classroom/quiz${params}`);    // 📝 ดีดข้ามเข้าห้องกลุ่มตะลุยคลังโจทย์แยกวิชา
    } else {
      router.push(`/classroom/vdo${params}`);     // 📺 ดีดข้ามเข้าห้องกลุ่มบรรยายเนื้อหาวิดีโอ
    }
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const studentPhone = searchParams.get('phone') || '';
  const studentName = searchParams.get('name') || '';
  const currentCourse = searchParams.get('course') || '';

  const [examSetsList, setExamSetsList] = useState<any[]>([]);
  const [activeSet, setActiveSet] = useState<any>(null);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [liveExamScore, setLiveExamScore] = useState('ยังไม่ได้เริ่มทำข้อสอบพรีเทส 🎯');

  // ⏱️ ระบบนาฬิกาจับเวลาถอยหลัง 180 นาที (3 ชั่วโมงเต็ม)
  const [timeLeft, setTimeLeft] = useState(180 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // ⏱️ กลไกควบคุมวงจรเวลานาฬิกาถอยหลังรายวินาที
  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeft > 0 && !quizSubmitted) {
      timer = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      alert('⏰ หมดเวลาทำข้อสอบสนามจำลองแล้วครับ! ระบบจะทำการส่งคำตอบตรวจคะแนนอัตโนมัติทันที');
      setIsTimerRunning(false);
      submitQuiz();
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, quizSubmitted]);

  // ฟังก์ชันแปลงเลขวินาทีให้ออกมาเป็นโครงสร้างหน้าจอ HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ดักจับค่าสิทธิ์ที่ส่งมาจากหน้า Login เพื่อกางชุดข้อสอบให้ตรงสายเรียน
  useEffect(() => {
    if (!studentPhone) { router.push('/classroom'); return; }
    const cleanText = (str: string) => str.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|[\u2011-\u26FF]/g, '').trim();
    const cleanCourse = cleanText(currentCourse);
    
    const matchedKey = Object.keys(pretestCoursesContent).find(key => cleanCourse.includes(key) || key.includes(cleanCourse));
    const examSets = matchedKey ? pretestCoursesContent[matchedKey] : [];
    setExamSetsList(examSets);
    
    // 🎯 สั่งกางชุดสอบข้อแรก (Pre-test ชุดที่ 1) และสตาร์ตดึงคำถามทันที
    if (examSets.length > 0) {
      setActiveSet(examSets[0]);
      startPretest(examSets[0].code, examSets[0].title);
    }
  }, [currentCourse, studentPhone]);
  // 📝 ฟังก์ชันโหลดคำถามชุดใหญ่จากตารางหลังบ้าน Supabase
  const startPretest = async (setCode: string, setTitle: string) => {
    setQuizSubmitted(false); setSelectedAnswers({}); setCurrentQuestionIndex(0); setActiveQuestions([]);
    setTimeLeft(180 * 60); setIsTimerRunning(true); // รีเซ็ตเวลาและสั่งนาฬิกาเริ่มรันทันที
    setLiveExamScore('กำลังทดสอบ ⏳');
    try {
      const { data, error } = await supabase.from('questions').select('*').eq('subject_code', setCode);
      if (error) throw error;
      if (data && data.length > 0) { 
        setActiveQuestions(data); 
      } else {
        setActiveQuestions([{ id: 9999, question_text: `📌 ข้อสอบฟูลสเกล 150 ข้อของชุด ${setTitle} กำลังอัปโหลดเข้าระบบเร็วๆ นี้ครับ...`, choice_a: 'เตรียมความพร้อม', choice_b: 'รับทราบ', choice_c: 'อ่านทบทวนเนื้อหา', choice_d: 'ลุยสอบสนามจริง', correct_choice: 'choice_a' }]);
      }
    } catch (err) { console.error(err); }
  };

  // 🏆 ฟังก์ชันคำนวณและบันทึกคะแนนสอบลงคลัง quiz_attempts
  const submitQuiz = async () => {
    if (quizSubmitted) return;
    setIsTimerRunning(false);
    let score = 0;
    activeQuestions.forEach(q => {
      const correctLetter = q.correct_choice ? q.correct_choice.replace('choice_', '').toUpperCase() : 'A';
      if (selectedAnswers[q.id] === correctLetter) score++;
    });
    
    const percent = (score / (activeQuestions.length || 1)) * 100;
    let status = score >= 90 ? 'Pass (ผ่านเกณฑ์ปลอดภัย) 🎉' : 'Fail (ยังไม่ผ่านเกณฑ์) ❌';
    setLiveExamScore(`สรุปผลสอบ: ${status} \n ได้คะแนน ${score}/${activeQuestions.length} ข้อ (${percent.toFixed(0)}%)`);
    setQuizSubmitted(true);
    
    try {
      await supabase.from('quiz_attempts').insert([{ student_phone: studentPhone, subject_name: activeSet?.title || currentCourse, score_obtained: score, total_questions: activeQuestions.length }]);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.clear(); router.push('/classroom'); };
  
    return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 1. แถบเมนูสนามสอบโทนเข้มติดตั้งแผง Dropdown เลือกเปลี่ยนวิชาเรียนได้ครบทุกหน้าจอ */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '1.25rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>⏱️ ห้องจำลองสอบ Pre-test สนามจริง | บ้านเด็กติวเตอร์</h2>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' }}>👤 คุณ {studentName}</span>
          <select 
            value={currentCourse} 
            onChange={(e) => handleCourseChange(e.target.value)} 
            style={{ padding: '0.4rem 1rem', borderRadius: '100px', border: 'none', backgroundColor: '#ffffff', color: '#1e293b', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
          >
            {myCourses.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isTimerRunning && !quizSubmitted && (
            <span style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', padding: '0.4rem 1.2rem', borderRadius: '100px', fontWeight: '800', fontSize: '1rem' }}>⏱️ เวลาคงเหลือ: {formatTime(timeLeft)}</span>
          )}
          <button onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1.25rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>🚪 ออกจากห้องเรียน</button>
        </div>
      </div>

      {/* 📊 2. แผงแดชบอร์ดสรุปสถิติ 3 กล่องขอบมนประจำห้องจำลองสอบ Pre-test */}
      <div style={{ maxWidth: '1280px', margin: '2rem auto 0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📊 ความคืบหน้าการเรียนคอร์สนี้</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2563eb' }}>100%</span>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #16a34a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📝 ชุดข้อสอบจำลองจริง</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#16a34a' }}>{examSetsList?.length || 0} ชุด</span>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #ea580c', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>🎯 คะแนนและผลการประเมินสอบ</span>
          <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ea580c', display: 'block', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{liveExamScore}</span>
        </div>
      </div>

      {/* 🗂️ 3. เปิดแท็กโครงสร้างเลย์เอาต์หลักแยกฝั่งซ้ายขวา */}
      <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        {/* ฝั่งซ้าย: กระดานคำถามสเกลใหญ่ และตัวเลือก ก ข ค ง */}
        <div style={{ flex: '2 1 680px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            {activeQuestions.length > 0 && (
              <div>
                <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', fontWeight: '800', color: '#0f172a', fontSize: '1.1rem' }}>📝 กำลังทำข้อสอบ: {activeSet?.title}</h3>
                <div style={{ margin: '10px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>คำถามข้อที่ {currentQuestionIndex + 1} / {activeQuestions.length}</div>
                <p style={{ fontWeight: '700', margin: '1.5rem 0', fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.6' }}>{activeQuestions[currentQuestionIndex]?.question_text}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const q = activeQuestions[currentQuestionIndex]; const isSel = selectedAnswers[q.id] === opt;
                    const correctLetter = q.correct_choice ? q.correct_choice.replace('choice_', '').toUpperCase() : 'A';
                    let opBg = isSel ? '#fef2f2' : '#ffffff'; let opBorder = isSel ? '2px solid #ef4444' : '1px solid #cbd5e1';
                    if (quizSubmitted) {
                      if (correctLetter === opt) { opBg = '#dcfce7'; opBorder = '2px solid #16a34a'; }
                      else if (isSel) { opBg = '#fef2f2'; opBorder = '2px solid #ef4444'; }
                    }
                    return (
                      <div key={opt} onClick={() => !quizSubmitted && setSelectedAnswers({...selectedAnswers, [q.id]: opt})} style={{ padding: '1rem', borderRadius: '12px', border: opBorder, backgroundColor: opBg, cursor: quizSubmitted ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isSel ? '#ef4444' : '#f1f5f9', color: isSel ? 'white' : '#475569', fontSize: '0.85rem', fontWeight: '800' }}>{opt === 'A' ? 'ก' : opt === 'B' ? 'ข' : opt === 'C' ? 'ค' : 'ง'}</span>
                        <span style={{ color: '#334155' }}>{q[`choice_${opt.toLowerCase()}`] || q[`option_${opt.toLowerCase()}`]}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: '700' }}>⬅️ ข้อก่อนหน้า</button>
                  {currentQuestionIndex < activeQuestions.length - 1 ? (
                    <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', fontWeight: '700' }}>ข้อถัดไป ➡️</button>
                  ) : (
                    !quizSubmitted && <button onClick={submitQuiz} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', backgroundColor: '#dc2626', color: '#fff', fontWeight: '700', boxShadow: '0 4px 14px rgba(220,38,38,0.3)' }}>📤 ส่งกระดาษคำตอบสนามจริง</button>
                  )}
                </div>
                {quizSubmitted && <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '700', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{liveExamScore}</div>}
              </div>
            )}
          </div>
        </div>

        {/* ฝั่งขวา: สารบัญชุดข้อสอบพรีเทส และ แผงเกณฑ์คะแนนจำลอง 150 ข้อเต็มพิกัดดั้งเดิมครบถ้วน */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#0f172a' }}>🗂️ ชุดข้อสอบ Pre-test ({examSetsList.length} ชุด)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {examSetsList.map((examSet, i) => {
                const isCurrent = activeSet?.id === examSet.id;
                return (
                  <div key={i} onClick={() => { setActiveSet(examSet); startPretest(examSet.code, examSet.title); }} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: isCurrent ? '#f1f5f9' : '#f8fafc', border: isCurrent ? '2px solid #0f172a' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', fontWeight: '800', color: isCurrent ? '#0f172a' : '#1e293b' }}>{examSet.title}</h5>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>ℹ️ {examSet.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📈 บล็อกเกณฑ์คะแนนประเมินผลสนามจำลองสอบ Pre-test (150 ข้อฟูลสเกล) รักษารายละเอียดครบถ้วนทุกประการ */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.5rem', background: 'linear-gradient(to bottom, #ffffff, #fdfcf7)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            <div style={{ borderBottom: '2px solid #f6e0b3', paddingBottom: '0.6rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '1.3rem' }}>📈</span><h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#b45309', margin: 0 }}>เกณฑ์การประเมินผลสนามจริง (Grading)</h3></div>
            <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
              <p style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>• คะแนนเต็มฟูลสเกล: 150 คะแนน</p>
              <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#1e293b' }}>• เกณฑ์ผ่านปลอดภัย: 90 คะแนนขึ้นไป (60%)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0fdf4', padding: '6px 8px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#166534' }}>🥇 135 - 150 คะแนน (90%+)</span><span style={{ color: '#166534', fontWeight: '800' }}>Excellent</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#eff6ff', padding: '6px 8px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#1e40af' }}>🏅 120 - 134 คะแนน (80%-89%)</span><span style={{ color: '#1e40af', fontWeight: '800' }}>Very Good</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0fdf4', padding: '6px 8px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#15803d' }}>🎉 90 - 119 คะแนน (60%-79%)</span><span style={{ color: '#15803d', fontWeight: '800' }}>Pass</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fffbeb', padding: '8px 12px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#b45309' }}>⚠️ 75 - 89 คะแนน (50%-59%)</span><span style={{ color: '#b45309', fontWeight: '800' }}>Fail (คาบเส้น)</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fef2f2', padding: '6px 8px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#991b1b' }}>❌ 0 - 74 คะแนน (ต่ำกว่า 50%)</span><span style={{ color: '#991b1b', fontWeight: '800' }}>ปรับปรุงด่วน</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ClassroomPretestPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', fontWeight: '700' }}>⏳ กำลังสร้างระบบจำลองสอบถอยหลัง 3 ชั่วโมง...</div>}>
      <ClassroomPretestContent />
    </Suspense>
  );
}
