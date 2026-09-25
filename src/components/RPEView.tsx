import React, { useState } from 'react';
import { RPEData, SchoolProfile, DayOfWeek } from '../types';
import { exportRPEToWord, exportToCSV } from '../utils/exportDocs';
import { MonthMonitoringWidget } from './MonthMonitoringWidget';
import { 
  FileSpreadsheet, 
  Download, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Info,
  Calendar,
  BarChart3,
  GraduationCap,
  Sparkles,
  CalendarCheck
} from 'lucide-react';

interface RPEViewProps {
  rpeData: RPEData;
  profile: SchoolProfile;
  onOpenPrint: () => void;
  onUpdateTeachingDay?: (day: DayOfWeek) => void;
}

export const RPEView: React.FC<RPEViewProps> = ({
  rpeData,
  profile,
  onOpenPrint,
  onUpdateTeachingDay
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'table' | 'diagram' | 'distribution'>('table');

  const selectedDay: DayOfWeek = profile.teachingDays?.[0] || 'Kamis';

  const handleExportWord = () => {
    exportRPEToWord(profile, rpeData);
  };

  const handleExportCSV = () => {
    const headers = [
      'No',
      'Bulan',
      'Tahun',
      'Hari Kalender',
      'Hari Libur',
      'Hari Asesmen & Kegiatan',
      'HES (Hari Efektif Sekolah)',
      'HEB (Hari Efektif Belajar)',
      'Senin Efektif',
      'Selasa Efektif',
      'Rabu Efektif',
      'Kamis Efektif',
      'Jumat Efektif',
      'Sabtu Efektif',
      'Jumlah Pekan',
      'Pekan Efektif',
      'Pekan Tdk Efektif',
      `Pertemuan PAI (${selectedDay})`,
      'Keterangan Agenda'
    ];

    const rows = rpeData.months.map((m, idx) => [
      idx + 1,
      m.monthName,
      m.year,
      m.calendarDaysCount,
      m.holidaysCount + m.sundayHolidaysCount,
      m.assessmentDaysCount + m.schoolEventDaysCount,
      m.schoolDaysCount,
      m.effectiveTeachingDaysCount,
      `${m.dayBreakdown['Senin'].effective}/${m.dayBreakdown['Senin'].total}`,
      `${m.dayBreakdown['Selasa'].effective}/${m.dayBreakdown['Selasa'].total}`,
      `${m.dayBreakdown['Rabu'].effective}/${m.dayBreakdown['Rabu'].total}`,
      `${m.dayBreakdown['Kamis'].effective}/${m.dayBreakdown['Kamis'].total}`,
      `${m.dayBreakdown['Jumat'].effective}/${m.dayBreakdown['Jumat'].total}`,
      `${m.dayBreakdown['Sabtu'].effective}/${m.dayBreakdown['Sabtu'].total}`,
      m.totalWeeks,
      m.effectiveWeeks,
      m.nonEffectiveWeeks,
      m.paiScheduleDaysCount,
      m.nonEffectiveReasons.join('; ') || '-'
    ]);

    rows.push([
      'TOTAL',
      '',
      '',
      rpeData.totalCalendarDays,
      rpeData.totalHolidays,
      rpeData.totalAssessmentDays + rpeData.totalSchoolEventDays,
      rpeData.totalSchoolDays,
      rpeData.totalEffectiveTeachingDays,
      `${rpeData.dayTotals['Senin'].effective}/${rpeData.dayTotals['Senin'].total}`,
      `${rpeData.dayTotals['Selasa'].effective}/${rpeData.dayTotals['Selasa'].total}`,
      `${rpeData.dayTotals['Rabu'].effective}/${rpeData.dayTotals['Rabu'].total}`,
      `${rpeData.dayTotals['Kamis'].effective}/${rpeData.dayTotals['Kamis'].total}`,
      `${rpeData.dayTotals['Jumat'].effective}/${rpeData.dayTotals['Jumat'].total}`,
      `${rpeData.dayTotals['Sabtu'].effective}/${rpeData.dayTotals['Sabtu'].total}`,
      rpeData.totalWeeks,
      rpeData.totalEffectiveWeeks,
      rpeData.totalNonEffectiveWeeks,
      rpeData.totalPAIScheduleDays,
      ''
    ]);

    exportToCSV(`RPE_Lengkap_PAI_Kelas${profile.selectedGrade}_Sem${rpeData.semester}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Rencana Pekan & Hari Efektif (RPE)
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Semester {rpeData.semester === 1 ? '1 (Ganjil)' : '2 (Genap)'} • TP {rpeData.academicYear}
            </span>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Jadwal PAI: Setiap {selectedDay}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1.5">
            Analisis Rincian Hari & Pekan Efektif PAI SD
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Perhitungan presisi jumlah hari kalender, HES, HEB, rincian hari (Senin–Sabtu), dan jadwal mengajar PAI ({rpeData.jpPerWeek} JP/pertemuan).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            title="Download Dokumen Microsoft Word Resmi"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ekspor Word (.doc)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            title="Download File CSV/Excel dengan Rincian Hari Lengkap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel/CSV</span>
          </button>

          <button
            onClick={onOpenPrint}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Format Resmi</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Hari Kalender</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {rpeData.totalCalendarDays} <span className="text-xs font-normal text-slate-500">Hari</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{rpeData.totalWeeks} Pekan Kalender</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-xs">
          <p className="text-xs font-semibold text-blue-700">Hari Efektif Sekolah (HES)</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {rpeData.totalSchoolDays} <span className="text-xs font-semibold text-blue-700">Hari</span>
          </p>
          <p className="text-[11px] text-blue-600 mt-0.5">Hari Sekolah Aktif</p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Hari Efektif Belajar (HEB)
          </p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">
            {rpeData.totalEffectiveTeachingDays} <span className="text-xs font-semibold text-emerald-700">Hari</span>
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">{rpeData.totalEffectiveWeeks} Pekan Efektif KBM</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <p className="text-xs font-semibold text-amber-800 flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5" /> Pertemuan PAI ({selectedDay})
          </p>
          <p className="text-2xl font-bold text-amber-950 mt-1">
            {rpeData.totalPAIScheduleDays} <span className="text-xs font-semibold text-amber-800">Tatap Muka</span>
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5">Total {rpeData.totalPAIScheduleDays * rpeData.jpPerWeek} JP Riil</p>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-900 text-white p-4 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Total JP Efektif
          </p>
          <p className="text-2xl font-bold text-white mt-1">
            {rpeData.totalEffectiveHours} <span className="text-xs font-normal text-slate-300">JP</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{rpeData.totalEffectiveWeeks} pek × {rpeData.jpPerWeek} JP</p>
        </div>
      </div>

      {/* Sub-Tabs View Switcher */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('table')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tabel RPE & Hari Efektif Lengkap</span>
          </button>

          <button
            onClick={() => setActiveSubTab('diagram')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'diagram'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Diagram & Monitor Bulan Berjalan</span>
          </button>

          <button
            onClick={() => setActiveSubTab('distribution')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'distribution'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Distribusi Alokasi Jam (JP)</span>
          </button>
        </div>

        {/* Quick Teaching Day Switcher */}
        {onUpdateTeachingDay && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-600">Jadwal Hari PAI:</span>
            <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
              {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as DayOfWeek[]).map(day => (
                <button
                  key={day}
                  onClick={() => onUpdateTeachingDay(day)}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                    selectedDay === day
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab 1: Comprehensive Day & Week Table */}
      {activeSubTab === 'table' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>I. Tabel Rekapitulasi Rincian Hari & Pekan Efektif per Bulan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Memetakan hari kalender, HES, HEB, distribusi hari Senin–Sabtu, serta jumlah pertemuan tatap muka PAI.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-lg">
                Semester {rpeData.semester === 1 ? 'I (Ganjil)' : 'II (Genap)'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[950px]">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300 text-center text-[11px]">
                  <tr>
                    <th rowSpan={2} className="px-3 py-2 border-r border-slate-200 w-10">No</th>
                    <th rowSpan={2} className="px-4 py-2 border-r border-slate-200 text-left w-36">Nama Bulan</th>
                    <th rowSpan={2} className="px-3 py-2 border-r border-slate-200">Hari Kalender</th>
                    <th rowSpan={2} className="px-3 py-2 border-r border-slate-200 text-rose-800 bg-rose-50/50">Hari Libur</th>
                    <th rowSpan={2} className="px-3 py-2 border-r border-slate-200 text-blue-800 bg-blue-50/50">HES (Sekolah)</th>
                    <th rowSpan={2} className="px-3 py-2 border-r border-slate-200 text-emerald-800 bg-emerald-50/70 font-bold">HEB (Belajar)</th>
                    <th colSpan={6} className="px-3 py-1.5 border-r border-slate-200 bg-slate-200/80 font-bold">
                      Rincian Hari Efektif Belajar (HEB)
                    </th>
                    <th colSpan={2} className="px-3 py-1.5 border-r border-slate-200 bg-emerald-100/60 font-bold text-emerald-950">
                      Pekan
                    </th>
                    <th rowSpan={2} className="px-3 py-2 border-r border-slate-200 text-amber-900 bg-amber-50 font-bold">
                      Pertemuan PAI ({selectedDay})
                    </th>
                    <th rowSpan={2} className="px-4 py-2 text-left min-w-[180px]">Agenda / Keterangan</th>
                  </tr>
                  <tr className="bg-slate-50 text-[10px]">
                    <th className="px-2 py-1 border-r border-slate-200">Sen</th>
                    <th className="px-2 py-1 border-r border-slate-200">Sel</th>
                    <th className="px-2 py-1 border-r border-slate-200">Rab</th>
                    <th className={`px-2 py-1 border-r border-slate-200 ${selectedDay === 'Kamis' ? 'bg-amber-100 font-bold text-amber-950' : ''}`}>Kam</th>
                    <th className="px-2 py-1 border-r border-slate-200">Jum</th>
                    <th className="px-2 py-1 border-r border-slate-200">Sab</th>
                    <th className="px-2 py-1 border-r border-slate-200 text-emerald-800 font-bold">Efektif</th>
                    <th className="px-2 py-1 border-r border-slate-200 text-rose-800">Tdk Efektif</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {rpeData.months.map((m, idx) => (
                    <tr key={m.monthIndex} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-3 text-center font-medium text-slate-500 border-r border-slate-100">{idx + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 border-r border-slate-100">
                        {m.monthName} {m.year}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-700 font-semibold border-r border-slate-100">
                        {m.calendarDaysCount}
                      </td>
                      <td className="px-3 py-3 text-center text-rose-700 bg-rose-50/30 border-r border-slate-100 font-semibold">
                        {m.holidaysCount + m.sundayHolidaysCount}
                      </td>
                      <td className="px-3 py-3 text-center text-blue-700 bg-blue-50/30 border-r border-slate-100 font-bold">
                        {m.schoolDaysCount}
                      </td>
                      <td className="px-3 py-3 text-center text-emerald-800 bg-emerald-50/60 font-bold border-r border-slate-100 text-sm">
                        {m.effectiveTeachingDaysCount}
                      </td>

                      {/* Day Breakdown Columns */}
                      <td className="px-2 py-3 text-center border-r border-slate-100 text-slate-700">
                        {m.dayBreakdown['Senin'].effective}
                      </td>
                      <td className="px-2 py-3 text-center border-r border-slate-100 text-slate-700">
                        {m.dayBreakdown['Selasa'].effective}
                      </td>
                      <td className="px-2 py-3 text-center border-r border-slate-100 text-slate-700">
                        {m.dayBreakdown['Rabu'].effective}
                      </td>
                      <td className={`px-2 py-3 text-center border-r border-slate-100 ${
                        selectedDay === 'Kamis' ? 'bg-amber-50 font-bold text-amber-950' : 'text-slate-700'
                      }`}>
                        {m.dayBreakdown['Kamis'].effective}
                      </td>
                      <td className="px-2 py-3 text-center border-r border-slate-100 text-slate-700">
                        {m.dayBreakdown['Jumat'].effective}
                      </td>
                      <td className="px-2 py-3 text-center border-r border-slate-100 text-slate-700">
                        {m.dayBreakdown['Sabtu'].effective}
                      </td>

                      {/* Weeks */}
                      <td className="px-2 py-3 text-center font-bold text-emerald-700 bg-emerald-50/30 border-r border-slate-100">
                        {m.effectiveWeeks}
                      </td>
                      <td className="px-2 py-3 text-center font-semibold text-rose-700 bg-rose-50/30 border-r border-slate-100">
                        {m.nonEffectiveWeeks}
                      </td>

                      {/* PAI Schedule Meetings */}
                      <td className="px-3 py-3 text-center font-bold text-amber-950 bg-amber-50/70 border-r border-slate-100">
                        {m.paiScheduleDaysCount} × ({m.paiScheduleDaysCount * rpeData.jpPerWeek} JP)
                      </td>

                      {/* Reasons */}
                      <td className="px-4 py-3 text-slate-600 text-[11px]">
                        {m.nonEffectiveReasons.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {m.nonEffectiveReasons.map((reason, i) => (
                              <span
                                key={i}
                                className="inline-block bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded border border-slate-200"
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-emerald-700 font-medium italic">KBM Efektif Penuh</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Summary Total Row */}
                  <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300 text-center">
                    <td colSpan={2} className="px-4 py-3 text-center">
                      JUMLAH TOTAL
                    </td>
                    <td className="px-3 py-3">{rpeData.totalCalendarDays} Hari</td>
                    <td className="px-3 py-3 text-rose-800 bg-rose-100/60">{rpeData.totalHolidays} Hari</td>
                    <td className="px-3 py-3 text-blue-800 bg-blue-100/60">{rpeData.totalSchoolDays} Hari</td>
                    <td className="px-3 py-3 text-emerald-800 bg-emerald-100 font-extrabold text-sm">
                      {rpeData.totalEffectiveTeachingDays} Hari
                    </td>
                    <td className="px-2 py-3">{rpeData.dayTotals['Senin'].effective}</td>
                    <td className="px-2 py-3">{rpeData.dayTotals['Selasa'].effective}</td>
                    <td className="px-2 py-3">{rpeData.dayTotals['Rabu'].effective}</td>
                    <td className="px-2 py-3 bg-amber-100/80 text-amber-950 font-extrabold">{rpeData.dayTotals['Kamis'].effective}</td>
                    <td className="px-2 py-3">{rpeData.dayTotals['Jumat'].effective}</td>
                    <td className="px-2 py-3">{rpeData.dayTotals['Sabtu'].effective}</td>
                    <td className="px-2 py-3 text-emerald-800 bg-emerald-100/80 font-bold">{rpeData.totalEffectiveWeeks} Pekan</td>
                    <td className="px-2 py-3 text-rose-800 bg-rose-100/80">{rpeData.totalNonEffectiveWeeks} Pekan</td>
                    <td className="px-3 py-3 text-amber-950 bg-amber-100 font-extrabold">
                      {rpeData.totalPAIScheduleDays} Pertemuan
                    </td>
                    <td className="px-4 py-3 text-left text-slate-500 italic text-[11px]">
                      Disinkronkan dengan Prota & Promes
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Month Monitoring Diagram Widget Preview */}
          <MonthMonitoringWidget
            months={rpeData.months}
            profile={profile}
            semester={rpeData.semester}
            jpPerWeek={rpeData.jpPerWeek}
            onUpdateTeachingDay={onUpdateTeachingDay}
          />
        </div>
      )}

      {/* Tab 2: Diagram & Monthly Monitor Only */}
      {activeSubTab === 'diagram' && (
        <div className="space-y-6">
          <MonthMonitoringWidget
            months={rpeData.months}
            profile={profile}
            semester={rpeData.semester}
            jpPerWeek={rpeData.jpPerWeek}
            onUpdateTeachingDay={onUpdateTeachingDay}
          />
        </div>
      )}

      {/* Tab 3: Distribution of JP */}
      {activeSubTab === 'distribution' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Distribusi Alokasi Waktu Jam Pelajaran (JP)</span>
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              Standar BSKAP 032/H/KR/2024 & Kemenag RI
            </span>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>1. Tatap Muka Pokok (KBM)</span>
                  <span className="text-emerald-700">~75%</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{rpeData.allocatedHours.kbmHours} JP</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Penyampaian materi capaian pembelajaran buku teks PAI & BP SD.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1">
                  <span>2. Asesmen Sumatif Lingkup Materi</span>
                  <span className="text-amber-700">~15%</span>
                </div>
                <p className="text-xl font-bold text-amber-950">{rpeData.allocatedHours.assessmentHours} JP</p>
                <p className="text-[11px] text-amber-800 mt-1">
                  Ulangan harian, penilaian unjuk kerja shalat/wudhu/tahfidz per bab.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 mb-1">
                  <span>3. Jam Cadangan & Pengayaan</span>
                  <span className="text-indigo-700">~10%</span>
                </div>
                <p className="text-xl font-bold text-indigo-950">{rpeData.allocatedHours.reserveHours} JP</p>
                <p className="text-[11px] text-indigo-800 mt-1">
                  Remedial, pendalaman materi, dan antisipasi kegiatan insidental sekolah.
                </p>
              </div>
            </div>

            {/* Mathematical Equation Card */}
            <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Info className="w-4 h-4" />
                <span>Rumus Perhitungan Alokasi Jam Efektif:</span>
              </div>
              <div className="font-mono bg-slate-800 p-3 rounded-lg border border-slate-700 text-slate-200">
                Total JP = {rpeData.totalEffectiveWeeks} Pekan Efektif × {rpeData.jpPerWeek} JP/Pekan = <span className="text-emerald-400 font-bold">{rpeData.totalEffectiveHours} JP</span>
                <br />
                {rpeData.totalEffectiveHours} JP = {rpeData.allocatedHours.kbmHours} JP (KBM) + {rpeData.allocatedHours.assessmentHours} JP (Asesmen) + {rpeData.allocatedHours.reserveHours} JP (Cadangan)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
