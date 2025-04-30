"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, Upload } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { reportItem } from "@/lib/api"

export default function ReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get("type") === "found" ? "found" : "lost"

  const [formData, setFormData] = useState({
    type: initialType,
    name: "",
    description: "",
    location: "",
    date: new Date(),
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, image: file }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate image is provided
    if (!formData.image) {
      setError("Please upload an image of the item")
      setIsSubmitting(false)
      return
    }

    try {
      await reportItem({
        type: formData.type,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        image: formData.image,
      })
      router.push(formData.type === "lost" ? "/lost-items" : "/found-items")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to report item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const locationLabel = formData.type === "lost" ? "Lost Location" : "Found Location"
  const dateLabel = formData.type === "lost" ? "Lost Date" : "Found Date"

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Report an Item</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label>Item Status</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lost" id="lost" />
              <Label htmlFor="lost" className="cursor-pointer">
                I lost this item
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="found" id="found" />
              <Label htmlFor="found" className="cursor-pointer">
                I found this item
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Blue Backpack, Student ID Card"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide details about the item (color, brand, distinguishing features, etc.)"
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{locationLabel}</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={`Where was the item ${formData.type === "lost" ? "lost" : "found"}?`}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">{dateLabel}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? formatDate(formData.date) : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">
            Image <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                </div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  required
                />
              </label>
            </div>
            {imagePreview && (
              <div className="relative h-32 rounded-md overflow-hidden">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Image is required to help others identify the item</p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </form>
    </div>
  )
}
