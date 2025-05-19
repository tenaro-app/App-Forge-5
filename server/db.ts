import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSockets for Neon serverless
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a pool connection to the database with improved settings for better stability
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client can stay idle before being closed
  connectionTimeoutMillis: 5000, // How long to try to connect before timing out
  maxUses: 7500, // Close and replace a pooled connection after this many uses
});

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema });

console.log('Database connection established');