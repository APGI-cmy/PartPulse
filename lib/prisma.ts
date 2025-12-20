import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // When using connection pooling (DATABASE_POOL_URL), append pgbouncer=true
  // This prevents "prepared statement already exists" errors (Postgres error 42P05)
  const databaseUrl = process.env.DATABASE_POOL_URL || process.env.DATABASE_URL || '';
  const connectionString = process.env.DATABASE_POOL_URL && databaseUrl
    ? `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}pgbouncer=true`
    : databaseUrl;

  return new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
