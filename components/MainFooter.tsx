"use client"

import Link from "next/link"

export default function MainFooter() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gradient">صحتي</h3>
                  <p className="text-gray-400">أسرع طريق لصحتك</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                منصة ذكية مدعومة بالذكاء الاصطناعي لتوجيهك إلى أفضل الرعاية الصحية المناسبة لحالتك. نجمع بين التقنية
                المتطورة والخبرة الطبية لخدمتك على مدار الساعة.
              </p>
            </div>

            
                  <main>
      {/* باقي الصفحة هنا */}

      {/* الفوتر */}
      <footer className="mt-10 p-6 border-t border-gray-700">
        <h4 className="text-lg font-semibold mb-4 text-gradient">روابط مهمة</h4>
        <ul className="space-y-2 text-gray-400">
          <li>
            <a href="/important-links/terms" className="hover:text-white transition-colors">
              الشروط والأحكام
            </a>
          </li>
          <li>
            <a href="/important-links/privacy" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </a>
          </li>
          <li>
            <a href="/important-links/disclaimer" className="hover:text-white transition-colors">
              إخلاء المسؤولية
            </a>
          </li>
          <li>
            <a href="/important-links/contact" className="hover:text-white transition-colors">
              اتصل بنا
            </a>
          </li>
        </ul>
      </footer>
    </main>
  

            <div>



              <h4 className="text-lg font-semibold mb-4 text-gradient">الدعم</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
            <a href="/support/HelpCenter" className="hover:text-white transition-colors">
              مركز المساعده
            </a>
          </li>
          <li>
            <a href="/support/FAQ" className="hover:text-white transition-colors">
              الاسأله الشائعه
            </a>
          </li>
          <li>
            <a href="/support/Reportissue" className="hover:text-white transition-colors">
              تقرير مشله
            </a>
          </li>
          <li>
            <a href="/support/Suggestions" className="hover:text-white transition-colors">
              اقتراحات
            </a>
          </li>
              </ul>
              <div className="mt-6 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-sm">دعم ٢٤/٧</span>
                </div>
                <p className="text-xs text-gray-400">نحن هنا لمساعدتك في أي وقت</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">&copy; ٢٠٢٥ صحتي. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">

            </div>
          </div>
        </div>
      </footer>
  )
}
