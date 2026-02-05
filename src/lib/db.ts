import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
console.log('Prisma DB URL:', dbUrl)
const adapter = new PrismaBetterSqlite3({
  url: dbUrl,
})

export const db = new PrismaClient({ adapter })
