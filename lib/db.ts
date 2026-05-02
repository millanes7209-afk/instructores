import { sql } from '@vercel/postgres';

let tableReady = false;

export async function ensureSurveyTable() {
  if (tableReady) return;

  await sql`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id SERIAL PRIMARY KEY,
      survey_id TEXT NOT NULL,
      instructor_id INTEGER NOT NULL,
      categoria TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comentario TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_survey_responses_instructor
      ON survey_responses (instructor_id);
  `;

  tableReady = true;
}
