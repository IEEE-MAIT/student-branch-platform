/**
 * @file src/lib/db.ts
 * @description Centralized Prisma Client using Prisma Accelerate.
 *
 * Prisma Accelerate acts as an edge-compatible connection pooler proxy,
 * eliminating the need for WASM query engines or driver adapters.
 * Compatible with Cloudflare Workers via @prisma/client/edge + withAccelerate().
 *
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

if (!process.env.DATABASE_URL) {
  console.warn(
    "[DB WARNING] DATABASE_URL is not set. Database connections will fail.",
  );
}

export const prisma = new PrismaClient().$extends(withAccelerate());
