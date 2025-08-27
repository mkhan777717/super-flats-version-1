import { type NextRequest, NextResponse } from "next/server"
import { PropertyDB } from "@/lib/mysql"

// GET /api/properties - Get all properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let properties
    if (search) {
      properties = await PropertyDB.searchProperties(search)
    } else {
      properties = await PropertyDB.getAllProperties()
    }

    // Transform database format to frontend format
    const transformedProperties = properties.map((property: any) => ({
      id: property.id.toString(),
      name: property.title,
      location: property.location,
      bhk: property.bhk_type,
      rent: property.rent,
      deposit: property.deposit,
      availability:
        property.availability_status === "available"
          ? "Available"
          : property.availability_status === "occupied"
            ? "Rented"
            : "Maintenance",
      images: property.images || [],
      createdAt: property.created_at ? new Date(property.created_at).toISOString().split("T")[0] : "",
      description: property.description,
      amenities: property.amenities || [],
      area: property.area,
      furnished:
        property.furnished_status === "fully_furnished"
          ? "Fully Furnished"
          : property.furnished_status === "semi_furnished"
            ? "Semi Furnished"
            : "Unfurnished",
      parking: property.parking,
      contact: property.contact_phone,
    }))

    return NextResponse.json(transformedProperties)
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Transform frontend format to database format
    const propertyData = {
      title: body.name,
      description: body.description,
      property_type: "apartment", // Default value
      bhk_type: body.bhk,
      rent: body.rent,
      deposit: body.deposit,
      location: body.location,
      area: body.area,
      furnished_status:
        body.furnished === "Fully Furnished"
          ? "fully_furnished"
          : body.furnished === "Semi Furnished"
            ? "semi_furnished"
            : "unfurnished",
      parking: body.parking || false,
      parking_type: body.parking ? "covered" : "none",
      availability_status: "available",
      contact_phone: body.contact,
      images: body.images || [],
      amenities: body.amenities || [],
    }

    const propertyId = await PropertyDB.createProperty(propertyData)

    return NextResponse.json({ id: propertyId, message: "Property created successfully" })
  } catch (error) {
    console.error("Error creating property:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
