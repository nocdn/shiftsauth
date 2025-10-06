"use client"
import LoginForm from "@/components/LoginForm"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function Signup() {
  const router = useRouter()

  const handleSubmit = async ({
    username,
    password,
    email,
  }: {
    username: string
    password: string
    email?: string
  }) => {
    const { error: signUpError } = await authClient.signUp.email({
      email: email!,
      password,
      username,
      name: username,
    })
    if (signUpError) {
      console.error("Sign up error:", signUpError)
      return
    }

    const { error: signInError } = await authClient.signIn.username({
      username,
      password,
    })
    if (signInError) {
      console.error("Post-signup sign-in error:", signInError)
      return
    }

    const { data: session } = await authClient.getSession()
    const role = session?.user?.role
    router.replace(role === "admin" ? "/admin" : "/")
  }

  return (
    <main className="flex h-dvh w-screen justify-center items-center md:px-8 motion-preset-blur-up-sm">
      <LoginForm mode="signup" onSubmit={handleSubmit} className="w-96" />
    </main>
  )
}
