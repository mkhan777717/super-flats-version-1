import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
  user: process.env.DB_USER || process.env.MYSQL_USER || "root",
  password: process.env.DB_PASS || process.env.MYSQL_PASSWORD || "kamlesh12",
  database: process.env.DB_NAME || process.env.MYSQL_DATABASE || "superflats_temp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool: mysql.Pool | null = null;
export function getPool() {
  if (!pool) pool = mysql.createPool(dbConfig);
  return pool;
}

async function queryRows<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await getPool().query(sql, params);
  return rows as T[];
}
async function queryRow<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await queryRows<T>(sql, params);
  return (rows as any[])[0] || null;
}
async function exec(sql: string, params: any[] = []) {
  const [res] = await getPool().execute(sql, params);
  return res as any;
}

export const PropertyDB = {
  async getAllProperties() {
    return queryRows(`
      SELECT p.*,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order) AS images,
        GROUP_CONCAT(DISTINCT pa.amenity) AS amenities
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 200
    `).then(rows => rows.map((r: any) => ({
      ...r,
      images: r.images ? r.images.split(",") : [],
      amenities: r.amenities ? r.amenities.split(",") : [],
    })));
  },

  async searchProperties(search: string) {
    const q = `%${search}%`;
    return queryRows(
      `
      SELECT p.*,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order) AS images,
        GROUP_CONCAT(DISTINCT pa.amenity) AS amenities
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      WHERE p.title LIKE ? OR p.location LIKE ? OR p.description LIKE ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 200
    `,
      [q, q, q]
    ).then(rows => rows.map((r: any) => ({
      ...r,
      images: r.images ? r.images.split(",") : [],
      amenities: r.amenities ? r.amenities.split(",") : [],
    })));
  },

  async getFilteredProperties({
    search = "",
    rentMin = 0,
    rentMax = 9e12,
    availability_status = "",
    location = "",
    bhkTypes = [],
  }: {
    search?: string; rentMin?: number; rentMax?: number;
    availability_status?: string; location?: string; bhkTypes?: string[];
  }) {
    const where: string[] = [];
    const params: any[] = [];

    if (search) {
      where.push("(p.title LIKE ? OR p.location LIKE ? OR p.description LIKE ?)");
      const q = `%${search}%`;
      params.push(q, q, q);
    }
    where.push("p.rent BETWEEN ? AND ?"); params.push(rentMin, rentMax);
    if (availability_status) { where.push("p.availability_status = ?"); params.push(availability_status); }
    if (location) { where.push("p.location = ?"); params.push(location); }
    if (bhkTypes.length) {
      where.push(`p.bhk_type IN (${bhkTypes.map(() => "?").join(",")})`);
      params.push(...bhkTypes);
    }

    const sql = `
      SELECT p.*,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order) AS images,
        GROUP_CONCAT(DISTINCT pa.amenity) AS amenities
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT 200
    `;
    const rows = await queryRows(sql, params);
    return rows.map((r: any) => ({
      ...r,
      images: r.images ? r.images.split(",") : [],
      amenities: r.amenities ? r.amenities.split(",") : [],
    }));
  },

  async getPropertyById(id: number) {
    const row = await queryRow(
      `
      SELECT p.*,
        GROUP_CONCAT(DISTINCT pi.image_url ORDER BY pi.display_order) AS images,
        GROUP_CONCAT(DISTINCT pa.amenity) AS amenities
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      WHERE p.id = ?
      GROUP BY p.id
      `,
      [id]
    );
    if (!row) return null as any;
    return {
      ...row,
      images: (row as any).images ? (row as any).images.split(",") : [],
      amenities: (row as any).amenities ? (row as any).amenities.split(",") : [],
    };
  },

  async createProperty(data: any) {
    const {
      title, description, property_type, bhk_type, rent, deposit, location, area,
      furnished_status, parking, parking_type, floor_number, total_floors, age_of_property,
      facing, balcony, bathroom, available_from, contact_name, contact_phone, contact_email,
      images = [], amenities = [],
    } = data;

    // 21 columns -> 21 placeholders
    const sql = `
      INSERT INTO properties (
        title, description, property_type, bhk_type, rent, deposit, location,
        area, furnished_status, parking, parking_type, floor_number, total_floors,
        age_of_property, facing, balcony, bathroom, available_from,
        contact_name, contact_phone, contact_email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const res = await exec(sql, [
      title, description, property_type, bhk_type, rent, deposit, location,
      area, furnished_status, parking, parking_type, floor_number, total_floors,
      age_of_property, facing, balcony, bathroom, available_from,
      contact_name, contact_phone, contact_email,
    ]);
    const propertyId = res.insertId;

    if (images.length) {
      const values = images.map((url: string, i: number) => [propertyId, url, i]);
      await exec("INSERT INTO property_images (property_id, image_url, display_order) VALUES ?", [values]);
    }
    if (amenities.length) {
      const values = amenities.map((a: string) => [propertyId, a]);
      await exec("INSERT INTO property_amenities (property_id, amenity) VALUES ?", [values]);
    }
    return propertyId;
  },

  async updateProperty(id: number, data: any) {
    const {
      title, description, property_type, bhk_type, rent, deposit, location, area,
      furnished_status, parking, parking_type, floor_number, total_floors, age_of_property,
      facing, balcony, bathroom, available_from, contact_name, contact_phone, contact_email,
      images = [], amenities = [],
    } = data;

    await exec(
      `
      UPDATE properties SET
        title=?, description=?, property_type=?, bhk_type=?, rent=?, deposit=?, location=?, area=?,
        furnished_status=?, parking=?, parking_type=?, floor_number=?, total_floors=?, age_of_property=?,
        facing=?, balcony=?, bathroom=?, available_from=?, contact_name=?, contact_phone=?, contact_email=?, updated_at=NOW()
      WHERE id=?
      `,
      [
        title, description, property_type, bhk_type, rent, deposit, location, area,
        furnished_status, parking, parking_type, floor_number, total_floors, age_of_property,
        facing, balcony, bathroom, available_from, contact_name, contact_phone, contact_email, id,
      ]
    );

    await exec("DELETE FROM property_images WHERE property_id=?", [id]);
    await exec("DELETE FROM property_amenities WHERE property_id=?", [id]);

    if (images.length) {
      const values = images.map((url: string, i: number) => [id, url, i]);
      await exec("INSERT INTO property_images (property_id, image_url, display_order) VALUES ?", [values]);
    }
    if (amenities.length) {
      const values = amenities.map((a: string) => [id, a]);
      await exec("INSERT INTO property_amenities (property_id, amenity) VALUES ?", [values]);
    }
    return true;
  },

  async deleteProperty(id: number) {
    await exec("DELETE FROM properties WHERE id = ?", [id]);
    return true;
  },
};

export const AdminDB = {
  async validateAdmin(email: string, password: string) {
    // If passwords are hashed, replace this with bcrypt compare.
    return queryRow("SELECT * FROM admin_users WHERE email = ? AND password = ?", [email, password]);
  },
};
