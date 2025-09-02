"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Eye, Trash2, LogOut, Home, MapPin, IndianRupee } from "lucide-react"
import { PropertyForm } from "@/components/property-form"
import { PropertyView } from "@/components/property-view"

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

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      name: "2BHK Duplex Semi Furnished",
      location: "BTM Layout, Bangalore",
      bhk: "2BHK",
      rent: 25000,
      deposit: 50000,
      availability: "Available",
      images: ["/modern-apartment-living.png"],
      createdAt: "2024-01-15",
      description: "Beautiful 2BHK duplex apartment with modern amenities",
      amenities: ["Parking", "Security", "Gym", "Swimming Pool"],
      area: 1200,
      furnished: "Semi Furnished",
      parking: true,
      contact: "+91 9876543210",
    },
    {
      id: "2",
      name: "3BHK Fully Furnished Apartment",
      location: "Koramangala, Bangalore",
      bhk: "3BHK",
      rent: 35000,
      deposit: 70000,
      availability: "Rented",
      images: ["/luxury-apartment-interior.png"],
      createdAt: "2024-01-10",
      description: "Luxury 3BHK apartment with premium furnishing",
      amenities: ["Parking", "Security", "Gym", "Swimming Pool", "Club House"],
      area: 1800,
      furnished: "Fully Furnished",
      parking: true,
      contact: "+91 9876543211",
    },
  ])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  const handleAddProperty = (propertyData: Omit<Property, "id" | "createdAt">) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setProperties([...properties, newProperty])
    setShowAddForm(false)
  }

  const handleEditProperty = (propertyData: Omit<Property, "id" | "createdAt">) => {
    if (selectedProperty) {
      const updatedProperties = properties.map((p) =>
        p.id === selectedProperty.id
          ? { ...propertyData, id: selectedProperty.id, createdAt: selectedProperty.createdAt }
          : p,
      )
      setProperties(updatedProperties)
      setShowEditForm(false)
      setSelectedProperty(null)
    }
  }

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      setProperties(properties.filter((p) => p.id !== propertyId))
    }
  }

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property)
    setShowViewModal(true)
  }

  const handleEditClick = (property: Property) => {
    setSelectedProperty(property)
    setShowEditForm(true)
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Home className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-900">SuperFlats Admin</h1>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
                <Home className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {properties.filter((p) => p.availability === "Available").length}
                  </p>
                </div>
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rented</p>
                  <p className="text-2xl font-bold text-red-600">
                    {properties.filter((p) => p.availability === "Rented").length}
                  </p>
                </div>
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{Math.round(properties.reduce((sum, p) => sum + p.rent, 0) / properties.length).toLocaleString()}
                  </p>
                </div>
                <IndianRupee className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Management Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl font-bold">Property Management</CardTitle>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Add Property
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search properties by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Properties Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Property</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Rent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{property.name}</p>
                            <p className="text-sm text-gray-500">Added {property.createdAt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-gray-700">{property.location}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary">{property.bhk}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">₹{property.rent.toLocaleString()}/mo</p>
                          <p className="text-sm text-gray-500">₹{property.deposit.toLocaleString()} deposit</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getAvailabilityColor(property.availability)}>{property.availability}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2 bg-transparent"
                            onClick={() => handleViewProperty(property)}
                          >
                            <Eye size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2 bg-transparent"
                            onClick={() => handleEditClick(property)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2 text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No properties found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Property Management Modals */}
      {showAddForm && (
        <PropertyForm onSubmit={handleAddProperty} onCancel={() => setShowAddForm(false)} title="Add New Property" />
      )}

      {showEditForm && selectedProperty && (
        <PropertyForm
          property={selectedProperty}
          onSubmit={handleEditProperty}
          onCancel={() => {
            setShowEditForm(false)
            setSelectedProperty(null)
          }}
          title="Edit Property"
        />
      )}

      {showViewModal && selectedProperty && (
        <PropertyView
          property={selectedProperty}
          onClose={() => {
            setShowViewModal(false)
            setSelectedProperty(null)
          }}
        />
      )}
    </div>
  )
}
