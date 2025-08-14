// lib/auth.ts
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { username } from "better-auth/plugins"
import Database from "better-sqlite3"

// Tiny file DB for dev; change the path for prod (or switch to Postgres/MySQL later).
const db = new Database("./sqlite.db")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL, // optional but nice for accurate links
  database: db,
  // keep email+password like your current form
  emailAndPassword: { enabled: true },

  // optional: carry over your "admin" concept from Supabase
  user: {
    additionalFields: {
      is_admin: { type: "boolean", defaultValue: false, required: false },
    },
  },

  // makes cookies work automatically inside Server Actions in Next
  plugins: [nextCookies(), username()],
})
