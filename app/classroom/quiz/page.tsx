'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

// 📝 คลังข้อมูลสารบัญแมปปิ้งบทเรียนเฉพาะกลุ่มที่ 2 (ล้างเคาะเว้นวรรคออกให้ตรงตั๋วสิทธิ์เบราว์เซอร์ 100%)
const quizCoursesContent: { [key: string]: any[] } = {
  'คอร์สลุยข้อสอบนายสิบตำรวจนสต.(ตะลุยโจทย์แยกรายวิชา)': [
    { id: 101, code: '8-1', title: 'คลังโจทย์วิชาความสามารถทั่วไป', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true },
    { id: 102, code: '8-2', title: 'คลังโจทย์วิชาภาษาไทย', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true },
    { id: 103, code: '8-3', title: 'คลังโจทย์วิชาภาษาต่างประเทศ ภาษาอังกฤษ', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true },
    { id: 104, code: '8-4', title: 'คลังโจทย์วิชากฎหมายเบื้องต้นที่ประชาชนควรรู้', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true },
    { id: 105, code: '8-5', title: 'คลังโจทย์วิชาความสามารถด้านเทคโนโลยีและสารสนเทศ', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true },
    { id: 106, code: '8-6', title: 'คลังโจทย์วิชาสังคม วัฒนธรรม จริยธรรม และประชาคมอาเซียน', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true }
  ],
    'คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)': [
    { id: 401, code: '4-1', title: 'คลังโจทย์วิชาความสามารถทั่วไป' },
    { id: 402, code: '4-2', title: 'คลังโจทย์วิชาภาษาไทย' },
    { id: 403, code: '4-3', title: 'คลังโจทย์วิชาภาษาต่างประเทศ (ภาษาอังกฤษ)' },
    { id: 404, code: '4-4', title: 'คลังโจทย์วิชาคอมพิวเตอร์และสารสนเทศงานสำนักงาน' },
    { id: 405, code: '4-5', title: 'คลังโจทย์วิชากฎหมายเบื้องต้นที่ประชาชนควรรู้' },
    { id: 406, code: '4-6', title: 'คลังโจทย์วิชาสังคม วัฒนธรรม จริยธรรม และประชาคมอาเซียน' }
  ],

  'คอร์สลุยข้อสอบก.พ.ภาคก.(บททดสอบแยกตามหัวข้อ)': [
    { id: 451, code: '5-1', title: 'คลังโจทย์วิชาความสามารถทั่วไป', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true },
    { id: 452, code: '5-2', title: 'คลังโจทย์วิชาภาษาไทย', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true },
    { id: 453, code: '5-3', title: 'คลังโจทย์วิชาภาษาอังกฤษ', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true },
    { id: 454, code: '5-4', title: 'คลังโจทย์วิชาลักษณะการเป็นข้าราชการที่ดี', duration: 'ชุดเจาะลึก 50 ข้อ', isExamOnly: true }
  ]
};

function ClassroomQuizContent() {
      const [myCourses, setMyCourses] = useState<string[]>([]);

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

  const handleCourseChange = (nextCourse: string) => {
    const params = `?phone=${encodeURIComponent(studentPhone)}&name=${encodeURIComponent(studentName)}&course=${encodeURIComponent(nextCourse)}`;
    if (nextCourse.includes('Pre-test')) { router.push(`/classroom/pretest${params}`); }
    else if (nextCourse.includes('ลุยข้อสอบ')) { router.push(`/classroom/quiz${params}`); }
    else { router.push(`/classroom/vdo${params}`); }
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const studentPhone = searchParams.get('phone') || '';
  const studentName = searchParams.get('name') || '';
  const currentCourse = searchParams.get('course') || '';

  const [lessonsList, setLessonsList] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<any>(null);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [liveExamScore, setLiveExamScore] = useState('ยังไม่ได้เข้าทดสอบ 🎯');

    // 🔐 กลไกสแกนทะเบียนสิทธิ์และคัดกรองหมวดวิชาทำข้อสอบอัจฉริยะ (ฉบับยืดหยุ่นสูง ปลดล็อก 0 วิชา)
  useEffect(() => {
    if (!studentPhone) { router.push('/classroom'); return; }
    
    // กางรายชื่อ 10 คอร์สหลักประจำบอร์ด Dropdown
    const masterCourses = [
      'คอร์สติวกฎหมายราชการที่จำเป็น', 'คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)', 'คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.',
      'คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)', 'คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)',
      'คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)', 'คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)',
      'คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)', 'คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)',
      'คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)'
    ];
    setMyCourses(masterCourses);

    // 📍 🔐 กลไกแมปปิ้งอัจฉริยะ: ล้าง Emoji และเว้นวรรคของทั้งสองฝั่งออกให้หมดก่อนนำมาเทียบค่ากัน เพื่อแก้ปัญหาสะกดไม่ตรงล็อก
    const strictClean = (str: string) => str.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]|\s|[\(\)]/g, '').trim();
    const target = strictClean(currentCourse);
    
    const matchedKey = Object.keys(quizCoursesContent).find(key => {
      const cleanKey = strictClean(key);
      return target.includes(cleanKey) || cleanKey.includes(target);
    });

    const subjects = matchedKey ? quizCoursesContent[matchedKey] : [];
    setLessonsList(subjects);

    // 🎯 บังคับให้วิชาแรกของคอร์สโหลดขึ้นกระดานทำข้อสอบกึ่งกลางจอทันที
    if (subjects.length > 0) {
      setActiveSubject(subjects[0]);
      startQuiz(subjects[0].code, subjects[0].title);
    } else {
      setActiveSubject(null);
      setActiveQuestions([]);
    }
  }, [currentCourse, studentPhone]);


  const startQuiz = async (subjectCode: string, subjectTitle: string) => {
    setQuizSubmitted(false); setSelectedAnswers({}); setCurrentQuestionIndex(0); setActiveQuestions([]);
    setLiveExamScore('ยังไม่ได้เข้าทดสอบ 🎯');
    try {
      const { data, error } = await supabase.from('questions').select('*').eq('subject_code', subjectCode);
      if (error) throw error;
      if (data && data.length > 0) { 
        setActiveQuestions(data); 
      } else {
        setActiveQuestions([{ id: 9999, question_text: `📌 คลังข้อสอบวิชา ${subjectTitle} ชุดพรีเมียมกำลังอัปโหลดขึ้นระบบเร็วๆ นี้ครับ...`, choice_a: 'รับทราบ ยอดเยี่ยมมากครับ', choice_b: 'เตรียมลุยโจทย์ใหม่', choice_c: 'ติดตามเนื้อหาเข้ม', choice_d: 'ผ่านชัวร์', correct_choice: 'choice_a' }]);
      }
    } catch (err) { console.error(err); }
  };

  const submitQuiz = async () => {
    if (quizSubmitted) return;
    let score = 0;
    activeQuestions.forEach(q => {
      const correctLetter = q.correct_choice ? q.correct_choice.replace('choice_', '').toUpperCase() : 'A';
      if (selectedAnswers[q.id] === correctLetter) score++;
    });
    setLiveExamScore(`สรุปคะแนน: ทำคลังโจทย์เสร็จสิ้น คว้าไป ${score}/${activeQuestions.length} ข้อ 🎉`);
    setQuizSubmitted(true);
    try {
      await supabase.from('quiz_attempts').insert([{ student_phone: studentPhone, subject_name: activeSubject?.title || currentCourse, score_obtained: score, total_questions: activeQuestions.length }]);
    } catch (err) { console.error(err); }
  };
  const handleLogout = () => { localStorage.clear(); router.push('/classroom'); };

   return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 1. แถบเมนูบาร์ด้านบนสุดพร้อมกล่อง Dropdown เลือกสลับคอร์สติว */}
      <div style={{ background: 'linear-gradient(135deg, #0052cc, #00a4ff)', padding: '1.25rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>📝 ห้องตะลุยคลังโจทย์แยกวิชา | บ้านเด็กติวเตอร์</h2>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' }}>👤 คุณ {studentName}</span>
          <select value={currentCourse} onChange={(e) => handleCourseChange(e.target.value)} style={{ padding: '0.4rem 1rem', borderRadius: '100px', border: 'none', backgroundColor: '#ffffff', color: '#0052cc', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}>
            {myCourses.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1.25rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>🚪 ออกจากห้องเรียน</button>
      </div>

      {/* 📊 2. แผงแดชบอร์ดสรุปสถิติ 3 กล่องขอบมนประจำห้องคลังโจทย์ (แทรกเข้าล็อกสมบูรณ์) */}
      <div style={{ maxWidth: '1280px', margin: '2rem auto 0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📊 ความคืบหน้าการเรียนคอร์สนี้</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2563eb' }}>100%</span>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #16a34a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📝 หมวดวิชาทำข้อสอบ</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#16a34a' }}>{lessonsList?.length || 0} วิชา</span>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #ea580c', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>🎯 คะแนนและผลการประเมินสอบ</span>
          <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ea580c', display: 'block', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{liveExamScore}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        {/* ฝั่งซ้าย: กระดานคำถามและชอยส์ ก ข ค ง อัจฉริยะ */}
        <div style={{ flex: '2 1 680px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            {activeQuestions.length > 0 && (
              <div>
                <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', fontWeight: '800', color: '#0f172a' }}>📝 คลังโจทย์ทดสอบวิชา: {activeSubject?.title}</h3>
                <div style={{ margin: '10px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>คำถามข้อที่ {currentQuestionIndex + 1} / {activeQuestions.length}</div>
                <p style={{ fontWeight: '700', margin: '1.5rem 0', fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.6' }}>{activeQuestions[currentQuestionIndex]?.question_text}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const q = activeQuestions[currentQuestionIndex]; const isSel = selectedAnswers[q.id] === opt;
                    const correctLetter = q.correct_choice ? q.correct_choice.replace('choice_', '').toUpperCase() : 'A';
                    let opBg = isSel ? '#eff6ff' : '#ffffff'; let opBorder = isSel ? '2px solid #2563eb' : '1px solid #cbd5e1';
                    if (quizSubmitted) {
                      if (correctLetter === opt) { opBg = '#dcfce7'; opBorder = '2px solid #16a34a'; }
                      else if (isSel) { opBg = '#fef2f2'; opBorder = '2px solid #ef4444'; }
                    }
                    return (
                      <div key={opt} onClick={() => !quizSubmitted && setSelectedAnswers({...selectedAnswers, [q.id]: opt})} style={{ padding: '1rem', borderRadius: '12px', border: opBorder, backgroundColor: opBg, cursor: quizSubmitted ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isSel ? '#2563eb' : '#f1f5f9', color: isSel ? 'white' : '#475569', fontSize: '0.85rem', fontWeight: '800' }}>{opt === 'A' ? 'ก' : opt === 'B' ? 'ข' : opt === 'C' ? 'ค' : 'ง'}</span>
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
                    !quizSubmitted && <button onClick={submitQuiz} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', fontWeight: '700' }}>📤 ส่งใบสอบตรวจคะแนน</button>
                  )}
                </div>
                {quizSubmitted && <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fffbeb', borderRadius: '12px', color: '#b45309', fontWeight: '700', border: '1px solid #f6e0b3' }}>{liveExamScore}</div>}
              </div>
            )}
          </div>
        </div>

        {/* ฝั่งขวา: รายชื่อวิชาทำข้อสอบ และ เกณฑ์คะแนนตัดเกรดสีทองนวลตัวเต็ม */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#0f172a' }}>🗂️ หมวดวิชาทำข้อสอบ ({lessonsList.length} วิชา)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lessonsList.map((subject, i) => {
                const isCurrent = activeSubject?.id === subject.id;
                return (
                  <div key={i} onClick={() => { setActiveSubject(subject); startQuiz(subject.code, subject.title); }} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: isCurrent ? '#f0f4f8' : '#f8fafc', border: isCurrent ? '2px solid #0052cc' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: '800', color: isCurrent ? '#0052cc' : '#1e293b' }}>{subject.title}</h5>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '750' }}>ℹ️ เจาะลึกแนวข้อสอบ 100 ข้อ</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📈 บล็อกเกณฑ์คะแนนวัดระดับแบบเปอร์เซ็นต์ตัวเต็ม 5 ระดับรักษารายละเอียดดั้งเดิมครบถ้วน */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.5rem', background: 'linear-gradient(to bottom, #ffffff, #fdfcf7)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            <div style={{ borderBottom: '2px solid #f6e0b3', paddingBottom: '0.6rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '1.3rem' }}>📈</span><h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#b45309', margin: 0 }}>เกณฑ์การวัดระดับคะแนน (Grading)</h3></div>
            <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
              <p style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>• คิดตามสัดส่วนร้อยละของชุดข้อสอบจริง</p>
              <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#1e293b' }}>• เกณฑ์ผ่านสัมรึทธิผล: ร้อยละ 60 ขึ้นไป</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0fdf4', padding: '6px 8px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#166534' }}>🥇 ได้คะแนนระดับร้อยละ 90 ขึ้นไป</span><span style={{ color: '#166534', fontWeight: '800' }}>Excellent</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#eff6ff', padding: '6px 8px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#1e40af' }}>🏅 ได้คะแนนระดับร้อยละ 80 - 89</span><span style={{ color: '#1e40af', fontWeight: '800' }}>Very Good</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0fdf4', padding: '6px 8px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#15803d' }}>🎉 ได้คะแนนระดับร้อยละ 60 - 79</span><span style={{ color: '#15803d', fontWeight: '800' }}>Pass</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fffbeb', padding: '8px 12px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#b45309' }}>⚠️ ได้คะแนนระดับร้อยละ 50 - 59</span><span style={{ color: '#b45309', fontWeight: '800' }}>คาบเส้น</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fef2f2', padding: '6px 8px', borderRadius: '6px' }}><span style={{ fontWeight: '700', color: '#991b1b' }}>❌ ได้คะแนนต่ำกว่าร้อยละ 50</span><span style={{ color: '#991b1b', fontWeight: '800' }}>ปรับปรุงด่วน</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ClassroomQuizPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', fontWeight: '700' }}>⏳ กำลังโหลดระบบคลังโจทย์ทดสอบ...</div>}>
      <ClassroomQuizContent />
    </Suspense>
  );
}
