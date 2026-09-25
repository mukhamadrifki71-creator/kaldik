import React, { useState } from 'react';
import { RPEData, ProtaItem, PromesItem, SchoolProfile, SemesterType, DayOfWeek } from '../types';
import { exportPromesToWord, exportToCSV } from '../utils/exportDocs';
import { formatIndonesianDate } from '../utils/calculator';
import { 
  FileSpreadsheet, 
  Download, 
  FileText, 
  Printer, 
  Sparkles, 
  RefreshCw, 
  Info,
  CheckCircle2,
  Calendar,
  GraduationCap,
  CalendarCheck,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';

interface PromesViewProps {
  rpeData: RPEData;
  protaItems: ProtaItem[];
  promesItems: PromesItem[];
  profile: SchoolProfile;
  semester: SemesterType;
  onUpdateAllocation: (protaItemId: string, weekKey: string, hours: number) => void;
  onAutoDistribute: () => void;
  onOpenPrint: () => void;
  onUpdateTeachingDay?: (day: DayOfWeek) => void;
}

export const PromesView: React.FC<PromesViewProps> = ({
  rpeData,
  protaItems,
  promesItems,
  profile,
  semester,
  onUpdateAllocation,
  onAutoDistribute,
  onOpenPrint,
  onUpdateTeachingDay
}) => {
  const [activeCellEdit, setActiveCellEdit] = useState<{ protaId: string; key: string } | null>(null);
  const selectedDay: DayOfWeek = profile.teachingDays?.[0] || 'Kamis';

  const totalAllocated = promesItems.reduce((sum, item) => sum + item.allocatedHours, 0);

  const handleExportWord = () => {
    exportPromesToWord(profile, rpeData, promesItems);
  };

  const handleExportCSV = () => {
    // Build CSV headers with exact scheduled dates
    const weekHeaders: string[] = [];
    rpeData.months.forEach(m => {
      m.weeks.forEach(w => {
        const dateNote = w.scheduledTeachingDate ? ` (${w.scheduledTeachingDate})` : '';
        weekHeaders.push(`${m.monthName} M${w.weekNumber}${dateNote}`);
      });
    });

    const headers = ['No', 'Elemen', 'Materi / Capaian Pembelajaran', 'Alokasi JP', ...weekHeaders];

    const rows = promesItems.map((item, idx) => {
      const weekCols = rpeData.months.flatMap(m =>
        m.weeks.map(w => {
          const key = `${m.monthIndex}_${w.weekNumber}`;
          if (!w.isEffective) return 'Libur/Agenda';
          return item.allocations[key] || '';
        })
      );

      return [
        idx + 1,
        item.element,
        item.chapterTitle,
        item.allocatedHours,
        ...weekCols
      ];
    });

    exportToCSV(`PROMES_PAI_Kelas${profile.selectedGrade}_Sem${semester}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Program Semester (Promes)
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Semester {semester === 1 ? '1 (Ganjil)' : '2 (Genap)'} • TP {profile.academicYear}
            </span>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Jadwal: Setiap Hari {selectedDay}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1.5">
            Matriks Pemetaan Mingguan & Jadwal Harian Capaian Pembelajaran PAI
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Distribusi otomatis {rpeData.jpPerWeek} JP ke pekan & tanggal mengajar efektif ({rpeData.totalPAIScheduleDays} pertemuan riil di kalender).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAutoDistribute}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            title="Distribusi ulang jam secara otomatis ke pekan efektif"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Auto-Sinkronisasi Promes</span>
          </button>

          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ekspor Word (.doc)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
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

      {/* Teaching Day Configuration Strip & Legend */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {onUpdateTeachingDay && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                Hari Jadwal Mengajar:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as DayOfWeek[]).map(day => (
                  <button
                    key={day}
                    onClick={() => onUpdateTeachingDay(day)}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      selectedDay === day
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap border-l border-slate-200 pl-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-emerald-600 rounded-xs inline-block"></span>
              <span className="text-slate-600 font-medium">Pekan Efektif ({rpeData.jpPerWeek} JP)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-slate-300 rounded-xs inline-block"></span>
              <span className="text-slate-600 font-medium">Non-Efektif (Libur / Asesmen)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-lg border border-emerald-200">
            Total Alokasi Semester: {totalAllocated} JP
          </span>
          <span className="bg-amber-50 text-amber-900 font-bold px-3 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5 text-amber-700" />
            {rpeData.totalPAIScheduleDays} Hari Tatap Muka
          </span>
        </div>
      </div>

      {/* Milestone Info Card */}
      {rpeData.milestones && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-emerald-950">
                  Mulai Pengisian Belajar Aktif: {formatIndonesianDate(rpeData.milestones.activeLearningStartDate)}
                </span>
                <span className="bg-emerald-200/80 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Sesudah Libur & Masuk Awal Semester
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                {semester === 1 ? (
                  <>
                    Tanggal Masuk: <strong>{formatIndonesianDate(rpeData.milestones.schoolEntryDate)}</strong> • MPLS s.d.{' '}
                    <strong>{rpeData.milestones.orientationEndDate ? formatIndonesianDate(rpeData.milestones.orientationEndDate) : '-'}</strong>. Pekan sebelumnya terdata sebagai Libur Sekolah / MPLS (Non-Efektif).
                  </>
                ) : (
                  <>
                    Tanggal Masuk Semester Genap: <strong>{formatIndonesianDate(rpeData.milestones.schoolEntryDate)}</strong>. Pekan sebelumnya terdata sebagai Libur Semester 1 / Tahun Baru.
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-200 font-medium shrink-0 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kaldik Tervalidasi</span>
          </div>
        </div>
      )}

      {/* Promes Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[950px]">
            {/* Header Level 1: Month Names */}
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-center">
              <tr>
                <th rowSpan={3} className="px-2 py-2 border-r border-slate-200 w-8">No</th>
                <th rowSpan={3} className="px-3 py-2 border-r border-slate-200 w-28 text-left">Elemen CP</th>
                <th rowSpan={3} className="px-4 py-2 border-r border-slate-200 min-w-[200px] text-left">Materi Pokok & Tujuan Pembelajaran</th>
                <th rowSpan={3} className="px-2 py-2 border-r border-slate-200 w-14">Alokasi (JP)</th>
                {rpeData.months.map(m => (
                  <th
                    key={m.monthIndex}
                    colSpan={m.totalWeeks}
                    className="px-2 py-1.5 border-r border-slate-300 uppercase tracking-wider text-[11px] bg-slate-200/80"
                  >
                    {m.monthName}
                  </th>
                ))}
              </tr>
              {/* Header Level 2: Week Numbers */}
              <tr className="bg-slate-50 text-[10px]">
                {rpeData.months.flatMap(m =>
                  m.weeks.map(w => (
                    <th
                      key={`w_${m.monthIndex}_${w.weekNumber}`}
                      className={`px-1.5 py-0.5 border-r border-slate-200 text-center font-bold ${
                        !w.isEffective ? 'bg-slate-300 text-slate-700' : 'text-slate-800'
                      }`}
                      title={w.notes}
                    >
                      M{w.weekNumber}
                    </th>
                  ))
                )}
              </tr>
              {/* Header Level 3: Scheduled Dates */}
              <tr className="bg-emerald-950 text-emerald-200 text-[9px]">
                {rpeData.months.flatMap(m =>
                  m.weeks.map(w => (
                    <th
                      key={`date_${m.monthIndex}_${w.weekNumber}`}
                      className={`px-1 py-1 border-r border-emerald-900 text-center font-medium whitespace-nowrap ${
                        !w.isEffective ? 'bg-slate-700 text-slate-400' : 'text-amber-300'
                      }`}
                      title={`Estimasi tanggal ${selectedDay}: ${w.scheduledTeachingDate || '-'}`}
                    >
                      {w.scheduledTeachingDate ? w.scheduledTeachingDate.split(' ').slice(0, 2).join(' ') : '-'}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {promesItems.map((item, idx) => (
                <tr key={item.protaItemId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-2 py-2 text-center text-slate-500 font-medium border-r border-slate-100">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2 border-r border-slate-100 font-bold text-slate-800 text-[11px]">
                    {item.element}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-100">
                    <h4 className="font-bold text-slate-900 text-xs">{item.chapterTitle}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2" title={item.learningObjective}>
                      {item.learningObjective}
                    </p>
                  </td>
                  <td className="px-2 py-2 text-center font-bold text-emerald-800 bg-emerald-50/40 border-r border-slate-100">
                    {item.allocatedHours}
                  </td>

                  {/* Week Matrix Cells */}
                  {rpeData.months.flatMap(m =>
                    m.weeks.map(w => {
                      const cellKey = `${m.monthIndex}_${w.weekNumber}`;
                      const isEffective = w.isEffective;
                      const val = item.allocations[cellKey] || 0;
                      const isEditing = activeCellEdit?.protaId === item.protaItemId && activeCellEdit.key === cellKey;

                      if (!isEffective) {
                        return (
                          <td
                            key={cellKey}
                            className="px-1 py-1 text-center bg-slate-200 border-r border-slate-200 text-slate-500 text-[10px]"
                            title={`Pekan Tidak Efektif: ${w.notes || 'Libur/Kegiatan Sekolah'}`}
                          >
                            <span className="select-none">-</span>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={cellKey}
                          onClick={() => setActiveCellEdit({ protaId: item.protaItemId, key: cellKey })}
                          className={`px-1 py-1 text-center border-r border-slate-100 cursor-pointer transition-colors ${
                            val > 0 ? 'bg-emerald-100 text-emerald-950 font-bold' : 'hover:bg-slate-100 text-slate-300'
                          }`}
                          title={`Klik untuk mengubah JP (${m.monthName} Minggu ${w.weekNumber} - ${w.scheduledTeachingDate || ''})`}
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              max={8}
                              autoFocus
                              defaultValue={val || ''}
                              onBlur={(e) => {
                                onUpdateAllocation(item.protaItemId, cellKey, Number(e.target.value) || 0);
                                setActiveCellEdit(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  onUpdateAllocation(item.protaItemId, cellKey, Number((e.target as HTMLInputElement).value) || 0);
                                  setActiveCellEdit(null);
                                }
                              }}
                              className="w-7 text-center text-xs font-bold bg-white border border-emerald-500 rounded focus:outline-none"
                            />
                          ) : (
                            <span>{val > 0 ? val : ''}</span>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}

              {/* Bottom Weekly Total Sum Row */}
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300 text-center">
                <td colSpan={3} className="px-4 py-2.5 text-right border-r border-slate-200">
                  TOTAL JP PER PEKAN:
                </td>
                <td className="px-2 py-2.5 border-r border-slate-200 text-emerald-800 bg-emerald-100 font-extrabold">
                  {totalAllocated}
                </td>
                {rpeData.months.flatMap(m =>
                  m.weeks.map(w => {
                    const cellKey = `${m.monthIndex}_${w.weekNumber}`;
                    if (!w.isEffective) {
                      return (
                        <td key={cellKey} className="bg-slate-300 border-r border-slate-200 text-slate-500 text-[10px]">
                          -
                        </td>
                      );
                    }

                    const weekSum = promesItems.reduce((sum, it) => sum + (it.allocations[cellKey] || 0), 0);

                    return (
                      <td
                        key={cellKey}
                        className={`px-1 py-2 border-r border-slate-200 text-xs font-bold ${
                          weekSum === rpeData.jpPerWeek
                            ? 'text-emerald-800 bg-emerald-50'
                            : weekSum > rpeData.jpPerWeek
                            ? 'text-rose-700 bg-rose-50'
                            : weekSum > 0
                            ? 'text-amber-700 bg-amber-50'
                            : 'text-slate-400'
                        }`}
                        title={`Total JP pekan ini: ${weekSum} (Target standar: ${rpeData.jpPerWeek} JP)`}
                      >
                        {weekSum > 0 ? weekSum : ''}
                      </td>
                    );
                  })
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
