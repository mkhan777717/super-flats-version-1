"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Home, IndianRupee, Car, Phone, Calendar } from "lucide-react"

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

interface PropertyViewProps {
  property: Property
  onClose: () => void
}

export function PropertyView({ property, onClose }: PropertyViewProps) {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Rented":
        return "bg-red-100 text-red-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">{property.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Property Images */}
            {property.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`${property.name} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Property Details</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span>{property.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Home size={16} className="text-gray-500" />
                    <span>{property.bhk}</span>
                    {property.area && <span>• {property.area} sq ft</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee size={16} className="text-gray-500" />
                    <span>₹{property.rent.toLocaleString()}/month</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Deposit:</span>
                    <span>₹{property.deposit.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Furnished:</span>
                    <span>{property.furnished}</span>
                  </div>

                  {property.parking && (
                    <div className="flex items-center gap-2">
                      <Car size={16} className="text-gray-500" />
                      <span>Parking Available</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span>Added on {property.createdAt}</span>
                  </div>

                  {property.contact && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-500" />
                      <span>{property.contact}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status & Amenities</h3>

                <div>
                  <span className="text-gray-500 block mb-2">Availability:</span>
                  <Badge className={getAvailabilityColor(property.availability)}>{property.availability}</Badge>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <span className="text-gray-500 block mb-2">Amenities:</span>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
