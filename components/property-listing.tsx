"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, Car, Phone, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { PropertyFiltersSidebar } from "./property-filters-sidebar";
import { fetchProperties, type PropertyData } from "@/lib/property-api";

interface FilterState {
  bhkTypes: string[];
  rentRange: [number, number];
  visitWithin2Days: boolean;
  availability: string;
  preferredTenants: string[];
}

export function PropertyListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBHK, setSelectedBHK] = useState("");
  const [rentRange, setRentRange] = useState<[number, number]>([22000, 65000]);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarFilters, setSidebarFilters] = useState<FilterState>({
    bhkTypes: [],
    rentRange: [0, 500000],
    visitWithin2Days: false,
    availability: "",
    preferredTenants: [],
  });

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const data = await fetchProperties();
        setProperties(data);

        const rents = data.map((p) => p.rent);
        const minRent = Math.min(...rents);
        const maxRent = Math.max(...rents);
        setRentRange([minRent, maxRent]);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !selectedLocation || property.location.includes(selectedLocation);
    const matchesBHK = !selectedBHK || property.bhk === selectedBHK;
    const matchesRent =
      property.rent >= rentRange[0] && property.rent <= rentRange[1];
    const matchesSidebarBHK =
      sidebarFilters.bhkTypes.length === 0 ||
      sidebarFilters.bhkTypes.includes(property.bhk);
    const matchesSidebarRent =
      property.rent >= sidebarFilters.rentRange[0] &&
      property.rent <= sidebarFilters.rentRange[1];

    return (
      matchesSearch &&
      matchesLocation &&
      matchesBHK &&
      matchesRent &&
      matchesSidebarBHK &&
      matchesSidebarRent &&
      property.availability === "Available"
    );
  });

  const locations = Array.from(
    new Set(properties.map((p) => p.location.split(",")[0]))
  );
  const bhkTypes = Array.from(new Set(properties.map((p) => p.bhk)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Home className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-900">SuperFlats</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Find your perfect home
              </span>
              <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Premium Properties
          </h1>
          <p className="text-lg mb-6 text-blue-100">
            Discover quality rental properties in Bangalore
          </p>

          {/* Search Filters */}
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-gray-900"
                />
              </div>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              <select
                value={selectedBHK}
                onChange={(e) => setSelectedBHK(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
              >
                <option value="">All Types</option>
                {bhkTypes.map((bhk) => (
                  <option key={bhk} value={bhk}>
                    {bhk}
                  </option>
                ))}
              </select>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search size={16} className="mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <div className="w-80 flex-shrink-0">
              <PropertyFiltersSidebar
                onFiltersChange={setSidebarFilters}
                maxRent={Math.max(...properties.map((p) => p.rent))}
              />
            </div>

            {/* Properties Content */}
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredProperties.length} of {properties.length}{" "}
                  properties
                  {rentRange[0] !==
                    Math.min(...properties.map((p) => p.rent)) ||
                  rentRange[1] !== Math.max(...properties.map((p) => p.rent))
                    ? ` in ₹${rentRange[0].toLocaleString()} - ₹${rentRange[1].toLocaleString()} range`
                    : ""}
                </p>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or rent range
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredProperties.map((property) => (
                    <Card
                      key={property.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow bg-white"
                    >
                      <div className="relative">
                        <img
                          src={
                            property.images[0] ||
                            "/placeholder.svg?height=200&width=400"
                          }
                          alt={property.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-2 right-2">
                          <Badge
                            variant="secondary"
                            className="bg-black bg-opacity-70 text-white text-xs"
                          >
                            {property.images.length} Photos
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                              {property.name}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin size={14} className="mr-1" />
                              {property.location}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <Badge variant="outline" className="text-xs">
                              {property.bhk}
                            </Badge>
                            {property.area && (
                              <span className="text-gray-600">
                                {property.area} sq ft
                              </span>
                            )}
                            {property.parking && (
                              <Car size={14} className="text-gray-600" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{property.rent.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-600">
                                / Month
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Deposit: ₹{property.deposit.toLocaleString()}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Link
                              href={`/properties/${property.id}`}
                              className="flex-1"
                            >
                              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                                Contact
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-3 bg-transparent"
                            >
                              <Eye size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Are you a property manager?
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            Connect with us to list properties for buyers/tenants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Phone size={20} className="mr-2" />
              Call / WhatsApp
            </Button>
            <span className="text-blue-100">+91 9205454717</span>
          </div>
        </div>
      </section>
    </div>
  );
}
