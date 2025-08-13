import type { MedicalProfileData } from "../schemas"

interface Suggestion {
  id: string
  title_ar: string
  type: "specialist" | "service" | "test"
  score: number
  reasons: string[]
  urgent?: boolean
}

// Client-side suggestion generator (simulates AI recommendations)
export function generateSupporters(data: MedicalProfileData): Suggestion[] {
  const suggestions: Suggestion[] = []

  // Age-based suggestions
  const age = calculateAge(data.basicInfo?.dateOfBirth)
  if (age) {
    if (age > 40) {
      suggestions.push({
        id: "cardio-checkup",
        title_ar: "فحص القلب الدوري",
        type: "test",
        score: 85,
        reasons: ["العمر فوق 40 سنة", "الوقاية من أمراض القلب"],
        urgent: false,
      })
    }

    if (age > 50) {
      suggestions.push({
        id: "oncology-screening",
        title_ar: "فحص الكشف المبكر للسرطان",
        type: "test",
        score: 90,
        reasons: ["العمر فوق 50 سنة", "الفحص الدوري الموصى به"],
        urgent: false,
      })
    }
  }

  // Condition-based suggestions
  if (data.conditions?.currentConditions) {
    data.conditions.currentConditions.forEach((condition) => {
      if (condition.name.toLowerCase().includes("سكري")) {
        suggestions.push({
          id: "endocrinologist",
          title_ar: "طبيب غدد صماء",
          type: "specialist",
          score: 95,
          reasons: ["لديك تشخيص بالسكري", "متابعة متخصصة مطلوبة"],
          urgent: condition.severity === "شديد",
        })

        suggestions.push({
          id: "hba1c-test",
          title_ar: "فحص السكر التراكمي (HbA1c)",
          type: "test",
          score: 90,
          reasons: ["مراقبة مستوى السكر", "فحص دوري كل 3 أشهر"],
          urgent: false,
        })
      }

      if (condition.name.toLowerCase().includes("ضغط")) {
        suggestions.push({
          id: "cardiologist",
          title_ar: "طبيب قلب",
          type: "specialist",
          score: 88,
          reasons: ["لديك مشاكل في ضغط الدم", "تقييم صحة القلب"],
          urgent: condition.severity === "شديد",
        })
      }

      if (condition.name.toLowerCase().includes("ربو")) {
        suggestions.push({
          id: "pulmonologist",
          title_ar: "طبيب صدرية",
          type: "specialist",
          score: 92,
          reasons: ["لديك تشخيص بالربو", "متابعة وظائف الرئة"],
          urgent: condition.severity === "شديد",
        })
      }
    })
  }

  // Medication-based suggestions
  if (data.medications?.currentMedications) {
    const hasMultipleMeds = data.medications.currentMedications.length > 5
    if (hasMultipleMeds) {
      suggestions.push({
        id: "pharmacist-consultation",
        title_ar: "استشارة صيدلاني",
        type: "service",
        score: 80,
        reasons: ["تتناول عدة أدوية", "مراجعة التفاعلات الدوائية"],
        urgent: false,
      })
    }
  }

  // Allergy-based suggestions
  if (data.medications?.allergies?.some((allergy) => allergy.severity === "شديد")) {
    suggestions.push({
      id: "allergy-specialist",
      title_ar: "طبيب حساسية ومناعة",
      type: "specialist",
      score: 87,
      reasons: ["لديك حساسية شديدة", "تقييم شامل للحساسية"],
      urgent: true,
    })
  }

  // Family history suggestions
  if (data.conditions?.familyHistory) {
    const hasHeartDisease = data.conditions.familyHistory.some((history) =>
      history.condition.toLowerCase().includes("قلب"),
    )
    if (hasHeartDisease) {
      suggestions.push({
        id: "genetic-counseling",
        title_ar: "استشارة وراثية",
        type: "service",
        score: 75,
        reasons: ["تاريخ عائلي لأمراض القلب", "تقييم المخاطر الوراثية"],
        urgent: false,
      })
    }
  }

  // Gender-specific suggestions
  if (data.basicInfo?.gender === "female" && age && age > 40) {
    suggestions.push({
      id: "mammography",
      title_ar: "فحص الماموجرام",
      type: "test",
      score: 85,
      reasons: ["امرأة فوق 40 سنة", "الكشف المبكر لسرطان الثدي"],
      urgent: false,
    })
  }

  // BMI-based suggestions
  if (data.vitals?.height && data.vitals?.weight) {
    const bmi = calculateBMI(data.vitals.height, data.vitals.weight)
    if (bmi > 30) {
      suggestions.push({
        id: "nutritionist",
        title_ar: "أخصائي تغذية",
        type: "specialist",
        score: 82,
        reasons: ["مؤشر كتلة الجسم مرتفع", "وضع خطة غذائية صحية"],
        urgent: false,
      })
    }
  }

  // Remove duplicates and sort by score
  const uniqueSuggestions = suggestions.filter(
    (suggestion, index, self) => index === self.findIndex((s) => s.id === suggestion.id),
  )

  return uniqueSuggestions.sort((a, b) => b.score - a.score).slice(0, 6)
}

function calculateAge(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function calculateBMI(height: string, weight: string): number {
  const heightInMeters = Number.parseFloat(height) / 100
  const weightInKg = Number.parseFloat(weight)
  return weightInKg / (heightInMeters * heightInMeters)
}
