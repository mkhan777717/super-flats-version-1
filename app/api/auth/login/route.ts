import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AdminDB } from "@/lib/mysql"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const admin = await AdminDB.validateAdmin(email, password)

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("admin-session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, name: admin.name } })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
