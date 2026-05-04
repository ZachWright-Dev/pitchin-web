import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'

// app/auth.ts
import { prismaForAuth } from '@/lib/prisma'
const adapter = PrismaAdapter(prismaForAuth)

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: adapter,
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user}) {
      if (user) token.id = user.id
      return token;
    },
    session({ session, token}) {
      session.user.id = token.id as string;
      return session;
    },
  },
})