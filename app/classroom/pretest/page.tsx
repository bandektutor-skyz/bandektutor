'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

// 🏛️ แผงคลังข้อมูลพิมพ์เขียวสากล ล็อก Key ด้วยรหัสคอร์ส ดักทางบั๊กสลับสาย 100%
const pretestCoursesContent: { [key: string]: { name: string; questions: any[] } } = {
  '9': {
    name: 'คอร์ส Pre-test ข้อสอบเสมือนจริง นัสต. (จับเวลา 180 นาที)',
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
  
  // 🏛️ 1. ระบบจัดระเบียบตัวแปรหลักและเปิดเกราะความปลอดภัยดัก URL แฮกเกอร์
  const studentPhone = searchParams.get('phone') || '';
  const studentName = searchParams.get('name') || '';
  const courseParam = searchParams.get('course') || ''; 

  // 🔒 2. ผูกสลักระบบ State และกำหนดค่าเริ่มต้นสลับฝั่งให้ถูกต้องตรงวินัย React 
  const [courseNameDisplay, setCourseNameDisplay] = useState(courseParam); 
  const currentCourse = courseParam; 

  const [allowedQuestions, setAllowedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📋 3. บล็อก State โครงสร้างเดิมประจำการของพาร์ทเนอร์ (ล็อกระเบียบนิ่งเป๊ะตรงร่อง)
  const [examSetsList, setExamSetsList] = useState<any[]>([]);
  const [activeSet, setActiveSet] = useState<any>(null);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [liveExamScore, setLiveExamScore] = useState('ยังไม่ได้เริ่มทำข้อสอบพรีเทส 🎯');

  // ⏱️ 4. ระบบนาฬิกาจับเวลาถอยหลัง 180 นาที (3 ชั่วโมงเต็มเล่ม) โครงสร้างเดิมของพาร์ทเนอร์
  const [timeLeft, setTimeLeft] = useState(180 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 🛡️ 5. เกราะดักจับค่าสิทธิ์ที่ส่งมาจากหน้า Login เพื่อกางชุดข้อสอบ (เวอร์ชันแก้ไขจุดบั๊กโครงสร้าง Type และคำว่า Gold)
  useEffect(() => {
    if (!studentPhone) { 
      router.push('/classroom'); 
      return; 
    }

    const checkAndLoadQuestions = async () => {
      try {
        const myCoursesData = localStorage.getItem('user_my_courses');
        if (!myCoursesData) {
          alert('🚫 ไม่พบสิทธิ์เข้าเรียนในระบบ กรุณาล็อกอินใหม่อีกครั้งครับ');
          router.push('/classroom');
          return;
        }
        const myEnrolledCourses: string[] = JSON.parse(myCoursesData);

        const cleanText = (str: string) => str.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|[\u2011-\u26FF]/g, '').trim();
        const cleanCourse = cleanText(courseParam);
        
        const matchedKey = Object.keys(pretestCoursesContent).find(key => 
          cleanCourse.includes(pretestCoursesContent[key].name) || 
          pretestCoursesContent[key].name.includes(cleanCourse) ||
          cleanCourse.includes(key)
        );

        const hasAccessPermission = myEnrolledCourses.some(enrolled => 
          enrolled.includes(courseParam) || courseParam.includes(enrolled)
        );

        if (!matchedKey || !hasAccessPermission) {
          alert('🔒 ขออภัย สิทธิ์เข้าใช้งานถูกจำกัดเฉพาะนักเรียนคอร์สนี้เท่านั้นครับ');
          router.push('/classroom');
          return;
        }

        const courseData = pretestCoursesContent[matchedKey];
        setCourseNameDisplay(courseData.name);
        setExamSetsList(courseData.questions); 
        
        if (courseData.questions && courseData.questions.length > 0) {
          setActiveSet(courseData.questions);
          startPretest(courseData.questions[0].code, courseData.questions[0].title);
        }
      } catch (err) {
        console.error('Guard and load error:', err);
        router.push('/classroom');
      } finally {
        setLoading(false);
      }
    };

    checkAndLoadQuestions();
  }, [courseParam, studentPhone, router]);

  // 📝 6. ฟังก์ชันโหลดคำถามชุดใหญ่จากตารางหลังบ้าน Supabase
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
        .order('id', { ascending: true }); // สั่งล็อกแถวเรียงตรงจากรหัสน้อยไปมากเป๊ะปัง

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
      console.error('Fetch questions error:', err); 
    }
  };

  // ⏱️ 7. กลไกความแม่นยำตรวจนับเวลานาทีถอยหลังรายวินาที
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

  // ⏱️ 8. ฟังก์ชันแปลงเลขวินาทีให้เป็นโครงสร้างหน้าจอ HH:MM:SS
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
  if (loading) return <div className="p-8 text-center text-xl font-medium text-gray-600">⏳ ระบบ Guard กำลังตรวจเช็คสิทธิ์และจัดเรียงคิวข้อสอบ...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 rounded-2xl shadow-sm my-6">
      <div className="border-b pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-1">🏛️ ห้องสอบจำลอง (Pre-test Mode)</h1>
          <div className="flex gap-4 text-sm text-gray-600 font-medium">
            <span>👤 ผู้เข้าสอบ: <strong className="text-gray-900">{studentName}</strong></span>
            <span>📞 เบอร์โทรศัพท์: <strong className="text-gray-900">{studentPhone}</strong></span>
          </div>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition font-medium text-sm">
          🚪 ออกจากระบบ
        </button>
      </div>

      <h2 className="text-lg font-bold mb-4 text-gray-800 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">{courseNameDisplay}</h2>
      
      {/* ⏱️ ส่วนนาฬิกาแสดงผลบนหน้าจอพาร์ทเนอร์ */}
      <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-xl font-bold flex justify-between items-center border border-blue-100">
        <span>⏱️ เวลาคงเหลือในการทำข้อสอบ:</span>
        <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
      </div>

      <div className="grid gap-3">
        {examSetsList.map((quiz: any) => (
          <div key={quiz.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 transition flex justify-between items-center bg-white">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100">รหัสคอร์สย่อย: {quiz.code}</span>
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">⏱️ เวลาสอบ: {quiz.duration}</span>
              </div>
              <strong className="text-gray-800 text-base font-semibold mt-1">{quiz.title}</strong>
            </div>
            <button 
              onClick={() => startPretest(quiz.code, quiz.title)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-bg-blue-700 transition font-semibold shadow-sm text-sm"
            >
              📝 เริ่มทำข้อสอบ
            </button>
          </div>
        ))}
      </div>
      
      {/* 💡 ส่วนกางแถวกล่องทำข้อสอบ (Render คำถาม 150 ข้อด้านล่างโครงสร้างเดิมของพาร์ทเนอร์) */}
      {activeQuestions.length > 0 && !quizSubmitted && (
        <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <span className="font-bold text-gray-700">ข้อที่ {currentQuestionIndex + 1} / {activeQuestions.length}</span>
            <span className="text-sm text-blue-600 font-semibold">{liveExamScore}</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-6">{activeQuestions[currentQuestionIndex].question_text}</p>
          <div className="grid gap-3 mb-6">
            {['A', 'B', 'C', 'D'].map((choice) => {
              const choiceKey = `choice_${choice.toLowerCase()}`;
              return (
                <button
                  key={choice}
                  onClick={() => setSelectedAnswers({ ...selectedAnswers, [activeQuestions[currentQuestionIndex].id]: choice })}
                  className={`p-4 rounded-xl text-left border transition font-medium ${
                    selectedAnswers[activeQuestions[currentQuestionIndex].id] === choice
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="inline-block w-8 h-8 rounded-full bg-gray-100 text-center leading-8 mr-3 font-bold text-sm">{choice}</span>
                  {activeQuestions[currentQuestionIndex][choiceKey]}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="px-4 py-2 border rounded-xl hover:bg-gray-50 disabled:opacity-40 transition font-medium"
            >
              ⬅️ ข้อก่อนหน้า
            </button>
            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
              >
                ข้อถัดไป ➡️
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold shadow-md"
              >
                🚀 ส่งกระดาษคำตอบ
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 🏛️ ส่วนกรอบครอบสำหรับการทำงาน Client-side ใน Next.js App Router
export default function ClassroomPretestPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-medium">⏳ กำลังดำเนินการโหลดระบบคลังระบบความปลอดภัย...</div>}>
      <ClassroomPretestContent />
    </Suspense>
  );
}
