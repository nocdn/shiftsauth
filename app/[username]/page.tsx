import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import UserNameClient from "./UserNameClient"

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const { username } = await params
  return <UserNameClient username={username} />
}
