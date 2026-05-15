"use client";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// ข้อสอบจำลองระบบสำรอง (Fallback) หากฐานข้อมูลยังไม่ส่งค่ากลับมา
const sampleQuestions = [
  {
    id: 1,
    question_text: "ตาม พ.ร.บ. ระเบียบบริหารราชการแผ่นดิน การจัดตั้ง กระทรวง ทบวง กรม ต้องตราเป็นกฎหมายใด?",
    choice_a: "พระราชกำหนด (พ.ร.ก.)",
    choice_b: "พระราชบัญญัติ (พ.ร.บ.)",
    choice_c: "พระราชกฤษฎีกา (พ.ร.ฎ.)",
    choice_d: "กฎกระทรวง",
    correct_choice: "choice_b",
    explanation: "การจัดตั้ง การรวม หรือการโอนกระทรวง ทบวง กรม ให้ตราเป็นพระราชบัญญัติ (พ.ร.บ.)"
  }
];

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        // ทดลองดึงข้อมูลจริงจาก Supabase
        const { data, error } = await supabase.from("questions").select("*");
        if (error || !data || data.length === 0) {
          setQuestions(sampleQuestions);
        } else {
          setQuestions(data);
        }
      } catch (err) {
        setQuestions(sampleQuestions);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const handleAnswerClick = (choiceKey) => {
    setSelectedAnswer(choiceKey);
    setShowAnswer(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <header className="w-full max-w-2xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">bandektutor</h1>
        <p className="text-gray-600 font-medium">ระบบคลังข้อสอบเตรียมสอบราชการอัจฉริยะ</p>
      </header>

      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
        {loading ? (
          <p className="text-center text-gray-500 py-8">กำลังโหลดคลังข้อสอบ...</p>
        ) : (
          <div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded mb-4 inline-block">
              แนวข้อสอบแนะนำประจำวัน
            </span>
            {questions.map((q, index) => (
              <div key={q.id || index} className="mb-6">
                <p className="text-lg font-medium text-gray-900 mb-4">{index + 1}. {q.question_text}</p>
                
                {/* รายการช้อยส์ข้อสอบ */}
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { key: 'choice_a', text: q.choice_a },
                    { key: 'choice_b', text: q.choice_b },
                    { key: 'choice_c', text: q.choice_c },
                    { key: 'choice_d', text: q.choice_d }
                  ].map((choice) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border transition-all text-gray-700 font-medium ";
                    
                    if (showAnswer) {
                      if (choice.key === q.correct_choice) {
                        btnClass += "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm";
                      } else if (choice.key === selectedAnswer) {
                        btnClass += "bg-rose-50 border-rose-400 text-rose-700";
                      } else {
                        btnClass += "bg-gray-50 border-gray-200 opacity-60";
                      }
                    } else {
                      btnClass += "border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100";
                    }

                    return (
                      <button 
                        key={choice.key} 
                        disabled={showAnswer}
                        onClick={() => handleAnswerClick(choice.key)}
                        className={btnClass}
                      >
                        {choice.text}
                      </button>
                    );
                  })}
                </div>

                {/* กล่องแสดงผลเฉลยรายละเอียดหลังกดยืนยันคำตอบ */}
                {showAnswer && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="font-bold text-blue-900 mb-1">
                      {selectedAnswer === q.correct_choice ? "🎉 ตอบถูกต้อง!" : "❌ ตอบผิดนะครับ"}
                    </p>
                    <p className="text-sm text-gray-700"><span className="font-semibold">เฉลยละเอียด:</span> {q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
