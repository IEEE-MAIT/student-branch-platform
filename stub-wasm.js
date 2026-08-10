#!/usr/bin/env node
/**
 * stub-wasm.js
 *
 * Stubs the three @prisma/client/runtime WASM files that ship with the
 * npm package but are never loaded at runtime when using Prisma Accelerate
 * with `prisma generate --no-engine`.
 *
 * Without stubbing, these three files alone add ~6 MiB to the Cloudflare
 * Worker bundle, pushing it over the 3 MiB free-tier limit.
 *
 * Note: .prisma/client/query_engine_bg.wasm is NOT present when generated
 * with --no-engine, so we don't need to handle it.
 */

const fs = require('fs');
const path = require('path');

const nodeModulesDir = path.join(
  __dirname,
  '.open-next/server-functions/default/node_modules'
);

// Minimal valid WASM module (magic bytes + version)
const WASM_STUB = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);

const STUB_FILES = [
  path.join(nodeModulesDir, '@prisma/client/runtime/query_engine_bg.postgresql.wasm'),
  path.join(nodeModulesDir, '@prisma/client/runtime/query_engine_bg.mysql.wasm'),
  path.join(nodeModulesDir, '@prisma/client/runtime/query_engine_bg.sqlite.wasm'),
];

if (!fs.existsSync(nodeModulesDir)) {
  console.warn(`[stub-wasm] node_modules not found at: ${nodeModulesDir}`);
  console.warn('[stub-wasm] Skipping — bundle may be too large.');
  process.exit(0);
}

let stubbed = 0;
for (const filePath of STUB_FILES) {
  if (fs.existsSync(filePath)) {
    const before = fs.statSync(filePath).size;
    fs.writeFileSync(filePath, WASM_STUB);
    console.log(
      `[stub-wasm] Stubbed (${(before / 1024).toFixed(0)} KiB → 8 B): ${path.relative(__dirname, filePath)}`
    );
    stubbed++;
  } else {
    console.log(`[stub-wasm] Not present (skip): ${path.relative(__dirname, filePath)}`);
  }
}

console.log(`[stub-wasm] Done. ${stubbed} file(s) stubbed.`);
