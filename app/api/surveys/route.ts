import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

type Categoria = 'puntualidad' | 'satisfaccion' | 'calificacion_instructor';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const instructorId = Number(body?.instructorId);
    const answers = body?.answers as Partial<Record<Categoria, { rating: number; comment?: string }>>;

    if (!Number.isInteger(instructorId) || instructorId <= 0) {
      return NextResponse.json({ error: 'instructorId invalido' }, { status: 400 });
    }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'answers invalido' }, { status: 400 });
    }

    // Validar que tengamos las 3 calificaciones
    const p = Number(answers.puntualidad?.rating);
    const s = Number(answers.satisfaccion?.rating);
    const c = Number(answers.calificacion_instructor?.rating);
    const comentario = answers.calificacion_instructor?.comment || '';

    if ([p, s, c].some(r => !Number.isInteger(r) || r < 1 || r > 5)) {
      return NextResponse.json({ error: 'Calificaciones invalidas' }, { status: 400 });
    }

    // Insertar en la nueva tabla 'evaluaciones' (una sola fila)
    await query(
      `
      INSERT INTO evaluaciones (instructor_id, puntualidad, satisfaccion, calificacion_instructor, comentario)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [instructorId, p, s, c, comentario]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error saving survey:', error);
    return NextResponse.json({ error: 'No se pudo guardar la encuesta' }, { status: 500 });
  }
}
