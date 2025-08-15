"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Phone, Mail } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone")
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", formData)
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/images/sehati-logo.png" alt="صحتي" width={120} height={120} className="mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بعودتك</h1>
          <p className="text-gray-600">سجل دخولك للوصول إلى حسابك</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">اختر طريقة تسجيل الدخول المفضلة لديك</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Login Method Toggle */}
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "phone" ? "bg-white text-teal-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Phone className="w-4 h-4" />
                رقم الهاتف
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "email" ? "bg-white text-teal-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone/Email Input */}
              <div className="space-y-2">
                <Label htmlFor={loginMethod}>{loginMethod === "phone" ? "رقم الهاتف" : "البريد الإلكتروني"}</Label>
                <Input
                  id={loginMethod}
                  type={loginMethod === "phone" ? "tel" : "email"}
                  placeholder={loginMethod === "phone" ? "+201X XXXX XXXX" : "example@gmail.com"}
                  value={loginMethod === "phone" ? formData.phone : formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [loginMethod]: e.target.value,
                    }))
                  }
                  className="text-right"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="text-right pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-left">
                <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5">
                تسجيل الدخول
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">أو</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{" "}
                <Link href="/register" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
