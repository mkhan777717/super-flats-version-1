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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { fetchPropertyById } from "@/lib/property-api"; // ✅ use single property API

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // ✅ Fetch property by ID directly
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const prop = await fetchPropertyById(propertyId);
        setProperty(prop);
      } catch (err) {
        console.error("Failed to fetch property", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!property) {
    return <p className="text-center py-12">Property not found</p>;
  }

  // ✅ WhatsApp link
  const whatsappNumber = (property.contact || "").replace(/\D/g, "");
  const waMessage = `Hi, I'm interested in your property: ${property.name} - ${currentUrl}`;
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    waMessage
  )}`;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
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

      {/* Property Gallery */}
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

              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              <button
                onClick={() => setShowLightbox(true)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {property.name}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin size={16} className="mr-2" />
                      {property.location}
                    </div>
                    <Badge
                      className={getAvailabilityColor(property.availability)}
                    >
                      {property.availability}
                    </Badge>
                  </div>

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

                  <div className="space-y-3">
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
                  </div>

                  {property.contact && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Phone size={16} className="mr-2" />
                        WhatsApp: {property.contact}
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

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
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <X size={20} />
            </button>
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} of {property.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
