import { NextRequest, NextResponse } from "next/server";
import { authClient } from "@/lib/auth-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim();

    if (!email) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب" },
        { status: 400 }
      );
    }

    const result = await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
    if (result?.error) {
      const msg = result.error?.message ?? "فشل في إرسال رمز التحقق";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json(
      { success: true, message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("resend-otp: unexpected error:", err);
    const message = err?.message ?? "حدث خطأ أثناء معالجة الطلب";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
