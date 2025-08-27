"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";

interface FilterState {
  bhkTypes: string[];
  rentRange: [number, number];
  visitWithin2Days: boolean;
  availability: string;
  preferredTenants: string[];
}

interface PropertyFiltersSidebarProps {
  onFiltersChange: (filters: FilterState) => void;
  maxRent?: number;
}

export function PropertyFiltersSidebar({
  onFiltersChange,
  maxRent = 500000,
}: PropertyFiltersSidebarProps) {
  const [activeTab, setActiveTab] = useState<"filters" | "premium">("filters");
  const [filters, setFilters] = useState<FilterState>({
    bhkTypes: [],
    rentRange: [0, maxRent],
    visitWithin2Days: false,
    availability: "",
    preferredTenants: [],
  });

  const bhkOptions = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];
  const availabilityOptions = [
    { value: "immediate", label: "Immediate" },
    { value: "within15", label: "Within 15 Days" },
    { value: "within30", label: "Within 30 Days" },
    { value: "after30", label: "After 30 Days" },
  ];
  const tenantOptions = [
    { value: "family", label: "Family" },
    { value: "company", label: "Company" },
    { value: "bachelor-male", label: "Bachelor Male" },
    { value: "bachelor-female", label: "Bachelor Female" },
  ];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const resetFilters = () => {
    const resetState: FilterState = {
      bhkTypes: [],
      rentRange: [0, maxRent],
      visitWithin2Days: false,
      availability: "",
      preferredTenants: [],
    };
    setFilters(resetState);
    onFiltersChange(resetState);
  };

  const toggleBHK = (bhk: string) => {
    const newBHKTypes = filters.bhkTypes.includes(bhk)
      ? filters.bhkTypes.filter((b) => b !== bhk)
      : [...filters.bhkTypes, bhk];
    updateFilters({ bhkTypes: newBHKTypes });
  };

  const toggleTenant = (tenant: string) => {
    const newTenants = filters.preferredTenants.includes(tenant)
      ? filters.preferredTenants.filter((t) => t !== tenant)
      : [...filters.preferredTenants, tenant];
    updateFilters({ preferredTenants: newTenants });
  };

  return (
    <Card className="w-full max-w-sm bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("filters")}
            className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "filters"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Filters
          </button>
        </div>
        <div className="flex items-center justify-between pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 max-h-96 overflow-y-auto">
        {/* BHK Type */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">BHK Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {bhkOptions.map((bhk) => (
              <Button
                key={bhk}
                variant={filters.bhkTypes.includes(bhk) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBHK(bhk)}
                className={`text-xs ${
                  filters.bhkTypes.includes(bhk)
                    ? "bg-teal-500 hover:bg-teal-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {bhk}
              </Button>
            ))}
          </div>
        </div>

        {/* Rent Range */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              Rent Range: ₹0 to ₹5 Lacs
            </h3>
          </div>
          <div className="px-2">
            <Slider
              value={filters.rentRange}
              onValueChange={(value) =>
                updateFilters({ rentRange: value as [number, number] })
              }
              max={maxRent}
              min={0}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>₹{filters.rentRange[0].toLocaleString()}</span>
              <span>₹{filters.rentRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Visit Properties */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="visit-2days"
              checked={filters.visitWithin2Days}
              onCheckedChange={(checked) =>
                updateFilters({ visitWithin2Days: !!checked })
              }
            />
            <Label htmlFor="visit-2days" className="text-sm text-gray-700">
              Visit properties within next 2 days
              <Badge className="ml-2 bg-red-500 text-white text-xs px-1 py-0">
                New
              </Badge>
            </Label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Show properties where owner is hosting a visit
          </p>
        </div>

        {/* Availability */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
          <RadioGroup
            value={filters.availability}
            onValueChange={(value) => updateFilters({ availability: value })}
          >
            {availabilityOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-sm text-gray-700">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Preferred Tenants */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Preferred Tenants</h3>
          <div className="space-y-2">
            {tenantOptions.map((tenant) => (
              <div key={tenant.value} className="flex items-center space-x-2">
                <Checkbox
                  id={tenant.value}
                  checked={filters.preferredTenants.includes(tenant.value)}
                  onCheckedChange={() => toggleTenant(tenant.value)}
                />
                <Label htmlFor={tenant.value} className="text-sm text-gray-700">
                  {tenant.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
