import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import SurveyStepClient from './client';

interface PageProps {
  params: {
    instructorId: string;
    step: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function SurveyStepPage({ params }: PageProps) {
  const result = await query('SELECT * FROM instructores WHERE id = $1 LIMIT 1', [parseInt(params.instructorId)]);
  const instructor = result.rows[0];

  if (!instructor) {
    notFound();
  }

  return <SurveyStepClient instructor={instructor} step={params.step} />;
}

