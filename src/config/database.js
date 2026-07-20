import 'dotenv/config'
import pkg from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaPg } from "@prisma/adapter-pg"

const { PrismaClient } = pkg

// const prisma = new PrismaClient({
//     adapter: new PrismaBetterSqlite3({
//         url: 'file:./dev.db',
//     }),
// })

// const connectDB = async () => {
//     try {
//         await prisma.$connect()
//         console.log('SQLite connected successfully.')
//     } catch (err) {
//         console.log('Error SQLite', err.message)
//     }
// }

// export { prisma, connectDB }

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const connectDB = async () => {
    try {
        await prisma.$connect()
        console.log('Database connected successfully.')
    } catch (err) {
        console.log('Error database', err.message)
    }
}

export { prisma, connectDB }