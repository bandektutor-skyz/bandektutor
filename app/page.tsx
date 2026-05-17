'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  // 📰 คลังข้อมูลข่าวสารเกาะติดสถานการณ์สอบ (Exam News Hub) แสดงผลหน้าแรก
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
      badge: '🗓️ 定กำหนดการ',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'ปฏิทินสอบ ก.พ. ภาค ก. ประจำปี (รอบ Paper & Pencil และ e-Exam)',
      detail: 'สรุปวันประกาศรายชื่อผู้สมัคร วันจัดสถานที่สอบ และเทคนิคการตีโจทย์ร้อยละ-อนุกรม เพื่อเก็บคะแนนวิชาความสามารถทั่วไปให้ผ่านเกณฑ์',
      date: 'อัปเดตล่าสุด: สัปดาห์นี้'
    }
  ];

  // 🛍️ รายการการ์ดสินค้าคอร์สเรียนและ Pre-test อัปเกรดใหม่ (เน้น Pure Test Engine ไม่มีวิดีโอ)
  const featuredCourses = [
    {
      id: 'gov-part-a',
      badge: 'มาใหม่ 📝',
      badgeColor: 'text-red-600 bg-red-50 border-red-100',
      title: 'คอร์สลุยข้อสอบ ก.พ. ภาค ก. (บททดสอบแยกตามหัวข้อ)',
      description: 'ตะลุยคลังโจทย์ประยุกต์หนาแน่นแยกตามหัวข้อวิชา ความสามารถทั่วไป ภาษาไทย ภาษาอังกฤษ และการเป็นข้าราชการที่ดี เพื่อความเสถียรแม่นยำในการสอบ',
      price: '1,590',
    },
    {
      id: 'police-nst-quiz',
      badge: 'แนะนำ 👮‍♂️',
      badgeColor: 'text-blue-600 bg-blue-50 border-blue-100',
      title: 'คอร์สลุยข้อสอบ นายสิบตำรวจ นสต. (ตะลุยโจทย์แยกรายวิชา)',
      description: 'เน้นเก็งข้อสอบจริง เจาะลึก 5 บททดสอบต่อหนึ่งรายวิชา วิชาละ 50 ข้อตัวฟูล ครบถ้วน 6 วิชาหลักปราบปราม ไร้วิดีโอกวนใจ โหลดไวเน้นทำโจทย์',
      price: '1,790',
    },
    {
      id: 'police-ok-quiz',
      badge: 'ติวเข้ม 💼',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-100',
      title: 'คอร์สลุยข้อสอบนายสิบตำรวจ อก. (ตะลุยโจทย์แยกรายวิชา)',
      description: 'หลักสูตรตะลุยโจทย์สำหรับสายธุรการและสารบรรณโดยเฉพาะ วิชาละ 5 บททดสอบจุใจ พร้อมเพิ่มคลังข้อสอบวิชาระเบียบงานสารบรรณ พ.ศ. 2526 ตัวอัปเดตล่าสุด',
      price: '1,690',
    },
    {
      id: 'pretest-nst',
      badge: 'ม็อคเสมือนจริง 🏆',
      badgeColor: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: 'คอร์ส Pre-test ข้อสอบเสมือนจริง นสต. (จับเวลา 180 นาที)',
      description: 'ระบบ Pure Test Engine จำลองสนามสอบจริง 5 ชุดข้อสอบ ชุดละ 150 ข้อเต็ม มีนาฬิกานับถอยหลัง 3 ชั่วโมง กดย้อนกลับ-เดินหน้าข้ามข้อสอบได้อิสระ พร้อมสรุปคะแนนทันที',
      price: '1,990',
    },
    {
      id: 'pretest-ok',
      badge: 'สอบเสมือนจริง 🏅',
      badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      title: 'คอร์ส Pre-test ข้อสอบเสมือนจริง อก. (จับเวลา 180 นาที)',
      description: 'แบบทดสอบม็อคเอ็กแซมฟูลสเกล 5 ชุดจัดเต็ม สัดส่วนข้อสอบ 150 ข้อตรงตามเกณฑ์กองการสอบสายอำนวยการ ควบคุมเวลา 180 นาทีเสมือนนั่งในห้องสอบจริง',
      price: '1,890',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 🚀 ฮีโร่แบนเนอร์ด้านบนสุดสง่างาม */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white text-center py-16 px-4 shadow-inner relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            สานฝันเส้นทางข้าราชการและผู้พิทักษ์สันติราษฎร์
          </h2>
          <p className="text-sm md:text-lg text-blue-100 font-light max-w-2xl mx-auto">
            เตรียมพร้อมให้เหนือกว่าด้วยคลังข้อสอบจำลองเสมือนจริง และระบบจับเวลาอัจฉริยะ 180 นาที เพื่อสถิติผลสัมฤทธิ์สูงสุดในการสอบราชการ
          </p>
          <div className="pt-2">
            <Link href="/classroom" className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-all text-sm">
              เข้าสู่ระบบห้องเรียนหลังบ้าน 🎓
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent z-0"></div>
      </div>

      {/* 📊 เนื้อหาหลักจัดระเบียบ 2 แผงคู่ขนาน (แผงข่าวสารซ้าย - แผงคอร์สขวา) */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* 📰 แผงฝั่งซ้าย: ข่าวสารการสอบเกาะติดสถานการณ์ (Exam News Hub) */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                <span className="text-xl">📰</span>
                <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">เกาะติดข่าวสารการสอบ</h3>
              </div>
              <div className="space-y-4">
                {examNews.map((news) => (
                  <div key={news.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-xs hover:shadow-sm transition-all">
                    <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border mb-2 uppercase tracking-wider ${news.badgeColor}`}>
                      {news.badge}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 leading-snug mb-1">{news.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2.5">{news.detail}</p>
                    <span className="text-[10px] text-slate-400 block font-semibold">{news.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🛍️ แผงฝั่งขวา: รายการการ์ดสินค้าคอร์สเรียนที่เปิดรับสมัครพร้อมปุ่มกด */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 px-2 mb-2">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>🎯</span> คอร์สติวสอบราชการและตำรวจยอดนิยม
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">เลือกคอร์สที่ต้องการสมัครเพื่อเปิดสิทธิ์ลุยข้อสอบในระบบได้ทันที</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-col justify-between hover:shadow-md transition-all relative group overflow-hidden">
                  <div>
                    <div className="mb-3">
                      <span className={`inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-md border tracking-wide uppercase ${course.badgeColor}`}>
                        {course.badge}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-lg leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal mb-6">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">ราคาคอร์ส</span>
                      <span className="text-xl font-black text-slate-900">฿{course.price}</span>
                    </div>
                    <Link 
                      href="/classroom" 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                    >
                      สมัครเรียนเลย 🚀
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 👣 ฟุตเตอร์ส่วนท้ายเว็บบางเบาสวยงาม */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-6 text-center text-xs text-slate-400 font-medium">
        <p>© 2026 บ้านเด็กติวเตอร์ (BANDEXTUTOR). All Rights Reserved. ระบบเตรียมสอบราชการอัจฉริยะ</p>
      </footer>
    </div>
  );
}
