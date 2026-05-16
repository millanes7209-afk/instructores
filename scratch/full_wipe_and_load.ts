import { Pool } from 'pg';

const connectionString = 'postgresql://postgres.nqdhquwirvnxcziygvwm:SCARYMOVIEscarymovie@aws-1-us-east-2.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const disciplinas = [
  { nombre: 'Combat', slug: 'combat', icono: '🥊' },
  { nombre: 'Grit', slug: 'grit', icono: '💪' },
  { nombre: 'Step', slug: 'step', icono: '👟' },
  { nombre: 'Body Pump', slug: 'body-pump', icono: '🏋️‍♂️' },
  { nombre: 'Jump', slug: 'jump', icono: '⬆️' },
  { nombre: 'Zumba', slug: 'zumba', icono: '💃' },
  { nombre: 'HIIT', slug: 'hiit', icono: '🔥' },
  { nombre: 'Spinning', slug: 'spinning', icono: '🚴' },
  { nombre: 'Reforme', slug: 'reforme', icono: '🤸' },
  { nombre: 'Strong', slug: 'strong', icono: '⚡' },
  { nombre: 'Boxing', slug: 'boxing', icono: '🥊' },
  { nombre: 'Aqua Fit', slug: 'aqua-fit', icono: '🏊' },
  { nombre: 'Aqua Dance', slug: 'aqua-dance', icono: '🌊' },
];

const instructores = [
  { nombre: 'Verónica', iniciales: 'VE' },
  { nombre: 'Jonathan', iniciales: 'JO' },
  { nombre: 'Paola', iniciales: 'PA' },
  { nombre: 'Gimena', iniciales: 'GI' },
  { nombre: 'Angeles', iniciales: 'AN' },
  { nombre: 'Alvaro', iniciales: 'AL' },
  { nombre: 'Carlos', iniciales: 'CA' },
  { nombre: 'Cristian', iniciales: 'CR' },
  { nombre: 'Javier', iniciales: 'JA' },
  { nombre: 'Mario', iniciales: 'MA' },
  { nombre: 'Diego', iniciales: 'DI' },
  { nombre: 'Agustina', iniciales: 'AG' },
  { nombre: 'Jomara', iniciales: 'JM' },
  { nombre: 'Carolina', iniciales: 'CO' },
  { nombre: 'Sergio', iniciales: 'SE' },
  { nombre: 'Emilio', iniciales: 'EM' },
  { nombre: 'Ana/Judith', iniciales: 'AJ' },
];

const horariosRaw = [
  // SALA 1
  { sala: 'SALA 1', hora: '06:15', dia: 1, disc: 'Combat', inst: 'Verónica' },
  { sala: 'SALA 1', hora: '06:15', dia: 2, disc: 'Grit', inst: 'Jonathan' },
  { sala: 'SALA 1', hora: '06:15', dia: 3, disc: 'Combat', inst: 'Paola' },
  { sala: 'SALA 1', hora: '06:15', dia: 4, disc: 'Grit', inst: 'Gimena' },
  { sala: 'SALA 1', hora: '06:15', dia: 5, disc: 'Combat', inst: 'Angeles' },
  { sala: 'SALA 1', hora: '07:15', dia: 1, disc: 'Body Pump', inst: 'Paola' },
  { sala: 'SALA 1', hora: '07:15', dia: 2, disc: 'Jump', inst: 'Alvaro' },
  { sala: 'SALA 1', hora: '07:15', dia: 3, disc: 'Grit', inst: 'Jonathan' },
  { sala: 'SALA 1', hora: '07:15', dia: 4, disc: 'Combat', inst: 'Paola' },
  { sala: 'SALA 1', hora: '07:15', dia: 5, disc: 'Body Pump', inst: 'Jonathan' },
  { sala: 'SALA 1', hora: '08:15', dia: 1, disc: 'Zumba', inst: 'Carlos' },
  { sala: 'SALA 1', hora: '08:15', dia: 2, disc: 'Zumba', inst: 'Cristian' },
  { sala: 'SALA 1', hora: '08:15', dia: 3, disc: 'Zumba', inst: 'Carlos' },
  { sala: 'SALA 1', hora: '08:15', dia: 4, disc: 'Zumba', inst: 'Cristian' },
  { sala: 'SALA 1', hora: '08:15', dia: 5, disc: 'Zumba', inst: 'Carlos' },
  { sala: 'SALA 1', hora: '08:15', dia: 6, disc: 'Combat', inst: 'Angeles' },
  { sala: 'SALA 1', hora: '09:15', dia: 6, disc: 'HIIT', inst: 'Carlos' },
  { sala: 'SALA 1', hora: '18:15', dia: 1, disc: 'Jump', inst: 'Gimena' },
  { sala: 'SALA 1', hora: '18:15', dia: 2, disc: 'Step', inst: 'Gimena' },
  { sala: 'SALA 1', hora: '18:15', dia: 3, disc: 'Zumba', inst: 'Cristian' },
  { sala: 'SALA 1', hora: '18:15', dia: 4, disc: 'Body Pump', inst: 'Paola' },
  { sala: 'SALA 1', hora: '18:15', dia: 5, disc: 'Grit', inst: 'Jonathan' },
  { sala: 'SALA 1', hora: '19:15', dia: 1, disc: 'Grit', inst: 'Jonathan' },
  { sala: 'SALA 1', hora: '19:15', dia: 2, disc: 'Combat', inst: 'Verónica' },
  { sala: 'SALA 1', hora: '19:15', dia: 3, disc: 'Strong', inst: 'Ana/Judith' },
  { sala: 'SALA 1', hora: '19:15', dia: 4, disc: 'Jump', inst: 'Alvaro' },
  { sala: 'SALA 1', hora: '19:15', dia: 5, disc: 'Zumba', inst: 'Cristian' },

  // SALA 2
  { sala: 'SALA 2', hora: '07:15', dia: 1, disc: 'Spinning', inst: 'Javier' },
  { sala: 'SALA 2', hora: '07:15', dia: 2, disc: 'Spinning', inst: 'Carlos' },
  { sala: 'SALA 2', hora: '07:15', dia: 3, disc: 'Spinning', inst: 'Mario' },
  { sala: 'SALA 2', hora: '07:15', dia: 4, disc: 'Spinning', inst: 'Carlos' },
  { sala: 'SALA 2', hora: '07:15', dia: 5, disc: 'Spinning', inst: 'Mario' },
  { sala: 'SALA 2', hora: '19:15', dia: 1, disc: 'Spinning', inst: 'Diego' },
  { sala: 'SALA 2', hora: '19:15', dia: 2, disc: 'Spinning', inst: 'Diego' },
  { sala: 'SALA 2', hora: '19:15', dia: 3, disc: 'Spinning', inst: 'Carlos' },
  { sala: 'SALA 2', hora: '19:15', dia: 4, disc: 'Spinning', inst: 'Mario' },
  { sala: 'SALA 2', hora: '19:15', dia: 5, disc: 'Spinning', inst: 'Diego' },

  // SALA 3
  { sala: 'SALA 3', hora: '08:15', dia: 1, disc: 'Reforme', inst: 'Gimena' },
  { sala: 'SALA 3', hora: '08:15', dia: 2, disc: 'Reforme', inst: 'Agustina' },
  { sala: 'SALA 3', hora: '08:15', dia: 3, disc: 'Reforme', inst: 'Gimena' },
  { sala: 'SALA 3', hora: '08:15', dia: 4, disc: 'Reforme', inst: 'Carolina' },
  { sala: 'SALA 3', hora: '08:15', dia: 5, disc: 'Reforme', inst: 'Gimena' },
  { sala: 'SALA 3', hora: '09:15', dia: 1, disc: 'Reforme', inst: 'Jomara' },
  { sala: 'SALA 3', hora: '09:15', dia: 2, disc: 'Reforme', inst: 'Gimena' },
  { sala: 'SALA 3', hora: '09:15', dia: 3, disc: 'Reforme', inst: 'Jomara' },
  { sala: 'SALA 3', hora: '09:15', dia: 4, disc: 'Reforme', inst: 'Agustina' },
  { sala: 'SALA 3', hora: '09:15', dia: 5, disc: 'Reforme', inst: 'Jomara' },
  { sala: 'SALA 3', hora: '17:15', dia: 2, disc: 'Reforme', inst: 'Agustina' },
  { sala: 'SALA 3', hora: '17:15', dia: 4, disc: 'Reforme', inst: 'Carolina' },

  // SALA 4
  { sala: 'SALA 4', hora: '18:15', dia: 1, disc: 'Reforme', inst: 'Carolina' },
  { sala: 'SALA 4', hora: '18:15', dia: 2, disc: 'Reforme', inst: 'Jomara' },
  { sala: 'SALA 4', hora: '18:15', dia: 3, disc: 'Reforme', inst: 'Carolina' },
  { sala: 'SALA 4', hora: '18:15', dia: 4, disc: 'Reforme', inst: 'Gimena' },
  { sala: 'SALA 4', hora: '18:15', dia: 5, disc: 'Reforme', inst: 'Agustina' },
  { sala: 'SALA 4', hora: '19:15', dia: 1, disc: 'Reforme', inst: 'Jomara' },
  { sala: 'SALA 4', hora: '19:15', dia: 2, disc: 'Reforme', inst: 'Carolina' },
  { sala: 'SALA 4', hora: '19:15', dia: 3, disc: 'Reforme', inst: 'Jomara' },
  { sala: 'SALA 4', hora: '19:15', dia: 4, disc: 'Reforme', inst: 'Agustina' },
  { sala: 'SALA 4', hora: '19:15', dia: 5, disc: 'Reforme', inst: 'Jomara' },
  { sala: 'SALA 4', hora: '06:15', dia: 1, disc: 'HIIT', inst: 'Carlos' },
  { sala: 'SALA 4', hora: '06:15', dia: 2, disc: 'HIIT', inst: 'Sergio' },
  { sala: 'SALA 4', hora: '06:15', dia: 3, disc: 'HIIT', inst: 'Carlos' },
  { sala: 'SALA 4', hora: '06:15', dia: 4, disc: 'HIIT', inst: 'Sergio' },
  { sala: 'SALA 4', hora: '06:15', dia: 5, disc: 'HIIT', inst: 'Carlos' },
  { sala: 'SALA 4', hora: '07:15', dia: 5, disc: 'HIIT', inst: 'Sergio' },
  { sala: 'SALA 4', hora: '19:15', dia: 1, disc: 'HIIT', inst: 'Sergio' },
  { sala: 'SALA 4', hora: '19:15', dia: 2, disc: 'Boxing', inst: 'Emilio' },
  { sala: 'SALA 4', hora: '19:15', dia: 3, disc: 'HIIT', inst: 'Sergio' },
  { sala: 'SALA 4', hora: '19:15', dia: 4, disc: 'Boxing', inst: 'Emilio' },
  { sala: 'SALA 4', hora: '19:15', dia: 5, disc: 'HIIT', inst: 'Carlos' },

  // SALA 5
  { sala: 'SALA 5', hora: '07:15', dia: 1, disc: 'Aqua Fit', inst: 'Mario' },
  { sala: 'SALA 5', hora: '07:15', dia: 2, disc: 'Aqua Fit', inst: 'Diego' },
  { sala: 'SALA 5', hora: '07:15', dia: 3, disc: 'Aqua Fit', inst: 'Cristian' },
  { sala: 'SALA 5', hora: '07:15', dia: 4, disc: 'Aqua Fit', inst: 'Mario' },
  { sala: 'SALA 5', hora: '07:15', dia: 5, disc: 'Aqua Fit', inst: 'Cristian' },
  { sala: 'SALA 5', hora: '08:15', dia: 1, disc: 'Aqua Fit', inst: 'Cristian' },
  { sala: 'SALA 5', hora: '08:15', dia: 2, disc: 'Aqua Fit', inst: 'Mario' },
  { sala: 'SALA 5', hora: '08:15', dia: 3, disc: 'Aqua Fit', inst: 'Mario' },
  { sala: 'SALA 5', hora: '08:15', dia: 4, disc: 'Aqua Fit', inst: 'Mario' },
  { sala: 'SALA 5', hora: '08:15', dia: 5, disc: 'Aqua Fit', inst: 'Mario' },
  { sala: 'SALA 5', hora: '19:15', dia: 1, disc: 'Aqua Fit', inst: 'Diego' },
  { sala: 'SALA 5', hora: '19:15', dia: 2, disc: 'Aqua Fit', inst: 'Jomara' },
  { sala: 'SALA 5', hora: '19:15', dia: 3, disc: 'Aqua Fit', inst: 'Cristian' },
  { sala: 'SALA 5', hora: '19:15', dia: 4, disc: 'Aqua Fit', inst: 'Jomara' },
  { sala: 'SALA 5', hora: '19:15', dia: 5, disc: 'Aqua Fit', inst: 'Diego' },
];

async function run() {
  const client = await pool.connect();
  try {
    console.log('--- INICIANDO REINICIO TOTAL ---');

    // 1. Limpieza total
    console.log('Limpiando tablas...');
    await client.query('TRUNCATE TABLE evaluaciones, horarios, instructor_disciplinas, instructores, disciplinas RESTART IDENTITY CASCADE');

    // 2. Insertar Disciplinas
    console.log('Insertando disciplinas...');
    const discMap = new Map();
    for (const d of disciplinas) {
      const res = await client.query(
        'INSERT INTO disciplinas (nombre, slug, icono, gimnasio_id) VALUES ($1, $2, $3, 1) RETURNING id',
        [d.nombre, d.slug, d.icono]
      );
      discMap.set(d.nombre.toLowerCase().trim(), res.rows[0].id);
    }

    // 3. Insertar Instructores
    console.log('Insertando instructores...');
    const instMap = new Map();
    for (const i of instructores) {
      const res = await client.query(
        'INSERT INTO instructores (nombre, iniciales, gimnasio_id, activo) VALUES ($1, $2, 1, true) RETURNING id',
        [i.nombre, i.iniciales]
      );
      instMap.set(i.nombre.toLowerCase().trim(), res.rows[0].id);
    }

    // 4. Crear relaciones instructor_disciplinas (basado en el cronograma)
    console.log('Creando relaciones instructor-disciplina...');
    const relations = new Set();
    for (const h of horariosRaw) {
      const iId = instMap.get(h.inst.toLowerCase().trim());
      const dId = discMap.get(h.disc.toLowerCase().trim());
      if (iId && dId) {
        const key = `${iId}-${dId}`;
        if (!relations.has(key)) {
          await client.query('INSERT INTO instructor_disciplinas (instructor_id, disciplina_id) VALUES ($1, $2)', [iId, dId]);
          relations.add(key);
        }
      }
    }

    // 5. Insertar Horarios
    console.log('Insertando horarios...');
    for (const h of horariosRaw) {
      const iId = instMap.get(h.inst.toLowerCase().trim());
      const dId = discMap.get(h.disc.toLowerCase().trim());
      if (iId && dId) {
        await client.query(
          'INSERT INTO horarios (gimnasio_id, instructor_id, disciplina_id, sala, dia_semana, hora_inicio) VALUES ($1, $2, $3, $4, $5, $6)',
          [1, iId, dId, h.sala, h.dia, h.hora]
        );
      }
    }

    console.log('--- REINICIO COMPLETADO CON ÉXITO ---');
  } catch (err) {
    console.error('ERROR CRÍTICO:', err);
  } finally {
    client.release();
    await pool.end();
    process.exit();
  }
}

run();
