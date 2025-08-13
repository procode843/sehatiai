import { z } from "zod"

const emergencyContactSchema = z.object({
  name: z.string().min(1, "اسم جهة الاتصال مطلوب"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  relationship: z.string().min(1, "العلاقة مطلوبة"),
})

const basicInfoSchema = z.object({
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "اسم العائلة مطلوب"),
  dateOfBirth: z.string().min(1, "تاريخ الميلاد مطلوب"),
  gender: z.string().min(1, "الجنس مطلوب"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional(),
  emergencyContact: emergencyContactSchema,
})

const conditionSchema = z.object({
  name: z.string().min(1, "اسم الحالة مطلوب"),
  diagnosedDate: z.string().optional(),
  severity: z.enum(["خفيف", "متوسط", "شديد"]).optional(),
  notes: z.string().optional(),
})

const conditionsSchema = z.object({
  currentConditions: z.array(conditionSchema),
  pastSurgeries: z.array(
    z.object({
      name: z.string().min(1, "اسم العملية مطلوب"),
      date: z.string().optional(),
      hospital: z.string().optional(),
      notes: z.string().optional(),
    }),
  ),
  familyHistory: z.array(
    z.object({
      condition: z.string().min(1, "الحالة مطلوبة"),
      relation: z.string().min(1, "القرابة مطلوبة"),
      notes: z.string().optional(),
    }),
  ),
})

const medicationSchema = z.object({
  name: z.string().min(1, "اسم الدواء مطلوب"),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  startDate: z.string().optional(),
  prescribedBy: z.string().optional(),
  notes: z.string().optional(),
})

const medicationsSchema = z.object({
  currentMedications: z.array(medicationSchema),
  allergies: z.array(
    z.object({
      allergen: z.string().min(1, "المادة المسببة للحساسية مطلوبة"),
      reaction: z.string().optional(),
      severity: z.enum(["خفيف", "متوسط", "شديد"]).optional(),
    }),
  ),
  supplements: z.array(
    z.object({
      name: z.string().min(1, "اسم المكمل مطلوب"),
      dosage: z.string().optional(),
      frequency: z.string().optional(),
    }),
  ),
})

const vitalsSchema = z.object({
  height: z.string().optional(),
  weight: z.string().optional(),
  bloodType: z.string().optional(),
  recentTests: z.array(
    z.object({
      testName: z.string().min(1, "اسم الفحص مطلوب"),
      date: z.string().optional(),
      result: z.string().optional(),
      normalRange: z.string().optional(),
      notes: z.string().optional(),
    }),
  ),
})

const doctorSchema = z.object({
  name: z.string().min(1, "اسم الطبيب مطلوب"),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  hospital: z.string().optional(),
})

const supportersSchema = z.object({
  primaryDoctor: doctorSchema,
  specialists: z.array(doctorSchema),
  preferredHospital: z.string().optional(),
})

export const medicalProfileSchema = z.object({
  basicInfo: basicInfoSchema,
  conditions: conditionsSchema,
  medications: medicationsSchema,
  vitals: vitalsSchema,
  supporters: supportersSchema,
})

export type MedicalProfileData = z.infer<typeof medicalProfileSchema>
