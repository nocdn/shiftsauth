// lib/auth.ts
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { username, admin as adminPlugin } from "better-auth/plugins"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL!,
  ssl: { rejectUnauthorized: false },
})

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: pool,
  emailAndPassword: { enabled: true },
  plugins: [
    nextCookies(),
    username(),
    adminPlugin({ defaultRole: "user", adminRoles: ["admin"] }),
  ],
})
