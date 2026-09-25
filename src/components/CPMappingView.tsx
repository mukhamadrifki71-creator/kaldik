import React, { useState } from 'react';
import { CPMappingEntry, SchoolProfile, SemesterType, PAIElement, ProtaItem } from '../types';
import { generateStandardCPMapping } from '../data/cpTpTemplates';
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
  ArrowRight
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
  const [showAddElementModal, setShowAddElementModal] = useState<boolean>(false);
  const [newElementSemester, setNewElementSemester] = useState<SemesterType>(1);
  const [newElementName, setNewElementName] = useState<PAIElement>("Al-Qur'an Hadis");
  const [newElementCP, setNewElementCP] = useState<string>('');
  const [newElementMaterials, setNewElementMaterials] = useState<string>('');

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
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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

                        {/* Learning Objectives indicator list */}
                        {item.learningObjectives && item.learningObjectives.length > 0 && (
                          <details className="text-[11px] text-slate-500 mt-2">
                            <summary className="cursor-pointer font-semibold text-emerald-800 hover:underline">
                              Lihat {item.learningObjectives.length} Butir Tujuan Pembelajaran (TP) Terkait
                            </summary>
                            <ul className="mt-1.5 space-y-1 pl-4 list-disc text-slate-600">
                              {item.learningObjectives.map((tp, i) => (
                                <li key={i}>{tp}</li>
                              ))}
                            </ul>
                          </details>
                        )}
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
    </div>
  );
};
