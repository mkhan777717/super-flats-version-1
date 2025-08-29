import { type NextRequest, NextResponse } from "next/server";
import { PropertyDB } from "@/lib/mysql";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const p = await PropertyDB.getPropertyById(Number(params.id));
    if (!p) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    const transformed = {
      id: String(p.id),
      name: p.title,
      location: p.location,
      bhk: p.bhk_type,
      rent: Number(p.rent),
      deposit: Number(p.deposit),
      availability: p.availability_status === "available" ? "Available" : p.availability_status === "occupied" ? "Rented" : "Maintenance",
      images: p.images || [],
      createdAt: p.created_at ? new Date(p.created_at).toISOString().split("T")[0] : "",
      description: p.description,
      amenities: p.amenities || [],
      area: Number(p.area || 0),
      furnished: p.furnished_status === "fully_furnished" ? "Fully Furnished" : p.furnished_status === "semi_furnished" ? "Semi Furnished" : "Unfurnished",
      parking: !!p.parking,
      contact: p.contact_phone,
    };
    return NextResponse.json(transformed);
  } catch (e) {
    console.error("GET /api/properties/[id] error:", e);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const b = await request.json();
    await PropertyDB.updateProperty(Number(params.id), {
      title: b.name,
      description: b.description,
      property_type: "apartment",
      bhk_type: b.bhk,
      rent: b.rent,
      deposit: b.deposit,
      location: b.location,
      area: b.area,
      furnished_status: b.furnished === "Fully Furnished" ? "fully_furnished" : b.furnished === "Semi Furnished" ? "semi_furnished" : "unfurnished",
      parking: !!b.parking,
      parking_type: b.parking ? "covered" : "none",
      contact_name: b.contact_name,
      contact_phone: b.contact,
      contact_email: b.contact_email,
      images: b.images || [],
      amenities: b.amenities || [],
      available_from: b.available_from,
      floor_number: b.floor_number,
      total_floors: b.total_floors,
      age_of_property: b.age_of_property,
      facing: b.facing,
      balcony: b.balcony,
      bathroom: b.bathroom,
    });
    return NextResponse.json({ message: "Property updated successfully" });
  } catch (e) {
    console.error("PUT /api/properties/[id] error:", e);
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await PropertyDB.deleteProperty(Number(params.id));
    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (e) {
    console.error("DELETE /api/properties/[id] error:", e);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
