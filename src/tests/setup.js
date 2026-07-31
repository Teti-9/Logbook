import pkg from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Client } from 'pg'
import { afterEach, afterAll } from 'vitest'

const { PrismaClient } = pkg

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set before loading the Vitest setup file.')
}

if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'test-secret'
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter })

async function truncateAllTables(client) {
    const { rows } = await client.query(`
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public' AND tablename != '_prisma_migrations'
    `)

    if (rows.length === 0) return

    const tableNames = rows.map((row) => `"${row.tablename}"`).join(', ')
    await client.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`)
}

afterEach(async () => {
    const client = new Client({ connectionString: process.env.DATABASE_URL })
    await client.connect()
    await truncateAllTables(client)
    await client.end()
})

afterAll(async () => {
    await prisma.$disconnect()
})