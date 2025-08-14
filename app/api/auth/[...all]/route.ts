// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
// NOTE: if you ever see a "reading 'handler'" error, some examples show auth.handler;
// current docs accept the auth instance directly.
