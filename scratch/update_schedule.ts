import { Pool } from 'pg';

const connectionString = 'postgresql://postgres.nqdhquwirvnxcziygvwm:SCARYMOVIEscarymovie@aws-1-us-east-2.pooler.supabase.com:6543/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

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
  { sala: 'SALA 1', hora: '08:15', dia: 4, disc: 'ZUMBA', inst: 'Cristian' },
  { sala: 'SALA 1', hora: '08:15', dia: 5, disc: 'ZUMBA', inst: 'Carlos' },
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

async function update() {
  try {
    const client = await pool.connect();
    
    // 1. Asegurar Ana/Judith
    let anaRes = await client.query("SELECT id FROM instructores WHERE nombre = 'Ana/Judith'");
    let anaId;
    if (anaRes.rows.length === 0) {
      const insRes = await client.query("INSERT INTO instructores (nombre, iniciales, gimnasio_id) VALUES ('Ana/Judith', 'AJ', 1) RETURNING id");
      anaId = insRes.rows[0].id;
    } else {
      anaId = anaRes.rows[0].id;
    }

    // 2. Cargar mapeos dinámicos
    const instRes = await client.query("SELECT id, nombre FROM instructores");
    const discRes = await client.query("SELECT id, nombre FROM disciplinas");
    
    const instMap = new Map(instRes.rows.map(r => [r.nombre.toLowerCase().trim(), r.id]));
    const discMap = new Map(discRes.rows.map(r => [r.nombre.toLowerCase().trim(), r.id]));

    // 3. Limpiar
    await client.query("DELETE FROM horarios WHERE gimnasio_id = 1");

    // 4. Insertar
    console.log("Insertando horarios...");
    for (const h of horariosRaw) {
      const iId = instMap.get(h.inst.toLowerCase().trim());
      const dId = discMap.get(h.disc.toLowerCase().trim());

      if (iId && dId) {
        await client.query(
          "INSERT INTO horarios (gimnasio_id, instructor_id, disciplina_id, sala, dia_semana, hora_inicio) VALUES ($1, $2, $3, $4, $5, $6)",
          [1, iId, dId, h.sala, h.dia, h.hora]
        );
      } else {
        console.warn(`No se encontró mapeo para: ${h.disc} (${dId}) o ${h.inst} (${iId})`);
      }
    }

    console.log("¡Todo listo!");
    client.release();
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
    process.exit();
  }
}

update();
