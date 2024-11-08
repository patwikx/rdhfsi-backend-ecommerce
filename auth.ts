import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { authConfig } from "./auth.config"
import { getUserById } from "@/data/user"
import { getAccountByUserId } from "./data/account"
import prismadb from "./lib/prismadb"


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true

      const existingUser = await getUserById(user.id)

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.name = token.name as string
        session.user.email = token.email
        session.user.id = token.id as string
        session.user.storeId = token.storeId as string
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.firstName
      token.email = existingUser.email
      token.id = existingUser.id
      token.storeId = existingUser.storeId

      return token
    },
  },
})