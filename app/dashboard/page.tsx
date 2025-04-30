"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ItemCard } from "@/components/item-card"
import { Plus } from "lucide-react"
import { fetchUserItems } from "@/lib/api"
import type { LostItem, FoundItem } from "@/lib/types"

export default function DashboardPage() {
  const [lostItems, setLostItems] = useState<LostItem[]>([])
  const [foundItems, setFoundItems] = useState<FoundItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true)
        const { lostItems, foundItems } = await fetchUserItems()
        setLostItems(lostItems)
        setFoundItems(foundItems)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch user items:", error)
        setError("Failed to load your items. Please try again later.")
        setLostItems([])
        setFoundItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [])

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your lost and found items</p>
        </div>
        <Link href="/report">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Report New Item
          </Button>
        </Link>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <Tabs defaultValue="lost" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="lost">My Lost Items</TabsTrigger>
          <TabsTrigger value="found">My Found Items</TabsTrigger>
        </TabsList>
        <TabsContent value="lost">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : lostItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostItems.map((item) => (
                <ItemCard key={item.itemId} item={item} type="lost" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No lost items reported</h3>
              <p className="text-muted-foreground mb-6">You haven't reported any lost items yet.</p>
              <Link href="/report?type=lost">
                <Button>Report a Lost Item</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        <TabsContent value="found">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : foundItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
                <ItemCard key={item.itemId} item={item} type="found" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No found items reported</h3>
              <p className="text-muted-foreground mb-6">You haven't reported any found items yet.</p>
              <Link href="/report?type=found">
                <Button>Report a Found Item</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
