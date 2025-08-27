import { type NextRequest, NextResponse } from "next/server"
import { PropertyDB } from "@/lib/mysql"

// GET /api/properties/[id] - Get property by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const property = await PropertyDB.getPropertyById(Number.parseInt(params.id))

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Transform database format to frontend format
    const transformedProperty = {
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
    }

    return NextResponse.json(transformedProperty)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Transform frontend format to database format
    const propertyData = {
      title: body.name,
      description: body.description,
      property_type: "apartment",
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
      contact_phone: body.contact,
      images: body.images || [],
      amenities: body.amenities || [],
    }

    await PropertyDB.updateProperty(Number.parseInt(params.id), propertyData)

    return NextResponse.json({ message: "Property updated successfully" })
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await PropertyDB.deleteProperty(Number.parseInt(params.id))

    return NextResponse.json({ message: "Property deleted successfully" })
  } catch (error) {
    console.error("Error deleting property:", error)
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  }
}
