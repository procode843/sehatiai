import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className=" mb-[0px] h-[13vh] top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200" dir="rtl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* الشعار والعنوان */}
          <div className="flex items-center gap-3">
            <a href="/">
              <Image
                src="/images/sehati-logo.png"
                alt="صحتي"
                width={50}
                height={50}
                className="rounded-lg"
              />
            </a>
            <div>
              <h1 className="text-2xl font-bold text-gradient">صحتي</h1>
              <p className="text-sm text-teal-600">أسرع طريق لصحتك</p>
            </div>
          </div>

          {/* الروابط */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-700 hover:text-teal-600 transition-colors">
              الرئيسية
            </a>
            <a href="/login">
              <Button className="bg-teal-600 hover:bg-teal-700">ابدأ الآن</Button>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
