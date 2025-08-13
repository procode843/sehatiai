"use client"

import type React from "react"

import { useState } from "react"
import { useFormContext, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, HelpCircle, Upload } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function VitalsForm() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext()
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)

  const {
    fields: testFields,
    append: appendTest,
    remove: removeTest,
  } = useFieldArray({
    control,
    name: "vitals.recentTests",
  })

  const handleAddTest = (data: any) => {
    appendTest(data)
    setIsTestDialogOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Handle file upload for test results
      console.log("Files uploaded:", files)
      // In a real app, you would process these files
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            القياسات الأساسية
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>القياسات الجسدية الأساسية</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="height">الطول (سم)</Label>
            <Input
              id="height"
              type="number"
              {...register("vitals.height")}
              placeholder="170"
              className={errors.vitals?.height ? "border-red-500" : ""}
            />
            {errors.vitals?.height && (
              <p className="text-red-500 text-sm mt-1">{errors.vitals.height.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="weight">الوزن (كجم)</Label>
            <Input
              id="weight"
              type="number"
              {...register("vitals.weight")}
              placeholder="70"
              className={errors.vitals?.weight ? "border-red-500" : ""}
            />
            {errors.vitals?.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.vitals.weight.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="bloodType">فصيلة الدم</Label>
            <Select onValueChange={(value) => setValue("vitals.bloodType", value)}>
              <SelectTrigger className={errors.vitals?.bloodType ? "border-red-500" : ""}>
                <SelectValue placeholder="اختر فصيلة الدم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
            {errors.vitals?.bloodType && (
              <p className="text-red-500 text-sm mt-1">{errors.vitals.bloodType.message as string}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              الفحوصات والتحاليل الحديثة
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>نتائج الفحوصات والتحاليل الطبية الحديثة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                <Upload className="h-4 w-4 ml-2" />
                رفع ملف
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة فحص
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة فحص جديد</DialogTitle>
                  </DialogHeader>
                  <TestDialog onSubmit={handleAddTest} />
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد فحوصات مضافة</p>
          ) : (
            <div className="space-y-3">
              {testFields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{(field as any).testName}</p>
                    <div className="text-sm text-gray-600 mt-1">
                      {(field as any).date && <span>التاريخ: {(field as any).date}</span>}
                      {(field as any).result && <span className="mr-4">النتيجة: {(field as any).result}</span>}
                    </div>
                    {(field as any).normalRange && (
                      <p className="text-xs text-gray-500 mt-1">المعدل الطبيعي: {(field as any).normalRange}</p>
                    )}
                    {(field as any).notes && (
                      <p className="text-xs text-gray-600 mt-1">ملاحظات: {(field as any).notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTest(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* BMI Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>حاسبة مؤشر كتلة الجسم</CardTitle>
        </CardHeader>
        <CardContent>
          <BMICalculator />
        </CardContent>
      </Card>
    </div>
  )
}

function TestDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    testName: "",
    date: "",
    result: "",
    normalRange: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ testName: "", date: "", result: "", normalRange: "", notes: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="testName">اسم الفحص *</Label>
        <Input
          id="testName"
          value={formData.testName}
          onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
          required
          placeholder="مثال: تحليل الدم الشامل، أشعة سينية"
        />
      </div>
      <div>
        <Label htmlFor="testDate">تاريخ الفحص</Label>
        <Input
          id="testDate"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="result">النتيجة</Label>
        <Input
          id="result"
          value={formData.result}
          onChange={(e) => setFormData({ ...formData, result: e.target.value })}
          placeholder="مثال: طبيعي، مرتفع، منخفض"
        />
      </div>
      <div>
        <Label htmlFor="normalRange">المعدل الطبيعي</Label>
        <Input
          id="normalRange"
          value={formData.normalRange}
          onChange={(e) => setFormData({ ...formData, normalRange: e.target.value })}
          placeholder="مثال: 4.5-11.0 × 10³/μL"
        />
      </div>
      <div>
        <Label htmlFor="testNotes">ملاحظات</Label>
        <Textarea
          id="testNotes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full">
        إضافة
      </Button>
    </form>
  )
}

function BMICalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [bmi, setBMI] = useState<number | null>(null)
  const [category, setCategory] = useState("")

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = Number.parseFloat(height) / 100
      const weightInKg = Number.parseFloat(weight)
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters)
      setBMI(calculatedBMI)

      if (calculatedBMI < 18.5) {
        setCategory("نقص في الوزن")
      } else if (calculatedBMI < 25) {
        setCategory("وزن طبيعي")
      } else if (calculatedBMI < 30) {
        setCategory("زيادة في الوزن")
      } else {
        setCategory("سمنة")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bmi-height">الطول (سم)</Label>
          <Input
            id="bmi-height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
          />
        </div>
        <div>
          <Label htmlFor="bmi-weight">الوزن (كجم)</Label>
          <Input
            id="bmi-weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
          />
        </div>
      </div>
      <Button onClick={calculateBMI} className="w-full">
        احسب مؤشر كتلة الجسم
      </Button>
      {bmi && (
        <div className="p-4 bg-teal-50 rounded-lg text-center">
          <p className="text-lg font-semibold">مؤشر كتلة الجسم: {bmi.toFixed(1)}</p>
          <p className="text-sm text-gray-600">التصنيف: {category}</p>
        </div>
      )}
    </div>
  )
}
