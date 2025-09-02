import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import UserNameClient from "./UserNameClient"
import { titleCase } from "@/utils/text"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return {
    title: `${titleCase(username)} shifts`,
    description: `User page for Shifts: ${titleCase(username)}`,
  }
}

export default async function UserPage({ params }: Props) {
  const { username } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")
  return <UserNameClient username={username} />
}
