/**
 * db-redis.ts
 * 
 * Async database adapter:
 * - In production (Vercel): reads/writes to Upstash Redis
 * - In development (local): falls back to the filesystem JSON db
 * 
 * Drop-in replacement for readDB/writeDB — just add `await`.
 */

import { DBStructure, initialDBData } from './db';

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

// ─── Seed data ──────────────────────────────────────────────────────────────
function getSeedData(): DBStructure {
  return initialDBData;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function readDBAsync(): Promise<DBStructure> {
  if (isRedisConfigured()) {
    try {
      const redis = await getRedis();
      if (redis) {
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
        const seed = getSeedData();
        await redis.set(REDIS_KEY, seed);
        return seed;
      }
    } catch (err) {
      console.error('Error in readDBAsync Redis operation:', err);
    }
  }

  // Development / Fallback: use initialDBData or local filesystem
  const { readDB } = await import('./db');
  return readDB();
}

export async function writeDBAsync(data: DBStructure): Promise<void> {
  if (isRedisConfigured()) {
    try {
      const redis = await getRedis();
      if (redis) {
        await redis.set(REDIS_KEY, data);
        return;
      }
    } catch (err) {
      console.error('Error in writeDBAsync Redis operation:', err);
    }
  }

  // Development: use local filesystem
  const { writeDB } = await import('./db');
  writeDB(data);
}

export async function resetDBAsync(): Promise<DBStructure> {
  const freshData = initialDBData;

  if (isRedisConfigured()) {
    try {
      const redis = await getRedis();
      if (redis) {
        await redis.set(REDIS_KEY, freshData);
      }
    } catch (err) {
      console.error('Error resetting Redis DB:', err);
    }
  }

  const { resetDB } = await import('./db');
  resetDB();
  return freshData;
}

