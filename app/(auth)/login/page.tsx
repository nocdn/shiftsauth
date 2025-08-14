"use client"
import LoginForm from "@/components/LoginForm"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Login() {
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    console.log("Login attempt:", { email, password })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.error("Login error:", error)
        return
      }

      const user = data.user
      const appMetadata = (user?.app_metadata ?? {}) as { [key: string]: any }
      const userMetadata = (user?.user_metadata ?? {}) as { [key: string]: any }
      const appRole = appMetadata.role
      const roles = appMetadata.roles
      const isAdmin =
        appRole === "admin" ||
        (Array.isArray(roles) && roles.includes("admin")) ||
        userMetadata.is_admin === true

      console.log("Login successful. isAdmin=", isAdmin)
      router.replace(isAdmin ? "/admin" : "/")
    } catch (err) {
      console.error("Login exception:", err)
    }
  }

  return (
    <main className="flex h-dvh w-screen justify-center items-center px-8">
      <LoginForm onLogin={handleLogin} className="w-96" />
    </main>
  )
}
