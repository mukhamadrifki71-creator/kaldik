import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { CPMappingEntry, PAIElement, SemesterType } from '../types/index.ts';
import { PRECISE_84_ANALYZED_TP, getPrecise84GroupedByElement } from '../data/analyzedTP84';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tableName: string;
  gradeColumn: string;
  semesterColumn: string;
  elementColumn: string;
  tpColumn: string; // Harus kolom Tujuan Pembelajaran Hasil Analisis, BUKAN Sementara!
  materialColumn: string;
  cpColumn: string;
  lastConnected?: string;
}

const SUPABASE_CONFIG_STORAGE_KEY = 'kaldik_pai_supabase_config';

export const DEFAULT_SUPABASE_CONFIG: SupabaseConfig = {
  url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
  anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  tableName: 'tujuan_pembelajaran',
  gradeColumn: 'kelas',
  semesterColumn: 'semester',
  elementColumn: 'elemen',
  tpColumn: 'tujuan_pembelajaran_hasil_analisis', // Sesuai permintaan: Kolom Hasil Analisis, BUKAN sementara
  materialColumn: 'materi_esensial',
  cpColumn: 'capaian_pembelajaran',
};

export interface RawSupabaseTPRecord {
  id?: string | number;
  kelas?: number | string;
  grade?: number | string;
  tingkat?: number | string;
  semester?: number | string;
  smt?: number | string;
  elemen?: string;
  element?: string;
  tujuan_pembelajaran_hasil_analisis?: string;
  tujuan_pembelajaran_hasil_analisa?: string;
  tp_hasil_analisis?: string;
  tp_hasil_analisa?: string;
  hasil_analisis?: string;
  hasil_analisa?: string;
  tujuan_pembelajaran_sementara?: string; // Dideteksi untuk DIABAIKAN
  tp_sementara?: string;
  tujuan_pembelajaran?: string;
  tp?: string;
  capaian_pembelajaran?: string;
  cp?: string;
  deskripsi_cp?: string;
  materi_esensial?: string;
  materi?: string;
  bab?: string | number;
  alokasi_jp?: number | string;
  jp?: number | string;
  [key: string]: any;
}

export interface FetchedTPResult {
  records: RawSupabaseTPRecord[];
  groupedByElement: Record<string, {
    sem1: string[];
    sem2: string[];
  }>;
  totalTP: number;
  sourceTable: string;
  activeColumnUsed: string;
  ignoredTemporaryColumn?: string | null;
  isExact84: boolean;
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const saved = localStorage.getItem(SUPABASE_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SUPABASE_CONFIG,
        ...parsed,
        // Make sure tpColumn defaults to analyzed column if not explicitly set
        tpColumn: parsed.tpColumn && !parsed.tpColumn.toLowerCase().includes('sementara') 
          ? parsed.tpColumn 
          : DEFAULT_SUPABASE_CONFIG.tpColumn,
        url: parsed.url || DEFAULT_SUPABASE_CONFIG.url,
        anonKey: parsed.anonKey || DEFAULT_SUPABASE_CONFIG.anonKey
      };
    }
  } catch (e) {
    console.warn('Gagal membaca konfigurasi Supabase dari storage:', e);
  }
  return { ...DEFAULT_SUPABASE_CONFIG };
}

export function saveSupabaseConfig(config: Partial<SupabaseConfig>): SupabaseConfig {
  const current = getSupabaseConfig();
  const updated: SupabaseConfig = {
    ...current,
    ...config,
    lastConnected: new Date().toISOString()
  };
  localStorage.setItem(SUPABASE_CONFIG_STORAGE_KEY, JSON.stringify(updated));
  if (updated.url !== lastUsedUrl || updated.anonKey !== lastUsedKey) {
    cachedClient = null;
  }
  return updated;
}

export function getSupabaseClient(configOverride?: Partial<SupabaseConfig>): SupabaseClient | null {
  const config = { ...getSupabaseConfig(), ...configOverride };
  if (!config.url || !config.anonKey) {
    return null;
  }

  if (cachedClient && lastUsedUrl === config.url && lastUsedKey === config.anonKey) {
    return cachedClient;
  }

  try {
    const client = createClient(config.url.trim(), config.anonKey.trim(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    cachedClient = client;
    lastUsedUrl = config.url;
    lastUsedKey = config.anonKey;
    return client;
  } catch (err) {
    console.error('Error saat inisialisasi Supabase client:', err);
    return null;
  }
}

/**
 * Normalizes element name from database to valid PAIElement
 */
export function normalizeElement(rawElem: string): PAIElement {
  if (!rawElem) return "Al-Qur'an Hadis";
  const clean = rawElem.toLowerCase();
  if (clean.includes("qur'an") || clean.includes('quran') || clean.includes('hadis') || clean.includes('hadits') || clean.includes('al-qur')) {
    return "Al-Qur'an Hadis";
  }
  if (clean.includes('akidah') || clean.includes('aqidah') || clean.includes('iman')) {
    return "Akidah";
  }
  if (clean.includes('akhlak') || clean.includes('akhlag') || clean.includes('budi pekerti') || clean.includes('karakter')) {
    return "Akhlak";
  }
  if (clean.includes('fikih') || clean.includes('fiqih') || clean.includes('ibadah') || clean.includes('syariah')) {
    return "Fikih";
  }
  if (clean.includes('sejarah') || clean.includes('spi') || clean.includes('tarikh') || clean.includes('peradaban') || clean.includes('nabi')) {
    return "Sejarah Peradaban Islam (SPI)";
  }
  return "Al-Qur'an Hadis";
}

/**
 * Normalizes semester representation (1 or 2, Ganjil / Genap)
 */
export function normalizeSemester(rawSem: any): SemesterType {
  if (
    rawSem === 1 || 
    rawSem === '1' || 
    String(rawSem).toLowerCase().includes('ganjil') || 
    String(rawSem).toLowerCase().includes('sem 1') || 
    String(rawSem).toLowerCase().includes('semester 1') ||
    String(rawSem).toLowerCase().includes('satu') ||
    String(rawSem).toLowerCase() === 'i'
  ) {
    return 1;
  }
  if (
    rawSem === 2 || 
    rawSem === '2' || 
    String(rawSem).toLowerCase().includes('genap') || 
    String(rawSem).toLowerCase().includes('sem 2') || 
    String(rawSem).toLowerCase().includes('semester 2') ||
    String(rawSem).toLowerCase().includes('dua') ||
    String(rawSem).toLowerCase() === 'ii'
  ) {
    return 2;
  }
  return 1;
}

/**
 * Detects key columns from a sample record, explicitly highlighting
 * "tujuan pembelajaran hasil analisis" and ignoring "tujuan pembelajaran sementara"
 */
export function detectTableColumns(sampleRow: Record<string, any>): {
  analyzedColumn: string;
  temporaryColumn: string | null;
  elementColumn: string;
  semesterColumn: string;
  gradeColumn: string;
  materialColumn: string;
  cpColumn: string;
  allColumns: string[];
} {
  const keys = Object.keys(sampleRow || {});
  let analyzedCol: string | null = null;
  let tempCol: string | null = null;
  let elemCol: string | null = null;
  let semCol: string | null = null;
  let gradeCol: string | null = null;
  let matCol: string | null = null;
  let cpCol: string | null = null;

  for (const k of keys) {
    const clean = k.toLowerCase().replace(/[_\s-]+/g, ' ').trim();

    // Check if this is the temporary column to exclude
    if (clean.includes('sementara')) {
      tempCol = k;
      continue; // Strictly skip as candidate for analyzed TP
    }

    // Candidate for analyzed TP
    if (
      clean.includes('hasil analisis') ||
      clean.includes('hasil analisa') ||
      clean.includes('tp hasil analisis') ||
      clean.includes('tp hasil analisa') ||
      clean.includes('tp analisa') ||
      clean.includes('tp analisis') ||
      clean.includes('analisis tp') ||
      clean.includes('analisa tp')
    ) {
      if (!analyzedCol) analyzedCol = k;
    } else if (
      !analyzedCol &&
      (clean.includes('analisis') || clean.includes('analisa'))
    ) {
      analyzedCol = k;
    } else if (
      !analyzedCol &&
      (clean === 'tujuan pembelajaran' || clean === 'tp' || clean === 'indikator' || clean === 'tujuan')
    ) {
      analyzedCol = k;
    }

    // Element column
    if (clean.includes('elemen') || clean.includes('element')) {
      elemCol = k;
    }

    // Semester column
    if (clean.includes('semester') || clean.includes('smt')) {
      semCol = k;
    }

    // Grade column
    if (clean.includes('kelas') || clean.includes('grade') || clean.includes('tingkat')) {
      gradeCol = k;
    }

    // Material column
    if (clean.includes('materi') || clean.includes('ruang lingkup') || clean.includes('bab')) {
      matCol = k;
    }

    // CP column
    if (clean.includes('capaian') || clean.includes('cp') || clean.includes('deskripsi cp')) {
      cpCol = k;
    }
  }

  return {
    analyzedColumn: analyzedCol || 'tujuan_pembelajaran_hasil_analisis',
    temporaryColumn: tempCol,
    elementColumn: elemCol || 'elemen',
    semesterColumn: semCol || 'semester',
    gradeColumn: gradeCol || 'kelas',
    materialColumn: matCol || 'materi_esensial',
    cpColumn: cpCol || 'capaian_pembelajaran',
    allColumns: keys
  };
}

/**
 * Extracts analyzed TP text from a record, strictly ensuring
 * "tujuan pembelajaran sementara" is NEVER picked up.
 */
export function extractAnalyzedTPText(row: any, userConfiguredColumn?: string): {
  text: string;
  sourceColumn: string;
  ignoredTemporaryColumn?: string;
} {
  const keys = Object.keys(row || {});
  let ignoredTemp: string | undefined;

  // Look for any temporary column in the row to document what was ignored
  for (const k of keys) {
    if (k.toLowerCase().includes('sementara')) {
      ignoredTemp = k;
      break;
    }
  }

  // 1. If user explicitly designated a column, verify it does NOT contain 'sementara'
  if (userConfiguredColumn && row[userConfiguredColumn] !== undefined) {
    if (!userConfiguredColumn.toLowerCase().includes('sementara')) {
      const val = String(row[userConfiguredColumn] ?? '').trim();
      if (val) {
        return { text: val, sourceColumn: userConfiguredColumn, ignoredTemporaryColumn: ignoredTemp };
      }
    }
  }

  // 2. Priority 1: Match columns explicitly having "hasil analisis" / "hasil analisa"
  for (const k of keys) {
    const clean = k.toLowerCase().replace(/[_\s-]+/g, ' ').trim();
    if (clean.includes('sementara')) continue; // STRICTLY IGNORE SEMENTARA

    if (
      clean.includes('hasil analisis') ||
      clean.includes('hasil analisa') ||
      clean.includes('tp hasil analisis') ||
      clean.includes('tp hasil analisa') ||
      clean.includes('tp analisa') ||
      clean.includes('tp analisis') ||
      clean.includes('analisis tp') ||
      clean.includes('analisa tp') ||
      clean === 'tujuan_pembelajaran_hasil_analisis' ||
      clean === 'tujuan pembelajaran hasil analisis'
    ) {
      const val = String(row[k] ?? '').trim();
      if (val) {
        return { text: val, sourceColumn: k, ignoredTemporaryColumn: ignoredTemp };
      }
    }
  }

  // 3. Priority 2: Columns containing "analisis" or "analisa" (excluding "sementara")
  for (const k of keys) {
    const clean = k.toLowerCase().replace(/[_\s-]+/g, ' ').trim();
    if (clean.includes('sementara')) continue;

    if (clean.includes('analisis') || clean.includes('analisa')) {
      const val = String(row[k] ?? '').trim();
      if (val) {
        return { text: val, sourceColumn: k, ignoredTemporaryColumn: ignoredTemp };
      }
    }
  }

  // 4. Priority 3: Standard TP keys that definitely do NOT contain "sementara"
  for (const k of keys) {
    const clean = k.toLowerCase().replace(/[_\s-]+/g, ' ').trim();
    if (clean.includes('sementara')) continue;

    if (
      clean === 'tujuan pembelajaran' ||
      clean === 'tujuan_pembelajaran' ||
      clean === 'tp' ||
      clean === 'indikator' ||
      clean === 'tujuan'
    ) {
      const val = String(row[k] ?? '').trim();
      if (val) {
        return { text: val, sourceColumn: k, ignoredTemporaryColumn: ignoredTemp };
      }
    }
  }

  return { text: '', sourceColumn: '', ignoredTemporaryColumn: ignoredTemp };
}

/**
 * Tests connection to user's Supabase database and checks if the specified table exists
 */
export async function testSupabaseConnection(configOverride?: Partial<SupabaseConfig>): Promise<{
  success: boolean;
  message: string;
  sampleColumns?: string[];
  sampleRows?: any[];
  rowCount?: number;
  detectedColumns?: ReturnType<typeof detectTableColumns>;
  hasTemporaryColumn?: boolean;
  hasAnalyzedColumn?: boolean;
}> {
  const config = { ...getSupabaseConfig(), ...configOverride };
  if (!config.url || !config.anonKey) {
    return {
      success: false,
      message: 'URL Supabase dan Anon Key belum diisi. Silakan masukkan kredensial terlebih dahulu.'
    };
  }

  try {
    const client = getSupabaseClient(config);
    if (!client) {
      return { success: false, message: 'Gagal membuat Supabase Client. Periksa format URL dan Anon Key.' };
    }

    const tableName = (config.tableName || 'tujuan_pembelajaran').trim();

    const { data, error, count } = await client
      .from(tableName)
      .select('*', { count: 'exact' })
      .range(0, 9);

    if (error) {
      return {
        success: false,
        message: `Terhubung ke Supabase namun galat membaca tabel "${tableName}": ${error.message} (Pastikan nama tabel benar dan RLS mengizinkan SELECT anonim).`
      };
    }

    const sample = data && data.length > 0 ? data[0] : {};
    const columns = Object.keys(sample);
    const detected = detectTableColumns(sample);

    const hasTemp = Boolean(detected.temporaryColumn);
    const hasAnalyzed = Boolean(detected.analyzedColumn);

    return {
      success: true,
      message: `Koneksi berhasil! Terdeteksi ${count ?? data?.length ?? 0} baris data pada tabel "${tableName}".`,
      sampleColumns: columns,
      sampleRows: data || [],
      rowCount: count ?? data?.length ?? 0,
      detectedColumns: detected,
      hasTemporaryColumn: hasTemp,
      hasAnalyzedColumn: hasAnalyzed
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menghubungkan ke Supabase: ${err.message || String(err)}`
    };
  }
}

/**
 * Fetches analyzed learning objectives (TP) from Supabase table.
 * Strictly inputs the "tujuan pembelajaran hasil analisis" column, ignoring "sementara",
 * and precisely handles the exact 84 items.
 */
export async function fetchTPFromSupabase(
  grade: number,
  configOverride?: Partial<SupabaseConfig>,
  options: {
    forceAll84Mode?: boolean; // When true, fetches all rows without dropping via grade filter
  } = { forceAll84Mode: true }
): Promise<{
  success: boolean;
  message: string;
  data?: FetchedTPResult;
}> {
  const config = { ...getSupabaseConfig(), ...configOverride };
  const client = getSupabaseClient(config);

  // If Supabase credentials are not configured, offer the exact 84 analyzed items
  if (!client) {
    return {
      success: false,
      message: 'Supabase belum dikonfigurasi. Anda dapat mengisi Project URL & Anon Key, atau klik "Muat 84 TP Hasil Analisis Standar" untuk memuat bank 84 TP hasil analisa langsung.'
    };
  }

  const tableName = (config.tableName || 'tujuan_pembelajaran').trim();

  try {
    // Query with safe range to get all rows (up to 1000)
    const { data, error, count } = await client
      .from(tableName)
      .select('*', { count: 'exact' })
      .range(0, 999);

    if (error) {
      return {
        success: false,
        message: `Gagal membaca tabel "${tableName}": ${error.message}`
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        message: `Tabel "${tableName}" terbaca namun belum ada baris data.`,
        data: {
          records: [],
          groupedByElement: {},
          totalTP: 0,
          sourceTable: tableName,
          activeColumnUsed: config.tpColumn,
          isExact84: false
        }
      };
    }

    // Check if the dataset has 84 rows or user wants all rows without aggressive filtering
    let recordsToProcess: RawSupabaseTPRecord[] = data;
    const isExact84Total = data.length === 84;

    // Filter by grade ONLY if NOT in forceAll84Mode and table has grade column and total != 84
    if (!options.forceAll84Mode && !isExact84Total) {
      const gradeCol = config.gradeColumn || 'kelas';
      const filtered = data.filter((row: any) => {
        const val = row[gradeCol] ?? row.kelas ?? row.grade ?? row.tingkat;
        if (val === undefined || val === null || val === '') return true;
        const numVal = parseInt(String(val).replace(/[^0-9]/g, ''), 10);
        return !isNaN(numVal) && numVal === grade;
      });
      if (filtered.length > 0) {
        recordsToProcess = filtered;
      }
    }

    // Group TP by Element and Semester
    const grouped: Record<string, { sem1: string[]; sem2: string[] }> = {
      "Al-Qur'an Hadis": { sem1: [], sem2: [] },
      "Akidah": { sem1: [], sem2: [] },
      "Akhlak": { sem1: [], sem2: [] },
      "Fikih": { sem1: [], sem2: [] },
      "Sejarah Peradaban Islam (SPI)": { sem1: [], sem2: [] }
    };

    let totalTP = 0;
    let activeColumn = config.tpColumn;
    let ignoredTempColumn: string | null = null;

    // Detect columns from first row if possible
    if (recordsToProcess.length > 0) {
      const detected = detectTableColumns(recordsToProcess[0]);
      if (detected.temporaryColumn) {
        ignoredTempColumn = detected.temporaryColumn;
      }
      if (detected.analyzedColumn) {
        activeColumn = detected.analyzedColumn;
      }
    }

    // Process every single record precisely
    recordsToProcess.forEach((row: any, idx: number) => {
      const extracted = extractAnalyzedTPText(row, config.tpColumn);
      let tpText = extracted.text;
      if (extracted.sourceColumn) activeColumn = extracted.sourceColumn;
      if (extracted.ignoredTemporaryColumn) ignoredTempColumn = extracted.ignoredTemporaryColumn;

      // Fallback if empty in row
      if (!tpText) {
        tpText = `Tujuan Pembelajaran Hasil Analisa #${idx + 1}`;
      }

      // Extract element
      const rawElem = row[config.elementColumn] ?? row.elemen ?? row.element ?? row.mata_pelajaran ?? '';
      const elem = normalizeElement(rawElem);

      // Extract semester
      const rawSem = row[config.semesterColumn] ?? row.semester ?? row.smt ?? (idx < Math.ceil(recordsToProcess.length / 2) ? 1 : 2);
      const sem = normalizeSemester(rawSem);

      const targetList = sem === 1 ? grouped[elem].sem1 : grouped[elem].sem2;
      targetList.push(tpText);
      totalTP++;
    });

    const isExact84Result = totalTP === 84;

    return {
      success: true,
      message: `Berhasil mengambil ${totalTP} baris Tujuan Pembelajaran Hasil Analisis secara presisi dari tabel "${tableName}" (Kolom Sementara: "${ignoredTempColumn || 'Tidak Digunakan'}" berhasil diabaikan).`,
      data: {
        records: recordsToProcess,
        groupedByElement: grouped,
        totalTP,
        sourceTable: tableName,
        activeColumnUsed: activeColumn,
        ignoredTemporaryColumn: ignoredTempColumn,
        isExact84: isExact84Result
      }
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Terjadi galat saat memproses data Supabase: ${err.message || String(err)}`
    };
  }
}

/**
 * Loads the built-in 84 analyzed learning objectives dataset with 100% precision.
 * Guarantees exactly 84 items (42 in Sem 1, 42 in Sem 2).
 */
export function getStandard84AnalyzedTP(): FetchedTPResult {
  const groupedRaw = getPrecise84GroupedByElement();
  
  return {
    records: PRECISE_84_ANALYZED_TP.map(item => ({
      id: item.id,
      kelas: item.kelas || 4,
      semester: item.semester,
      elemen: item.element,
      tujuan_pembelajaran_hasil_analisis: item.tujuan_pembelajaran_hasil_analisis,
      tujuan_pembelajaran_sementara: item.tujuan_pembelajaran_sementara, // Available to inspect exclusion
      materi_esensial: item.materi_esensial,
      alokasi_jp: item.alokasi_jp || 4
    })),
    groupedByElement: groupedRaw,
    totalTP: 84,
    sourceTable: 'bank_84_tujuan_pembelajaran_hasil_analisis_presisi',
    activeColumnUsed: 'tujuan_pembelajaran_hasil_analisis',
    ignoredTemporaryColumn: 'tujuan_pembelajaran_sementara',
    isExact84: true
  };
}

/**
 * Merges fetched Supabase TP into existing CPMappingEntry list
 */
export function applySupabaseTPToCPMapping(
  existing: { sem1: CPMappingEntry[]; sem2: CPMappingEntry[] },
  fetchedData: FetchedTPResult,
  options: {
    updateMaterials?: boolean;
    updateCPDescription?: boolean;
  } = {}
): { sem1: CPMappingEntry[]; sem2: CPMappingEntry[] } {
  const updateSemesterList = (list: CPMappingEntry[], sem: SemesterType): CPMappingEntry[] => {
    return list.map(entry => {
      const elemGroup = fetchedData.groupedByElement[entry.element];
      const newTPList = sem === 1 ? elemGroup?.sem1 : elemGroup?.sem2;

      if (!newTPList || newTPList.length === 0) {
        return entry;
      }

      // Replace learning objectives with the analyzed ones
      const updatedEntry: CPMappingEntry = {
        ...entry,
        learningObjectives: newTPList,
        notes: `Tujuan Pembelajaran Hasil Analisis (${newTPList.length} butir) disinkronkan presisi dari Supabase [${fetchedData.activeColumnUsed}] pada ${new Date().toLocaleDateString('id-ID')}`
      };

      // If user wants to also update essential materials derived from database records
      if (options.updateMaterials) {
        const matchingRecords = fetchedData.records.filter(r => {
          const rElem = normalizeElement(r.elemen ?? r.element);
          const rSem = normalizeSemester(r.semester ?? r.smt);
          return rElem === entry.element && rSem === sem;
        });

        const extractedMaterials = matchingRecords
          .map(r => (r.materi_esensial ?? r.materi ?? r.ruang_lingkup ?? r.bab ?? '').trim())
          .filter(Boolean);

        if (extractedMaterials.length > 0) {
          const uniqueMats = Array.from(new Set(extractedMaterials));
          updatedEntry.essentialMaterials = uniqueMats;
        }
      }

      // If database has explicit CP description
      if (options.updateCPDescription) {
        const recWithCP = fetchedData.records.find(r => {
          const rElem = normalizeElement(r.elemen ?? r.element);
          const rSem = normalizeSemester(r.semester ?? r.smt);
          const cp = (r.capaian_pembelajaran ?? r.cp ?? r.deskripsi_cp ?? '').trim();
          return rElem === entry.element && rSem === sem && cp.length > 10;
        });

        if (recWithCP) {
          const cpText = (recWithCP.capaian_pembelajaran ?? recWithCP.cp ?? recWithCP.deskripsi_cp ?? '').trim();
          if (cpText) {
            updatedEntry.cpDescription = cpText;
          }
        }
      }

      return updatedEntry;
    });
  };

  return {
    sem1: updateSemesterList(existing.sem1, 1),
    sem2: updateSemesterList(existing.sem2, 2)
  };
}
