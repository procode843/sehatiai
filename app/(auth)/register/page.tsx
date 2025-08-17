"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Mail } from "lucide-react";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/schemas/registerSchema";

import OTPVerification from "../_components/OTPVerification";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // step state: 'register' | 'otp'
  const [step, setStep] = useState<"register" | "otp">("register");
  const [otpContact, setOtpContact] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      confirmPassword: "",
    },
  });

  const handleBackToRegister = () => {
    setStep("register");
    setFormError("");
  };

  const handleOTPVerified = () => {
    // After email OTP verified, redirect (or login)
    router.push("/profile/medical");
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setFormError("");
    try {
      const result = await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            toast.success("تم التسجيل سيتم نقلك الى تفعل البريد الالكتروني");
          },
        }
      );

      
      if (result?.error) {
        setFormError(result.error.message || "فشل في إنشاء الحساب");
        return;
      }

      await authClient.emailOtp.sendVerificationOtp({ email: data.email, type: "email-verification" });

      const { confirmPassword, ...toSave } = data;
      localStorage.setItem("registrationData", JSON.stringify(toSave));

      // proceed to OTP verification for email
      setOtpContact(data.email);
      setStep("otp");
    } catch (err: any) {
      console.error("register error:", err);
      setFormError(err?.message || "حدث خطأ أثناء إنشاء الحساب");
    }
  };

  // OTP step UI (email)
  if (step === "otp") {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/images/sehati-logo.png"
                alt="صحتي"
                width={120}
                height={120}
                className="mx-auto mb-4"
              />
            </Link>
          </div>

          <OTPVerification
            contact={otpContact}
            onVerified={handleOTPVerified}
            onBack={handleBackToRegister}
          />
        </div>
      </div>
    );
  }

  // Register form UI (email-only)
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/sehati-logo.png"
              alt="صحتي"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            انضم إلى صحتي
          </h1>
          <p className="text-gray-600">أنشئ حسابك للبدء في رحلة صحية أفضل</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              إنشاء حساب جديد
            </CardTitle>
            <CardDescription className="text-center">
              املأ البيانات التالية لإنشاء حسابك
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Name Fields */}
              <div className="space-y-2">
                <Label htmlFor="name">الاسم بالكامل</Label>
                <Input id="name" {...register("name")} className="text-right" />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="example@gmail.com"
                    className="text-right"
                    inputMode="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">الجنس</Label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">ذكر</SelectItem>
                          <SelectItem value="female">أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="text-right pr-10"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="text-right pr-10"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword ? "إخفاء التأكيد" : "إظهار التأكيد"
                    }
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  {formError}
                </div>
              )}

              {/* Terms and Privacy */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 ">
                  <Controller
                    control={control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(v as boolean)}
                      />
                    )}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    أوافق على{" "}
                    <Link
                      href="/terms"
                      className="text-teal-600 hover:underline"
                    >
                      شروط الاستخدام
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.agreeToTerms.message}
                  </p>
                )}

                <div className="flex items-center space-x-2 ">
                  <Controller
                    control={control}
                    name="agreeToPrivacy"
                    render={({ field }) => (
                      <Checkbox
                        id="privacy"
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(v as boolean)}
                      />
                    )}
                  />
                  <Label htmlFor="privacy" className="text-sm">
                    أوافق على{" "}
                    <Link
                      href="/privacy"
                      className="text-teal-600 hover:underline"
                    >
                      سياسة الخصوصية
                    </Link>
                  </Label>
                </div>
                {errors.agreeToPrivacy && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.agreeToPrivacy.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link
                  href="/login"
                  className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
