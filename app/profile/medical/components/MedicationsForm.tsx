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
import { Plus, Trash2, HelpCircle, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function MedicationsForm() {
  const { control } = useFormContext()
  const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false)
  const [isAllergyDialogOpen, setIsAllergyDialogOpen] = useState(false)
  const [isSupplementDialogOpen, setIsSupplementDialogOpen] = useState(false)

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control,
    name: "medications.currentMedications",
  })

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control,
    name: "medications.allergies",
  })

  const {
    fields: supplementFields,
    append: appendSupplement,
    remove: removeSupplement,
  } = useFieldArray({
    control,
    name: "medications.supplements",
  })

  const handleAddMedication = (data: any) => {
    appendMedication(data)
    setIsMedicationDialogOpen(false)
  }

  const handleAddAllergy = (data: any) => {
    appendAllergy(data)
    setIsAllergyDialogOpen(false)
  }

  const handleAddSupplement = (data: any) => {
    appendSupplement(data)
    setIsSupplementDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Important Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          تأكد من دقة المعلومات المدخلة، خاصة الأدوية والحساسية، حيث أن هذه المعلومات مهمة جداً للرعاية الطبية الآمنة.
        </AlertDescription>
      </Alert>

      {/* Current Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              الأدوية الحالية
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الأدوية التي تتناولها حالياً بانتظام</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Dialog open={isMedicationDialogOpen} onOpenChange={setIsMedicationDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة دواء
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة دواء جديد</DialogTitle>
                </DialogHeader>
                <MedicationDialog onSubmit={handleAddMedication} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {medicationFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد أدوية مضافة</p>
          ) : (
            <div className="space-y-3">
              {medicationFields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{(field as any).name}</p>
                    <p className="text-sm text-gray-600">
                      {(field as any).dosage && `الجرعة: ${(field as any).dosage}`}
                      {(field as any).frequency && ` • التكرار: ${(field as any).frequency}`}
                      {(field as any).prescribedBy && ` • وصفه: ${(field as any).prescribedBy}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(index)}
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

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              الحساسية
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الأدوية أو المواد التي تسبب لك حساسية</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Dialog open={isAllergyDialogOpen} onOpenChange={setIsAllergyDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة حساسية
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة حساسية جديدة</DialogTitle>
                </DialogHeader>
                <AllergyDialog onSubmit={handleAddAllergy} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allergyFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد حساسية مضافة</p>
          ) : (
            <div className="space-y-3">
              {allergyFields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                  <div>
                    <p className="font-medium text-red-800">{(field as any).allergen}</p>
                    <p className="text-sm text-red-600">
                      {(field as any).reaction && `رد الفعل: ${(field as any).reaction}`}
                      {(field as any).severity && ` • الشدة: ${(field as any).severity}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAllergy(index)}
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

      {/* Supplements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              المكملات الغذائية والفيتامينات
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>المكملات الغذائية والفيتامينات التي تتناولها</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Dialog open={isSupplementDialogOpen} onOpenChange={setIsSupplementDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="secondary">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مكمل
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة مكمل غذائي</DialogTitle>
                </DialogHeader>
                <SupplementDialog onSubmit={handleAddSupplement} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {supplementFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد مكملات غذائية مضافة</p>
          ) : (
            <div className="space-y-3">
              {supplementFields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{(field as any).name}</p>
                    <p className="text-sm text-gray-600">
                      {(field as any).dosage && `الجرعة: ${(field as any).dosage}`}
                      {(field as any).frequency && ` • التكرار: ${(field as any).frequency}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSupplement(index)}
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
    </div>
  )
}

// Dialog Components
function MedicationDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    prescribedBy: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", dosage: "", frequency: "", startDate: "", prescribedBy: "", notes: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="medicationName">اسم الدواء *</Label>
        <Input
          id="medicationName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dosage">الجرعة</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            placeholder="مثال: 500 مجم"
          />
        </div>
        <div>
          <Label htmlFor="frequency">التكرار</Label>
          <Select onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
            <SelectTrigger>
              <SelectValue placeholder="اختر التكرار" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="مرة واحدة يومياً">مرة واحدة يومياً</SelectItem>
              <SelectItem value="مرتين يومياً">مرتين يومياً</SelectItem>
              <SelectItem value="ثلاث مرات يومياً">ثلاث مرات يومياً</SelectItem>
              <SelectItem value="أربع مرات يومياً">أربع مرات يومياً</SelectItem>
              <SelectItem value="عند الحاجة">عند الحاجة</SelectItem>
              <SelectItem value="أسبوعياً">أسبوعياً</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="startDate">تاريخ البدء</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="prescribedBy">وصفه الطبيب</Label>
        <Input
          id="prescribedBy"
          value={formData.prescribedBy}
          onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
          placeholder="اسم الطبيب"
        />
      </div>
      <div>
        <Label htmlFor="medicationNotes">ملاحظات</Label>
        <Textarea
          id="medicationNotes"
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

function AllergyDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    allergen: "",
    reaction: "",
    severity: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ allergen: "", reaction: "", severity: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="allergen">المادة المسببة للحساسية *</Label>
        <Input
          id="allergen"
          value={formData.allergen}
          onChange={(e) => setFormData({ ...formData, allergen: e.target.value })}
          required
          placeholder="مثال: البنسلين، الفول السوداني"
        />
      </div>
      <div>
        <Label htmlFor="reaction">رد الفعل</Label>
        <Input
          id="reaction"
          value={formData.reaction}
          onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
          placeholder="مثال: طفح جلدي، صعوبة في التنفس"
        />
      </div>
      <div>
        <Label htmlFor="allergySeverity">الشدة</Label>
        <Select onValueChange={(value) => setFormData({ ...formData, severity: value })}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الشدة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="خفيف">خفيف</SelectItem>
            <SelectItem value="متوسط">متوسط</SelectItem>
            <SelectItem value="شديد">شديد</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        إضافة
      </Button>
    </form>
  )
}

function SupplementDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", dosage: "", frequency: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="supplementName">اسم المكمل *</Label>
        <Input
          id="supplementName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="مثال: فيتامين د، أوميغا 3"
        />
      </div>
      <div>
        <Label htmlFor="supplementDosage">الجرعة</Label>
        <Input
          id="supplementDosage"
          value={formData.dosage}
          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          placeholder="مثال: 1000 وحدة دولية"
        />
      </div>
      <div>
        <Label htmlFor="supplementFrequency">التكرار</Label>
        <Select onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
          <SelectTrigger>
            <SelectValue placeholder="اختر التكرار" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="مرة واحدة يومياً">مرة واحدة يومياً</SelectItem>
            <SelectItem value="مرتين يومياً">مرتين يومياً</SelectItem>
            <SelectItem value="ثلاث مرات يومياً">ثلاث مرات يومياً</SelectItem>
            <SelectItem value="أسبوعياً">أسبوعياً</SelectItem>
            <SelectItem value="شهرياً">شهرياً</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        إضافة
      </Button>
    </form>
  )
}
