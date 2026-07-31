import { execSync } from 'node:child_process'

let container

async function resolveDatabaseUrl() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL
    }

    try {
        const { PostgreSqlContainer } = await import('@testcontainers/postgresql')
        container = await new PostgreSqlContainer('postgres:16').start()
        process.env.DATABASE_URL = container.getConnectionUri()
        return process.env.DATABASE_URL
    } catch (error) {
        throw new Error(
            `DATABASE_URL is not set and Testcontainers could not start PostgreSQL. ` +
            `Set DATABASE_URL to a reachable Postgres instance or run Docker locally. ` +
            `Original error: ${error.message}`
        )
    }
}

export async function setup() {
    await resolveDatabaseUrl()

    execSync('npx prisma migrate deploy', {
        env: process.env,
        stdio: 'inherit',
    })
}

export async function teardown() {
    await container?.stop()
}
