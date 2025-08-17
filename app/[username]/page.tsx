import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import UserNameClient from "./UserNameClient"
import { titleCase } from "@/utils/text"

export async function generateMetadata({
  params,
}: {
  params: { username: string }
}) {
  const username = params.username
  return {
    title: `${titleCase(username)} shifts`,
    description: `User page for Shifts: ${titleCase(username)}`,
  }
}

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
