import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import { AdminPageClient } from "./admin-page-client"

export default async function AdminPage() {
  const admin = await isAdmin()
  if (!admin) {
    redirect("/login")
  }

  return <AdminPageClient />
}
