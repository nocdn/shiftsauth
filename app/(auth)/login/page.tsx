"use client"
import LoginForm from "@/components/LoginForm"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function Login() {
  const router = useRouter()

  const handleSubmit = async ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => {
    const { error } = await authClient.signIn.username({ username, password })
    if (error) {
      console.error("Login error:", error)
      return
    }
    const { data: session } = await authClient.getSession()
    const role = session?.user?.role
    router.replace(role === "admin" ? "/admin" : "/")
  }

  return (
    <main className="flex h-dvh w-screen justify-center items-center px-8 motion-preset-blur-up-sm">
      <LoginForm mode="signin" onSubmit={handleSubmit} className="w-96" />
    </main>
  )
}
