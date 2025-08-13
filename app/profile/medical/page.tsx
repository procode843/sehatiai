"use client"

import React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowRight, User, Heart, Pill, Activity, Users, CheckCircle } from "lucide-react"
import { medicalProfileSchema, type MedicalProfileData } from "./schemas"
import { BasicInfoForm } from "./components/BasicInfoForm"
import { ConditionsForm } from "./components/ConditionsForm"
import { MedicationsForm } from "./components/MedicationsForm"
import { VitalsForm } from "./components/VitalsForm"
import { SupportersForm } from "./components/SupportersForm"
import { ReviewForm } from "./components/ReviewForm"
import { SupportersPanel } from "./components/SupportersPanel"
import { LocalDraftIndicator } from "./components/LocalDraftIndicator"
import { ExportButtons } from "./components/ExportButtons"
import { checkEmergencyFlags } from "./utils/emergencyFlags"
import { generateSupporters } from "./utils/supportersGenerator"

const STEPS = [
  {
    id: 1,
    title: "المعلومات الأساسية",
    description: "البيانات الشخصية والتواصل",
    icon: User,
  },
  {
    id: 2,
    title: "الحالات والتشخيصات",
    description: "الأمراض والحالات الطبية",
    icon: Heart,
  },
  {
    id: 3,
    title: "الأدوية والحساسية",
    description: "الأدوية الحالية والحساسية",
    icon: Pill,
  },
  {
    id: 4,
    title: "العلامات الحيوية والفحوصات",
    description: "القياسات والتحاليل",
    icon: Activity,
  },
  {
    id: 5,
    title: "الداعمون والاتصالات",
    description: "الأطباء وجهات الاتصال",
    icon: Users,
  },
  {
    id: 6,
    title: "المراجعة والحفظ",
    description: "مراجعة البيانات وحفظها",
    icon: CheckCircle,
  },
]

export default function MedicalProfilePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "draft">("draft")
  const [emergencyFlags, setEmergencyFlags] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])

  const getDefaultValues = useCallback(() => {
    const registrationData = localStorage.getItem("registrationData")
    let basicInfo = {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      emergencyContact: { name: "", phone: "", relationship: "" },
    }

    if (registrationData) {
      try {
        const regData = JSON.parse(registrationData)
        basicInfo = {
          firstName: regData.firstName || "",
          lastName: regData.lastName || "",
          dateOfBirth: regData.dateOfBirth || "",
          gender: regData.gender || "",
          phone: regData.phone || "",
          email: regData.email || "",
          emergencyContact: { name: "", phone: "", relationship: "" },
        }
      } catch (error) {
        console.error("Error parsing registration data:", error)
      }
    }

    return {
      basicInfo,
      conditions: {
        currentConditions: [],
        pastSurgeries: [],
        familyHistory: [],
      },
      medications: {
        currentMedications: [],
        allergies: [],
        supplements: [],
      },
      vitals: {
        height: "",
        weight: "",
        bloodType: "",
        recentTests: [],
      },
      supporters: {
        primaryDoctor: { name: "", specialty: "", phone: "", email: "" },
        specialists: [],
        preferredHospital: "",
      },
    }
  }, [])

  const methods = useForm<MedicalProfileData>({
    resolver: zodResolver(medicalProfileSchema),
    defaultValues: getDefaultValues(),
  })

  const { getValues } = methods

  useEffect(() => {
    const savedDraft = localStorage.getItem("medical-profile-draft")
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft)
        methods.reset(parsedDraft)
        setSaveStatus("draft")
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }, []) // Removed methods dependency to prevent infinite loop

  const saveToLocalStorage = useCallback(() => {
    setSaveStatus("saving")
    localStorage.setItem("medical-profile-draft", JSON.stringify(getValues()))
    setTimeout(() => setSaveStatus("saved"), 500)
  }, [getValues])

  const updateEmergencyFlags = useCallback(() => {
    const currentData = getValues()
    const flags = checkEmergencyFlags(currentData)
    setEmergencyFlags(flags)
  }, [getValues])

  const updateSuggestions = useCallback(() => {
    const currentData = getValues()
    const newSuggestions = generateSupporters(currentData)
    setSuggestions(newSuggestions)
  }, [getValues])

  useEffect(() => {
    const interval = setInterval(() => {
      saveToLocalStorage()
    }, 8000)

    return () => clearInterval(interval)
  }, [saveToLocalStorage])

  useEffect(() => {
    const subscription = methods.watch((data) => {
      // Debounce emergency flags and suggestions updates
      const timeoutId = setTimeout(() => {
        updateEmergencyFlags()
        updateSuggestions()
      }, 500)

      return () => clearTimeout(timeoutId)
    })

    return () => subscription.unsubscribe()
  }, [methods, updateEmergencyFlags, updateSuggestions])

  const handleStepChange = useCallback(
    (step: number) => {
      saveToLocalStorage()
      setCurrentStep(step)
    },
    [saveToLocalStorage],
  )

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length) {
      handleStepChange(currentStep + 1)
    }
  }, [currentStep, handleStepChange])

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      handleStepChange(currentStep - 1)
    }
  }, [currentStep, handleStepChange])

  const currentStepComponent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <BasicInfoForm />
      case 2:
        return <ConditionsForm />
      case 3:
        return <MedicationsForm />
      case 4:
        return <VitalsForm />
      case 5:
        return <SupportersForm />
      case 6:
        return <ReviewForm />
      default:
        return <BasicInfoForm />
    }
  }, [currentStep])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50" dir="rtl">
      {/* Emergency Banner */}
      {emergencyFlags.length > 0 && (
        <Alert className="mx-4 mt-4 border-red-500 bg-red-50 text-red-900 shadow-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-semibold">
            تحذير طبي: تم اكتشاف علامات تستدعي الانتباه الطبي الفوري
            <Button className="mr-4 bg-red-600 hover:bg-red-700 shadow-md" size="sm">
              اتصل بالطوارئ الآن
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الطبي الشخصي</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            أدخل معلوماتك الطبية بشكل آمن ومنظم لتحصل على أفضل رعاية صحية مخصصة لك
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                الخطوة {currentStep} من {STEPS.length}
              </span>
              <LocalDraftIndicator status={saveStatus} />
            </div>
            <Progress value={(currentStep / STEPS.length) * 100} className="mb-6 h-2" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {STEPS.map((step) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep

                return (
                  <div
                    key={step.id}
                    className={`text-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-teal-100 text-teal-700 border-2 border-teal-200"
                        : isCompleted
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mx-auto mb-2 ${
                        isActive ? "text-teal-600" : isCompleted ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                    <div className="text-xs font-medium hidden sm:block">{step.title}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm py-0">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg px-4 py-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {React.createElement(STEPS[currentStep - 1].icon, { className: "w-6 h-6" })}
                    <span>{STEPS[currentStep - 1].title}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {currentStep}/{STEPS.length}
                  </Badge>
                </CardTitle>
                <p className="text-teal-50 mt-0.5">{STEPS[currentStep - 1].description}</p>
              </CardHeader>
              <CardContent className="p-6">
                <FormProvider {...methods}>
                  <form className="space-y-6">{currentStepComponent}</form>
                </FormProvider>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 hover:bg-gray-50 bg-transparent"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    السابق
                  </Button>

                  {currentStep === STEPS.length ? (
                    <div className="flex gap-2">
                      <ExportButtons data={getValues()} />
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 shadow-md"
                    >
                      التالي
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supporters Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <SupportersPanel suggestions={suggestions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
