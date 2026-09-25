import { AIAnalysisResult, SchoolProfile, RPEData, ProtaItem } from '../types';

export async function analyzeKaldikWithAI(params: {
  textData?: string;
  imageBase64?: string;
  mimeType?: string;
  academicYear?: string;
  schoolName?: string;
}): Promise<AIAnalysisResult> {
  const response = await fetch('/api/analyze-kaldik', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error (${response.status})`);
  }

  return response.json();
}

export async function requestCurriculumAssistant(params: {
  profile: SchoolProfile;
  rpeData: RPEData;
  protaItems: ProtaItem[];
  promptType: string;
  customQuery?: string;
}): Promise<string> {
  const response = await fetch('/api/curriculum-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Server error (${response.status})`);
  }

  const data = await response.json();
  return data.text || '';
}
