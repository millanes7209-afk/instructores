import { query } from '@/lib/db';
import DisciplinasCrudClient from './CrudClient';

export const dynamic = 'force-dynamic';

export default async function AdminDisciplinasPage() {
  const result = await query('SELECT * FROM disciplinas ORDER BY nombre ASC');
  const disciplinas = result.rows;

  return (
    <DisciplinasCrudClient initialData={disciplinas} />
  );
}
