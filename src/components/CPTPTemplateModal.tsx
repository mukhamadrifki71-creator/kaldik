import React, { useState, useEffect } from 'react';
import { SchoolProfile, ProtaItem, PAIElement, DayOfWeek } from '../types';
import { CP_TP_TEMPLATES, FASE_CP_DATABASE, getGradeFase } from '../data/cpTpTemplates';
import { PAI_CURRICULUM_DATABASE } from '../data/paiCurriculum';
import { 
  X, 
  Sparkles, 
  Check, 
  Copy, 
  GraduationCap, 
  Award, 
  Edit3, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  BookOpen, 
  Layers, 
  Clock,
  Calendar,
  HelpCircle,
  FileCheck,
  Download,
  Upload
} from 'lucide-react';

interface CPTPTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onApplyCurriculum: (items: ProtaItem[]) => void;
}

const ELEMENT_BADGES: Record<PAIElement, { bg: string; text: string; border: string; activeBg: string }> = {
  "Al-Qur'an Hadis": { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', activeBg: 'bg-emerald-700 text-white' },
  "Akidah": { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', activeBg: 'bg-blue-700 text-white' },
  "Akhlak": { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', activeBg: 'bg-purple-700 text-white' },
  "Fikih": { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', activeBg: 'bg-teal-700 text-white' },
  "Sejarah Peradaban Islam (SPI)": { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', activeBg: 'bg-amber-700 text-white' }
};

interface EditableChapter {
  id: string;
  semester: 1 | 2;
  chapterNumber: number;
  element: PAIElement;
  chapterTitle: string;
  learningObjectives: string[];
  allocatedHours: number;
  teachingDay?: DayOfWeek;
  numberOfMeetings?: number;
}

export const CPTPTemplateModal: React.FC<CPTPTemplateModalProps> = ({
  isOpen,
  onClose,
  profile,
  onApplyCurriculum
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(profile.selectedGrade || 4);
  const [activeTab, setActiveTab] = useState<'editor' | 'cp_matrix'>('editor');
  const [selectedElement, setSelectedElement] = useState<PAIElement | 'all'>('all');
  
  // Custom edited templates stored by grade
  const [customChaptersByGrade, setCustomChaptersByGrade] = useState<Record<number, EditableChapter[]>>(() => {
    const initial: Record<number, EditableChapter[]> = {};
    [1, 2, 3, 4, 5, 6].forEach(gr => {
      const cur = PAI_CURRICULUM_DATABASE[gr] || PAI_CURRICULUM_DATABASE[4];
      initial[gr] = cur.chapters.map((ch, idx) => ({
        id: `chap_${gr}_${idx + 1}`,
        semester: ch.semester as 1 | 2,
        chapterNumber: ch.chapterNumber,
        element: ch.element,
        chapterTitle: ch.chapterTitle,
        learningObjectives: [...ch.learningObjectives],
        allocatedHours: ch.allocatedHours
      }));
    });
    return initial;
  });

  // Custom CP Descriptions by Grade
  const [customElemenMap, setCustomElemenMap] = useState(() => {
    return JSON.parse(JSON.stringify(CP_TP_TEMPLATES));
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  // New chapter modal/state
  const defaultDay: DayOfWeek = profile.teachingDays && profile.teachingDays.length > 0 ? profile.teachingDays[0] : 'Kamis';
  const jpPerMeeting = profile.jpPerWeek || 4;

  const [showAddChapter, setShowAddChapter] = useState<boolean>(false);
  const [newSemester, setNewSemester] = useState<1 | 2>(1);
  const [newElement, setNewElement] = useState<PAIElement>("Al-Qur'an Hadis");
  const [newTitle, setNewTitle] = useState<string>('');
  const [newObjectives, setNewObjectives] = useState<string>('');
  const [newTeachingDay, setNewTeachingDay] = useState<DayOfWeek>(defaultDay);
  const [newMeetings, setNewMeetings] = useState<number>(3);
  const [newHours, setNewHours] = useState<number>(12);

  if (!isOpen) return null;

  const currentFaseKey = getGradeFase(selectedGrade);
  const faseCP = FASE_CP_DATABASE[currentFaseKey];
  const templateData = customElemenMap[selectedGrade] || CP_TP_TEMPLATES[selectedGrade] || CP_TP_TEMPLATES[4];
  const currentChapters = customChaptersByGrade[selectedGrade] || [];

  const totalJP = currentChapters.reduce((s, i) => s + i.allocatedHours, 0);
  const sem1JP = currentChapters.filter(c => c.semester === 1).reduce((s, i) => s + i.allocatedHours, 0);
  const sem2JP = currentChapters.filter(c => c.semester === 2).reduce((s, i) => s + i.allocatedHours, 0);

  // Apply custom chapters to Prota & Promes
  const handleApply = () => {
    const protaItemsToApply: ProtaItem[] = currentChapters.map(ch => ({
      id: ch.id,
      semester: ch.semester,
      chapterNumber: ch.chapterNumber,
      element: ch.element,
      chapterTitle: ch.chapterTitle,
      learningObjectives: ch.learningObjectives,
      allocatedHours: ch.allocatedHours,
      teachingDay: ch.teachingDay || defaultDay,
      numberOfMeetings: ch.numberOfMeetings || Math.ceil(ch.allocatedHours / jpPerMeeting)
    }));

    onApplyCurriculum(protaItemsToApply);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 1200);
  };

  // Reset to BSKAP Official Standard
  const handleResetToStandard = () => {
    if (!window.confirm(`Kembalikan seluruh template Kelas ${selectedGrade} ke Standar Resmi BSKAP 032/2024? Perubahan kustom Anda pada kelas ini akan direset.`)) {
      return;
    }

    const cur = PAI_CURRICULUM_DATABASE[selectedGrade] || PAI_CURRICULUM_DATABASE[4];
    setCustomChaptersByGrade(prev => ({
      ...prev,
      [selectedGrade]: cur.chapters.map((ch, idx) => ({
        id: `chap_${selectedGrade}_${idx + 1}`,
        semester: ch.semester as 1 | 2,
        chapterNumber: ch.chapterNumber,
        element: ch.element,
        chapterTitle: ch.chapterTitle,
        learningObjectives: [...ch.learningObjectives],
        allocatedHours: ch.allocatedHours
      }))
    }));

    setCustomElemenMap((prev: typeof CP_TP_TEMPLATES) => ({
      ...prev,
      [selectedGrade]: JSON.parse(JSON.stringify(CP_TP_TEMPLATES[selectedGrade] || CP_TP_TEMPLATES[4]))
    }));
  };

  // Update specific chapter field
  const handleUpdateChapter = (id: string, updates: Partial<EditableChapter>) => {
    setCustomChaptersByGrade(prev => ({
      ...prev,
      [selectedGrade]: prev[selectedGrade].map(ch => ch.id === id ? { ...ch, ...updates } : ch)
    }));
  };

  // Delete chapter
  const handleDeleteChapter = (id: string) => {
    setCustomChaptersByGrade(prev => ({
      ...prev,
      [selectedGrade]: prev[selectedGrade].filter(ch => ch.id !== id)
    }));
  };

  // Add chapter
  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tps = newObjectives
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const calculatedMeetings = newMeetings || Math.ceil(newHours / jpPerMeeting);
    const nextChapterNumber = currentChapters.length + 1;
    const newChap: EditableChapter = {
      id: `custom_${selectedGrade}_${Date.now()}`,
      semester: newSemester,
      chapterNumber: nextChapterNumber,
      element: newElement,
      chapterTitle: newTitle,
      learningObjectives: tps.length > 0 ? tps : [newTitle],
      allocatedHours: Number(newHours) || 12,
      teachingDay: newTeachingDay,
      numberOfMeetings: calculatedMeetings
    };

    setCustomChaptersByGrade(prev => ({
      ...prev,
      [selectedGrade]: [...prev[selectedGrade], newChap]
    }));

    setShowAddChapter(false);
    setNewTitle('');
    setNewObjectives('');
    setNewTeachingDay(defaultDay);
    setNewMeetings(3);
    setNewHours(3 * jpPerMeeting);
  };

  // Update CP Elemen text in Matrix tab
  const handleUpdateCPElemen = (elemName: string, newText: string) => {
    setCustomElemenMap((prev: typeof CP_TP_TEMPLATES) => {
      const copy = { ...prev };
      if (!copy[selectedGrade]) {
        copy[selectedGrade] = JSON.parse(JSON.stringify(CP_TP_TEMPLATES[selectedGrade] || CP_TP_TEMPLATES[4]));
      }
      if (copy[selectedGrade].elemenMap[elemName as PAIElement]) {
        copy[selectedGrade].elemenMap[elemName as PAIElement].cpElemen = newText;
      }
      return copy;
    });
  };

  // Copy structured text to clipboard
  const handleCopyText = () => {
    let text = `======================================================\n`;
    text += `TEMPLATE CAPAIAN PEMBELAJARAN (CP) & ATP / PROTA PAI\n`;
    text += `KELAS ${selectedGrade} SD - ${faseCP?.fase || currentFaseKey}\n`;
    text += `Satuan Pendidikan: ${profile.schoolName}\n`;
    text += `======================================================\n\n`;
    text += `I. DAFTAR BAB & TUJUAN PEMBELAJARAN (TOTAL ${totalJP} JP):\n`;

    currentChapters.forEach((ch, idx) => {
      text += `\n${idx + 1}. [Semester ${ch.semester}] Bab ${ch.chapterNumber}: ${ch.chapterTitle} (${ch.allocatedHours} JP)\n`;
      text += `   Elemen: ${ch.element}\n`;
      text += `   Tujuan Pembelajaran:\n`;
      ch.learningObjectives.forEach((tp, i) => {
        text += `   ${i + 1}) ${tp}\n`;
      });
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredChapters = currentChapters.filter(ch => {
    if (selectedElement === 'all') return true;
    return ch.element === selectedElement;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-800 rounded-xl text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg leading-tight">Kelola & Edit Template Otomatis CP, TP & Prota</h3>
                <span className="bg-emerald-800 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-700">
                  Hak Akses Edit Penuh Guru
                </span>
              </div>
              <p className="text-xs text-emerald-300 mt-0.5">
                Sesuaikan judul bab, alokasi jam (JP), dan butir Tujuan Pembelajaran (TP) per jenjang kelas.
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

        {/* Grade Selector & Sub-Navigation */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              Pilih Kelas:
            </span>
            {[1, 2, 3, 4, 5, 6].map((gr) => (
              <button
                key={gr}
                onClick={() => {
                  setSelectedGrade(gr);
                  setEditingChapterId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedGrade === gr
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Kelas {gr} ({getGradeFase(gr)})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-300">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'editor' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor Bab & TP ({currentChapters.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('cp_matrix')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'cp_matrix' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Matriks CP Fase ({currentFaseKey})</span>
              </button>
            </div>

            <button
              onClick={handleResetToStandard}
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-rose-50 hover:border-rose-300 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
              title="Reset kembali ke kurikulum standar BSKAP"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Salin Naskah CP & TP"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
          </div>
        </div>

        {/* Body Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Stat & Guidance Bar */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  Struktur Template Kelas {selectedGrade} ({currentFaseKey})
                </span>
                <span className="bg-emerald-200 text-emerald-900 font-bold text-[11px] px-2 py-0.5 rounded-md">
                  {currentChapters.length} Bab Pokok
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Total JP: <strong className="text-emerald-950">{totalJP} JP</strong> (Sem 1: {sem1JP} JP • Sem 2: {sem2JP} JP). Anda dapat mengedit judul, memecah TP, menambah bab baru, atau mengubah jam pelajaran.
              </p>
            </div>

            {activeTab === 'editor' && (
              <button
                onClick={() => setShowAddChapter(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Bab / Materi Baru</span>
              </button>
            )}
          </div>

          {/* Modal / Inline Form for Adding a New Chapter */}
          {showAddChapter && (
            <form onSubmit={handleAddChapterSubmit} className="bg-slate-50 p-5 rounded-2xl border-2 border-emerald-500 shadow-md space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  Tambah Materi / Bab Baru ke Template Kelas {selectedGrade}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(Number(e.target.value) as 1 | 2)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={1}>Semester 1 (Ganjil)</option>
                    <option value={2}>Semester 2 (Genap)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Elemen PAI</label>
                  <select
                    value={newElement}
                    onChange={(e) => setNewElement(e.target.value as PAIElement)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
                    <option value="Akidah">Akidah</option>
                    <option value="Akhlak">Akhlak</option>
                    <option value="Fikih">Fikih</option>
                    <option value="Sejarah Peradaban Islam (SPI)">Sejarah Peradaban Islam (SPI)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari Pelajaran</label>
                  <select
                    value={newTeachingDay}
                    onChange={(e) => setNewTeachingDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-lg font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as DayOfWeek[]).map(d => (
                      <option key={d} value={d}>Hari {d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pertemuan & JP ({jpPerMeeting} JP/ptm)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={newMeetings}
                      onChange={(e) => {
                        const m = Math.max(1, Number(e.target.value));
                        setNewMeetings(m);
                        setNewHours(m * jpPerMeeting);
                      }}
                      className="w-14 px-2 py-2 bg-white border border-slate-300 rounded-lg font-bold text-center text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-slate-400 font-bold">=</span>
                    <input
                      type="number"
                      min={1}
                      max={48}
                      value={newHours}
                      onChange={(e) => {
                        const h = Math.max(1, Number(e.target.value));
                        setNewHours(h);
                        setNewMeetings(Math.ceil(h / jpPerMeeting));
                      }}
                      className="flex-1 px-2 py-2 bg-emerald-50 border border-emerald-300 rounded-lg font-black text-center text-xs text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-slate-600 text-xs">JP</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bab / Pokok Bahasan</label>
                <input
                  type="text"
                  placeholder="Misal: Mengenal Surah Pendek dan Hukum Tajwid"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tujuan Pembelajaran (TP) / Indikator (1 baris per poin TP)
                </label>
                <textarea
                  rows={3}
                  placeholder="1. Menyebutkan pesan pokok surah dengan benar&#10;2. Menghafalkan ayat secara tartil"
                  value={newObjectives}
                  onChange={(e) => setNewObjectives(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Bab ke Template</span>
                </button>
              </div>
            </form>
          )}

          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-semibold text-slate-600 shrink-0">Filter Elemen:</span>
            <button
              onClick={() => setSelectedElement('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                selectedElement === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Semua Elemen
            </button>
            {(["Al-Qur'an Hadis", "Akidah", "Akhlak", "Fikih", "Sejarah Peradaban Islam (SPI)"] as PAIElement[]).map((elem) => (
              <button
                key={elem}
                onClick={() => setSelectedElement(elem)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                  selectedElement === elem
                    ? ELEMENT_BADGES[elem].activeBg
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {elem}
              </button>
            ))}
          </div>

          {/* TAB 1: CHAPTER & TP EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              {filteredChapters.map((chapter, idx) => {
                const isEditing = editingChapterId === chapter.id;
                const badge = ELEMENT_BADGES[chapter.element] || ELEMENT_BADGES["Al-Qur'an Hadis"];

                return (
                  <div
                    key={chapter.id}
                    className={`bg-white rounded-2xl border transition-all ${
                      isEditing ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-slate-200 shadow-xs hover:border-slate-300'
                    }`}
                  >
                    {/* Chapter Header Card */}
                    <div className={`px-4 py-3 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${badge.bg} ${badge.border} rounded-t-2xl`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-800 text-xs bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                          Bab {chapter.chapterNumber}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md border bg-white ${badge.text} ${badge.border}`}>
                          {chapter.element}
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-1 rounded border border-slate-200">
                          Semester {chapter.semester}
                        </span>
                        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded border border-teal-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-teal-600" />
                          Hari {chapter.teachingDay || defaultDay}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300">
                          {chapter.numberOfMeetings || Math.ceil(chapter.allocatedHours / jpPerMeeting)} Pertemuan ({chapter.allocatedHours} JP)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => setEditingChapterId(isEditing ? null : chapter.id)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1 ${
                            isEditing 
                              ? 'bg-emerald-700 text-white border-emerald-700' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isEditing ? 'Selesai Edit' : 'Edit Bab & TP'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Bab dari Template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Chapter Body View / Edit */}
                    <div className="p-4 space-y-3">
                      {isEditing ? (
                        /* Edit Mode */
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                            <div className="sm:col-span-2">
                              <label className="block font-bold text-slate-700 mb-1">Judul Bab</label>
                              <input
                                type="text"
                                value={chapter.chapterTitle}
                                onChange={(e) => handleUpdateChapter(chapter.id, { chapterTitle: e.target.value })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Elemen</label>
                              <select
                                value={chapter.element}
                                onChange={(e) => handleUpdateChapter(chapter.id, { element: e.target.value as PAIElement })}
                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
                                <option value="Akidah">Akidah</option>
                                <option value="Akhlak">Akhlak</option>
                                <option value="Fikih">Fikih</option>
                                <option value="Sejarah Peradaban Islam (SPI)">Sejarah Peradaban Islam (SPI)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Hari Pelajaran</label>
                              <select
                                value={chapter.teachingDay || defaultDay}
                                onChange={(e) => handleUpdateChapter(chapter.id, { teachingDay: e.target.value as DayOfWeek })}
                                className="w-full px-3 py-1.5 bg-white border border-emerald-400 rounded-lg text-xs font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as DayOfWeek[]).map(d => (
                                  <option key={d} value={d}>Hari {d}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-slate-700 mb-1">Pertemuan & JP</label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={1}
                                  max={12}
                                  value={chapter.numberOfMeetings || Math.ceil(chapter.allocatedHours / jpPerMeeting)}
                                  onChange={(e) => {
                                    const m = Math.max(1, Number(e.target.value));
                                    handleUpdateChapter(chapter.id, { 
                                      numberOfMeetings: m,
                                      allocatedHours: m * jpPerMeeting
                                    });
                                  }}
                                  className="w-12 px-1.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <span className="text-slate-400 font-bold">=</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={48}
                                  value={chapter.allocatedHours}
                                  onChange={(e) => {
                                    const h = Math.max(1, Number(e.target.value));
                                    handleUpdateChapter(chapter.id, { 
                                      allocatedHours: h,
                                      numberOfMeetings: Math.ceil(h / jpPerMeeting)
                                    });
                                  }}
                                  className="flex-1 px-1.5 py-1.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-black text-emerald-900 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <span className="text-slate-600 font-bold text-[10px]">JP</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Tujuan Pembelajaran (TP) / Indikator (1 baris per butir TP):
                            </label>
                            <textarea
                              rows={4}
                              value={chapter.learningObjectives.join('\n')}
                              onChange={(e) => {
                                const list = e.target.value.split('\n');
                                handleUpdateChapter(chapter.id, { learningObjectives: list });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => setEditingChapterId(null)}
                              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Simpan Perubahan Bab</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Read-Only Display Mode */
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                            <span>{chapter.chapterTitle}</span>
                          </h4>

                          <div className="mt-2 space-y-1">
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                              Tujuan Pembelajaran (TP):
                            </p>
                            <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                              {chapter.learningObjectives.map((tp, i) => (
                                <li key={i} className="leading-relaxed pl-1">
                                  {tp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: CAPAIAN PEMBELAJARAN (CP) MATRIX VIEW & EDIT */}
          {activeTab === 'cp_matrix' && (
            <div className="space-y-6">
              {/* Deskripsi Fase Banner */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-700" />
                    Capaian Pembelajaran {faseCP?.fase}
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 font-bold text-[11px] px-2 py-0.5 rounded-md">
                    Regulasi BSKAP No. 032/H/KR/2024
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {faseCP?.capaianUmum}
                </p>
              </div>

              {/* Matriks Elemen CP */}
              <div className="space-y-4">
                {Object.entries(templateData.elemenMap).map(([elemName, elemData]: [string, any]) => {
                  if (selectedElement !== 'all' && selectedElement !== elemName) return null;
                  const badge = ELEMENT_BADGES[elemName as PAIElement] || ELEMENT_BADGES["Al-Qur'an Hadis"];

                  return (
                    <div
                      key={elemName}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                    >
                      <div className={`px-4 py-2.5 border-b flex items-center justify-between ${badge.bg} ${badge.border}`}>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border bg-white ${badge.text} ${badge.border}`}>
                          Elemen: {elemName}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {elemData.tujuanPembelajaran.length} Indikator TP
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-800">Capaian Elemen (Dapat Diedit):</label>
                          <textarea
                            rows={2}
                            value={elemData.cpElemen}
                            onChange={(e) => handleUpdateCPElemen(elemName, e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-800 mb-1.5">
                            Contoh Alur Indikator TP Standar:
                          </p>
                          <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            {elemData.tujuanPembelajaran.map((tp: string, idx: number) => (
                              <li key={idx} className="leading-relaxed pl-1">
                                {tp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Menerapkan template ini akan menyinkronkan <strong>{currentChapters.length} Bab ({totalJP} JP)</strong> langsung ke Program Tahunan (Prota) dan Program Semester (Promes) Kelas {selectedGrade}.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Tutup
            </button>

            <button
              onClick={handleApply}
              disabled={appliedSuccess}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              {appliedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Berhasil Diterapkan ke Prota & Promes!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Terapkan Template Kustom ke Prota & Promes (Kelas {selectedGrade})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
