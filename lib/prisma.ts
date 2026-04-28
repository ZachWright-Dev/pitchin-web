// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const base = new PrismaClient({ adapter })

export const prisma = base.$extends(withAccelerate())
export const prismaForAuth = base // plain client for NextAuth adapter