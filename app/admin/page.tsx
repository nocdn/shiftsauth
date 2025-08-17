import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import AdminClient from "./AdminClient"

export const metadata = {
  title: "Shifts | Admin",
  description: "Admin page for Shifts",
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  if (session.user?.role !== "admin") redirect("/")

  return <AdminClient />
}
