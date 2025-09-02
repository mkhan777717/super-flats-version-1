import { Router } from "express";

const router = Router();

// Mock data (replace with DB query later)
const properties = [
  {
    id: "1",
    name: "Luxury Apartment",
    location: "Delhi",
    bhk: "2BHK",
    rent: 25000,
    deposit: 50000,
    availability: "Available",
    images: ["/luxury-apartment-interior.png"],
    createdAt: new Date().toISOString(),
    description: "Spacious 2BHK apartment in Delhi with modern interiors.",
    amenities: ["Parking", "Gym", "Elevator"],
    area: 1200,
    furnished: "Fully Furnished",
    parking: true,
    contact: "+911234567890",
  },
  {
    id: "2",
    name: "Villa with Garden",
    location: "Mumbai",
    bhk: "3BHK",
    rent: 50000,
    deposit: 100000,
    availability: "Rented",
    images: ["/modern-loft.png"],
    createdAt: new Date().toISOString(),
    description: "Luxury villa with private garden and premium facilities.",
    amenities: ["Garden", "Security", "Swimming Pool"],
    area: 2000,
    furnished: "Semi Furnished",
    parking: true,
    contact: "+919876543210",
  },
  {
    id: "3",
    name: "Penthouse Skyview",
    location: "Bangalore",
    bhk: "4BHK",
    rent: 75000,
    deposit: 150000,
    availability: "Available",
    images: ["/penthouse-skyview.png"],
    createdAt: new Date().toISOString(),
    description:
      "Modern penthouse with panoramic city views and premium amenities.",
    amenities: ["Terrace", "Gym", "Infinity Pool", "Clubhouse"],
    area: 3200,
    furnished: "Fully Furnished",
    parking: true,
    contact: "+919112233445",
  },
  {
    id: "4",
    name: "Cozy Studio",
    location: "Pune",
    bhk: "1RK",
    rent: 15000,
    deposit: 30000,
    availability: "Available",
    images: ["/cozy-studio.png"],
    createdAt: new Date().toISOString(),
    description:
      "Compact and stylish studio apartment, perfect for young professionals.",
    amenities: ["Lift", "24x7 Security", "Power Backup"],
    area: 500,
    furnished: "Semi Furnished",
    parking: false,
    contact: "+919556677889",
  },
  {
    id: "5",
    name: "Family Home",
    location: "Hyderabad",
    bhk: "3BHK",
    rent: 35000,
    deposit: 70000,
    availability: "Available",
    images: ["/family-home.png"],
    createdAt: new Date().toISOString(),
    description: "Spacious family home located in a peaceful gated community.",
    amenities: ["Garden", "Play Area", "Clubhouse", "Parking"],
    area: 1800,
    furnished: "Unfurnished",
    parking: true,
    contact: "+918877665544",
  },
];

// ✅ GET all properties with filtering
router.get("/", (req, res) => {
  const {
    search,
    location,
    bhk_type,
    rent_min,
    rent_max,
    availability_status,
  } = req.query;

  let result = [...properties];

  // 🔍 Full text search across multiple fields
  // 🔍 Search across multiple fields
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.bhk.toLowerCase().includes(q)
    );
  }

  // 📍 Location filter (case-insensitive exact match)
  if (location && typeof location === "string" && location.trim() !== "") {
    result = result.filter(
      (p) => p.location.toLowerCase() === location.toLowerCase()
    );
  }

  // 🏠 BHK filter (case-insensitive match)
  if (bhk_type) {
    try {
      const bhks = JSON.parse(bhk_type as string) as string[];
      if (Array.isArray(bhks) && bhks.length > 0) {
        const normalized = bhks.map((b) => b.toLowerCase());
        result = result.filter((p) => normalized.includes(p.bhk.toLowerCase()));
      }
    } catch {
      // ignore parse errors
    }
  }

  // 💰 Rent range filter
  const min = rent_min ? Number(rent_min) : 0;
  const max = rent_max ? Number(rent_max) : Number.MAX_SAFE_INTEGER;
  result = result.filter((p) => p.rent >= min && p.rent <= max);

  // 📦 Availability filter
  if (availability_status && typeof availability_status === "string") {
    result = result.filter(
      (p) => p.availability.toLowerCase() === availability_status.toLowerCase()
    );
  }

  res.json(result);
});

// ✅ GET property by ID
router.get("/:id", (req, res) => {
  const property = properties.find((p) => p.id === req.params.id);
  if (!property) return res.status(404).json({ error: "Property not found" });
  res.json(property);
});

export default router;
