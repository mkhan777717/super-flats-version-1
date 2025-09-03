import { getPool } from "./mysql";

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
    description: "Modern penthouse with panoramic city views and premium amenities.",
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
    description: "Compact and stylish studio apartment, perfect for young professionals.",
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
    description: "Spacious family home located in a peaceful gated community.",
    amenities: ["Garden", "Play Area", "Clubhouse", "Parking"],
    area: 1800,
    furnished: "Unfurnished",
    parking: true,
    contact: "+918877665544",
  },
];

// ✅ Normalize furnished_status
function normalizeFurnishedStatus(input: string): string {
  switch (input.toLowerCase()) {
    case "fully furnished":
      return "fully_furnished";
    case "semi furnished":
      return "semi_furnished";
    case "unfurnished":
      return "unfurnished";
    default:
      return "unfurnished";
  }
}

// ✅ Normalize availability_status
function normalizeAvailability(input: string): string {
  switch (input.toLowerCase()) {
    case "available":
      return "available";
    case "rented":
      return "occupied"; // DB uses "occupied"
    case "maintenance":
      return "maintenance";
    default:
      return "available";
  }
}

async function seed() {
  const pool = getPool();

  // ✅ Clear old data first
  await pool.query("SET FOREIGN_KEY_CHECKS=0");
  await pool.query("TRUNCATE TABLE property_images");
  await pool.query("TRUNCATE TABLE property_amenities");
  await pool.query("TRUNCATE TABLE properties");
  await pool.query("SET FOREIGN_KEY_CHECKS=1");

  for (const p of properties) {
    const [res] = await pool.query(
      `
      INSERT INTO properties 
        (title, description, property_type, bhk_type, rent, deposit, location, 
         area, furnished_status, availability_status, parking, contact_phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        p.name,
        p.description,
        "apartment", // hardcoded property_type
        p.bhk,
        p.rent,
        p.deposit,
        p.location,
        p.area,
        normalizeFurnishedStatus(p.furnished),
        normalizeAvailability(p.availability),
        p.parking ? 1 : 0,
        p.contact,
      ]
    );

    const propertyId = (res as any).insertId;

    if (p.images.length) {
      const values = p.images.map((url, i) => [propertyId, url, i]);
      await pool.query(
        "INSERT INTO property_images (property_id, image_url, display_order) VALUES ?",
        [values]
      );
    }

    if (p.amenities.length) {
      const values = p.amenities.map((a) => [propertyId, a]);
      await pool.query(
        "INSERT INTO property_amenities (property_id, amenity) VALUES ?",
        [values]
      );
    }
  }

  console.log("✅ Properties seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
