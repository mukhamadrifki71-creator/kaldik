import { KaldikEvent, SchoolProfile } from '../types';
import { getCurrentAcademicYear } from './cpTpTemplates';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  schoolName: 'SDN Pohjentrek II Kota Pasuruan',
  unitType: 'UPT Satuan Pendidikan',
  npsn: '20535512',
  district: 'Purworejo',
  city: 'Kota Pasuruan',
  province: 'Jawa Timur',
  address: 'Jl. KH. Achmad Dahlan No. 12, Pohjentrek, Kec. Purworejo, Kota Pasuruan, Jawa Timur 67118',
  academicYear: getCurrentAcademicYear() || '2026/2027',
  teacherName: 'Mukhamad Rifki, S.Pd.I',
  teacherNip: '19900815 202221 1 004',
  teacherTitle: 'Guru PAI & Budi Pekerti',
  headmasterName: 'Dra. Hj. Siti Nurhasanah, M.Pd.',
  headmasterNip: '19681210 199303 2 005',
  headmasterTitle: 'Kepala UPT Satuan Pendidikan SDN Pohjentrek II',
  selectedGrade: 4,
  jpPerWeek: 4,
  cityDateLocation: 'Pasuruan',
  schoolDaysPerWeek: 6,
  teachingDays: ['Kamis']
};

export interface KaldikPreset {
  id: string;
  name: string;
  academicYear: string;
  province: string;
  city: string;
  description: string;
  events: KaldikEvent[];
}

export const KALDIK_PRESETS: KaldikPreset[] = [
  {
    id: 'kaldik_pasuruan_2026_2027',
    name: 'Kalender Pendidikan Dinas Pendidikan Kota Pasuruan 2026/2027 (Tahun Berjalan Aktif)',
    academicYear: '2026/2027',
    province: 'Jawa Timur',
    city: 'Kota Pasuruan',
    description: 'Kalender pendidikan resmi Disdikbud Kota Pasuruan & Pemprov Jawa Timur TP 2026/2027 untuk jenjang SD. Disinkronkan dengan agenda PAI, PHBI, dan Pondok Ramadhan.',
    events: [
      // SEMESTER 1 (GANJIL: Juli - Desember 2026)
      {
        id: 'ev_26_libur_akhir_tp_lalu',
        title: 'Libur Akhir Tahun Pelajaran (Libur Kenaikan Kelas TP 2025/2026)',
        startDate: '2026-07-01',
        endDate: '2026-07-11',
        category: 'libur_semester',
        description: 'Libur kenaikan kelas peserta didik sebelum memasuki Tahun Pelajaran baru 2026/2027.',
        affectsKBM: true,
        color: '#ec4899'
      },
      {
        id: 'ev_26_mpls',
        title: 'Hari Pertama Masuk Sekolah & MPLS TP 2026/2027',
        startDate: '2026-07-13',
        endDate: '2026-07-17',
        category: 'kegiatan_sekolah',
        description: 'Masa Pengenalan Lingkungan Sekolah (MPLS) dan asesmen diagnostik awal PAI.',
        affectsKBM: true,
        color: '#3b82f6'
      },
      {
        id: 'ev_26_17agustus',
        title: 'HUT Proklamasi Kemerdekaan RI Ke-81',
        startDate: '2026-08-17',
        endDate: '2026-08-17',
        category: 'libur_nasional',
        description: 'Upacara HUT Kemerdekaan RI di SDN Pohjentrek II.',
        affectsKBM: false,
        color: '#ef4444'
      },
      {
        id: 'ev_26_maulid',
        title: 'Peringatan Maulid Nabi Muhammad SAW 1448 H',
        startDate: '2026-08-25',
        endDate: '2026-08-25',
        category: 'libur_keagamaan',
        description: 'Peringatan Hari Besar Islam (PHBI) Maulid Nabi di SDN Pohjentrek II.',
        affectsKBM: false,
        color: '#10b981'
      },
      {
        id: 'ev_26_sts1',
        title: 'Sumatif Tengah Semester 1 (STS 1 / PTS)',
        startDate: '2026-09-21',
        endDate: '2026-09-26',
        category: 'asesmen',
        description: 'Penilaian Sumatif Tengah Semester Ganjil seluruh muatan pelajaran.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_26_anbk',
        title: 'Pelaksanaan ANBK SD Gelombang I & II',
        startDate: '2026-10-26',
        endDate: '2026-11-05',
        category: 'asesmen',
        description: 'Asesmen Nasional Berbasis Komputer bagi siswa Kelas 5 SD.',
        affectsKBM: false,
        color: '#8b5cf6'
      },
      {
        id: 'ev_26_hgn',
        title: 'Hari Guru Nasional (HGN) & HUT PGRI',
        startDate: '2026-11-25',
        endDate: '2026-11-25',
        category: 'kegiatan_sekolah',
        description: 'Apresiasi dan upacara Hari Guru Nasional.',
        affectsKBM: false,
        color: '#6366f1'
      },
      {
        id: 'ev_26_sas1',
        title: 'Sumatif Akhir Semester 1 (SAS 1 / PAS)',
        startDate: '2026-11-30',
        endDate: '2026-12-12',
        category: 'asesmen',
        description: 'Asesmen Sumatif Akhir Semester Ganjil, pengolahan nilai, dan cetak e-Rapor.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_26_classmeeting',
        title: 'Class Meeting & Porseni Keagamaan Islam',
        startDate: '2026-12-14',
        endDate: '2026-12-17',
        category: 'kegiatan_sekolah',
        description: 'Lomba Tahfidz Al-Qur’an, Adzan, Kaligrafi, dan Pildacil.',
        affectsKBM: true,
        color: '#06b6d4'
      },
      {
        id: 'ev_26_rapor1',
        title: 'Penyerahan Rapor Semester 1 (Ganjil)',
        startDate: '2026-12-18',
        endDate: '2026-12-19',
        category: 'kegiatan_sekolah',
        description: 'Penerimaan Buku Laporan Hasil Belajar kepada wali murid.',
        affectsKBM: true,
        color: '#10b981'
      },
      {
        id: 'ev_26_libur_sem1',
        title: 'Libur Akhir Semester 1 & Cuti Bersama Natal/Tahun Baru',
        startDate: '2026-12-21',
        endDate: '2027-01-02',
        category: 'libur_semester',
        description: 'Libur akhir semester ganjil bagi peserta didik.',
        affectsKBM: true,
        color: '#ec4899'
      },

      // SEMESTER 2 (GENAP: Januari - Juni 2027)
      {
        id: 'ev_27_awal_sem2',
        title: 'Hari Pertama Masuk Sekolah Semester 2 (Genap)',
        startDate: '2027-01-04',
        endDate: '2027-01-04',
        category: 'kbm',
        description: 'Awal kegiatan belajar mengajar semester genap.',
        affectsKBM: false,
        color: '#10b981'
      },
      {
        id: 'ev_27_isra_miraj',
        title: 'Isra Mi’raj Nabi Muhammad SAW 1448 H',
        startDate: '2027-01-16',
        endDate: '2027-01-16',
        category: 'libur_keagamaan',
        description: 'PHBI Isra Miraj & Pembiasaan Shalat Fardhu Berjamaah.',
        affectsKBM: false,
        color: '#10b981'
      },
      {
        id: 'ev_27_libur_awal_puasa',
        title: 'Libur Permulaan Puasa Ramadhan 1448 H',
        startDate: '2027-02-08',
        endDate: '2027-02-10',
        category: 'libur_keagamaan',
        description: 'Libur awal puasa Ramadhan 1448 H.',
        affectsKBM: true,
        color: '#10b981'
      },
      {
        id: 'ev_27_sts2',
        title: 'Sumatif Tengah Semester 2 (STS 2)',
        startDate: '2027-02-22',
        endDate: '2027-02-27',
        category: 'asesmen',
        description: 'Penilaian Sumatif Tengah Semester Genap.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_27_pondok_ramadhan',
        title: 'Kegiatan Pondok Ramadhan & Amaliah PAI SDN Pohjentrek II',
        startDate: '2027-03-01',
        endDate: '2027-03-06',
        category: 'kegiatan_sekolah',
        description: 'Pondok Ramadhan, Penguatan Karakter Islam, Buka Bersama, dan Pengumpulan Zakat Fitrah.',
        affectsKBM: true,
        color: '#059669'
      },
      {
        id: 'ev_27_libur_idulfitri',
        title: 'Libur Hari Raya Idul Fitri 1448 H & Cuti Bersama',
        startDate: '2027-03-08',
        endDate: '2027-03-20',
        category: 'libur_keagamaan',
        description: 'Libur Hari Raya Idul Fitri 1 Syawal 1448 H.',
        affectsKBM: true,
        color: '#10b981'
      },
      {
        id: 'ev_27_halal_bihalal',
        title: 'Masuk Sekolah & Halal Bihalal SDN Pohjentrek II',
        startDate: '2027-03-22',
        endDate: '2027-03-22',
        category: 'kegiatan_sekolah',
        description: 'Silaturahmi keluarga besar sekolah.',
        affectsKBM: false,
        color: '#10b981'
      },
      {
        id: 'ev_27_ujian_sekolah',
        title: 'Asesmen Akhir Jenjang (Ujian Sekolah) Kelas 6',
        startDate: '2027-05-10',
        endDate: '2027-05-15',
        category: 'asesmen',
        description: 'Asesmen Akhir Jenjang SD.',
        affectsKBM: false,
        color: '#f59e0b'
      },
      {
        id: 'ev_27_iduladha',
        title: 'Hari Raya Idul Adha 1448 H & Ibadah Kurban',
        startDate: '2027-05-16',
        endDate: '2027-05-17',
        category: 'libur_keagamaan',
        description: 'Penyembelihan hewan kurban dan bakti sosial sekolah.',
        affectsKBM: false,
        color: '#10b981'
      },
      {
        id: 'ev_27_sas2',
        title: 'Sumatif Akhir Tahun (SAT / SAS 2 / Kenaikan Kelas)',
        startDate: '2027-06-07',
        endDate: '2027-06-17',
        category: 'asesmen',
        description: 'Asesmen Sumatif Kenaikan Kelas.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_27_rapor2',
        title: 'Penyerahan Rapor Kenaikan Kelas & Pelepasan Kelas 6',
        startDate: '2027-06-18',
        endDate: '2027-06-19',
        category: 'kegiatan_sekolah',
        description: 'Pembagian Buku Rapor Kenaikan Kelas dan Pelepasan Siswa Kelas 6.',
        affectsKBM: true,
        color: '#10b981'
      },
      {
        id: 'ev_27_libur_akhir',
        title: 'Libur Akhir Tahun Pelajaran (Libur Kenaikan Kelas)',
        startDate: '2027-06-21',
        endDate: '2027-07-10',
        category: 'libur_semester',
        description: 'Libur kenaikan kelas sebelum tahun pelajaran baru.',
        affectsKBM: true,
        color: '#ec4899'
      }
    ]
  },
  {
    id: 'kaldik_pasuruan_2025_2026',
    name: 'Kalender Pendidikan Dinas Pendidikan Kota Pasuruan 2025/2026',
    academicYear: '2025/2026',
    province: 'Jawa Timur',
    city: 'Kota Pasuruan',
    description: 'Kalender Pendidikan 2025/2026 Provinsi Jawa Timur & Disdikbud Kota Pasuruan.',
    events: [
      {
        id: 'ev_25_libur_akhir_tp_lalu',
        title: 'Libur Akhir Tahun Pelajaran (Libur Kenaikan Kelas TP 2024/2025)',
        startDate: '2025-07-01',
        endDate: '2025-07-12',
        category: 'libur_semester',
        description: 'Libur kenaikan kelas sebelum tahun pelajaran baru.',
        affectsKBM: true,
        color: '#ec4899'
      },
      {
        id: 'ev_mpls_25',
        title: 'Hari Pertama Masuk Sekolah & MPLS 2025/2026',
        startDate: '2025-07-14',
        endDate: '2025-07-18',
        category: 'kegiatan_sekolah',
        description: 'MPLS dan pemetaan diagnostik awal.',
        affectsKBM: true,
        color: '#3b82f6'
      },
      {
        id: 'ev_17agustus_25',
        title: 'HUT Proklamasi Kemerdekaan RI Ke-80',
        startDate: '2025-08-17',
        endDate: '2025-08-17',
        category: 'libur_nasional',
        description: 'Upacara HUT RI Ke-80.',
        affectsKBM: false,
        color: '#ef4444'
      },
      {
        id: 'ev_maulid_25',
        title: 'Maulid Nabi Muhammad SAW 1447 H',
        startDate: '2025-09-05',
        endDate: '2025-09-05',
        category: 'libur_keagamaan',
        description: 'PHBI Maulid Nabi di SDN Pohjentrek II.',
        affectsKBM: false,
        color: '#10b981'
      },
      {
        id: 'ev_sts1_25',
        title: 'Sumatif Tengah Semester 1 (STS 1)',
        startDate: '2025-09-22',
        endDate: '2025-09-27',
        category: 'asesmen',
        description: 'Asesmen Tengah Semester Ganjil.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_sas1_25',
        title: 'Sumatif Akhir Semester 1 (SAS 1)',
        startDate: '2025-12-01',
        endDate: '2025-12-13',
        category: 'asesmen',
        description: 'Asesmen Akhir Semester Ganjil.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_rapor1_25',
        title: 'Pembagian Rapor Semester 1',
        startDate: '2025-12-19',
        endDate: '2025-12-20',
        category: 'kegiatan_sekolah',
        description: 'Penerimaan Buku Rapor Semester 1.',
        affectsKBM: true,
        color: '#10b981'
      },
      {
        id: 'ev_libur_sem1_25',
        title: 'Libur Akhir Semester Ganjil',
        startDate: '2025-12-22',
        endDate: '2026-01-03',
        category: 'libur_semester',
        description: 'Libur akhir semester 1.',
        affectsKBM: true,
        color: '#ec4899'
      },
      {
        id: 'ev_awal_sem2_26',
        title: 'Hari Pertama Masuk Sekolah Semester Genap',
        startDate: '2026-01-05',
        endDate: '2026-01-05',
        category: 'kbm',
        description: 'Awal KBM Semester Genap.',
        affectsKBM: false,
        color: '#10b981'
      },
      {
        id: 'ev_ramadhan_26',
        title: 'Pondok Ramadhan 1447 H SDN Pohjentrek II',
        startDate: '2026-03-09',
        endDate: '2026-03-14',
        category: 'kegiatan_sekolah',
        description: 'Pondok Ramadhan dan Amaliah Keislaman.',
        affectsKBM: true,
        color: '#059669'
      },
      {
        id: 'ev_idulfitri_26',
        title: 'Libur Hari Raya Idul Fitri 1447 H',
        startDate: '2026-03-16',
        endDate: '2026-03-28',
        category: 'libur_keagamaan',
        description: 'Libur Hari Raya Idul Fitri.',
        affectsKBM: true,
        color: '#10b981'
      },
      {
        id: 'ev_sas2_26',
        title: 'Sumatif Akhir Tahun (SAT / SAS 2)',
        startDate: '2026-06-08',
        endDate: '2026-06-18',
        category: 'asesmen',
        description: 'Penilaian Kenaikan Kelas.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_rapor2_26',
        title: 'Penyerahan Rapor Kenaikan Kelas',
        startDate: '2026-06-19',
        endDate: '2026-06-20',
        category: 'kegiatan_sekolah',
        description: 'Pembagian Rapor Kenaikan Kelas.',
        affectsKBM: true,
        color: '#10b981'
      },
      {
        id: 'ev_libur_akhir_26',
        title: 'Libur Akhir Tahun Pelajaran',
        startDate: '2026-06-22',
        endDate: '2026-07-11',
        category: 'libur_semester',
        description: 'Libur kenaikan kelas.',
        affectsKBM: true,
        color: '#ec4899'
      }
    ]
  },
  {
    id: 'kaldik_pasuruan_2024_2025',
    name: 'Kalender Pendidikan Dinas Pendidikan Kota Pasuruan 2024/2025 (Arsip)',
    academicYear: '2024/2025',
    province: 'Jawa Timur',
    city: 'Kota Pasuruan',
    description: 'Arsip Kalender pendidikan resmi Provinsi Jawa Timur & Disdikbud Kota Pasuruan TP 2024/2025.',
    events: [
      {
        id: 'ev_24_libur_akhir_tp_lalu',
        title: 'Libur Akhir Tahun Pelajaran (Libur Kenaikan Kelas TP 2023/2024)',
        startDate: '2024-07-01',
        endDate: '2024-07-13',
        category: 'libur_semester',
        description: 'Libur kenaikan kelas sebelum tahun pelajaran baru aktif.',
        affectsKBM: true,
        color: '#ec4899'
      },
      {
        id: 'ev_mpls_24',
        title: 'Hari Pertama Masuk Sekolah & MPLS',
        startDate: '2024-07-15',
        endDate: '2024-07-19',
        category: 'kegiatan_sekolah',
        description: 'MPLS dan asesmen awal diagnostik.',
        affectsKBM: true,
        color: '#3b82f6'
      },
      {
        id: 'ev_17agustus_24',
        title: 'HUT Proklamasi Kemerdekaan RI Ke-79',
        startDate: '2024-08-17',
        endDate: '2024-08-17',
        category: 'libur_nasional',
        description: 'Upacara HUT RI Ke-79.',
        affectsKBM: false,
        color: '#ef4444'
      },
      {
        id: 'ev_maulid_24',
        title: 'Maulid Nabi Muhammad SAW 1446 H',
        startDate: '2024-09-16',
        endDate: '2024-09-16',
        category: 'libur_keagamaan',
        description: 'PHBI Maulid Nabi.',
        affectsKBM: false,
        color: '#10b981'
      },
      {
        id: 'ev_sts1_24',
        title: 'Sumatif Tengah Semester 1 (STS 1)',
        startDate: '2024-09-23',
        endDate: '2024-09-28',
        category: 'asesmen',
        description: 'Penilaian Sumatif Tengah Semester Ganjil.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_sas1_24',
        title: 'Sumatif Akhir Semester 1 (SAS 1)',
        startDate: '2024-12-02',
        endDate: '2024-12-14',
        category: 'asesmen',
        description: 'Asesmen Sumatif Akhir Semester Ganjil.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_libur_sem1_24',
        title: 'Libur Akhir Semester 1',
        startDate: '2024-12-23',
        endDate: '2025-01-04',
        category: 'libur_semester',
        description: 'Libur semester ganjil.',
        affectsKBM: true,
        color: '#ec4899'
      },
      {
        id: 'ev_pondok_ramadhan_24',
        title: 'Kegiatan Pondok Ramadhan PAI',
        startDate: '2025-03-17',
        endDate: '2025-03-22',
        category: 'kegiatan_sekolah',
        description: 'Pondok Ramadhan SDN Pohjentrek II.',
        affectsKBM: true,
        color: '#059669'
      },
      {
        id: 'ev_libur_idulfitri_24',
        title: 'Libur Hari Raya Idul Fitri 1446 H',
        startDate: '2025-03-26',
        endDate: '2025-04-08',
        category: 'libur_keagamaan',
        description: 'Libur Hari Raya Idul Fitri.',
        affectsKBM: true,
        color: '#10b981'
      },
      {
        id: 'ev_sas2_24',
        title: 'Sumatif Akhir Tahun (SAT / SAS 2)',
        startDate: '2025-06-09',
        endDate: '2025-06-19',
        category: 'asesmen',
        description: 'Penilaian Kenaikan Kelas.',
        affectsKBM: true,
        color: '#f59e0b'
      },
      {
        id: 'ev_libur_akhir_24',
        title: 'Libur Akhir Tahun Pelajaran',
        startDate: '2025-06-23',
        endDate: '2025-07-12',
        category: 'libur_semester',
        description: 'Libur kenaikan kelas.',
        affectsKBM: true,
        color: '#ec4899'
      }
    ]
  }
];
