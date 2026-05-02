export interface Instructor {
  id: number;
  nombre: string;
  especialidad: string;
  iniciales: string;
}

export interface Disciplina {
  nombre: string;
  icono: string;
  descripcion: string;
}

export interface Evaluacion {
  instructor_id: number;
  puntualidad: number;
  satisfaccion: number;
  calificacion_instructor: number;
  comentario: string;
  fecha: string;
}

export interface InstructorStats {
  promedios: {
    puntualidad: number;
    satisfaccion: number;
    calificacion_instructor: number;
  };
  promedio_general: number;
  total_evaluaciones: number;
}

export const disciplinas: Record<string, Disciplina> = {
  crossfit: { nombre: 'Crossfit', icono: '💪', descripcion: 'Entrenamiento funcional de alta intensidad' },
  spinning: { nombre: 'Spinning', icono: '🚴', descripcion: 'Ciclismo indoor con música energizante' },
  yoga: { nombre: 'Yoga', icono: '🧘', descripcion: 'Equilibrio entre mente y cuerpo' },
  funcional: { nombre: 'Funcional', icono: '🏋️', descripcion: 'Ejercicios funcionales para el día a día' },
  hiit: { nombre: 'HIIT', icono: '⚡', descripcion: 'Entrenamiento intervalado de alta intensidad' },
  pilates: { nombre: 'Pilates', icono: '🤸', descripcion: 'Fortalecimiento del core y flexibilidad' },
  boxeo: { nombre: 'Boxeo', icono: '🥊', descripcion: 'Deporte de combate y condición física' },
};

export const instructores: Record<number, Instructor> = {
  1: { id: 1, nombre: 'Carlos Méndez', especialidad: 'Crossfit', iniciales: 'CM' },
  2: { id: 2, nombre: 'María López', especialidad: 'Spinning', iniciales: 'ML' },
  3: { id: 3, nombre: 'Roberto Díaz', especialidad: 'Yoga', iniciales: 'RD' },
  4: { id: 4, nombre: 'Ana Torres', especialidad: 'Funcional', iniciales: 'AT' },
  5: { id: 5, nombre: 'Diego Ramírez', especialidad: 'HIIT', iniciales: 'DR' },
  6: { id: 6, nombre: 'Laura Sánchez', especialidad: 'Pilates', iniciales: 'LS' },
  7: { id: 7, nombre: 'Miguel Ángel', especialidad: 'Boxeo', iniciales: 'MA' },
  8: { id: 8, nombre: 'Pedro Gómez', especialidad: 'Crossfit', iniciales: 'PG' },
  9: { id: 9, nombre: 'Sofía Martínez', especialidad: 'Spinning', iniciales: 'SM' },
  10: { id: 10, nombre: 'Carmen Ruiz', especialidad: 'Yoga', iniciales: 'CR' },
  11: { id: 11, nombre: 'Javier Castro', especialidad: 'Funcional', iniciales: 'JC' },
  12: { id: 12, nombre: 'Elena Vargas', especialidad: 'HIIT', iniciales: 'EV' },
  13: { id: 13, nombre: 'Ricardo Morales', especialidad: 'Pilates', iniciales: 'RM' },
  14: { id: 14, nombre: 'Patricia Herrera', especialidad: 'Boxeo', iniciales: 'PH' },
};

export const categorias = {
  puntualidad: 'Puntualidad',
  satisfaccion: 'Satisfacción de la clase',
  calificacion_instructor: 'Calificación del instructor',
};

export function getEvaluacionesIniciales(): Evaluacion[] {
  const evaluaciones: Evaluacion[] = [];
  
  // Generar 30 evaluaciones por instructor (14 instructores = 420 evaluaciones)
  for (let instructorId = 1; instructorId <= 14; instructorId++) {
    for (let i = 1; i <= 30; i++) {
      const basePuntualidad = getBaseRating(instructorId, 'puntualidad');
      const baseSatisfaccion = getBaseRating(instructorId, 'satisfaccion');
      const baseCalificacion = getBaseRating(instructorId, 'calificacion');
      
      evaluaciones.push({
        instructor_id: instructorId,
        puntualidad: addVariation(basePuntualidad),
        satisfaccion: addVariation(baseSatisfaccion),
        calificacion_instructor: addVariation(baseCalificacion),
        comentario: getRandomComment(baseCalificacion),
        fecha: getRandomDate()
      });
    }
  }
  
  return evaluaciones;
}

function getBaseRating(instructorId: number, type: 'puntualidad' | 'satisfaccion' | 'calificacion'): number {
  const ratings: Record<number, Record<string, number>> = {
    1: { puntualidad: 3, satisfaccion: 4, calificacion: 4 },
    2: { puntualidad: 2, satisfaccion: 3, calificacion: 3 },
    3: { puntualidad: 4, satisfaccion: 4, calificacion: 4 },
    4: { puntualidad: 2, satisfaccion: 2, calificacion: 2 },
    5: { puntualidad: 3, satisfaccion: 3, calificacion: 3 },
    6: { puntualidad: 2, satisfaccion: 3, calificacion: 3 },
    7: { puntualidad: 4, satisfaccion: 4, calificacion: 4 },
    8: { puntualidad: 3, satisfaccion: 3, calificacion: 3 },
    9: { puntualidad: 4, satisfaccion: 4, calificacion: 4 },
    10: { puntualidad: 3, satisfaccion: 3, calificacion: 3 },
    11: { puntualidad: 4, satisfaccion: 4, calificacion: 4 },
    12: { puntualidad: 3, satisfaccion: 3, calificacion: 3 },
    13: { puntualidad: 4, satisfaccion: 4, calificacion: 4 },
    14: { puntualidad: 4, satisfaccion: 4, calificacion: 4 },
  };
  
  return ratings[instructorId]?.[type] || 3;
}

function addVariation(base: number): number {
  const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  const result = base + variation;
  return Math.max(1, Math.min(5, result)); // Mantener entre 1 y 5
}

function getRandomComment(rating: number): string {
  const comments: Record<number, string[]> = {
    5: ['¡Excelente clase!', 'Perfecto', 'Increíble', 'El mejor instructor', 'Muy profesional'],
    4: ['Muy buena clase', 'Buen instructor', 'Me gustó', 'Recomendado', 'Bien explicado'],
    3: ['La clase estuvo bien', 'Normal', 'Regular', 'Podría mejorar', 'Estuvo ok'],
    2: ['No me gustó', 'Podría ser mejor', 'Regular', 'Necesita mejorar', 'No fue lo mejor'],
    1: ['Muy malo', 'No recomendado', 'Pésimo', 'No volveré', 'Muy poco profesional']
  };
  
  const levelComments = comments[rating] || comments[3];
  return levelComments[Math.floor(Math.random() * levelComments.length)];
}

function getRandomDate(): string {
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

export function calcularPromedios(evaluaciones: Evaluacion[], instructorId: number): InstructorStats {
  const evalInstructor = evaluaciones.filter(e => e.instructor_id === instructorId);

  if (evalInstructor.length === 0) {
    return {
      promedios: {
        puntualidad: 0,
        satisfaccion: 0,
        calificacion_instructor: 0,
      },
      promedio_general: 0,
      total_evaluaciones: 0,
    };
  }

  const promedios = {
    puntualidad: Math.round(evalInstructor.reduce((sum, e) => sum + e.puntualidad, 0) / evalInstructor.length * 10) / 10,
    satisfaccion: Math.round(evalInstructor.reduce((sum, e) => sum + e.satisfaccion, 0) / evalInstructor.length * 10) / 10,
    calificacion_instructor: Math.round(evalInstructor.reduce((sum, e) => sum + e.calificacion_instructor, 0) / evalInstructor.length * 10) / 10,
  };

  return {
    promedios,
    promedio_general: Math.round(evalInstructor.reduce((sum, e) => sum + e.calificacion_instructor, 0) / evalInstructor.length * 10) / 10,
    total_evaluaciones: evalInstructor.length,
  };
}
