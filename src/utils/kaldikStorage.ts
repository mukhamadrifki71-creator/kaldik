import { KaldikEvent, AIAnalysisResult, SchoolProfile, CPMappingEntry } from '../types';
import { KALDIK_PRESETS, DEFAULT_SCHOOL_PROFILE } from '../data/defaultKaldik';
import { generateStandardCPMapping } from '../data/cpTpTemplates';

const KALDIK_STORAGE_PREFIX = 'kaldik_pai_events_';
const ANALYSIS_STORAGE_PREFIX = 'kaldik_pai_analysis_';
const PROFILE_STORAGE_KEY = 'kaldik_pai_profile';
const CP_MAPPING_STORAGE_PREFIX = 'kaldik_pai_cp_mapping_g';

/**
 * Normalizes academic year string for safe localStorage keys
 */
export function getAcademicYearStorageKey(academicYear: string): string {
  return `${KALDIK_STORAGE_PREFIX}${academicYear.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

/**
 * Loads the saved Kaldik events for a given academic year from localStorage.
 * Falls back to general uploaded kaldik, then to the default Pasuruan preset.
 */
export function loadSavedKaldikEvents(academicYear: string = '2024/2025'): KaldikEvent[] {
  try {
    const key = getAcademicYearStorageKey(academicYear);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Also check generic fallback if available
    const genericSaved = localStorage.getItem('kaldik_pai_uploaded_events');
    if (genericSaved) {
      const parsed = JSON.parse(genericSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gagal membaca kalender pendidikan dari penyimpanan lokal:', err);
  }

  // Fallback to default official preset
  return KALDIK_PRESETS[0]?.events || [];
}

/**
 * Persists the Kaldik events for a given academic year into localStorage.
 */
export function saveKaldikEvents(academicYear: string, events: KaldikEvent[]): void {
  try {
    const key = getAcademicYearStorageKey(academicYear);
    const dataStr = JSON.stringify(events);
    localStorage.setItem(key, dataStr);
    localStorage.setItem('kaldik_pai_uploaded_events', dataStr);
  } catch (err) {
    console.warn('Gagal menyimpan kalender pendidikan ke penyimpanan lokal:', err);
  }
}

/**
 * Loads saved AI analysis result for a given academic year.
 */
export function loadSavedAnalysisResult(academicYear: string): AIAnalysisResult | null {
  try {
    const key = `${ANALYSIS_STORAGE_PREFIX}${academicYear.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Gagal membaca hasil analisis AI dari penyimpanan lokal:', err);
  }
  return null;
}

/**
 * Persists AI analysis result for a given academic year into localStorage.
 */
export function saveAnalysisResult(academicYear: string, result: AIAnalysisResult | null): void {
  try {
    const key = `${ANALYSIS_STORAGE_PREFIX}${academicYear.replace(/[^a-zA-Z0-9]/g, '_')}`;
    if (result) {
      localStorage.setItem(key, JSON.stringify(result));
    } else {
      localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn('Gagal menyimpan hasil analisis AI ke penyimpanan lokal:', err);
  }
}

/**
 * Loads school profile from localStorage or returns default
 */
export function loadSavedSchoolProfile(): SchoolProfile {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.schoolName) {
        return {
          ...DEFAULT_SCHOOL_PROFILE,
          ...parsed
        };
      }
    }
  } catch (err) {
    console.warn('Gagal membaca profil sekolah dari penyimpanan lokal:', err);
  }
  return DEFAULT_SCHOOL_PROFILE;
}

/**
 * Saves school profile to localStorage
 */
export function saveSchoolProfile(profile: SchoolProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Gagal menyimpan profil sekolah ke penyimpanan lokal:', err);
  }
}

/**
 * Loads saved 2-column CP & Materi Esensial mapping per semester for a given grade.
 * Falls back to the official standard generator from BSKAP 032/2024.
 */
export function loadSavedCPMapping(grade: number): {
  sem1: CPMappingEntry[];
  sem2: CPMappingEntry[];
} {
  try {
    const key = `${CP_MAPPING_STORAGE_PREFIX}${grade}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.sem1) && Array.isArray(parsed.sem2)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Gagal membaca pemetaan CP Kelas ${grade} dari penyimpanan lokal:`, err);
  }

  return generateStandardCPMapping(grade);
}

/**
 * Persists 2-column CP & Materi Esensial mapping for a given grade.
 */
export function saveCPMapping(
  grade: number,
  data: { sem1: CPMappingEntry[]; sem2: CPMappingEntry[] }
): void {
  try {
    const key = `${CP_MAPPING_STORAGE_PREFIX}${grade}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Gagal menyimpan pemetaan CP Kelas ${grade} ke penyimpanan lokal:`, err);
  }
}
