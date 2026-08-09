/**
 * @file src/lib/db.ts
 * @description Centralized Prisma ORM Connection Engine using Neon Driver Adapter.
 * 
 * Works gracefully in Edge runtimes like Cloudflare Pages and Next.js Edge APIs.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

if (typeof window === 'undefined') {
  // Set up WebSocket constructor for Node.js/Edge compatibility
  neonConfig.webSocketConstructor = ws;
}

if (!process.env.DATABASE_URI) {
  console.warn('[DB WARNING] DATABASE_URI is not set. Database connections will fail.');
}

const connectionString = process.env.DATABASE_URI || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
