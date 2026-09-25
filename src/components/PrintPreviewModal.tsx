import React, { useState } from 'react';
import { SchoolProfile, RPEData, ProtaItem, PromesItem, DayOfWeek } from '../types';
import { exportRPEToWord, exportProtaToWord, exportPromesToWord } from '../utils/exportDocs';
import { 
  Printer, 
  Download, 
  FileText, 
  X, 
  BookOpen, 
  FileSpreadsheet, 
  Calendar,
  School,
  CheckCircle2,
  CalendarCheck,
  GraduationCap
} from 'lucide-react';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  rpeData: RPEData;
  protaItems: ProtaItem[];
  promesItems: PromesItem[];
  defaultDocType?: 'rpe' | 'prota' | 'promes';
  onChangePrintGrade?: (grade: number) => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  profile,
  rpeData,
  protaItems,
  promesItems,
  defaultDocType = 'rpe',
  onChangePrintGrade
}) => {
  const [docType, setDocType] = useState<'rpe' | 'prota' | 'promes'>(defaultDocType);
  const selectedDay: DayOfWeek = profile.teachingDays?.[0] || 'Kamis';

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    if (docType === 'rpe') {
      exportRPEToWord(profile, rpeData);
    } else if (docType === 'prota') {
      exportProtaToWord(profile, protaItems);
    } else if (docType === 'promes') {
      exportPromesToWord(profile, rpeData, promesItems);
    }
  };

  const currentDateFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const totalProtaJP = protaItems.reduce((acc, item) => acc + item.allocatedHours, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Header (Hidden on Print) */}
        <div className="bg-emerald-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <School className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-sm">Pratinjau Cetak Dokumen Administrasi Kurikulum</h3>
              <p className="text-[11px] text-emerald-300">Format Resmi Dinas Pendidikan Kota Pasuruan</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadWord}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-emerald-700"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang (Ctrl+P)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Type Selector (Hidden on Print) */}
        <div className="flex items-center justify-between bg-slate-100 px-6 py-2 border-b border-slate-200 gap-2 print:hidden overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDocType('rpe')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                docType === 'rpe' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>1. RPE (Rincian Hari & Pekan)</span>
            </button>

            <button
              onClick={() => setDocType('prota')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                docType === 'prota' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>2. Program Tahunan (Prota)</span>
            </button>

            <button
              onClick={() => setDocType('promes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                docType === 'promes' ? 'bg-white text-emerald-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>3. Program Semester (Promes)</span>
            </button>
          </div>

          {onChangePrintGrade && (
            <div className="flex items-center space-x-1.5 shrink-0 pl-2">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-xs text-slate-600 font-semibold">Cetak Kelas:</span>
              <select
                value={profile.selectedGrade}
                onChange={(e) => onChangePrintGrade(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
              >
                {[1, 2, 3, 4, 5, 6].map(g => (
                  <option key={g} value={g}>Kelas {g} SD</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Printable Paper Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-200/50 print:p-0 print:bg-white print:overflow-visible font-serif">
          <div className="bg-white p-8 sm:p-12 max-w-4xl mx-auto shadow-md print:shadow-none print:p-0 border border-slate-200 print:border-none min-h-[297mm]">
            {/* KOP SURAT RESMI */}
            <div className="text-center border-b-4 border-double border-slate-900 pb-3 mb-6">
              <h3 className="text-sm font-bold tracking-wider uppercase m-0 leading-tight">
                PEMERINTAH KOTA PASURUAN
              </h3>
              <h2 className="text-base font-extrabold tracking-wider uppercase m-0 leading-tight">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h2>
              <h1 className="text-lg font-black tracking-wide uppercase m-0 leading-tight text-slate-900">
                UPT SATUAN PENDIDIKAN SDN POHJENTREK II
              </h1>
              <p className="text-[10px] italic text-slate-700 m-0 mt-1">
                {profile.address} • NPSN: {profile.npsn}
              </p>
            </div>

            {/* DOCUMENT TITLE */}
            <div className="text-center mb-6">
              <h2 className="text-base font-bold uppercase underline tracking-wide">
                {docType === 'rpe' && 'RINCIAN HARI & PEKAN EFEKTIF (RPE)'}
                {docType === 'prota' && 'PROGRAM TAHUNAN (PROTA)'}
                {docType === 'promes' && 'PROGRAM SEMESTER (PROMES)'}
              </h2>
              <p className="text-xs font-bold mt-1">
                {docType === 'prota' ? 'TAHUN PELAJARAN ' + profile.academicYear : `SEMESTER ${rpeData.semester === 1 ? 'GANJIL' : 'GENAP'} TAHUN PELAJARAN ${profile.academicYear}`}
              </p>
              <p className="text-[11px] text-slate-800 mt-0.5">
                Mata Pelajaran: Pendidikan Agama Islam & Budi Pekerti | Kelas: {profile.selectedGrade} SD
              </p>
            </div>

            {/* CONTENT: RPE */}
            {docType === 'rpe' && (
              <div className="space-y-6 text-xs text-slate-900 leading-relaxed">
                <div>
                  <h4 className="font-bold text-xs mb-2 uppercase">I. REKAPITULASI JUMLAH HARI & PEKAN EFEKTIF PER BULAN</h4>
                  <table className="w-full border-collapse border border-slate-900 text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-center font-bold text-[10.5px]">
                        <th rowSpan={2} className="border border-slate-900 p-1 w-8">No</th>
                        <th rowSpan={2} className="border border-slate-900 p-1">Nama Bulan</th>
                        <th rowSpan={2} className="border border-slate-900 p-1 w-14">Hari Kalender</th>
                        <th rowSpan={2} className="border border-slate-900 p-1 w-12">Hari Libur</th>
                        <th rowSpan={2} className="border border-slate-900 p-1 w-12">HES (Sekolah)</th>
                        <th rowSpan={2} className="border border-slate-900 p-1 w-12 bg-slate-200">HEB (KBM)</th>
                        <th colSpan={6} className="border border-slate-900 p-1 bg-slate-200/70">Rincian Hari Efektif Belajar</th>
                        <th colSpan={2} className="border border-slate-900 p-1">Pekan</th>
                        <th rowSpan={2} className="border border-slate-900 p-1 w-14">Tatap Muka ({selectedDay})</th>
                        <th rowSpan={2} className="border border-slate-900 p-1">Keterangan</th>
                      </tr>
                      <tr className="bg-slate-50 text-[9.5px]">
                        <th className="border border-slate-900 p-0.5">Sen</th>
                        <th className="border border-slate-900 p-0.5">Sel</th>
                        <th className="border border-slate-900 p-0.5">Rab</th>
                        <th className="border border-slate-900 p-0.5">Kam</th>
                        <th className="border border-slate-900 p-0.5">Jum</th>
                        <th className="border border-slate-900 p-0.5">Sab</th>
                        <th className="border border-slate-900 p-0.5">Efektif</th>
                        <th className="border border-slate-900 p-0.5">Tdk Efktf</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rpeData.months.map((m, idx) => (
                        <tr key={m.monthIndex} className="text-center text-[10px]">
                          <td className="border border-slate-900 p-1.5">{idx + 1}</td>
                          <td className="border border-slate-900 p-1.5 font-semibold text-left">{m.monthName} {m.year}</td>
                          <td className="border border-slate-900 p-1.5">{m.calendarDaysCount}</td>
                          <td className="border border-slate-900 p-1.5">{m.holidaysCount + m.sundayHolidaysCount}</td>
                          <td className="border border-slate-900 p-1.5">{m.schoolDaysCount}</td>
                          <td className="border border-slate-900 p-1.5 font-bold bg-slate-100">{m.effectiveTeachingDaysCount}</td>
                          <td className="border border-slate-900 p-1">{m.dayBreakdown['Senin'].effective}</td>
                          <td className="border border-slate-900 p-1">{m.dayBreakdown['Selasa'].effective}</td>
                          <td className="border border-slate-900 p-1">{m.dayBreakdown['Rabu'].effective}</td>
                          <td className="border border-slate-900 p-1 font-semibold">{m.dayBreakdown['Kamis'].effective}</td>
                          <td className="border border-slate-900 p-1">{m.dayBreakdown['Jumat'].effective}</td>
                          <td className="border border-slate-900 p-1">{m.dayBreakdown['Sabtu'].effective}</td>
                          <td className="border border-slate-900 p-1.5 font-bold">{m.effectiveWeeks}</td>
                          <td className="border border-slate-900 p-1.5">{m.nonEffectiveWeeks}</td>
                          <td className="border border-slate-900 p-1.5 font-bold">{m.paiScheduleDaysCount}</td>
                          <td className="border border-slate-900 p-1.5 text-left text-[9px]">
                            {m.nonEffectiveReasons.length > 0 ? m.nonEffectiveReasons.join(', ') : 'KBM Efektif'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-bold text-center text-[10px]">
                        <td colSpan={2} className="border border-slate-900 p-1.5">JUMLAH TOTAL</td>
                        <td className="border border-slate-900 p-1.5">{rpeData.totalCalendarDays}</td>
                        <td className="border border-slate-900 p-1.5">{rpeData.totalHolidays}</td>
                        <td className="border border-slate-900 p-1.5">{rpeData.totalSchoolDays}</td>
                        <td className="border border-slate-900 p-1.5 bg-slate-200">{rpeData.totalEffectiveTeachingDays}</td>
                        <td className="border border-slate-900 p-1">{rpeData.dayTotals['Senin'].effective}</td>
                        <td className="border border-slate-900 p-1">{rpeData.dayTotals['Selasa'].effective}</td>
                        <td className="border border-slate-900 p-1">{rpeData.dayTotals['Rabu'].effective}</td>
                        <td className="border border-slate-900 p-1">{rpeData.dayTotals['Kamis'].effective}</td>
                        <td className="border border-slate-900 p-1">{rpeData.dayTotals['Jumat'].effective}</td>
                        <td className="border border-slate-900 p-1">{rpeData.dayTotals['Sabtu'].effective}</td>
                        <td className="border border-slate-900 p-1.5">{rpeData.totalEffectiveWeeks}</td>
                        <td className="border border-slate-900 p-1.5">{rpeData.totalNonEffectiveWeeks}</td>
                        <td className="border border-slate-900 p-1.5">{rpeData.totalPAIScheduleDays}</td>
                        <td className="border border-slate-900 p-1.5">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold text-xs mb-2 uppercase">II. DISTRIBUSI ALOKASI WAKTU JAM PELAJARAN (JP)</h4>
                  <table className="w-full max-w-lg border-collapse border border-slate-900 text-xs">
                    <tbody>
                      <tr>
                        <td className="border border-slate-900 p-2 w-2/3">1. Jumlah Pekan Efektif Semester {rpeData.semester}</td>
                        <td className="border border-slate-900 p-2 font-bold">= {rpeData.totalEffectiveWeeks} Pekan</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-900 p-2">2. Alokasi Waktu per Pekan (PAI & BP)</td>
                        <td className="border border-slate-900 p-2 font-bold">= {rpeData.jpPerWeek} Jam Pelajaran (JP)</td>
                      </tr>
                      <tr className="bg-slate-100 font-bold">
                        <td className="border border-slate-900 p-2">3. Jumlah Jam Pelajaran Efektif ({rpeData.totalEffectiveWeeks} x {rpeData.jpPerWeek} JP)</td>
                        <td className="border border-slate-900 p-2">= {rpeData.totalEffectiveHours} JP</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-900 p-2 pl-6">a. Kegiatan Pembelajaran Pokok (Tatap Muka)</td>
                        <td className="border border-slate-900 p-2">= {rpeData.allocatedHours.kbmHours} JP</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-900 p-2 pl-6">b. Asesmen Sumatif Lingkup Materi / Ulangan</td>
                        <td className="border border-slate-900 p-2">= {rpeData.allocatedHours.assessmentHours} JP</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-900 p-2 pl-6">c. Jam Cadangan / Remedial / Pengayaan</td>
                        <td className="border border-slate-900 p-2">= {rpeData.allocatedHours.reserveHours} JP</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CONTENT: PROTA */}
            {docType === 'prota' && (
              <div className="space-y-4 text-xs text-slate-900">
                <table className="w-full border-collapse border border-slate-900 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-center font-bold">
                      <th className="border border-slate-900 p-2 w-8">No</th>
                      <th className="border border-slate-900 p-2 w-16">Semester</th>
                      <th className="border border-slate-900 p-2 w-24">Hari & Pertemuan</th>
                      <th className="border border-slate-900 p-2 w-28">Elemen CP</th>
                      <th className="border border-slate-900 p-2">Bab / Alur Tujuan Pembelajaran (ATP)</th>
                      <th className="border border-slate-900 p-2 w-16">Alokasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {protaItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="border border-slate-900 p-2 text-center">{idx + 1}</td>
                        <td className="border border-slate-900 p-2 text-center font-semibold">
                          {item.semester === 1 ? 'I (Ganjil)' : 'II (Genap)'}
                        </td>
                        <td className="border border-slate-900 p-2 text-center font-bold">
                          Hari {item.teachingDay || profile.teachingDays?.[0] || 'Kamis'}
                          <div className="text-[10px] font-normal text-slate-600">
                            {item.numberOfMeetings || Math.ceil(item.allocatedHours / (profile.jpPerWeek || 4))} Pertemuan
                          </div>
                        </td>
                        <td className="border border-slate-900 p-2 font-bold">{item.element}</td>
                        <td className="border border-slate-900 p-2">
                          <strong>Bab {item.chapterNumber}: {item.chapterTitle}</strong>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-[10.5px]">
                            {item.learningObjectives.map((tp, i) => (
                              <li key={i}>{tp}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="border border-slate-900 p-2 text-center font-bold">{item.allocatedHours} JP</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={5} className="border border-slate-900 p-2 text-center">
                        TOTAL ALOKASI WAKTU SATU TAHUN PELAJARAN
                      </td>
                      <td className="border border-slate-900 p-2 text-center">{totalProtaJP} JP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* CONTENT: PROMES */}
            {docType === 'promes' && (
              <div className="space-y-4 text-xs text-slate-900">
                <table className="w-full border-collapse border border-slate-900 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-center font-bold">
                      <th rowSpan={2} className="border border-slate-900 p-1 w-6">No</th>
                      <th rowSpan={2} className="border border-slate-900 p-1 w-24">Elemen</th>
                      <th rowSpan={2} className="border border-slate-900 p-1 text-left">Materi Pokok & TP</th>
                      <th rowSpan={2} className="border border-slate-900 p-1 w-10">JP</th>
                      {rpeData.months.map(m => (
                        <th key={m.monthIndex} colSpan={m.totalWeeks} className="border border-slate-900 p-1 text-[10px]">
                          {m.monthName.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                    <tr className="bg-slate-50 text-[9px]">
                      {rpeData.months.flatMap(m =>
                        m.weeks.map(w => (
                          <th
                            key={`${m.monthIndex}_${w.weekNumber}`}
                            className={`border border-slate-900 p-0.5 ${!w.isEffective ? 'bg-slate-300' : ''}`}
                          >
                            {w.weekNumber}
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {promesItems.map((item, idx) => (
                      <tr key={item.protaItemId}>
                        <td className="border border-slate-900 p-1 text-center">{idx + 1}</td>
                        <td className="border border-slate-900 p-1 font-semibold text-[10px]">{item.element}</td>
                        <td className="border border-slate-900 p-1 text-[10px]">
                          <strong>{item.chapterTitle}</strong>
                        </td>
                        <td className="border border-slate-900 p-1 text-center font-bold">{item.allocatedHours}</td>
                        {rpeData.months.flatMap(m =>
                          m.weeks.map(w => {
                            const key = `${m.monthIndex}_${w.weekNumber}`;
                            const val = item.allocations[key];
                            if (!w.isEffective) {
                              return (
                                <td key={key} className="border border-slate-900 p-0.5 text-center bg-slate-200 text-slate-400 text-[8px]">
                                  -
                                </td>
                              );
                            }
                            return (
                              <td key={key} className="border border-slate-900 p-0.5 text-center font-bold text-[9px]">
                                {val || ''}
                              </td>
                            );
                          })
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SIGNATURE SECTION */}
            <div className="mt-12 text-xs pt-4">
              <div className="flex justify-between items-start">
                <div className="text-left w-1/2">
                  <p className="m-0">Mengetahui,</p>
                  <p className="m-0 font-bold">{profile.headmasterTitle}</p>
                  <div className="h-16"></div>
                  <p className="m-0 font-bold underline">{profile.headmasterName}</p>
                  <p className="m-0">NIP. {profile.headmasterNip}</p>
                </div>

                <div className="text-right w-1/2">
                  <p className="m-0">{profile.cityDateLocation}, {currentDateFormatted}</p>
                  <p className="m-0 font-bold">{profile.teacherTitle}</p>
                  <div className="h-16"></div>
                  <p className="m-0 font-bold underline">{profile.teacherName}</p>
                  <p className="m-0">NIP. {profile.teacherNip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
