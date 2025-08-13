"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, Share2 } from "lucide-react"
import { generatePDF } from "../utils/pdfGenerator"
import type { MedicalProfileData } from "../schemas"

interface ExportButtonsProps {
  data: MedicalProfileData
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportJSON = () => {
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `medical-profile-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await generatePDF(data)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCreateShareableLink = () => {
    // Create a shareable export bundle (client-side only)
    const shareData = {
      ...data,
      exportDate: new Date().toISOString(),
      shareId: Math.random().toString(36).substr(2, 9),
    }

    const jsonData = JSON.stringify(shareData, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      alert("تم إنشاء رابط المشاركة ونسخه للحافظة")
    })
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleExportJSON} variant="outline" size="sm">
        <Download className="h-4 w-4 ml-2" />
        تصدير JSON
      </Button>

      <Button onClick={handleExportPDF} variant="outline" size="sm" disabled={isExporting}>
        <FileText className="h-4 w-4 ml-2" />
        {isExporting ? "جاري التصدير..." : "تصدير PDF"}
      </Button>

      <Button onClick={handleCreateShareableLink} size="sm">
        <Share2 className="h-4 w-4 ml-2" />
        إنشاء رابط مشاركة
      </Button>
    </div>
  )
}
