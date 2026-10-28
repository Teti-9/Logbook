import { execSync } from "node:child_process";

let postgresContainer;
let redisContainer;

async function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  try {
    const { PostgreSqlContainer } = await import("@testcontainers/postgresql");
    postgresContainer = await new PostgreSqlContainer("postgres:16").start();
    process.env.DATABASE_URL = postgresContainer.getConnectionUri();
    return process.env.DATABASE_URL;
  } catch (error) {
    throw new Error(
      `DATABASE_URL is not set and Testcontainers could not start PostgreSQL. ` +
        `Set DATABASE_URL to a reachable Postgres instance or run Docker locally. ` +
        `Original error: ${error.message}`,
    );
  }
}

async function resolveRedis() {
  if (process.env.REDIS_HOST) {
    return;
  }

  try {
    const { RedisContainer } = await import("@testcontainers/redis");
    redisContainer = await new RedisContainer("redis:7-alpine").start();
    process.env.REDIS_HOST = redisContainer.getHost();
    process.env.REDIS_PORT = String(redisContainer.getMappedPort(6379));
  } catch (error) {
    throw new Error(
      `REDIS_HOST is not set and Testcontainers could not start Redis. ` +
        `Set REDIS_HOST (and REDIS_PORT) to a reachable Redis instance or run Docker locally. ` +
        `Original error: ${error.message}`,
    );
  }
}

export async function setup() {
  await Promise.all([resolveDatabaseUrl(), resolveRedis()]);

  execSync("npx prisma generate", {
    env: process.env,
    stdio: "inherit",
  });

  execSync("npx prisma migrate deploy", {
    env: process.env,
    stdio: "inherit",
  });
}

export async function teardown() {
  await Promise.all([postgresContainer?.stop(), redisContainer?.stop()]);
}
