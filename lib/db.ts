import { Pool } from 'pg';

let tableReady = false;
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

export async function ensureSurveyTable() {
  if (tableReady) return;

  await query(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id SERIAL PRIMARY KEY,
      survey_id TEXT NOT NULL,
      instructor_id INTEGER NOT NULL,
      categoria TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comentario TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_survey_responses_instructor
      ON survey_responses (instructor_id);
  `);

  tableReady = true;
}
