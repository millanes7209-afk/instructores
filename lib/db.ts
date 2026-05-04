import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    throw new Error('Missing SUPABASE_DB_URL environment variable');
  }

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  return pool;
}

export async function query<T>(text: string, params: unknown[] = []) {
  const client = getPool();
  return client.query<T>(text, params);
}
