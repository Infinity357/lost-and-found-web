import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClientThemeProvider } from "@/components/client-theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Campus Lost & Found",
  description: "A platform to help students find lost items and return found ones",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  )
}
