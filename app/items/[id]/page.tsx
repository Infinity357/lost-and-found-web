"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ArrowLeft, User, Mail, AlertCircle, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import {
  fetchLostItemById,
  fetchFoundItemById,
  fetchUserInfo,
  deleteItem,
  submitFoundClaim,
  submitLostClaim,
} from "@/lib/api"
import { isLoggedIn, getCurrentUserId } from "@/lib/auth"
import type { LostItem, FoundItem, Claim } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<LostItem | FoundItem | null>(null)
  const [itemType, setItemType] = useState<"lost" | "found">("lost")
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  // Add a new state for the poster's information
  const [posterInfo, setPosterInfo] = useState<{ firstName: string; lastName: string; email: string } | null>(null)

  useEffect(() => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      const loggedIn = isLoggedIn()
      setIsAuthenticated(loggedIn)
      if (loggedIn) {
        setUserId(getCurrentUserId())
      }
    }
  }, [])

  // Add a function to check if the user came from the dashboard
  const [fromDashboard, setFromDashboard] = useState(false)

  useEffect(() => {
    // Check if the user navigated from the dashboard
    if (typeof window !== "undefined") {
      const referrer = document.referrer
      if (referrer && referrer.includes("/dashboard")) {
        setFromDashboard(true)
      }
    }
  }, [])

  // Update the loadItem function to fetch the poster's information
  const loadItem = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (typeof params.id !== "string") return

      // Determine if this is a lost or found item
      try {
        const lostItem = await fetchLostItemById(params.id)
        if (lostItem) {
          setItem(lostItem)
          setItemType("lost")

          // Check if current user is the owner
          const currentUserId = getCurrentUserId()
          const isItemOwner = Boolean(currentUserId && lostItem.userId === currentUserId)
          setIsOwner(isItemOwner)

          // Fetch the poster's information
          try {
            const userInfo = await fetchUserInfo(lostItem.userId)
            setPosterInfo(userInfo)
          } catch (userError) {
            console.error("Failed to fetch user info:", userError)
          }

          return
        }
      } catch (error) {
        console.error("Failed to fetch lost item:", error)
      }

      try {
        const foundItem = await fetchFoundItemById(params.id)
        if (foundItem) {
          setItem(foundItem)
          setItemType("found")

          // Check if current user is the owner
          const currentUserId = getCurrentUserId()
          const isItemOwner = Boolean(currentUserId && foundItem.userId === currentUserId)
          setIsOwner(isItemOwner)

          // Fetch the poster's information
          try {
            const userInfo = await fetchUserInfo(foundItem.userId)
            setPosterInfo(userInfo)
          } catch (userError) {
            console.error("Failed to fetch user info:", userError)
          }

          return
        }
      } catch (error) {
        console.error("Failed to fetch found item:", error)
      }

      // If we get here, neither item was found
      setError("Item not found")
    } catch (error) {
      console.error("Failed to fetch item details:", error)
      setError("Failed to load item details. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItem()
  }, [params.id])

  const handleDeleteItem = async () => {
    if (!item || !window.confirm(`Are you sure you want to delete this item?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const itemId = item.itemId
      await deleteItem(itemId, itemType)
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to delete item:", error)
      setError("Failed to delete item. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleMarkAsResolved = async () => {
    if (
      !item ||
      !window.confirm(
        `Are you sure you want to mark this item as ${itemType === "lost" ? "found" : "returned"} and delete it?`,
      )
    ) {
      return
    }

    setIsDeleting(true)
    try {
      const itemId = item.itemId
      await deleteItem(itemId, itemType)
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to delete item:", error)
      setError("Failed to delete item. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClaimItem = async () => {
    if (!item) return

    setIsClaiming(true)
    setError(null)

    try {
      const itemId = item.itemId

      if (itemType === "lost") {
        // I found this lost item
        await submitFoundClaim(itemId)
      } else {
        // This found item is mine
        await submitLostClaim(itemId)
      }

      // Refresh the page to show the updated status
      router.refresh()

      // Show success message
      alert(
        itemType === "lost"
          ? "Your claim has been submitted. The owner will be notified."
          : "Your claim has been submitted. The finder will be notified.",
      )
    } catch (error) {
      console.error("Failed to claim item:", error)
      setError("Failed to submit claim. Please try again.")
    } finally {
      setIsClaiming(false)
    }
  }

  // Check if the current user has already claimed this item
  const hasUserClaimedItem = () => {
    if (!item || !userId) return false

    if (itemType === "lost" && "founderUserIds" in item) {
      return item.founderUserIds.includes(userId)
    } else if (itemType === "found" && "claimerUserIds" in item) {
      return item.claimerUserIds.includes(userId)
    }

    return false
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="w-full h-[500px] rounded-lg bg-muted animate-pulse"></div>
      </div>
    )
  }

  if (!item || error === "Item not found") {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
        <p className="mb-6">The item you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    )
  }

  // Extract common properties based on item type
  const name = item.itemName
  const description = item.description
  const location =
    itemType === "lost"
      ? "lostLocation" in item
        ? item.lostLocation
        : null
      : "foundLocation" in item
        ? item.foundLocation
        : null
  const date =
    itemType === "lost" ? ("lostDate" in item ? item.lostDate : "") : "foundDate" in item ? item.foundDate : ""
  const image = item.imageUrl || "/placeholder.svg?height=600&width=600"
  const userHasClaimed = hasUserClaimedItem()

  return (
    <div className="container py-8">
      {error && error !== "Item not found" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image src={image || "/placeholder.svg?height=600&width=600"} alt={name} fill className="object-cover" />
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold">{name}</h1>
            <Badge variant={itemType === "lost" ? "destructive" : "success"} className="text-sm">
              {itemType === "lost" ? "Lost" : "Found"}
            </Badge>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{location || "Unknown location"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatDate(date)}</span>
              </div>
            </div>

            {isOwner ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Item Management</h2>
                <div className="pt-4 space-y-3">
                  <Button variant="destructive" className="w-full" onClick={handleMarkAsResolved} disabled={isDeleting}>
                    {isDeleting ? "Processing..." : `Mark as ${itemType === "lost" ? "Found" : "Returned"} & Delete`}
                  </Button>

                  <Button variant="outline" className="w-full" onClick={handleDeleteItem} disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete Item"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4">
                <div className="mb-6 p-4 border rounded-md">
                  <h2 className="text-lg font-semibold mb-3">Posted by</h2>
                  {posterInfo ? (
                    <>
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {posterInfo.firstName} {posterInfo.lastName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">{posterInfo.email}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Loading user information...</p>
                  )}
                </div>

                {!isAuthenticated ? (
                  <div className="text-center p-4 border rounded-md">
                    <p className="mb-4">Please sign in to claim this item</p>
                    <Link href={`/auth/sign-in?redirect=/items/${item.itemId}`}>
                      <Button>Sign In</Button>
                    </Link>
                  </div>
                ) : userHasClaimed ? (
                  <div className="text-center p-4 border rounded-md bg-muted">
                    <p className="font-medium">You have already claimed this item</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      The {itemType === "lost" ? "owner" : "finder"} will contact you if they verify your claim.
                    </p>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleClaimItem} disabled={isClaiming}>
                    {isClaiming ? "Submitting..." : itemType === "lost" ? "I Found This Item" : "This Is My Item"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
