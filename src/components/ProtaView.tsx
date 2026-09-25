import React, { useState, useMemo } from 'react';
import { ProtaItem, SchoolProfile, PAIElement, SemesterType, DayOfWeek, KaldikEvent } from '../types';
import { exportProtaToWord, exportToCSV } from '../utils/exportDocs';
import { calculateSemesterRPE } from '../utils/calculator';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  Download, 
  Printer, 
  Check, 
  X, 
  Sparkles,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ProtaViewProps {
  protaItems: ProtaItem[];
  profile: SchoolProfile;
  annualTargetJP: number;
  events?: KaldikEvent[];
  onUpdateProtaItems: (items: ProtaItem[]) => void;
  onOpenPrint: () => void;
  onResetDefaultCurriculum: () => void;
  onOpenCPTPModal?: () => void;
  onUpdateTeachingDay?: (day: DayOfWeek) => void;
}

const ELEMENT_COLORS: Record<PAIElement, { bg: string; text: string; border: string }> = {
  "Al-Qur'an Hadis": { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  "Akidah": { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  "Akhlak": { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  "Fikih": { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  "Sejarah Peradaban Islam (SPI)": { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' }
};

const DAY_OPTIONS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const ProtaView: React.FC<ProtaViewProps> = ({
  protaItems,
  profile,
  annualTargetJP,
  events = [],
  onUpdateProtaItems,
  onOpenPrint,
  onResetDefaultCurriculum,
  onOpenCPTPModal,
  onUpdateTeachingDay
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [filterSemester, setFilterSemester] = useState<number | 'all'>('all');

  const defaultTeachingDay: DayOfWeek = profile.teachingDays && profile.teachingDays.length > 0 
    ? profile.teachingDays[0] 
    : 'Kamis';
  
  const jpPerMeeting = profile.jpPerWeek || 4;

  // Form states
  const [formSemester, setFormSemester] = useState<SemesterType>(1);
  const [formChapterNumber, setFormChapterNumber] = useState<number>(1);
  const [formElement, setFormElement] = useState<PAIElement>("Al-Qur'an Hadis");
  const [formTitle, setFormTitle] = useState<string>('');
  const [formObjectivesText, setFormObjectivesText] = useState<string>('');
  const [formTeachingDay, setFormTeachingDay] = useState<DayOfWeek>(defaultTeachingDay);
  const [formMeetings, setFormMeetings] = useState<number>(3);
  const [formHours, setFormHours] = useState<number>(12);

  // RPE Data Calculation for both semesters based on selected teaching days
  const rpeSem1 = useMemo(() => {
    return calculateSemesterRPE(
      profile.academicYear,
      1,
      profile.selectedGrade,
      jpPerMeeting,
      events,
      profile.schoolDaysPerWeek || 6,
      DAY_OPTIONS
    );
  }, [profile.academicYear, profile.selectedGrade, jpPerMeeting, events, profile.schoolDaysPerWeek]);

  const rpeSem2 = useMemo(() => {
    return calculateSemesterRPE(
      profile.academicYear,
      2,
      profile.selectedGrade,
      jpPerMeeting,
      events,
      profile.schoolDaysPerWeek || 6,
      DAY_OPTIONS
    );
  }, [profile.academicYear, profile.selectedGrade, jpPerMeeting, events, profile.schoolDaysPerWeek]);

  // Helper to get effective days and JP for a specific day in a semester from RPE
  const getRPEStatsForDay = (day: DayOfWeek, semester: SemesterType) => {
    const rpe = semester === 1 ? rpeSem1 : rpeSem2;
    const effectiveDays = rpe.dayTotals[day]?.effective || rpe.totalEffectiveWeeks || 17;
    const effectiveJP = effectiveDays * jpPerMeeting;
    return { effectiveDays, effectiveJP };
  };

  const totalAllocated = protaItems.reduce((sum, item) => sum + item.allocatedHours, 0);
  const sem1Allocated = protaItems.filter(i => i.semester === 1).reduce((s, i) => s + i.allocatedHours, 0);
  const sem2Allocated = protaItems.filter(i => i.semester === 2).reduce((s, i) => s + i.allocatedHours, 0);

  const sem1TargetJP = getRPEStatsForDay(defaultTeachingDay, 1).effectiveJP;
  const sem2TargetJP = getRPEStatsForDay(defaultTeachingDay, 2).effectiveJP;

  const filteredItems = protaItems.filter(item => {
    if (filterSemester === 'all') return true;
    return item.semester === filterSemester;
  });

  const handleExportWord = () => {
    exportProtaToWord(profile, protaItems);
  };

  const handleExportCSV = () => {
    const headers = ['No', 'Semester', 'Elemen', 'Bab', 'Judul Bab', 'Hari Pelajaran', 'Jml Pertemuan', 'Tujuan Pembelajaran', 'Alokasi Waktu (JP)'];
    const rows = protaItems.map((item, idx) => [
      idx + 1,
      item.semester === 1 ? 'Semester 1' : 'Semester 2',
      item.element,
      `Bab ${item.chapterNumber}`,
      item.chapterTitle,
      item.teachingDay || defaultTeachingDay,
      `${item.numberOfMeetings || Math.round(item.allocatedHours / jpPerMeeting)} Pertemuan`,
      item.learningObjectives.join('; '),
      item.allocatedHours
    ]);

    rows.push(['TOTAL', '', '', '', '', '', '', '', totalAllocated]);

    exportToCSV(`PROTA_PAI_Kelas${profile.selectedGrade}_${profile.academicYear.replace('/', '-')}`, headers, rows);
  };

  // Synchronize meeting count and hours
  const handleMeetingsChange = (meetings: number) => {
    const validMeetings = Math.max(1, meetings);
    setFormMeetings(validMeetings);
    setFormHours(validMeetings * jpPerMeeting);
  };

  const handleHoursChange = (hours: number) => {
    const validHours = Math.max(1, hours);
    setFormHours(validHours);
    setFormMeetings(Math.max(1, Math.ceil(validHours / jpPerMeeting)));
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const objectives = formObjectivesText
      .split('\n')
      .map(o => o.trim())
      .filter(o => o.length > 0);

    const calculatedMeetings = formMeetings || Math.ceil(formHours / jpPerMeeting);

    const newItem: ProtaItem = {
      id: 'prota_' + Date.now(),
      semester: formSemester,
      chapterNumber: Number(formChapterNumber),
      element: formElement,
      chapterTitle: formTitle,
      learningObjectives: objectives.length > 0 ? objectives : [formTitle],
      allocatedHours: Number(formHours),
      teachingDay: formTeachingDay,
      numberOfMeetings: calculatedMeetings
    };

    onUpdateProtaItems([...protaItems, newItem]);
    setShowAddForm(false);
    resetForm();
  };

  const handleStartEdit = (item: ProtaItem) => {
    setEditingItemId(item.id);
    setFormSemester(item.semester);
    setFormChapterNumber(item.chapterNumber);
    setFormElement(item.element);
    setFormTitle(item.chapterTitle);
    setFormObjectivesText(item.learningObjectives.join('\n'));
    setFormHours(item.allocatedHours);
    const day = item.teachingDay || defaultTeachingDay;
    setFormTeachingDay(day);
    const meetings = item.numberOfMeetings || Math.ceil(item.allocatedHours / jpPerMeeting);
    setFormMeetings(meetings);
  };

  const handleSaveEdit = (item: ProtaItem) => {
    const objectives = formObjectivesText
      .split('\n')
      .map(o => o.trim())
      .filter(o => o.length > 0);

    const calculatedMeetings = formMeetings || Math.ceil(formHours / jpPerMeeting);

    const updated = protaItems.map(it => {
      if (it.id === item.id) {
        return {
          ...it,
          semester: formSemester,
          chapterNumber: Number(formChapterNumber),
          element: formElement,
          chapterTitle: formTitle,
          learningObjectives: objectives.length > 0 ? objectives : [formTitle],
          allocatedHours: Number(formHours),
          teachingDay: formTeachingDay,
          numberOfMeetings: calculatedMeetings
        };
      }
      return it;
    });

    onUpdateProtaItems(updated);
    setEditingItemId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onUpdateProtaItems(protaItems.filter(i => i.id !== id));
  };

  const handleApplyDayToAll = (day: DayOfWeek) => {
    if (window.confirm(`Terapkan Hari "${day}" sebagai hari pelajaran untuk seluruh Bab/TP di Semester 1 dan Semester 2?`)) {
      const updated = protaItems.map(it => ({
        ...it,
        teachingDay: day
      }));
      onUpdateProtaItems(updated);
      if (onUpdateTeachingDay) {
        onUpdateTeachingDay(day);
      }
    }
  };

  const resetForm = () => {
    setFormSemester(1);
    setFormChapterNumber(protaItems.length + 1);
    setFormElement("Al-Qur'an Hadis");
    setFormTitle('');
    setFormObjectivesText('');
    setFormTeachingDay(defaultTeachingDay);
    setFormMeetings(3);
    setFormHours(3 * jpPerMeeting);
  };

  // Active form RPE reference
  const currentFormRPE = getRPEStatsForDay(formTeachingDay, formSemester);
  const itemsInFormSemester = protaItems.filter(i => i.semester === formSemester && i.id !== editingItemId);
  const totalInSemesterWithForm = itemsInFormSemester.reduce((s, i) => s + i.allocatedHours, 0) + Number(formHours);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Program Tahunan (Prota)
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Kelas {profile.selectedGrade} SD • Kurikulum Merdeka
            </span>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              TP {profile.academicYear}
            </span>
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>1 Pertemuan = {jpPerMeeting} JP</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1.5">
            Distribusi Alokasi Capaian Pembelajaran & TP PAI Tahunan
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Alokasi JP disinkronkan langsung dengan hari pelajaran dan jumlah hari efektif pada RPE ({annualTargetJP} JP Standar Tahunan).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenCPTPModal && (
            <button
              onClick={onOpenCPTPModal}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Terapkan Template CP & TP Otomatis dari BSKAP 032/H/KR/2024"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Template CP & TP Otomatis</span>
            </button>
          )}

          <button
            onClick={onResetDefaultCurriculum}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Reset ke Buku Teks Resmi Kemendikbud/Kemenag"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset Standar Kemdikbud</span>
          </button>

          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ekspor Word</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={onOpenPrint}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* RPE & Teaching Day Sync Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Overall JP */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Alokasi Prota</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              {protaItems.length} Bab / TP
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{totalAllocated}</span>
              <span className="text-xs font-bold text-slate-500">JP / {annualTargetJP} JP Standar</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Total {Math.round(totalAllocated / jpPerMeeting)} kali pertemuan tatap muka 1 tahun pelajaran.
            </p>
          </div>
        </div>

        {/* KPI 2: Semester 1 Sync with RPE */}
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Semester 1 (Ganjil)</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
              RPE Hari {defaultTeachingDay}: {sem1TargetJP} JP
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-950">{sem1Allocated}</span>
              <span className="text-xs font-bold text-emerald-800">JP ({Math.round(sem1Allocated / jpPerMeeting)} Pertemuan)</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {sem1Allocated === sem1TargetJP ? (
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  100% Selaras dengan RPE Semester 1
                </span>
              ) : sem1Allocated < sem1TargetJP ? (
                <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  Sisa {sem1TargetJP - sem1Allocated} JP untuk cadangan/asesmen
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Lebih {sem1Allocated - sem1TargetJP} JP dari kuota RPE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* KPI 3: Semester 2 Sync with RPE */}
        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900">Semester 2 (Genap)</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-white/80 px-2 py-0.5 rounded-md border border-blue-200">
              RPE Hari {defaultTeachingDay}: {sem2TargetJP} JP
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-950">{sem2Allocated}</span>
              <span className="text-xs font-bold text-blue-800">JP ({Math.round(sem2Allocated / jpPerMeeting)} Pertemuan)</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {sem2Allocated === sem2TargetJP ? (
                <span className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  100% Selaras dengan RPE Semester 2
                </span>
              ) : sem2Allocated < sem2TargetJP ? (
                <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  Sisa {sem2TargetJP - sem2Allocated} JP untuk cadangan/asesmen
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Lebih {sem2Allocated - sem2TargetJP} JP dari kuota RPE
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Teaching Day Sync Controls */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            Hari Mengajar Acuan:
          </span>
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-md">
            {defaultTeachingDay} ({jpPerMeeting} JP / Pertemuan)
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-600">
            Terapkan hari lain ke semua bab:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {DAY_OPTIONS.map(day => (
              <button
                key={day}
                onClick={() => handleApplyDayToAll(day)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                  day === defaultTeachingDay
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
                title={`Ubah semua bab menjadi hari ${day}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Add Trigger */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Tampilkan:</span>
          <button
            onClick={() => setFilterSemester('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterSemester === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Semua Semester ({protaItems.length})
          </button>
          <button
            onClick={() => setFilterSemester(1)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterSemester === 1
                ? 'bg-emerald-700 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Semester 1 (Ganjil)
          </button>
          <button
            onClick={() => setFilterSemester(2)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterSemester === 2
                ? 'bg-emerald-700 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Semester 2 (Genap)
          </button>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingItemId(null);
            resetForm();
          }}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Bab / TP</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveAdd}
          className="bg-emerald-50/70 p-5 rounded-2xl border-2 border-emerald-300 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Input Bab & Tujuan Pembelajaran (TP) Baru</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
              <select
                value={formSemester}
                onChange={(e) => setFormSemester(Number(e.target.value) as SemesterType)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value={1}>Semester 1 (Ganjil)</option>
                <option value={2}>Semester 2 (Genap)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Bab</label>
              <input
                type="number"
                value={formChapterNumber}
                onChange={(e) => setFormChapterNumber(Number(e.target.value))}
                min={1}
                max={20}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Elemen PAI</label>
              <select
                value={formElement}
                onChange={(e) => setFormElement(e.target.value as PAIElement)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
                <option value="Akidah">Akidah</option>
                <option value="Akhlak">Akhlak</option>
                <option value="Fikih">Fikih</option>
                <option value="Sejarah Peradaban Islam (SPI)">Sejarah Peradaban Islam (SPI)</option>
              </select>
            </div>

            {/* Teaching Day Selection as RPE Anchor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Hari Pelajaran PAI</span>
                <span className="text-[10px] text-emerald-700 font-bold">Acuan RPE</span>
              </label>
              <select
                value={formTeachingDay}
                onChange={(e) => setFormTeachingDay(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 text-xs bg-white border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-900"
              >
                {DAY_OPTIONS.map(d => (
                  <option key={d} value={d}>Hari {d}</option>
                ))}
              </select>
            </div>

            {/* Meetings and JP Calculator */}
            <div className="md:col-span-2 bg-white p-3 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Jumlah Pertemuan & Alokasi JP</span>
                <span className="text-[11px] text-emerald-700 font-semibold">(1 Pertemuan = {jpPerMeeting} JP)</span>
              </label>
              
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Pertemuan:</span>
                  <input
                    type="number"
                    value={formMeetings}
                    onChange={(e) => handleMeetingsChange(Number(e.target.value))}
                    min={1}
                    max={12}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>
                <div className="text-slate-400 font-bold mt-3">× {jpPerMeeting} JP =</div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Total JP:</span>
                  <input
                    type="number"
                    value={formHours}
                    onChange={(e) => handleHoursChange(Number(e.target.value))}
                    min={1}
                    max={48}
                    className="w-full px-3 py-1.5 text-xs bg-emerald-50 border border-emerald-300 rounded-lg font-black text-emerald-900"
                  />
                </div>
              </div>

              {/* Quick Pills */}
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 flex-wrap">
                <span className="text-[10px] text-slate-500 font-medium">Pilihan Cepat:</span>
                {[2, 3, 4, 5].map(m => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => handleMeetingsChange(m)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      formMeetings === m
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m} Pertemuan ({m * jpPerMeeting} JP)
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time RPE Reference Info Box */}
            <div className="md:col-span-2 bg-amber-50/80 p-3 rounded-xl border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>Kalkulasi Keselarasan RPE Hari {formTeachingDay}</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  Semester {formSemester} menyediakan <strong>{currentFormRPE.effectiveDays} hari pertemuan KBM efektif ({currentFormRPE.effectiveJP} JP)</strong> pada hari {formTeachingDay}.
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-amber-200/70 text-[11px]">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-amber-950">Akumulasi JP Semester {formSemester}:</span>
                  <span className="font-bold text-amber-900">{totalInSemesterWithForm} JP / {currentFormRPE.effectiveJP} JP</span>
                </div>
                {totalInSemesterWithForm === currentFormRPE.effectiveJP ? (
                  <p className="text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Tepat 100% mengisi kuota RPE!
                  </p>
                ) : totalInSemesterWithForm < currentFormRPE.effectiveJP ? (
                  <p className="text-amber-800 font-medium mt-0.5">
                    Tersisa {currentFormRPE.effectiveJP - totalInSemesterWithForm} JP ({ (currentFormRPE.effectiveJP - totalInSemesterWithForm) / jpPerMeeting } pertemuan) untuk asesmen/cadangan.
                  </p>
                ) : (
                  <p className="text-rose-700 font-bold mt-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Melebihi kuota RPE {totalInSemesterWithForm - currentFormRPE.effectiveJP} JP!
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Bab / Lingkup Materi</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Contoh: Aku Cinta Al-Qur'an (Surah Al-Fatihah)"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tujuan Pembelajaran (TP) - Pisahkan dengan baris baru per butir TP
              </label>
              <textarea
                rows={3}
                value={formObjectivesText}
                onChange={(e) => setFormObjectivesText(e.target.value)}
                placeholder={`Membaca Surah Al-Fatihah dengan tartil\nMemahami pesan pokok Surah Al-Fatihah`}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs text-white bg-emerald-700 hover:bg-emerald-600 font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Bab & TP ke Prota</span>
            </button>
          </div>
        </form>
      )}

      {/* Prota Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100/80 text-slate-700 uppercase font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="px-3 py-3 text-center w-10">No</th>
                <th className="px-3 py-3 text-center w-20">Semester</th>
                <th className="px-3 py-3 text-center w-24">Hari & Pertemuan</th>
                <th className="px-4 py-3 w-36">Elemen CP</th>
                <th className="px-6 py-3">Bab & Alur Tujuan Pembelajaran (ATP)</th>
                <th className="px-4 py-3 text-center w-24">Alokasi Waktu</th>
                <th className="px-3 py-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, idx) => {
                const elemColor = ELEMENT_COLORS[item.element] || ELEMENT_COLORS["Al-Qur'an Hadis"];
                const isEditing = editingItemId === item.id;
                const itemDay = item.teachingDay || defaultTeachingDay;
                const itemMeetings = item.numberOfMeetings || Math.ceil(item.allocatedHours / jpPerMeeting);

                if (isEditing) {
                  return (
                    <tr key={item.id} className="bg-amber-50/70 border-l-4 border-amber-500">
                      <td className="px-3 py-3 text-center font-bold">{idx + 1}</td>
                      <td className="px-3 py-3">
                        <select
                          value={formSemester}
                          onChange={(e) => setFormSemester(Number(e.target.value) as SemesterType)}
                          className="w-full px-2 py-1 text-xs border rounded bg-white font-semibold"
                        >
                          <option value={1}>Sem 1</option>
                          <option value={2}>Sem 2</option>
                        </select>
                      </td>
                      <td className="px-3 py-3 space-y-1">
                        <select
                          value={formTeachingDay}
                          onChange={(e) => setFormTeachingDay(e.target.value as DayOfWeek)}
                          className="w-full px-2 py-1 text-xs border border-emerald-400 rounded bg-white font-bold text-emerald-900"
                        >
                          {DAY_OPTIONS.map(d => (
                            <option key={d} value={d}>Hari {d}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={formMeetings}
                            onChange={(e) => handleMeetingsChange(Number(e.target.value))}
                            min={1}
                            max={12}
                            className="w-12 px-1.5 py-0.5 text-[11px] border rounded text-center font-bold"
                          />
                          <span className="text-[10px] text-slate-500">Ptm</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={formElement}
                          onChange={(e) => setFormElement(e.target.value as PAIElement)}
                          className="w-full px-2 py-1 text-xs border rounded bg-white font-semibold"
                        >
                          <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
                          <option value="Akidah">Akidah</option>
                          <option value="Akhlak">Akhlak</option>
                          <option value="Fikih">Fikih</option>
                          <option value="Sejarah Peradaban Islam (SPI)">Sejarah Peradaban Islam (SPI)</option>
                        </select>
                      </td>
                      <td className="px-6 py-3 space-y-2">
                        <div className="flex gap-2 items-center">
                          <span className="font-bold text-slate-600 text-xs">Bab</span>
                          <input
                            type="number"
                            value={formChapterNumber}
                            onChange={(e) => setFormChapterNumber(Number(e.target.value))}
                            className="w-14 px-2 py-1 text-xs border rounded"
                          />
                          <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border rounded font-semibold"
                            placeholder="Judul Bab"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Tujuan Pembelajaran (baris baru per TP):</span>
                          <textarea
                            rows={3}
                            value={formObjectivesText}
                            onChange={(e) => setFormObjectivesText(e.target.value)}
                            className="w-full px-2 py-1 text-xs border rounded"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            value={formHours}
                            onChange={(e) => handleHoursChange(Number(e.target.value))}
                            min={1}
                            max={48}
                            className="w-16 px-2 py-1 text-xs border border-emerald-400 rounded text-center font-black bg-emerald-50 text-emerald-900"
                          />
                          <span className="font-bold text-slate-600">JP</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleSaveEdit(item)}
                            className="p-1.5 text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-xs"
                            title="Simpan Perubahan"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="p-1.5 text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3 py-4 text-center font-bold text-slate-600">{idx + 1}</td>
                    <td className="px-3 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        item.semester === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        Sem {item.semester}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-teal-600" />
                          {itemDay}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {itemMeetings} Pertemuan
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${elemColor.bg} ${elemColor.text} ${elemColor.border}`}>
                        {item.element}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-xs">
                        Bab {item.chapterNumber}: {item.chapterTitle}
                      </p>
                      <ul className="mt-1.5 space-y-1 pl-4 list-disc text-slate-600 text-[11px] leading-relaxed">
                        {item.learningObjectives.map((tp, tpIdx) => (
                          <li key={tpIdx}>{tp}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 font-black rounded-lg text-xs">
                        {item.allocatedHours} JP
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Bab & Alokasi Waktu"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Bab"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-800">
              <tr>
                <td colSpan={5} className="px-6 py-3.5 text-right uppercase text-[11px]">
                  Total Alokasi Waktu Satu Tahun Pelajaran:
                </td>
                <td className="px-4 py-3.5 text-center text-emerald-900 font-black text-sm">
                  {totalAllocated} JP
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
