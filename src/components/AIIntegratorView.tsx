import React, { useState } from 'react';
import { SchoolProfile, RPEData, ProtaItem, AIAnalysisResult } from '../types';
import { requestCurriculumAssistant } from '../services/geminiService';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Loader2, 
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface AIIntegratorViewProps {
  profile: SchoolProfile;
  rpeData: RPEData;
  protaItems: ProtaItem[];
  analysisResult: AIAnalysisResult | null;
}

const QUICK_PROMPTS = [
  {
    title: 'Strategi Ramadhan & Pondok Ramadhan',
    query: 'Bagaimana strategi pengorganisasian materi PAI SD saat bulan puasa dan kegiatan Pondok Ramadhan agar target kurikulum tetap tercapai?'
  },
  {
    title: 'Format Modul Ajar PAI Singkat',
    query: 'Buatkan contoh modul ajar PAI Kurikulum Merdeka 1 pertemuan (3 JP) lengkap dengan tujuan, langkah pembelajaran berdiferensiasi, dan asesmen.'
  },
  {
    title: 'Rubrik Asesmen Praktik Ibadah',
    query: 'Buatkan instrumen dan rubrik penilaian asesmen unjuk kerja/praktik ibadah (shalat/wudhu/tahfidz surah pendek) untuk kelas ini.'
  },
  {
    title: 'Program Remedial & Pengayaan PAI',
    query: 'Rekomendasikan rencana program remedial dan pengayaan PAI berbasis jam cadangan yang tersedia pada RPE.'
  }
];

export const AIIntegratorView: React.FC<AIIntegratorViewProps> = ({
  profile,
  rpeData,
  protaItems,
  analysisResult
}) => {
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMarkdown, setResponseMarkdown] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleSendQuery = async (queryText: string, promptType: string = 'KONSULTASI') => {
    setIsLoading(true);
    setResponseMarkdown('');
    try {
      const resultText = await requestCurriculumAssistant({
        profile,
        rpeData,
        protaItems,
        promptType,
        customQuery: queryText
      });
      setResponseMarkdown(resultText);
    } catch (err: any) {
      console.error(err);
      setResponseMarkdown(`Maaf, terjadi kendala teknis: ${err.message || 'Gagal memproses rekomendasi kurikulum.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2 text-amber-300 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Ahli Kurikulum Profesional AI</span>
        </div>
        <h2 className="text-xl font-bold">
          Integrasi Kurikulum & Rekomendasi Pedagogis PAI
        </h2>
        <p className="text-xs text-emerald-200 mt-1 max-w-3xl leading-relaxed">
          Membimbing Guru PAI SDN Pohjentrek II Kota Pasuruan dalam menyelaraskan kalender akademik, beban belajar ({rpeData.totalEffectiveHours} JP), dan perencanaan pembelajaran Kurikulum Merdeka.
        </p>
      </div>

      {/* Auto Audit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Kapasitas Pekan Efektif</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Semester {rpeData.semester} memiliki <strong>{rpeData.totalEffectiveWeeks} Pekan Efektif</strong> ({rpeData.totalEffectiveHours} JP). Alokasi cukup untuk menuntaskan {protaItems.filter(i => i.semester === rpeData.semester).length} materi pokok.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Jam Cadangan & Evaluasi</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tersedia <strong>{rpeData.allocatedHours.reserveHours} JP Jam Cadangan</strong> dan <strong>{rpeData.allocatedHours.assessmentHours} JP Asesmen</strong> untuk penguatan karakter religius dan remedial.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Konteks SDN Pohjentrek II</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Terintegrasi dengan agenda keagamaan lokal Kota Pasuruan (Pondok Ramadhan, PHBI Maulid/Isra Miraj, dan Halal Bihalal).
          </p>
        </div>
      </div>

      {/* Quick Recommendation Chips */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Topik Konsultasi Cepat (Pilih Rekomendasi):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCustomQuery(qp.query);
                handleSendQuery(qp.query, qp.title);
              }}
              disabled={isLoading}
              className="p-3 text-left rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-xs group"
            >
              <p className="font-bold text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
                <span>{qp.title}</span>
                <Sparkles className="w-3 h-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
              <p className="text-slate-500 mt-1 line-clamp-2">{qp.query}</p>
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Ajukan Pertanyaan / Minta Format Dokumen Khusus ke Ahli Kurikulum AI:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customQuery.trim() && !isLoading) {
                  handleSendQuery(customQuery.trim(), 'PERTANYAAN_KUSTOM');
                }
              }}
              placeholder="Contoh: Bagaimana cara membagi JP untuk materi Fikih Shalat Jenazah di kelas 6 jika terpotong libur?"
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              onClick={() => handleSendQuery(customQuery.trim(), 'PERTANYAAN_KUSTOM')}
              disabled={isLoading || !customQuery.trim()}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Pertanyaan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Output Card */}
      {(isLoading || responseMarkdown) && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Rekomendasi Ahli Kurikulum:</span>
            </div>
            {responseMarkdown && (
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-xs font-medium">Sedang menyusun analisis pedagogis dan modul PAI...</p>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {responseMarkdown}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
