"use client"

import { Badge } from "@/components/ui/badge"
import { Save, Clock, CheckCircle } from "lucide-react"

interface LocalDraftIndicatorProps {
  status: "saved" | "saving" | "draft"
}

export function LocalDraftIndicator({ status }: LocalDraftIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "saved":
        return {
          icon: CheckCircle,
          text: "محفوظ",
          variant: "default" as const,
          className: "bg-green-100 text-green-800 border-green-300",
        }
      case "saving":
        return {
          icon: Save,
          text: "جاري الحفظ...",
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800 border-blue-300",
        }
      case "draft":
        return {
          icon: Clock,
          text: "مسودة",
          variant: "outline" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
      <Icon className="h-3 w-3" />
      <span className="text-xs">{config.text}</span>
    </Badge>
  )
}
