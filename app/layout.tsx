import type React from "react";
import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "صحتي - أسرع طريق لصحتك",
  description:
    "منصة ذكية لتوجيهك إلى أفضل المستشفيات والأطباء المناسبين لحالتك الصحية",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans antialiased">
        {children} <Toaster />
      </body>
    </html>
  );
}
