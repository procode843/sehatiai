"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function BasicInfoForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            المعلومات الشخصية
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>أدخل معلوماتك الشخصية الأساسية</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">الاسم الأول *</Label>
            <Input
              id="firstName"
              {...register("basicInfo.firstName")}
              className={errors.basicInfo?.firstName ? "border-red-500" : ""}
            />
            {errors.basicInfo?.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.basicInfo.firstName.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">اسم العائلة *</Label>
            <Input
              id="lastName"
              {...register("basicInfo.lastName")}
              className={errors.basicInfo?.lastName ? "border-red-500" : ""}
            />
            {errors.basicInfo?.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.basicInfo.lastName.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dateOfBirth">تاريخ الميلاد *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register("basicInfo.dateOfBirth")}
              className={errors.basicInfo?.dateOfBirth ? "border-red-500" : ""}
            />
            {errors.basicInfo?.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.basicInfo.dateOfBirth.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gender">الجنس *</Label>
            <Select onValueChange={(value) => setValue("basicInfo.gender", value)}>
              <SelectTrigger className={errors.basicInfo?.gender ? "border-red-500" : ""}>
                <SelectValue placeholder="اختر الجنس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">ذكر</SelectItem>
                <SelectItem value="female">أنثى</SelectItem>
              </SelectContent>
            </Select>
            {errors.basicInfo?.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.basicInfo.gender.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              type="tel"
              {...register("basicInfo.phone")}
              className={errors.basicInfo?.phone ? "border-red-500" : ""}
              placeholder="+966 50 123 4567"
            />
            {errors.basicInfo?.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.basicInfo.phone.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              {...register("basicInfo.email")}
              className={errors.basicInfo?.email ? "border-red-500" : ""}
              placeholder="example@email.com"
            />
            {errors.basicInfo?.email && (
              <p className="text-red-500 text-sm mt-1">{errors.basicInfo.email.message as string}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            جهة الاتصال في حالات الطوارئ
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>شخص يمكن الاتصال به في حالات الطوارئ الطبية</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="emergencyName">الاسم *</Label>
            <Input
              id="emergencyName"
              {...register("basicInfo.emergencyContact.name")}
              className={errors.basicInfo?.emergencyContact?.name ? "border-red-500" : ""}
            />
            {errors.basicInfo?.emergencyContact?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.basicInfo.emergencyContact.name.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="emergencyPhone">رقم الهاتف *</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              {...register("basicInfo.emergencyContact.phone")}
              className={errors.basicInfo?.emergencyContact?.phone ? "border-red-500" : ""}
            />
            {errors.basicInfo?.emergencyContact?.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.basicInfo.emergencyContact.phone.message as string}</p>
            )}
          </div>

          <div>
            <Label htmlFor="emergencyRelationship">العلاقة *</Label>
            <Select onValueChange={(value) => setValue("basicInfo.emergencyContact.relationship", value)}>
              <SelectTrigger className={errors.basicInfo?.emergencyContact?.relationship ? "border-red-500" : ""}>
                <SelectValue placeholder="اختر العلاقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spouse">الزوج/الزوجة</SelectItem>
                <SelectItem value="parent">الوالد/الوالدة</SelectItem>
                <SelectItem value="sibling">الأخ/الأخت</SelectItem>
                <SelectItem value="child">الابن/الابنة</SelectItem>
                <SelectItem value="friend">صديق</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
            {errors.basicInfo?.emergencyContact?.relationship && (
              <p className="text-red-500 text-sm mt-1">
                {errors.basicInfo.emergencyContact.relationship.message as string}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
