import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Settings, 
  Sliders, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Award, 
  Layers, 
  ArrowRight, 
  HelpCircle,
  Table,
  Check,
  ShieldCheck,
  Ban,
  ListOrdered,
  Sparkles
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  testSupabaseConnection, 
  fetchTPFromSupabase, 
  getStandard84AnalyzedTP,
  applySupabaseTPToCPMapping,
  detectTableColumns,
  SupabaseConfig,
  FetchedTPResult
} from '../services/supabaseService';
import type { CPMappingEntry, PAIElement } from '../types/index.ts';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: number;
  currentCPData: { sem1: CPMappingEntry[]; sem2: CPMappingEntry[] };
  onApplyData: (updated: { sem1: CPMappingEntry[]; sem2: CPMappingEntry[] }) => void;
}

const PRESET_TABLES = [
  'tujuan_pembelajaran',
  'tp_hasil_analisis',
  'tujuan_pembelajaran_hasil_analisis',
  'pemetaan_cp',
  'hasil_analisis_tp',
  'cp_tp'
];

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  grade,
  currentCPData,
  onApplyData
}) => {
  const [activeTab, setActiveTab] = useState<'fetch' | 'config' | 'table84'>('fetch');
  
  // Configuration state
  const [config, setConfig] = useState<SupabaseConfig>(getSupabaseConfig);
  const [showKey, setShowKey] = useState(false);
  const [showAdvancedMapping, setShowAdvancedMapping] = useState(true);

  // Connection testing state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    sampleColumns?: string[];
    sampleRows?: any[];
    rowCount?: number;
    detectedColumns?: ReturnType<typeof detectTableColumns>;
    hasTemporaryColumn?: boolean;
    hasAnalyzedColumn?: boolean;
  } | null>(null);

  // Fetching state
  const [isFetching, setIsFetching] = useState(false);
  const [forceAll84Mode, setForceAll84Mode] = useState(true); // Default to preserving all 84 items
  const [fetchResult, setFetchResult] = useState<{
    success: boolean;
    message: string;
    data?: FetchedTPResult;
  } | null>(null);

  // Application options
  const [updateMaterials, setUpdateMaterials] = useState(true);
  const [updateCPDescription, setUpdateCPDescription] = useState(false);
  const [selectedPreviewSem, setSelectedPreviewSem] = useState<1 | 2>(1);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setConfig(cfg);
      setTestResult(null);
      setAppliedSuccess(false);

      if (cfg.url && cfg.anonKey) {
        handleFetchData(cfg);
      } else {
        // Load the standard 84 items ready for preview
        const std = getStandard84AnalyzedTP();
        setFetchResult({
          success: true,
          message: 'Bank Data 84 Butir Tujuan Pembelajaran Hasil Analisis Presisi siap disinkronkan.',
          data: std
        });
      }
    }
  }, [isOpen, grade]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection(config);
      setTestResult(result);
      if (result.success && result.detectedColumns) {
        // Auto-adopt detected analyzed column and save
        const updatedConfig = {
          ...config,
          tpColumn: result.detectedColumns.analyzedColumn || config.tpColumn,
          elementColumn: result.detectedColumns.elementColumn || config.elementColumn,
          semesterColumn: result.detectedColumns.semesterColumn || config.semesterColumn,
          materialColumn: result.detectedColumns.materialColumn || config.materialColumn,
          cpColumn: result.detectedColumns.cpColumn || config.cpColumn
        };
        setConfig(updatedConfig);
        saveSupabaseConfig(updatedConfig);
      } else if (result.success) {
        saveSupabaseConfig(config);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Gagal menguji koneksi'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = () => {
    saveSupabaseConfig(config);
    handleTestConnection();
  };

  const handleFetchData = async (cfgToUse = config) => {
    setIsFetching(true);
    setFetchResult(null);
    setAppliedSuccess(false);
    try {
      const result = await fetchTPFromSupabase(grade, cfgToUse, { forceAll84Mode });
      if (result.success && result.data) {
        setFetchResult(result);
      } else {
        // Fallback to standard 84 items with explanation
        const std = getStandard84AnalyzedTP();
        setFetchResult({
          success: false,
          message: `${result.message}. Menampilkan 84 Butir Tujuan Pembelajaran Hasil Analisis standar kurikulum sebagai alternatif.`,
          data: std
        });
      }
    } catch (err: any) {
      const std = getStandard84AnalyzedTP();
      setFetchResult({
        success: false,
        message: `Koneksi Supabase belum tersambung: ${err.message || String(err)}. Memuat 84 TP Hasil Analisis Presisi Standar.`,
        data: std
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleLoadStandard84 = () => {
    const std = getStandard84AnalyzedTP();
    setFetchResult({
      success: true,
      message: 'Berhasil memuat 84 Butir Tujuan Pembelajaran Hasil Analisis Standar BSKAP 032/2024 (Presisi 84/84).',
      data: std
    });
  };

  const handleApplyToCP = () => {
    if (!fetchResult?.data) return;

    const updated = applySupabaseTPToCPMapping(currentCPData, fetchResult.data, {
      updateMaterials,
      updateCPDescription
    });

    onApplyData(updated);
    setAppliedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const isConnected = Boolean(config.url && config.anonKey);
  const totalCount = fetchResult?.data?.totalTP || 0;
  const isExact84 = totalCount === 84;

  const currentRecords = fetchResult?.data?.records || [];
  const filteredRecords = searchFilter 
    ? currentRecords.filter(r => {
        const text = (r.tujuan_pembelajaran_hasil_analisis ?? r.tp_hasil_analisis ?? r.tujuan_pembelajaran ?? '').toLowerCase();
        const elem = String(r.elemen ?? r.element ?? '').toLowerCase();
        const mat = String(r.materi_esensial ?? r.materi ?? '').toLowerCase();
        const q = searchFilter.toLowerCase();
        return text.includes(q) || elem.includes(q) || mat.includes(q);
      })
    : currentRecords;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800/80 rounded-xl border border-emerald-700/60 flex items-center justify-center shadow-inner">
              <Database className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-white">
                  Integrasi Database Supabase — Pemetaan CP & TP
                </h3>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 tracking-wider">
                  TARGET: 84 BUTIR PRESISI
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isConnected ? 'Supabase Terhubung' : 'Mode Offline / Kredensial Kosong'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>Menginput kolom: <strong>tujuan pembelajaran hasil analisis</strong></span>
                <span className="text-emerald-400">•</span>
                <span className="text-rose-200 font-semibold bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-800/50">
                  Kolom Sementara: Diabaikan
                </span>
                <span className="text-emerald-400">•</span>
                <span>Kelas: <strong>{grade} SD</strong></span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1.5 rounded-xl hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fetch')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'fetch'
                  ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sinkronisasi TP Elemen</span>
              {fetchResult?.data && (
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                  isExact84 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {totalCount} TP {isExact84 ? '✓ Presisi' : ''}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('table84')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'table84'
                  ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Daftar Rinci 84 TP Hasil Analisis</span>
              <span className="bg-emerald-700 text-white px-2 py-0.2 rounded-full text-[10px] font-black">
                84 Baris
              </span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'config'
                  ? 'border-emerald-700 text-emerald-800 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Pengaturan Koneksi & Kolom Supabase</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleLoadStandard84}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Muat Bank 84 TP Hasil Analisis Presisi BSKAP 032/2024"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Muat 84 TP Hasil Analisis</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">

          {/* TAB 1: FETCH / SINKRONISASI ELEMEN */}
          {activeTab === 'fetch' && (
            <div className="space-y-6">
              {/* Precision Status Banner */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="p-1.5 bg-emerald-700 text-white rounded-lg shadow-2xs">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <span className="font-extrabold text-sm text-emerald-950">
                      Status Kolom & Jumlah Presisi:
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                      {isExact84 ? '84/84 Presisi 100%' : `${totalCount} Butir TP`}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-2 flex-wrap">
                      <span className="text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Kolom Digunakan:
                      </span>
                      <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono text-emerald-900 font-bold">
                        {fetchResult?.data?.activeColumnUsed || config.tpColumn || 'tujuan_pembelajaran_hasil_analisis'}
                      </code>
                      <span className="text-slate-400">|</span>
                      <span className="text-rose-700 font-bold flex items-center gap-1">
                        <Ban className="w-3.5 h-3.5 text-rose-600" />
                        Kolom Diabaikan:
                      </span>
                      <code className="bg-white px-2 py-0.5 rounded border border-rose-300 font-mono text-rose-800 line-through">
                        {fetchResult?.data?.ignoredTemporaryColumn || 'tujuan_pembelajaran_sementara'}
                      </code>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Tepat <strong>84 butir</strong> tujuan pembelajaran hasil analisis didistribusikan ke 5 elemen PAI (42 butir Semester 1, 42 butir Semester 2).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => handleFetchData()}
                    disabled={isFetching || !isConnected}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                    <span>{isFetching ? 'Mengambil Data...' : 'Tarik dari Supabase'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('table84')}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span>Lihat 84 Baris</span>
                  </button>
                </div>
              </div>

              {/* Mode Selection Options */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={forceAll84Mode}
                    onChange={(e) => setForceAll84Mode(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>
                    Pastikan seluruh <strong>84 Baris</strong> TP Hasil Analisis terambil (Mode Presisi Penuh tanpa terpotong filter kelas)
                  </span>
                </label>
                <span className="text-[11px] text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                  Tabel Sumber: <strong className="font-mono text-emerald-900">{config.tableName}</strong>
                </span>
              </div>

              {/* Fetch Result Message */}
              {fetchResult && (
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  fetchResult.success 
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' 
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}>
                  {fetchResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs space-y-1 flex-1">
                    <p className="font-bold">
                      {fetchResult.success ? 'Data Tujuan Pembelajaran Hasil Analisis Berhasil Diambil' : 'Pemberitahuan Sinkronisasi'}
                    </p>
                    <p className="leading-relaxed">{fetchResult.message}</p>
                  </div>
                </div>
              )}

              {/* Preview of Fetched TP grouped by element */}
              {fetchResult?.data && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-700" />
                        <span>Pratinjau Butir TP Hasil Analisis per Elemen PAI</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Total {fetchResult.data.totalTP} butir TP (Semester 1: 42 butir, Semester 2: 42 butir)
                      </p>
                    </div>

                    {/* Semester Preview Switcher */}
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                      <button
                        onClick={() => setSelectedPreviewSem(1)}
                        className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                          selectedPreviewSem === 1 ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Semester 1 (42 TP)
                      </button>
                      <button
                        onClick={() => setSelectedPreviewSem(2)}
                        className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                          selectedPreviewSem === 2 ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Semester 2 (42 TP)
                      </button>
                    </div>
                  </div>

                  {/* Elements List */}
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(fetchResult.data.groupedByElement).map(([elementName, semDataRaw]) => {
                      const semData = semDataRaw as { sem1: string[]; sem2: string[] };
                      const tpList = (selectedPreviewSem === 1 ? semData.sem1 : semData.sem2) || [];
                      return (
                        <div key={elementName} className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                              Elemen: {elementName}
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {tpList.length} Butir TP Hasil Analisis
                            </span>
                          </div>

                          {tpList.length === 0 ? (
                            <p className="text-[11px] text-slate-400 italic">
                              Tidak ada butir TP untuk semester {selectedPreviewSem} pada elemen ini.
                            </p>
                          ) : (
                            <ul className="space-y-1.5 pl-4 list-decimal text-xs text-slate-700 max-h-48 overflow-y-auto pr-2">
                              {tpList.map((tp, idx) => (
                                <li key={idx} className="leading-relaxed hover:text-emerald-900">
                                  {tp}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Synchronization Options */}
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3">
                    <span className="block text-xs font-bold text-emerald-950">
                      Opsi Penerapan ke Tabel Pemetaan CP:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={updateMaterials}
                          onChange={(e) => setUpdateMaterials(e.target.checked)}
                          className="rounded text-emerald-700 focus:ring-emerald-500"
                        />
                        <span>Perbarui Materi Esensial dari data record</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={updateCPDescription}
                          onChange={(e) => setUpdateCPDescription(e.target.checked)}
                          className="rounded text-emerald-700 focus:ring-emerald-500"
                        />
                        <span>Perbarui Narasi CP Elemen jika ada di database</span>
                      </label>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-xs text-slate-500">
                      Target: <strong>84 Butir TP Hasil Analisis</strong> akan langsung dimasukkan ke pemetaan CP.
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleApplyToCP}
                        disabled={appliedSuccess}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                          appliedSuccess
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {appliedSuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>84 TP Berhasil Diterapkan ke Pemetaan CP!</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Terapkan 84 TP Hasil Analisis ke Pemetaan CP</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DAFTAR RINCI 84 BARIS PRESISI */}
          {activeTab === 'table84' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-emerald-700" />
                    <span>Tabel Verifikasi 84 Butir Tujuan Pembelajaran Hasil Analisis</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Memastikan kolom <strong>tujuan pembelajaran hasil analisis</strong> yang masuk, dan kolom sementara diabaikan secara presisi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Cari butir TP, elemen, atau materi..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none w-64"
                  />
                  <span className="bg-emerald-800 text-white px-2.5 py-1 rounded-lg text-xs font-black shrink-0">
                    {filteredRecords.length} / 84
                  </span>
                </div>
              </div>

              {/* 84 Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden max-h-[55vh] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-emerald-900 text-white z-10 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center border-r border-emerald-800">No</th>
                      <th className="py-2.5 px-3 w-16 text-center border-r border-emerald-800">Smt</th>
                      <th className="py-2.5 px-3 w-36 border-r border-emerald-800">Elemen</th>
                      <th className="py-2.5 px-4 border-r border-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Tujuan Pembelajaran Hasil Analisis (DIGUNAKAN)</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-4 w-56 border-r border-emerald-800 bg-rose-950/70">
                        <div className="flex items-center gap-1.5 text-rose-300">
                          <Ban className="w-3.5 h-3.5" />
                          <span>TP Sementara (DIABAIKAN)</span>
                        </div>
                      </th>
                      <th className="py-2.5 px-3 w-40">Materi Esensial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {filteredRecords.map((r, idx) => {
                      const sem = r.semester ?? (idx < 42 ? 1 : 2);
                      const elem = r.elemen ?? r.element ?? 'Al-Qur\'an Hadis';
                      const tpAnalisis = r.tujuan_pembelajaran_hasil_analisis ?? r.tp_hasil_analisis ?? r.tujuan_pembelajaran ?? '';
                      const tpSementara = r.tujuan_pembelajaran_sementara ?? r.tp_sementara ?? '(kolom sementara diabaikan)';
                      const materi = r.materi_esensial ?? r.materi ?? '-';

                      return (
                        <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200 bg-slate-50/50">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 text-center border-r border-slate-200">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              sem === 1 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              Sem {sem}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold border-r border-slate-200">
                            {elem}
                          </td>
                          <td className="py-2.5 px-4 border-r border-slate-200 leading-relaxed font-medium text-slate-900 bg-emerald-50/20">
                            {tpAnalisis}
                          </td>
                          <td className="py-2.5 px-4 border-r border-slate-200 leading-relaxed text-slate-400 line-through italic bg-rose-50/20">
                            {tpSementara}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {materi}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Total <strong>84 baris presisi</strong> siap dimasukkan ke pemetaan CP.
                </span>
                <button
                  onClick={handleApplyToCP}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Terapkan 84 TP Hasil Analisis ke Pemetaan CP</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIGURATION / SETTINGS */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 text-slate-600">
                  <p className="font-bold text-slate-900">Petunjuk Menghubungkan Supabase untuk Pemetaan CP</p>
                  <p>
                    Data kredensial tersimpan secara aman di peramban (browser) Anda. Dapatkan <strong>Project URL</strong> dan <strong>Anon Public Key</strong> dari Dashboard Supabase Anda di menu <em>Settings &gt; API</em>.
                  </p>
                  <p className="text-emerald-800 font-semibold mt-1">
                    Pastikan tabel Anda memuat <strong>84 baris</strong> Tujuan Pembelajaran Hasil Analisis agar presisi dengan alur kurikulum.
                  </p>
                </div>
              </div>

              {/* Form Config */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Supabase Project URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://xxxxxxxxxxxxxxxxxxxx.supabase.co"
                    value={config.url}
                    onChange={(e) => setConfig({ ...config, url: e.target.value.trim() })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Supabase Anon / Public Key <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={config.anonKey}
                      onChange={(e) => setConfig({ ...config, anonKey: e.target.value.trim() })}
                      className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">
                      Nama Tabel Supabase <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500">Pilih cepat tabel umum:</span>
                  </div>
                  <input
                    type="text"
                    placeholder="tp_hasil_analisis"
                    value={config.tableName}
                    onChange={(e) => setConfig({ ...config, tableName: e.target.value.trim() })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-2"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_TABLES.map(table => (
                      <button
                        key={table}
                        type="button"
                        onClick={() => setConfig({ ...config, tableName: table })}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors ${
                          config.tableName === table
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {table}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explicit Column Configuration to ensure "Hasil Analisis" is selected and "Sementara" is ignored */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Pemetaan Nama Kolom Tabel (PENTING: Pilih Kolom Hasil Analisis)</span>
                    </span>
                  </div>

                  <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-emerald-950">
                          Kolom TP Hasil Analisis <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-bold">
                          DIGUNAKAN
                        </span>
                      </div>
                      <input
                        type="text"
                        value={config.tpColumn}
                        onChange={(e) => setConfig({ ...config, tpColumn: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-lg font-mono text-xs font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        placeholder="tujuan_pembelajaran_hasil_analisis"
                      />
                      <p className="text-[10px] text-emerald-800 mt-1">
                        Contoh: <code>tujuan_pembelajaran_hasil_analisis</code> atau <code>tp_hasil_analisis</code>
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-rose-900">
                          Kolom TP Sementara
                        </label>
                        <span className="text-[10px] bg-rose-700 text-white px-1.5 py-0.2 rounded font-bold">
                          DIABAIKAN
                        </span>
                      </div>
                      <input
                        type="text"
                        disabled
                        value="tujuan_pembelajaran_sementara (Otomatis Ditolak/Diabaikan)"
                        className="w-full px-3 py-2 bg-rose-50/70 border border-rose-200 rounded-lg font-mono text-xs text-rose-700 cursor-not-allowed line-through"
                      />
                      <p className="text-[10px] text-rose-700 mt-1">
                        Sistem memastikan kolom sementara tidak akan pernah masuk ke pemetaan CP.
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kolom Elemen PAI</label>
                      <input
                        type="text"
                        value={config.elementColumn}
                        onChange={(e) => setConfig({ ...config, elementColumn: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                        placeholder="elemen"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kolom Semester</label>
                      <input
                        type="text"
                        value={config.semesterColumn}
                        onChange={(e) => setConfig({ ...config, semesterColumn: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                        placeholder="semester"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kolom Kelas</label>
                      <input
                        type="text"
                        value={config.gradeColumn}
                        onChange={(e) => setConfig({ ...config, gradeColumn: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                        placeholder="kelas"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kolom Materi Esensial</label>
                      <input
                        type="text"
                        value={config.materialColumn}
                        onChange={(e) => setConfig({ ...config, materialColumn: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                        placeholder="materi_esensial"
                      />
                    </div>
                  </div>
                </div>

                {/* Test Result Message */}
                {testResult && (
                  <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
                    testResult.success 
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      {testResult.success ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold">{testResult.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}</p>
                        <p className="mt-0.5 leading-relaxed">{testResult.message}</p>
                      </div>
                    </div>

                    {testResult.sampleColumns && testResult.sampleColumns.length > 0 && (
                      <div className="mt-1 pt-2 border-t border-emerald-200/60 text-[11px] space-y-1">
                        <div>
                          <span className="font-bold">Kolom yang terdeteksi di tabel: </span>
                          <span className="font-mono bg-white/70 px-2 py-0.5 rounded border border-emerald-200">
                            {testResult.sampleColumns.join(', ')}
                          </span>
                        </div>
                        {testResult.detectedColumns?.temporaryColumn && (
                          <div className="text-rose-700 font-semibold flex items-center gap-1">
                            <Ban className="w-3.5 h-3.5" />
                            <span>Terdeteksi kolom sementara: "{testResult.detectedColumns.temporaryColumn}" — telah otomatis diabaikan.</span>
                          </div>
                        )}
                        {testResult.detectedColumns?.analyzedColumn && (
                          <div className="text-emerald-800 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Terdeteksi kolom hasil analisis: "{testResult.detectedColumns.analyzedColumn}" — otomatis disetel sebagai input utama.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-200 flex-wrap">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting || !config.url || !config.anonKey}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Menguji...' : 'Uji Koneksi Tabel'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveConfig();
                        setActiveTab('fetch');
                        handleFetchData();
                      }}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Simpan & Tarik 84 Data</span>
                    </button>
                  </div>
                </div>

                {/* Example Schema */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-4 text-[11px] text-slate-600">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Format Skema Tabel Supabase yang Mendukung Kolom Hasil Analisis:</span>
                  </div>
                  <pre className="p-2.5 bg-slate-900 text-emerald-300 rounded-lg overflow-x-auto font-mono text-[10px]">
{`-- Skema tabel Supabase yang tepat:
CREATE TABLE IF NOT EXISTS tujuan_pembelajaran (
  id BIGSERIAL PRIMARY KEY,
  kelas INT DEFAULT 4,
  semester INT DEFAULT 1,
  elemen TEXT NOT NULL,                          -- 'Al-Qur\\'an Hadis', 'Akidah', dll.
  tujuan_pembelajaran_sementara TEXT,           -- (Akan diabaikan oleh sistem)
  tujuan_pembelajaran_hasil_analisis TEXT NOT NULL, -- (KOLOM UTAMA YANG DIINPUT, 84 BARIS)
  materi_esensial TEXT
);`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
