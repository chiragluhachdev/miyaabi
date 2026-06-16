import mongoose from "mongoose";

// Serverless-safe Mongoose connection.
//
// On Vercel each function invocation may run in a fresh module scope, and Next.js
// hot-reload re-imports modules constantly in dev. Opening a new connection each
// time exhausts the Atlas connection pool. We cache a single connection promise on
// the global object so it survives both hot-reload and warm Lambda re-use.

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = global as unknown as { _mongoose?: MongooseCache };

const cached: MongooseCache =
  globalForMongoose._mongoose ?? (globalForMongoose._mongoose = { conn: null, promise: null });

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (and to Vercel project env)."
    );
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      // In serverless we never want queries to buffer while disconnected — fail fast.
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next request can retry instead of reusing a rejected promise.
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
