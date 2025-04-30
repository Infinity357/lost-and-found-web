"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (!isLoggedIn()) {
      router.push("/auth/sign-in")
    }
  }, [router])

  // Don't render anything during server-side rendering or initial mount
  // This prevents hydration mismatch
  if (!mounted) {
    return null
  }

  // Only render children if authenticated
  return isLoggedIn() ? <>{children}</> : null
}
