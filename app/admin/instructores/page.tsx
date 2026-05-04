import { query } from '@/lib/db';
import InstructoresCrudClient from './CrudClient';

export const dynamic = 'force-dynamic';

export default async function AdminInstructoresPage() {
  const result = await query(`
    SELECT i.*, 
           COALESCE(
             (
               SELECT json_agg(d.id) 
               FROM instructor_disciplinas id 
               JOIN disciplinas d ON d.id = id.disciplina_id 
               WHERE id.instructor_id = i.id
             ), 
             '[]'
           ) as disciplina_ids,
           COALESCE(
             (
               SELECT array_agg(d.nombre) 
               FROM instructor_disciplinas id 
               JOIN disciplinas d ON d.id = id.disciplina_id 
               WHERE id.instructor_id = i.id
             ), 
             ARRAY[]::text[]
           ) as disciplinas
    FROM instructores i
    ORDER BY i.nombre ASC
  `);
  
  const instructores = result.rows;

  const resultDisciplinas = await query('SELECT id, nombre FROM disciplinas ORDER BY nombre ASC');
  const todasDisciplinas = resultDisciplinas.rows;

  return (
    <InstructoresCrudClient 
      initialData={instructores} 
      todasDisciplinas={todasDisciplinas} 
    />
  );
}
