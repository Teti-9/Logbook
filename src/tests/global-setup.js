import { execSync } from 'node:child_process'
import { PostgreSqlContainer } from '@testcontainers/postgresql'

let container

export async function setup() {
    container = await new PostgreSqlContainer('postgres:16').start()

    process.env.DATABASE_URL = container.getConnectionUri()

    execSync('npx prisma migrate deploy', {
        env: process.env,
        stdio: 'inherit',
    })
}

export async function teardown() {
    await container?.stop()
}