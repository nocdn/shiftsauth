import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { username, admin as adminPlugin } from "better-auth/plugins"
import Database from "better-sqlite3"

const db = new Database("./sqlite.db")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: db,

  emailAndPassword: { enabled: true },

  plugins: [
    nextCookies(),
    username(),
    adminPlugin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
})
