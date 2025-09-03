import { type NextRequest, NextResponse } from "next/server";

// Get backend base URL from env
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * GET /api/properties
 * Proxies request to backend: /api/property
 */
export async function GET(request: NextRequest) {
  try {
    // Take query params and forward them
    const url = new URL(request.url);
    const query = url.search;

    const res = await fetch(`${API_BASE_URL}/property${query}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("GET /api/properties error:", e);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/properties
 * Proxies request to backend: /api/property
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/property`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("POST /api/properties error:", e);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
