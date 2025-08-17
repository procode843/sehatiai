"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

import { loginSchema, type LoginFormValues } from "@/lib/schemas/loginSchema";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFormError("");
    try {
      await authClient.signIn.email({
        ...data
      }, {
        onSuccess: () => router.push("/search")
      })
    } catch (err: any) {
      console.error("signin error:", err);
      // prefer readable message if available
      const msg = err?.message ?? err?.error?.message ?? "فشل في تسجيل الدخول — تحقق من بياناتك";
      setFormError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4" dir="rtl">
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
            <CardDescription className="text-center">سجّل دخولك باستخدام البريد الإلكتروني</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" {...register("email")} placeholder="example@email.com" className="text-right" inputMode="email" />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} {...register("password")} className="text-right pr-10" />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  {formError}
                </div>
              )}

              {/* Forgot Password */}
              <div className="text-left">
                <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">نسيت كلمة المرور؟</Link>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5" disabled={isSubmitting || !isValid}>
                {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
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
                <Link href="/register" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">إنشاء حساب جديد</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">العودة إلى الصفحة الرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
