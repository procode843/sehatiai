"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Plus, Sparkles, TrendingUp } from "lucide-react"

interface Suggestion {
  id: string
  title_ar: string
  type: "specialist" | "service" | "test"
  score: number
  reasons: string[]
  urgent?: boolean
}

interface SupportersPanelProps {
  suggestions: Suggestion[]
}

export function SupportersPanel({ suggestions }: SupportersPanelProps) {
  const [loading, setLoading] = useState(false)
  const [addedSuggestions, setAddedSuggestions] = useState<Set<string>>(new Set())

  const handleAddSuggestion = (suggestion: Suggestion) => {
    setLoading(true)
    // Simulate adding suggestion
    setTimeout(() => {
      setAddedSuggestions((prev) => new Set([...prev, suggestion.id]))
      setLoading(false)
    }, 500)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "specialist":
        return "👨‍⚕️"
      case "service":
        return "🏥"
      case "test":
        return "🔬"
      default:
        return "💡"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "specialist":
        return "طبيب مختص"
      case "service":
        return "خدمة طبية"
      case "test":
        return "فحص مطلوب"
      default:
        return "اقتراح"
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-600" />
          الاقتراحات الذكية
        </CardTitle>
        <p className="text-sm text-gray-600">اقتراحات مخصصة بناءً على معلوماتك الطبية</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {suggestions.length === 0 && !loading && (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-sm">املأ المزيد من المعلومات للحصول على اقتراحات مخصصة</p>
          </div>
        )}

        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className={`${suggestion.urgent ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                  <div>
                    <h4 className="font-medium text-sm">{suggestion.title_ar}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {getTypeLabel(suggestion.type)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">{suggestion.score}%</span>
                </div>
              </div>

              {suggestion.urgent && (
                <Badge variant="destructive" className="mb-2 text-xs">
                  عاجل
                </Badge>
              )}

              <div className="space-y-1 mb-3">
                {suggestion.reasons.map((reason, index) => (
                  <p key={index} className="text-xs text-gray-600">
                    • {reason}
                  </p>
                ))}
              </div>

              <Button
                size="sm"
                variant={addedSuggestions.has(suggestion.id) ? "secondary" : "default"}
                className="w-full text-xs"
                onClick={() => handleAddSuggestion(suggestion)}
                disabled={addedSuggestions.has(suggestion.id)}
              >
                {addedSuggestions.has(suggestion.id) ? (
                  "تم الإضافة"
                ) : (
                  <>
                    <Plus className="h-3 w-3 ml-1" />
                    إضافة للملف
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* AI Insights */}
        <Card className="bg-teal-50 border-teal-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <h4 className="font-medium text-sm text-teal-800">نصيحة ذكية</h4>
            </div>
            <p className="text-xs text-teal-700">
              بناءً على معلوماتك، ننصح بإجراء فحص دوري شامل كل 6 أشهر للمتابعة الصحية المثلى.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
