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
  
  export type Filters = {
    search?: string;
    location?: string;
    bhkTypes?: string[];
    rentRange?: [number, number];
    availability?: string;
  };
  
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
  
  // Build query string
  const qs = (f?: Filters) => {
    if (!f) return "";
    const p = new URLSearchParams();
    if (f.search) p.set("search", f.search);
    if (f.location) p.set("location", f.location);
    if (f.bhkTypes?.length) p.set("bhk_type", JSON.stringify(f.bhkTypes));
    if (f.rentRange) {
      p.set("rent_min", String(f.rentRange[0]));
      p.set("rent_max", String(f.rentRange[1]));
    }
    if (f.availability) p.set("availability_status", f.availability);
    return `?${p.toString()}`;
  };
  
  // ✅ Fetch all properties (with filters)
  export async function fetchProperties(filters?: Filters): Promise<PropertyCard[]> {
    const res = await fetch(`${API_BASE_URL}/property${qs(filters)}`);
    if (!res.ok) {
      throw new Error("Failed to fetch properties");
    }
    return res.json();
  }
  
  // Fetch single property by ID
  export async function fetchPropertyById(id: number): Promise<PropertyCard> {
    const res = await fetch(`${API_BASE_URL}/property/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch property");
    }
    return res.json();
  }
  
  // Create a new property
  export async function createProperty(data: Partial<PropertyCard>) {
    const res = await fetch(`${API_BASE_URL}/property`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Failed to create property");
    }
    return res.json();
  }
  
  // Update a property
  export async function updateProperty(id: number, data: Partial<PropertyCard>) {
    const res = await fetch(`${API_BASE_URL}/property/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Failed to update property");
    }
    return res.json();
  }
  
  // Delete a property
  export async function deleteProperty(id: number) {
    const res = await fetch(`${API_BASE_URL}/property/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete property");
    }
    return res.json();
  }
  