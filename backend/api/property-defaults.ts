// lib/property-defaults.ts
export type PropertyRow = {
    id: number | string;
    title: string;
    description: string | null;
    property_type: "apartment" | "house" | "villa" | "studio" | "penthouse" | string;
    bhk_type: "1RK" | "1BHK" | "2BHK" | "3BHK" | "4BHK" | "5BHK+" | string;
    rent: number;                 // decimal(10,2) -> number in UI
    deposit: number;              // decimal(10,2) -> number in UI
    location: string;
    area: number | null;          // decimal(8,2)
    furnished_status: "fully_furnished" | "semi_furnished" | "unfurnished" | string;
    availability_status: "available" | "occupied" | "maintenance" | string;
    parking: 0 | 1 | boolean;
    parking_type: "covered" | "open" | "none" | string;
    floor_number: number | null;
    total_floors: number | null;
    age_of_property: number | null;
    facing:
      | "north" | "south" | "east" | "west"
      | "north_east" | "north_west" | "south_east" | "south_west"
      | string | null;
    balcony: number | null;
    bathroom: number | null;
    available_from: string | null; // date
    contact_name: string | null;
    contact_phone: string | null;
    contact_email: string | null;
    created_at?: string;
    updated_at?: string;
  };
  
  export const propertyDefaults: PropertyRow = {
    id: "",
    title: "Untitled Property",
    description: "",
    property_type: "apartment",
    bhk_type: "1BHK",
    rent: 0,
    deposit: 0,
    location: "",
    area: 0,
    furnished_status: "unfurnished",
    availability_status: "available",
    parking: 0,
    parking_type: "none",
    floor_number: 0,
    total_floors: 0,
    age_of_property: 0,
    facing: "north",
    balcony: 0,
    bathroom: 1,
    available_from: null,
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    created_at: "",
    updated_at: "",
  };
  