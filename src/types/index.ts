export type SemesterType = 1 | 2;

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';

export type DayStatus = 
  | 'kbm_efektif' 
  | 'libur_nasional' 
  | 'libur_keagamaan' 
  | 'libur_semester' 
  | 'asesmen' 
  | 'kegiatan_sekolah' 
  | 'libur_mingguan';

export type EventCategory = 
  | 'kbm' // Kegiatan Belajar Mengajar
  | 'libur_nasional' // Libur Nasional
  | 'libur_keagamaan' // Libur Hari Besar Islam / Keagamaan
  | 'libur_semester' // Libur Akhir Semester
  | 'asesmen' // STS, SAS, ANBK, Ujian Sekolah
  | 'kegiatan_sekolah' // MPLS, Pondok Ramadhan, Classmeeting, PHBI, dll
  | 'kegiatan_guru'; // Rapat, KKG PAI, Workshop

export interface KaldikEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  category: EventCategory;
  description?: string;
  affectsKBM: boolean; // Mengurangi keefektifan pekan KBM
  color?: string;
}

export interface DayDetail {
  dateString: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 31
  dayOfWeek: DayOfWeek;
  dayOfWeekIndex: number; // 0: Sunday, 1: Monday, ... 6: Saturday
  status: DayStatus;
  statusLabel: string;
  isEffectiveTeachingDay: boolean; // HEB (Hari Efektif Belajar)
  isSchoolDay: boolean; // HES (Hari Efektif Sekolah)
  isTeachingScheduleDay: boolean; // Apakah hari jadwal mengajar PAI guru
  isCurrentDay?: boolean;
  eventTitle?: string;
  eventCategory?: EventCategory;
}

export interface MonthWeekDetail {
  weekNumber: number; // 1 to 5
  startDate: string;
  endDate: string;
  isEffective: boolean;
  notes?: string;
  eventIds: string[];
  scheduledTeachingDate?: string; // Tanggal mengajar spesifik untuk hari jadwal PAI (misal: "16 Jul 2026")
  isScheduledDateEffective?: boolean;
}

export interface MonthEffectiveDetail {
  monthIndex: number; // 0 to 11 (0 = Juli for academic year or 0 = Jan)
  monthName: string;
  year: number;
  semester: SemesterType;
  totalWeeks: number;
  effectiveWeeks: number;
  nonEffectiveWeeks: number;
  nonEffectiveReasons: string[];
  weeks: MonthWeekDetail[];
  
  // Day-based metrics
  calendarDaysCount: number; // Total hari kalender (28-31)
  schoolDaysCount: number; // HES (Hari Efektif Sekolah)
  effectiveTeachingDaysCount: number; // HEB (Hari Efektif Belajar KBM)
  nonEffectiveDaysCount: number; // Hari non-efektif (libur/kegiatan)
  holidaysCount: number; // Libur nasional, keagamaan, semester
  assessmentDaysCount: number; // STS / SAS / ANBK
  schoolEventDaysCount: number; // MPLS, Pondok Ramadhan, dll
  sundayHolidaysCount: number; // Hari Minggu & hari off mingguan
  paiScheduleDaysCount: number; // Total hari mengajar sesuai jadwal PAI guru
  paiScheduleDates: string[]; // Daftar tanggal jadwal PAI
  dayBreakdown: Record<DayOfWeek, { total: number; effective: number }>;
  days: DayDetail[]; // Rincian setiap hari dalam bulan
}

export interface SemesterMilestones {
  schoolEntryDate: string; // Tanggal Masuk Awal Semester (YYYY-MM-DD)
  activeLearningStartDate: string; // Tanggal Mulai Hari Belajar Aktif KBM (YYYY-MM-DD)
  orientationEndDate?: string; // Tanggal Akhir Masa Pengenalan Lingkungan Sekolah (MPLS)
  holidayBeforeTitle?: string; // Keterangan Libur Sekolah Sebelum Masuk
  notes?: string;
}

export interface RPEData {
  academicYear: string;
  semester: SemesterType;
  grade: number; // 1 to 6
  jpPerWeek: number; // default 3 or 4 for PAI
  milestones?: SemesterMilestones; // Milestones kalender pendidikan
  months: MonthEffectiveDetail[];
  totalWeeks: number;
  totalEffectiveWeeks: number;
  totalNonEffectiveWeeks: number;
  totalEffectiveHours: number; // totalEffectiveWeeks * jpPerWeek
  
  // Total Day Metrics
  totalCalendarDays: number;
  totalSchoolDays: number; // HES
  totalEffectiveTeachingDays: number; // HEB
  totalPAIScheduleDays: number; // Pertemuan PAI
  totalHolidays: number;
  totalAssessmentDays: number;
  totalSchoolEventDays: number;
  dayTotals: Record<DayOfWeek, { total: number; effective: number }>;
  teachingDays: DayOfWeek[];
  schoolDaysPerWeek: 5 | 6;

  allocatedHours: {
    kbmHours: number; // Jam Tatap Muka
    assessmentHours: number; // Jam Asesmen Sumatif / Ulangan
    reserveHours: number; // Jam Cadangan / Pengayaan / Remedial
  };
}

export type PAIElement = 
  | "Al-Qur'an Hadis"
  | "Akidah"
  | "Akhlak"
  | "Fikih"
  | "Sejarah Peradaban Islam (SPI)";

export interface ProtaItem {
  id: string;
  semester: SemesterType;
  chapterNumber: number;
  element: PAIElement;
  chapterTitle: string;
  learningObjectives: string[]; // Tujuan Pembelajaran (TP)
  allocatedHours: number; // Alokasi Waktu (JP)
  teachingDay?: DayOfWeek; // Hari Pelajaran / Jadwal Tatap Muka (Senin - Sabtu)
  numberOfMeetings?: number; // Jumlah Pertemuan Tatap Muka (1 Pertemuan = 4 JP)
  subTopics?: string[];
  notes?: string;
}

export interface PromesWeekAllocation {
  weekIndex: number; // 1 to 5 within month
  allocatedJP: number; // 0, 1, 2, 3, 4
  activityType?: 'kbm' | 'sts' | 'sas' | 'libur' | 'mpls' | 'pondok_ramadhan' | 'cadangan';
  topicLabel?: string;
}

export interface PromesItem {
  protaItemId: string;
  element: PAIElement;
  chapterTitle: string;
  learningObjective: string;
  allocatedHours: number;
  // Map of "monthIndex_weekIndex" -> JP allocated
  allocations: Record<string, number>;
}

export interface SchoolProfile {
  schoolName: string;
  unitType: string;
  npsn: string;
  district: string;
  city: string;
  province: string;
  address: string;
  academicYear: string;
  teacherName: string;
  teacherNip: string;
  teacherTitle: string; // e.g. "Guru PAI dan Budi Pekerti"
  headmasterName: string;
  headmasterNip: string;
  headmasterTitle: string; // e.g. "Kepala UPT Satuan Pendidikan SDN Pohjentrek II"
  selectedGrade: number; // 1 - 6
  jpPerWeek: number; // 3 or 4
  cityDateLocation: string; // "Pasuruan"
  schoolDaysPerWeek: 5 | 6; // 5 hari sekolah (Sen-Jum) atau 6 hari sekolah (Sen-Sab)
  teachingDays: DayOfWeek[]; // Hari mengajar PAI untuk kelas ini (contoh: ['Rabu'])
  semester1StartDate?: string; // Tanggal Masuk Awal Semester 1 (opsional override)
  semester1ActiveLearningDate?: string; // Tanggal Mulai Hari Belajar Aktif Semester 1 (opsional override)
  semester2StartDate?: string; // Tanggal Masuk Awal Semester 2 (opsional override)
  semester2ActiveLearningDate?: string; // Tanggal Mulai Hari Belajar Aktif Semester 2 (opsional override)
}

export interface CPMappingEntry {
  id: string;
  semester: SemesterType; // 1 | 2
  element: PAIElement;
  cpDescription: string; // Kolom Kiri: CP Berdasarkan Elemen
  essentialMaterials: string[]; // Kolom Kanan: Materi Esensial
  subTopics?: string[]; // Rincian ruang lingkup materi pokok
  allocatedJP?: number; // Alokasi JP
  learningObjectives?: string[]; // Indikator Tujuan Pembelajaran
  notes?: string;
}

export interface GradeCPMappingData {
  grade: number;
  fase: string;
  semester1: CPMappingEntry[];
  semester2: CPMappingEntry[];
}

export interface AIAnalysisResult {
  summary: string;
  schoolContext: string;
  effectiveWeeksSem1: number;
  effectiveWeeksSem2: number;
  effectiveDaysSem1?: number; // Jumlah Hari Efektif Belajar (HEB) Semester 1
  effectiveDaysSem2?: number; // Jumlah Hari Efektif Belajar (HEB) Semester 2
  schoolDaysSem1?: number; // Hari Efektif Sekolah (HES) Semester 1
  schoolDaysSem2?: number; // Hari Efektif Sekolah (HES) Semester 2
  holidaysSem1?: number; // Total Hari Libur Semester 1
  holidaysSem2?: number; // Total Hari Libur Semester 2
  detectedEvents: KaldikEvent[];
  curriculumRecommendations: {
    fase: string;
    grade: number;
    recommendedJPPerWeek: number;
    ramadhanStrategy: string;
    assessmentScheduleAdvice: string;
    criticalDates: string[];
  };
  warnings: string[];
}

