// backend/api/property-api.ts
import { Router } from "express";
import { PropertyAPI } from "./properties";

const router = Router();

// ✅ GET all properties with optional filters
router.get("/", async (req, res) => {
  try {
    const {
      search,
      location,
      bhk_type,
      rent_min,
      rent_max,
      availability_status,
    } = req.query;

    // Prepare filters for DB
    const filters = {
      search: search ? String(search) : "",
      rentMin: rent_min ? Number(rent_min) : 0,
      rentMax: rent_max ? Number(rent_max) : 9e12,
      availability_status: availability_status ? String(availability_status) : "",
      location: location ? String(location) : "",
      bhkTypes: bhk_type ? JSON.parse(bhk_type as string) : [],
    };

    const data = await PropertyAPI.getFiltered(filters);
    res.json(data);
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// ✅ GET property by ID
router.get("/:id", async (req, res) => {
  try {
    const property = await PropertyAPI.getById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property);
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

export default router;
