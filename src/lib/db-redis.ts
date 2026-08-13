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

function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

// ─── Redis client (lazy) ─────────────────────────────────────────────────────
let redisClient: import('@upstash/redis').Redis | null = null;

async function getRedis() {
  if (!redisClient && isRedisConfigured()) {
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
  const { readDB } = await import('./db');
  return readDB();
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function readDBAsync(): Promise<DBStructure> {
  if (isRedisConfigured()) {
    const redis = await getRedis();
    if (!redis) throw new Error('Redis not available');

    let data = await redis.get<any>(REDIS_KEY);

    if (data) {
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {
          console.error('Failed to parse Redis JSON string:', err);
        }
      }
      const db = data as DBStructure;
      if (!db.events) db.events = [];
      if (!db.users) db.users = [];
      if (!db.organizations) db.organizations = [];
      if (!db.promotions) db.promotions = [];
      if (!db.membershipRequests) db.membershipRequests = [];
      return db;
    }

    // First time: seed Redis from initial data
    const seed = await getSeedData();
    await redis.set(REDIS_KEY, seed);
    return seed;
  }

  // Development: use local filesystem
  const { readDB } = await import('./db');
  return readDB();
}

export async function writeDBAsync(data: DBStructure): Promise<void> {
  if (isRedisConfigured()) {
    const redis = await getRedis();
    if (!redis) throw new Error('Redis not available');
    await redis.set(REDIS_KEY, data);
    return;
  }

  // Development: use local filesystem
  const { writeDB } = await import('./db');
  writeDB(data);
}

export async function resetDBAsync(): Promise<DBStructure> {
  const { resetDB } = await import('./db');
  const freshData = resetDB();

  if (isRedisConfigured()) {
    const redis = await getRedis();
    if (redis) {
      await redis.set(REDIS_KEY, freshData);
    }
  }

  return freshData;
}
