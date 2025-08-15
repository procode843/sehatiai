
import type { Metadata } from "next";
import Link from "next/link"
import MainFooter from "@/components/MainFooter";

export const metadata: Metadata = {
  title: "سياسة الخصوصية - صحتي",
  description: "تعرف على كيفية جمع واستخدام وحماية بياناتك على منصة صحتي.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white p-8">
  <div className="max-w-4xl w-full rounded-lg shadow-lg bg-teal-900/50 p-8 leading-relaxed">
    <h1 className="text-4xl font-bold mb-6 text-green-400 border-b border-green-500 pb-2 text-center">
      سياسة الخصوصية
    </h1>

    <p className="mb-4 text-gray-200 text-center">
      في <span className="font-semibold text-green-300">صحتي</span>، نحترم خصوصيتك
      ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نقوم بجمع واستخدام وحماية معلوماتك
      عند استخدام منصتنا.
    </p>

    <h2 className="text-2xl font-semibold mt-8 mb-3 text-green-300">١. المعلومات التي نجمعها</h2>
    <ul className="list-disc pr-6 space-y-2 text-gray-200">
      <li>الاسم، البريد الإلكتروني، ورقم الهاتف عند التسجيل.</li>
      <li>بيانات الاستخدام مثل الصفحات التي تزورها والمزايا التي تستخدمها.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-8 mb-3 text-green-300">٢. كيفية استخدامنا للمعلومات</h2>
    <p className="mb-4 text-gray-200">نستخدم معلوماتك للأغراض التالية:</p>
    <ul className="list-disc pr-6 space-y-2 text-gray-200">
      <li>تحسين تجربة استخدامك وتخصيص المحتوى والخدمات المقدمة لك.</li>
      <li>توصيلك بأفضل المستشفيات والأطباء المناسبين لحالتك.</li>
      <li>إرسال إشعارات أو تحديثات متعلقة بالخدمة.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-8 mb-3 text-green-300">٣. حماية البيانات</h2>
    <p className="text-gray-200">
      نستخدم أحدث وسائل الحماية التقنية والتنظيمية لضمان أمان بياناتك ومنع الوصول غير المصرح به إليها.
    </p>

    <h2 className="text-2xl font-semibold mt-8 mb-3 text-green-300">٤. مشاركة البيانات</h2>
    <p className="text-gray-200">
      لا نقوم ببيع أو مشاركة بياناتك مع أي طرف ثالث إلا بإذن منك أو للامتثال للقوانين المعمول بها.
    </p>

    <h2 className="text-2xl font-semibold mt-8 mb-3 text-green-300">٥. حقوقك</h2>
    <ul className="list-disc pr-6 space-y-2 text-gray-200">
      <li>الوصول إلى بياناتك وطلب نسخة منها.</li>
      <li>طلب تعديل أو حذف بياناتك.</li>
      <li>سحب الموافقة على معالجة بياناتك.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-8 mb-3 text-green-300">٦. التغييرات على هذه السياسة</h2>
    <p className="text-gray-200">
      قد نقوم بتحديث هذه السياسة من وقت لآخر، وسيتم نشر أي تحديثات على هذه الصفحة.
    </p>

    <p className="mt-8 text-sm text-gray-400 border-t border-gray-600 pt-4 text-center">
      إذا كانت لديك أي أسئلة بخصوص هذه السياسة، يمكنك التواصل معنا عبر صفحة{" "}
      <a href="/important-links/contact" className="text-blue-400 hover:underline">
        تواصل معنا
      </a>
      .
    </p>
  </div>
</main>


    <MainFooter/>
    </>
  );
}
