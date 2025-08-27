import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("admin-session")

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  return <AdminDashboard />
}
