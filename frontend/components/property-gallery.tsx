"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Home,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from "lucide-react";
import Link from "next/link";

interface Property {
  id: string;
  name: string;
  location: string;
  bhk: string;
  rent: number;
  deposit: number;
  availability: "Available" | "Rented" | "Maintenance";
  images: string[];
  createdAt: string;
  description?: string;
  amenities?: string[];
  area?: number;
  furnished?: "Fully Furnished" | "Semi Furnished" | "Unfurnished";
  parking?: boolean;
  contact?: string;
}

interface PropertyGalleryProps {
  propertyId: string;
}

export function PropertyGallery({ propertyId }: PropertyGalleryProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    async function fetchProperty() {
      try {
        // 🔗 Update API base URL if needed
        const res = await fetch(`${API_BASE}/property/${propertyId}`, {
          cache: "no-store", // avoid stale data
        });
        if (!res.ok) throw new Error("Failed to fetch property");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    }

    if (propertyId) fetchProperty();
  }, [propertyId]);

  const nextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Rented":
        return "bg-red-100 text-red-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading property...</p>;
  }

  if (!property) {
    return <p className="text-center mt-10">Property not found</p>;
  }

  // ✅ Build WhatsApp link
  const whatsappNumber = (property.contact || "").replace(/\D/g, "");
  const waMessage = `Hi, I'm interested in your property: ${property.name}`;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    waMessage
  )}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/properties">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Properties
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Home className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-900">SuperFlats</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Property Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={property.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${property.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowLightbox(true)}
                />
              </div>

              {/* Navigation */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              {/* Fullscreen */}
              <button
                onClick={() => setShowLightbox(true)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {property.name}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    {property.location}
                  </div>
                  <Badge
                    className={getAvailabilityColor(property.availability)}
                  >
                    {property.availability}
                  </Badge>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y">
                    <div>
                      <span className="text-sm text-gray-600">Type</span>
                      <p className="font-semibold">{property.bhk}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Area</span>
                      <p className="font-semibold">{property.area} sq ft</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Furnished</span>
                      <p className="font-semibold">{property.furnished}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Parking</span>
                      <p className="font-semibold">
                        {property.parking ? "Available" : "Not Available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monthly Rent</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{property.rent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="text-lg font-semibold text-gray-700">
                      ₹{property.deposit.toLocaleString()}
                    </span>
                  </div>

                  {/* WhatsApp Button */}
                  {property.contact && (
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Phone size={16} className="mr-2" />
                        WhatsApp: {property.contact}
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{a}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                About this Property
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={property.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${property.name} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
