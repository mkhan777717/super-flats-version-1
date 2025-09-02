"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Home, Loader2, Phone } from "lucide-react";
import {
  PropertyFiltersSidebar,
  type SidebarFilterState,
} from "./property-filters-sidebar";
import { fetchProperties, type PropertyCard } from "@/lib/property-api";

const fmtIN = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function PropertyListing() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [bhkQuick, setBhkQuick] = useState("");
  const [propsData, setPropsData] = useState<PropertyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SidebarFilterState>({
    bhkTypes: [],
    rentRange: [0, 500000],
    availability: "",
  });

  // initial load
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setPropsData(await fetchProperties());
      } catch {
        setPropsData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Apply -> fetch with filters + search + dropdowns
  async function applyFilters(f: SidebarFilterState) {
    setFilters(f);
    setLoading(true);
    try {
      const merged = {
        search,
        location,
        bhkTypes: f.bhkTypes.length ? f.bhkTypes : bhkQuick ? [bhkQuick] : [],
        rentRange: f.rentRange,
        availability: f.availability,
      };
      setPropsData(await fetchProperties(merged));
    } catch {
      setPropsData([]);
    } finally {
      setLoading(false);
    }
  }

  const locations = useMemo(
    () => Array.from(new Set(propsData.map((p) => p.location))).slice(0, 50),
    [propsData]
  );

  const visible = useMemo(() => {
    // server already filtered, but keep client refinements if needed
    return propsData;
  }, [propsData]);

  return (
    <div className="min-h-screen bg-gray-50">
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
            Discover quality rental properties
          </p>

          <div className="bg-white rounded-lg p-4 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="relative md:col-span-2">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search title or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 text-gray-900"
                />
              </div>

              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-3 py-2 border rounded-md text-gray-900 bg-white"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <select
                value={bhkQuick}
                onChange={(e) => setBhkQuick(e.target.value)}
                className="px-3 py-2 border rounded-md text-gray-900 bg-white"
              >
                <option value="">Any BHK</option>
                {["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK+"].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <Button onClick={() => applyFilters(filters)}>Search</Button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* <aside className="w-80 flex-shrink-0">
            <PropertyFiltersSidebar onApply={applyFilters} maxRent={Math.max(...propsData.map(p => Number(p.rent) || 0), 500000)} />
          </aside> */}

          <section className="flex-1">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {visible.length} properties
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin mx-auto" />
                <p className="mt-2">Loading properties...</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="text-center py-12">
                <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-sm text-gray-600">
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visible.map((p) => (
                  <Card
                    key={p.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="relative">
                      <img
                        src={
                          p.images?.[0] ||
                          "/placeholder.svg?height=200&width=400"
                        }
                        alt={p.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent>
                        <h3 className="text-lg font-semibold mt-2">{p.name}</h3>
                        <p className="text-sm text-gray-600">{p.location}</p>
                        <p className="mt-2 font-medium">
                          ₹{fmtIN.format(Number(p.rent || 0))}
                        </p>
                        <p className="text-sm text-gray-500">
                          {p.bhk} · {p.furnished}
                        </p>

                        <div className="flex gap-2 mt-3">
                          {/* Contact via WhatsApp */}
                          {p.contact &&
                            (() => {
                              const whatsappNumber = (p.contact || "").replace(
                                /\D/g,
                                ""
                              );
                              const waMessage = `Hi, I'm interested in your property: ${
                                p.name
                              } - ${
                                typeof window !== "undefined"
                                  ? window.location.href
                                  : ""
                              }`;
                              const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                waMessage
                              )}`;
                              return (
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex"
                                >
                                  <Button size="sm" variant="outline">
                                    <Phone className="mr-1 h-4 w-4" /> Contact
                                  </Button>
                                </a>
                              );
                            })()}

                          {/* View details */}
                          <Link
                            href={`/properties/${p.id}`}
                            className="inline-flex"
                          >
                            <Button size="sm">View</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
