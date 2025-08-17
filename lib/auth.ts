import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Sehatai <onboarding@resend.dev>",
          to: [email],
          subject: "رمز التحقق - صحتي | Sehatai Verification Code",
          html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">صحتي</h1>
                    <p style="color: white; margin: 5px 0;">أسرع طريق لصحتك</p>
                  </div>
                  
                  <div style="padding: 30px; background: #f8fafc;">
                    <h2 style="color: #1e293b; margin-bottom: 20px;">رمز التحقق من البريد الإلكتروني</h2>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                      مرحباً،
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                      استخدم الرمز التالي للتحقق من بريدك الإلكتروني:
                    </p>
                    
                    <div style="background: white; border: 2px solid #0891b2; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                      <span style="font-size: 32px; font-weight: bold; color: #0891b2; letter-spacing: 4px;">${otp}</span>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px;">
                      هذا الرمز صالح لمدة 10 دقائق فقط. إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة.
                    </p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #64748b; font-size: 12px; text-align: center;">
                        © 2024 صحتي - جميع الحقوق محفوظة
                      </p>
                    </div>
                  </div>
                </div>
              `,
        });
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
