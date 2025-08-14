// app/(auth)/signup/page.tsx
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
    // Create the account with username + email + password
    const { error: signUpError } = await authClient.signUp.email({
      email: email!, // required by API
      password,
      username,
      name: username, // optional
    })

    if (signUpError) {
      console.error("Sign up error:", signUpError)
      return
    }

    // Ensure the user is signed in (explicit even if your config auto-signs in)
    const { data, error: signInError } = await authClient.signIn.username({
      username,
      password,
    })
    if (signInError) {
      console.error("Post-signup sign-in error:", signInError)
      return
    }

    const isAdmin = data?.user?.is_admin === true
    router.replace(isAdmin ? "/admin" : "/")
  }

  return (
    <main className="flex h-dvh w-screen justify-center items-center px-8">
      <LoginForm mode="signup" onSubmit={handleSubmit} className="w-96" />
    </main>
  )
}
