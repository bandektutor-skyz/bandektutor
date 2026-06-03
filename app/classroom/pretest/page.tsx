'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

// 🏛️ แผงคลังข้อมูลพิมพ์เขียวสากล ล็อก Key และจัดสรรชื่อคอร์สตรงร่องหน้าจอบอร์ดหลัก 100%
const pretestCoursesContent: { [key: string]: { name: string; questions: any[] } } = {
  '9': {
    name: 'คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)',
    questions: [
      { id: 701, code: '9-1', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 1', duration: 'จับเวลา 3 ชม.' },
      { id: 702, code: '9-2', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 2', duration: 'จับเวลา 3 ชม.' },
      { id: 703, code: '9-3', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 3', duration: 'จับเวลา 3 ชม.' },
      { id: 704, code: '9-4', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 4', duration: 'จับเวลา 3 ชม.' },
      { id: 705, code: '9-5', title: 'นสต.ปราบปราม พรีเทส (Pre-test) ชุดที่ 5', duration: 'จับเวลา 3 ชม.' }
    ]
  },
  '10': {
    name: 'คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)',
    questions: [
      { id: 801, code: '10-1', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 1', duration: 'จับเวลา 3 ชม.' },
      { id: 802, code: '10-2', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 2', duration: 'จับเวลา 3 ชม.' },
      { id: 803, code: '10-3', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 3', duration: 'จับเวลา 3 ชม.' },
      { id: 804, code: '10-4', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 4', duration: 'จับเวลา 3 ชม.' },
      { id: 805, code: '10-5', title: 'อก. อำนวยการ พรีเทส (Pre-test) ชุดที่ 5', duration: 'จับเวลา 3 ชม.' }
    ]
  },
  '12': {
    name: 'คอร์ส Pre-test ข้อสอบเสมือนจริง สาย อก./สพฐ.ตร. ตามหลักสูตรใหม่ล่าสุด',
    questions: [
      { id: 1201, code: '12-1', title: 'สาย อก./สพฐ.ตร. พรีเทส (Pre-test) ชุดที่ 1', duration: 'จับเวลา 3 ชม.' },
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

  // 🏛️ สารบบดึงค่าพารามิเตอร์ความปลอดภัย
  const studentPhone = searchParams.get('phone') || '';
  const studentName = searchParams.get('name') || '';
  const courseParam = searchParams.get('course') || '';

  // 🔒 ผูก State ประจำแผงวงจรห้องเรียน
  const [myCourses, setMyCourses] = useState<string[]>([]);
  const [courseNameDisplay, setCourseNameDisplay] = useState(courseParam);
  const currentCourse = courseParam;

  const [loading, setLoading] = useState(true);

  const [examSetsList, setExamSetsList] = useState<any[]>([]);
  const [activeSet, setActiveSet] = useState<any>(null);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [liveExamScore, setLiveExamScore] = useState('ยังไม่ได้เข้าทดสอบ 🎯');

  // ⏱️ กลไกควบคุมตัวแปรนาฬิกา
  const [timeLeft, setTimeLeft] = useState(180 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // 📍 เปิดระบบทะเบียน 12 คอร์สหลักอัตโนมัติประจำกระดาน Dropdown หน้าร้าน
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

  // 🛡️ 5. เกราะดักจับสิทธิ์เรียนพรีเทสอัจฉริยะ (เวอร์ชันแก้ปัญหาตัวสะกดและสระวรรคเหลื่อมล้ำ 100%)
  useEffect(() => {
    if (!studentPhone) {
      router.push('/classroom');
      return;
    }
    if (myCourses.length === 0) return;

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

        if (courseData.questions && courseData.questions.length > 0) {
          setActiveSet(courseData.questions[0]); // แก้บั๊ก Type ชี้เป้าวัตถุข้อแรกตรงล็อกเป๊ะปัง
          startPretest(courseData.questions[0].code, courseData.questions[0].title);
        }
      } catch (err) {
        console.error('Pretest Access Guard Error:', err);
        router.push('/classroom');
      } finally {
        setLoading(false);
      }
    };

    checkAndLoadQuestions();
  }, [courseParam, studentPhone, myCourses, router]);

  // 📝 6. ฟังก์ชันโหลดคำถามชุดใหญ่เรียงแถวตรงตามเลข ID หลังบ้านที่พาร์ทเนอร์ตรวจสอบแล้วว่าถูกต้อง 100%
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
        .order('id', { ascending: true }); // ดึงตามไอดีเรียงจากน้อยไปมาก ตรงล็อกฐานข้อมูลที่จัดเรียงมาแล้ว 100%

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
  // 🏆 9. ฟังก์ชันคำนวณคะแนนแบบแปรผันตามหลักสูตรคอร์สเรียน (คอร์ส 12 แยก 2 ภาควิชา / คอร์ส 9 และ 10 คิดคะแนนรวมปกติ)
  const submitQuiz = async () => {
    if (quizSubmitted) return;
    setIsTimerRunning(false);

    let totalCorrect = 0;
    let part1Correct = 0; // ภาคความรู้ความสามารถทั่วไป (ข้อ 1-40)
    let part2Correct = 0; // ภาคความรู้ความสามารถที่ใช้เฉพาะตำแหน่ง (ข้อ 41-150)

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

    // 🔍 ระบบแยกเลนตรวจสิทธิ์เกณฑ์อัจฉริยะดักทางตามคำสั่งพาร์ทเนอร์
    const isCourse12 = currentCourse.includes('สาย อก./สพฐ.ตร.') || currentCourse.includes('หลักสูตรใหม่ล่าสุด') || currentCourse.includes('12');

    let isAllPassed = false;
    let passedStatusText = '';
    let reportAlertText = '';

    if (isCourse12) {
      // 👮‍♂️ สเปกตำรวจคอร์ส 12: กฎเหล็กแยกตรวจ 60% ทั้งสองภาคส่วน
      const isPart1Passed = part1Percent >= 60;
      const isPart2Passed = part2Percent >= 60;
      isAllPassed = isPart1Passed && isPart2Passed;
      passedStatusText = isAllPassed ? 'ผ่านเกณฑ์ข้าราชการตำรวจ 🎉' : 'ยังไม่ผ่านเกณฑ์ (ต้องผ่าน 60% ทั้ง 2 ภาควิชา) ❌';

      reportAlertText =
        `📊 [สรุปรายงานผลคะแนนสอบเสมือนจริงฟูลสเกล สาย อก./สพฐ.ตร.]\n` +
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
        `🏆 สรุปประเมินภาพรวมหลักสูตร: ${passedStatusText}`;
    } else {
      // 🎓 สเปกคอร์ส 9 และ 10: คิดคะแนนรวมภาพรวมผ่าน 60% ปกติแบบสัมฤทธิผลสากล
      isAllPassed = totalPercent >= 60;
      passedStatusText = isAllPassed ? 'ผ่านเกณฑ์คะแนนรวมทดสอบแล้ว 🎉' : 'ยังไม่ผ่านเกณฑ์คะแนนรวม (เกณฑ์ผ่าน 60% ขึ้นไป) ❌';

      reportAlertText =
        `📊 [สรุปรายงานผลคะแนนสอบพรีเทสเสมือนจริง]\n` +
        `------------------------------------------\n` +
        `📝 คะแนนที่ทำได้จริง: ${totalCorrect} / ${grandTotal} ข้อ\n` +
        `📈 คิดเป็นสัดส่วนร้อยละ: ${totalPercent.toFixed(0)}%\n` +
        `------------------------------------------\n` +
        `🏆 ผลการประเมินวิเคราะห์: ${passedStatusText}`;
    }

    alert(reportAlertText);

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

  // 🚀 ฟังก์ชันสลับสายคอร์สเรียน วาร์ปกระจายเลนข้ามโฟลเดอร์ Next.js อัจฉริยะแบบไร้รอยชน
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

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', fontWeight: '700', fontFamily: '"Inter", "Prompt", sans-serif', color: '#64748b' }}>⏳ ระบบ Guard กำลังตรวจเช็คสิทธิ์และจัดเรียงคิวข้อสอบพรีเทส...</div>;

  return (
    <div style={{ fontFamily: '"Inter", "Prompt", sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem' }}>

      {/* 1. แถบเมนูบาร์ด้านบนสุดหรูหราไล่เฉดสีฟ้า-น้ำเงินเงางาม ตามภาพถ่ายชิ้นแรกที่หายไป */}
      <div style={{ background: 'linear-gradient(135deg, #0052cc, #00a4ff)', padding: '1.25rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>🏛️ ห้องสอบจำลองเสมือนจริง (Pre-test Mode) | บ้านเด็กติวเตอร์</h2>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' }}>👤 คุณ {studentName}</span>
          <select value={currentCourse} onChange={(e) => handleCourseChange(e.target.value)} style={{ padding: '0.4rem 1rem', borderRadius: '100px', border: 'none', backgroundColor: '#ffffff', color: '#0052cc', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}>
            {myCourses.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1.25rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>🚪 ออกจากห้องเรียน</button>
      </div>

      {/* 📊 2. แผงแดชบอร์ดสรุปสถิติ 3 กล่องขอบมนแยกสีเส้นขอบซ้าย ตามภาพถ่ายชิ้นที่สองที่ใช้งานได้จริง */}
      <div style={{ maxWidth: '1280px', margin: '2rem auto 0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📊 ความคืบหน้าการเรียนคอร์สนี้</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2563eb' }}>100%</span>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #16a34a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>📝 จำนวนชุดข้อสอบทั้งหมด</span>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#16a34a' }}>{examSetsList?.length || 0} ชุดสอบ</span>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', borderLeft: '5px solid #ea580c', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '4px' }}>🎯 คะแนนและผลการประเมินสอบ</span>
          <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ea580c', display: 'block', whiteSpace: 'pre-line', lineHeight: '1.4' }}>{liveExamScore}</span>
        </div>
      </div>
      <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>

        {/* บอร์ดฝั่งซ้าย: กระดานคำถามและชอยส์ ก ข ค ง อัจฉริยะ (เมื่อกดเริ่มทำข้อสอบแล้วจะกางกึ่งกลางจออย่างสง่างาม) */}
        <div style={{ flex: '2 1 680px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {activeQuestions.length > 0 && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
              <div>
                <h3 style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', fontWeight: '800', color: '#0f172a' }}>📝 คลังโจทย์ข้อสอบ: {activeSet?.title || 'ชุดข้อสอบจำลอง'}</h3>
                <div style={{ margin: '10px 0', fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>คำถามข้อที่ {currentQuestionIndex + 1} / {activeQuestions.length}</div>

                <p style={{ fontWeight: '700', margin: '1.5rem 0', fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.6' }}>{activeQuestions[currentQuestionIndex]?.question_text}</p>

                {/* แผงชอยส์ ก ข ค ง วงกลมไฮไลต์ฟ้า พร้อมระบบตรวจคะแนนอัจฉริยะเปลี่ยนสี */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {['A', 'B', 'C', 'D'].map(opt => {
                    const q = activeQuestions[currentQuestionIndex];
                    const isSel = selectedAnswers[q.id] === opt;
                    const correctLetter = q.correct_choice ? q.correct_choice.replace('choice_', '').toUpperCase() : 'A';
                    let opBg = isSel ? '#eff6ff' : '#ffffff';
                    let opBorder = isSel ? '2px solid #2563eb' : '1px solid #cbd5e1';

                    if (quizSubmitted) {
                      if (correctLetter === opt) { opBg = '#dcfce7'; opBorder = '2px solid #16a34a'; }
                      else if (isSel) { opBg = '#fef2f2'; opBorder = '2px solid #ef4444'; }
                    }

                    return (
                      <div
                        key={opt}
                        onClick={() => !quizSubmitted && setSelectedAnswers({ ...selectedAnswers, [q.id]: opt })}
                        style={{ padding: '1rem', borderRadius: '12px', border: opBorder, backgroundColor: opBg, cursor: quizSubmitted ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s' }}
                      >
                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isSel ? '#2563eb' : '#f1f5f9', color: isSel ? 'white' : '#475569', fontSize: '0.85rem', fontWeight: '800' }}>{opt === 'A' ? 'ก' : opt === 'B' ? 'ข' : opt === 'C' ? 'ค' : 'ง'}</span>
                        <span style={{ color: '#334155' }}>{q[`choice_${opt.toLowerCase()}`] || q[`option_${opt.toLowerCase()}`]}</span>
                      </div>
                    );
                  })}
                </div>

                {/* แถบควบคุมปุ่มนำทาง ข้อก่อนหน้า - ข้อถัดไป - ส่งกระดาษคำตอบ */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer', fontWeight: '700', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569' }}>⬅️ ข้อก่อนหน้า</button>
                  {currentQuestionIndex < activeQuestions.length - 1 ? (
                    <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', backgroundColor: '#2563eb', color: '#fff', fontWeight: '700', border: 'none', cursor: 'pointer' }}>ข้อถัดไป ➡️</button>
                  ) : (
                    !quizSubmitted && <button onClick={submitQuiz} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', fontWeight: '700', border: 'none', cursor: 'pointer' }}>📤 ส่งกระดาษคำตอบ</button>
                  )}
                </div>
                {quizSubmitted && <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fffbeb', borderRadius: '12px', color: '#b45309', fontWeight: '700', border: '1px solid #f6e0b3' }}>{liveExamScore}</div>}
              </div>
            </div>
          )}
        </div>
        {/* ฝั่งขวา: รายชื่อชุดข้อสอบย่อย 15 ชุด (ตามรูปภาพชิ้นที่สาม) และ เกณฑ์คะแนนตัดเกรดสีทองนวลตัวเต็ม (ตามรูปภาพชิ้นที่สี่) */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* 🗂️ ตู้สารบัญสลับชุดข้อสอบย่อย 15 ชุดดีไซน์หรูหราขอบมนหนาด้านขวามือ */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#0f172a' }}>🗂️ หมวดวิชาทำข้อสอบ ({examSetsList.length} ชุดสอบ)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {examSetsList.map((quiz: any) => {
                const isCurrent = activeSet?.code === quiz.code;
                return (
                  <div
                    key={quiz.id}
                    onClick={() => { setActiveSet(quiz); startPretest(quiz.code, quiz.title); }}
                    style={{ padding: '1rem', borderRadius: '12px', backgroundColor: isCurrent ? '#f0f4f8' : '#f8fafc', border: isCurrent ? '2px solid #0052cc' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: '800', color: isCurrent ? '#0052cc' : '#1e293b' }}>{quiz.title}</h5>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '750' }}>ℹ️ {quiz.duration || 'จับเวลาทำข้อสอบ'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📈 บล็อกเกณฑ์คะแนนวัดระดับแบบเปอร์เซ็นต์ทองนวลตัวเต็ม 5 ระดับรักษารายละเอียดครบถ้วนตามแบบดั้งเดิม */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '1.5rem', background: 'linear-gradient(to bottom, #ffffff, #fdfcf7)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)' }}>
            <div style={{ borderBottom: '2px solid #f6e0b3', paddingBottom: '0.6rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '1.3rem' }}>📈</span><h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#b45309', margin: 0 }}>เกณฑ์การวัดระดับคะแนน (Grading)</h3></div>
            <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
              <p style={{ margin: 0, fontWeight: '700', color: '#1e293b' }}>• คิดตามสัดส่วนร้อยละของชุดข้อสอบจริง</p>
              <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#1e293b' }}>• เกณฑ์ผ่านสัมฤทธิผล: ร้อยละ 60 ขึ้นไป</p>
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

// 🏛️ ส่วนกรอบครอบสำหรับการทำงาน Client-side ใน Next.js App Router
export default function ClassroomPretestPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', fontWeight: '700', fontFamily: '"Inter", "Prompt", sans-serif' }}>⏳ กำลังดำเนินการโหลดระบบคลังระบบความปลอดภัยพรีเทส...</div>}>
      <ClassroomPretestContent />
    </Suspense>
  );
}
