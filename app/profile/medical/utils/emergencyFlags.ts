import type { MedicalProfileData } from "../schemas"

// Emergency flag detection rules (client-side only)
const EMERGENCY_RULES = {
  // High-risk conditions
  highRiskConditions: ["نوبة قلبية", "سكتة دماغية", "جلطة", "نزيف", "صعوبة في التنفس", "ألم في الصدر", "فقدان الوعي"],

  // Critical medication combinations
  criticalMedications: ["وارفارين", "هيبارين", "أنسولين"],

  // Severe allergies
  severeAllergies: ["شديد"],

  // Vital signs thresholds
  vitalsThresholds: {
    highBP: 180, // systolic
    lowBP: 90, // systolic
    highWeight: 150, // kg
    lowWeight: 40, // kg
  },
}

export function checkEmergencyFlags(data: MedicalProfileData): string[] {
  const flags: string[] = []

  // Check current conditions
  if (data.conditions?.currentConditions) {
    data.conditions.currentConditions.forEach((condition) => {
      if (
        EMERGENCY_RULES.highRiskConditions.some((risk) => condition.name.toLowerCase().includes(risk.toLowerCase()))
      ) {
        flags.push(`حالة طبية عالية الخطورة: ${condition.name}`)
      }

      if (condition.severity === "شديد") {
        flags.push(`حالة شديدة تتطلب متابعة: ${condition.name}`)
      }
    })
  }

  // Check medications
  if (data.medications?.currentMedications) {
    data.medications.currentMedications.forEach((medication) => {
      if (
        EMERGENCY_RULES.criticalMedications.some((critical) =>
          medication.name.toLowerCase().includes(critical.toLowerCase()),
        )
      ) {
        flags.push(`دواء يتطلب مراقبة دقيقة: ${medication.name}`)
      }
    })
  }

  // Check severe allergies
  if (data.medications?.allergies) {
    data.medications.allergies.forEach((allergy) => {
      if (allergy.severity === "شديد") {
        flags.push(`حساسية شديدة: ${allergy.allergen}`)
      }
    })
  }

  // Check vital signs
  if (data.vitals?.weight) {
    const weight = Number.parseFloat(data.vitals.weight)
    if (weight > EMERGENCY_RULES.vitalsThresholds.highWeight) {
      flags.push("وزن مرتفع يتطلب متابعة طبية")
    } else if (weight < EMERGENCY_RULES.vitalsThresholds.lowWeight) {
      flags.push("وزن منخفض يتطلب تقييم طبي")
    }
  }

  return flags
}
