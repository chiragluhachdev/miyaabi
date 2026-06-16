// Set (or create) the admin login password.
//
// The app has no admin-password UI — this standalone script is the way to rotate
// it. It bcrypt-hashes the password (same scheme as src/models/Admin.ts) and
// updates the `admins` collection directly.
//
// Usage:
//   node scripts/set-admin-password.mjs '<new-password>'
//   ADMIN_EMAIL=admin@miyaabi.com node scripts/set-admin-password.mjs '<new-password>'
//
// Reads MONGODB_URI / ADMIN_EMAIL / ADMIN_NAME from the environment, falling back
// to .env.local then .env (real env vars win).

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { readFileSync, existsSync } from "node:fs";

// Minimal env loader: .env.local then .env, never overriding a real env var.
for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}

const password = process.argv[2] || process.env.ADMIN_PASSWORD;
const email = (process.env.ADMIN_EMAIL || "admin@miyaabi.com").toLowerCase().trim();
const name = process.env.ADMIN_NAME || "Admin";

if (!password) {
  console.error("Usage: node scripts/set-admin-password.mjs '<new-password>'");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set (.env.local / .env / environment).");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 10);
await mongoose.connect(process.env.MONGODB_URI);
const now = new Date();
const res = await mongoose.connection.collection("admins").updateOne(
  { email },
  {
    $set: { passwordHash, updatedAt: now },
    $setOnInsert: { email, name, role: "admin", createdAt: now },
  },
  { upsert: true }
);
console.log(
  res.upsertedCount
    ? `✅ Created admin "${email}" with the new password.`
    : `✅ Updated password for admin "${email}".`
);
await mongoose.disconnect();
process.exit(0);
