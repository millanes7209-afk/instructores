import { query } from '@/lib/db';
import ChartsClient from './ChartsClient';

export const dynamic = 'force-dynamic';

export default async function AdminEstadisticasPage() {
  const { rows: disciplinas } = await query('SELECT * FROM disciplinas ORDER BY nombre ASC');
  const { rows: instructores } = await query(`
    SELECT DISTINCT i.* 
    FROM instructores i 
  `);
  
  // Traemos las evaluaciones vinculadas con su sala y horario
  const { rows: evaluaciones } = await query(`
    SELECT e.*, h.sala, h.hora_inicio, h.dia_semana, d.nombre as disciplina_nombre
    FROM evaluaciones e
    LEFT JOIN horarios h ON e.horario_id = h.id
    LEFT JOIN disciplinas d ON h.disciplina_id = d.id
    ORDER BY e.created_at DESC
  `);

  const { rows: horarios } = await query(`
    SELECT h.*, i.nombre as instructor_nombre, d.nombre as disciplina_nombre 
    FROM horarios h
    JOIN instructores i ON h.instructor_id = i.id
    JOIN disciplinas d ON h.disciplina_id = d.id
  `);

  return (
    <div>
      <ChartsClient 
        disciplinas={disciplinas}
        instructores={instructores}
        evaluaciones={evaluaciones}
        horarios={horarios}
      />
    </div>
  );
}
