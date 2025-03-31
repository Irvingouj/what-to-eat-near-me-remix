import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema.js';

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Global singleton instances
let globalPool: pkg.Pool | null = null;
let globalDb: ReturnType<typeof drizzle<typeof schema, pkg.Pool>> | null = null;

// Get pool instance
export function getPool(): pkg.Pool {
  if (!globalPool) {
    globalPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return globalPool;
}

// Get DB instance
export function getDb() {
  if (!globalDb) {
    const pool = getPool();
    globalDb = drizzle(pool, { schema });
  }
  return globalDb;
}

export async function startupCheck() {
  // Test database connection on startup
  getPool().connect()
    .then((client) => {
      console.log('Successfully connected to the database');
      client.release();
    })
    .catch((err) => {
      console.error('Failed to connect to the database:', err);
      process.exit(1);
    });
}

// Export the db instance for convenience
export const db = getDb();
