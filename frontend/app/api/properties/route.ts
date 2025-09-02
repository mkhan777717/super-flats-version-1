import { type NextRequest, NextResponse } from "next/server";
import { PropertyDB } from "@/lib/mysql";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();
    const rentMin = Number(searchParams.get("rent_min") ?? 0);
    const rentMax = Number(searchParams.get("rent_max") ?? 9e12);
    const availability = searchParams.get("availability_status") || "";
    const location = searchParams.get("location") || "";
    const bhkJson = searchParams.get("bhk_type");
    let bhkTypes: string[] = [];
    try { if (bhkJson) bhkTypes = JSON.parse(bhkJson); } catch {}

    const rows = await PropertyDB.getFilteredProperties({
      search, rentMin, rentMax, availability_status: availability, location, bhkTypes,
    });

    const transformed = rows.map((p: any) => ({
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
    }));

    return NextResponse.json(transformed);
  } catch (e) {
    console.error("GET /api/properties error:", e);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = {
      title: body.name,
      description: body.description,
      property_type: "apartment",
      bhk_type: body.bhk,
      rent: body.rent,
      deposit: body.deposit,
      location: body.location,
      area: body.area,
      furnished_status: body.furnished === "Fully Furnished" ? "fully_furnished" : body.furnished === "Semi Furnished" ? "semi_furnished" : "unfurnished",
      parking: !!body.parking,
      parking_type: body.parking ? "covered" : "none",
      availability_status: "available",
      contact_phone: body.contact,
      images: body.images || [],
      amenities: body.amenities || [],
    };
    const id = await PropertyDB.createProperty(data);
    return NextResponse.json({ id, message: "Property created successfully" });
  } catch (e) {
    console.error("POST /api/properties error:", e);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
