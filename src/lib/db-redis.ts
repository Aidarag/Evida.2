/**
 * db-redis.ts
 * 
 * Async database adapter:
 * - In production (Vercel): reads/writes to Upstash Redis
 * - In development (local): falls back to the filesystem JSON db
 * 
 * Drop-in replacement for readDB/writeDB — just add `await`.
 */

import { DBStructure } from './db';

const REDIS_KEY = 'evida:db';
const IS_PROD = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// ─── Redis client (lazy) ─────────────────────────────────────────────────────
let redisClient: import('@upstash/redis').Redis | null = null;

async function getRedis() {
  if (!redisClient && IS_PROD) {
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redisClient;
}

// ─── Seed data (same initial data as db.ts) ─────────────────────────────────
async function getSeedData(): Promise<DBStructure> {
  // Import readDB from the sync fs-based db to get the seed data
  const { readDB } = await import('./db');
  return readDB();
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function readDBAsync(): Promise<DBStructure> {
  if (IS_PROD) {
    const redis = await getRedis();
    if (!redis) throw new Error('Redis not available');

    const data = await redis.get<DBStructure>(REDIS_KEY);
    if (data) {
      // Ensure all required fields exist
      if (!data.membershipRequests) data.membershipRequests = [];
      return data;
    }

    // First time: seed Redis from initial data
    const seed = await getSeedData();
    await redis.set(REDIS_KEY, JSON.stringify(seed));
    return seed;
  }

  // Development: use local filesystem
  const { readDB } = await import('./db');
  return readDB();
}

export async function writeDBAsync(data: DBStructure): Promise<void> {
  if (IS_PROD) {
    const redis = await getRedis();
    if (!redis) throw new Error('Redis not available');
    await redis.set(REDIS_KEY, JSON.stringify(data));
    return;
  }

  // Development: use local filesystem
  const { writeDB } = await import('./db');
  writeDB(data);
}

export async function resetDBAsync(): Promise<DBStructure> {
  const { resetDB } = await import('./db');
  const freshData = resetDB();

  if (IS_PROD) {
    const redis = await getRedis();
    if (redis) {
      await redis.set(REDIS_KEY, JSON.stringify(freshData));
    }
  }

  return freshData;
}
