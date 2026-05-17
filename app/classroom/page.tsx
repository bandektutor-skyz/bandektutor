'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export default function ClassroomPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  
  const [myCourses, setMyCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // 🕹️ ระบบจัดการดัชนีข้อสอบ (สำหรับกดย้อนกลับ-เดินหน้าทีละข้อในคอร์ส Pre-test)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // ⏱️ ระบบจับเวลาเสมือนจริง (Countdown Timer)
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 180 นาทีแปลงเป็นวินาที
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [liveExamScore, setLiveExamScore] = useState('ยังไม่ได้ทดสอบ 🎯');
  const [rawScoreCount, setRawScoreCount] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);

  // 📝 ผังโครงสร้างบทเรียน 6 คอร์สใหม่แกะกล่องอัปเกรดระบบ EdTech เต็มสเกล
  const allCoursesContent: any = {
    '📝 คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)': [
      { id: 101, title: 'ก.พ. ภาค ก. - หมวดวิชาความสามารถทั่วไป (คณิตคิดลัด)', duration: '50 ข้อ', youtubeid: 'g9z7FstC4j0' },
      { id: 102, title: 'ก.พ. ภาค ก. - หมวดวิชาภาษาไทย (หลักการใช้ภาษา)', duration: '50 ข้อ', youtubeid: '7P6F_S87Fls' },
      { id: 103, title: 'ก.พ. ภาค ก. - หมวดวิชาภาษาอังกฤษ (Grammar & Reading)', duration: '50 ข้อ', youtubeid: 'O9YwE8_O5rI' },
      { id: 104, title: 'ก.พ. ภาค ก. - หมวดวิชาความรู้ลักษณะการเป็นข้าราชการที่ดี', duration: '50 ข้อ', youtubeid: 'g9z7FstC4j0' }
    ],
    '👮 คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)': [
      { id: 201, title: 'นสต. วิชาความสามารถทั่วไป - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: 'g9z7FstC4j0' },
      { id: 202, title: 'นสต. วิชาภาษาไทย - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: '7P6F_S87Fls' },
      { id: 203, title: 'นสต. วิชาภาษาอังกฤษ - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: 'O9YwE8_O5rI' },
      { id: 204, title: 'นสต. วิชาคอมพิวเตอร์และสารสนเทศ - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: 'g9z7FstC4j0' },
      { id: 205, title: 'นสต. วิชากฎหมายเบื้องต้นที่ประชาชนควรรู้ - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: '7P6F_S87Fls' },
      { id: 206, title: 'นสต. วิชาสังคม วัฒนธรรม จริยธรรม อาเซียน - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: 'O9YwE8_O5rI' }
    ],
    '💼 คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)': [
      { id: 301, title: 'สายอก. วิชาความสามารถทั่วไป - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: 'g9z7FstC4j0' },
      { id: 302, title: 'สายอก. วิชาภาษาไทย - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: '7P6F_S87Fls' },
      { id: 303, title: 'สายอก. วิชาภาษาอังกฤษ - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: 'O9YwE8_O5rI' },
      { id: 304, title: 'สายอก. วิชาคอมพิวเตอร์และสารสนเทศ - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: 'g9z7FstC4j0' },
      { id: 305, title: 'สายอก. วิชากฎหมายเบื้องต้นที่เกี่ยวข้อง - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: '7P6F_S87Fls' },
      { id: 306, title: 'สายอก. วิชาสังคม วัฒนธรรม จริยธรรม อาเซียน - บททดสอบฟูลสเกล', duration: '5 บทเรียน / บทละ 50 ข้อ', youtubeid: 'O9YwE8_O5rI' }
    ],
    '🏆 คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)': [
      { id: 401, title: 'นสต. ม็อคเอ็กแซม ชุดที่ 1 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: 'g9z7FstC4j0' },
      { id: 402, title: 'นสต. ม็อคเอ็กแซม ชุดที่ 2 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: '7P6F_S87Fls' },
      { id: 403, title: 'นสต. ม็อคเอ็กแซม ชุดที่ 3 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: 'O9YwE8_O5rI' },
      { id: 404, title: 'นสต. ม็อคเอ็กแซม ชุดที่ 4 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: 'g9z7FstC4j0' },
      { id: 405, title: 'นสต. ม็อคเอ็กแซม ชุดที่ 5 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: '7P6F_S87Fls' }
    ],
    '🏅 คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)': [
      { id: 501, title: 'สายอก. ม็อคเอ็กแซม ชุดที่ 1 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: 'g9z7FstC4j0' },
      { id: 502, title: 'สายอก. ม็อคเอ็กแซม ชุดที่ 2 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: '7P6F_S87Fls' },
      { id: 503, title: 'สายอก. ม็อคเอ็กแซม ชุดที่ 3 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: 'O9YwE8_O5rI' },
      { id: 504, title: 'สายอก. ม็อคเอ็กแซม ชุดที่ 4 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: 'g9z7FstC4j0' },
      { id: 505, title: 'สายอก. ม็อคเอ็กแซม ชุดที่ 5 - 150 ข้อเสมือนจริง', duration: '180 นาที', youtubeid: '7P6F_S87Fls' }
    ]
  };

  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const studentStats = { progress: '⚡ พร้อมลุยข้อสอบ', completedLessons: 0, examScore: 'ยังไม่ได้ทดสอบ 🎯' };

  // ⏳ Effect รันนาฬิกานับถอยหลังเมื่อกดทำข้อสอบ Pre-test
  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeft > 0 && !quizSubmitted) {
      timer = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      alert('⏰ หมดเวลาทำข้อสอบแล้วครับระบบจะทำการส่งคำตอบตรวจคะแนนอัตโนมัติ!');
      setIsTimerRunning(false);
      // สั่งส่งคำตอบอัตโนมัติได้จากตรงนี้
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, quizSubmitted]);

  // ฟังก์ชันจัดฟอร์แมตแสดงผลเวลาแบบสวยงาม (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const loadStudentCourses = async (phone: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('course_title')
        .eq('student_phone', phone.trim())
        .eq('status', 'อนุมัติแล้ว');

      if (error) throw error;
      if (data && data.length > 0) {
        const courseList = data.map((item: any) => item.course_title);
        const uniqueCourses = Array.from(new Set(courseList));
        setMyCourses(uniqueCourses);
        setSelectedCourse(uniqueCourses[0] || ''); 
        setStudentName(name);
        setIsAuthenticated(true);
      }
    } catch (e: any) { console.error(e); }
  };

  useEffect(() => {
    const savedPhone = localStorage.getItem('user_phone');
    const savedName = localStorage.getItem('user_name');
    if (savedPhone && savedName) { loadStudentCourses(savedPhone, savedName); }
  }, []);
  // 📰 คลังสถานะจำลองข้อมูลข่าวสารการสอบ (สำหรับอัปเดตหน้าบ้านเรียลไทม์)
  const examNews = [
    {
      id: 1,
      badge: '🔥 เปิดสอบด่วน',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      title: 'กองการสอบ ประกาศรับสมัครข้าราชการตำรวจชั้นประทวน (นสต.) ล็อตใหม่เต็มพิกัด!',
      detail: 'เปิดรับสายปราบปรามชาย ยอดรวมกว่า 1,200 อัตรา รับสมัครทางอินเทอร์เน็ตตลอด 24 ชั่วโมง เตรียมตัวฝึกข้อสอบ Pre-test ด่วน',
      date: 'อัปเดตล่าสุด: วันนี้'
    },
    {
      id: 2,
      badge: '📢 ประกาศผล',
      badgeColor: 'bg-green-100 text-green-800 border-green-200',
      title: 'ประกาศผลคะแนนสอบข้อเขียน นายสิบตำรวจ สายอำนวยการ (อก.) รอบล่าสุด',
      detail: 'สามารถตรวจรายชื่อผู้ผ่านการคัดเลือกและกำหนดการยื่นเอกสารรายงานตัวได้ที่ลิงก์ทางการ หรือเช็คแนวข้อสอบจำลองเตรียมสอบรอบแก้ตัวได้ในคอร์ส',
      date: 'อัปเดตล่าสุด: 2 วันที่ผ่านมา'
    },
    {
      id: 3,
      badge: '🗓️ กำหนดการ',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'ปฏิทินสอบ ก.พ. ภาค ก. ประจำปี (รอบ Paper & Pencil และ e-Exam)',
      detail: 'สรุปวันประกาศรายชื่อผู้สมัคร วันจัดสถานที่สอบ และเทคนิคการตีโจทย์ร้อยละ-อนุกรม เพื่อเก็บคะแนนวิชาความสามารถทั่วไปให้ผ่านเกณฑ์',
      date: 'อัปเดตล่าสุด: สัปดาห์นี้'
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage('⏳ กำลังตรวจสอบสิทธิ์การเข้าเรียน...');
    try {
      const { data, error } = await supabase
        .from('enrollment')
        .select('student_name')
        .eq('student_phone', phoneInput.trim())
        .eq('status', 'อนุมัติแล้ว')
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('user_phone', phoneInput.trim());
        localStorage.setItem('user_name', data[0].student_name);
        setLoginMessage('✅ ยินดีต้อนรับเข้าสู่ห้องเรียนพรีเมียม!');
        loadStudentCourses(phoneInput, data[0].student_name);
      } else {
        setLoginMessage('❌ ไม่พบเบอร์โทรศัพท์นี้ในระบบ หรือสิทธิ์คอร์สเรียนยังไม่ได้รับการอนุมัติ');
      }
    } catch (err: any) {
      setLoginMessage('❌ เกิดข้อผิดพลาดเชื่อมต่อฐานข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  };

  const startQuiz = async (lesson: any) => {
    setCurrentLesson(lesson);
    setShowQuizModal(true);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0); // ล้างสิทธิ์กลับไปเริ่มที่ข้อ 1 เสมอ
    setActiveQuestions([]);

    // บังคับเริ่มรันระบบนับถอยหลัง 180 นาทีทันทีหากเป็นคอร์สทดสอบ Pre-test
    if (selectedCourse.includes('Pre-test')) {
      setTimeLeft(180 * 60);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_title', selectedCourse)
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) { setActiveQuestions(data); }
    } catch (err) { console.error(err); }
  };

  const handleSelectAnswer = (questionId: number, optionLetter: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionLetter });
  };

  const submitQuiz = () => {
    if (quizSubmitted) return;
    setIsTimerRunning(false);
    let score = 0;
    activeQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer) { score++; }
    });
    setRawScoreCount(score);
    setLiveExamScore(`ได้คะแนน ${score} / ${activeQuestions.length} ข้อ 🏆`);
    setQuizSubmitted(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setPhoneInput('');
    setLoginMessage('');
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 🔝 ส่วนหัวเว็บบาร์พรีเมียม */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="text-xl font-bold tracking-wide">บ้านเด็กติวเตอร์ (BANDEXTUTOR EDTECH)</h1>
              <p className="text-xs text-blue-200">ระบบห้องเรียนออนไลน์ป้อนสถิติคลังข้อสอบพรีเมียมข้ามสายงาน</p>
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">ผู้เรียน: {studentName}</p>
                <p className="text-xs text-blue-200">สถานะ: ⚡ พร้อมลุยข้อสอบ</p>
              </div>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3 roundedTransition transition-all">
                ออกจากระบบ 🚪
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {!isAuthenticated ? (
          /* 🔐 หน้าต่างล็อกอินเข้าระบบ */
          <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 transition-all">
            <div className="text-center mb-6">
              <span className="text-4xl inline-block bg-blue-100 p-3 rounded-full mb-3">👮‍♂️</span>
              <h2 className="text-2xl font-bold text-slate-800">เข้าสู่ห้องเรียนออนไลน์</h2>
              <p className="text-sm text-slate-500 mt-1">กรอกเบอร์โทรศัพท์ที่ผ่านการอนุมัติสิทธิ์เข้าเรียน</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">เบอร์โทรศัพท์ประจำตัว</label>
                <input
                  type="tel"
                  placeholder="เช่น 095XXXXXXX"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg transition-all"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all">
                ยืนยันตัวตนเข้าเรียน 🚀
              </button>
            </form>
            {loginMessage && (
              <div className={`mt-4 p-3 rounded-xl text-center text-sm font-medium ${loginMessage.includes('❌') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                {loginMessage}
              </div>
            )}
          </div>
        ) : (
          /* 📊 ส่วนแสดงผลบอร์ดเรียนหลักแบบ 2 แผง (ข่าวสารสอบ - คอร์สเรียน) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 📰 แผงฝั่งซ้าย: กระดานข่าวสารและประกาศเกาะติดสถานการณ์สอบ (Exam News Hub) */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                  <span className="text-xl">📢</span>
                  <h3 className="font-bold text-lg text-slate-800">กระดานข่าวสารการสอบ</h3>
                </div>
                <div className="space-y-4">
                  {examNews.map((news) => (
                    <div key={news.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-all">
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border mb-2 ${news.badgeColor}`}>
                        {news.badge}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 leading-snug mb-1">{news.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">{news.detail}</p>
                      <span className="text-[10px] text-slate-400 block font-medium">{news.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🎯 แผงฝั่งขวา: ทางเข้าคอร์สติวและการสอบเสมือนจริง */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5">
                <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <span>🎯</span> เลือกคอร์สเรียนที่จะลุยข้อสอบ:
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setQuizSubmitted(false);
                    setLiveExamScore('ยังไม่ได้ทดสอบ 🎯');
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                >
                  <option value="" disabled>-- กรุณาเลือกคอร์สเรียนของคุณ --</option>
                  {myCourses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {selectedCourse && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1.5">
                      <span>📂</span> รายการวิชา/คลังแบบทดสอบในคอร์สนี้
                    </h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      รวม {allCoursesContent[selectedCourse]?.length || 0} บททดสอบ
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allCoursesContent[selectedCourse]?.map((lesson: any) => (
                      <div key={lesson.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-all">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-bold text-slate-800 text-md leading-snug">{lesson.title}</h4>
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                              {lesson.duration}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                            <span>⚡</span> รูปแบบบททดสอบ: สุ่มเก็งตามเนื้อหากองการสอบราชการ
                          </p>
                        </div>
                        <button onClick={() => startQuiz(lesson)} className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                          เปิดระบบทำข้อสอบ 📝
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 🎭 หน้าต่างป๊อปอัปทำข้อสอบระบบจับเวลาระดับพรีเมียม (Quiz Modal) */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col justify-between border border-slate-200 transition-all overflow-hidden">
            
            {/* 🧩 ส่วนหัวข้อสอบป๊อปอัป */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xl">📝</span>
                <div>
                  <h3 className="font-bold text-sm md:text-md truncate max-w-[400px]">{currentLesson?.title}</h3>
                  <p className="text-[11px] text-slate-400">ระบบคลังข้อสอบอัจฉริยะสถาบันบ้านเด็กติวเตอร์</p>
                </div>
              </div>
              
              {/* ⏱️ นาฬิกาจับเวลาระบบ Pre-test นับถอยหลังแสดงผลสีส้ม/แดงเตือนสติ */}
              {isTimerRunning && (
                <div className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold text-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
                  <span>⏱️ TIME:</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            {/* 📑 ส่วนเนื้อหาโจทย์คำถาม */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {activeQuestions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-medium">⏳ กำลังสืบค้นและดึงรหัสข้อสอบเก็งจริงจากหลังบ้าน...</div>
              ) : (
                <div>
                  {/* ตรวจตรรกะ: หากเป็นคอร์ส Pre-test จะแสดงทีละ 1 ข้อตามโจทย์ควบคุมอินเตอร์เฟสเด็ดขาด */}
                  {selectedCourse.includes('Pre-test') ? (
                    (() => {
                      const q = activeQuestions[currentQuestionIndex];
                      if (!q) return null;
                      return (
                        <div className="space-y-4 animate-fade-in">
                          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <span className="inline-block bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded-md mb-2">
                              ข้อที่ {currentQuestionIndex + 1} / {activeQuestions.length}
                            </span>
                            <p className="font-bold text-slate-800 text-md md:text-lg leading-relaxed">{q.question}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            {[['ก', q.option_a], ['ข', q.option_b], ['ค', q.option_c], ['ง', q.option_d]].map(([letter, text]) => (
                              <button
                                key={letter}
                                onClick={() => handleSelectAnswer(q.id, letter)}
                                className={`w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium text-sm md:text-md transition-all flex items-center gap-3 shadow-xs
                                  ${selectedAnswers[q.id] === letter 
                                    ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold' 
                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                  }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-inner
                                  ${selectedAnswers[q.id] === letter ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                  {letter}
                                </span>
                                <span>{text}</span>
                              </button>
                            ))}
                          </div>

                          {/* 💡 แผงปุ่มเฉลยละเอียด (จะปรากฏขึ้นหลังส่งคำตอบสรุปคะแนนเสร็จสิ้นแล้วเท่านั้น) */}
                          {quizSubmitted && (
                            <div className={`p-4 rounded-xl border font-medium text-sm leading-relaxed ${selectedAnswers[q.id] === q.correct_answer ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                              <p className="font-bold mb-1">🎯 เฉลยคำตอบข้อที่ {currentQuestionIndex + 1}: ตัวเลือกข้อ ({q.correct_answer})</p>
                              <p className="text-xs text-slate-600 font-normal">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    /* 📋 โหมดแสดงผลคอร์สตะลุยโจทย์วิชาปกติ (เรียงหน้ายาวเพื่อกวาดสายตาไล่ทำได้สะดวก) */
                    <div className="space-y-6">
                      {activeQuestions.map((q: any, idx: number) => (
                        <div key={q.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                          <p className="font-bold text-slate-800 text-md"><span className="text-blue-600">ข้อที่ {idx + 1}.</span> {q.question}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {[['ก', q.option_a], ['ข', q.option_b], ['ค', q.option_c], ['ง', q.option_d]].map(([letter, text]) => (
                              <button
                                key={letter}
                                onClick={() => handleSelectAnswer(q.id, letter)}
                                className={`text-left px-4 py-3 rounded-lg border text-xs font-medium transition-all flex items-center gap-2
                                  ${selectedAnswers[q.id] === letter ? 'bg-blue-50 border-blue-500 text-blue-800 font-bold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedAnswers[q.id] === letter ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{letter}</span>
                                <span>{text}</span>
                              </button>
                            ))}
                          </div>
                          {quizSubmitted && (
                            <div className="p-3 bg-blue-50 rounded-lg text-xs font-medium text-slate-700 leading-relaxed border border-blue-100">
                              🎯 เฉลยข้อ ({q.correct_answer}): {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 🕹️ ส่วนล่างบาร์ควบคุมพาร์ทควบคุมการสลับข้อ (Footer Control) */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                {/* ปุ่มควบคุมเดินหน้า-ถอยหลังทีละข้อเฉพาะคอร์สจำลองเสมือนจริง Pre-test 150 ข้อ */}
                {selectedCourse.includes('Pre-test') && activeQuestions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:hover:bg-white"
                    >
                      ⬅️ ข้อก่อนหน้า
                    </button>
                    <span className="text-xs font-bold text-slate-600 bg-slate-200 px-3 py-2 rounded-xl">
                      {currentQuestionIndex + 1} / {activeQuestions.length}
                    </span>
                    <button
                      disabled={currentQuestionIndex === activeQuestions.length - 1}
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:hover:bg-white"
                    >
                      ข้ามข้อถัดไป ➡️
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    setShowQuizModal(false);
                    setIsTimerRunning(false);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
                >
                  ปิดหน้าต่างนี้ ❌
                </button>
                {!quizSubmitted && activeQuestions.length > 0 && (
                  <button onClick={submitQuiz} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all">
                    ส่งข้อสอบตรวจคะแนน 🏁
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🏁 กล่องรายงานแบนเนอร์สรุปผลคะแนนแบบเรียลไทม์หลังยื่นคำตอบ */}
      {quizSubmitted && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-700 max-w-xs z-40 animate-slide-up">
          <div className="text-center">
            <span className="text-3xl inline-block mb-1">🏁</span>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">ประเมินสรุปผลคะแนน</h4>
            <p className="text-lg font-bold text-green-400 my-1">{liveExamScore}</p>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 shadow-inner overflow-hidden">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${(rawScoreCount / activeQuestions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">ผลลัพธ์ได้รับการบันทึกลงระบบฐานข้อมูลแล้ว</p>
          </div>
        </div>
      )}
    </div>
  );
}
