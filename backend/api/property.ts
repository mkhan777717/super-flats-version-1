// backend/api/properties.ts
import { Router } from "express";
import { PropertyDB } from "./mysql";

const router = Router();

// GET all properties
router.get("/", async (req, res) => {
  try {
    const properties = await PropertyDB.getAllProperties();
    res.json(properties);
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// GET property by ID
router.get("/:id", async (req, res) => {
  try {
    const property = await PropertyDB.getPropertyById(Number(req.params.id));
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json(property);
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

// Search properties
router.get("/search/:term", async (req, res) => {
  try {
    const results = await PropertyDB.searchProperties(req.params.term);
    res.json(results);
  } catch (err) {
    console.error("Error searching properties:", err);
    res.status(500).json({ error: "Failed to search properties" });
  }
});

// Filtered properties
router.post("/filter", async (req, res) => {
  try {
    const results = await PropertyDB.getFilteredProperties(req.body);
    res.json(results);
  } catch (err) {
    console.error("Error filtering properties:", err);
    res.status(500).json({ error: "Failed to filter properties" });
  }
});

export default router;
