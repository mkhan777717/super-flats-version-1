export type Filters = {
    search?: string;
    location?: string;
    bhkTypes?: string[];
    rentRange?: [number, number];
    availability?: string; // Available | Rented | Maintenance
  };
  
  const qs = (f?: Filters) => {
    if (!f) return "";
    const p = new URLSearchParams();
    if (f.search) p.set("search", f.search);
    if (f.location) p.set("location", f.location);
    if (f.bhkTypes?.length)
      p.set("bhk_type", JSON.stringify(f.bhkTypes));
    if (f.rentRange) {
      p.set("rent_min", String(f.rentRange[0]));
      p.set("rent_max", String(f.rentRange[1]));
    }
    if (f.availability) p.set("availability_status", f.availability);
    return `?${p.toString()}`;
  };
  
  export type PropertyCard = {
    id: string;
    name: string;
    location: string;
    bhk: string;
    rent: number;
    deposit: number;
    availability: "Available" | "Rented" | "Maintenance";
    images: string[];
    createdAt: string;
    description: string;
    amenities: string[];
    area: number;
    furnished: "Fully Furnished" | "Semi Furnished" | "Unfurnished";
    parking: boolean;
    contact: string;
  };
  
  // ✅ Use backend URL from frontend env
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

  export async function fetchProperties(filters?: Filters): Promise<PropertyCard[]> {
    const url = `${API_BASE}/property${qs(filters)}`; // ✅ singular
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch properties (${res.status})`);
    return (await res.json()) as PropertyCard[];
  }
  
  export async function fetchPropertyById(id: string | number): Promise<PropertyCard> {
    const url = `${API_BASE}/property/${id}`; // ✅ singular
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch property (${res.status})`);
    return (await res.json()) as PropertyCard;
  }
  