'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

// 🏛️ แผงสารบัญปฏิรูปใหม่ เปลี่ยน Key เป็นรหัสคอร์สคู่ขนาน ทรงอานุภาพความเสถียร 100%
const vdoCoursesContent: { [key: string]: { name: string; questions: any[] } } = {
  '1': {
    name: 'คอร์สติวกฎหมายราชการที่จำเป็น',
    questions: [
      { id: 41, code: '1-1', title: 'กฎหมายราชการ EP 1 : รัฐธรรมนูญแห่งราชอาณาจักรไทย (ฉบับปัจจุบัน)', youtubeid: '7P6F_S87Fls', pdfUrl: '#', duration: '90:00 นาที', hasQuiz: true },
      { id: 42, code: '1-2', title: 'กฎหมายราชการ EP 2 : พ.ร.บ. ระเบียบบริหารราชการแผ่นดิน พ.ศ. 2534', youtubeid: 'g9z9FstC4j0', pdfUrl: '#', duration: '55:00 นาที', hasQuiz: true },
      { id: 43, code: '1-3', title: 'กฎหมายราชการ EP 3 : พ.ร.ฎ. ว่าด้วยหลักเกณฑ์และวิธีการบริหารกิจการบ้านเมืองที่ดี พ.ศ. 2546', youtubeid: 'O9YwE8_O5rI', pdfUrl: '#', duration: '60:00 นาที', hasQuiz: true },
      { id: 44, code: '1-4', title: 'กฎหมายราชการ EP 4 : พ.ร.บ. วิธีปฏิบัติราชการทางปกครอง พ.ศ. 2539', youtubeid: '7P6F_S87Fls', pdfUrl: '#', duration: '45:00 นาที', hasQuiz: true },
      { id: 45, code: '1-5', title: 'กฎหมายราชการ EP 5 : พ.ร.บ. ความรับผิดทางละเมิดของเจ้าหน้าที่ พ.ศ. 2539', youtubeid: 'g9z9FstC4j0', pdfUrl: '#', duration: '50:00 นาที', hasQuiz: true },
      { id: 46, code: '1-6', title: 'กฎหมายราชการ EP 6 : พ.ร.บ. ข้อมูลข่าวสารของทางราชการ พ.ศ. 2540', youtubeid: 'O9YwE8_O5rI', pdfUrl: '#', duration: '55:00 นาที', hasQuiz: true }
    ]
  },
  '2': {
    name: 'คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)',
    questions: [
      { id: 301, code: '2-1', title: 'วิชาความสามารถทั่วไป', youtubeid: 'g9z7FstC4j0', pdfUrl: '#', duration: 'จัดเต็มคลังโจทย์ 100 ข้อ', hasQuiz: true },
      { id: 302, code: '2-2', title: 'วิชาภาษาไทย', youtubeid: '7P6F_S87Fls', pdfUrl: '#', duration: 'จัดเต็มคลังโจทย์ 100 ข้อ', hasQuiz: true },
      { id: 303, code: '2-3', title: 'วิชาภาษาอังกฤษ', youtubeid: 'O9YwE8_O5rI', pdfUrl: '#', duration: 'จัดเต็มคลังโจทย์ 100 ข้อ', hasQuiz: true },
      { id: 304, code: '2-4', title: 'วิชากฎหมายและลักษณะการเป็นข้าราชการที่ดี', youtubeid: 'g9z9FstC4j0', pdfUrl: '#', duration: 'จัดเต็มคลังโจทย์ 100 ข้อ', hasQuiz: true }
    ]
  },
  '3': {
    name: 'คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.',
    questions: [
      { id: 601, code: '3-1', title: 'อปท. ท้องถิ่น EP 1. : วิชาความรู้ความสามารถทั่วไป', youtubeid: 'g9z7FstC4j0', pdfUrl: '#', duration: '50:00 นาที', hasQuiz: true },
      { id: 602, code: '3-2', title: 'อปท. ท้องถิ่น EP 2. : วิชาภาษาไทย', youtubeid: '7P6F_S87Fls', pdfUrl: '#', duration: '45:00 นาที', hasQuiz: true },
      { id: 603, code: '3-3', title: 'อปท. ท้องถิ่น EP 3. : วิชาภาษาอังกฤษ', youtubeid: 'O9YwE8_O5rI', pdfUrl: '#', duration: '60:00 นาที', hasQuiz: true },
      { id: 604, code: '3-4', title: 'อปท. ท้องถิ่น EP 4. : วิชากฎหมายและระเบียบบริหารราชการส่วนท้องถิ่น', youtubeid: '7P6F_S87Fls', pdfUrl: '#', duration: '55:00 นาที', hasQuiz: true },
      { id: 605, code: '3-5', title: 'อปท. ท้องถิ่น EP 5. : วิชากฎหมายรัฐธรรมนูญ', youtubeid: 'g9z9FstC4j0', pdfUrl: '#', duration: '60:00 นาที', hasQuiz: true },
      { id: 606, code: '3-6', title: 'อปท. ท้องถิ่น EP 6. : เจาะลึกภาค ข. ข้อมูลตำแหน่งงานนโยบายและแผน', youtubeid: 'O9YwE8_O5rI', pdfUrl: '#', duration: '45:00 นาที', hasQuiz: true }
    ]
  },
  '6': {
    name: 'คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)',
    questions: [
      { id: 11, code: '6-1', title: 'นสต.ปราบปราม EP.1 : วิชาความสามารถทั่วไป', youtubeid: 'g9z7FstC4j0', pdfUrl: '#', duration: '45:00 นาที', hasQuiz: true },
      { id: 12, code: '6-2', title: 'นสต.ปราบปราม EP.2 : วิชาภาษาไทย', youtubeid: '7P6F_S87Fls', pdfUrl: '#', duration: '50:00 นาที', hasQuiz: true },
      { id: 13, code: '6-3', title: 'นสต.ปราบปราม EP.3 : วิชาภาษาอังกฤษ', youtubeid: 'O9YwE8_O5rI', pdfUrl: '#', duration: '60:00 นาที', hasQuiz: true },
      { id: 14, code: '6-4', title: 'นสต.ปราบปราม EP.4 : วิชาเทคโนโลยีสารสนเทศ', youtubeid: '7P6F_S87Fls', pdfUrl: '#', duration: '45:00 นาที', hasQuiz: true },
      { id: 15, code: '6-5', title: 'นสต.ปราบปราม EP.5 : วิชากฎหมายเบื้องต้นที่ประชาชนควรรู้', youtubeid: 'g9z9FstC4j0', pdfUrl: '#', duration: '55:00 นาที', hasQuiz: true },
      { id: 16, code: '6-6', title: 'นสต.ปราบปราม EP.6 : วิชาสังคม วัฒนธรรม จริยธรรม และประชาคมอาเซียน', youtubeid: 'O9YwE8_O5rI', pdfUrl: '#', duration: '40:00 นาที', hasQuiz: true }
    ]
  },
  '7': {
    name: 'คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)',
    questions: [
      { id: 21, code: '7-1', title: 'นสต.อำนวยการ EP.1 : วิชาความสามารถทั่วไป 🎯', youtubeid: 'g9z7FstC4j0', pdfUrl: '#', duration: '45:00 นาที', hasQuiz: true },
      { id: 22, code: '7-2', title: 'นสต.อำนวยการ EP.2 : วิชาภาษาไทย', youtubeid: '7P6F_S87Fls', pdfUrl: '#', duration: '40:00 นาที', hasQuiz: true },
      { id: 23, code: '7-3', title: 'นสต.อำนวยการ EP.3 : วิชาภาษาอังกฤษ', youtubeid: 'O9YwE8_O5rI', pdfUrl: '#', duration: '45:00 นาที', hasQuiz: true },
      { id: 24, code: '7-4', title: 'นสต.อำนวยการ EP.4 : วิชาคอมพิวเตอร์และเทคโนโลยีสารสนเทศ', youtubeid: '7P6F_S87Fls', pdfUrl: '#', duration: '44:00 นาที', hasQuiz: true },
      { id: 25, code: '7-5', title: 'นสต.อำนวยการ EP.5 : วิชากฎหมายเบื้องต้นที่เกี่ยวข้องในชีวิตประจำวัน', youtubeid: 'g9z9FstC4j0', pdfUrl: '#', duration: '55:00 นาที', hasQuiz: true },
      { id: 26, code: '7-6', title: 'นสต.อำนวยการ EP.6 : วิชาสังคม วัฒนธรรม จริยธรรม และประชาคมอาเซียน', youtubeid: 'O9YwE8_O5rI', pdfUrl: '#', duration: '40:00 นาที', hasQuiz: true }
    ]
  }
};

function ClassroomVdoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const studentPhone = searchParams.get('phone') || '';
  const studentName = searchParams.get('name') || '';
  const courseParam = searchParams.get('course') || '';

  const [myCourses, setMyCourses] = useState<string[]>([]);
  const [courseNameDisplay, setCourseNameDisplay] = useState(courseParam);
  const currentCourse = courseParam;

  const [lessonsList, setLessonsList] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [liveExamScore, setLiveExamScore] = useState('ยังไม่ได้เข้าทดสอบ 📝');
  const [loading, setLoading] = useState(true);
  // 📍 เปิดระบบทะเบียน 12 คอร์สหลักอัตโนมัติประจำกระดาน Dropdown
  useEffect(() => {
    const masterCourses = [
      'คอร์สติวกฎหมายราชการที่จำเป็น', 'คอร์สติว ก.พ. ภาค ก. (ฉบับผ่านชัวร์)', 'คอร์สติวสอบท้องถิ่น (อปท.) ภาค ก. และ ข.',
      'คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)', 'คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)',
      'คอร์สติวสอบ นายสิบตำรวจ (นสต. สายปราบปราม)', 'คอร์สติวสอบ นายสิบตำรวจ (สายอำนวยการและสนับสนุน)',
      'คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)', 'คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)',
      'คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)',
      'คอร์สลุยข้อสอบ นายสิบตำรวจ สาย อก./สพฐ.ตร. (ตะลุยโจทย์แยกรายวิชา)',
      'คอร์ส Pre-test ข้อสอบเสมือนจริง สาย อก./สพฐ.ตร. ตามหลักสูตรใหม่ล่าสุด (จับเวลาทำข้อสอบ/สรุปคะแนน)'
    ];
    setMyCourses(masterCourses);
  }, []);

  // 🔐 เกราะความปลอดภัยดักสแกนตั๋วเรียน ป้องกันคนแอบแก้ลิงก์แฮกดูวิดีโอ VDO พรีเมียมฟรี
  useEffect(() => {
    if (!studentPhone) { 
      router.push('/classroom'); 
      return; 
    }
    if (myCourses.length === 0) return;

    const checkAndLoadVdo = async () => {
      try {
        const myCoursesData = localStorage.getItem('user_my_courses');
        if (!myCoursesData) {
          alert('🚫 ไม่พบสิทธิ์เข้าเรียนในระบบ กรุณาล็อกอินใหม่อีกครั้งครับ');
          router.push('/classroom');
          return;
        }
        const myEnrolledCourses: string[] = JSON.parse(myCoursesData);

        const cleanStr = (str: string) => str.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|[\u2011-\u26FF]|\s+/g, '').trim();
        const cleanCourse = cleanStr(courseParam);
        
        const matchedKey = Object.keys(vdoCoursesContent).find(key => {
          const cleanKey = cleanStr(vdoCoursesContent[key].name);
          return cleanKey === cleanCourse || cleanKey.includes(cleanCourse) || cleanCourse.includes(cleanKey) || key === cleanCourse;
        });

        const hasAccessPermission = myEnrolledCourses.some(enrolled => 
          enrolled.includes(courseParam) || courseParam.includes(enrolled)
        );

        if (!matchedKey || !hasAccessPermission) {
          alert('🔒 ขออภัย สิทธิ์เข้าใช้งานถูกจำกัดเฉพาะนักเรียนคอร์สนี้เท่านั้นครับ');
          router.push('/classroom');
          return;
        }

        const courseData = vdoCoursesContent[matchedKey];
        setCourseNameDisplay(courseData.name);
        setLessonsList(courseData.questions);
        
        if (courseData.questions && courseData.questions.length > 0) {
          setActiveLesson(courseData.questions[0]);
        }
      } catch (err) {
        console.error('Vdo Guard error:', err);
        router.push('/classroom');
      } finally {
        setLoading(false);
      }
    };

    checkAndLoadVdo();
  }, [courseParam, studentPhone, myCourses, router]);

  // 📝 ฟังก์ชันโหลดข้อสอบย่อยท้ายคลิปวิดีโอจาก Supabase
  const startQuiz = async (subjectCode: string) => {
    setQuizSubmitted(false); 
    setSelectedAnswers({}); 
    setCurrentQuestionIndex(0); 
    setActiveQuestions([]);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject_code', subjectCode)
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setActiveQuestions(data);
      } else {
        setActiveQuestions([{ 
          id: 9999, 
          question_text: '📌 คลังข้อสอบประจำวิชาชุดจริงกำลังจะเปิดให้เข้าติวเร็วๆ นี้ครับ...', 
          choice_a: 'รับทราบ ยอดเยี่ยมมากครับ', 
          choice_b: 'เตรียมลุยโจทย์ใหม่', 
          correct_choice: 'choice_a' 
        }]);
      }
    } catch (err) { 
      console.error('Start quiz in vdo page crash:', err); 
    }
  };

  // 🏆 ฟังก์ชันคำนวณคะแนนควิซท้ายวิดีโอและลงแค็ตตาล็อกบันทึกลงตารางหลังบ้าน
  const submitQuiz = async () => {
    if (quizSubmitted) return;
    let score = 0;
    activeQuestions.forEach(q => {
      const correctLetter = q.correct_choice ? q.correct_choice.replace('choice_', '').toUpperCase() : 'A';
      if (selectedAnswers[q.id] === correctLetter) score++;
    });
    
    setLiveExamScore(`สรุปคะแนนทำควิซ: ได้รับคะแนน ${score}/${activeQuestions.length} ข้อ 🎉`);
    setQuizSubmitted(true);
    
    try {
      await supabase.from('quiz_attempts').insert([
        { 
          student_phone: studentPhone, 
          subject_name: activeLesson?.title || currentCourse, 
          score_obtained: score, 
          total_questions: activeQuestions.length 
        }
      ]);
    } catch (err) { 
      console.error('Save quiz attempts logs crash in vdo page:', err); 
    }
  };

  // 🚪 ฟังก์ชันออกจากห้องเรียนล้างข้อมูล Cache
  const handleLogout = () => { 
    localStorage.clear(); 
    router.push('/classroom'); 
  };

  // 🚀 ฟังก์ชันสลับสายคอร์สเรียน นำทางวาร์ปกระจายเลนข้ามโฟลเดอร์ Next.js อัจฉริยะแบบไร้รอยชน
  const handleCourseChange = (nextCourse: string) => {
    const params = `?phone=${encodeURIComponent(studentPhone)}&name=${encodeURIComponent(studentName)}&course=${encodeURIComponent(nextCourse)}`;
    if (nextCourse.includes('Pre-test')) { 
      router.push(`/classroom/pretest${params}`); 
    } else if (nextCourse.includes('ตะลุยโจทย์') || nextCourse.includes('บททดสอบ') || nextCourse.includes('ลุยข้อสอบ')) { 
      router.push(`/classroom/quiz${params}`); 
    } else { 
      router.push(`/classroom/vdo${params}`); 
    }
  };
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', fontWeight: '700', fontFamily: '"Inter", "Prompt", sans-serif', color: '#64748b' }}>⏳ ระบบ Guard กำลังตรวจเช็คสิทธิ์และจัดเรียงระบบห้องเรียนวิดีโอ...</div>;

  return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* แถบเมนูบาร์ด้านบนสุดพร้อมกล่อง Dropdown เลือกสลับคอร์สติว */}
      <div style={{ background: 'linear-gradient(135deg, #0052cc, #00a4ff)', padding: '1.25rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>🏠 ห้องเรียนออนไลน์ | บ้านเด็กติวเตอร์</h2>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' }}>👤 คุณ {studentName}</span>
          <select value={currentCourse} onChange={(e) => handleCourseChange(e.target.value)} style={{ padding: '0.4rem 1rem', borderRadius: '100px', border: 'none', backgroundColor: '#ffffff', color: '#0052cc', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}>
            {myCourses.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1.25rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>🚪 ออกจากห้องเรียน</button>
      </div>

      {/* 📊 แผงแดชบอร์ดสรุปสถิติ 3 กล่องขอบมนประจำห้องเรียน VDO กลับมาตรงล็อก 100% */}
      <div style={{ maxWidth: '1280px', margin: '2rem auto 0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📊 ความคืบหน้าการเรียนคอร์สนี้</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2563eb' }}>100%</span>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #16a34a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📝 บทเรียนในคอร์สติว</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#16a34a' }}>{lessonsList?.length || 0} วิชา</span>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #ea580c', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>🎯 คะแนนและผลการประเมินสอบ</span>
          <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ea580c', display: 'block', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{liveExamScore}</span>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        {/* บอร์ดซ้าย: เครื่องเล่นวิดีโอ หรือ กระดานคำถาม */}
        <div style={{ flex: '2 1 680px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            
            {activeLesson && activeQuestions.length === 0 && (
              <div>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', backgroundColor: '#000' }}>
                  <iframe style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} src={`https://youtube.com{activeLesson.youtubeid}?rel=0&autoplay=0`} allowFullScreen></iframe>
                </div>
                <h3 style={{ marginTop: '1.5rem', fontWeight: '880', color: '#0f172a' }}>{activeLesson.title}</h3>
                <div style={{ backgroundColor: '#ebf5ff', padding: '1.25rem 1.5rem', borderRadius: '14px', border: '1px solid #bfdbfe', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e40af', display: 'block' }}>📋 เอกสารประกอบและแนวข้อสอบ</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>ℹ️ ระยะเวลาความยาวติว: {activeLesson.duration}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => alert('📥 ระบบกำลังเตรียมดาวน์โหลดไฟล์สรุปข้อสอบเข้าเครื่อง...')} style={{ backgroundColor: '#0052cc', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>📥 โหลดเอกสารติว (.PDF)</button>
                    <button onClick={() => startQuiz(activeLesson.code)} style={{ backgroundColor: '#ff8c00', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>📝 ทำแบบทดสอบท้ายบท</button>
                  </div>
                </div>
              </div>
            )}
            {activeQuestions.length > 0 && (
              <div>
                <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', fontWeight: '800', color: '#0f172a' }}>📝 ควิซท้ายบทเรียน ข้อที่ {currentQuestionIndex + 1} / {activeQuestions.length}</h3>
                <p style={{ fontWeight: '700', margin: '1.5rem 0', fontSize: '1.05rem', color: '#1e293b' }}>{activeQuestions[currentQuestionIndex]?.question_text}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const q = activeQuestions[currentQuestionIndex]; 
                    const isSel = selectedAnswers[q.id] === opt;
                    return (
                      <div key={opt} onClick={() => !quizSubmitted && setSelectedAnswers({...selectedAnswers, [q.id]: opt})} style={{ padding: '1rem', borderRadius: '12px', border: isSel ? '2px solid #2563eb' : '1px solid #cbd5e1', backgroundColor: isSel ? '#eff6ff' : '#fff', cursor: quizSubmitted ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    !quizSubmitted && <button onClick={submitQuiz} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', fontWeight: '700' }}>📤 ส่งใบคำตอบ</button>
                  )}
                  {quizSubmitted && <button onClick={() => setActiveQuestions([])} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', backgroundColor: '#475569', color: '#fff', fontWeight: '700' }}>🔄 กลับไปหน้าวิดีโอ</button>}
                </div>
                {quizSubmitted && <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fffbeb', borderRadius: '12px', color: '#b45309', fontWeight: '700', border: '1px solid #f6e0b3' }}>{liveExamScore}</div>}
              </div>
            )}
          </div>
        </div>

        {/* บอร์ดขวา: สารบัญวิชา */}
        <div style={{ flex: '1 1 320px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#0f172a' }}>🗂️ สารบัญบทเรียน ({lessonsList.length} วิชา)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lessonsList.map((lesson, i) => {
                const isCurrent = activeLesson?.id === lesson.id;
                return (
                  <div key={i} onClick={() => { setActiveLesson(lesson); setActiveQuestions([]); setQuizSubmitted(false); }} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: isCurrent ? '#f0f4f8' : '#f8fafc', border: isCurrent ? '2px solid #0052cc' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: '800', color: isCurrent ? '#0052cc' : '#1e293b' }}>{lesson.title}</h5>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>ℹ️ เวลาเรียน: {lesson.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🏛️ ส่วนกรอบครอบสำหรับการทำงาน Client-side ใน Next.js App Router
export default function ClassroomVdoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', fontWeight: '700', fontFamily: '"Inter", "Prompt", sans-serif' }}>⏳ กำลังโหลดห้องเรียนวิดีโอเนื้อหาความปลอดภัย...</div>}>
      <ClassroomVdoContent />
    </Suspense>
  );
}
