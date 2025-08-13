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
import { Plus, Trash2, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ConditionsForm() {
  const { register, control, setValue } = useFormContext()
  const [isConditionDialogOpen, setIsConditionDialogOpen] = useState(false)
  const [isSurgeryDialogOpen, setIsSurgeryDialogOpen] = useState(false)
  const [isFamilyHistoryDialogOpen, setIsFamilyHistoryDialogOpen] = useState(false)

  const {
    fields: conditionFields,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray({
    control,
    name: "conditions.currentConditions",
  })

  const {
    fields: surgeryFields,
    append: appendSurgery,
    remove: removeSurgery,
  } = useFieldArray({
    control,
    name: "conditions.pastSurgeries",
  })

  const {
    fields: familyHistoryFields,
    append: appendFamilyHistory,
    remove: removeFamilyHistory,
  } = useFieldArray({
    control,
    name: "conditions.familyHistory",
  })

  const handleAddCondition = (data: any) => {
    appendCondition(data)
    setIsConditionDialogOpen(false)
  }

  const handleAddSurgery = (data: any) => {
    appendSurgery(data)
    setIsSurgeryDialogOpen(false)
  }

  const handleAddFamilyHistory = (data: any) => {
    appendFamilyHistory(data)
    setIsFamilyHistoryDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Current Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              الحالات الطبية الحالية
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الأمراض أو الحالات الطبية التي تعاني منها حالياً</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Dialog open={isConditionDialogOpen} onOpenChange={setIsConditionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة حالة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة حالة طبية جديدة</DialogTitle>
                </DialogHeader>
                <ConditionDialog onSubmit={handleAddCondition} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conditionFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد حالات طبية مضافة</p>
          ) : (
            <div className="space-y-3">
              {conditionFields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{(field as any).name}</p>
                    <p className="text-sm text-gray-600">
                      {(field as any).severity && `الشدة: ${(field as any).severity}`}
                      {(field as any).diagnosedDate && ` • تاريخ التشخيص: ${(field as any).diagnosedDate}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(index)}
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

      {/* Past Surgeries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              العمليات الجراحية السابقة
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>العمليات الجراحية التي أجريتها في الماضي</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Dialog open={isSurgeryDialogOpen} onOpenChange={setIsSurgeryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة عملية
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة عملية جراحية</DialogTitle>
                </DialogHeader>
                <SurgeryDialog onSubmit={handleAddSurgery} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {surgeryFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد عمليات جراحية مضافة</p>
          ) : (
            <div className="space-y-3">
              {surgeryFields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{(field as any).name}</p>
                    <p className="text-sm text-gray-600">
                      {(field as any).date && `التاريخ: ${(field as any).date}`}
                      {(field as any).hospital && ` • المستشفى: ${(field as any).hospital}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSurgery(index)}
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

      {/* Family History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              التاريخ المرضي للعائلة
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الأمراض الوراثية أو المزمنة في العائلة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Dialog open={isFamilyHistoryDialogOpen} onOpenChange={setIsFamilyHistoryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة تاريخ عائلي
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة تاريخ مرضي عائلي</DialogTitle>
                </DialogHeader>
                <FamilyHistoryDialog onSubmit={handleAddFamilyHistory} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {familyHistoryFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا يوجد تاريخ مرضي عائلي مضاف</p>
          ) : (
            <div className="space-y-3">
              {familyHistoryFields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{(field as any).condition}</p>
                    <p className="text-sm text-gray-600">القرابة: {(field as any).relation}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFamilyHistory(index)}
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
function ConditionDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    diagnosedDate: "",
    severity: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", diagnosedDate: "", severity: "", notes: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="conditionName">اسم الحالة *</Label>
        <Input
          id="conditionName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="diagnosedDate">تاريخ التشخيص</Label>
        <Input
          id="diagnosedDate"
          type="date"
          value={formData.diagnosedDate}
          onChange={(e) => setFormData({ ...formData, diagnosedDate: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="severity">الشدة</Label>
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
      <div>
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea
          id="notes"
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

function SurgeryDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    hospital: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", date: "", hospital: "", notes: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="surgeryName">اسم العملية *</Label>
        <Input
          id="surgeryName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="surgeryDate">تاريخ العملية</Label>
        <Input
          id="surgeryDate"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="hospital">المستشفى</Label>
        <Input
          id="hospital"
          value={formData.hospital}
          onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="surgeryNotes">ملاحظات</Label>
        <Textarea
          id="surgeryNotes"
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

function FamilyHistoryDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    condition: "",
    relation: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ condition: "", relation: "", notes: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="familyCondition">الحالة المرضية *</Label>
        <Input
          id="familyCondition"
          value={formData.condition}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="relation">القرابة *</Label>
        <Select onValueChange={(value) => setFormData({ ...formData, relation: value })}>
          <SelectTrigger>
            <SelectValue placeholder="اختر القرابة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="الوالد">الوالد</SelectItem>
            <SelectItem value="الوالدة">الوالدة</SelectItem>
            <SelectItem value="الأخ">الأخ</SelectItem>
            <SelectItem value="الأخت">الأخت</SelectItem>
            <SelectItem value="الجد">الجد</SelectItem>
            <SelectItem value="الجدة">الجدة</SelectItem>
            <SelectItem value="العم">العم</SelectItem>
            <SelectItem value="العمة">العمة</SelectItem>
            <SelectItem value="الخال">الخال</SelectItem>
            <SelectItem value="الخالة">الخالة</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="familyNotes">ملاحظات</Label>
        <Textarea
          id="familyNotes"
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
