import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// MySQL connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "kamlesh12",
  database: process.env.MYSQL_DATABASE || "superflats_temp", // Updated to match user's database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Helper function to execute queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const pool = getPool();
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Helper function to get a single row
export async function queryRow(query: string, params: any[] = []) {
  const results = (await executeQuery(query, params)) as any[];
  return results[0] || null;
}

// Helper function to get multiple rows
export async function queryRows(query: string, params: any[] = []) {
  const results = (await executeQuery(query, params)) as any[];
  return results;
}

// Property-specific database operations
export const PropertyDB = {
  // Get all properties with images and amenities
  async getAllProperties() {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order) as images,
        GROUP_CONCAT(DISTINCT pa.amenity) as amenities
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    const properties = await queryRows(query);

    return properties.map((property: any) => ({
      ...property,
      images: property.images ? property.images.split(",") : [],
      amenities: property.amenities ? property.amenities.split(",") : [],
    }));
  },

  // Get property by ID
  async getPropertyById(id: number) {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order) as images,
        GROUP_CONCAT(DISTINCT pa.amenity) as amenities
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      WHERE p.id = ?
      GROUP BY p.id
    `;
    const property = await queryRow(query, [id]);

    if (!property) return null;

    return {
      ...property,
      images: property.images ? property.images.split(",") : [],
      amenities: property.amenities ? property.amenities.split(",") : [],
    };
  },

  // Create new property
  async createProperty(propertyData: any) {
    const {
      title,
      description,
      property_type,
      bhk_type,
      rent,
      deposit,
      location,
      area,
      furnished_status,
      parking,
      parking_type,
      floor_number,
      total_floors,
      age_of_property,
      facing,
      balcony,
      bathroom,
      available_from,
      contact_name,
      contact_phone,
      contact_email,
      images = [],
      amenities = [],
    } = propertyData;

    // Insert property
    const propertyQuery = `
      INSERT INTO properties (
        title, description, property_type, bhk_type, rent, deposit, location,
        area, furnished_status, parking, parking_type, floor_number, total_floors,
        age_of_property, facing, balcony, bathroom, available_from,
        contact_name, contact_phone, contact_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = (await executeQuery(propertyQuery, [
      title,
      description,
      property_type,
      bhk_type,
      rent,
      deposit,
      location,
      area,
      furnished_status,
      parking,
      parking_type,
      floor_number,
      total_floors,
      age_of_property,
      facing,
      balcony,
      bathroom,
      available_from,
      contact_name,
      contact_phone,
      contact_email,
    ])) as any;

    const propertyId = result.insertId;

    // Insert images
    if (images.length > 0) {
      const imageQuery =
        "INSERT INTO property_images (property_id, image_url, display_order) VALUES ?";
      const imageValues = images.map((url: string, index: number) => [
        propertyId,
        url,
        index,
      ]);
      await executeQuery(imageQuery, [imageValues]);
    }

    // Insert amenities
    if (amenities.length > 0) {
      const amenityQuery =
        "INSERT INTO property_amenities (property_id, amenity) VALUES ?";
      const amenityValues = amenities.map((amenity: string) => [
        propertyId,
        amenity,
      ]);
      await executeQuery(amenityQuery, [amenityValues]);
    }

    return propertyId;
  },

  // Update property
  async updateProperty(id: number, propertyData: any) {
    const {
      title,
      description,
      property_type,
      bhk_type,
      rent,
      deposit,
      location,
      area,
      furnished_status,
      parking,
      parking_type,
      floor_number,
      total_floors,
      age_of_property,
      facing,
      balcony,
      bathroom,
      available_from,
      contact_name,
      contact_phone,
      contact_email,
      images = [],
      amenities = [],
    } = propertyData;

    // Update property
    const propertyQuery = `
      UPDATE properties SET
        title = ?, description = ?, property_type = ?, bhk_type = ?, rent = ?, 
        deposit = ?, location = ?, area = ?, furnished_status = ?, parking = ?,
        parking_type = ?, floor_number = ?, total_floors = ?, age_of_property = ?,
        facing = ?, balcony = ?, bathroom = ?, available_from = ?,
        contact_name = ?, contact_phone = ?, contact_email = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await executeQuery(propertyQuery, [
      title,
      description,
      property_type,
      bhk_type,
      rent,
      deposit,
      location,
      area,
      furnished_status,
      parking,
      parking_type,
      floor_number,
      total_floors,
      age_of_property,
      facing,
      balcony,
      bathroom,
      available_from,
      contact_name,
      contact_phone,
      contact_email,
      id,
    ]);

    // Delete existing images and amenities
    await executeQuery("DELETE FROM property_images WHERE property_id = ?", [
      id,
    ]);
    await executeQuery("DELETE FROM property_amenities WHERE property_id = ?", [
      id,
    ]);

    // Insert new images
    if (images.length > 0) {
      const imageQuery =
        "INSERT INTO property_images (property_id, image_url, display_order) VALUES ?";
      const imageValues = images.map((url: string, index: number) => [
        id,
        url,
        index,
      ]);
      await executeQuery(imageQuery, [imageValues]);
    }

    // Insert new amenities
    if (amenities.length > 0) {
      const amenityQuery =
        "INSERT INTO property_amenities (property_id, amenity) VALUES ?";
      const amenityValues = amenities.map((amenity: string) => [id, amenity]);
      await executeQuery(amenityQuery, [amenityValues]);
    }

    return true;
  },

  // Delete property
  async deleteProperty(id: number) {
    await executeQuery("DELETE FROM properties WHERE id = ?", [id]);
    return true;
  },

  // Search properties
  async searchProperties(searchTerm: string) {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order) as images,
        GROUP_CONCAT(DISTINCT pa.amenity) as amenities
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      WHERE p.title LIKE ? OR p.location LIKE ? OR p.description LIKE ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    const searchPattern = `%${searchTerm}%`;
    const properties = await queryRows(query, [
      searchPattern,
      searchPattern,
      searchPattern,
    ]);

    return properties.map((property: any) => ({
      ...property,
      images: property.images ? property.images.split(",") : [],
      amenities: property.amenities ? property.amenities.split(",") : [],
    }));
  },
};

// Admin authentication - updated to work with existing admin table structure
export const AdminDB = {
  async validateAdmin(email: string, password: string) {
    const query = "SELECT * FROM admin_users WHERE email = ? AND password = ?"
    const admin = await queryRow(query, [email, password])
    return admin
  },
}