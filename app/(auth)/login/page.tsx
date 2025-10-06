"use client"
import LoginForm from "@/components/LoginForm"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"

export default function Login() {
  const router = useRouter()

  const [isErrorCredentials, setIsErrorCredentials] = useState(false)

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
      setIsErrorCredentials(true)
      setTimeout(() => setIsErrorCredentials(false), 1500)
      return
    }
    const { data: session } = await authClient.getSession()
    const role = session?.user?.role
    router.replace(role === "admin" ? "/admin" : "/")
  }

  return (
    <main className="flex h-dvh w-screen justify-center items-center md:px-8 motion-preset-blur-up-sm">
      <LoginForm
        mode="signin"
        onSubmit={handleSubmit}
        className="w-96"
        isErrorCredentials={isErrorCredentials}
      />
    </main>
  )
}
