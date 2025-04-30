import type { LostItem, FoundItem, Claim, User } from "./types"
import { getCurrentUserId } from "./auth"

// API functions for lost items
export async function fetchLostItems(): Promise<LostItem[]> {
  try {
    const response = await fetch("https://lost-and-found-api-production.up.railway.app/lost", {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch lost items: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching lost items:", error)
    throw error
  }
}

// Fetch lost items for a specific user
export async function fetchUserLostItems(userId: string): Promise<LostItem[]> {
  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/lost?userId=${userId}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user lost items: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user lost items:", error)
    throw error
  }
}

// API functions for found items
export async function fetchFoundItems(): Promise<FoundItem[]> {
  try {
    const response = await fetch("https://lost-and-found-api-production.up.railway.app/found", {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch found items: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching found items:", error)
    throw error
  }
}

// Fetch found items for a specific user
export async function fetchUserFoundItems(userId: string): Promise<FoundItem[]> {
  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/found?userId=${userId}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user found items: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user found items:", error)
    throw error
  }
}

// Fetch a specific lost item by ID
export async function fetchLostItemById(itemId: string): Promise<LostItem | null> {
  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/lost/${itemId}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch lost item: ${response.status}`)
    }

    const item = await response.json()

    // Check if current user is the owner
    const userId = getCurrentUserId()
    if (userId && item.userId === userId) {
      item.isOwner = true
    }

    return item
  } catch (error) {
    console.error("Error fetching lost item:", error)
    throw error
  }
}

// Fetch a specific found item by ID
export async function fetchFoundItemById(itemId: string): Promise<FoundItem | null> {
  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/found/${itemId}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch found item: ${response.status}`)
    }

    const item = await response.json()

    // Check if current user is the owner
    const userId = getCurrentUserId()
    if (userId && item.userId === userId) {
      item.isOwner = true
    }

    return item
  } catch (error) {
    console.error("Error fetching found item:", error)
    throw error
  }
}

// Fetch user information for claims
export async function fetchUserInfo(userId: string): Promise<User> {
  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/auth?userId=${userId}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user info:", error)
    throw error
  }
}

// Fetch claims for a lost item (users who found it)
export async function fetchLostItemClaims(itemId: string): Promise<Claim[]> {
  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/lost/${itemId}/claims`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch lost item claims: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching lost item claims:", error)
    throw error
  }
}

// Fetch claims for a found item (users who claim it's theirs)
export async function fetchFoundItemClaims(itemId: string): Promise<Claim[]> {
  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/found/${itemId}/claims`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch found item claims: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching found item claims:", error)
    throw error
  }
}

// Submit a claim for a lost item (I found this lost item)
export async function submitFoundClaim(itemId: string): Promise<void> {
  const userId = getCurrentUserId()
  if (!userId) throw new Error("User not authenticated")

  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/lost/${itemId}/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to submit claim")
    }
  } catch (error) {
    console.error("Error submitting found claim:", error)
    throw error
  }
}

// Submit a claim for a found item (This is my item)
export async function submitLostClaim(itemId: string): Promise<void> {
  const userId = getCurrentUserId()
  if (!userId) throw new Error("User not authenticated")

  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/found/${itemId}/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to submit claim")
    }
  } catch (error) {
    console.error("Error submitting lost claim:", error)
    throw error
  }
}

// Upload an image
export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch("https://lost-and-found-api-production.up.railway.app/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to upload image")
    }

    const data = await response.json()
    return data.imageUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

// Report a lost item
export async function reportLostItem(formData: {
  itemName: string
  description: string
  lostLocation: string
  lostDate: Date
  image: File | null
}): Promise<void> {
  const userId = getCurrentUserId()
  if (!userId) throw new Error("User not authenticated")

  try {
    // First upload the image if provided
    let imageUrl = null
    if (formData.image) {
      imageUrl = await uploadImage(formData.image)
    }

    // Then create the item with the image URL
    const response = await fetch("https://lost-and-found-api-production.up.railway.app/lost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        itemName: formData.itemName,
        description: formData.description,
        lostLocation: formData.lostLocation,
        lostDate: formData.lostDate.toISOString(),
        imageUrl,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to report lost item")
    }
  } catch (error) {
    console.error("Error reporting lost item:", error)
    throw error
  }
}

// Report a found item
export async function reportFoundItem(formData: {
  itemName: string
  description: string
  foundLocation: string
  foundDate: Date
  image: File | null
}): Promise<void> {
  const userId = getCurrentUserId()
  if (!userId) throw new Error("User not authenticated")

  try {
    // First upload the image if provided
    let imageUrl = null
    if (formData.image) {
      imageUrl = await uploadImage(formData.image)
    }

    // Then create the item with the image URL
    const response = await fetch("https://lost-and-found-api-production.up.railway.app/found", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        itemName: formData.itemName,
        description: formData.description,
        foundLocation: formData.foundLocation,
        foundDate: formData.foundDate.toISOString(),
        imageUrl,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to report found item")
    }
  } catch (error) {
    console.error("Error reporting found item:", error)
    throw error
  }
}

// Delete a lost item
export async function deleteLostItem(itemId: string): Promise<void> {
  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/lost/${itemId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete lost item")
    }
  } catch (error) {
    console.error("Error deleting lost item:", error)
    throw error
  }
}

// Delete a found item
export async function deleteFoundItem(itemId: string): Promise<void> {
  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/found/${itemId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete found item")
    }
  } catch (error) {
    console.error("Error deleting found item:", error)
    throw error
  }
}

// Generic function to report an item (either lost or found)
export async function reportItem(formData: {
  type: string
  name: string
  description: string
  location: string
  date: Date
  image: File | null
}): Promise<void> {
  if (formData.type === "lost") {
    await reportLostItem({
      itemName: formData.name,
      description: formData.description,
      lostLocation: formData.location,
      lostDate: formData.date,
      image: formData.image,
    })
  } else {
    await reportFoundItem({
      itemName: formData.name,
      description: formData.description,
      foundLocation: formData.location,
      foundDate: formData.date,
      image: formData.image,
    })
  }
}

// Generic function to delete an item (either lost or found)
export async function deleteItem(itemId: string, type: "lost" | "found"): Promise<void> {
  if (type === "lost") {
    await deleteLostItem(itemId)
  } else {
    await deleteFoundItem(itemId)
  }
}

// Fetch user items (both lost and found)
export async function fetchUserItems(): Promise<{ lostItems: LostItem[]; foundItems: FoundItem[] }> {
  const userId = getCurrentUserId()
  if (!userId) {
    return { lostItems: [], foundItems: [] }
  }

  try {
    const [lostItems, foundItems] = await Promise.all([fetchUserLostItems(userId), fetchUserFoundItems(userId)])

    return { lostItems, foundItems }
  } catch (error) {
    console.error("Error fetching user items:", error)
    throw error
  }
}

export async function submitClaim(
  itemId: string,
  formData: { name: string; email: string; message: string },
): Promise<void> {
  const userId = getCurrentUserId()
  if (!userId) throw new Error("User not authenticated")

  try {
    const response = await fetch(`https://lost-and-found-api-production.up.railway.app/claims/${itemId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        ...formData,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to submit claim")
    }
  } catch (error) {
    console.error("Error submitting claim:", error)
    throw error
  }
}
