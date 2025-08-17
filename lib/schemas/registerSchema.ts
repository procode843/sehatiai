import { z } from "zod";

export const userGender = ["male", "female"] as const;

export const registerSchema = z.object({
  name: z.string().min(1, { message: "الاسم بالكامل مطلوب" }),

  email: z.string().email(),

  dateOfBirth: z.string().min(1, { message: "تاريخ الميلاد مطلوب" }),
  gender: z.enum(userGender, { message: "اختر الجنس" }),

  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  confirmPassword: z.string().min(1, { message: "تأكيد كلمة المرور مطلوب" }),

  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "يجب الموافقة على شروط الاستخدام" }),
  }),
  agreeToPrivacy: z.literal(true, {
    errorMap: () => ({ message: "يجب الموافقة على سياسة الخصوصية" }),
  }),
});

// Export inferred TypeScript type for the form
export type RegisterFormValues = z.infer<typeof registerSchema>;
