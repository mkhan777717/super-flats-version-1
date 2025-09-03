"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface Property {
  id: string
  name: string
  location: string
  bhk: string
  rent: number
  deposit: number
  availability: "Available" | "Rented" | "Maintenance"
  images: string[]
  createdAt: string
  description?: string
  amenities?: string[]
  area?: number
  furnished?: "Fully Furnished" | "Semi Furnished" | "Unfurnished"
  parking?: boolean
  contact?: string
}

interface PropertyFormProps {
  property?: Property
  onSubmit: (property: Omit<Property, "id" | "createdAt">) => void
  onCancel: () => void
  title: string
}

export function PropertyForm({ property, onSubmit, onCancel, title }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    bhk: "",
    rent: 0,
    deposit: 0,
    availability: "Available" as const,
    images: [] as string[],
    description: "",
    amenities: [] as string[],
    area: 0,
    furnished: "Unfurnished" as const,
    parking: false,
    contact: "",
  })

  const [newAmenity, setNewAmenity] = useState("")

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        location: property.location,
        bhk: property.bhk,
        rent: property.rent,
        deposit: property.deposit,
        availability: property.availability,
        images: property.images,
        description: property.description || "",
        amenities: property.amenities || [],
        area: property.area || 0,
        furnished: property.furnished || "Unfurnished",
        parking: property.parking || false,
        contact: property.contact || "",
      })
    }
  }, [property])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }))
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X size={20} />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div>
                    <Label htmlFor="name">Property Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., 2BHK Duplex Semi Furnished"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., BTM Layout, Bangalore"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bhk">Property Type</Label>
                    <Select
                      value={formData.bhk}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, bhk: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select BHK type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1BHK">1BHK</SelectItem>
                        <SelectItem value="2BHK">2BHK</SelectItem>
                        <SelectItem value="3BHK">3BHK</SelectItem>
                        <SelectItem value="4BHK">4BHK</SelectItem>
                        <SelectItem value="Studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="area">Area (sq ft)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData((prev) => ({ ...prev, area: Number.parseInt(e.target.value) || 0 }))}
                      placeholder="1200"
                    />
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Financial Details</h3>

                  <div>
                    <Label htmlFor="rent">Monthly Rent (₹)</Label>
                    <Input
                      id="rent"
                      type="number"
                      value={formData.rent}
                      onChange={(e) => setFormData((prev) => ({ ...prev, rent: Number.parseInt(e.target.value) || 0 }))}
                      placeholder="25000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="deposit">Security Deposit (₹)</Label>
                    <Input
                      id="deposit"
                      type="number"
                      value={formData.deposit}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, deposit: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="50000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="furnished">Furnished Status</Label>
                    <Select
                      value={formData.furnished}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, furnished: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select furnished status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                        <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                        <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="availability">Availability Status</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, availability: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the property features, location benefits, etc."
                  rows={3}
                />
              </div>

              {/* Contact Information */}
              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                  placeholder="+91 9876543210"
                />
              </div>

              {/* Amenities */}
              <div>
                <Label>Amenities</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity (e.g., Parking, Gym)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" onClick={addAmenity} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <button type="button" onClick={() => removeAmenity(amenity)} className="ml-1 hover:text-red-600">
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Parking */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="parking"
                  checked={formData.parking}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parking: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="parking">Parking Available</Label>
              </div>

              <div>
                <Label className="text-lg font-semibold">Property Images</Label>
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                  maxFiles={15}
                  maxSizePerFile={10}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {property ? "Update Property" : "Add Property"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
