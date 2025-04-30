"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { isLoggedIn, logoutUser } from "@/lib/auth"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status whenever the component mounts or pathname changes
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const authStatus = isLoggedIn()
        setIsAuthenticated(authStatus)
      }
    }

    checkAuth()

    // Add event listener for storage changes (for when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [pathname])

  const handleLogout = () => {
    logoutUser()
    setIsAuthenticated(false)
    router.push("/")
    // Trigger storage event to update other tabs
    window.localStorage.setItem("logout-event", Date.now().toString())
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Campus Lost & Found</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/lost-items" className="text-sm font-medium hover:underline">
            Lost Items
          </Link>
          <Link href="/found-items" className="text-sm font-medium hover:underline">
            Found Items
          </Link>
          {isAuthenticated && (
            <Link href="/report" className="text-sm font-medium hover:underline">
              Report Item
            </Link>
          )}
        </nav>
        <div className="hidden md:flex gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  My Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <nav className="flex flex-col gap-4">
            <Link
              href="/lost-items"
              className="text-sm font-medium hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Lost Items
            </Link>
            <Link
              href="/found-items"
              className="text-sm font-medium hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Found Items
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/report"
                  className="text-sm font-medium hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Report Item
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <button
                  className="text-sm font-medium text-left text-red-500 hover:underline"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  Sign Out
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  href="/auth/sign-in"
                  className="text-sm font-medium hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="text-sm font-medium hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
