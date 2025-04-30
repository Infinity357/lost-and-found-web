// Authentication functions
import type { LoginData, RegisterData, LoginResponse } from "./types"

// Function to handle user login
export async function loginUser(data: LoginData): Promise<string> {
  try {
    const response = await fetch("https://lost-and-found-api-production.up.railway.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to login")
    }

    const userData: LoginResponse = await response.json()

    // Store all user data
    localStorage.setItem("userId", userData.userId)
    localStorage.setItem("userFirstName", userData.firstName)
    localStorage.setItem("userLastName", userData.lastName)
    localStorage.setItem("userEmail", userData.email)

    // Trigger storage event to update other components
    window.localStorage.setItem("login-event", Date.now().toString())

    return userData.userId
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Function to handle user registration
export async function registerUser(data: RegisterData): Promise<string> {
  try {
    const response = await fetch("https://lost-and-found-api-production.up.railway.app/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to register")
    }

    const userData: LoginResponse = await response.json()

    // Store all user data
    localStorage.setItem("userId", userData.userId)
    localStorage.setItem("userFirstName", userData.firstName)
    localStorage.setItem("userLastName", userData.lastName)
    localStorage.setItem("userEmail", userData.email)

    // Trigger storage event to update other components
    window.localStorage.setItem("login-event", Date.now().toString())

    return userData.userId
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

// Function to check if user is logged in
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("userId")
}

// Function to get the current user ID
export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userId")
}

// Function to get current user info
export function getCurrentUserInfo(): { firstName: string; lastName: string; email: string } | null {
  if (typeof window === "undefined") return null

  const firstName = localStorage.getItem("userFirstName")
  const lastName = localStorage.getItem("userLastName")
  const email = localStorage.getItem("userEmail")

  if (!firstName || !lastName || !email) return null

  return { firstName, lastName, email }
}

// Function to log out the user
export function logoutUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("userId")
  localStorage.removeItem("userFirstName")
  localStorage.removeItem("userLastName")
  localStorage.removeItem("userEmail")

  // Trigger storage event to update other components
  window.localStorage.setItem("logout-event", Date.now().toString())
}
