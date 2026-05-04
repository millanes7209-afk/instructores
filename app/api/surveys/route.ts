import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { ensureSurveyTable, query } from '@/lib/db';

type Categoria = 'puntualidad' | 'satisfaccion' | 'calificacion_instructor';

const CATEGORIAS: Categoria[] = ['puntualidad', 'satisfaccion', 'calificacion_instructor'];

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

    for (const categoria of CATEGORIAS) {
      const current = answers[categoria];
      const rating = Number(current?.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json({ error: `rating invalido para ${categoria}` }, { status: 400 });
      }
    }

    const surveyId = randomUUID();

    for (const categoria of CATEGORIAS) {
      const current = answers[categoria]!;
      await query(
        `
        INSERT INTO survey_responses (survey_id, instructor_id, categoria, rating, comentario)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [surveyId, instructorId, categoria, current.rating, current.comment ?? null]
      );
    }

    return NextResponse.json({ ok: true, surveyId });
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar la encuesta' }, { status: 500 });
  }
}
