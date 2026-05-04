'use server';

import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- DISCIPLINAS ---

export async function createDisciplina(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  const icono = formData.get('icono') as string;
  
  // Create slug from name
  const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await query(
    'INSERT INTO disciplinas (nombre, descripcion, slug, icono) VALUES ($1, $2, $3, $4)',
    [nombre, descripcion, slug, icono]
  );

  revalidatePath('/admin/disciplinas');
  revalidatePath('/');
}

export async function updateDisciplina(id: string, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const descripcion = formData.get('descripcion') as string;
  const icono = formData.get('icono') as string;
  const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await query(
    'UPDATE disciplinas SET nombre = $1, descripcion = $2, slug = $3, icono = $4 WHERE id = $5',
    [nombre, descripcion, slug, icono, id]
  );

  revalidatePath('/admin/disciplinas');
  revalidatePath('/');
}

export async function deleteDisciplina(id: string) {
  // Eliminamos relaciones primero
  await query('DELETE FROM instructor_disciplinas WHERE disciplina_id = $1', [id]);
  await query('DELETE FROM disciplinas WHERE id = $1', [id]);
  revalidatePath('/admin/disciplinas');
  revalidatePath('/');
}


// --- INSTRUCTORES ---

export async function createInstructor(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const iniciales = formData.get('iniciales') as string;
  const disciplinasIds = formData.getAll('disciplinas') as string[]; // Multi-select array

  // Insertar instructor
  const res = await query(
    'INSERT INTO instructores (nombre, iniciales) VALUES ($1, $2) RETURNING id',
    [nombre, iniciales]
  );
  
  const instructorId = res.rows[0].id;

  // Insertar relaciones en tabla N:M
  for (const discId of disciplinasIds) {
    if (discId) {
      await query(
        'INSERT INTO instructor_disciplinas (instructor_id, disciplina_id) VALUES ($1, $2)',
        [instructorId, discId]
      );
    }
  }

  revalidatePath('/admin/instructores');
  revalidatePath('/');
}

export async function updateInstructor(id: string, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const iniciales = formData.get('iniciales') as string;
  const disciplinasIds = formData.getAll('disciplinas') as string[];

  // Actualizar datos base
  await query(
    'UPDATE instructores SET nombre = $1, iniciales = $2 WHERE id = $3',
    [nombre, iniciales, id]
  );

  // Actualizar relaciones (borrar y re-insertar es más fácil)
  await query('DELETE FROM instructor_disciplinas WHERE instructor_id = $1', [id]);
  
  for (const discId of disciplinasIds) {
    if (discId) {
      await query(
        'INSERT INTO instructor_disciplinas (instructor_id, disciplina_id) VALUES ($1, $2)',
        [id, discId]
      );
    }
  }

  revalidatePath('/admin/instructores');
  revalidatePath('/');
}

export async function deleteInstructor(id: string) {
  // Las FK con ON DELETE CASCADE deberían borrar evaluaciones y relaciones.
  // Pero por si acaso, lo hacemos manual
  await query('DELETE FROM evaluaciones WHERE instructor_id = $1', [id]);
  await query('DELETE FROM instructor_disciplinas WHERE instructor_id = $1', [id]);
  await query('DELETE FROM instructores WHERE id = $1', [id]);
  
  revalidatePath('/admin/instructores');
  revalidatePath('/');
}
