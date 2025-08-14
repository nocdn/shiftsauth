"use client"
import LoginForm from "@/components/LoginForm"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function Login() {
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({ email, password })

    if (error) {
      console.error("Login error:", error)
      // you can show a toast here
      return
    }

    // data?.user includes your additional fields (e.g., is_admin) if set
    const isAdmin = data?.user?.is_admin === true
    router.replace(isAdmin ? "/admin" : "/")
  }

  return (
    <main className="flex h-dvh w-screen justify-center items-center px-8">
      <LoginForm onLogin={handleLogin} className="w-96" />
    </main>
  )
}
