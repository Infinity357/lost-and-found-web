"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useState } from "react"

export function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Only render the ThemeProvider after the component has mounted
  // This prevents hydration mismatch errors
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}
