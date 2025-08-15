"use client"


import Link from "next/link"
import MainFooter from "@/components/MainFooter"

export default function Disclaimer(){
    return(

        <>
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white p-8">
  <div className="max-w-4xl w-full rounded-lg shadow-lg bg-teal-900/50 p-8 leading-relaxed">
        <h1 className="text-4xl font-bold mb-6 text-green-400 border-b border-green-500 pb-2 text-center">
      اخلاء المسؤوليات
    </h1>

    <p className="mb-4 text-gray-200 text-center">
      أهلاً بك في <strong className="text-green-300">صحتي AI</strong>. باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-green-300">١. التعريف بالخدمة</h2>
    <p className="mb-4 text-gray-200">
      موقع <strong className="text-green-300">صحتي AI</strong> يقدم معلومات عن أقرب المستشفيات، تقييماتها، وتوفير خاصية الذكاء الاصطناعي لاقتراح المستشفى الأنسب بناءً على حالتك.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-green-300">٢. دقة المعلومات</h2>
    <p className="mb-4 text-gray-200">
      نحن نسعى لتقديم معلومات دقيقة ومحدثة، لكن لا نضمن أن تكون جميع البيانات صحيحة أو كاملة في جميع الأوقات، خصوصًا إذا كانت مقدمة من أطراف خارجية مثل المستشفيات.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-green-300">٣. حدود المسؤولية</h2>
    <p className="mb-4 text-gray-200">
      لا يتحمل الموقع أو فريق العمل أي مسؤولية عن أي ضرر مباشر أو غير مباشر ينتج عن استخدامك للخدمة أو اعتمادك على المعلومات المقدمة.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-green-300">٤. الخصوصية</h2>
    <p className="mb-4 text-gray-200">
      نحن نحترم خصوصيتك ونلتزم بحماية بياناتك. أي معلومات شخصية يتم جمعها تُستخدم فقط لتحسين الخدمة ولا تُشارك مع أي طرف ثالث بدون إذنك المسبق.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-green-300">٥. التعديلات</h2>
    <p className="mb-4 text-gray-200">
      نحتفظ بالحق في تعديل أو تحديث هذه الشروط في أي وقت، وسيتم إشعارك بأي تغييرات عبر الموقع.
    </p>

    <h2 className="text-xl font-semibold mt-6 mb-2 text-green-300">٦. القوانين المعمول بها</h2>
    <p className="mb-4 text-gray-200">
      تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين جمهورية مصر العربية.
    </p>

    <p className="mt-8 text-sm text-gray-400 text-center">
      إذا كانت لديك أي أسئلة بخصوص هذه الشروط، يمكنك التواصل معنا عبر صفحة{" "}
      <a href="/important-links/contact" className="text-blue-400 hover:underline">
        تواصل معنا
      </a>
      .
    </p>
        </div>
    </main>
    <MainFooter/>
    </>
    )



}