import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { LostItem, FoundItem } from "@/lib/types"

interface ItemCardProps {
  item: LostItem | FoundItem
  type: "lost" | "found"
}

export function ItemCard({ item, type }: ItemCardProps) {
  // Handle both item types
  const name = item.itemName
  const description = item.description
  const location =
    type === "lost"
      ? "lostLocation" in item
        ? item.lostLocation
        : null
      : "foundLocation" in item
        ? item.foundLocation
        : null
  const date = type === "lost" ? ("lostDate" in item ? item.lostDate : "") : "foundDate" in item ? item.foundDate : ""
  const image = item.imageUrl || "/placeholder.svg?height=400&width=400"

  return (
    <Link href={`/items/${item.itemId}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-square relative">
          <Image src={image || "/placeholder.svg?height=400&width=400"} alt={name} fill className="object-cover" />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
            {type === "lost" ? (
              <Badge variant="destructive" className="ml-2">
                Lost
              </Badge>
            ) : (
              <Badge variant="success" className="ml-2">
                Found
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="line-clamp-1">{location || "Unknown location"}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>{formatDate(date)}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
