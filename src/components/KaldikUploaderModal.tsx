import React, { useState } from 'react';
import { KaldikEvent, AIAnalysisResult, SchoolProfile } from '../types';
import { KALDIK_PRESETS } from '../data/defaultKaldik';
import { analyzeKaldikWithAI } from '../services/geminiService';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CalendarCheck,
  Zap,
  Layers
} from 'lucide-react';

interface KaldikUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onApplyEvents: (events: KaldikEvent[], analysisResult?: AIAnalysisResult) => void;
}

export const KaldikUploaderModal: React.FC<KaldikUploaderModalProps> = ({
  isOpen,
  onClose,
  profile,
  onApplyEvents
}) => {
  const [activeMode, setActiveMode] = useState<'preset' | 'upload' | 'text'>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('kaldik_pasuruan_2026_2027');
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileMimeType, setFileMimeType] = useState<string>('');
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  
  // Text input state
  const [rawTextData, setRawTextData] = useState<string>('');

  // AI loading and result
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  if (!isOpen) return null;

  const compressImageIfNeeded = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve) => {
      // If PDF or text or non-image
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            base64: reader.result as string,
            mimeType: file.type || 'application/pdf'
          });
        };
        reader.onerror = () => {
          resolve({ base64: '', mimeType: file.type || 'application/pdf' });
        };
        reader.readAsDataURL(file);
        return;
      }

      // Optimize image via Canvas to avoid massive payloads
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          resolve({ base64: compressed, mimeType: 'image/jpeg' });
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve({ base64: reader.result as string, mimeType: file.type || 'image/jpeg' });
          reader.readAsDataURL(file);
        }
      };
      img.onerror = () => {
        const reader = new FileReader();
        reader.onload = () => resolve({ base64: reader.result as string, mimeType: file.type || 'image/jpeg' });
        reader.readAsDataURL(file);
      };
      img.src = url;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMessage('');
    setAnalysisResult(null);

    // If it's a text/csv file, also read text directly
    if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
      const textReader = new FileReader();
      textReader.onload = () => {
        const txt = textReader.result as string;
        if (txt) setRawTextData(txt);
      };
      textReader.readAsText(file);
    }

    try {
      const { base64, mimeType } = await compressImageIfNeeded(file);
      setFileBase64(base64);
      setFileMimeType(mimeType);

      if (file.type.startsWith('image/')) {
        setFilePreviewUrl(base64);
      } else {
        setFilePreviewUrl('');
      }
    } catch (err) {
      console.warn('Error reading file:', err);
    }
  };

  const handleProcessAI = async () => {
    setIsLoading(true);
    setLoadingStep('Membaca dan memproses dokumen kalender pendidikan...');
    setErrorMessage('');
    setAnalysisResult(null);

    try {
      let result: AIAnalysisResult;

      if (activeMode === 'upload' && fileBase64) {
        setLoadingStep('Menganalisis jadwal, hari libur nasional, dan agenda keagamaan...');
        result = await analyzeKaldikWithAI({
          imageBase64: fileBase64,
          mimeType: fileMimeType,
          textData: rawTextData || undefined,
          academicYear: profile.academicYear,
          schoolName: profile.schoolName
        });
      } else if (activeMode === 'text' && rawTextData.trim()) {
        setLoadingStep('Mengekstraksi agenda kalender dan menghitung pekan efektif...');
        result = await analyzeKaldikWithAI({
          textData: rawTextData,
          academicYear: profile.academicYear,
          schoolName: profile.schoolName
        });
      } else {
        throw new Error('Silakan pilih file gambar/dokumen kalender atau ketik teks agenda terlebih dahulu.');
      }

      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memproses kalender pendidikan dengan AI.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleApplyPreset = () => {
    const preset = KALDIK_PRESETS.find(p => p.id === selectedPresetId);
    if (preset) {
      onApplyEvents(preset.events);
      onClose();
    }
  };

  const handleApplyAIResult = () => {
    if (analysisResult && analysisResult.detectedEvents.length > 0) {
      onApplyEvents(analysisResult.detectedEvents, analysisResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-800 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Input & Analisis Kalender Pendidikan</h3>
              <p className="text-xs text-emerald-300">
                Pilih Kaldik Resmi Pasuruan atau Ekstraksi Otomatis dari Gambar/File dengan AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveMode('preset');
              setErrorMessage('');
            }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${
              activeMode === 'preset'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Preset Resmi Kota Pasuruan</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('upload');
              setErrorMessage('');
            }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${
              activeMode === 'upload'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Foto / Dokumen Kaldik (AI)</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('text');
              setErrorMessage('');
            }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${
              activeMode === 'text'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ketik / Tempel Teks Agenda</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Mode 1: Preset */}
          {activeMode === 'preset' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Pilih kalender pendidikan terstandarisasi untuk Dinas Pendidikan dan Kebudayaan Kota Pasuruan:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {KALDIK_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPresetId === preset.id
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{preset.name}</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {preset.academicYear}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{preset.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-medium">
                          <span>📍 {preset.city}, {preset.province}</span>
                          <span>🗓️ {preset.events.length} Agenda & Hari Libur</span>
                          <span className="text-emerald-700 font-semibold">✓ Siap Digunakan</span>
                        </div>
                      </div>
                      <div className="mt-1">
                        <input
                          type="radio"
                          name="presetChoice"
                          checked={selectedPresetId === preset.id}
                          onChange={() => setSelectedPresetId(preset.id)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode 2: Upload File / Photo */}
          {activeMode === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50 hover:bg-emerald-50/30 transition-all">
                <input
                  type="file"
                  id="kaldikFileInput"
                  accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="kaldikFileInput"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="p-3 bg-white rounded-full shadow-xs text-emerald-700">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Klik untuk memilih file foto kalender atau seret ke sini
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mendukung format gambar JPEG, PNG, WebP, dokumen PDF, scan foto Kaldik, atau file teks
                    </p>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      <FileText className="w-3.5 h-3.5 mr-1" />
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </label>
              </div>

              {filePreviewUrl && (
                <div className="mt-4 p-2 bg-slate-100 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-600 mb-1.5 px-1">Pratinjau Gambar:</p>
                  <img
                    src={filePreviewUrl}
                    alt="Pratinjau Kaldik"
                    className="max-h-48 rounded-lg mx-auto object-contain border border-slate-300"
                  />
                </div>
              )}

              {selectedFile && !analysisResult && (
                <div className="flex flex-col items-center justify-center pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleProcessAI}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{loadingStep || 'Menganalisis Kalender Pendidikan dengan AI...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Analisis Otomatis Dokumen Kaldik (AI)</span>
                      </>
                    )}
                  </button>
                  {isLoading && (
                    <p className="text-[11px] text-slate-500 animate-pulse">
                      Sedang memproses dokumen dan mengekstrak tanggal-tanggal efektif...
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Text Agenda */}
          {activeMode === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempelkan Teks Kalender / Daftar Hari Libur & Kegiatan Sekolah:
                </label>
                <textarea
                  rows={8}
                  value={rawTextData}
                  onChange={(e) => setRawTextData(e.target.value)}
                  placeholder={`Contoh data kalender:
15-19 Juli 2026: MPLS dan Hari Pertama Sekolah
17 Agustus 2026: HUT RI Ke-81
25 Agustus 2026: Maulid Nabi Muhammad SAW
21-26 September 2026: STS 1
26 Okt - 5 Nov 2026: ANBK SD
30 Nov - 12 Des 2026: SAS 1
18 Desember 2026: Pembagian Rapor
21 Des 2026 - 2 Jan 2027: Libur Semester 1
4 Januari 2027: Awal Semester 2
8-13 Maret 2027: Pondok Ramadhan PAI
18-31 Maret 2027: Libur Hari Raya Idul Fitri 1448 H
7-17 Juni 2027: SAS 2 (Kenaikan Kelas)
18 Juni 2027: Pembagian Rapor Semester 2`}
                  className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
                />
              </div>

              {!analysisResult && (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <button
                    type="button"
                    onClick={handleProcessAI}
                    disabled={isLoading || !rawTextData.trim()}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{loadingStep || 'Menganalisis Teks Kaldik...'}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Ekstraksi Agenda & Hitung Pekan Efektif (AI)</span>
                      </>
                    )}
                  </button>
                  {isLoading && (
                    <p className="text-[11px] text-slate-500 animate-pulse">
                      Sedang menghitung alokasi pekan efektif Semester 1 & 2...
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex flex-col gap-2.5">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-semibold text-rose-800">Catatan Pemrosesan:</p>
                  <p className="text-rose-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-rose-200/60">
                <button
                  type="button"
                  onClick={handleProcessAI}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Coba Analisis Ulang
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('preset');
                    setErrorMessage('');
                  }}
                  className="px-3 py-1.5 bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 font-semibold rounded-lg text-xs transition-colors"
                >
                  Gunakan Preset Resmi Kota Pasuruan
                </button>
              </div>
            </div>
          )}

          {/* AI Analysis Preview Result */}
          {analysisResult && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Hasil Analisis AI Berhasil Ditemukan!</span>
                </div>
                <span className="text-xs bg-emerald-200/80 text-emerald-900 font-semibold px-2.5 py-0.5 rounded-full">
                  {analysisResult.detectedEvents.length} Agenda Terdeteksi
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-emerald-100">
                {analysisResult.summary}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <p className="text-slate-500 font-medium">Estimasi Pekan Efektif Sem 1</p>
                  <p className="text-lg font-bold text-emerald-800">{analysisResult.effectiveWeeksSem1 || 18} Pekan</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <p className="text-slate-500 font-medium">Estimasi Pekan Efektif Sem 2</p>
                  <p className="text-lg font-bold text-emerald-800">{analysisResult.effectiveWeeksSem2 || 17} Pekan</p>
                </div>
              </div>

              {analysisResult.curriculumRecommendations && (
                <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs space-y-2">
                  <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Rekomendasi Khusus PAI SD:
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Strategi Ramadhan:</strong>{' '}
                    {analysisResult.curriculumRecommendations.ramadhanStrategy}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Saran Asesmen:</strong>{' '}
                    {analysisResult.curriculumRecommendations.assessmentScheduleAdvice}
                  </p>
                </div>
              )}

              {/* Event Sample Badges */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Daftar Agenda yang Diintegrasikan:</p>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {analysisResult.detectedEvents.map((ev, i) => (
                    <div
                      key={ev.id || i}
                      className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: ev.color || '#10b981' }}
                        />
                        <span className="font-semibold text-slate-800">{ev.title}</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-slate-500 font-mono text-[11px]">
                          {ev.startDate} {ev.endDate && ev.endDate !== ev.startDate ? `s.d ${ev.endDate}` : ''}
                        </span>
                        {ev.affectsKBM && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            Blokir KBM
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Batal
          </button>

          {activeMode === 'preset' ? (
            <button
              type="button"
              onClick={handleApplyPreset}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Gunakan Preset Resmi Ini</span>
            </button>
          ) : (
            analysisResult && (
              <button
                type="button"
                onClick={handleApplyAIResult}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Terapkan Hasil Analisis ke RPE & Promes</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
