import React, { useState } from 'react';
import type { CPMappingEntry, SchoolProfile, SemesterType, PAIElement, ProtaItem } from '../types/index.ts';
import { generateStandardCPMapping } from '../data/cpTpTemplates';
import { getSupabaseConfig, getStandard84AnalyzedTP, applySupabaseTPToCPMapping, fetchTPFromSupabase } from '../services/supabaseService';
import { SupabaseSyncModal } from './SupabaseSyncModal';
import { 
  BookOpen, 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  RotateCcw, 
  Download, 
  FileText, 
  Printer, 
  Sparkles, 
  Layers, 
  Award,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Database,
  ExternalLink,
  RefreshCw,
  X,
  ShieldCheck,
  ListOrdered,
  Lock
} from 'lucide-react';

interface CPMappingViewProps {
  grade: number;
  profile: SchoolProfile;
  cpData: { sem1: CPMappingEntry[]; sem2: CPMappingEntry[] };
  onUpdateCPData: (data: { sem1: CPMappingEntry[]; sem2: CPMappingEntry[] }) => void;
  onSyncToProta?: (protaItems: ProtaItem[]) => void;
  onOpenPrint?: () => void;
  currentSemester?: SemesterType;
}

const ELEMENT_STYLES: Record<PAIElement, { bg: string; text: string; border: string; accent: string }> = {
  "Al-Qur'an Hadis": { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', accent: 'bg-emerald-700' },
  "Akidah": { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', accent: 'bg-blue-700' },
  "Akhlak": { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', accent: 'bg-purple-700' },
  "Fikih": { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', accent: 'bg-teal-700' },
  "Sejarah Peradaban Islam (SPI)": { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', accent: 'bg-amber-700' }
};

export const CPMappingView: React.FC<CPMappingViewProps> = ({
  grade,
  profile,
  cpData,
  onUpdateCPData,
  onSyncToProta,
  onOpenPrint,
  currentSemester = 1
}) => {
  const [activeSemester, setActiveSemester] = useState<SemesterType | 'all'>(currentSemester);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [newMaterialInputs, setNewMaterialInputs] = useState<Record<string, string>>({});
  const [newTPInputs, setNewTPInputs] = useState<Record<string, string>>({});
  const [editingTP, setEditingTP] = useState<{ id: string; index: number } | null>(null);
  const [showAddElementModal, setShowAddElementModal] = useState<boolean>(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [supabaseNotification, setSupabaseNotification] = useState<string | null>(null);
  const [isDirectSyncing, setIsDirectSyncing] = useState<boolean>(false);
  const [newElementSemester, setNewElementSemester] = useState<SemesterType>(1);
  const [newElementName, setNewElementName] = useState<PAIElement>("Al-Qur'an Hadis");
  const [newElementCP, setNewElementCP] = useState<string>('');
  const [newElementMaterials, setNewElementMaterials] = useState<string>('');

  const supabaseConfig = getSupabaseConfig();
  const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

  // Precision 84 calculations
  const sem1TPCount = cpData.sem1.reduce((acc, item) => acc + (item.learningObjectives?.length || 0), 0);
  const sem2TPCount = cpData.sem2.reduce((acc, item) => acc + (item.learningObjectives?.length || 0), 0);
  const totalTPCount = sem1TPCount + sem2TPCount;
  const is84Exact = totalTPCount === 84;

  // Direct pull from Supabase using locked credentials
  const handleDirectFetchFromSupabase = async () => {
    if (!isSupabaseConfigured) {
      setShowSupabaseModal(true);
      return;
    }
    setIsDirectSyncing(true);
    try {
      const res = await fetchTPFromSupabase(grade, supabaseConfig, { forceAll84Mode: true });
      if (res.success && res.data) {
        const updated = applySupabaseTPToCPMapping(cpData, res.data, {
          updateMaterials: true,
          updateCPDescription: true
        });
        onUpdateCPData(updated);
        setSupabaseNotification(`Berhasil menarik Elemen CP, Materi Esensial, dan ${res.data.totalTP} butir TP Hasil Analisis langsung dari Supabase (${supabaseConfig.tableName})!`);
      } else {
        setSupabaseNotification(`Pemberitahuan: ${res.message}. Membuka pengaturan Supabase.`);
        setShowSupabaseModal(true);
      }
    } catch (err: any) {
      setSupabaseNotification(`Galat Supabase: ${err.message || String(err)}`);
    } finally {
      setIsDirectSyncing(false);
      setTimeout(() => {
        setSupabaseNotification(null);
      }, 6000);
    }
  };

  // Direct load 84 analyzed TP
  const handleLoad84TPDirectly = () => {
    const std = getStandard84AnalyzedTP();
    const updated = applySupabaseTPToCPMapping(cpData, std, { updateMaterials: true, updateCPDescription: true });
    onUpdateCPData(updated);
    setSupabaseNotification('Berhasil menerapkan Elemen CP, Materi Esensial, dan 84 Butir Tujuan Pembelajaran Hasil Analisis secara presisi (42 butir Sem 1, 42 butir Sem 2)!');
    setTimeout(() => {
      setSupabaseNotification(null);
    }, 5000);
  };

  const currentItems = activeSemester === 'all'
    ? [...cpData.sem1, ...cpData.sem2]
    : activeSemester === 1 ? cpData.sem1 : cpData.sem2;

  // Handle edit CP Description
  const handleUpdateCPDescription = (id: string, sem: SemesterType, newDesc: string) => {
    const semKey = sem === 1 ? 'sem1' : 'sem2';
    const updated = cpData[semKey].map(item => item.id === id ? { ...item, cpDescription: newDesc } : item);
    onUpdateCPData({ ...cpData, [semKey]: updated });
  };

  // Add material item to an entry
  const handleAddMaterial = (id: string, sem: SemesterType) => {
    const text = (newMaterialInputs[id] || '').trim();
    if (!text) return;

    const semKey = sem === 1 ? 'sem1' : 'sem2';
    const updated = cpData[semKey].map(item => {
      if (item.id === id) {
        return {
          ...item,
          essentialMaterials: [...item.essentialMaterials, text]
        };
      }
      return item;
    });

    onUpdateCPData({ ...cpData, [semKey]: updated });
    setNewMaterialInputs(prev => ({ ...prev, [id]: '' }));
  };

  // Edit material item
  const handleUpdateMaterialItem = (id: string, sem: SemesterType, itemIndex: number, newText: string) => {
    const semKey = sem === 1 ? 'sem1' : 'sem2';
    const updated = cpData[semKey].map(item => {
      if (item.id === id) {
        const mats = [...item.essentialMaterials];
        mats[itemIndex] = newText;
        return { ...item, essentialMaterials: mats };
      }
      return item;
    });
    onUpdateCPData({ ...cpData, [semKey]: updated });
  };

  // Remove material item
  const handleRemoveMaterialItem = (id: string, sem: SemesterType, itemIndex: number) => {
    const semKey = sem === 1 ? 'sem1' : 'sem2';
    const updated = cpData[semKey].map(item => {
      if (item.id === id) {
        return {
          ...item,
          essentialMaterials: item.essentialMaterials.filter((_, idx) => idx !== itemIndex)
        };
      }
      return item;
    });
    onUpdateCPData({ ...cpData, [semKey]: updated });
  };

  // Add learning objective (TP hasil analisa) to an entry
  const handleAddTP = (id: string, sem: SemesterType) => {
    const text = (newTPInputs[id] || '').trim();
    if (!text) return;

    const semKey = sem === 1 ? 'sem1' : 'sem2';
    const updated = cpData[semKey].map(item => {
      if (item.id === id) {
        const currentTP = item.learningObjectives || [];
        return {
          ...item,
          learningObjectives: [...currentTP, text]
        };
      }
      return item;
    });

    onUpdateCPData({ ...cpData, [semKey]: updated });
    setNewTPInputs(prev => ({ ...prev, [id]: '' }));
  };

  // Edit learning objective item
  const handleUpdateTP = (id: string, sem: SemesterType, itemIndex: number, newText: string) => {
    const semKey = sem === 1 ? 'sem1' : 'sem2';
    const updated = cpData[semKey].map(item => {
      if (item.id === id) {
        const list = [...(item.learningObjectives || [])];
        list[itemIndex] = newText.trim();
        return { ...item, learningObjectives: list };
      }
      return item;
    });
    onUpdateCPData({ ...cpData, [semKey]: updated });
    setEditingTP(null);
  };

  // Remove learning objective item
  const handleRemoveTP = (id: string, sem: SemesterType, itemIndex: number) => {
    const semKey = sem === 1 ? 'sem1' : 'sem2';
    const updated = cpData[semKey].map(item => {
      if (item.id === id) {
        return {
          ...item,
          learningObjectives: (item.learningObjectives || []).filter((_, idx) => idx !== itemIndex)
        };
      }
      return item;
    });
    onUpdateCPData({ ...cpData, [semKey]: updated });
  };

  // Handle data applied from Supabase modal
  const handleApplySupabaseData = (updated: { sem1: CPMappingEntry[]; sem2: CPMappingEntry[] }) => {
    onUpdateCPData(updated);
    setSupabaseNotification('Tujuan Pembelajaran (TP) Hasil Analisa dari Supabase berhasil disinkronkan ke Pemetaan CP Kelas ' + grade + '!');
    setTimeout(() => {
      setSupabaseNotification(null);
    }, 5000);
  };

  // Sync TP to Prota if onSyncToProta is provided
  const handleSyncTPToProta = () => {
    if (!onSyncToProta) return;
    const allEntries = [...cpData.sem1, ...cpData.sem2];
    const protaItemsToSync: ProtaItem[] = [];
    let chapNum = 1;

    allEntries.forEach(entry => {
      if (entry.essentialMaterials && entry.essentialMaterials.length > 0) {
        entry.essentialMaterials.forEach(mat => {
          protaItemsToSync.push({
            id: `prota_sync_${entry.semester}_${chapNum}`,
            semester: entry.semester,
            chapterNumber: chapNum++,
            element: entry.element,
            chapterTitle: mat.replace(/^Bab\s*\d+\s*:\s*/i, ''),
            learningObjectives: entry.learningObjectives && entry.learningObjectives.length > 0
              ? [...entry.learningObjectives]
              : [`Memahami dan mengamalkan materi ${mat}`],
            allocatedHours: 12,
            teachingDay: profile.teachingDays?.[0] || 'Kamis',
            numberOfMeetings: 3
          });
        });
      }
    });

    onSyncToProta(protaItemsToSync);
    setSupabaseNotification(`Berhasil menyinkronkan ${protaItemsToSync.length} bab Prota beserta Tujuan Pembelajaran hasil analisa!`);
    setTimeout(() => setSupabaseNotification(null), 5000);
  };

  // Delete an entire entry
  const handleDeleteEntry = (id: string, sem: SemesterType) => {
    if (!window.confirm('Hapus baris pemetaan elemen dan materi ini?')) return;
    const semKey = sem === 1 ? 'sem1' : 'sem2';
    const updated = cpData[semKey].filter(item => item.id !== id);
    onUpdateCPData({ ...cpData, [semKey]: updated });
  };

  // Reset to BSKAP Standard
  const handleReset = () => {
    if (window.confirm(`Kembalikan seluruh kolom pengisian CP & Materi Esensial Kelas ${grade} ke standar kurikulum resmi BSKAP No. 032/H/KR/2024?`)) {
      const standard = generateStandardCPMapping(grade);
      onUpdateCPData(standard);
    }
  };

  // Add new element row
  const handleSaveNewElement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newElementCP.trim()) return;

    const materials = newElementMaterials
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const newEntry: CPMappingEntry = {
      id: `cp_custom_${Date.now()}`,
      semester: newElementSemester,
      element: newElementName,
      cpDescription: newElementCP,
      essentialMaterials: materials.length > 0 ? materials : ['Materi Esensial Baru'],
      allocatedJP: 12
    };

    const semKey = newElementSemester === 1 ? 'sem1' : 'sem2';
    onUpdateCPData({
      ...cpData,
      [semKey]: [...cpData[semKey], newEntry]
    });

    setShowAddElementModal(false);
    setNewElementCP('');
    setNewElementMaterials('');
  };

  // Export to Word
  const handleExportWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Pemetaan CP dan Materi Esensial Kelas ${grade}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; color: #000; }
          h2, h3 { text-align: center; margin: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #000; padding: 7px 10px; vertical-align: top; }
          th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
          .elem-header { font-weight: bold; color: #046c4e; }
        </style>
      </head>
      <body>
        <h2>PEMETAAN CAPAIAN PEMBELAJARAN (CP) & MATERI ESENSIAL</h2>
        <h3>MATA PELAJARAN PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI</h3>
        <h3>${profile.schoolName.toUpperCase()} — TAHUN AJARAN ${profile.academicYear}</h3>
        <p style="text-align: center; font-size: 10pt; margin-bottom: 20px;">
          <strong>Kelas:</strong> ${grade} | <strong>Fase:</strong> ${grade <= 2 ? 'A' : grade <= 4 ? 'B' : 'C'} | <strong>Guru:</strong> ${profile.teacherName}
        </p>

        <!-- SEMESTER 1 -->
        <h3 style="text-align: left; margin-top: 20px; color: #1e3a8a;">A. SEMESTER 1 (GANJIL)</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 45%;">Capaian Pembelajaran (CP) Berdasarkan Elemen</th>
              <th style="width: 50%;">Materi Esensial (Ruang Lingkup Materi Pokok)</th>
            </tr>
          </thead>
          <tbody>
            ${cpData.sem1.map((item, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td>
                  <strong>Elemen: ${item.element}</strong><br/>
                  ${item.cpDescription}
                  ${item.learningObjectives && item.learningObjectives.length > 0 ? `
                    <div style="margin-top: 8px; font-size: 10pt; background-color: #f0fdf4; padding: 6px 8px; border-left: 3px solid #046c4e;">
                      <strong style="color: #046c4e;">Tujuan Pembelajaran (Hasil Analisa):</strong>
                      <ul style="margin: 4px 0 0 0; padding-left: 18px;">
                        ${item.learningObjectives.map(tp => `<li>${tp}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </td>
                <td>
                  <ul style="margin: 0; padding-left: 18px;">
                    ${item.essentialMaterials.map(m => `<li><strong>${m}</strong></li>`).join('')}
                  </ul>
                  ${item.subTopics && item.subTopics.length > 0 ? `
                    <div style="font-size: 9.5pt; color: #444; margin-top: 5px;">
                      <em>Submateri:</em> ${item.subTopics.join(', ')}
                    </div>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- SEMESTER 2 -->
        <h3 style="text-align: left; margin-top: 30px; color: #1e3a8a;">B. SEMESTER 2 (GENAP)</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 45%;">Capaian Pembelajaran (CP) Berdasarkan Elemen</th>
              <th style="width: 50%;">Materi Esensial (Ruang Lingkup Materi Pokok)</th>
            </tr>
          </thead>
          <tbody>
            ${cpData.sem2.map((item, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td>
                  <strong>Elemen: ${item.element}</strong><br/>
                  ${item.cpDescription}
                  ${item.learningObjectives && item.learningObjectives.length > 0 ? `
                    <div style="margin-top: 8px; font-size: 10pt; background-color: #f0fdf4; padding: 6px 8px; border-left: 3px solid #046c4e;">
                      <strong style="color: #046c4e;">Tujuan Pembelajaran (Hasil Analisa):</strong>
                      <ul style="margin: 4px 0 0 0; padding-left: 18px;">
                        ${item.learningObjectives.map(tp => `<li>${tp}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </td>
                <td>
                  <ul style="margin: 0; padding-left: 18px;">
                    ${item.essentialMaterials.map(m => `<li><strong>${m}</strong></li>`).join('')}
                  </ul>
                  ${item.subTopics && item.subTopics.length > 0 ? `
                    <div style="font-size: 9.5pt; color: #444; margin-top: 5px;">
                      <em>Submateri:</em> ${item.subTopics.join(', ')}
                    </div>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 35px; width: 100%;">
          <table style="border: none; width: 100%;">
            <tr style="border: none;">
              <td style="border: none; width: 50%; text-align: center;">
                Mengetahui,<br/>${profile.headmasterTitle}<br/><br/><br/><br/>
                <strong><u>${profile.headmasterName}</u></strong><br/>
                NIP. ${profile.headmasterNip}
              </td>
              <td style="border: none; width: 50%; text-align: center;">
                ${profile.cityDateLocation}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
                ${profile.teacherTitle}<br/><br/><br/><br/>
                <strong><u>${profile.teacherName}</u></strong><br/>
                NIP. ${profile.teacherNip}
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pemetaan_CP_MateriEsensial_Kelas${grade}_${profile.academicYear.replace('/', '-')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              Format 2 Kolom Per Semester
            </span>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Kelas {grade} SD • Fase {grade <= 2 ? 'A' : grade <= 4 ? 'B' : 'C'}
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              BSKAP No. 032/H/KR/2024
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-2">
            <span>Kolom Pengisian CP & Materi Esensial</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Kolom kiri memuat <strong>Capaian Pembelajaran (CP) Berdasarkan Elemen</strong>, kolom kanan memuat <strong>Materi Esensial</strong>, terorganisasi presisi per semester.
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 ${
              is84Exact 
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Total TP Hasil Analisis: <strong>{totalTPCount} Butir</strong> {is84Exact ? '✓ Presisi 84/84 (Sem 1: 42, Sem 2: 42)' : '(Target: 84 Butir)'}</span>
            </span>
            <span className="text-[11px] font-medium text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Kolom: <strong>tujuan pembelajaran hasil analisis</strong> (sementara diabaikan)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isSupabaseConfigured && (
            <button
              onClick={handleDirectFetchFromSupabase}
              disabled={isDirectSyncing}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-emerald-600/70"
              title={`Tarik langsung dari database Supabase "${supabaseConfig.tableName}" menggunakan kredensial tersimpan`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-300 ${isDirectSyncing ? 'animate-spin' : ''}`} />
              <span>{isDirectSyncing ? 'Menarik...' : 'Tarik Langsung Supabase'}</span>
              {supabaseConfig.isLocked && (
                <span title="Kredensial Supabase Terkunci">
                  <Lock className="w-3 h-3 text-emerald-300" />
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setShowSupabaseModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-slate-700"
            title="Buka panel integrasi Supabase (Pengaturan, Pemetaan Kolom, & Tempel Data)"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pengaturan Supabase</span>
            {supabaseConfig.isLocked && isSupabaseConfigured && (
              <span className="text-[10px] bg-emerald-900/90 text-emerald-300 px-1.5 py-0.2 rounded font-extrabold flex items-center gap-0.5 border border-emerald-500/40">
                <Lock className="w-2.5 h-2.5" /> Terkunci
              </span>
            )}
          </button>

          <button
            onClick={handleLoad84TPDirectly}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs ${
              is84Exact 
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300' 
                : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-600'
            }`}
            title="Terapkan langsung 84 butir TP Hasil Analisis (42 Sem 1, 42 Sem 2) secara presisi"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{is84Exact ? '✓ 84 TP Presisi Aktif' : 'Muat 84 TP Hasil Analisis'}</span>
          </button>

          {onSyncToProta && (
            <button
              onClick={handleSyncTPToProta}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Sinkronkan butir TP hasil analisa ke Program Tahunan (Prota)"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sinkron ke Prota</span>
            </button>
          )}

          <button
            onClick={() => setShowAddElementModal(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Elemen / Baris</span>
          </button>

          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Download Dokumen Microsoft Word"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ekspor Word</span>
          </button>

          {onOpenPrint && (
            <button
              onClick={onOpenPrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
            title="Reset ke Standar BSKAP 032/2024"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Standar</span>
          </button>
        </div>
      </div>

      {/* Supabase Notification Banner */}
      {supabaseNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{supabaseNotification}</span>
          </div>
          <button
            onClick={() => setSupabaseNotification(null)}
            className="text-emerald-700 hover:text-emerald-950 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Supabase Status Chip if configured */}
      {isSupabaseConfigured && !supabaseNotification && (
        <div className="px-4 py-2 bg-emerald-950 text-emerald-100 rounded-xl flex items-center justify-between text-xs border border-emerald-900 shadow-2xs flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sumber Data: <strong>Database Supabase</strong> ({supabaseConfig.tableName})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {supabaseConfig.isLocked && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-semibold flex items-center gap-1 text-[10px]">
                <Lock className="w-2.5 h-2.5" /> Kredensial Terkunci Permanen
              </span>
            )}
            <span className="text-emerald-300/80 text-[11px]">Elemen CP, Materi Esensial, & TP tersinkron</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDirectFetchFromSupabase}
              disabled={isDirectSyncing}
              className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 text-[11px] border border-emerald-700"
            >
              <RefreshCw className={`w-3 h-3 ${isDirectSyncing ? 'animate-spin' : ''}`} />
              <span>{isDirectSyncing ? 'Menarik...' : 'Tarik Ulang'}</span>
            </button>
            <button
              onClick={() => setShowSupabaseModal(true)}
              className="text-emerald-300 hover:text-white underline font-semibold flex items-center gap-1 text-[11px]"
            >
              <span>Atur Kolom</span>
            </button>
          </div>
        </div>
      )}

      {/* Semester Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSemester(1)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSemester === 1
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Semester 1 (Ganjil)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSemester === 1 ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {cpData.sem1.length} Elemen
            </span>
          </button>

          <button
            onClick={() => setActiveSemester(2)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSemester === 2
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Semester 2 (Genap)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSemester === 2 ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {cpData.sem2.length} Elemen
            </span>
          </button>

          <button
            onClick={() => setActiveSemester('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeSemester === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>Semua Semester</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Klik tombol <strong>Edit</strong> atau langsung ketik pada kolom untuk mengubah narasi CP maupun butir materi.</span>
        </div>
      </div>

      {/* Main 2-Column Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-emerald-900 text-white text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center font-bold border-r border-emerald-800">No</th>
                <th className="py-3.5 px-5 w-1/2 font-bold border-r border-emerald-800">
                  <div className="flex items-center justify-between">
                    <span>1. Capaian Pembelajaran (CP) Berdasarkan Elemen</span>
                    <span className="text-[10px] font-normal lowercase bg-emerald-800 px-2 py-0.5 rounded text-emerald-200">
                      kolom kiri (elemen & rumusan CP)
                    </span>
                  </div>
                </th>
                <th className="py-3.5 px-5 w-1/2 font-bold">
                  <div className="flex items-center justify-between">
                    <span>2. Materi Esensial (Ruang Lingkup Materi Pokok)</span>
                    <span className="text-[10px] font-normal lowercase bg-emerald-800 px-2 py-0.5 rounded text-emerald-200">
                      kolom kanan (materi pokok per semester)
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    Tidak ada data pemetaan CP untuk filter ini. Silakan klik "Reset Standar" atau "Tambah Elemen".
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => {
                  const badge = ELEMENT_STYLES[item.element] || ELEMENT_STYLES["Al-Qur'an Hadis"];
                  const isEditing = editingEntryId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Number & Semester Indicator */}
                      <td className="py-4 px-3 text-center align-top font-bold text-slate-500 border-r border-slate-200 bg-slate-50/50">
                        <div className="flex flex-col items-center gap-1">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-600">
                            Sem {item.semester}
                          </span>
                        </div>
                      </td>

                      {/* KOLOM KIRI: CP Berdasarkan Elemen */}
                      <td className="py-4 px-5 align-top border-r border-slate-200 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs border ${badge.bg} ${badge.text} ${badge.border}`}>
                            <span className={`w-2 h-2 rounded-full ${badge.accent}`}></span>
                            Elemen: {item.element}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingEntryId(isEditing ? null : item.id)}
                              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                                isEditing 
                                  ? 'bg-emerald-700 text-white border-emerald-700' 
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                              title={isEditing ? 'Selesai edit' : 'Edit CP teks'}
                            >
                              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                              <span className="text-[11px]">{isEditing ? 'Selesai' : 'Edit CP'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteEntry(item.id, item.semester)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus baris elemen ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* CP Description Content */}
                        {isEditing ? (
                          <div className="mt-2 space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-700">
                              Rumusan Capaian Pembelajaran Elemen (BSKAP 032/2024):
                            </label>
                            <textarea
                              rows={4}
                              value={item.cpDescription}
                              onChange={(e) => handleUpdateCPDescription(item.id, item.semester, e.target.value)}
                              className="w-full p-2.5 bg-white border border-emerald-500 rounded-xl text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                        ) : (
                          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-justify">
                            {item.cpDescription}
                          </div>
                        )}

                        {/* Tujuan Pembelajaran Hasil Analisa Block */}
                        <div className="mt-3 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-3 rounded-xl border border-emerald-200 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-md bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                                TP
                              </span>
                              <span className="text-[11px] font-bold text-emerald-950">
                                Tujuan Pembelajaran (Hasil Analisa)
                              </span>
                              {item.notes?.includes('Supabase') && (
                                <span className="bg-emerald-200/80 text-emerald-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-300">
                                  Supabase
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
                              {item.learningObjectives?.length || 0} Butir
                            </span>
                          </div>

                          {/* TP Items List */}
                          <div className="space-y-1.5">
                            {(!item.learningObjectives || item.learningObjectives.length === 0) ? (
                              <p className="text-[11px] text-slate-500 italic py-1">
                                Belum ada butir TP hasil analisa. Tarik langsung dari database Supabase Anda atau tambah manual.
                              </p>
                            ) : (
                              item.learningObjectives.map((tp, tpIdx) => (
                                <div key={tpIdx} className="group/tp flex items-start gap-2 p-2 bg-white/95 rounded-lg border border-emerald-100/90 text-xs text-slate-800 hover:border-emerald-300 transition-colors shadow-2xs">
                                  <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[9px] shrink-0">
                                    {tpIdx + 1}
                                  </span>
                                  <div className="flex-1 text-[11px] leading-relaxed">
                                    {editingTP?.id === item.id && editingTP?.index === tpIdx ? (
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="text"
                                          defaultValue={tp}
                                          id={`edit_tp_${item.id}_${tpIdx}`}
                                          className="flex-1 px-2 py-1 bg-white border border-emerald-500 rounded text-xs focus:outline-none"
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleUpdateTP(item.id, item.semester, tpIdx, (e.target as HTMLInputElement).value);
                                            }
                                          }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const el = document.getElementById(`edit_tp_${item.id}_${tpIdx}`) as HTMLInputElement;
                                            if (el) handleUpdateTP(item.id, item.semester, tpIdx, el.value);
                                          }}
                                          className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <span>{tp}</span>
                                    )}
                                  </div>
                                  <div className="opacity-0 group-hover/tp:opacity-100 flex items-center gap-0.5 transition-opacity shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setEditingTP(editingTP?.id === item.id && editingTP?.index === tpIdx ? null : { id: item.id, index: tpIdx })}
                                      className="p-1 text-slate-400 hover:text-emerald-700 rounded transition-colors"
                                      title="Edit butir TP ini"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTP(item.id, item.semester, tpIdx)}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                      title="Hapus TP ini"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Quick Add TP Inline Input */}
                          <div className="flex items-center gap-1 pt-1">
                            <input
                              type="text"
                              placeholder="Tambah butir TP hasil analisa baru..."
                              value={newTPInputs[item.id] || ''}
                              onChange={(e) => setNewTPInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTP(item.id, item.semester);
                                }
                              }}
                              className="flex-1 px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-[11px] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddTP(item.id, item.semester)}
                              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0"
                            >
                              <Plus className="w-3 h-3" />
                              <span>TP</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* KOLOM KANAN: Materi Esensial */}
                      <td className="py-4 px-5 align-top space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Daftar Materi Pokok Esensial (Semester {item.semester})
                          </span>
                          {item.allocatedJP && (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-emerald-600" />
                              {item.allocatedJP} JP
                            </span>
                          )}
                        </div>

                        {/* Essential Materials List */}
                        <div className="space-y-2">
                          {item.essentialMaterials.map((mat, matIdx) => (
                            <div
                              key={matIdx}
                              className="group flex items-start gap-2 p-2.5 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200 transition-colors"
                            >
                              <span className="mt-0.5 w-5 h-5 rounded-md bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-[10px] shrink-0">
                                {matIdx + 1}
                              </span>

                              <div className="flex-1">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={mat}
                                    onChange={(e) => handleUpdateMaterialItem(item.id, item.semester, matIdx, e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                  />
                                ) : (
                                  <span className="font-bold text-slate-800 text-xs block">
                                    {mat}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleRemoveMaterialItem(item.id, item.semester, matIdx)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-opacity"
                                title="Hapus materi ini"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Quick Add New Material Input */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <input
                            type="text"
                            placeholder="Ketik judul materi esensial baru (misal: Bab X: ...)..."
                            value={newMaterialInputs[item.id] || ''}
                            onChange={(e) => setNewMaterialInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddMaterial(item.id, item.semester);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddMaterial(item.id, item.semester)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah</span>
                          </button>
                        </div>

                        {/* Subtopics / Ruang Lingkup Materi */}
                        {item.subTopics && item.subTopics.length > 0 && (
                          <div className="p-2 bg-slate-100/70 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-700">Ruang Lingkup Submateri: </span>
                            {item.subTopics.join(' • ')}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Elemen Baru */}
      {showAddElementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-300" />
                <span>Tambah Elemen & Materi Esensial</span>
              </h3>
              <button
                onClick={() => setShowAddElementModal(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewElement} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Semester</label>
                  <select
                    value={newElementSemester}
                    onChange={(e) => setNewElementSemester(Number(e.target.value) as SemesterType)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={1}>Semester 1 (Ganjil)</option>
                    <option value={2}>Semester 2 (Genap)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Elemen PAI</label>
                  <select
                    value={newElementName}
                    onChange={(e) => setNewElementName(e.target.value as PAIElement)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
                    <option value="Akidah">Akidah</option>
                    <option value="Akhlak">Akhlak</option>
                    <option value="Fikih">Fikih</option>
                    <option value="Sejarah Peradaban Islam (SPI)">Sejarah Peradaban Islam (SPI)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Rumusan Capaian Pembelajaran (CP) Elemen (Kolom Kiri):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Peserta didik mampu memahami dan mempraktikkan..."
                  value={newElementCP}
                  onChange={(e) => setNewElementCP(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. Materi Esensial (Kolom Kanan, 1 baris per butir materi):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Bab 1: Meneladani Asmaul Husna&#10;Bab 2: Membaca Surah Pilihan"
                  value={newElementMaterials}
                  onChange={(e) => setNewElementMaterials(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddElementModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan ke Pemetaan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sinkronisasi Supabase */}
      <SupabaseSyncModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        grade={grade}
        currentCPData={cpData}
        onApplyData={handleApplySupabaseData}
      />
    </div>
  );
};
