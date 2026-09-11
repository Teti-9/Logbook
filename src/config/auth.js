import bcrypt from "bcryptjs";
import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./database.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:5173", "http://localhost:8000"],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
    password: {
      hash: (password) => bcrypt.hash(password, 12),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },

  advanced: {
    database: {
      generateId: "serial",
    },
  },
});
