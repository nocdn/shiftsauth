// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  // on same domain you can omit baseURL, but it's fine to be explicit
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  plugins: [
    // makes user.is_admin etc. available in types + runtime
    inferAdditionalFields<typeof auth>(),
  ],
})
