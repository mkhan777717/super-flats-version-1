import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * GET /api/properties/[id]
 * Proxies to backend /api/property/:id
 */
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE_URL}/property/${params.id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Property not found" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("GET /api/properties/[id] error:", e);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

/**
 * PUT /api/properties/[id]
 * Proxies to backend /api/property/:id
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/property/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to update property" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("PUT /api/properties/[id] error:", e);
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

/**
 * DELETE /api/properties/[id]
 * Proxies to backend /api/property/:id
 */
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE_URL}/property/${params.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to delete property" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("DELETE /api/properties/[id] error:", e);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
