"use client"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Heart, Pill, Activity, Users, CheckCircle } from "lucide-react"

export function ReviewForm() {
  const { getValues } = useFormContext()
  const formData = getValues()

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <User className="h-8 w-8 mx-auto mb-2 text-teal-600" />
            <p className="text-sm text-gray-600">المعلومات الأساسية</p>
            <p className="font-semibold">مكتملة</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm text-gray-600">الحالات الطبية</p>
            <p className="font-semibold">{formData.conditions?.currentConditions?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Pill className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-gray-600">الأدوية</p>
            <p className="font-semibold">{formData.medications?.currentMedications?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm text-gray-600">الفحوصات</p>
            <p className="font-semibold">{formData.vitals?.recentTests?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-sm text-gray-600">الأطباء</p>
            <p className="font-semibold">{(formData.supporters?.specialists?.length || 0) + 1}</p>
          </CardContent>
        </Card>
      </div>

      {/* Basic Information Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">الاسم الكامل</p>
              <p className="font-medium">
                {formData.basicInfo?.firstName} {formData.basicInfo?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">تاريخ الميلاد</p>
              <p className="font-medium">{formData.basicInfo?.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">الجنس</p>
              <p className="font-medium">{formData.basicInfo?.gender === "male" ? "ذكر" : "أنثى"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">رقم الهاتف</p>
              <p className="font-medium">{formData.basicInfo?.phone}</p>
            </div>
            {formData.basicInfo?.email && (
              <div>
                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                <p className="font-medium">{formData.basicInfo.email}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">جهة الاتصال في الطوارئ</p>
              <p className="font-medium">
                {formData.basicInfo?.emergencyContact?.name} ({formData.basicInfo?.emergencyContact?.relationship})
              </p>
              <p className="text-sm text-gray-500">{formData.basicInfo?.emergencyContact?.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Conditions Review */}
      {formData.conditions?.currentConditions?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              الحالات الطبية الحالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.conditions.currentConditions.map((condition: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">{condition.name}</span>
                  {condition.severity && (
                    <Badge variant={condition.severity === "شديد" ? "destructive" : "secondary"}>
                      {condition.severity}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications Review */}
      {formData.medications?.currentMedications?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              الأدوية الحالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.medications.currentMedications.map((medication: any, index: number) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">{medication.name}</p>
                  <p className="text-sm text-gray-600">
                    {medication.dosage && `الجرعة: ${medication.dosage}`}
                    {medication.frequency && ` • التكرار: ${medication.frequency}`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allergies Review */}
      {formData.medications?.allergies?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">الحساسية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.medications.allergies.map((allergy: any, index: number) => (
                <div key={index} className="p-2 bg-red-50 rounded border border-red-200">
                  <p className="font-medium text-red-800">{allergy.allergen}</p>
                  {allergy.reaction && <p className="text-sm text-red-600">رد الفعل: {allergy.reaction}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vitals Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            القياسات الحيوية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formData.vitals?.height && (
              <div>
                <p className="text-sm text-gray-600">الطول</p>
                <p className="font-medium">{formData.vitals.height} سم</p>
              </div>
            )}
            {formData.vitals?.weight && (
              <div>
                <p className="text-sm text-gray-600">الوزن</p>
                <p className="font-medium">{formData.vitals.weight} كجم</p>
              </div>
            )}
            {formData.vitals?.bloodType && (
              <div>
                <p className="text-sm text-gray-600">فصيلة الدم</p>
                <p className="font-medium">{formData.vitals.bloodType}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Supporters Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            الفريق الطبي
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.supporters?.primaryDoctor?.name && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">الطبيب الأساسي</p>
              <p className="font-medium">{formData.supporters.primaryDoctor.name}</p>
              {formData.supporters.primaryDoctor.specialty && (
                <p className="text-sm text-gray-500">{formData.supporters.primaryDoctor.specialty}</p>
              )}
            </div>
          )}

          {formData.supporters?.specialists?.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">الأطباء المختصون</p>
              <div className="space-y-1">
                {formData.supporters.specialists.map((specialist: any, index: number) => (
                  <p key={index} className="text-sm">
                    {specialist.name} - {specialist.specialty}
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">تم إكمال الملف الطبي بنجاح</h3>
          <p className="text-green-700">يمكنك الآن حفظ الملف أو تصديره أو مشاركته مع فريقك الطبي</p>
        </CardContent>
      </Card>
    </div>
  )
}
