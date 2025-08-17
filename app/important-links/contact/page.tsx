"use client"


import Link from "next/link"
import MainFooter from "@/components/MainFooter";

export default function ContactPage() {
  return (
    <>
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white p-8">
  <div className="max-w-4xl w-full rounded-lg shadow-lg bg-teal-900/50 p-8 leading-relaxed">
      <h1 className="text-4xl font-bold mb-6 text-green-400 border-b border-green-500 pb-2 text-center">
      اتصل بنا
      </h1>
      <p className="text-gray-600 leading-relaxed mb-6 text-center">
        يمكنك التواصل معنا من خلال تعبئة النموذج أدناه أو عبر البريد الإلكتروني.
      </p>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="الاسم"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <textarea
          placeholder="رسالتك"
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="w-full cursor-pointer bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
        >
          إرسال
        </button>
      </form>
      </div>
    </main>
    <MainFooter/>
    </>
  );
}
