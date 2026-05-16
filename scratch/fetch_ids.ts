import { query } from '../lib/db';

async function run() {
  try {
    const inst = await query('SELECT id, nombre FROM instructores ORDER BY nombre');
    console.log('--- INSTRUCTORES ---');
    console.table(inst.rows);

    const disc = await query('SELECT id, nombre FROM disciplinas ORDER BY nombre');
    console.log('--- DISCIPLINAS ---');
    console.table(disc.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
