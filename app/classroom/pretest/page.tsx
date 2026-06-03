'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

// 🏛️ แผงคลังข้อมูลพิมพ์เขียวสากล ล็อก Key และจัดสรรชื่อคอร์สตรงร่องสากลแท้ 100%
const pretestCoursesContent: { [key: string]: { name: string; questions: any[] } } = {
  '9': {
    name: 'คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)',
    questions: [
      { id: 701, code: '9-1', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 1', duration: '3 ชม.' },
      { id: 702, code: '9-2', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 2', duration: '3 ชม.' },
      { id: 703, code: '9-3', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 3', duration: '3 ชม.' },
      { id: 704, code: '9-4', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 4', duration: '3 ชม.' },
      { id: 705, code: '9-5', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 5', duration: '3 ชม.' }
    ]
  },
  '10': {
    name: 'คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)',
    questions: [
      { id: 801, code: '10-1', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 1', duration: '3 ชม.' },
      { id: 802, code: '10-2', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 2', duration: '3 ชม.' },
      { id: 803, code: '10-3', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 3', duration: '3 ชม.' },
      { id: 804, code: '10-4', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 4', duration: '3 ชม.' },
      { id: 805, code: '10-5', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 5', duration: '3 ชม.' }
    ]
  },
  '12': {
    name: 'คอร์ส Pre-test ข้อสอบเสมือนจริง สาย อก./สพฐ.ตร. ตามหลักสูตรใหม่ล่าสุด',
    questions: [
      { id: 1201, code: '12-1', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 1', duration: '3 ชม.' },
      { id: 1202, code: '12-2', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 2', duration: '3 ชม.' },
      { id: 1203, code: '12-3', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 3', duration: '3 ชม.' },
      { id: 1204, code: '12-4', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 4', duration: '3 ชม.' },
      { id: 1205, code: '12-5', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 5', duration: '3 ชม.' },
      { id: 1206, code: '12-6', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 6', duration: '3 ชม.' },
      { id: 1207, code: '12-7', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 7', duration: '3 ชม.' },
      { id: 1208, code: '12-8', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 8', duration: '3 ชม.' },
      { id: 1209, code: '12-9', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 9', duration: '3 ชม.' },
      { id: 1210, code: '12-10', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 10', duration: '3 ชม.' },
      { id: 1211, code: '12-11', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 11', duration: '3 ชม.' },
      { id: 1212, code: '12-12', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 12', duration: '3 ชม.' },
      { id: 1213, code: '12-13', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 13', duration: '3 ชม.' },
      { id: 1214, code: '12-14', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 14', duration: '3 ชม.' },
      { id: 1215, code: '12-15', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 15', duration: '3 ชม.' }
    ]
  }
};

function ClassroomPretestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const studentPhone = searchParams.get('phone') || '';
  const studentName = searchParams.get('name') || '';
  const courseParam = searchParams.get('course') || ''; 

  const [courseNameDisplay, setCourseNameDisplay] = useState(courseParam); 
  const currentCourse = courseParam; 

  const [allowedQuestions, setAllowedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [examSetsList, setExamSetsList] = useState<any[]>([]);
  const [activeSet, setActiveSet] = useState<any>(null);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [liveExamScore, setLiveExamScore] = useState('ยังไม่ได้เริ่มทำข้อสอบพรีเทส 🎯');

  const [timeLeft, setTimeLeft] = useState(180 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // 🛡️ 5. เกราะดักจับสิทธิ์เรียนพรีเทสอัจฉริยะ (เวอร์ชันแก้ปัญหาตัวสะกดและสระวรรคเหลื่อมล้ำ 100%)
  useEffect(() => {
    if (!studentPhone) { 
      router.push('/classroom'); 
      return; 
    }

    const checkAndLoadQuestions = async () => {
      try {
        const myCoursesData = localStorage.getItem('user_my_courses');
        if (!myCoursesData) {
          alert('🚫 ไม่พบข้อมูลสิทธิ์เข้าเรียนในระบบ กรุณาล็อกอินใหม่อีกครั้งครับ');
          router.push('/classroom');
          return;
        }
        const myEnrolledCourses: string[] = JSON.parse(myCoursesData);

        const superClean = (str: string) => {
          if (!str) return '';
          return str
            .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|[\u2011-\u26FF]|\s+/g, '')
            .replace(/นัสต/g, 'นสต')
            .trim();
        };

        const cleanCourseParam = superClean(courseParam);

        const matchedKey = Object.keys(pretestCoursesContent).find(key => {
          const cleanMasterName = superClean(pretestCoursesContent[key].name);
          return cleanCourseParam.includes(cleanMasterName) || 
                 cleanMasterName.includes(cleanCourseParam) || 
                 cleanCourseParam.includes(key);
        });

        const hasAccessPermission = myEnrolledCourses.some(enrolled => {
          const cleanEnrolled = superClean(enrolled);
          return cleanEnrolled.includes(cleanCourseParam) || 
                 cleanCourseParam.includes(cleanEnrolled) ||
                 (cleanCourseParam.includes('Pre-test') && cleanEnrolled.includes('Pre-test'));
        });

        if (!matchedKey || !hasAccessPermission) {
          alert('🔒 ขออภัย สิทธิ์เข้าใช้งานถูกจำกัดเฉพาะนักเรียนคอร์สนี้เท่านั้นครับ');
          router.push('/classroom');
          return;
        }

        const courseData = pretestCoursesContent[matchedKey];
        setCourseNameDisplay(courseData.name);
        setExamSetsList(courseData.questions);
        
                // 🎯 สั่งกางชุดข้อสอบพรีเทสชุดแรก (Index 0) และสตาร์ตดึงคำถามทันที (ซ่อมแซมล็อกพิกัด [0] เรียบร้อย)
        if (courseData.questions && courseData.questions.length > 0) {
          setActiveSet(courseData.questions[0]); // ระบุล็อกพิกัดชุดที่ 1 ของอาเรย์ตรงร่อง
          startPretest(courseData.questions[0].code, courseData.questions[0].title); // ดึงค่า code และ title จาก Index 0 ได้ถูกต้องแม่นยำ
        }

      } catch (err) {
        console.error('Pretest Access Guard Error:', err);
        router.push('/classroom');
      } finally {
        setLoading(false);
      }
    };

    checkAndLoadQuestions();
  }, [courseParam, studentPhone, router]);

  // 📝 6. ฟังก์ชันโหลดคำถามชุดใหญ่เรียงแถวตรงตามเลข ID จากตารางหลังบ้าน Supabase
  const startPretest = async (setCode: string, setTitle: string) => {
    setQuizSubmitted(false); 
    setSelectedAnswers({}); 
    setCurrentQuestionIndex(0); 
    setActiveQuestions([]);
    setTimeLeft(180 * 60); 
    setIsTimerRunning(true);
    setLiveExamScore('กำลังทดสอบ ⏳');
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject_code', setCode)
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) { 
        setActiveQuestions(data); 
      } else {
        setActiveQuestions([{ 
          id: 9999, 
          question_text: `📌 ข้อสอบฟูลสเกล 150 ข้อของชุด ${setTitle} กำลังอัปโหลดเข้าระบบเร็วๆ นี้ครับ...`, 
          choice_a: 'เตรียมความพร้อม', 
          choice_b: 'รับทราบ', 
          choice_c: 'อ่านทบทวนเนื้อหา', 
          choice_d: 'ลุยสอบสนามจริง', 
          correct_choice: 'choice_a' 
        }]);
      }
    } catch (err) { 
      console.error('Fetch pretest questions error:', err); 
    }
  };

  // ⏱️ 7. กลไกควบคุมวงจรเวลานาฬิกาถอยหลังรายวินาที
  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeft > 0 && !quizSubmitted) {
      timer = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      alert('⏰ หมดเวลาทำข้อสอบสนามจำลองแล้วครับ! ระบบจะทำการส่งคำตอบตรวจคะแนนอัตโนมัติทันที 📝');
      setIsTimerRunning(false);
      submitQuiz(); 
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, quizSubmitted]);

  // ⏱️ 8. ฟังก์ชันแปลงเลขวินาทีให้ออกมาเป็นโครงสร้างหน้าจอ HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  // 🏆 9. ฟังก์ชันคำนวณแยก 2 ภาคหลักสูตร และบันทึกคะแนนสอบลงคลังเกณฑ์ตำรวจ 60% ของแท้
  const submitQuiz = async () => {
    if (quizSubmitted) return;
    setIsTimerRunning(false);
    
    let totalCorrect = 0;
    let part1Correct = 0; 
    let part2Correct = 0; 
    
    const part1Total = 40;
    const part2Total = 110;
    const grandTotal = activeQuestions.length || 150;

    activeQuestions.forEach((q, index) => {
      const questionNumber = index + 1;
      const correctLetter = q.correct_choice ? q.correct_choice.replace('choice_', '').toUpperCase() : 'A';
      const isCorrect = selectedAnswers[q.id] === correctLetter;

      if (isCorrect) {
        totalCorrect++;
        if (questionNumber >= 1 && questionNumber <= 40) {
          part1Correct++;
        } else if (questionNumber >= 41 && questionNumber <= 150) {
          part2Correct++;
        }
      }
    });

    const part1Percent = (part1Correct / part1Total) * 100;
    const part2Percent = (part2Correct / part2Total) * 100;
    const totalPercent = (totalCorrect / grandTotal) * 100;

    const isPart1Passed = part1Percent >= 60;
    const isPart2Passed = part2Percent >= 60;
    const isAllPassed = isPart1Passed && isPart2Passed; 

    const passedStatusText = isAllPassed ? 'ผ่านเกณฑ์ข้าราชการตำรวจ 🎉' : 'ยังไม่ผ่านเกณฑ์ (ต้องผ่าน 60% ทั้ง 2 ภาควิชา) ❌';

    alert(
      `📊 [สรุปรายงานผลคะแนนสอบเสมือนจริงฟูลสเกล]\n` +
      `------------------------------------------\n` +
      `📝 ผลคะแนนรวมทั้งหมด: ${totalCorrect} / ${grandTotal} ข้อ (${totalPercent.toFixed(0)}%)\n\n` +
      `🔸 1. ภาคความรู้ความสามารถทั่วไป (ข้อ 1-40)\n` +
      `   - คะแนนที่ทำได้: ${part1Correct} / ${part1Total} ข้อ\n` +
      `   - คิดเป็นเปอร์เซ็นต์: ${part1Percent.toFixed(0)}%\n` +
      `   - ประเมินผลภาค 1: ${isPart1Passed ? '✅ ผ่านเกณฑ์ (60% ขึ้นไป)' : '❌ ไม่ผ่านเกณฑ์'}\n\n` +
      `🔹 2. ภาคความรู้ความสามารถที่ใช้เฉพาะตำแหน่ง (ข้อ 41-150)\n` +
      `   - คะแนนที่ทำได้: ${part2Correct} / ${part2Total} ข้อ\n` +
      `   - คิดเป็นเปอร์เซ็นต์: ${part2Percent.toFixed(0)}%\n` +
      `   - ประเมินผลภาค 2: ${isPart2Passed ? '✅ ผ่านเกณฑ์ (60% ขึ้นไป)' : '❌ ไม่ผ่านเกณฑ์'}\n` +
      `------------------------------------------\n` +
      `🏆 สรุปประเมินภาพรวมหลักสูตร: ${passedStatusText}`
    );

    setLiveExamScore(`สรุปผลสอบ: ${passedStatusText} \n ได้คะแนนรวม ${totalCorrect}/${grandTotal} ข้อ (${totalPercent.toFixed(0)}%)`);
    setQuizSubmitted(true);

    try {
      await supabase.from('quiz_attempts').insert([
        {
          student_phone: studentPhone,
          subject_name: `${currentCourse} (Pre-test)`, 
          score_obtained: totalCorrect,
          total_questions: grandTotal,
          passed_status: isAllPassed ? 'ผ่านเกณฑ์' : 'ไม่ผ่านเกณฑ์'
        }
      ]);
    } catch (err) {
      console.error('Save quiz attempts error:', err);
    }
  };

  // 🚪 10. ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.clear();
    router.push('/classroom');
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', fontWeight: '700', fontFamily: '"Inter", "Prompt", sans-serif', color: '#64748b' }}>⏳ ระบบ Guard กำลังตรวจเช็คสิทธิ์และจัดเรียงคิวข้อสอบพรีเทส...</div>;

  return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem' }}>
      
      {/* 1. แถบเมนูบาร์ด้านบนสุดหรูหราแบบฉบับสถาบัน */}
      <div style={{ background: 'linear-gradient(135deg, #0052cc, #00a4ff)', padding: '1.25rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 4px 0' }}>🏛️ ห้องสอบจำลองเสมือนจริง (Pre-test Mode)</h1>
          <div style={{ display: 'flex', gap: '15px', fontSize: '0.88rem', opacity: 0.9, fontWeight: '600' }}>
            <span>👤 ผู้เข้าสอบ: {studentName}</span>
            <span>📞 เบอร์โทรศัพท์: {studentPhone}</span>
          </div>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1.25rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', transition: 'all 0.2s' }}>🚪 ออกจากระบบ</button>
      </div>

      <div style={{ maxWidth: '1024px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b', backgroundColor: '#ffffff', padding: '1rem 1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>{courseNameDisplay}</h2>
        
        {/* ⏱️ ส่วนนาฬิกาจับเวลาถอยหลังดีไซน์เด่นชัดเจน */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', borderRadius: '16px', fontWeight: '700', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
          <span style={{ fontSize: '0.95rem' }}>⏱️ เวลาคงเหลือในการทำข้อสอบสนามจำลอง:</span>
          <span style={{ fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: '800' }}>{formatTime(timeLeft)}</span>
        </div>

        {/* ตารางกางรายชื่อชุดข้อสอบย่อย 15 ชุดขอบมนละมุนตา */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
          {examSetsList.map((quiz: any) => {
            const isCurrentActive = activeSet?.code === quiz.code;
            return (
              <div key={quiz.id} style={{ padding: '1.25rem', backgroundColor: '#ffffff', border: isCurrentActive ? '2px solid #0052cc' : '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', flexWrap: 'wrap', gap: '15px', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: '#f0f4f8', color: '#0052cc', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>รหัสชุด: {quiz.code}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>⏱️ เวลาสอบ: {quiz.duration}</span>
                  </div>
                  <strong style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '700', marginTop: '2px' }}>{quiz.title}</strong>
                </div>
                <button onClick={() => startPretest(quiz.code, quiz.title)} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '750', fontSize: '0.88rem', boxShadow: '0 4px 6px rgba(0,82,204,0.15)' }}>📝 เริ่มทำข้อสอบ</button>
              </div>
            );
          })}
        </div>
        {/* 💡 ส่วนกางกระดานทำข้อสอบ (Render คำถาม 150 ข้อ ดีไซน์หรูหรา Inline CSS) */}
        {activeQuestions.length > 0 && !quizSubmitted && (
          <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.05rem' }}>📋 ข้อสอบข้อที่ {currentQuestionIndex + 1} / {activeQuestions.length}</span>
              <span style={{ fontSize: '0.88rem', color: '#0052cc', fontWeight: '700', backgroundColor: '#ebf5ff', padding: '0.3rem 0.8rem', borderRadius: '100px' }}>{liveExamScore}</span>
            </div>
            
            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '2rem', lineHeight: '1.6' }}>{activeQuestions[currentQuestionIndex].question_text}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              {['A', 'B', 'C', 'D'].map((choice) => {
                const choiceKey = `choice_${choice.toLowerCase()}`;
                const isSel = selectedAnswers[activeQuestions[currentQuestionIndex].id] === choice;
                
                return (
                  <button
                    key={choice}
                    onClick={() => setSelectedAnswers({ ...selectedAnswers, [activeQuestions[currentQuestionIndex].id]: choice })}
                    style={{
                      width: '100%',
                      padding: '1.1rem 1.25rem',
                      borderRadius: '14px',
                      border: isSel ? '2px solid #0052cc' : '1px solid #cbd5e1',
                      backgroundColor: isSel ? '#eff6ff' : '#ffffff',
                      color: isSel ? '#0052cc' : '#334155',
                      fontWeight: isSel ? '700' : '600',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      outline: 'none'
                    }}
                  >
                    <span style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isSel ? '#0052cc' : '#f1f5f9',
                      color: isSel ? '#ffffff' : '#475569',
                      fontSize: '0.88rem',
                      fontWeight: '800'
                    }}>
                      {choice === 'A' ? 'ก' : choice === 'B' ? 'ข' : choice === 'C' ? 'ค' : 'ง'}
                    </span>
                    <span style={{ fontSize: '0.98rem' }}>{activeQuestions[currentQuestionIndex][choiceKey]}</span>
                  </button>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                style={{
                  padding: '0.55rem 1.35rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: '700',
                  cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentQuestionIndex === 0 ? 0.4 : 1,
                  fontSize: '0.88rem',
                  transition: 'all 0.15s'
                }}
              >
                ⬅️ ข้อก่อนหน้า
              </button>
              
              {currentQuestionIndex < activeQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  style={{
                    padding: '0.55rem 1.35rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#0052cc',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    boxShadow: '0 4px 6px rgba(0,82,204,0.15)',
                    transition: 'all 0.15s'
                  }}
                >
                  ข้อถัดไป ➡️
                </button>
              ) : (
                <button
                  onClick={submitQuiz}
                  style={{
                    padding: '0.65rem 1.6rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 8px rgba(16,185,129,0.2)',
                    transition: 'all 0.15s'
                  }}
                >
                  🚀 ส่งกระดาษคำตอบ
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🏛️ ส่วนกรอบครอบสำหรับการทำงาน Client-side ใน Next.js App Router
export default function ClassroomPretestPage() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center', fontWeight: '700', fontFamily: '"Inter", "Prompt", sans-serif', color: '#64748b' }}>⏳ กำลังดำเนินการโหลดระบบคลังระบบความปลอดภัยพรีเทส...</div>}>
      <ClassroomPretestContent />
    </Suspense>
  );
}
