import {
  KaldikEvent,
  MonthEffectiveDetail,
  MonthWeekDetail,
  DayDetail,
  DayOfWeek,
  DayStatus,
  RPEData,
  SemesterType,
  ProtaItem,
  PromesItem,
  SchoolProfile,
  SemesterMilestones
} from '../types';

const MONTH_NAMES_SEM1 = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const MONTH_NAMES_SEM2 = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

export const DAY_NAMES: DayOfWeek[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const SCHOOL_DAYS: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Helper to parse date string YYYY-MM-DD
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatIndonesianDate(dateStr: string): string {
  const d = parseDate(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(d);
}

// Checks if two date ranges overlap
export function isDateOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return start1 <= end2 && end1 >= start2;
}

// Check if a single date falls within an event
export function getEventForDate(date: Date, events: KaldikEvent[]): KaldikEvent | undefined {
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return events.find(event => {
    const evStart = parseDate(event.startDate);
    const evEnd = parseDate(event.endDate);
    const startMidnight = new Date(evStart.getFullYear(), evStart.getMonth(), evStart.getDate());
    const endMidnight = new Date(evEnd.getFullYear(), evEnd.getMonth(), evEnd.getDate());
    return dateMidnight >= startMidnight && dateMidnight <= endMidnight;
  });
}

/**
 * Intelligent detector for academic semester entry and active learning start dates.
 * In Indonesian school calendars (Kaldik Nasional/Provinsi Jatim/Disdik Kota Pasuruan):
 * - The school year officially starts in July (e.g. 2nd or 3rd Monday of July).
 * - The days in July BEFORE the school entry date are Libur Akhir Tahun Pelajaran (Libur Kenaikan Kelas).
 * - The first week or days of school entry is Masa Pengenalan Lingkungan Sekolah (MPLS) / Orientasi.
 * - Active curriculum learning (Hari Belajar Aktif / KBM Efektif) begins SESUDAH libur sekolah dan SETELAH masuk awal semester / setelah MPLS.
 */
export function detectSemesterMilestones(
  academicYear: string,
  semester: SemesterType,
  events: KaldikEvent[],
  profileOverride?: {
    startDate?: string;
    activeLearningDate?: string;
  }
): SemesterMilestones {
  const [startYearStr, endYearStr] = academicYear.split('/');
  const startYear = parseInt(startYearStr, 10) || 2026;
  const endYear = parseInt(endYearStr, 10) || startYear + 1;
  const currentYear = semester === 1 ? startYear : endYear;

  // Manual override if set by user
  if (profileOverride?.startDate && profileOverride?.activeLearningDate) {
    return {
      schoolEntryDate: profileOverride.startDate,
      activeLearningStartDate: profileOverride.activeLearningDate,
      notes: `Dikonfigurasi: Masuk ${formatIndonesianDate(profileOverride.startDate)}, Belajar Aktif mulai ${formatIndonesianDate(profileOverride.activeLearningDate)}`
    };
  }

  if (semester === 1) {
    // SEMESTER 1 (Juli - Desember)
    let schoolEntryDate: string | undefined;
    let orientationEndDate: string | undefined;
    let activeLearningStartDate: string | undefined;

    // Scan events in July
    for (const ev of events) {
      const lower = (ev.title + ' ' + (ev.description || '')).toLowerCase();
      const mStart = parseInt(ev.startDate.split('-')[1], 10);
      const mEnd = parseInt(ev.endDate.split('-')[1], 10);

      // 1. Explicit active learning start date
      if ((lower.includes('awal kbm') || lower.includes('mulai kbm') || lower.includes('kbm efektif') || lower.includes('belajar aktif')) && (mStart === 7 || mStart === 8)) {
        activeLearningStartDate = ev.startDate;
      }

      // 2. MPLS / Masa Pengenalan Lingkungan Sekolah
      if ((lower.includes('mpls') || lower.includes('pengenalan lingkungan') || lower.includes('orientasi')) && (mStart === 7 || mEnd === 7)) {
        if (!schoolEntryDate || ev.startDate < schoolEntryDate) {
          schoolEntryDate = ev.startDate;
        }
        if (!orientationEndDate || ev.endDate > orientationEndDate) {
          orientationEndDate = ev.endDate;
        }
      }

      // 3. Hari Pertama Masuk Sekolah / Awal Masuk / Awal Semester
      if ((lower.includes('hari pertama masuk') || lower.includes('awal masuk') || lower.includes('masuk sekolah') || lower.includes('masuk awal') || lower.includes('tahun pelajaran baru') || lower.includes('tahun ajaran baru')) && mStart === 7) {
        if (!schoolEntryDate || ev.startDate < schoolEntryDate) {
          schoolEntryDate = ev.startDate;
        }
        if (ev.endDate > ev.startDate && (!orientationEndDate || ev.endDate > orientationEndDate)) {
          orientationEndDate = ev.endDate;
        }
      }
    }

    // 4. Check for Libur Akhir Tahun Pelajaran in July
    for (const ev of events) {
      const lower = (ev.title + ' ' + (ev.description || '')).toLowerCase();
      const mEnd = parseInt(ev.endDate.split('-')[1], 10);
      if ((lower.includes('libur akhir') || lower.includes('kenaikan kelas') || lower.includes('libur semester')) && mEnd === 7) {
        const afterHoliday = parseDate(ev.endDate);
        afterHoliday.setDate(afterHoliday.getDate() + 1);
        if (afterHoliday.getDay() === 0) { // Sunday -> jump to Monday
          afterHoliday.setDate(afterHoliday.getDate() + 1);
        }
        const candidateEntry = formatDate(afterHoliday);
        if (!schoolEntryDate || candidateEntry <= schoolEntryDate) {
          schoolEntryDate = candidateEntry;
        }
      }
    }

    // Fallback if not detected: Standard 2nd Monday of July
    if (!schoolEntryDate) {
      let mondayCount = 0;
      let targetDay = 13;
      for (let d = 1; d <= 21; d++) {
        const testDate = new Date(currentYear, 6, d);
        if (testDate.getDay() === 1) {
          mondayCount++;
          if (mondayCount === 2) {
            targetDay = d;
            break;
          }
        }
      }
      schoolEntryDate = `${currentYear}-07-${String(targetDay).padStart(2, '0')}`;
    }

    // Default orientation end: 4 days after entry (e.g. Mon-Fri)
    if (!orientationEndDate) {
      const dStart = parseDate(schoolEntryDate);
      const dEnd = new Date(dStart);
      dEnd.setDate(dEnd.getDate() + 4);
      orientationEndDate = formatDate(dEnd);
    }

    // Active learning starts on next school day (Monday) after orientation
    if (!activeLearningStartDate) {
      const dNext = parseDate(orientationEndDate);
      dNext.setDate(dNext.getDate() + 1);
      // Advance past weekend
      while (dNext.getDay() === 0 || dNext.getDay() === 6) {
        dNext.setDate(dNext.getDate() + 1);
      }
      activeLearningStartDate = formatDate(dNext);
    }

    if (profileOverride?.startDate) schoolEntryDate = profileOverride.startDate;
    if (profileOverride?.activeLearningDate) activeLearningStartDate = profileOverride.activeLearningDate;

    return {
      schoolEntryDate,
      orientationEndDate,
      activeLearningStartDate,
      holidayBeforeTitle: 'Libur Akhir Tahun Pelajaran (Libur Kenaikan Kelas)',
      notes: `Masuk Sekolah: ${formatIndonesianDate(schoolEntryDate)}, MPLS s.d. ${formatIndonesianDate(orientationEndDate)}, Hari Belajar Aktif: ${formatIndonesianDate(activeLearningStartDate)}`
    };
  } else {
    // SEMESTER 2 (Januari - Juni)
    let schoolEntryDate: string | undefined;
    let activeLearningStartDate: string | undefined;

    for (const ev of events) {
      const lower = (ev.title + ' ' + (ev.description || '')).toLowerCase();
      const mStart = parseInt(ev.startDate.split('-')[1], 10);
      if ((lower.includes('hari pertama masuk') || lower.includes('awal semester') || lower.includes('awal kbm') || lower.includes('masuk sekolah') || lower.includes('kbm semester')) && mStart === 1) {
        schoolEntryDate = ev.startDate;
        activeLearningStartDate = ev.startDate;
        break;
      }
    }

    if (!schoolEntryDate) {
      let firstMonday = 4;
      for (let d = 1; d <= 10; d++) {
        const testDate = new Date(currentYear, 0, d);
        if (testDate.getDay() === 1) {
          firstMonday = d;
          break;
        }
      }
      schoolEntryDate = `${currentYear}-01-${String(firstMonday).padStart(2, '0')}`;
      activeLearningStartDate = schoolEntryDate;
    }

    if (profileOverride?.startDate) schoolEntryDate = profileOverride.startDate;
    if (profileOverride?.activeLearningDate) activeLearningStartDate = profileOverride.activeLearningDate;

    return {
      schoolEntryDate,
      activeLearningStartDate,
      holidayBeforeTitle: 'Libur Akhir Semester 1 & Tahun Baru Masehi',
      notes: `Hari Pertama Masuk Semester 2: ${formatIndonesianDate(schoolEntryDate)}`
    };
  }
}

export function calculateSemesterRPE(
  academicYear: string,
  semester: SemesterType,
  grade: number,
  jpPerWeek: number,
  events: KaldikEvent[],
  schoolDaysPerWeek: 5 | 6 = 6,
  teachingDays: DayOfWeek[] = ['Kamis'],
  profileOverride?: {
    startDate?: string;
    activeLearningDate?: string;
  }
): RPEData {
  const [startYearStr, endYearStr] = academicYear.split('/');
  const startYear = parseInt(startYearStr, 10) || 2026;
  const endYear = parseInt(endYearStr, 10) || startYear + 1;

  const currentYear = semester === 1 ? startYear : endYear;
  const monthNames = semester === 1 ? MONTH_NAMES_SEM1 : MONTH_NAMES_SEM2;
  const monthOffsets = semester === 1 ? [6, 7, 8, 9, 10, 11] : [0, 1, 2, 3, 4, 5]; // 0-indexed months in JS Date

  const todayStr = formatDate(new Date());

  // Detect official semester start & active learning milestones
  const milestones = detectSemesterMilestones(academicYear, semester, events, profileOverride);

  const months: MonthEffectiveDetail[] = [];
  let totalWeeksSum = 0;
  let effectiveWeeksSum = 0;
  let nonEffectiveWeeksSum = 0;

  let totalCalendarDaysSum = 0;
  let totalSchoolDaysSum = 0;
  let totalEffectiveTeachingDaysSum = 0;
  let totalPAIScheduleDaysSum = 0;
  let totalHolidaysSum = 0;
  let totalAssessmentDaysSum = 0;
  let totalSchoolEventDaysSum = 0;

  const semesterDayTotals: Record<DayOfWeek, { total: number; effective: number }> = {
    'Minggu': { total: 0, effective: 0 },
    'Senin': { total: 0, effective: 0 },
    'Selasa': { total: 0, effective: 0 },
    'Rabu': { total: 0, effective: 0 },
    'Kamis': { total: 0, effective: 0 },
    'Jumat': { total: 0, effective: 0 },
    'Sabtu': { total: 0, effective: 0 },
  };

  monthOffsets.forEach((mIndex, idx) => {
    const monthName = monthNames[idx];
    const firstDayOfMonth = new Date(currentYear, mIndex, 1);
    const lastDayOfMonth = new Date(currentYear, mIndex + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // 1. Process every day in this month
    const days: DayDetail[] = [];
    const monthDayBreakdown: Record<DayOfWeek, { total: number; effective: number }> = {
      'Minggu': { total: 0, effective: 0 },
      'Senin': { total: 0, effective: 0 },
      'Selasa': { total: 0, effective: 0 },
      'Rabu': { total: 0, effective: 0 },
      'Kamis': { total: 0, effective: 0 },
      'Jumat': { total: 0, effective: 0 },
      'Sabtu': { total: 0, effective: 0 },
    };

    let monthSchoolDaysCount = 0;
    let monthEffectiveTeachingDaysCount = 0;
    let monthHolidaysCount = 0;
    let monthAssessmentDaysCount = 0;
    let monthSchoolEventDaysCount = 0;
    let monthSundayHolidaysCount = 0;
    const paiScheduleDates: string[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(currentYear, mIndex, d);
      const dateStr = formatDate(thisDate);
      const dayOfWeekIndex = thisDate.getDay(); // 0 = Minggu, 1 = Senin, ... 6 = Sabtu
      const dayOfWeek = DAY_NAMES[dayOfWeekIndex];

      const matchingEvent = getEventForDate(thisDate, events);

      let status: DayStatus = 'kbm_efektif';
      let statusLabel = 'KBM Efektif';
      let isEffectiveTeachingDay = false;
      let isSchoolDay = false;

      const isWeekendOff = dayOfWeekIndex === 0 || (schoolDaysPerWeek === 5 && dayOfWeekIndex === 6);

      if (isWeekendOff) {
        status = 'libur_mingguan';
        statusLabel = dayOfWeekIndex === 0 ? 'Libur Hari Minggu' : 'Libur Akhir Pekan (5 Hari Sekolah)';
        isSchoolDay = false;
        isEffectiveTeachingDay = false;
        monthSundayHolidaysCount++;
      } else if (semester === 1 && mIndex === 6 && dateStr < milestones.schoolEntryDate) {
        // Hari-hari di bulan Juli SEBELUM tanggal masuk sekolah adalah LIBUR AKHIR TAHUN PELAJARAN / KENAIKAN KELAS
        status = 'libur_semester';
        statusLabel = matchingEvent?.title || 'Libur Akhir Tahun Pelajaran (Libur Kenaikan Kelas)';
        isSchoolDay = false;
        isEffectiveTeachingDay = false;
        monthHolidaysCount++;
      } else if (semester === 2 && mIndex === 0 && dateStr < milestones.schoolEntryDate) {
        // Hari-hari di awal Januari SEBELUM masuk semester genap adalah LIBUR AKHIR SEMESTER 1 / TAHUN BARU
        status = 'libur_semester';
        statusLabel = matchingEvent?.title || (dateStr.endsWith('-01-01') ? 'Libur Tahun Baru Masehi' : 'Libur Akhir Semester 1');
        isSchoolDay = false;
        isEffectiveTeachingDay = false;
        monthHolidaysCount++;
      } else if (
        milestones.orientationEndDate &&
        dateStr >= milestones.schoolEntryDate &&
        dateStr <= milestones.orientationEndDate
      ) {
        // Masa Pengenalan Lingkungan Sekolah (MPLS) & Hari Pertama Masuk: Hari Sekolah Aktif (HES), bukan KBM reguler (HEB)
        status = 'kegiatan_sekolah';
        statusLabel = matchingEvent?.title || 'Hari Pertama Masuk Sekolah & Masa Pengenalan Lingkungan Sekolah (MPLS)';
        isSchoolDay = true;
        isEffectiveTeachingDay = false;
        monthSchoolDaysCount++;
        monthSchoolEventDaysCount++;
      } else if (dateStr < milestones.activeLearningStartDate) {
        // Hari persiapan antara orientasi dan awal belajar aktif
        status = 'kegiatan_sekolah';
        statusLabel = matchingEvent?.title || 'Persiapan Belajar Aktif Semester Baru';
        isSchoolDay = true;
        isEffectiveTeachingDay = false;
        monthSchoolDaysCount++;
        monthSchoolEventDaysCount++;
      } else if (matchingEvent) {
        // Hari sesudah belajar aktif dimulai dengan agenda di Kaldik
        if (matchingEvent.category === 'libur_nasional') {
          status = 'libur_nasional';
          statusLabel = matchingEvent.title;
          isSchoolDay = false;
          isEffectiveTeachingDay = false;
          monthHolidaysCount++;
        } else if (matchingEvent.category === 'libur_keagamaan') {
          status = 'libur_keagamaan';
          statusLabel = matchingEvent.title;
          isSchoolDay = false;
          isEffectiveTeachingDay = false;
          monthHolidaysCount++;
        } else if (matchingEvent.category === 'libur_semester') {
          status = 'libur_semester';
          statusLabel = matchingEvent.title;
          isSchoolDay = false;
          isEffectiveTeachingDay = false;
          monthHolidaysCount++;
        } else if (matchingEvent.category === 'asesmen') {
          status = 'asesmen';
          statusLabel = matchingEvent.title;
          isSchoolDay = true;
          isEffectiveTeachingDay = false; // Asesmen bukan KBM tatap muka materi pokok
          monthSchoolDaysCount++;
          monthAssessmentDaysCount++;
        } else if (matchingEvent.category === 'kegiatan_sekolah') {
          status = 'kegiatan_sekolah';
          statusLabel = matchingEvent.title;
          isSchoolDay = true;
          isEffectiveTeachingDay = !matchingEvent.affectsKBM;
          monthSchoolDaysCount++;
          monthSchoolEventDaysCount++;
          if (isEffectiveTeachingDay) {
            monthEffectiveTeachingDaysCount++;
          }
        } else {
          status = 'kbm_efektif';
          statusLabel = matchingEvent.title || 'KBM Efektif';
          isSchoolDay = true;
          isEffectiveTeachingDay = true;
          monthSchoolDaysCount++;
          monthEffectiveTeachingDaysCount++;
        }
      } else {
        // Hari sekolah normal belajar aktif KBM efektif
        status = 'kbm_efektif';
        statusLabel = 'KBM Efektif';
        isSchoolDay = true;
        isEffectiveTeachingDay = true;
        monthSchoolDaysCount++;
        monthEffectiveTeachingDaysCount++;
      }

      // Check if this day matches teacher's PAI schedule (hanya jika KBM efektif aktif)
      const isTeachingScheduleDay = teachingDays.includes(dayOfWeek);
      if (isTeachingScheduleDay && isEffectiveTeachingDay) {
        paiScheduleDates.push(dateStr);
      }

      // Record Day Breakdown
      monthDayBreakdown[dayOfWeek].total++;
      if (isEffectiveTeachingDay) {
        monthDayBreakdown[dayOfWeek].effective++;
      }

      semesterDayTotals[dayOfWeek].total++;
      if (isEffectiveTeachingDay) {
        semesterDayTotals[dayOfWeek].effective++;
      }

      days.push({
        dateString: dateStr,
        dayNumber: d,
        dayOfWeek,
        dayOfWeekIndex,
        status,
        statusLabel,
        isEffectiveTeachingDay,
        isSchoolDay,
        isTeachingScheduleDay,
        isCurrentDay: dateStr === todayStr,
        eventTitle: matchingEvent?.title,
        eventCategory: matchingEvent?.category
      });
    }

    // 2. Build 4 or 5 weeks for the month (Indonesian 7-day school planning blocks)
    const numberOfWeeks = Math.ceil(daysInMonth / 7);
    const weeks: MonthWeekDetail[] = [];
    const nonEffectiveReasons: string[] = [];
    let monthEffectiveCount = 0;
    let monthNonEffectiveCount = 0;

    for (let w = 1; w <= numberOfWeeks; w++) {
      const startDay = (w - 1) * 7 + 1;
      const endDay = Math.min(w * 7, daysInMonth);
      const weekStartDate = new Date(currentYear, mIndex, startDay);
      const weekEndDate = new Date(currentYear, mIndex, endDay);
      const weekStartStr = formatDate(weekStartDate);
      const weekEndStr = formatDate(weekEndDate);

      // Find days belonging to this week block
      const weekDays = days.filter(d => d.dayNumber >= startDay && d.dayNumber <= endDay);

      // Find events overlapping with this week
      const overlappingEvents = events.filter(event => {
        const evStart = parseDate(event.startDate);
        const evEnd = parseDate(event.endDate);
        return isDateOverlap(weekStartDate, weekEndDate, evStart, evEnd);
      });

      const blockingEvents = overlappingEvents.filter(e => e.affectsKBM);
      const effectiveDaysInWeek = weekDays.filter(d => d.isEffectiveTeachingDay).length;
      const scheduledDayDetail = weekDays.find(d => d.isTeachingScheduleDay);

      let isEffective = false;
      let notes = '';

      if (weekEndStr < milestones.activeLearningStartDate) {
        // Seluruh pekan berada sebelum hari belajar aktif dimulai (Libur Sekolah / MPLS)
        isEffective = false;
        if (weekEndStr < milestones.schoolEntryDate) {
          notes = semester === 1 
            ? 'Libur Akhir Tahun Pelajaran (Libur Kenaikan Kelas)' 
            : 'Libur Akhir Semester 1 & Tahun Baru';
        } else {
          notes = 'Masa Pengenalan Lingkungan Sekolah (MPLS) & Hari Pertama Masuk';
        }
      } else {
        // Pekan pada atau setelah tanggal mulai hari belajar aktif
        const hasEffectiveScheduledDay = scheduledDayDetail ? scheduledDayDetail.isEffectiveTeachingDay : false;
        const hasSufficientDays = blockingEvents.length === 0 && effectiveDaysInWeek >= (weekDays.length >= 5 ? 3 : 1);

        isEffective = (hasEffectiveScheduledDay || hasSufficientDays) && effectiveDaysInWeek > 0;
        
        const eventNotes = overlappingEvents.map(e => e.title).join(', ');
        notes = eventNotes || (isEffective ? 'KBM Efektif' : 'Pekan Tidak Efektif');
      }

      if (isEffective) {
        monthEffectiveCount++;
      } else {
        monthNonEffectiveCount++;
        if (notes && !nonEffectiveReasons.includes(notes)) {
          nonEffectiveReasons.push(notes);
        }
      }

      weeks.push({
        weekNumber: w,
        startDate: weekStartStr,
        endDate: weekEndStr,
        isEffective,
        notes,
        eventIds: overlappingEvents.map(e => e.id),
        scheduledTeachingDate: scheduledDayDetail ? formatIndonesianDate(scheduledDayDetail.dateString) : undefined,
        isScheduledDateEffective: scheduledDayDetail ? scheduledDayDetail.isEffectiveTeachingDay : isEffective
      });
    }

    totalWeeksSum += numberOfWeeks;
    effectiveWeeksSum += monthEffectiveCount;
    nonEffectiveWeeksSum += monthNonEffectiveCount;

    totalCalendarDaysSum += daysInMonth;
    totalSchoolDaysSum += monthSchoolDaysCount;
    totalEffectiveTeachingDaysSum += monthEffectiveTeachingDaysCount;
    totalPAIScheduleDaysSum += paiScheduleDates.length;
    totalHolidaysSum += monthHolidaysCount;
    totalAssessmentDaysSum += monthAssessmentDaysCount;
    totalSchoolEventDaysSum += monthSchoolEventDaysCount;

    months.push({
      monthIndex: mIndex,
      monthName,
      year: currentYear,
      semester,
      totalWeeks: numberOfWeeks,
      effectiveWeeks: monthEffectiveCount,
      nonEffectiveWeeks: monthNonEffectiveCount,
      nonEffectiveReasons,
      weeks,
      calendarDaysCount: daysInMonth,
      schoolDaysCount: monthSchoolDaysCount,
      effectiveTeachingDaysCount: monthEffectiveTeachingDaysCount,
      nonEffectiveDaysCount: daysInMonth - monthEffectiveTeachingDaysCount,
      holidaysCount: monthHolidaysCount,
      assessmentDaysCount: monthAssessmentDaysCount,
      schoolEventDaysCount: monthSchoolEventDaysCount,
      sundayHolidaysCount: monthSundayHolidaysCount,
      paiScheduleDaysCount: paiScheduleDates.length,
      paiScheduleDates,
      dayBreakdown: monthDayBreakdown,
      days
    });
  });

  const totalEffectiveHours = effectiveWeeksSum * jpPerWeek;

  const assessmentHours = Math.round(totalEffectiveHours * 0.15);
  const reserveHours = Math.max(2, Math.round(totalEffectiveHours * 0.08));
  const kbmHours = totalEffectiveHours - assessmentHours - reserveHours;

  return {
    academicYear,
    semester,
    grade,
    jpPerWeek,
    milestones,
    months,
    totalWeeks: totalWeeksSum,
    totalEffectiveWeeks: effectiveWeeksSum,
    totalNonEffectiveWeeks: nonEffectiveWeeksSum,
    totalEffectiveHours,
    totalCalendarDays: totalCalendarDaysSum,
    totalSchoolDays: totalSchoolDaysSum,
    totalEffectiveTeachingDays: totalEffectiveTeachingDaysSum,
    totalPAIScheduleDays: totalPAIScheduleDaysSum,
    totalHolidays: totalHolidaysSum,
    totalAssessmentDays: totalAssessmentDaysSum,
    totalSchoolEventDays: totalSchoolEventDaysSum,
    dayTotals: semesterDayTotals,
    teachingDays,
    schoolDaysPerWeek,
    allocatedHours: {
      kbmHours,
      assessmentHours,
      reserveHours
    }
  };
}

export function generatePromesMatrix(
  rpeData: RPEData,
  protaItems: ProtaItem[],
  customAllocations?: Record<string, Record<string, number>>
): PromesItem[] {
  const semesterProta = protaItems.filter(item => item.semester === rpeData.semester);
  
  // List all effective slots: array of keys "monthIdx_weekNum"
  // Strictly filter only effective weeks that occur on or after active learning starts
  const effectiveSlots: { key: string; monthName: string; weekNum: number }[] = [];
  const activeLearningStart = rpeData.milestones?.activeLearningStartDate;

  rpeData.months.forEach(month => {
    month.weeks.forEach(week => {
      const isAfterActiveStart = activeLearningStart ? week.endDate >= activeLearningStart : true;
      if (week.isEffective && isAfterActiveStart) {
        effectiveSlots.push({
          key: `${month.monthIndex}_${week.weekNumber}`,
          monthName: month.monthName,
          weekNum: week.weekNumber
        });
      }
    });
  });

  // Distribute JP across effective weeks
  let currentSlotIndex = 0;
  const jpPerWeek = rpeData.jpPerWeek;

  return semesterProta.map(protaItem => {
    const allocations: Record<string, number> = {};
    let hoursNeeded = protaItem.allocatedHours;

    // Check if user already provided custom manual allocations
    if (customAllocations && customAllocations[protaItem.id]) {
      return {
        protaItemId: protaItem.id,
        element: protaItem.element,
        chapterTitle: protaItem.chapterTitle,
        learningObjective: protaItem.learningObjectives.join('; '),
        allocatedHours: protaItem.allocatedHours,
        allocations: customAllocations[protaItem.id]
      };
    }

    // Auto-distribute
    while (hoursNeeded > 0 && currentSlotIndex < effectiveSlots.length) {
      const slot = effectiveSlots[currentSlotIndex];
      const hoursToPut = Math.min(hoursNeeded, jpPerWeek);
      allocations[slot.key] = hoursToPut;
      hoursNeeded -= hoursToPut;

      // Move to next slot
      currentSlotIndex++;
    }

    return {
      protaItemId: protaItem.id,
      element: protaItem.element,
      chapterTitle: protaItem.chapterTitle,
      learningObjective: protaItem.learningObjectives.join('; '),
      allocatedHours: protaItem.allocatedHours,
      allocations
    };
  });
}
