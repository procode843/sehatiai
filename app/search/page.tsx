"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Phone,
  AlertTriangle,
  Mic,
  Heart,
  Clock,
  Activity,
  Stethoscope,
  Brain,
  Shield,
  BookOpen,
  History,
  Trash2,
  Plus,
  X,
  MapPin,
  Navigation,
  Star,
  Filter,
  Search,
  Map,
  List,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import symptomsData from "@/data/symptoms.sample.json"
import hospitalsData from "@/data/hospitals.sample.json"
import GoogleMap from "./components/GoogleMap"

interface Hospital {
  id: string
  name_ar: string
  name_en: string
  type: string
  specialties: string[]
  location: {
    lat: number
    lng: number
    address_ar: string
    district_ar: string
    city_ar: string
  }
  contact: {
    phone: string
    emergency_phone?: string
    website?: string
  }
  services: string[]
  rating: number
  reviews_count: number
  insurance_accepted: string[]
  operating_hours: {
    [key: string]: string
  }
  emergency_services: boolean
  distance?: number
  eta?: number
}

// Existing symptom types...
interface Symptom {
  id: string
  name_ar: string
  name_en: string
  category: string
  severity_indicators: string[]
  related_symptoms: string[]
  emergency_flags: string[]
}

interface TriageResult {
  condition: "emergency" | "urgent" | "routine" | "self_care"
  recommendation: string
  color: string
  urgency: string
  confidence: number
  reasons: string[]
  next_steps: string[]
  warning_signs: string[]
}

interface SymptomEntry {
  id: string
  symptoms: string[]
  description: string
  severity: number
  duration: string
  timestamp: Date
  triage_result: TriageResult
}

// Mock AI triage function (existing)
const performTriage = async (symptoms: string, severity: number, duration: string): Promise<TriageResult> => {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

  const symptomsLower = symptoms.toLowerCase()

  const emergencyKeywords = [
    "ألم صدري شديد",
    "ضيق تنفس شديد",
    "فقدان وعي",
    "إغماء",
    "نزيف شديد",
    "تسمم",
    "حادث",
    "كسر",
    "حروق شديدة",
    "صداع مفاجئ شديد",
    "تشنجات",
    "ازرقاق",
    "شلل",
  ]

  const urgentKeywords = [
    "حمى عالية",
    "قيء مستمر",
    "إسهال شديد",
    "ألم شديد",
    "صعوبة بلع",
    "طفح جلدي منتشر",
    "ألم بطني شديد",
  ]

  const routineKeywords = ["صداع", "زكام", "سعال", "حمى خفيفة", "ألم خفيف", "غثيان", "إمساك", "أرق"]

  let result: TriageResult

  if (emergencyKeywords.some((keyword) => symptomsLower.includes(keyword)) || severity >= 8) {
    result = {
      condition: "emergency",
      recommendation: "اتصل بالطوارئ فوراً - 997",
      color: "red",
      urgency: "فوري",
      confidence: 0.95,
      reasons: ["أعراض تشير لحالة طارئة", "مستوى شدة عالي", "تتطلب تدخل طبي فوري"],
      next_steps: ["اتصل بالطوارئ 997", "لا تقود السيارة بنفسك", "ابق هادئاً واتبع تعليمات المسعف"],
      warning_signs: ["تفاقم الأعراض", "فقدان الوعي", "صعوبة في التنفس"],
    }
  } else if (urgentKeywords.some((keyword) => symptomsLower.includes(keyword)) || severity >= 6) {
    result = {
      condition: "urgent",
      recommendation: "توجه لقسم الطوارئ أو العيادة العاجلة",
      color: "orange",
      urgency: "خلال ساعتين",
      confidence: 0.85,
      reasons: ["أعراض تتطلب عناية طبية عاجلة", "مستوى شدة متوسط إلى عالي"],
      next_steps: ["توجه لأقرب مستشفى", "احضر معك قائمة الأدوية", "اطلب من أحد مرافقتك"],
      warning_signs: ["زيادة شدة الألم", "ظهور أعراض جديدة", "عدم تحسن خلال ساعات"],
    }
  } else if (routineKeywords.some((keyword) => symptomsLower.includes(keyword)) || severity >= 3) {
    result = {
      condition: "routine",
      recommendation: "احجز موعد مع طبيب العائلة",
      color: "yellow",
      urgency: "خلال 24 ساعة",
      confidence: 0.75,
      reasons: ["أعراض تتطلب استشارة طبية", "مستوى شدة متوسط"],
      next_steps: ["احجز موعد مع طبيبك", "راقب تطور الأعراض", "سجل الأعراض والأوقات"],
      warning_signs: ["تفاقم الأعراض", "ظهور حمى", "عدم تحسن خلال أيام"],
    }
  } else {
    result = {
      condition: "self_care",
      recommendation: "يمكن العلاج المنزلي مع المراقبة",
      color: "green",
      urgency: "مراقبة",
      confidence: 0.65,
      reasons: ["أعراض خفيفة", "يمكن إدارتها منزلياً"],
      next_steps: ["راحة كافية", "شرب سوائل كثيرة", "مراقبة الأعراض"],
      warning_signs: ["تفاقم الأعراض", "ظهور أعراض جديدة", "عدم تحسن خلال أسبوع"],
    }
  }

  return result
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("symptoms")
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState("")
  const [hospitals, setHospitals] = useState<Hospital[]>(hospitalsData.hospitals)
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([])
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [showHospitalSheet, setShowHospitalSheet] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 }) // Riyadh center
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  // Hospital filters
  const [filters, setFilters] = useState({
    specialty: "",
    type: "",
    emergency: false,
    insurance: "",
    rating: 0,
    distance: 50,
  })
  const [sortBy, setSortBy] = useState("distance")

  // Existing symptom states...
  const [searchQuery, setSearchQuery] = useState("")
  const [symptomDescription, setSymptomDescription] = useState("")
  const [severity, setSeverity] = useState([5])
  const [duration, setDuration] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [symptomHistory, setSymptomHistory] = useState<SymptomEntry[]>([])
  const [showHistorySheet, setShowHistorySheet] = useState(false)

  useEffect(() => {
    if (!hospitals || hospitals.length === 0) {
      setFilteredHospitals([])
      return
    }

    let filtered = hospitals

    // Text search
    if (hospitalSearchQuery.trim()) {
      const query = hospitalSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (hospital) =>
          hospital.name_ar.toLowerCase().includes(query) ||
          hospital.name_en.toLowerCase().includes(query) ||
          hospital.specialties.some((spec) => spec.toLowerCase().includes(query)) ||
          hospital.location.district_ar.toLowerCase().includes(query),
      )
    }

    // Apply filters
    if (filters.specialty) {
      filtered = filtered.filter((hospital) => hospital.specialties.includes(filters.specialty))
    }
    if (filters.type) {
      filtered = filtered.filter((hospital) => hospital.type === filters.type)
    }
    if (filters.emergency) {
      filtered = filtered.filter((hospital) => hospital.emergency_services)
    }
    if (filters.insurance) {
      filtered = filtered.filter((hospital) => hospital.insurance_accepted.includes(filters.insurance))
    }
    if (filters.rating > 0) {
      filtered = filtered.filter((hospital) => hospital.rating >= filters.rating)
    }

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map((hospital) => ({
        ...hospital,
        distance: calculateDistance(userLocation, hospital.location),
        eta: Math.round(calculateDistance(userLocation, hospital.location) * 2), // Rough ETA in minutes
      }))

      // Filter by distance
      filtered = filtered.filter((hospital) => (hospital.distance || 0) <= filters.distance)
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 0) - (b.distance || 0)
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name_ar.localeCompare(b.name_ar, "ar")
        default:
          return 0
      }
    })

    setFilteredHospitals(filtered)
  }, [hospitalSearchQuery, filters, sortBy, hospitals, userLocation])

  // Calculate distance between two points
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Get user location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          setMapCenter(location)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  // Load symptom history from localStorage (existing)
  useEffect(() => {
    const saved = localStorage.getItem("sehati_symptom_history")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSymptomHistory(
          parsed.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })),
        )
      } catch (error) {
        console.error("Error loading symptom history:", error)
      }
    }
  }, [])

  // Save symptom history to localStorage (existing)
  const saveSymptomHistory = useCallback(
    (entry: SymptomEntry) => {
      const updated = [entry, ...symptomHistory].slice(0, 50)
      setSymptomHistory(updated)
      localStorage.setItem("sehati_symptom_history", JSON.stringify(updated))
    },
    [symptomHistory],
  )

  // Existing symptom analysis function...
  const analyzeSymptoms = useCallback(async () => {
    if (!symptomDescription.trim()) return

    setIsAnalyzing(true)
    setTriageResult(null)

    try {
      const result = await performTriage(symptomDescription, severity[0], duration)
      setTriageResult(result)

      if (result.condition === "emergency") {
        setShowEmergencyBanner(true)
      }

      const entry: SymptomEntry = {
        id: Date.now().toString(),
        symptoms: selectedSymptoms,
        description: symptomDescription,
        severity: severity[0],
        duration,
        timestamp: new Date(),
        triage_result: result,
      }
      saveSymptomHistory(entry)
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [symptomDescription, severity, duration, selectedSymptoms, saveSymptomHistory])

  // Existing voice input function...
  const startVoiceInput = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("متصفحك لا يدعم التعرف على الصوت")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "ar-SA"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      if (activeTab === "symptoms") {
        setSymptomDescription((prev) => prev + " " + transcript)
      } else {
        setHospitalSearchQuery(transcript)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
      alert("حدث خطأ في التعرف على الصوت")
    }

    recognition.start()
  }, [activeTab])

  // Existing symptom functions...
  const addSymptom = useCallback(
    (symptom: string) => {
      if (!selectedSymptoms.includes(symptom)) {
        setSelectedSymptoms((prev) => [...prev, symptom])
      }
    },
    [selectedSymptoms],
  )

  const removeSymptom = useCallback((symptom: string) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s !== symptom))
  }, [])

  const getSeverityColor = (level: number) => {
    if (level <= 3) return "text-green-600"
    if (level <= 6) return "text-yellow-600"
    if (level <= 8) return "text-orange-600"
    return "text-red-600"
  }

  const getTriageColorClasses = (condition: string) => {
    switch (condition) {
      case "emergency":
        return "bg-red-50 border-red-200 text-red-800"
      case "urgent":
        return "bg-orange-50 border-orange-200 text-orange-800"
      case "routine":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "self_care":
        return "bg-green-50 border-green-200 text-green-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50" dir="rtl">
      {/* Emergency Banner */}
      {showEmergencyBanner && (
        <div className="bg-red-600 text-white p-4 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-bold">حالة طارئة — اتصل بالطوارئ الآن</span>
          </div>
          <Button
            className="mt-2 bg-white text-red-600 hover:bg-red-50"
            onClick={() => window.open("tel:997", "_self")}
          >
            <Phone className="h-4 w-4 ml-2" />
            اتصال بالطوارئ 997
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-2 text-white hover:bg-red-700"
            onClick={() => setShowEmergencyBanner(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">صحتي</h1>
                <p className="text-sm text-gray-600">
                  {activeTab === "symptoms" ? "تحليل الأعراض والتوجيه الطبي" : "البحث عن المرافق الطبية"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowHistorySheet(true)} className="gap-2">
              <History className="h-4 w-4" />
              السجل الطبي
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="symptoms" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              تحليل الأعراض
            </TabsTrigger>
            <TabsTrigger value="hospitals" className="gap-2">
              <Building2 className="h-4 w-4" />
              البحث عن المستشفيات
            </TabsTrigger>
          </TabsList>

          {/* Symptoms Tab Content (existing) */}
          <TabsContent value="symptoms">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Symptom Input Panel */}
              <div className="lg:col-span-8">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-teal-600" />
                      وصف الأعراض
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Main symptom description */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">صف أعراضك بالتفصيل</label>
                      <div className="relative">
                        <Textarea
                          value={symptomDescription}
                          onChange={(e) => setSymptomDescription(e.target.value)}
                          placeholder="مثال: أشعر بصداع شديد منذ ساعتين مع غثيان وحساسية للضوء..."
                          className="min-h-24 pr-12"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`absolute left-2 top-2 ${isListening ? "text-red-500" : "text-gray-400"}`}
                          onClick={startVoiceInput}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick symptom selection */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">أعراض شائعة (اختياري)</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {symptomsData.commonSymptoms.map((symptom) => (
                          <Button
                            key={symptom.id}
                            variant="outline"
                            size="sm"
                            onClick={() => addSymptom(symptom.name_ar)}
                            className="text-xs"
                          >
                            <Plus className="h-3 w-3 ml-1" />
                            {symptom.name_ar}
                          </Button>
                        ))}
                      </div>

                      {/* Selected symptoms */}
                      {selectedSymptoms.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedSymptoms.map((symptom, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              {symptom}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSymptom(symptom)}
                                className="p-0 h-auto ml-1"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Severity scale */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        مستوى الشدة:{" "}
                        <span className={`font-bold ${getSeverityColor(severity[0])}`}>{severity[0]}/10</span>
                      </label>
                      <Slider
                        value={severity}
                        onValueChange={setSeverity}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>خفيف</span>
                        <span>متوسط</span>
                        <span>شديد</span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">مدة الأعراض</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {["أقل من ساعة", "ساعات قليلة", "يوم واحد", "عدة أيام", "أسبوع", "أكثر من أسبوع"].map((dur) => (
                          <Button
                            key={dur}
                            variant={duration === dur ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDuration(dur)}
                            className="text-xs"
                          >
                            {dur}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Analyze button */}
                    <Button
                      onClick={analyzeSymptoms}
                      disabled={!symptomDescription.trim() || isAnalyzing}
                      className="w-full h-12 text-lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Activity className="h-5 w-5 ml-2 animate-spin" />
                          جاري التحليل...
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5 ml-2" />
                          تحليل الأعراض
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Triage Results */}
                {triageResult && (
                  <Card className={`border-2 ${getTriageColorClasses(triageResult.condition)}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {triageResult.condition === "emergency" && <AlertTriangle className="h-5 w-5" />}
                          {triageResult.condition === "urgent" && <Clock className="h-5 w-5" />}
                          {triageResult.condition === "routine" && <Stethoscope className="h-5 w-5" />}
                          {triageResult.condition === "self_care" && <Shield className="h-5 w-5" />}
                          نتيجة التحليل
                        </CardTitle>
                        <Badge variant="secondary">ثقة {Math.round(triageResult.confidence * 100)}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-lg font-bold">{triageResult.recommendation}</div>
                      <div className="text-sm opacity-80">الإجراء المطلوب: {triageResult.urgency}</div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">أسباب هذا التوجيه:</h4>
                        <ul className="space-y-1">
                          {triageResult.reasons.map((reason, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">الخطوات التالية:</h4>
                        <ul className="space-y-1">
                          {triageResult.next_steps.map((step, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">علامات تحذيرية - اطلب المساعدة فوراً إذا ظهرت:</h4>
                        <ul className="space-y-1">
                          {triageResult.warning_signs.map((sign, index) => (
                            <li key={index} className="text-sm flex items-center gap-2 text-red-600">
                              <AlertTriangle className="w-3 h-3" />
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {triageResult.condition === "emergency" && (
                        <Button
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => window.open("tel:997", "_self")}
                        >
                          <Phone className="h-4 w-4 ml-2" />
                          اتصال بالطوارئ 997
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Information Panel */}
              <div className="lg:col-span-4">
                <div className="space-y-6">
                  {/* Emergency Numbers */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Phone className="h-5 w-5 text-red-600" />
                        أرقام الطوارئ
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 h-12 border-red-200 hover:bg-red-50 bg-transparent"
                        onClick={() => window.open("tel:997", "_self")}
                      >
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                          <Phone className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="font-bold">الطوارئ العامة</div>
                          <div className="text-sm text-gray-600">997</div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 h-12 border-blue-200 hover:bg-blue-50 bg-transparent"
                        onClick={() => window.open("tel:937", "_self")}
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Heart className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="font-bold">وزارة الصحة</div>
                          <div className="text-sm text-gray-600">937</div>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Health Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-teal-600" />
                        نصائح صحية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-teal-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">متى تطلب المساعدة الطارئة؟</h4>
                        <p className="text-xs text-gray-600">
                          ألم صدري شديد، ضيق تنفس، فقدان وعي، نزيف شديد، أو أي أعراض مفاجئة وشديدة
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">معلومات مهمة للطبيب</h4>
                        <p className="text-xs text-gray-600">
                          احتفظ بقائمة الأدوية، الحساسيات، والتاريخ المرضي لتسهيل التشخيص
                        </p>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">الوقاية خير من العلاج</h4>
                        <p className="text-xs text-gray-600">
                          فحوصات دورية، نمط حياة صحي، وتطعيمات منتظمة تحميك من كثير من الأمراض
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Disclaimer */}
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-yellow-800">
                          <strong>تنبيه طبي:</strong> هذا التطبيق للإرشاد فقط وليس بديلاً عن الاستشارة الطبية المتخصصة.
                          في حالات الطوارئ، اتصل بالطوارئ فوراً.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hospitals">
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Search and Filters */}
              <div className="lg:col-span-4">
                <div className="space-y-6">
                  {/* Search Bar */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="relative">
                        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={hospitalSearchQuery}
                          onChange={(e) => setHospitalSearchQuery(e.target.value)}
                          placeholder="ابحث عن مستشفى أو تخصص..."
                          className="pr-10 pl-12"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`absolute left-2 top-2 ${isListening ? "text-red-500" : "text-gray-400"}`}
                          onClick={startVoiceInput}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-teal-600" />
                        الموقع
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={getUserLocation} variant="outline" className="w-full gap-2 bg-transparent">
                        <Navigation className="h-4 w-4" />
                        {userLocation ? "تحديث الموقع" : "تحديد موقعي"}
                      </Button>
                      {userLocation && <p className="text-sm text-gray-600 mt-2">تم تحديد موقعك بنجاح</p>}
                    </CardContent>
                  </Card>

                  {/* Filters */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-5 w-5 text-teal-600" />
                        التصفية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">التخصص</label>
                        <Select
                          value={filters.specialty}
                          onValueChange={(value) => setFilters((prev) => ({ ...prev, specialty: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التخصص" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع التخصصات</SelectItem>
                            <SelectItem value="طب عام">طب عام</SelectItem>
                            <SelectItem value="طب الطوارئ">طب الطوارئ</SelectItem>
                            <SelectItem value="جراحة عامة">جراحة عامة</SelectItem>
                            <SelectItem value="طب الأطفال">طب الأطفال</SelectItem>
                            <SelectItem value="طب النساء والولادة">طب النساء والولادة</SelectItem>
                            <SelectItem value="طب القلب">طب القلب</SelectItem>
                            <SelectItem value="طب العظام">طب العظام</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">نوع المرفق</label>
                        <Select
                          value={filters.type}
                          onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع الأنواع</SelectItem>
                            <SelectItem value="مستشفى حكومي">مستشفى حكومي</SelectItem>
                            <SelectItem value="مستشفى خاص">مستشفى خاص</SelectItem>
                            <SelectItem value="عيادة">عيادة</SelectItem>
                            <SelectItem value="مركز طبي">مركز طبي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">التقييم الأدنى</label>
                        <Select
                          value={filters.rating.toString()}
                          onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: Number(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التقييم" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">جميع التقييمات</SelectItem>
                            <SelectItem value="3">3 نجوم فأكثر</SelectItem>
                            <SelectItem value="4">4 نجوم فأكثر</SelectItem>
                            <SelectItem value="4.5">4.5 نجوم فأكثر</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {userLocation && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            المسافة القصوى: {filters.distance} كم
                          </label>
                          <Slider
                            value={[filters.distance]}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, distance: value[0] }))}
                            max={100}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="emergency"
                          checked={filters.emergency}
                          onChange={(e) => setFilters((prev) => ({ ...prev, emergency: e.target.checked }))}
                          className="rounded"
                        />
                        <label htmlFor="emergency" className="text-sm">
                          خدمات طوارئ فقط
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sort */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">ترتيب النتائج</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distance">الأقرب</SelectItem>
                          <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                          <SelectItem value="name">الاسم</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Results */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">النتائج ({filteredHospitals.length})</h2>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("map")}
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {filteredHospitals.map((hospital) => (
                      <Card key={hospital.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg">{hospital.name_ar}</h3>
                              <p className="text-sm text-gray-600">{hospital.type}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{hospital.rating}</span>
                              <span className="text-xs text-gray-500">({hospital.reviews_count})</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {hospital.location.district_ar}, {hospital.location.city_ar}
                            </span>
                            {hospital.distance && (
                              <>
                                <span>•</span>
                                <span>{hospital.distance.toFixed(1)} كم</span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {hospital.specialties.slice(0, 3).map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {hospital.specialties.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{hospital.specialties.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedHospital(hospital)
                                setShowHospitalSheet(true)
                              }}
                            >
                              التفاصيل
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`tel:${hospital.contact.phone}`, "_self")}
                            >
                              <Phone className="h-4 w-4 ml-1" />
                              اتصال
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`
                                window.open(url, "_blank")
                              }}
                            >
                              <Navigation className="h-4 w-4 ml-1" />
                              الاتجاهات
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredHospitals.length === 0 && (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <p className="text-gray-500">لا توجد نتائج مطابقة لبحثك</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="h-96 rounded-lg overflow-hidden">
                    <GoogleMap
                      center={mapCenter}
                      hospitals={filteredHospitals}
                      userLocation={userLocation}
                      onHospitalSelect={(hospital) => {
                        setSelectedHospital(hospital)
                        setShowHospitalSheet(true)
                      }}
                      onMapClick={(location) => setMapCenter(location)}
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hospital Details Sheet */}
      <Sheet open={showHospitalSheet} onOpenChange={setShowHospitalSheet}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>{selectedHospital?.name_ar}</SheetTitle>
          </SheetHeader>

          {selectedHospital && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{selectedHospital.rating}</span>
                <span className="text-sm text-gray-500">({selectedHospital.reviews_count} تقييم)</span>
              </div>

              <div>
                <h4 className="font-medium mb-2">العنوان</h4>
                <p className="text-sm text-gray-600">{selectedHospital.location.address_ar}</p>
                <p className="text-sm text-gray-600">
                  {selectedHospital.location.district_ar}, {selectedHospital.location.city_ar}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">التخصصات</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedHospital.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">الخدمات</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedHospital.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">ساعات العمل</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(selectedHospital.operating_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span>{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full"
                  onClick={() => window.open(`tel:${selectedHospital.contact.phone}`, "_self")}
                >
                  <Phone className="h-4 w-4 ml-2" />
                  اتصال: {selectedHospital.contact.phone}
                </Button>

                {selectedHospital.contact.emergency_phone && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => window.open(`tel:${selectedHospital.contact.emergency_phone}`, "_self")}
                  >
                    <AlertTriangle className="h-4 w-4 ml-2" />
                    طوارئ: {selectedHospital.contact.emergency_phone}
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.location.lat},${selectedHospital.location.lng}`
                    window.open(url, "_blank")
                  }}
                >
                  <Navigation className="h-4 w-4 ml-2" />
                  الحصول على الاتجاهات
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Symptom History Sheet (existing) */}
      <Sheet open={showHistorySheet} onOpenChange={setShowHistorySheet}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>السجل الطبي</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {symptomHistory.length > 0 ? (
              symptomHistory.map((entry) => (
                <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getTriageColorClasses(entry.triage_result.condition)}>
                        {entry.triage_result.condition === "emergency" && "طارئ"}
                        {entry.triage_result.condition === "urgent" && "عاجل"}
                        {entry.triage_result.condition === "routine" && "روتيني"}
                        {entry.triage_result.condition === "self_care" && "رعاية ذاتية"}
                      </Badge>
                      <span className="text-xs text-gray-500">{entry.timestamp.toLocaleDateString("ar-SA")}</span>
                    </div>

                    <p className="text-sm mb-2 line-clamp-2">{entry.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>الشدة: {entry.severity}/10</span>
                      <span>المدة: {entry.duration}</span>
                    </div>

                    <div className="mt-2 text-xs text-gray-700">{entry.triage_result.recommendation}</div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">لا يوجد سجل طبي</p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("هل أنت متأكد من حذف السجل الطبي؟")) {
                  setSymptomHistory([])
                  localStorage.removeItem("sehati_symptom_history")
                }
              }}
              className="w-full gap-2"
            >
              <Trash2 className="h-4 w-4" />
              حذف السجل الطبي
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
