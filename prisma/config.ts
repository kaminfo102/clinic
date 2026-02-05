// prisma/config.ts
import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasources: {
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL,
    },
  },
})