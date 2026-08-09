/**
 * @file src/lib/db.ts
 * @description Centralized Prisma ORM Connection Engine using Neon Driver Adapter.
 * 
 * EDGE SAFETY PROTOCOL:
 * Conditionally loads WebSocket implementations to prevent Node `ws` module crashes
 * on Cloudflare Edge while maintaining local `npm run dev` compatibility.
 * 
 * @author IEEE MAIT Webmaster
 * @license MIT
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

if (typeof WebSocket !== 'undefined') {
  // Cloudflare Edge natively supports WebSocket
  neonConfig.webSocketConstructor = WebSocket as any;
} else {
  // Local Node.js Development Fallback
  import('ws').then((wsModule) => {
    neonConfig.webSocketConstructor = wsModule.default || wsModule;
  }).catch(() => {});
}

if (!process.env.DATABASE_URI) {
  console.warn('[DB WARNING] DATABASE_URI is not set. Database connections will fail.');
}

const connectionString = process.env.DATABASE_URI || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
