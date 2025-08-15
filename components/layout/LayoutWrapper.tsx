"use client"

import { usePathname } from "next/navigation"
import MainHeader from "@/components/layout/Header"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMainPage = pathname === "/"

  return (
    <>
      {!isMainPage && <MainHeader />}
      {children}
    </>
  )
}
