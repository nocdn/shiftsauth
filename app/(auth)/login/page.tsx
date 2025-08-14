// app/(auth)/login/page.tsx
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
    const { data, error } = await authClient.signIn.username({
      username,
      password,
    })
    if (error) {
      console.error("Login error:", error)
      return
    }
    const isAdmin = data?.user?.is_admin === true
    router.replace(isAdmin ? "/admin" : "/")
  }

  return (
    <main className="flex h-dvh w-screen justify-center items-center px-8">
      <LoginForm mode="signin" onSubmit={handleSubmit} className="w-96" />
    </main>
  )
}
