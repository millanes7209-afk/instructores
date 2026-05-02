# Sistema de Instructores - Next.js

Sistema de evaluación de instructores de gimnasio compatible con Vercel.

## Características

- ✅ **7 disciplinas** (Crossfit, Spinning, Yoga, Funcional, HIIT, Pilates, Boxeo)
- ✅ **14 instructores** (2 por disciplina)
- ✅ **Sistema de calificación** (puntualidad, satisfacción, calificación)
- ✅ **Encuestas paso a paso**
- ✅ **Estadísticas por disciplina**
- ✅ **Compatible con Vercel**

## Tecnologías

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Vercel Postgres** (para respuestas reales)

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## Deploy en Vercel (con datos reales)

1. **Sube este proyecto a GitHub**.
2. **Importa el repo en [Vercel](https://vercel.com/new)**.
3. En Vercel, abre tu proyecto y ve a **Storage > Create Database > Postgres**.
4. Conecta la base de datos al proyecto (Vercel agrega las variables de entorno automaticamente).
5. Ejecuta el deploy.

## Estructura del Proyecto

```
app/
├── page.tsx                    # Página principal (disciplinas)
├── disciplina/[disciplina]/     # Detalle de disciplina
├── calificar/                  # Sistema de calificación
├── estadisticas/               # Estadísticas
└── layout.tsx                  # Layout principal

lib/
└── data.ts                     # Datos y lógica del negocio
```

## Funcionalidades

### Disciplinas
- Listado de todas las disciplinas disponibles
- Vista detallada por disciplina con instructores

### Calificación
- Selección de instructor
- Encuesta de 3 pasos
- Calificación por estrellas (1-5)
- Comentarios opcionales

### Estadísticas
- Resumen por disciplina
- Promedios generales
- Total de evaluaciones
- Comparación entre instructores

## Datos

- Las respuestas del cuestionario se guardan en la tabla `survey_responses` en Vercel Postgres.
- La tabla se crea automaticamente en el primer envio de encuesta.
- La vista de estadisticas lee datos reales de esa tabla.

## Personalización

Para modificar instructores, disciplinas o evaluaciones:

1. Editar `lib/data.ts`
2. Modificar los arrays correspondientes
3. Los cambios se reflejarán automáticamente

## Deploy

```bash
# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

El proyecto esta optimizado para Vercel. Solo asegúrate de conectar Vercel Postgres antes del deploy final.
