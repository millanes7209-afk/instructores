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

    // 1. Detectar el horario_id automáticamente
    const now = new Date();
    // En JS getDay() es 0=Dom, 1=Lun... Adaptamos a tu tabla (1=Lun, 6=Sab)
    const diaSemana = now.getDay() === 0 ? 7 : now.getDay(); 
    const horaActual = now.toLocaleTimeString('en-GB', { hour12: false }); // "HH:MM:SS"

    // Buscamos el horario más cercano que haya empezado hace no más de 3 horas
    const horarioResult = await query(
      `
      SELECT id FROM horarios 
      WHERE instructor_id = $1 
      AND dia_semana = $2 
      AND hora_inicio <= $3::TIME
      AND hora_inicio > ($3::TIME - INTERVAL '3 hours')
      ORDER BY hora_inicio DESC 
      LIMIT 1
      `,
      [instructorId, diaSemana, horaActual]
    );

    const horarioId = horarioResult.rows[0]?.id || null;

    // 2. Insertar en la tabla 'evaluaciones' con el horario detectado
    await query(
      `
      INSERT INTO evaluaciones (instructor_id, puntualidad, satisfaccion, calificacion_instructor, comentario, horario_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
      [instructorId, p, s, c, comentario, horarioId]
    );

    return NextResponse.json({ ok: true, matchedSchedule: !!horarioId });
  } catch (error) {
    console.error('Error saving survey:', error);
    return NextResponse.json({ error: 'No se pudo guardar la encuesta' }, { status: 500 });
  }
}
