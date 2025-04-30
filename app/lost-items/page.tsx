"use client"

import { useState, useEffect } from "react"
import { ItemCard } from "@/components/item-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { fetchLostItems } from "@/lib/api"
import type { LostItem } from "@/lib/types"

export default function LostItemsPage() {
  const [items, setItems] = useState<LostItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true)
        const data = await fetchLostItems()
        setItems(data)
        setError(null)
      } catch (error) {
        console.error("Failed to fetch lost items:", error)
        setError("Failed to load lost items. Please try again later.")
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [])

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.lostLocation && item.lostLocation.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lost Items</h1>
          <p className="text-muted-foreground">
            Browse through items that have been reported as lost but not yet found
          </p>
        </div>
        <Link href="/report?type=lost">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Report Lost Item
          </Button>
        </Link>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, description, or location..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.itemId} item={item} type="lost" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No lost items found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "No items match your search criteria. Try a different search term."
              : "There are currently no lost items reported. Check back later or report a lost item."}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
