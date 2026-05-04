import { query } from '@/lib/db';
import ChartsClient from './ChartsClient';

export const dynamic = 'force-dynamic';

export default async function EstadisticasIndex() {
  const { rows: disciplinas } = await query('SELECT * FROM disciplinas ORDER BY nombre ASC');
  const { rows: instructores } = await query(`
    SELECT i.*, id.disciplina_id 
    FROM instructores i 
    JOIN instructor_disciplinas id ON i.id = id.instructor_id
  `);
  const { rows: evaluaciones } = await query('SELECT * FROM evaluaciones');

  return (
    <div className="container mx-auto px-4 py-8">
      <ChartsClient 
        disciplinas={disciplinas}
        instructores={instructores}
        evaluaciones={evaluaciones}
      />
    </div>
  );
}

