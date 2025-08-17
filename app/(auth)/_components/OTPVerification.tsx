"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, RefreshCw, Router } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface OTPVerificationProps {
  contact: string;
  onVerified: () => void;
  onBack: () => void;
}

export function OTPVerification({
  contact,
  onVerified,
  onBack,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const intervalRef = useRef<number | null>(null);

  // start/ reset countdown when contact/type changes
  useEffect(() => {
    setOtp("");
    setError("");
    setCanResend(false);
    setCountdown(60);

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [contact]);

  // helper to extract error message from different shapes
  const extractErrorMessage = (err: any) => {
    if (!err) return "حدث خطأ غير متوقع";
    if (typeof err === "string") return err;
    if (err?.message) return err.message;
    if (err?.error?.message) return err.error.message;
    if (err?.data?.error) return err.data.error;
    return "حدث خطأ";
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const code = otp.trim();
    if (!/^\d{6}$/.test(code)) {
      setError("الرجاء إدخال رمز مكون من 6 أرقام");
      return;
    }

    if (!contact) {
      setError("لا يوجد جهة اتصال للتحقق");
      return;
    }

    setIsVerifying(true);

    try {
      await authClient.emailOtp.verifyEmail({
        email: contact,
        otp: code,
      });

      // If we reach here assume success
      onVerified();
    } catch (err: any) {
      console.error("OTP verify error:", err);
      setError(extractErrorMessage(err) || "حدث خطأ أثناء التحقق");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    if (!contact) {
      setError("لا يوجد جهة اتصال لإعادة الإرسال");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      // Prefer client SDK send methods when available (defensive)
      let handled = false;

      const res = await authClient.emailOtp.sendVerificationOtp({
        type: "email-verification",
        email: contact,
      });
      if (res?.error) throw res.error;
      handled = true;

      if (!handled) {
        const res = await fetch("/api/auth/resend-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: contact }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw json || new Error("فشل في إرسال الرمز");
      }

      setOtp("");
      setCanResend(false);
      setCountdown(60);

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      intervalRef.current = window.setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setCanResend(true);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("OTP resend error:", err);
      setError(extractErrorMessage(err) || "حدث خطأ أثناء إرسال الرمز");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-center">
          التحقق من بريدك الالكتروني
        </CardTitle>
        <CardDescription className="text-center">
          تم إرسال رمز التحقق إلى {contact}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex items-center space-y-2 flex-col">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="flex items-center gap-2"
              dir="ltr"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <p className="text-sm text-muted-foreground">
              أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك الالكتروني
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              "تحقق من الرمز"
            )}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">لم تستلم الرمز؟</p>

          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={!canResend || isResending}
            className="text-teal-600 hover:text-teal-700"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                جاري الإرسال...
              </>
            ) : canResend ? (
              "إعادة إرسال الرمز"
            ) : (
              `إعادة الإرسال خلال ${countdown}s`
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={onBack}
          className="w-full bg-transparent"
        >
          العودة
        </Button>
      </CardContent>
    </Card>
  );
}

export default OTPVerification;
