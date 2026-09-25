import React, { useState } from 'react';
import { KaldikEvent, SemesterType, EventCategory } from '../types';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  AlertTriangle,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface KaldikViewerProps {
  events: KaldikEvent[];
  semester: SemesterType;
  academicYear: string;
  onAddEvent: (event: KaldikEvent) => void;
  onUpdateEvent: (event: KaldikEvent) => void;
  onDeleteEvent: (id: string) => void;
  onOpenUpload: () => void;
}

const CATEGORY_MAP: Record<EventCategory, { label: string; bg: string; text: string; border: string }> = {
  kbm: { label: 'KBM Efektif', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  libur_nasional: { label: 'Libur Nasional', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  libur_keagamaan: { label: 'Libur Keagamaan Islam', bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  libur_semester: { label: 'Libur Akhir Semester', bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200' },
  asesmen: { label: 'STS / SAS / Asesmen', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  kegiatan_sekolah: { label: 'Kegiatan Sekolah (MPLS/Pondok Ramadhan)', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  kegiatan_guru: { label: 'Kegiatan Guru & KKG PAI', bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' }
};

export const KaldikViewer: React.FC<KaldikViewerProps> = ({
  events,
  semester,
  academicYear,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onOpenUpload
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState<string>('');
  const [formStartDate, setFormStartDate] = useState<string>('');
  const [formEndDate, setFormEndDate] = useState<string>('');
  const [formCategory, setFormCategory] = useState<EventCategory>('kegiatan_sekolah');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formAffectsKBM, setFormAffectsKBM] = useState<boolean>(true);

  // Filter events by semester
  const [startYearStr, endYearStr] = academicYear.split('/');
  const startYear = parseInt(startYearStr, 10) || 2024;
  const endYear = parseInt(endYearStr, 10) || startYear + 1;

  const filteredEvents = events.filter(e => {
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;

    // Semester check
    const startM = new Date(e.startDate).getMonth();
    const startY = new Date(e.startDate).getFullYear();

    if (semester === 1) {
      // Semester 1: Juli - Des
      return (startY === startYear && startM >= 6 && startM <= 11) || (startY === startYear && e.endDate >= `${startYear}-07-01`);
    } else {
      // Semester 2: Jan - Juni
      return (startY === endYear && startM >= 0 && startM <= 6) || (startY === endYear && e.endDate <= `${endYear}-07-15`);
    }
  });

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formStartDate) return;

    const newEv: KaldikEvent = {
      id: 'ev_' + Date.now(),
      title: formTitle,
      startDate: formStartDate,
      endDate: formEndDate || formStartDate,
      category: formCategory,
      description: formDescription,
      affectsKBM: formAffectsKBM,
      color: formCategory === 'asesmen' ? '#f59e0b' : formCategory === 'libur_semester' ? '#ec4899' : formCategory === 'libur_nasional' ? '#ef4444' : '#10b981'
    };

    onAddEvent(newEv);
    setShowAddForm(false);
    resetForm();
  };

  const handleStartEdit = (ev: KaldikEvent) => {
    setEditingEventId(ev.id);
    setFormTitle(ev.title);
    setFormStartDate(ev.startDate);
    setFormEndDate(ev.endDate);
    setFormCategory(ev.category);
    setFormDescription(ev.description || '');
    setFormAffectsKBM(ev.affectsKBM);
  };

  const handleSaveEdit = (ev: KaldikEvent) => {
    const updated: KaldikEvent = {
      ...ev,
      title: formTitle,
      startDate: formStartDate,
      endDate: formEndDate || formStartDate,
      category: formCategory,
      description: formDescription,
      affectsKBM: formAffectsKBM
    };
    onUpdateEvent(updated);
    setEditingEventId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormStartDate('');
    setFormEndDate('');
    setFormCategory('kegiatan_sekolah');
    setFormDescription('');
    setFormAffectsKBM(true);
  };

  return (
    <div className="space-y-6">
      {/* All Classes Synchronized Banner */}
      <div className="bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-emerald-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-800 rounded-xl text-amber-300 shrink-0 border border-emerald-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Kalender Pendidikan Aktif Berlaku untuk Semua Kelas (Kelas 1 s.d. 6 SD)</span>
              <span className="bg-emerald-800 text-emerald-200 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-700">
                TP {academicYear}
              </span>
            </p>
            <p className="text-[11px] text-emerald-200 mt-0.5">
              Seluruh agenda sekolah, asesmen (STS/SAS/ANBK), dan hari libur keagamaan terhubung otomatis ke RPE dan Promes tiap kelas.
            </p>
          </div>
        </div>
      </div>

      {/* Top Banner & Action */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Tahun Ajaran {academicYear}
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Semester {semester === 1 ? '1 (Ganjil)' : '2 (Genap)'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1.5">
            Manajemen Kalender Pendidikan & Agenda Sekolah
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Analisis hari efektif belajar, libur nasional, hari besar Islam, PTS/STS, SAS, dan amaliah keagamaan SDN Pohjentrek II.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Upload / Analisis AI</span>
          </button>

          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingEventId(null);
            }}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Agenda Baru</span>
          </button>
        </div>
      </div>

      {/* Add New Event Inline Modal / Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveAdd}
          className="bg-emerald-50/60 p-5 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-700" />
              <span>Tambah Kegiatan / Libur ke Kalender Pendidikan</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Agenda / Kegiatan / Hari Libur
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Contoh: Pondok Ramadhan PAI, STS 1, dsb."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Kegiatan
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
              >
                <option value="kegiatan_sekolah">Kegiatan Sekolah (MPLS/Pondok Ramadhan)</option>
                <option value="asesmen">Asesmen (STS / SAS / ANBK)</option>
                <option value="libur_keagamaan">Libur Keagamaan Islam</option>
                <option value="libur_nasional">Libur Nasional</option>
                <option value="libur_semester">Libur Akhir Semester</option>
                <option value="kegiatan_guru">Kegiatan Guru / KKG PAI</option>
                <option value="kbm">KBM Efektif Khusus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Mulai (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Selesai (Opsional)
              </label>
              <input
                type="date"
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dampak Terhadap KBM Efektif
              </label>
              <div className="flex items-center space-x-2 pt-2">
                <label className="inline-flex items-center text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formAffectsKBM}
                    onChange={(e) => setFormAffectsKBM(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 mr-2"
                  />
                  <span className="font-semibold text-slate-900">
                    Memotong / Meniadakan Tatap Muka KBM
                  </span>
                </label>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keterangan / Rincian Sasaran
              </label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Rincian pelaksanaan untuk guru dan siswa SDN Pohjentrek II..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs text-white bg-emerald-700 hover:bg-emerald-600 font-bold rounded-lg shadow-xs"
            >
              Simpan ke Kaldik
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs by Category */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-medium mr-1 shrink-0">Filter Kategori:</span>
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
            filterCategory === 'all'
              ? 'bg-slate-800 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Semua ({events.length})
        </button>
        {Object.entries(CATEGORY_MAP).map(([catKey, catMeta]) => (
          <button
            key={catKey}
            onClick={() => setFilterCategory(catKey)}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
              filterCategory === catKey
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {catMeta.label}
          </button>
        ))}
      </div>

      {/* Event Cards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>Daftar Agenda Terintegrasi ({filteredEvents.length} Item pada Semester Ini)</span>
          </h3>
          <span className="text-xs text-slate-500">
            Terhubung otomatis ke perhitungan RPE, Prota & Promes
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Tidak ada agenda yang cocok dengan filter pada semester ini. Silakan tambahkan atau pilih preset.
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const catMeta = CATEGORY_MAP[ev.category] || CATEGORY_MAP.kegiatan_sekolah;
              const isEditing = editingEventId === ev.id;

              if (isEditing) {
                return (
                  <div key={ev.id} className="p-4 bg-amber-50/70 border-l-4 border-amber-500 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-semibold md:col-span-2"
                      />
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-medium"
                      >
                        <option value="kegiatan_sekolah">Kegiatan Sekolah</option>
                        <option value="asesmen">Asesmen (STS/SAS)</option>
                        <option value="libur_keagamaan">Libur Keagamaan Islam</option>
                        <option value="libur_nasional">Libur Nasional</option>
                        <option value="libur_semester">Libur Semester</option>
                      </select>

                      <input
                        type="date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                      />
                      <input
                        type="date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                      />
                      <label className="flex items-center text-xs font-semibold text-slate-800">
                        <input
                          type="checkbox"
                          checked={formAffectsKBM}
                          onChange={(e) => setFormAffectsKBM(e.target.checked)}
                          className="mr-1.5"
                        />
                        Memotong KBM
                      </label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingEventId(null)}
                        className="px-3 py-1 bg-white border border-slate-300 text-xs rounded hover:bg-slate-100"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleSaveEdit(ev)}
                        className="px-4 py-1 bg-emerald-700 text-white text-xs font-bold rounded hover:bg-emerald-600 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={ev.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
                        {catMeta.label}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{ev.title}</h4>
                      {ev.affectsKBM ? (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Memotong KBM
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                          KBM Tetap Berjalan
                        </span>
                      )}
                    </div>

                    {ev.description && (
                      <p className="text-xs text-slate-600">{ev.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold text-slate-800">
                        {ev.startDate} {ev.endDate && ev.endDate !== ev.startDate ? `s.d ${ev.endDate}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 border-l border-slate-200 pl-2">
                      <button
                        onClick={() => handleStartEdit(ev)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                        title="Edit Agenda"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteEvent(ev.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
