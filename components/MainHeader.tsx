"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function MainHeader() {
  return (
    <header className="fixed h-[13vh] top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200" dir="rtl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"> <Link href="/">
              <Image src="/images/sehati-logo.png" alt="صحتي" width={50} height={50} className="rounded-lg" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gradient">صحتي</h1>
                <p className="text-sm text-teal-600">أسرع طريق لصحتك</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#vision" className="text-gray-700 hover:text-teal-600 transition-colors">
                الرؤية
              </Link>
              <Link href="#features" className="text-gray-700 hover:text-teal-600 transition-colors">
                المميزات
              </Link>
              <Link href="#technology" className="text-gray-700 hover:text-teal-600 transition-colors">
                التقنية
              </Link>
              <Link href="/login">

                <Button className="bg-teal-600 hover:bg-teal-700">ابدأ الآن</Button>
              </Link>
              
            </nav>
          </div>
        </div>
      </header>
  )
}
