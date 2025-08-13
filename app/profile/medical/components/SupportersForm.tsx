"use client"

import type React from "react"

import { useState } from "react"
import { useFormContext, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, HelpCircle, Phone, Mail, MapPin } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SupportersForm() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext()
  const [isSpecialistDialogOpen, setIsSpecialistDialogOpen] = useState(false)

  const {
    fields: specialistFields,
    append: appendSpecialist,
    remove: removeSpecialist,
  } = useFieldArray({
    control,
    name: "supporters.specialists",
  })

  const handleAddSpecialist = (data: any) => {
    appendSpecialist(data)
    setIsSpecialistDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Primary Doctor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            الطبيب الأساسي
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>طبيب العائلة أو الطبيب الذي تراجعه بانتظام</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primaryDoctorName">اسم الطبيب *</Label>
            <Input
              id="primaryDoctorName"
              {...register("supporters.primaryDoctor.name")}
              className={errors.supporters?.primaryDoctor?.name ? "border-red-500" : ""}
              placeholder="د. أحمد محمد"
            />
            {errors.supporters?.primaryDoctor?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.supporters.primaryDoctor.name.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="primaryDoctorSpecialty">التخصص</Label>
            <Select onValueChange={(value) => setValue("supporters.primaryDoctor.specialty", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر التخصص" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="طب عام">طب عام</SelectItem>
                <SelectItem value="طب باطني">طب باطني</SelectItem>
                <SelectItem value="طب أطفال">طب أطفال</SelectItem>
                <SelectItem value="طب نساء وولادة">طب نساء وولادة</SelectItem>
                <SelectItem value="جراحة عامة">جراحة عامة</SelectItem>
                <SelectItem value="طب قلب">طب قلب</SelectItem>
                <SelectItem value="طب عظام">طب عظام</SelectItem>
                <SelectItem value="طب عيون">طب عيون</SelectItem>
                <SelectItem value="طب أنف وأذن وحنجرة">طب أنف وأذن وحنجرة</SelectItem>
                <SelectItem value="طب جلدية">طب جلدية</SelectItem>
                <SelectItem value="طب نفسي">طب نفسي</SelectItem>
                <SelectItem value="أخرى">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="primaryDoctorPhone">رقم الهاتف</Label>
            <Input
              id="primaryDoctorPhone"
              type="tel"
              {...register("supporters.primaryDoctor.phone")}
              placeholder="+966 50 123 4567"
            />
          </div>

          <div>
            <Label htmlFor="primaryDoctorEmail">البريد الإلكتروني</Label>
            <Input
              id="primaryDoctorEmail"
              type="email"
              {...register("supporters.primaryDoctor.email")}
              placeholder="doctor@hospital.com"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="primaryDoctorHospital">المستشفى أو العيادة</Label>
            <Input
              id="primaryDoctorHospital"
              {...register("supporters.primaryDoctor.hospital")}
              placeholder="مستشفى الملك فهد"
            />
          </div>
        </CardContent>
      </Card>

      {/* Specialists */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              الأطباء المختصون
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>الأطباء المختصون الذين تراجعهم لحالات معينة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Dialog open={isSpecialistDialogOpen} onOpenChange={setIsSpecialistDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مختص
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة طبيب مختص</DialogTitle>
                </DialogHeader>
                <SpecialistDialog onSubmit={handleAddSpecialist} />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {specialistFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد أطباء مختصون مضافون</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialistFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{(field as any).name}</h4>
                      <p className="text-sm text-teal-600">{(field as any).specialty}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecialist(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {(field as any).phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{(field as any).phone}</span>
                      </div>
                    )}
                    {(field as any).email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{(field as any).email}</span>
                      </div>
                    )}
                    {(field as any).hospital && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{(field as any).hospital}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferred Hospital */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            المستشفى المفضل
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>المستشفى الذي تفضل التوجه إليه في حالات الطوارئ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="preferredHospital">اسم المستشفى</Label>
            <Input
              id="preferredHospital"
              {...register("supporters.preferredHospital")}
              placeholder="مستشفى الملك فهد التخصصي"
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>أرقام الطوارئ السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col bg-transparent">
              <Phone className="h-5 w-5 mb-1" />
              <span className="text-xs">الإسعاف</span>
              <span className="font-bold">997</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col bg-transparent">
              <Phone className="h-5 w-5 mb-1" />
              <span className="text-xs">الطوارئ</span>
              <span className="font-bold">911</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col bg-transparent">
              <Phone className="h-5 w-5 mb-1" />
              <span className="text-xs">مركز السموم</span>
              <span className="font-bold">920000119</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col bg-transparent">
              <Phone className="h-5 w-5 mb-1" />
              <span className="text-xs">الدعم النفسي</span>
              <span className="font-bold">920033360</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SpecialistDialog({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    hospital: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", specialty: "", phone: "", email: "", hospital: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="specialistName">اسم الطبيب *</Label>
        <Input
          id="specialistName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="د. سارة أحمد"
        />
      </div>
      <div>
        <Label htmlFor="specialistSpecialty">التخصص</Label>
        <Select onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
          <SelectTrigger>
            <SelectValue placeholder="اختر التخصص" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="طب قلب">طب قلب</SelectItem>
            <SelectItem value="طب عظام">طب عظام</SelectItem>
            <SelectItem value="طب عيون">طب عيون</SelectItem>
            <SelectItem value="طب أنف وأذن وحنجرة">طب أنف وأذن وحنجرة</SelectItem>
            <SelectItem value="طب جلدية">طب جلدية</SelectItem>
            <SelectItem value="طب نفسي">طب نفسي</SelectItem>
            <SelectItem value="طب أعصاب">طب أعصاب</SelectItem>
            <SelectItem value="طب كلى">طب كلى</SelectItem>
            <SelectItem value="طب غدد صماء">طب غدد صماء</SelectItem>
            <SelectItem value="طب روماتيزم">طب روماتيزم</SelectItem>
            <SelectItem value="جراحة تجميل">جراحة تجميل</SelectItem>
            <SelectItem value="أخرى">أخرى</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="specialistPhone">رقم الهاتف</Label>
        <Input
          id="specialistPhone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+966 50 123 4567"
        />
      </div>
      <div>
        <Label htmlFor="specialistEmail">البريد الإلكتروني</Label>
        <Input
          id="specialistEmail"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="doctor@hospital.com"
        />
      </div>
      <div>
        <Label htmlFor="specialistHospital">المستشفى أو العيادة</Label>
        <Input
          id="specialistHospital"
          value={formData.hospital}
          onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
          placeholder="مستشفى الملك فهد"
        />
      </div>
      <Button type="submit" className="w-full">
        إضافة
      </Button>
    </form>
  )
}
