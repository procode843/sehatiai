import type { MedicalProfileData } from "../schemas"

// Client-side PDF generation using browser APIs
export async function generatePDF(data: MedicalProfileData): Promise<void> {
  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    throw new Error("Unable to open print window")
  }

  // Generate HTML content for PDF
  const htmlContent = generatePDFHTML(data)

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
}

function generatePDFHTML(data: MedicalProfileData): string {
  const currentDate = new Date().toLocaleDateString("ar-SA")

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>الملف الطبي الشخصي</title>
      <style>
        body {
          font-family: 'Tajawal', Arial, sans-serif;
          margin: 20px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #0d9488;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #0d9488;
          margin: 0;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          background-color: #0d9488;
          color: white;
          padding: 10px;
          margin-bottom: 15px;
          font-weight: bold;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        .info-item {
          border: 1px solid #e5e7eb;
          padding: 10px;
          border-radius: 5px;
        }
        .info-label {
          font-weight: bold;
          color: #0d9488;
          margin-bottom: 5px;
        }
        .info-value {
          color: #374151;
        }
        .list-item {
          background-color: #f9fafb;
          padding: 8px;
          margin-bottom: 5px;
          border-radius: 3px;
          border-right: 3px solid #0d9488;
        }
        .emergency-item {
          background-color: #fef2f2;
          border-right-color: #dc2626;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>الملف الطبي الشخصي</h1>
        <p>تاريخ الإنشاء: ${currentDate}</p>
      </div>

      <!-- Basic Information -->
      <div class="section">
        <div class="section-title">المعلومات الأساسية</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">الاسم الكامل</div>
            <div class="info-value">${data.basicInfo?.firstName || ""} ${data.basicInfo?.lastName || ""}</div>
          </div>
          <div class="info-item">
            <div class="info-label">تاريخ الميلاد</div>
            <div class="info-value">${data.basicInfo?.dateOfBirth || ""}</div>
          </div>
          <div class="info-item">
            <div class="info-label">الجنس</div>
            <div class="info-value">${data.basicInfo?.gender === "male" ? "ذكر" : "أنثى"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">رقم الهاتف</div>
            <div class="info-value">${data.basicInfo?.phone || ""}</div>
          </div>
        </div>
      </div>

      <!-- Current Conditions -->
      ${
        data.conditions?.currentConditions?.length
          ? `
      <div class="section">
        <div class="section-title">الحالات الطبية الحالية</div>
        ${data.conditions.currentConditions
          .map(
            (condition) => `
          <div class="list-item">
            <strong>${condition.name}</strong>
            ${condition.severity ? `<br><small>الشدة: ${condition.severity}</small>` : ""}
            ${condition.diagnosedDate ? `<br><small>تاريخ التشخيص: ${condition.diagnosedDate}</small>` : ""}
          </div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      <!-- Current Medications -->
      ${
        data.medications?.currentMedications?.length
          ? `
      <div class="section">
        <div class="section-title">الأدوية الحالية</div>
        ${data.medications.currentMedications
          .map(
            (medication) => `
          <div class="list-item">
            <strong>${medication.name}</strong>
            ${medication.dosage ? `<br><small>الجرعة: ${medication.dosage}</small>` : ""}
            ${medication.frequency ? `<br><small>التكرار: ${medication.frequency}</small>` : ""}
          </div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      <!-- Allergies -->
      ${
        data.medications?.allergies?.length
          ? `
      <div class="section">
        <div class="section-title">الحساسية</div>
        ${data.medications.allergies
          .map(
            (allergy) => `
          <div class="list-item emergency-item">
            <strong>${allergy.allergen}</strong>
            ${allergy.reaction ? `<br><small>رد الفعل: ${allergy.reaction}</small>` : ""}
            ${allergy.severity ? `<br><small>الشدة: ${allergy.severity}</small>` : ""}
          </div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      <!-- Vital Signs -->
      <div class="section">
        <div class="section-title">القياسات الحيوية</div>
        <div class="info-grid">
          ${
            data.vitals?.height
              ? `
          <div class="info-item">
            <div class="info-label">الطول</div>
            <div class="info-value">${data.vitals.height} سم</div>
          </div>
          `
              : ""
          }
          ${
            data.vitals?.weight
              ? `
          <div class="info-item">
            <div class="info-label">الوزن</div>
            <div class="info-value">${data.vitals.weight} كجم</div>
          </div>
          `
              : ""
          }
          ${
            data.vitals?.bloodType
              ? `
          <div class="info-item">
            <div class="info-label">فصيلة الدم</div>
            <div class="info-value">${data.vitals.bloodType}</div>
          </div>
          `
              : ""
          }
        </div>
      </div>

      <!-- Emergency Contact -->
      ${
        data.basicInfo?.emergencyContact?.name
          ? `
      <div class="section">
        <div class="section-title">جهة الاتصال في الطوارئ</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">الاسم</div>
            <div class="info-value">${data.basicInfo.emergencyContact.name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">رقم الهاتف</div>
            <div class="info-value">${data.basicInfo.emergencyContact.phone}</div>
          </div>
          <div class="info-item">
            <div class="info-label">العلاقة</div>
            <div class="info-value">${data.basicInfo.emergencyContact.relationship}</div>
          </div>
        </div>
      </div>
      `
          : ""
      }

      <div class="footer">
        <p>تم إنشاء هذا الملف بواسطة تطبيق صحتي • ${currentDate}</p>
        <p>هذا الملف سري ويحتوي على معلومات طبية حساسة</p>
      </div>
    </body>
    </html>
  `
}
