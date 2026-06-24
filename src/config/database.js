import pkg from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
const { PrismaClient } = pkg

const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({
        url: 'file:./dev.db',
    }),
})

const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log('SQLite connected successfully.')
    } catch (err) {
        console.log('Error SQLite', err.message)
    }
}

export { prisma, connectDB }
