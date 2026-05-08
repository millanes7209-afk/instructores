import { query } from './lib/db';

async function inspectDB() {
  try {
    console.log('--- TABLES ---');
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.table(tables.rows);

    for (const table of tables.rows) {
      const name = table.table_name;
      console.log(`\n--- SCHEMA: ${name} ---`);
      const columns = await query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
      `, [name]);
      console.table(columns.rows);

      console.log(`\n--- DATA SAMPLE: ${name} ---`);
      const data = await query(`SELECT * FROM ${name} LIMIT 3`);
      console.table(data.rows);
    }

  } catch (err) {
    console.error('Error inspecting DB:', err);
  } finally {
    process.exit();
  }
}

inspectDB();
