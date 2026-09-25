import React, { useState } from 'react';
import { MonthEffectiveDetail, DayDetail, DayOfWeek, SchoolProfile } from '../types';
import { formatIndonesianDate } from '../utils/calculator';
import { 
  Calendar as CalendarIcon, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Info,
  CalendarCheck,
  GraduationCap,
  ChevronRight,
  Flame,
  Layers,
  ChevronLeft
} from 'lucide-react';

interface MonthMonitoringWidgetProps {
  months: MonthEffectiveDetail[];
  profile: SchoolProfile;
  semester: number;
  jpPerWeek: number;
  onUpdateTeachingDay?: (day: DayOfWeek) => void;
}

const DAY_LABELS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export const MonthMonitoringWidget: React.FC<MonthMonitoringWidgetProps> = ({
  months,
  profile,
  semester,
  jpPerWeek,
  onUpdateTeachingDay
}) => {
  // Find current active month index or default to first month in list
  const currentJsMonth = new Date().getMonth(); // 0 to 11
  const initialMonthIdx = months.findIndex(m => m.monthIndex === currentJsMonth);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(
    initialMonthIdx !== -1 ? initialMonthIdx : 0
  );

  const [selectedDateDetail, setSelectedDateDetail] = useState<DayDetail | null>(null);

  const activeMonth = months[selectedMonthIndex] || months[0];

  if (!activeMonth) return null;

  // Selected teaching day (e.g. 'Kamis')
  const primaryTeachingDay: DayOfWeek = profile.teachingDays?.[0] || 'Kamis';

  // Calculate day-level percentages for the chart
  const totalDays = activeMonth.calendarDaysCount;
  const hebPct = Math.round((activeMonth.effectiveTeachingDaysCount / totalDays) * 100);
  const holidayPct = Math.round((activeMonth.holidaysCount / totalDays) * 100);
  const assessmentPct = Math.round((activeMonth.assessmentDaysCount / totalDays) * 100);
  const schoolEventPct = Math.round((activeMonth.schoolEventDaysCount / totalDays) * 100);
  const weekendPct = Math.round((activeMonth.sundayHolidaysCount / totalDays) * 100);

  // Month days starting offset (1st day of month dayOfWeek index)
  const firstDay = activeMonth.days[0];
  // Convert Sunday (0) to 7th position for standard Indonesian Monday-start calendar
  const firstDayOffset = firstDay ? (firstDay.dayOfWeekIndex === 0 ? 6 : firstDay.dayOfWeekIndex - 1) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header with Month Switcher */}
      <div className="bg-slate-900 text-white p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Monitoring Jadwal & Hari Efektif
            </span>
            <span className="text-xs text-slate-300">
              Semester {semester === 1 ? '1 (Ganjil)' : '2 (Genap)'} • TP {profile.academicYear}
            </span>
          </div>
          <h3 className="text-lg font-bold mt-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Diagram Distribusi Hari & Jadwal Mengajar Bulan {activeMonth.monthName} {activeMonth.year}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis hari efektif belajar (HEB), hari efektif sekolah (HES), dan monitoring tatap muka PAI.
          </p>
        </div>

        {/* Month Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto max-w-full">
          {months.map((m, idx) => (
            <button
              key={m.monthIndex}
              onClick={() => {
                setSelectedMonthIndex(idx);
                setSelectedDateDetail(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedMonthIndex === idx
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {m.monthName}
            </button>
          ))}
        </div>
      </div>

      {/* Teaching Day Config & Highlights Banner */}
      <div className="bg-emerald-50/70 px-6 py-3 border-b border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            Hari Jadwal Mengajar PAI:
          </span>
          {onUpdateTeachingDay ? (
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-emerald-200 shadow-2xs">
              {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as DayOfWeek[]).map((day) => (
                <button
                  key={day}
                  onClick={() => onUpdateTeachingDay(day)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    primaryTeachingDay === day
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          ) : (
            <span className="bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-md">
              Setiap Hari {primaryTeachingDay}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
            <CalendarCheck className="w-4 h-4 text-emerald-700" />
            <span>Pertemuan PAI Bulan {activeMonth.monthName}: </span>
            <span className="font-bold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded">
              {activeMonth.paiScheduleDaysCount} Pertemuan ({activeMonth.paiScheduleDaysCount * jpPerWeek} JP)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Diagram & Stats, Right Interactive Mini Calendar */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Diagram & Day Metrics (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* KPI Mini Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">Hari Kalender</span>
              <span className="text-xl font-bold text-slate-900">{activeMonth.calendarDaysCount}</span>
              <span className="text-[10px] text-slate-400 ml-1">Hari</span>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-[11px] font-semibold text-emerald-700 block">Hari Efektif KBM (HEB)</span>
              <span className="text-xl font-bold text-emerald-900">{activeMonth.effectiveTeachingDaysCount}</span>
              <span className="text-[10px] text-emerald-700 ml-1">Hari ({hebPct}%)</span>
            </div>

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
              <span className="text-[11px] font-semibold text-blue-700 block">Hari Efektif Sekolah (HES)</span>
              <span className="text-xl font-bold text-blue-900">{activeMonth.schoolDaysCount}</span>
              <span className="text-[10px] text-blue-700 ml-1">Hari</span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <span className="text-[11px] font-semibold text-amber-800 block">Pekan Efektif</span>
              <span className="text-xl font-bold text-amber-950">{activeMonth.effectiveWeeks}</span>
              <span className="text-[10px] text-amber-800 ml-1">/ {activeMonth.totalWeeks} Pekan</span>
            </div>
          </div>

          {/* Diagram 1: Proporsi Komposisi Hari dalam Bulan (Stacked Bar Chart) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                Diagram Proporsi Distribusi Hari ({activeMonth.calendarDaysCount} Hari)
              </span>
              <span className="text-slate-500 font-semibold">100% Kalender</span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-5 w-full bg-slate-200 rounded-lg overflow-hidden flex shadow-inner">
              {activeMonth.effectiveTeachingDaysCount > 0 && (
                <div
                  style={{ width: `${hebPct}%` }}
                  className="bg-emerald-600 hover:bg-emerald-500 transition-all"
                  title={`KBM Efektif: ${activeMonth.effectiveTeachingDaysCount} hari (${hebPct}%)`}
                />
              )}
              {activeMonth.assessmentDaysCount > 0 && (
                <div
                  style={{ width: `${assessmentPct}%` }}
                  className="bg-amber-500 hover:bg-amber-400 transition-all"
                  title={`Asesmen (STS/SAS): ${activeMonth.assessmentDaysCount} hari (${assessmentPct}%)`}
                />
              )}
              {activeMonth.schoolEventDaysCount > 0 && (
                <div
                  style={{ width: `${schoolEventPct}%` }}
                  className="bg-blue-500 hover:bg-blue-400 transition-all"
                  title={`Kegiatan Sekolah: ${activeMonth.schoolEventDaysCount} hari (${schoolEventPct}%)`}
                />
              )}
              {activeMonth.holidaysCount > 0 && (
                <div
                  style={{ width: `${holidayPct}%` }}
                  className="bg-rose-500 hover:bg-rose-400 transition-all"
                  title={`Hari Libur: ${activeMonth.holidaysCount} hari (${holidayPct}%)`}
                />
              )}
              {activeMonth.sundayHolidaysCount > 0 && (
                <div
                  style={{ width: `${weekendPct}%` }}
                  className="bg-slate-400 hover:bg-slate-300 transition-all"
                  title={`Libur Akhir Pekan: ${activeMonth.sundayHolidaysCount} hari (${weekendPct}%)`}
                />
              )}
            </div>

            {/* Legend for Stacked Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-600 shrink-0"></span>
                <span className="text-slate-700">KBM Efektif: <strong>{activeMonth.effectiveTeachingDaysCount} hari</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-500 shrink-0"></span>
                <span className="text-slate-700">Asesmen: <strong>{activeMonth.assessmentDaysCount} hari</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-500 shrink-0"></span>
                <span className="text-slate-700">Kegiatan: <strong>{activeMonth.schoolEventDaysCount} hari</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-rose-500 shrink-0"></span>
                <span className="text-slate-700">Libur Nasional/Agama: <strong>{activeMonth.holidaysCount} hari</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-400 shrink-0"></span>
                <span className="text-slate-700">Libur Akhir Pekan: <strong>{activeMonth.sundayHolidaysCount} hari</strong></span>
              </div>
            </div>
          </div>

          {/* Diagram 2: Rekapitulasi Efektif per Hari dalam Seminggu (Senin - Sabtu) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Grafik Perbandingan Hari Efektif dalam Sepekan:
              </span>
              <span className="text-[11px] text-slate-500 italic">
                *Hari dengan tanda ⭐ adalah jadwal mengajar Anda
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as DayOfWeek[]).map((dayName) => {
                const breakdown = activeMonth.dayBreakdown[dayName] || { total: 4, effective: 4 };
                const isSelectedSchedule = dayName === primaryTeachingDay;
                const ratio = breakdown.total > 0 ? (breakdown.effective / breakdown.total) * 100 : 0;

                return (
                  <div
                    key={dayName}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelectedSchedule
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      <span className={`text-xs font-bold ${isSelectedSchedule ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {dayName}
                      </span>
                      {isSelectedSchedule && <span className="text-amber-500 text-xs">⭐</span>}
                    </div>

                    <div className="my-1.5">
                      <div className="h-10 bg-slate-100 rounded-md flex flex-col justify-end p-0.5 overflow-hidden">
                        <div
                          style={{ height: `${ratio}%` }}
                          className={`w-full rounded-xs transition-all ${
                            ratio === 100
                              ? 'bg-emerald-600'
                              : ratio >= 75
                              ? 'bg-emerald-500'
                              : ratio > 0
                              ? 'bg-amber-500'
                              : 'bg-rose-400'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="text-[10px] space-y-0.5 leading-tight">
                      <p className="font-bold text-slate-900">
                        {breakdown.effective} / {breakdown.total} <span className="text-slate-500 font-normal">hari</span>
                      </p>
                      {isSelectedSchedule && (
                        <span className="inline-block bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                          {breakdown.effective * jpPerWeek} JP
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Monthly Interactive Calendar Grid (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-emerald-700" />
                  Kalender Hari Bulan {activeMonth.monthName} {activeMonth.year}
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                  Klik tanggal untuk detail
                </span>
              </div>

              {/* Calendar Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-600 mb-1">
                <div className="text-slate-700">Sen</div>
                <div className="text-slate-700">Sel</div>
                <div className="text-slate-700">Rab</div>
                <div className="text-emerald-800 bg-emerald-100/50 rounded py-0.5">Kam</div>
                <div className="text-slate-700">Jum</div>
                <div className="text-slate-700">Sab</div>
                <div className="text-rose-700 font-extrabold">Min</div>
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Empty cells before month start */}
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9 rounded-lg bg-transparent" />
                ))}

                {/* Actual Month Days */}
                {activeMonth.days.map((day) => {
                  const isSelected = selectedDateDetail?.dateString === day.dateString;
                  const isTeachingDay = day.dayOfWeek === primaryTeachingDay;

                  // Status badge styling
                  let dayBgClass = 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200';
                  let badgeDotClass = 'bg-emerald-500';

                  if (day.status === 'libur_mingguan') {
                    dayBgClass = 'bg-slate-100 text-slate-400 border-transparent';
                    badgeDotClass = 'bg-slate-400';
                  } else if (day.status === 'libur_nasional' || day.status === 'libur_keagamaan' || day.status === 'libur_semester') {
                    dayBgClass = 'bg-rose-50 text-rose-800 border-rose-200';
                    badgeDotClass = 'bg-rose-500';
                  } else if (day.status === 'asesmen') {
                    dayBgClass = 'bg-amber-50 text-amber-900 border-amber-200';
                    badgeDotClass = 'bg-amber-500';
                  } else if (day.status === 'kegiatan_sekolah') {
                    dayBgClass = 'bg-blue-50 text-blue-900 border-blue-200';
                    badgeDotClass = 'bg-blue-500';
                  } else if (isTeachingDay && day.isEffectiveTeachingDay) {
                    dayBgClass = 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold';
                    badgeDotClass = 'bg-emerald-600';
                  }

                  return (
                    <button
                      key={day.dateString}
                      onClick={() => setSelectedDateDetail(day)}
                      className={`h-9 rounded-lg border text-xs flex flex-col items-center justify-center relative transition-all ${dayBgClass} ${
                        isSelected ? 'ring-2 ring-slate-900 shadow-xs' : ''
                      } ${day.isCurrentDay ? 'border-2 border-emerald-600 font-extrabold' : ''}`}
                    >
                      <span>{day.dayNumber}</span>
                      
                      {/* Sub-indicators */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {isTeachingDay && day.isEffectiveTeachingDay && (
                          <span className="text-[8px] leading-none text-emerald-700 font-bold">★</span>
                        )}
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeDotClass}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Detail Info Box */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              {selectedDateDetail ? (
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {selectedDateDetail.dayOfWeek}, {formatIndonesianDate(selectedDateDetail.dateString)}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedDateDetail.isEffectiveTeachingDay
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedDateDetail.isEffectiveTeachingDay ? 'KBM Efektif' : 'Non-Efektif'}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px]">
                    <strong>Status:</strong> {selectedDateDetail.statusLabel}
                  </p>

                  {selectedDateDetail.dayOfWeek === primaryTeachingDay && (
                    <p className="text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {selectedDateDetail.isEffectiveTeachingDay
                        ? `Jadwal Tatap Muka PAI Kelas ${profile.selectedGrade} (${jpPerWeek} JP)`
                        : 'Jadwal tatap muka PAI ditiadakan karena agenda/libur.'}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-2.5 bg-white/70 rounded-lg border border-dashed border-slate-300 text-center text-xs text-slate-500">
                  Pilih salah satu tanggal pada kalender untuk melihat status kegiatan & tatap muka.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
