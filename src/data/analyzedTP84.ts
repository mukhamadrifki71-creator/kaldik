import type { PAIElement, SemesterType } from '../types/index.ts';

export interface AnalyzedTPRecord {
  id: string;
  no: number;
  semester: SemesterType;
  element: PAIElement;
  tujuan_pembelajaran_hasil_analisis: string; // Kolom UTAMA hasil analisis yang digunakan
  tujuan_pembelajaran_sementara: string; // Kolom sementara yang TIDAK boleh digunakan
  materi_esensial: string;
  kelas?: number;
  alokasi_jp?: number;
}

/**
 * Bank Data 84 Butir Tujuan Pembelajaran Hasil Analisis Presisi (PAI & Budi Pekerti SD)
 * Disusun berdasarkan rumusan operasional Capaian Pembelajaran (CP) BSKAP No. 032/H/KR/2024
 * Tepat berjumlah 84 butir (Sem 1: 42 butir, Sem 2: 42 butir)
 */
export const PRECISE_84_ANALYZED_TP: AnalyzedTPRecord[] = [
  // ================= SEMESTER 1 (42 BUTIR) =================
  // Elemen 1: Al-Qur'an Hadis (Sem 1: 10 butir, No 1-10)
  {
    id: 'tp_84_01',
    no: 1,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.1 Mengidentifikasi dan melafalkan huruf hijaiyah berharakat fathah, kasrah, dan dhammah dengan makhraj yang fasih.',
    tujuan_pembelajaran_sementara: '1.1 Belajar huruf hijaiyah dasar dan membaca tanda baca sederhana.',
    materi_esensial: 'Huruf Hijaiyah Berharakat Tunggal',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_02',
    no: 2,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.2 Membaca surah-surah pendek pilihan (Al-Falaq dan An-Nas) dengan menerapkan kaidah tajwid dasar secara tartil.',
    tujuan_pembelajaran_sementara: '1.2 Membaca surat pendek Al-Falaq dan An-Nas bersama guru.',
    materi_esensial: 'Q.S. Al-Falaq dan Q.S. An-Nas',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_03',
    no: 3,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.3 Menjelaskan makna mufrodat dan kandungan pesan pokok Q.S. Al-Falaq tentang memohon perlindungan dari kejahatan makhluk.',
    tujuan_pembelajaran_sementara: '1.3 Mengetahui arti ayat surat Al-Falaq.',
    materi_esensial: 'Kandungan Pesan Pokok Q.S. Al-Falaq',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_04',
    no: 4,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.4 Menghafalkan Q.S. Al-Falaq dan Q.S. An-Nas secara lancar dan mutqin dalam shalat fardhu maupun pembiasaan pagi.',
    tujuan_pembelajaran_sementara: '1.4 Menghafal dua surat pendek.',
    materi_esensial: 'Hafalan Q.S. Al-Falaq dan An-Nas',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_05',
    no: 5,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.5 Menganalisis hukum bacaan Alif Lam Syamsiyah dan Alif Lam Qamariyah dalam ayat-ayat Al-Qur’an juz 30.',
    tujuan_pembelajaran_sementara: '1.5 Mengetahui tanda alif lam di Al-Qur’an.',
    materi_esensial: 'Hukum Tajwid Alif Lam Syamsiyah & Qamariyah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_06',
    no: 6,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.6 Menuliskan potongan ayat-ayat Q.S. Al-Hujurat: 13 dengan kaidah penulisan khat naskhi yang rapi dan benar.',
    tujuan_pembelajaran_sementara: '1.6 Menyalin ayat Al-Hujurat ayat 13 ke buku tulis.',
    materi_esensial: 'Khat & Kaligrafi Q.S. Al-Hujurat: 13',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_07',
    no: 7,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.7 Membaca Q.S. Al-Hujurat: 13 tentang keragaman manusia sebagai sunnatullah dengan tajwid gunnah dan mad thabi’i.',
    tujuan_pembelajaran_sementara: '1.7 Membaca ayat tentang keragaman manusia.',
    materi_esensial: 'Tartil Bacaan Q.S. Al-Hujurat: 13',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_08',
    no: 8,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.8 Menelaah hadis riwayat Bukhari-Muslim tentang persaudaraan sesama mukmin dan larangan berprasangka buruk.',
    tujuan_pembelajaran_sementara: '1.8 Membaca hadis tentang persaudaraan.',
    materi_esensial: 'Hadis Ukhuwah Islamiyah & Basyariyah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_09',
    no: 9,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.9 Menunjukkan keterkaitan pesan Q.S. Al-Hujurat: 13 dengan semboyan Bhinneka Tunggal Ika dalam pergaulan di sekolah.',
    tujuan_pembelajaran_sementara: '1.9 Memahami hubungan toleransi dan semboyan negara.',
    materi_esensial: 'Penerapan Moderasi Beragama',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_10',
    no: 10,
    semester: 1,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '1.10 Menghafal matan dan terjemah hadis tentang silaturahmi sebagai kunci melapangkan rezeki dan memperpanjang umur.',
    tujuan_pembelajaran_sementara: '1.10 Hafalan hadis silaturahmi.',
    materi_esensial: 'Hafalan Hadis Silaturahmi',
    kelas: 4,
    alokasi_jp: 4
  },

  // Elemen 2: Akidah (Sem 1: 8 butir, No 11-18)
  {
    id: 'tp_84_11',
    no: 11,
    semester: 1,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '1.11 Menjelaskan arti dan hakikat Asmaul Husna: Al-Malik, Al-Aziz, Al-Quddus, As-Salam, dan Al-Mu’min secara tekstual dan kontekstual.',
    tujuan_pembelajaran_sementara: '1.11 Mengenal 5 Asmaul Husna.',
    materi_esensial: 'Asmaul Husna Al-Malik s.d. Al-Mu’min',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_12',
    no: 12,
    semester: 1,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '1.12 Menyajikan contoh perilaku meneladani Asmaul Husna Al-Quddus (menjaga kebersihan hati dan raga) di lingkungan sekolah.',
    tujuan_pembelajaran_sementara: '1.12 Contoh menjaga kebersihan menurut Asmaul Husna.',
    materi_esensial: 'Keteladanan Al-Quddus',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_13',
    no: 13,
    semester: 1,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '1.13 Mengamalkan nilai Asmaul Husna As-Salam dengan menebarkan salam dan menjaga kedamaian antar teman sebaya.',
    tujuan_pembelajaran_sementara: '1.13 Senang mengucapkan salam kepada orang lain.',
    materi_esensial: 'Keteladanan As-Salam',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_14',
    no: 14,
    semester: 1,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '1.14 Meneladani nilai Asmaul Husna Al-Mu’min dengan menjadi pribadi yang amanah, tepercaya, dan memberikan rasa aman.',
    tujuan_pembelajaran_sementara: '1.14 Menjadi anak yang dapat dipercaya.',
    materi_esensial: 'Keteladanan Al-Mu’min',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_15',
    no: 15,
    semester: 1,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '1.15 Menguraikan makna beriman kepada Allah Swt. melalui pengamatan tanda-tanda kebesaran-Nya di alam semesta.',
    tujuan_pembelajaran_sementara: '1.15 Melihat ciptaan Allah di sekitar kita.',
    materi_esensial: 'Bukti Keberadaan Allah Swt.',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_16',
    no: 16,
    semester: 1,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '1.16 Mengidentifikasi sifat-sifat wajib bagi Allah Swt. (Wujud, Qidam, Baqa, Mukhalafatu lil hawaditsi, Qiyamuhu binafsihi).',
    tujuan_pembelajaran_sementara: '1.16 Menghafal sifat wajib Allah yang pertama.',
    materi_esensial: 'Sifat Wajib Bagi Allah Swt. (Salbiyah & Nafsiyah)',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_17',
    no: 17,
    semester: 1,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '1.17 Menyimpulkan konsekuensi logis sifat mustahil bagi Allah sebagai bentuk penguatan tauhid uluhiyyah.',
    tujuan_pembelajaran_sementara: '1.17 Memahami sifat mustahil Allah.',
    materi_esensial: 'Sifat Mustahil Bagi Allah Swt.',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_18',
    no: 18,
    semester: 1,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '1.18 Menunjukkan perilaku tawakal dan syukur sebagai implementasi keimanan terhadap takdir dan kuasa mutlak Allah Swt.',
    tujuan_pembelajaran_sementara: '1.18 Bersikap pasrah dan bersyukur.',
    materi_esensial: 'Implementasi Tauhid Rububiyyah & Ubudiyyah',
    kelas: 4,
    alokasi_jp: 4
  },

  // Elemen 3: Akhlak (Sem 1: 8 butir, No 19-26)
  {
    id: 'tp_84_19',
    no: 19,
    semester: 1,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '1.19 Menjelaskan konsep keragaman suku, bahasa, dan agama sebagai sunnatullah yang harus dihargai dan disyukuri.',
    tujuan_pembelajaran_sementara: '1.19 Memahami perbedaan suku dan agama.',
    materi_esensial: 'Menghargai Keragaman sebagai Sunnatullah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_20',
    no: 20,
    semester: 1,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '1.20 Menunjukkan sikap tasamuh (toleransi) dan saling menghormati perbedaan pendapat saat berdiskusi kelompok di kelas.',
    tujuan_pembelajaran_sementara: '1.20 Belajar tidak memaksakan kehendak ke teman.',
    materi_esensial: 'Sikap Tasamuh (Toleransi)',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_21',
    no: 21,
    semester: 1,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '1.21 Menerapkan adab bergaul yang santun dengan teman yang berbeda latar belakang agama dan kebudayaan.',
    tujuan_pembelajaran_sementara: '1.21 Bergaul baik dengan teman yang beda agama.',
    materi_esensial: 'Etika Pergaulan Antar Umat Beragama',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_22',
    no: 22,
    semester: 1,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '1.22 Menguraikan hakikat akhlak terpuji berbakti kepada orang tua (birrul walidain) melalui tindakan nyata di rumah.',
    tujuan_pembelajaran_sementara: '1.22 Membantu ibu bapak di rumah.',
    materi_esensial: 'Birrul Walidain (Berbakti pada Orang Tua)',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_23',
    no: 23,
    semester: 1,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '1.23 Mendemonstrasikan sikap tawadhu (rendah hati) dan sopan santun kepada guru saat proses belajar mengajar.',
    tujuan_pembelajaran_sementara: '1.23 Menghormati bapak ibu guru di sekolah.',
    materi_esensial: 'Tawadhu dan Adab Terhadap Guru',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_24',
    no: 24,
    semester: 1,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '1.24 Membiasakan sikap jujur (shiddiq) dan berani mengakui kesalahan dalam perkataan serta perbuatan sehari-hari.',
    tujuan_pembelajaran_sementara: '1.24 Tidak boleh berbohong kepada siapapun.',
    materi_esensial: 'Kejujuran dan Integritas Diri',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_25',
    no: 25,
    semester: 1,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '1.25 Mengembangkan kepedulian terhadap kelestarian lingkungan sekolah dengan menghemat air dan memilah sampah.',
    tujuan_pembelajaran_sementara: '1.25 Menjaga kebersihan sekolah dan buang sampah.',
    materi_esensial: 'Akhlak Terhadap Alam dan Lingkungan',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_26',
    no: 26,
    semester: 1,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '1.26 Menghindari perilaku tercela: sombong (takabbur), iri hati (hasad), dan mengolok-olok (istihza\') sesama teman.',
    tujuan_pembelajaran_sementara: '1.26 Tidak boleh mengejek teman lain.',
    materi_esensial: 'Menjauhi Akhlak Mazmumah',
    kelas: 4,
    alokasi_jp: 4
  },

  // Elemen 4: Fikih (Sem 1: 8 butir, No 27-34)
  {
    id: 'tp_84_27',
    no: 27,
    semester: 1,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '1.27 Menjelaskan konsep baligh, batasan usia, dan tanda-tanda biologis baligh bagi laki-laki dan perempuan menurut pandangan fikih.',
    tujuan_pembelajaran_sementara: '1.27 Mengetahui arti tanda kedewasaan dalam Islam.',
    materi_esensial: 'Konsep Baligh dan Tanda-tandanya',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_28',
    no: 28,
    semester: 1,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '1.28 Membedakan antara hadas kecil dan hadas besar serta cara menyucikannya sesuai kaidah syariat Islam.',
    tujuan_pembelajaran_sementara: '1.28 Membedakan kotoran hadas kecil dan besar.',
    materi_esensial: 'Fikih Thaharah: Hadas Kecil & Besar',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_29',
    no: 29,
    semester: 1,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '1.29 Menguraikan rukun, sunnah, dan tata urutan mandi wajib (ghusl) setelah berhadas besar secara sistematis.',
    tujuan_pembelajaran_sementara: '1.29 Belajar cara mandi wajib yang benar.',
    materi_esensial: 'Tata Cara Mandi Wajib (Ghusl)',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_30',
    no: 30,
    semester: 1,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '1.30 Mensimulasikan praktik tayammum sebagai rukhshah (keringanan) pengganti wudhu dan mandi ketika tidak ada air.',
    tujuan_pembelajaran_sementara: '1.30 Praktik tayammum dengan debu.',
    materi_esensial: 'Rukhshah Tayammum',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_31',
    no: 31,
    semester: 1,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '1.31 Menjelaskan konsekuensi taklif (kewajiban ibadah, menutup aurat, dan pertanggungjawaban amal) bagi anak yang telah baligh.',
    tujuan_pembelajaran_sementara: '1.31 Kewajiban shalat dan puasa setelah baligh.',
    materi_esensial: 'Tanggung Jawab Mukallaf Pasca Baligh',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_32',
    no: 32,
    semester: 1,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '1.32 Menelaah ketentuan shalat fardhu lima waktu secara berjamaah beserta keutamaan derajat pahalanya.',
    tujuan_pembelajaran_sementara: '1.32 Keutamaan shalat berjamaah 27 derajat.',
    materi_esensial: 'Shalat Berjamaah dan Masbuq',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_33',
    no: 33,
    semester: 1,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '1.33 Mempraktikkan tata cara shalat rawatib (qabliyah dan ba’diyah) sebagai penyempurna pahala shalat fardhu.',
    tujuan_pembelajaran_sementara: '1.33 Belajar shalat sunnah rawatib sebelum/sesudah shalat.',
    materi_esensial: 'Shalat Sunnah Rawatib',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_34',
    no: 34,
    semester: 1,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '1.34 Membiasakan adab berpakaian islami yang menutup aurat secara sopan dan tidak memperlihatkan lekuk tubuh.',
    tujuan_pembelajaran_sementara: '1.34 Memakai pakaian muslim rapi.',
    materi_esensial: 'Ketentuan Menutup Aurat',
    kelas: 4,
    alokasi_jp: 4
  },

  // Elemen 5: Sejarah Peradaban Islam (SPI) (Sem 1: 8 butir, No 35-42)
  {
    id: 'tp_84_35',
    no: 35,
    semester: 1,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '1.35 Menceritakan kondisi sosial, budaya, dan keagamaan masyarakat jazirah Arab sebelum kedatangan Islam (zaman jahiliyah).',
    tujuan_pembelajaran_sementara: '1.35 Mengetahui kehidupan bangsa Arab kuno jahiliyah.',
    materi_esensial: 'Kondisi Masyarakat Arab Pra-Islam',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_36',
    no: 36,
    semester: 1,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '1.36 Menguraikan faktor-faktor pendorong dan latar belakang peristiwa agung hijrah Nabi Muhammad saw. dari Makkah ke Madinah.',
    tujuan_pembelajaran_sementara: '1.36 Sebab-sebab Nabi Muhammad saw. pindah ke Madinah.',
    materi_esensial: 'Sebab Musabab Hijrah Rasulullah saw.',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_37',
    no: 37,
    semester: 1,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '1.37 Menganalisis ketabahan dan strategi dakwah Rasulullah saw. serta Abu Bakar Ash-Shiddiq saat bersembunyi di Gua Tsur.',
    tujuan_pembelajaran_sementara: '1.37 Cerita Nabi dan Abu Bakar di Gua Tsur.',
    materi_esensial: 'Peristiwa di Gua Tsur dan Perjalanan Hijrah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_38',
    no: 38,
    semester: 1,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '1.38 Menjelaskan penyambutan hangat kaum Anshar di Madinah dan filosofi persaudaraan kaum Muhajirin dan kaum Anshar.',
    tujuan_pembelajaran_sementara: '1.38 Sambutan penduduk Madinah kepada Muhajirin.',
    materi_esensial: 'Ukhuwah Muhajirin dan Anshar',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_39',
    no: 39,
    semester: 1,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '1.39 Menilai fungsi strategis Masjid Nabawi sebagai pusat peribadatan, musyawarah kebangsaan, dan pendidikan umat di Madinah.',
    tujuan_pembelajaran_sementara: '1.39 Pembangunan Masjid Nabawi di Madinah.',
    materi_esensial: 'Pembangunan Masjid Quba dan Masjid Nabawi',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_40',
    no: 40,
    semester: 1,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '1.40 Menelaah butir-butir Piagam Madinah (Mitsaq al-Madinah) sebagai dokumen konsensus toleransi dan keadilan pertama di dunia.',
    tujuan_pembelajaran_sementara: '1.40 Membaca perjanjian Piagam Madinah.',
    materi_esensial: 'Piagam Madinah dan Kerukunan Bangsa',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_41',
    no: 41,
    semester: 1,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '1.41 Mengambil ibrah keteladanan sifat amanah, visioner, dan pantang menyerah dari kepemimpinan Nabi Muhammad saw. di Madinah.',
    tujuan_pembelajaran_sementara: '1.41 Meniru sifat baik Nabi Muhammad.',
    materi_esensial: 'Ibrah Kepemimpinan Rasulullah di Madinah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_42',
    no: 42,
    semester: 1,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '1.42 Menceritakan kembali kisah kepahlawanan Ali bin Abi Thalib yang menggantikan posisi tidur Rasulullah saat dikepung kafir Quraisy.',
    tujuan_pembelajaran_sementara: '1.42 Kisah Ali tidur di ranjang Nabi.',
    materi_esensial: 'Keteladanan Sahabat Ali bin Abi Thalib r.a.',
    kelas: 4,
    alokasi_jp: 4
  },

  // ================= SEMESTER 2 (42 BUTIR) =================
  // Elemen 1: Al-Qur'an Hadis (Sem 2: 10 butir, No 43-52)
  {
    id: 'tp_84_43',
    no: 43,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.1 Membaca Surah At-Tin ayat 1-8 dengan kaidah makharijul huruf dan tajwid mad jaiz munfashil secara tartil.',
    tujuan_pembelajaran_sementara: '2.1 Membaca Surat At-Tin bersama-sama.',
    materi_esensial: 'Q.S. At-Tin Ayat 1-8',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_44',
    no: 44,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.2 Menjelaskan makna kosakata sumpah demi buah Tin, Zaitun, Bukit Sinai, dan Kota Makkah yang aman dalam Q.S. At-Tin.',
    tujuan_pembelajaran_sementara: '2.2 Mengetahui arti buah tin dan bukit sinai.',
    materi_esensial: 'Kosakata & Terjemah Q.S. At-Tin',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_45',
    no: 45,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.3 Menelaah pesan filosofis penciptaan manusia dalam bentuk sebaik-baiknya (ahsani taqwim) dan peringatan jatuh ke derajat terendah.',
    tujuan_pembelajaran_sementara: '2.3 Manusia diciptakan dalam bentuk paling baik.',
    materi_esensial: 'Pesan Pokok Penciptaan Manusia Sempurna',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_46',
    no: 46,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.4 Menghafalkan Q.S. At-Tin ayat 1-8 secara fasih, lancar, dan berulang-ulang hingga mencapai derajat mutqin.',
    tujuan_pembelajaran_sementara: '2.4 Menghafalkan Surat At-Tin.',
    materi_esensial: 'Hafalan Q.S. At-Tin',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_47',
    no: 47,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.5 Mengidentifikasi hukum tajwid nun sukun dan tanwin (Izhhar Halqi, Idgham Bighunnah, Idgham Bilaghunnah, Iqlab, Ikhfa Haqiqi).',
    tujuan_pembelajaran_sementara: '2.5 Mengetahui tanda tajwid nun mati.',
    materi_esensial: 'Hukum Tajwid Nun Sukun dan Tanwin',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_48',
    no: 48,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.6 Menuliskan kaligrafi khat riq’ah atau naskhi untuk potongan ayat Q.S. At-Tin dengan benar dan indah.',
    tujuan_pembelajaran_sementara: '2.6 Menulis indah ayat surat At-Tin.',
    materi_esensial: 'Seni Kaligrafi Al-Qur’an Q.S. At-Tin',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_49',
    no: 49,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.7 Membaca hadis riwayat Tirmidzi tentang memuliakan tetangga dan menjaga tutur kata yang baik atau diam.',
    tujuan_pembelajaran_sementara: '2.7 Membaca hadis berkata baik atau diam.',
    materi_esensial: 'Hadis Berkata Baik dan Adab Bertetangga',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_50',
    no: 50,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.8 Menyajikan contoh penerapan menjaga lisan di media sosial berdasarkan arahan hadis Nabi Muhammad saw.',
    tujuan_pembelajaran_sementara: '2.8 Tidak boleh berkata kotor di HP / internet.',
    materi_esensial: 'Etika Menjaga Lisan Digital',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_51',
    no: 51,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.9 Menghafal hadis pendek tentang tolong-menolong dalam kebaikan dan larangan tolong-menolong dalam dosa.',
    tujuan_pembelajaran_sementara: '2.9 Hafal hadis tolong-menolong.',
    materi_esensial: 'Hadis Ta’awun (Tolong-Menolong)',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_52',
    no: 52,
    semester: 2,
    element: "Al-Qur'an Hadis",
    tujuan_pembelajaran_hasil_analisis: '2.10 Menghubungkan keimanan pada Hari Pembalasan dalam Q.S. At-Tin dengan motivasi gemar beramal saleh tanpa pamrih.',
    tujuan_pembelajaran_sementara: '2.10 Rajin beramal agar dapat pahala.',
    materi_esensial: 'Korelasi Iman dan Amal Saleh',
    kelas: 4,
    alokasi_jp: 4
  },

  // Elemen 2: Akidah (Sem 2: 8 butir, No 53-60)
  {
    id: 'tp_84_53',
    no: 53,
    semester: 2,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '2.11 Menjelaskan kedudukan iman kepada Rasul-Rasul Allah Swt. sebagai rukun iman keempat yang wajib diyakini setulus hati.',
    tujuan_pembelajaran_sementara: '2.11 Mengetahui rukun iman keempat iman kepada Rasul.',
    materi_esensial: 'Iman Kepada Rasul-Rasul Allah Swt.',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_54',
    no: 54,
    semester: 2,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '2.12 Menyebutkan 25 nama Nabi dan Rasul Allah secara urut mulai Nabi Adam a.s. hingga Nabi Muhammad saw.',
    tujuan_pembelajaran_sementara: '2.12 Menghafal 25 nama nabi dengan lagu.',
    materi_esensial: '25 Nama Nabi dan Rasul yang Wajib Diketahui',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_55',
    no: 55,
    semester: 2,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '2.13 Mengidentifikasi 5 Rasul Ulul Azmi (Nuh a.s., Ibrahim a.s., Musa a.s., Isa a.s., Muhammad saw.) beserta mukjizat utamanya.',
    tujuan_pembelajaran_sementara: '2.13 Mengenal 5 rasul yang punya kesabaran tinggi.',
    materi_esensial: 'Rasul Ulul Azmi dan Mukjizatnya',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_56',
    no: 56,
    semester: 2,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '2.14 Menganalisis 4 sifat wajib bagi Rasul (Shiddiq, Amanah, Tabligh, Fathanah) dan 4 sifat mustahil lawannya.',
    tujuan_pembelajaran_sementara: '2.14 Sifat wajib nabi: benar, jujur, pintar.',
    materi_esensial: 'Sifat Wajib dan Mustahil Para Rasul',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_57',
    no: 57,
    semester: 2,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '2.15 Memahami konsep sifat jaiz bagi Rasul (Al-A’radhul Basyariyyah) sebagai manusia biasa yang makan, minum, dan sakit.',
    tujuan_pembelajaran_sementara: '2.15 Mengetahui nabi juga manusia biasa.',
    materi_esensial: 'Sifat Jaiz Para Rasul Allah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_58',
    no: 58,
    semester: 2,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '2.16 Meneladani sifat Fathanah (cerdas dan bijaksana) dalam menuntut ilmu dan menyelesaikan tantangan belajar di sekolah.',
    tujuan_pembelajaran_sementara: '2.16 Rajin belajar agar pintar seperti sifat nabi.',
    materi_esensial: 'Meneladani Sifat Fathanah Rasul',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_59',
    no: 59,
    semester: 2,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '2.17 Menjelaskan makna Asmaul Husna: Al-Bashir, Al-Adl, Al-Azhim, dan Al-Hadi beserta contoh perwujudannya.',
    tujuan_pembelajaran_sementara: '2.17 Menghafal arti Allah Maha Melihat dan Maha Adil.',
    materi_esensial: 'Asmaul Husna Al-Bashir, Al-Adl, Al-Azhim',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_60',
    no: 60,
    semester: 2,
    element: 'Akidah',
    tujuan_pembelajaran_hasil_analisis: '2.18 Menunjukkan sikap istiqamah dan berani membela kebenaran sebagai bukti nyata keteguhan beriman kepada para Rasul.',
    tujuan_pembelajaran_sementara: '2.18 Berani berkata benar seperti nabi.',
    materi_esensial: 'Keteguhan Sikap dan Pembelaan Kebenaran',
    kelas: 4,
    alokasi_jp: 4
  },

  // Elemen 3: Akhlak (Sem 2: 8 butir, No 61-68)
  {
    id: 'tp_84_61',
    no: 61,
    semester: 2,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '2.19 Menjelaskan makna salam dalam ajaran Islam sebagai doa keselamatan, rahmat, dan keberkahan hidup.',
    tujuan_pembelajaran_sementara: '2.19 Mengetahui arti salam Assalamu’alaikum.',
    materi_esensial: 'Makna Filosofis Ucapan Salam',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_62',
    no: 62,
    semester: 2,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '2.20 Mempraktikkan adab mengucap dan menjawab salam sesuai sunnah Nabi kepada guru, orang tua, dan sesama teman.',
    tujuan_pembelajaran_sementara: '2.20 Terbiasa menjawab salam jika dipanggil.',
    materi_esensial: 'Tata Cara dan Sunnah Menebarkan Salam',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_63',
    no: 63,
    semester: 2,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '2.21 Menguraikan pentingnya sikap amanah dalam menjaga barang titipan dan menepati janji yang telah diucapkan.',
    tujuan_pembelajaran_sementara: '2.21 Mengembalikan barang pinjaman teman.',
    materi_esensial: 'Sikap Amanah dan Menepati Janji',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_64',
    no: 64,
    semester: 2,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '2.22 Mendemonstrasikan sikap empati dengan peduli dan menyisihkan sebagian uang saku untuk korban bencana alam.',
    tujuan_pembelajaran_sementara: '2.22 Ikut infaq untuk bencana alam di sekolah.',
    materi_esensial: 'Empati Sosial dan Kedermawanan',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_65',
    no: 65,
    semester: 2,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '2.23 Membiasakan sikap pemaaf dan tidak menyimpan rasa dendam ketika terjadi perselisihan kecil saat bermain.',
    tujuan_pembelajaran_sementara: '2.23 Meminta maaf dan memaafkan teman.',
    materi_esensial: 'Sifat Pemaaf (Al-Afw)',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_66',
    no: 66,
    semester: 2,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '2.24 Menganalisis dampak negatif perilaku ghibah (membicarakan aib orang lain) dan namimah (mengadu domba) dalam pergaulan.',
    tujuan_pembelajaran_sementara: '2.24 Tidak boleh membicarakan kejelekan orang.',
    materi_esensial: 'Menghindari Bahaya Ghibah dan Namimah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_67',
    no: 67,
    semester: 2,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '2.25 Menunjukkan sikap tabayyun (mencari kejelasan) saat mendengar berita atau kabar burung yang belum pasti kebenarannya.',
    tujuan_pembelajaran_sementara: '2.25 Menanyakan dulu kebenaran berita teman.',
    materi_esensial: 'Sikap Kritis Tabayyun',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_68',
    no: 68,
    semester: 2,
    element: 'Akhlak',
    tujuan_pembelajaran_hasil_analisis: '2.26 Menerapkan adab bertamu dan menerima tamu dengan santun, berpakaian rapi, dan memuliakan jamuan.',
    tujuan_pembelajaran_sementara: '2.26 Mengetahui adab saat masuk rumah orang.',
    materi_esensial: 'Etika Bertamu dan Menghormati Tamu',
    kelas: 4,
    alokasi_jp: 4
  },

  // Elemen 4: Fikih (Sem 2: 8 butir, No 69-76)
  {
    id: 'tp_84_69',
    no: 69,
    semester: 2,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '2.27 Menjelaskan syarat wajib, syarat sah, rukun, dan hikmah agung pelaksanaan ibadah shalat Jumat.',
    tujuan_pembelajaran_sementara: '2.27 Belajar shalat jumat di masjid bagi laki-laki.',
    materi_esensial: 'Ketentuan Fikih Shalat Jumat',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_70',
    no: 70,
    semester: 2,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '2.28 Mempraktikkan adab-adab sunnah hari Jumat: mandi, memotong kuku, memakai wewangian, dan mendengarkan khutbah dengan tenang.',
    tujuan_pembelajaran_sementara: '2.28 Sunnah potong kuku dan mendengarkan khotib.',
    materi_esensial: 'Adab dan Sunnah Hari Jumat',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_71',
    no: 71,
    semester: 2,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '2.29 Menelaah ketentuan shalat sunnah duha (waktu, bilangan rakaat, doa) sebagai wujud syukur dan pembuka pintu rezeki.',
    tujuan_pembelajaran_sementara: '2.29 Membiasakan shalat dhuha pagi hari.',
    materi_esensial: 'Shalat Sunnah Duha',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_72',
    no: 72,
    semester: 2,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '2.30 Mempraktikkan tata cara shalat sunnah tahajud di sepertiga malam terakhir sebagai sarana mendekatkan diri kepada Allah.',
    tujuan_pembelajaran_sementara: '2.30 Shalat malam tahajud setelah tidur.',
    materi_esensial: 'Qiyamul Lail dan Shalat Tahajud',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_73',
    no: 73,
    semester: 2,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '2.31 Menguraikan konsep puasa Ramadhan: syarat sah, syarat wajib, rukun, hal-hal yang membatalkan, dan hal yang merusak pahala.',
    tujuan_pembelajaran_sementara: '2.31 Belajar puasa di bulan Ramadhan.',
    materi_esensial: 'Ketentuan Puasa Wajib Ramadhan',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_74',
    no: 74,
    semester: 2,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '2.32 Menjelaskan amalan-amalan utama pengisi bulan Ramadhan: shalat tarawih, witir, tadarus Al-Qur’an, dan iktikaf.',
    tujuan_pembelajaran_sementara: '2.32 Rajin tarawih dan tadarus di masjid.',
    materi_esensial: 'Amalan Sunnah di Bulan Ramadhan',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_75',
    no: 75,
    semester: 2,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '2.33 Mengidentifikasi golongan orang yang diberi keringanan (rukhshah) untuk tidak berpuasa Ramadhan dan cara menggantinya (qadha/fidyah).',
    tujuan_pembelajaran_sementara: '2.33 Siapa saja yang boleh tidak puasa dan bayar fidyah.',
    materi_esensial: 'Rukhshah Puasa dan Qadha Fidyah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_76',
    no: 76,
    semester: 2,
    element: 'Fikih',
    tujuan_pembelajaran_hasil_analisis: '2.34 Menjelaskan pengertian dan ketentuan zakat fitrah sebagai pembersih jiwa bagi orang yang berpuasa dan kepedulian dhuafa.',
    tujuan_pembelajaran_sementara: '2.34 Membayar zakat beras sebelum shalat id.',
    materi_esensial: 'Zakat Fitrah dan Pembagian Mustahik',
    kelas: 4,
    alokasi_jp: 4
  },

  // Elemen 5: Sejarah Peradaban Islam (SPI) (Sem 2: 8 butir, No 77-84)
  {
    id: 'tp_84_77',
    no: 77,
    semester: 2,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '2.35 Menceritakan kisah keteladanan Nabi Musa a.s. dalam menghadapi kesombongan Raja Fir’aun dengan keberanian dan kebenaran.',
    tujuan_pembelajaran_sementara: '2.35 Cerita Nabi Musa melawan Fir’aun.',
    materi_esensial: 'Kisah Perjuangan Nabi Musa a.s.',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_78',
    no: 78,
    semester: 2,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '2.36 Mengambil ibrah dari mukjizat tongkat Nabi Musa a.s. yang membelah Laut Merah sebagai bukti pertolongan Allah bagi orang beriman.',
    tujuan_pembelajaran_sementara: '2.36 Mukjizat tongkat Nabi Musa membelah laut.',
    materi_esensial: 'Mukjizat Nabi Musa a.s. dan Kaum Bani Israil',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_79',
    no: 79,
    semester: 2,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '2.37 Meneladani sikap rendah hati Nabi Sulaiman a.s. meskipun dikaruniai kerajaan megah dan kekuasaan menundukkan angin serta jin.',
    tujuan_pembelajaran_sementara: '2.37 Kisah kekayaan Nabi Sulaiman dan semut.',
    materi_esensial: 'Kisah Keteladanan Nabi Sulaiman a.s.',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_80',
    no: 80,
    semester: 2,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '2.38 Menganalisis dialog bijaksana Nabi Sulaiman a.s. dengan Ratu Balqis yang mengantarkan negeri Saba memeluk ajaran tauhid.',
    tujuan_pembelajaran_sementara: '2.38 Kisah burung hud-hud dan Ratu Balqis.',
    materi_esensial: 'Dakwah Hikmah Nabi Sulaiman kepada Ratu Balqis',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_81',
    no: 81,
    semester: 2,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '2.39 Menceritakan peristiwa bersejarah Pembebasan Kota Makkah (Fathu Makkah) tanpa pertumpahan darah dan dendam.',
    tujuan_pembelajaran_sementara: '2.39 Masuknya kaum muslimin ke Kota Makkah.',
    materi_esensial: 'Peristiwa Bersejarah Fathu Makkah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_82',
    no: 82,
    semester: 2,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '2.40 Meneladani sikap mulia pemaaf agung (pemberian amnesti umum) Nabi Muhammad saw. kepada penduduk Makkah saat Fathu Makkah.',
    tujuan_pembelajaran_sementara: '2.40 Nabi memaafkan musuh-musuh Quraisy.',
    materi_esensial: 'Ahlakul Karimah Saat Kemenangan Fathu Makkah',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_83',
    no: 83,
    semester: 2,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '2.41 Menguraikan pesan-pesan kemanusiaan, kesetaraan hak, dan pelarangan riba dalam Khutbah Wada’ (Haji Perpisahan Rasulullah saw.).',
    tujuan_pembelajaran_sementara: '2.41 Pesan Nabi pada haji terakhir.',
    materi_esensial: 'Pesan Khutbah Wada’ Rasulullah saw.',
    kelas: 4,
    alokasi_jp: 4
  },
  {
    id: 'tp_84_84',
    no: 84,
    semester: 2,
    element: 'Sejarah Peradaban Islam (SPI)',
    tujuan_pembelajaran_hasil_analisis: '2.42 Menyimpulkan prinsip perjuangan estafet dakwah Islam yang diwariskan Rasulullah saw. berupa berpegang teguh pada Al-Qur’an dan Sunnah.',
    tujuan_pembelajaran_sementara: '2.42 Menjaga Al-Qur’an dan hadis sepanjang masa.',
    materi_esensial: 'Warisan Agung Al-Qur’an dan As-Sunnah',
    kelas: 4,
    alokasi_jp: 4
  }
];

/**
 * Helper to group the 84 items into the format needed for CPMappingEntry
 */
export function getPrecise84GroupedByElement(): Record<string, { sem1: string[]; sem2: string[] }> {
  const result: Record<string, { sem1: string[]; sem2: string[] }> = {
    "Al-Qur'an Hadis": { sem1: [], sem2: [] },
    "Akidah": { sem1: [], sem2: [] },
    "Akhlak": { sem1: [], sem2: [] },
    "Fikih": { sem1: [], sem2: [] },
    "Sejarah Peradaban Islam (SPI)": { sem1: [], sem2: [] }
  };

  PRECISE_84_ANALYZED_TP.forEach(item => {
    if (result[item.element]) {
      if (item.semester === 1) {
        result[item.element].sem1.push(item.tujuan_pembelajaran_hasil_analisis);
      } else {
        result[item.element].sem2.push(item.tujuan_pembelajaran_hasil_analisis);
      }
    }
  });

  return result;
}
