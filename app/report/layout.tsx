import type React from "react"
import { AuthGuard } from "@/components/auth-guard"

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
