import { ProtaItem } from '../types';

export interface GradeCurriculumData {
  grade: number;
  fase: string;
  subjectName: string;
  totalAnnualJP: number;
  semester1DefaultJP: number;
  semester2DefaultJP: number;
  capaianPembelajaran: string;
  chapters: ProtaItem[];
}

export const PAI_CURRICULUM_DATABASE: Record<number, GradeCurriculumData> = {
  1: {
    grade: 1,
    fase: 'Fase A (Kelas 1)',
    subjectName: 'Pendidikan Agama Islam dan Budi Pekerti',
    totalAnnualJP: 136,
    semester1DefaultJP: 68,
    semester2DefaultJP: 68,
    capaianPembelajaran: 'Peserta didik mampu mengenal huruf hijaiyah, harakat, surah pendek (Al-Fatihah, Al-Ikhlas), rukun iman (iman kepada Allah dan Rasul), kalimat thayyibah (Basmalah, Hamdalah), perilaku kasih sayang, rukun Islam, thaharah (bersuci), wudhu, dan meneladani kisah Nabi Adam a.s. dan Nabi Muhammad saw.',
    chapters: [
      {
        id: 'g1_c1',
        semester: 1,
        chapterNumber: 1,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Aku Cinta Al-Qur’an (Huruf Hijaiyah & Surah Al-Fatihah)',
        learningObjectives: [
          'Membiasakan membaca basmalah sebelum beraktivitas',
          'Mengenal huruf hijaiyah bersambung dan harakat dasar (fathah, kasrah, dhammah)',
          'Menghafal Surah Al-Fatihah dengan tartil dan lancar',
          'Memahami pesan pokok Surah Al-Fatihah'
        ],
        allocatedHours: 16,
        subTopics: ['Huruf Hijaiyah dan Harakat', 'Membaca Surah Al-Fatihah', 'Pesan Pokok Al-Fatihah']
      },
      {
        id: 'g1_c2',
        semester: 1,
        chapterNumber: 2,
        element: 'Akidah',
        chapterTitle: 'Mengenal Rukun Iman (Iman kepada Allah dan Rasul)',
        learningObjectives: [
          'Menyebutkan rukun iman secara urut',
          'Meyakini adanya Allah Swt. melalui ciptaan-Nya di alam semesta',
          'Mengenal Asmaul Husna: Ar-Rahman dan Ar-Rahim beserta artinya',
          'Mengenal Nabi dan Rasul sebagai utusan Allah'
        ],
        allocatedHours: 12,
        subTopics: ['Rukun Iman', 'Allah Maha Pengasih & Maha Penyayang', 'Nabi dan Rasul Utusan Allah']
      },
      {
        id: 'g1_c3',
        semester: 1,
        chapterNumber: 3,
        element: 'Akhlak',
        chapterTitle: 'Aku Anak Saleh (Perilaku Kasih Sayang & Bersyukur)',
        learningObjectives: [
          'Membiasakan mengucapkan kalimat thayyibah Basmalah dan Hamdalah',
          'Menunjukkan sikap santun dan patuh kepada orang tua dan guru',
          'Membiasakan hidup bersih, rapi, dan menyayangi sesama teman'
        ],
        allocatedHours: 12,
        subTopics: ['Kalimat Thayyibah', 'Hormat & Patuh', 'Kasih Sayang terhadap Teman']
      },
      {
        id: 'g1_c4',
        semester: 1,
        chapterNumber: 4,
        element: 'Fikih',
        chapterTitle: 'Mengenal Rukun Islam dan Bersuci (Thaharah)',
        learningObjectives: [
          'Menyebutkan lima rukun Islam dengan benar',
          'Melafalkan dua kalimat syahadat dan artinya',
          'Mengenal arti bersuci (thaharah), istinja, dan tata cara mandi/cebok yang benar',
          'Mempraktikkan adab buang air kecil dan besar'
        ],
        allocatedHours: 16,
        subTopics: ['Rukun Islam & Syahadatain', 'Arti Bersuci (Thaharah)', 'Adab di Kamar Mandi']
      },
      {
        id: 'g1_c5',
        semester: 1,
        chapterNumber: 5,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Keteladanan Nabi Adam a.s.',
        learningObjectives: [
          'Menceritakan kisah Nabi Adam a.s. sebagai manusia pertama',
          'Meneladani sikap taubat dan pantang menyerah Nabi Adam a.s.',
          'Membiasakan meminta maaf ketika melakukan kesalahan'
        ],
        allocatedHours: 12,
        subTopics: ['Penciptaan Nabi Adam a.s.', 'Ketaatan & Kesalahan Nabi Adam', 'Keteladanan Memaafkan']
      },
      // SEMESTER 2
      {
        id: 'g1_c6',
        semester: 2,
        chapterNumber: 6,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Surah Al-Ikhlas dan Kalimat Tayibah',
        learningObjectives: [
          'Membaca dan menghafal Surah Al-Ikhlas dengan makhraj yang benar',
          'Menjelaskan pesan ketauhidan dalam Surah Al-Ikhlas',
          'Melafalkan kalimat thayyibah Takbir dan Tahlil dalam kehidupan sehari-hari'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca Surah Al-Ikhlas', 'Pesan Tauhid Surah Al-Ikhlas', 'Takbir dan Tahlil']
      },
      {
        id: 'g1_c7',
        semester: 2,
        chapterNumber: 7,
        element: 'Akidah',
        chapterTitle: 'Asmaul Husna: Al-Malik dan Al-Quddus',
        learningObjectives: [
          'Mengenal arti Asmaul Husna Al-Malik (Maharaja) dan Al-Quddus (Mahasuci)',
          'Meneladani sifat Al-Malik dengan menahan diri dari sifat serakah',
          'Meneladani sifat Al-Quddus dengan menjaga kesucian hati dan raga'
        ],
        allocatedHours: 12,
        subTopics: ['Mengenal Al-Malik', 'Mengenal Al-Quddus', 'Penerapan dalam Keseharian']
      },
      {
        id: 'g1_c8',
        semester: 2,
        chapterNumber: 8,
        element: 'Akhlak',
        chapterTitle: 'Aku Suka Berterima Kasih dan Disiplin',
        learningObjectives: [
          'Membiasakan berterima kasih kepada orang lain',
          'Menunjukkan sikap disiplin dalam waktu belajar dan ibadah',
          'Membiasakan adab makan dan minum yang Islami'
        ],
        allocatedHours: 12,
        subTopics: ['Sikap Berterima Kasih', 'Disiplin Waktu', 'Adab Makan dan Minum']
      },
      {
        id: 'g1_c9',
        semester: 2,
        chapterNumber: 9,
        element: 'Fikih',
        chapterTitle: 'Mengenal dan Mempraktikkan Wudhu',
        learningObjectives: [
          'Mengetahui syarat dan rukun wudhu',
          'Menghafal doa sebelum dan sesudah wudhu',
          'Mempraktikkan gerakan wudhu secara tertib dan berurutan'
        ],
        allocatedHours: 16,
        subTopics: ['Rukun & Sunnah Wudhu', 'Doa Wudhu', 'Praktik Berwudhu']
      },
      {
        id: 'g1_c10',
        semester: 2,
        chapterNumber: 10,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Keteladanan Nabi Muhammad saw. Masa Kanak-Kanak',
        learningObjectives: [
          'Menceritakan kelahiran dan masa kecil Nabi Muhammad saw.',
          'Meneladani sifat jujur (Al-Amin) dan mandiri Nabi Muhammad saw.',
          'Mencintai Nabi Muhammad saw. dengan membaca shalawat'
        ],
        allocatedHours: 12,
        subTopics: ['Kelahiran Nabi Muhammad saw.', 'Masa Kanak-Kanak & Remaja', 'Gelar Al-Amin']
      }
    ]
  },
  2: {
    grade: 2,
    fase: 'Fase A (Kelas 2)',
    subjectName: 'Pendidikan Agama Islam dan Budi Pekerti',
    totalAnnualJP: 136,
    semester1DefaultJP: 68,
    semester2DefaultJP: 68,
    capaianPembelajaran: 'Peserta didik mampu melafalkan dan menghafal Surah An-Nas dan Al-Kautsar, meyakini Asmaul Husna (Al-Alim, Al-Khabir), membiasakan perilaku empati dan tolong menolong, memahami tata cara shalat fardhu 5 waktu, dan meneladani kisah Nabi Nuh a.s. dan Nabi Ibrahim a.s.',
    chapters: [
      {
        id: 'g2_c1',
        semester: 1,
        chapterNumber: 1,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Membaca dan Menghafal Surah An-Nas',
        learningObjectives: [
          'Membaca Surah An-Nas dengan makhraj huruf yang tepat',
          'Menghafalkan Surah An-Nas secara lancar',
          'Memahami pesan perlindungan diri dari godaan setan dan kejahatan manusia'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca Surah An-Nas', 'Hafalan Surah An-Nas', 'Pesan Pokok An-Nas']
      },
      {
        id: 'g2_c2',
        semester: 1,
        chapterNumber: 2,
        element: 'Akidah',
        chapterTitle: 'Mengenal Sifat Allah melalui Asmaul Husna (Al-Alim, Al-Khabir)',
        learningObjectives: [
          'Meyakini Allah Maha Mengetahui (Al-Alim) dan Maha Teliti (Al-Khabir)',
          'Menunjukkan perilaku jujur dan berhati-hati dalam perbuatan',
          'Meneladani Asmaul Husna dalam kejujuran saat belajar'
        ],
        allocatedHours: 12,
        subTopics: ['Makna Al-Alim & Al-Khabir', 'Penerapan Sifat Kejujuran', 'Hikmah Mengingat Allah']
      },
      {
        id: 'g2_c3',
        semester: 1,
        chapterNumber: 3,
        element: 'Akhlak',
        chapterTitle: 'Perilaku Terpuji: Sayang Teman dan Saling Tolong Menolong',
        learningObjectives: [
          'Membiasakan sikap empati kepada orang lain yang terkena musibah',
          'Mempraktikkan sikap tolong-menolong dalam kebaikan',
          'Menghindari permusuhan dan bullying di lingkungan sekolah'
        ],
        allocatedHours: 12,
        subTopics: ['Sikap Empati', 'Tolong Menolong dalam Kebaikan', 'Menjaga Kerukunan']
      },
      {
        id: 'g2_c4',
        semester: 1,
        chapterNumber: 4,
        element: 'Fikih',
        chapterTitle: 'Mengenal Shalat Fardhu 5 Waktu dan Gerakannya',
        learningObjectives: [
          'Menyebutkan nama-nama shalat fardhu beserta jumlah rakaatnya',
          'Mengenal waktu pelaksanaan shalat fardhu',
          'Mempraktikkan gerakan dasar shalat (takbir, ruku, sujud, duduk tasyahud)'
        ],
        allocatedHours: 16,
        subTopics: ['Nama & Jumlah Rakaat Shalat', 'Waktu Shalat Fardhu', 'Praktik Gerakan Shalat']
      },
      {
        id: 'g2_c5',
        semester: 1,
        chapterNumber: 5,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Keteladanan Nabi Nuh a.s.',
        learningObjectives: [
          'Menceritakan ketabahan dakwah Nabi Nuh a.s. dan pembuatan bahtera',
          'Meneladani sifat sabar dan pantang putus asa',
          'Menghormati orang tua dan tidak durhaka seperti kisah Kan’an'
        ],
        allocatedHours: 12,
        subTopics: ['Dakwah Nabi Nuh a.s.', 'Kisah Bahtera Nabi Nuh', 'Pelajaran Ketabahan']
      },
      // SEMESTER 2
      {
        id: 'g2_c6',
        semester: 2,
        chapterNumber: 6,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Surah Al-Kautsar dan Nikmat Allah',
        learningObjectives: [
          'Membaca dan menghafalkan Surah Al-Kautsar',
          'Memahami pesan rasa syukur atas segala karunia Allah',
          'Membiasakan ibadah shalat dan berkurban'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca Surah Al-Kautsar', 'Menghafal Al-Kautsar', 'Makna Bersyukur']
      },
      {
        id: 'g2_c7',
        semester: 2,
        chapterNumber: 7,
        element: 'Akidah',
        chapterTitle: 'Mengenal Malaikat-Malaikat Allah Swt.',
        learningObjectives: [
          'Menyebutkan 10 malaikat yang wajib diketahui dan tugas-tugasnya',
          'Meyakini adanya malaikat pencatat amal (Raqib dan Atid)',
          'Membiasakan selalu berbuat baik karena diawasi malaikat'
        ],
        allocatedHours: 12,
        subTopics: ['10 Nama Malaikat & Tugasnya', 'Malaikat Raqib & Atid', 'Pengaruh Iman kepada Malaikat']
      },
      {
        id: 'g2_c8',
        semester: 2,
        chapterNumber: 8,
        element: 'Akhlak',
        chapterTitle: 'Sikap Berani Mengakui Kesalahan dan Memaafkan',
        learningObjectives: [
          'Menunjukkan sikap ksatria dan berani meminta maaf saat bersalah',
          'Membiasakan sifat pemaaf terhadap kesalahan orang lain',
          'Menjaga lisan dari perkataan dusta dan kasar'
        ],
        allocatedHours: 12,
        subTopics: ['Berani Meminta Maaf', 'Mulia dengan Pemaaf', 'Menjaga Lisan']
      },
      {
        id: 'g2_c9',
        semester: 2,
        chapterNumber: 9,
        element: 'Fikih',
        chapterTitle: 'Bacaan Doa dan Praktik Shalat Fardhu',
        learningObjectives: [
          'Melafalkan bacaan shalat mulai dari takbiratul ihram hingga salam',
          'Mempraktikkan shalat fardhu secara lengkap dan tertib',
          'Mengetahui hal-hal yang membatalkan shalat'
        ],
        allocatedHours: 16,
        subTopics: ['Bacaan Shalat Fardhu', 'Praktik Shalat Lengkap', 'Hal yang Membatalkan Shalat']
      },
      {
        id: 'g2_c10',
        semester: 2,
        chapterNumber: 10,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Keteladanan Nabi Ibrahim a.s.',
        learningObjectives: [
          'Menceritakan pencarian kebenaran Nabi Ibrahim a.s. dan keberaniannya meruntuhkan berhala',
          'Meneladani keteguhan iman dan kepatuhan kepada Allah Swt.',
          'Mengenal asal-usul ibadah kurban dan pembangunan Ka’bah'
        ],
        allocatedHours: 12,
        subTopics: ['Pencarian Tuhan Nabi Ibrahim', 'Ujian Keimanan & Kurban', 'Pembangunan Ka’bah']
      }
    ]
  },
  3: {
    grade: 3,
    fase: 'Fase B (Kelas 3)',
    subjectName: 'Pendidikan Agama Islam dan Budi Pekerti',
    totalAnnualJP: 136,
    semester1DefaultJP: 68,
    semester2DefaultJP: 68,
    capaianPembelajaran: 'Peserta didik mampu melafalkan, menghafal, dan memahami hukum tajwid dasar (alif lam syamsiyah & qamariyah) pada Surah Al-Falaq dan An-Nasr; memahami sifat-sifat wajib Allah dan Kitab-Kitab Allah; berperilaku tawadhu, ikhlas, dan peduli lingkungan; memahami puasa Ramadhan dan shalat rawatib; serta meneladani kisah Nabi Musa a.s. dan Nabi Muhammad saw.',
    chapters: [
      {
        id: 'g3_c1',
        semester: 1,
        chapterNumber: 1,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Membaca Surah Al-Falaq dan Hukum Alif Lam',
        learningObjectives: [
          'Membaca Surah Al-Falaq dengan tartil sesuai tajwid',
          'Mengenal perbedaan Alif Lam Syamsiyah dan Alif Lam Qamariyah',
          'Menghafalkan Surah Al-Falaq dan memahami perlindungan dari kejahatan waktu fajar/malam'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca & Menghafal Al-Falaq', 'Hukum Tajwid Al-Syamsiyah & Al-Qamariyah', 'Makna Kandungan Al-Falaq']
      },
      {
        id: 'g3_c2',
        semester: 1,
        chapterNumber: 2,
        element: 'Akidah',
        chapterTitle: 'Mengenal Sifat Wajib Allah Swt. dan Asmaul Husna (Al-Wahhab, Al-Kabir)',
        learningObjectives: [
          'Menyebutkan 20 sifat wajib bagi Allah Swt.',
          'Meyakini Allah Maha Pemberi (Al-Wahhab) dan Maha Besar (Al-Kabir)',
          'Membiasakan sikap bersyukur dan rendah hati'
        ],
        allocatedHours: 12,
        subTopics: ['Sifat Wajib bagi Allah', 'Al-Wahhab & Al-Kabir', 'Perilaku Tawadhu']
      },
      {
        id: 'g3_c3',
        semester: 1,
        chapterNumber: 3,
        element: 'Akhlak',
        chapterTitle: 'Perilaku Terpuji: Peduli Sesama dan Menjaga Lingkungan',
        learningObjectives: [
          'Menjelaskan pentingnya menjaga kebersihan alam dan peduli lingkungan sekolah',
          'Membiasakan membuang sampah pada tempatnya dan hemat air',
          'Menunjukkan kepedulian terhadap fakir miskin dan teman yang kekurangan'
        ],
        allocatedHours: 12,
        subTopics: ['Adab Terhadap Lingkungan Alam', 'Hemat Sumber Daya', 'Kepedulian Sosial']
      },
      {
        id: 'g3_c4',
        semester: 1,
        chapterNumber: 4,
        element: 'Fikih',
        chapterTitle: 'Ibadah Shalat Sunnah Rawatib dan Shalat Berjamaah',
        learningObjectives: [
          'Memahami keutamaan shalat berjamaah dibanding shalat munfarid',
          'Mengetahui tata cara masbuq dalam shalat berjamaah',
          'Mengenal macam-macam shalat sunnah rawatib qabliyah dan badiyah'
        ],
        allocatedHours: 16,
        subTopics: ['Keutamaan Shalat Berjamaah', 'Ketentuan Makmum Masbuq', 'Shalat Sunnah Rawatib']
      },
      {
        id: 'g3_c5',
        semester: 1,
        chapterNumber: 5,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Keteladanan Nabi Musa a.s.',
        learningObjectives: [
          'Menceritakan kelahiran Nabi Musa a.s. dan perjuangannya menghadapi Fir’aun',
          'Meneladani keberanian membela kebenaran dan keadilan',
          'Memahami mukjizat tongkat Nabi Musa a.s.'
        ],
        allocatedHours: 12,
        subTopics: ['Kisah Bayi Musa di Sungai Nil', 'Dakwah kepada Fir’aun', 'Mukjizat Membelah Laut Merah']
      },
      // SEMESTER 2
      {
        id: 'g3_c6',
        semester: 2,
        chapterNumber: 6,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Surah An-Nasr dan Pesan Kemenangan',
        learningObjectives: [
          'Membaca dan menghafalkan Surah An-Nasr dengan tartil',
          'Memahami pesan pertolongan Allah saat peristiwa Fathu Makkah',
          'Membiasakan membaca tasbih, tahmid, dan istighfar'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca & Menghafal Surah An-Nasr', 'Kandungan Surah An-Nasr', 'Dzikir Istighfar & Tasbih']
      },
      {
        id: 'g3_c7',
        semester: 2,
        chapterNumber: 7,
        element: 'Akidah',
        chapterTitle: 'Mengenal Kitab-Kitab Suci Allah dan Para Penerimanya',
        learningObjectives: [
          'Menyebutkan 4 kitab suci Allah (Taurat, Zabur, Injil, Al-Qur’an) dan para Nabi penerimanya',
          'Meyakini Al-Qur’an sebagai kitab suci penutup dan pedoman hidup sepanjang masa',
          'Membiasakan membaca dan mendengarkan ayat suci Al-Qur’an'
        ],
        allocatedHours: 12,
        subTopics: ['4 Kitab Suci & Penerimanya', 'Kedudukan Al-Qur’an', 'Hikmah Beriman kepada Kitab Allah']
      },
      {
        id: 'g3_c8',
        semester: 2,
        chapterNumber: 8,
        element: 'Akhlak',
        chapterTitle: 'Sikap Ikhlas dan Membalas Kebaikan dengan Kebaikan',
        learningObjectives: [
          'Memahami makna ikhlas semata-mata mengharap ridha Allah',
          'Menghindari sifat riya (pamer) dan sum’ah',
          'Membiasakan selalu berbuat baik tanpa pamrih'
        ],
        allocatedHours: 12,
        subTopics: ['Makna Ikhlas Beramal', 'Bahaya Riya & Pamer', 'Penerapan Ikhlas Sehari-hari']
      },
      {
        id: 'g3_c9',
        semester: 2,
        chapterNumber: 9,
        element: 'Fikih',
        chapterTitle: 'Indahnya Ibadah Puasa Ramadhan',
        learningObjectives: [
          'Menjelaskan syarat, rukun, dan sunnah puasa Ramadhan',
          'Mengetahui amalan utama di bulan Ramadhan (tarawih, tadarus, sedekah)',
          'Memahami hal-hal yang membatalkan puasa dan hikmah puasa bagi kesehatan jasmani & rohani'
        ],
        allocatedHours: 16,
        subTopics: ['Syarat & Rukun Puasa Ramadhan', 'Amalan Utama Bulan Ramadhan', 'Hikmah Ibadah Puasa']
      },
      {
        id: 'g3_c10',
        semester: 2,
        chapterNumber: 10,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Keteladanan Nabi Sulaiman a.s.',
        learningObjectives: [
          'Menceritakan kecerdasan dan kebijaksanaan Nabi Sulaiman a.s.',
          'Meneladani sikap rendah hati meskipun memiliki kekuasaan dan kekayaan melimpah',
          'Menyayangi sesama makhluk hidup (hewan dan tumbuhan)'
        ],
        allocatedHours: 12,
        subTopics: ['Kerajaan Nabi Sulaiman a.s.', 'Kebijaksanaan & Kerendahan Hati', 'Keteladanan Memimpin']
      }
    ]
  },
  4: {
    grade: 4,
    fase: 'Fase B (Kelas 4)',
    subjectName: 'Pendidikan Agama Islam dan Budi Pekerti',
    totalAnnualJP: 136,
    semester1DefaultJP: 68,
    semester2DefaultJP: 68,
    capaianPembelajaran: 'Peserta didik mampu membaca, menghafal, dan memahami hukum tajwid nun sukun/tanwin pada Surah Al-Hujurat ayat 13 dan Surah At-Tin; memahami Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Mu’min, Al-Aziz); memahami konsep keragaman sebagai sunnatullah; menyambut usia baligh; memahami shalat jumat dan dhuha; serta meneladani peristiwa hijrah Nabi Muhammad saw. ke Madinah.',
    chapters: [
      {
        id: 'g4_c1',
        semester: 1,
        chapterNumber: 1,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Mari Mengaji Surah Al-Hujurat Ayat 13 (Keragaman Manusia)',
        learningObjectives: [
          'Membaca Q.S. Al-Hujurat/49: 13 dengan tartil sesuai kaidah tajwid',
          'Mengenal hukum bacaan nun sukun dan tanwin (Izhar, Idgham, Ikhfa, Iqlab)',
          'Memahami pesan keragaman suku, bangsa, dan toleransi sebagai sunnatullah',
          'Menghafalkan Q.S. Al-Hujurat ayat 13 dengan lancar'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca Q.S. Al-Hujurat: 13', 'Hukum Nun Sukun/Tanwin', 'Pesan Toleransi & Keragaman']
      },
      {
        id: 'g4_c2',
        semester: 1,
        chapterNumber: 2,
        element: 'Akidah',
        chapterTitle: 'Teladan Mulia Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Mu’min, Al-Aziz)',
        learningObjectives: [
          'Menjelaskan arti 5 Asmaul Husna: Al-Malik, Al-Quddus, As-Salam, Al-Mu’min, Al-Aziz',
          'Meyakini keagungan Allah yang tercermin dalam Asmaul Husna tersebut',
          'Menerapkan nilai mandiri, menjaga kebersihan, menyebarkan salam, dan menjaga ketertiban'
        ],
        allocatedHours: 12,
        subTopics: ['Makna 5 Asmaul Husna', 'Nilai Keteladanan Moral', 'Penerapan di Lingkungan Sekolah']
      },
      {
        id: 'g4_c3',
        semester: 1,
        chapterNumber: 3,
        element: 'Akhlak',
        chapterTitle: 'Indahnya Saling Menghargai dalam Keragaman',
        learningObjectives: [
          'Menghargai perbedaan suku, ras, budaya, dan agama dalam masyarakat majemuk',
          'Menerapkan sikap tolong-menolong tanpa membeda-bedakan latar belakang',
          'Mewujudkan persaudaraan kebangsaan (Ukhuwah Wathaniyah)'
        ],
        allocatedHours: 12,
        subTopics: ['Keragaman sebagai Anugerah', 'Sikap Saling Menghargai', 'Membangun Kerukunan Warga']
      },
      {
        id: 'g4_c4',
        semester: 1,
        chapterNumber: 4,
        element: 'Fikih',
        chapterTitle: 'Menyambut Usia Baligh (Tanda Fisik & Kewajiban Syariat)',
        learningObjectives: [
          'Menyebutkan tanda-tanda usia baligh menurut pandangan ilmu fiqih dan ilmu biologi',
          'Menjelaskan konsekuensi baligh sebagai mukallaf (kewajiban ibadah penuh)',
          'Mempraktikkan tata cara mandi wajib setelah hadas besar'
        ],
        allocatedHours: 16,
        subTopics: ['Tanda Usia Baligh Fiqih & Biologi', 'Kewajiban Setelah Baligh', 'Tata Cara Mandi Wajib']
      },
      {
        id: 'g4_c5',
        semester: 1,
        chapterNumber: 5,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Hijrah Nabi Muhammad saw. ke Madinah',
        learningObjectives: [
          'Menceritakan sebab-sebab dan peristiwa hijrah Rasulullah saw. ke Yatsrib (Madinah)',
          'Meneladani ketabahan Abu Bakar Ash-Shiddiq dan keberanian Ali bin Abi Thalib',
          'Memahami strategi dakwah dan persaudaraan Muhajirin dan Anshar'
        ],
        allocatedHours: 12,
        subTopics: ['Latar Belakang Hijrah', 'Perjalanan Hijrah & Gua Tsur', 'Persaudaraan Muhajirin-Anshar']
      },
      // SEMESTER 2
      {
        id: 'g4_c6',
        semester: 2,
        chapterNumber: 6,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Mengkaji Surah At-Tin dan Hadis Silaturahmi',
        learningObjectives: [
          'Membaca dan menghafal Surah At-Tin dengan tartil dan tajwid',
          'Memahami kemuliaan manusia sebagai ciptaan terbaik (fi ahsani taqwim)',
          'Memahami hadis tentang keutamaan menyambung tali silaturahmi'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca & Hafalan Surah At-Tin', 'Kandungan Q.S. At-Tin', 'Hadis Keutamaan Silaturahmi']
      },
      {
        id: 'g4_c7',
        semester: 2,
        chapterNumber: 7,
        element: 'Akidah',
        chapterTitle: 'Beriman kepada Rasul-Rasul Allah Swt.',
        learningObjectives: [
          'Menjelaskan pengertian Rasul dan sifat-sifat wajib bagi Rasul (Siddiq, Amanah, Tabligh, Fathanah)',
          'Menyebutkan 25 nama Nabi dan Rasul serta Rasul Ulul Azmi',
          'Meneladani keteguhan dan sifat mulia para Rasul dalam kehidupan sehari-hari'
        ],
        allocatedHours: 12,
        subTopics: ['Pengertian & Sifat Wajib Rasul', '25 Nabi & Rasul Ulul Azmi', 'Keteladanan Sifat Rasul']
      },
      {
        id: 'g4_c8',
        semester: 2,
        chapterNumber: 8,
        element: 'Akhlak',
        chapterTitle: 'Aku Gemar Berbakti kepada Orang Tua dan Guru',
        learningObjectives: [
          'Menjelaskan kewajiban birrul walidain (berbakti kepada orang tua) dan menghormati guru',
          'Mempraktikkan adab santun saat berbicara dan bersikap kepada guru dan orang tua',
          'Mendoakan keselamatan dan kebaikan untuk kedua orang tua dan guru'
        ],
        allocatedHours: 12,
        subTopics: ['Keutamaan Birrul Walidain', 'Adab Menghormati Guru', 'Doa untuk Orang Tua']
      },
      {
        id: 'g4_c9',
        semester: 2,
        chapterNumber: 9,
        element: 'Fikih',
        chapterTitle: 'Ketentuan Shalat Jumat, Shalat Duha, dan Shalat Tahajud',
        learningObjectives: [
          'Menjelaskan syarat, rukun, dan keutamaan ibadah Shalat Jumat',
          'Mempraktikkan adab saat mendengarkan khutbah Jumat',
          'Mengenal keutamaan dan tata cara pelaksanaan Shalat Duha dan Shalat Tahajud'
        ],
        allocatedHours: 16,
        subTopics: ['Ketentuan Shalat Jumat', 'Adab Khutbah Jumat', 'Shalat Sunnah Duha & Tahajud']
      },
      {
        id: 'g4_c10',
        semester: 2,
        chapterNumber: 10,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Membangun Peradaban di Madinah (Piagam Madinah & Masjid Nabawi)',
        learningObjectives: [
          'Menceritakan pembangunan Masjid Nabawi sebagai pusat ibadah dan pembinaan umat',
          'Memahami nilai-nilai toleransi dan persatuan dalam Piagam Madinah',
          'Menerapkan semangat persatuan dalam kehidupan berbangsa dan bernegara'
        ],
        allocatedHours: 12,
        subTopics: ['Pembangunan Masjid Nabawi', 'Isi & Nilai Piagam Madinah', 'Karakter Masyarakat Madani']
      }
    ]
  },
  5: {
    grade: 5,
    fase: 'Fase C (Kelas 5)',
    subjectName: 'Pendidikan Agama Islam dan Budi Pekerti',
    totalAnnualJP: 136,
    semester1DefaultJP: 68,
    semester2DefaultJP: 68,
    capaianPembelajaran: 'Peserta didik mampu membaca, menghafal, dan memahami hukum tajwid mim sukun pada Surah Al-Ma’un dan Surah Al-Balad; meyakini adanya Hari Akhir (Kiamat) dan peristiwa alam gaib; menerapkan perilaku hidup hemat, ikhlas, dan menyayangi anak yatim; memahami ketentuan zakat fitrah, infaq, dan sedekah; serta meneladani perjuangan Fathu Makkah dan Haji Wada’.',
    chapters: [
      {
        id: 'g5_c1',
        semester: 1,
        chapterNumber: 1,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Menyayangi Anak Yatim melalui Surah Al-Ma’un',
        learningObjectives: [
          'Membaca Surah Al-Ma’un dengan tartil dan tajwid yang tepat (Hukum Mim Sukun: Ikhfa Syafawi, Idgham Mimi, Izhar Syafawi)',
          'Menghafal Surah Al-Ma’un dengan fasih',
          'Memahami ciri pendusta agama: menghardik anak yatim dan enggan menolong dengan barang berguna'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca & Hafalan Surah Al-Ma’un', 'Hukum Tajwid Mim Sukun', 'Pesan Peduli Anak Yatim']
      },
      {
        id: 'g5_c2',
        semester: 1,
        chapterNumber: 2,
        element: 'Akidah',
        chapterTitle: 'Mengenal Asmaul Husna: Al-Qawiyy, Al-Qayyum, Al-Muhyi, Al-Mumit, Al-Ba’its',
        learningObjectives: [
          'Memahami makna 5 Asmaul Husna tentang kekuasaan dan kehidupan dari Allah Swt.',
          'Meyakini bahwa Allah Maha Menghidupkan, Mematikan, dan Membangkitkan manusia',
          'Membiasakan sikap mandiri, tangguh, dan menyiapkan bekal amal kebaikan'
        ],
        allocatedHours: 12,
        subTopics: ['Makna 5 Asmaul Husna', 'Refleksi Kehidupan & Kematian', 'Membangun Jiwa Tangguh']
      },
      {
        id: 'g5_c3',
        semester: 1,
        chapterNumber: 3,
        element: 'Akhlak',
        chapterTitle: 'Perilaku Terpuji: Hidup Sederhana, Dermawan, dan Menghindari Riya',
        learningObjectives: [
          'Menjelaskan bahaya gaya hidup boros (israf) dan kikir (bakhil)',
          'Membiasakan perilaku hemat, gemar menabung, dan suka berbagi kepada yang membutuhkan',
          'Menjaga kemurnian niat dalam beramal shalih'
        ],
        allocatedHours: 12,
        subTopics: ['Bahaya Israf & Tabzir', 'Keutamaan Sedekah Sembunyi', 'Membiasakan Hidup Hemat']
      },
      {
        id: 'g5_c4',
        semester: 1,
        chapterNumber: 4,
        element: 'Fikih',
        chapterTitle: 'Indahnya Berbagi melalui Zakat Fitrah, Infaq, dan Sedekah',
        learningObjectives: [
          'Menjelaskan ketentuan zakat fitrah (syarat, rukun, waktu, takaran, dan 8 golongan mustahiq)',
          'Membedakan pengertian dan ketentuan zakat, infaq, sedekah, dan hadiah',
          'Mempraktikkan simulasi penghitungan dan penyaluran zakat fitrah di sekolah'
        ],
        allocatedHours: 16,
        subTopics: ['Ketentuan Zakat Fitrah', 'Infaq, Sedekah, dan Hadiah', '8 Golongan Penerima Zakat']
      },
      {
        id: 'g5_c5',
        semester: 1,
        chapterNumber: 5,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Keteladanan Peristiwa Fathu Makkah (Kemenangan Damai)',
        learningObjectives: [
          'Menceritakan latar belakang terjadinya peristiwa pembebasan Kota Makkah (Fathu Makkah)',
          'Meneladani sikap pemaaf Rasulullah saw. yang tidak menaruh dendam kepada kaum Quraisy',
          'Menghargai nilai-nilai perdamaian dan rekonsiliasi kebangsaan'
        ],
        allocatedHours: 12,
        subTopics: ['Latar Belakang Fathu Makkah', 'Sikap Pemaaf Rasulullah saw.', 'Pembersihan Ka’bah dari Berhala']
      },
      // SEMESTER 2
      {
        id: 'g5_c6',
        semester: 2,
        chapterNumber: 6,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Mengkaji Surah Al-Balad dan Kepedulian Sosial',
        learningObjectives: [
          'Membaca dan menghafal Surah Al-Balad dengan makhraj dan tajwid yang baik',
          'Memahami pesan mendaki jalan terjal (aqabah): memerdekakan budak dan memberi makan orang kelaparan',
          'Membiasakan perilaku tolong-menolong kepada kaum dhuafa'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca & Hafalan Surah Al-Balad', 'Kandungan Jalan Terjal Kebajikan', 'Aksi Peduli Sesama']
      },
      {
        id: 'g5_c7',
        semester: 2,
        chapterNumber: 7,
        element: 'Akidah',
        chapterTitle: 'Meyakini Adanya Hari Akhir (Kiamat Sugra & Kubra)',
        learningObjectives: [
          'Menjelaskan pengertian Hari Akhir dan pembagian Kiamat Sugra (kecil) dan Kubra (besar)',
          'Menyebutkan tanda-tanda datangnya hari kiamat dan alam barzakh/mahsyar',
          'Menumbuhkan kesadaran mawas diri dan meningkatkan kualitas amal ibadah'
        ],
        allocatedHours: 12,
        subTopics: ['Kiamat Sugra dan Kiamat Kubra', 'Tahapan Peristiwa Hari Akhir', 'Hikmah Beriman Hari Kiamat']
      },
      {
        id: 'g5_c8',
        semester: 2,
        chapterNumber: 8,
        element: 'Akhlak',
        chapterTitle: 'Meneladani Sikap Qana’ah dan Tasamuh (Toleransi Beragama)',
        learningObjectives: [
          'Memahami pengertian dan keutamaan sikap qana’ah (merasa cukup dengan rezeki Allah)',
          'Menerapkan sikap tasamuh (toleransi) antarumat beragama tanpa mencampuradukkan akidah',
          'Membiasakan sikap santun dalam berinteraksi dengan masyarakat majemuk'
        ],
        allocatedHours: 12,
        subTopics: ['Makna & Hikmah Qana’ah', 'Sikap Tasamuh yang Proporsional', 'Menjaga Persatuan Umat']
      },
      {
        id: 'g5_c9',
        semester: 2,
        chapterNumber: 9,
        element: 'Fikih',
        chapterTitle: 'Ibadah Kurban dan Ibadah Haji',
        learningObjectives: [
          'Menjelaskan ketentuan ibadah kurban (hewan, waktu, syarat, dan pembagian daging kurban)',
          'Mengetahui rukun, wajib, dan sunnah ibadah haji serta perbedaan haji dan umrah',
          'Meneladani pengorbanan Nabi Ibrahim a.s. dan Nabi Ismail a.s.'
        ],
        allocatedHours: 16,
        subTopics: ['Ketentuan Ibadah Kurban', 'Rukun & Tata Cara Ibadah Haji', 'Perbedaan Haji dan Umrah']
      },
      {
        id: 'g5_c10',
        semester: 2,
        chapterNumber: 10,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Khutbah Perpisahan (Haji Wada’) dan Wafatnya Rasulullah saw.',
        learningObjectives: [
          'Menceritakan pesan-pesan moral universal dalam Khutbah Haji Wada’',
          'Menceritakan detik-detik menjelang wafatnya Rasulullah saw. dan keteladanan terakhir beliau',
          'Menjaga warisan agung Rasulullah saw.: Al-Qur’an dan As-Sunnah'
        ],
        allocatedHours: 12,
        subTopics: ['Pesan Universal Khutbah Wada’', 'Wafatnya Rasulullah saw.', 'Meneladani Warisan Sunnah']
      }
    ]
  },
  6: {
    grade: 6,
    fase: 'Fase C (Kelas 6)',
    subjectName: 'Pendidikan Agama Islam dan Budi Pekerti',
    totalAnnualJP: 136,
    semester1DefaultJP: 68,
    semester2DefaultJP: 68,
    capaianPembelajaran: 'Peserta didik mampu membaca, menghafal, dan memahami hukum tajwid waqaf & washal pada Surah Al-A’la dan Surah Al-Kafirun; meyakini Qadha dan Qadar (Takdir Allah); menerapkan perilaku pemaaf, tawakal, dan tabayyun; memahami ketentuan halal-haram makanan, binatang sembelihan, dan shalat jenazah; serta meneladani kepemimpinan Khulafaur Rasyidin dan perjuangan dakwah Wali Songo di Nusantara.',
    chapters: [
      {
        id: 'g6_c1',
        semester: 1,
        chapterNumber: 1,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Kajian Surah Al-A’la dan Hukum Tanda Waqaf/Washal',
        learningObjectives: [
          'Membaca Surah Al-A’la dengan tartil sesuai kaidah tajwid',
          'Mengenal dan mempraktikkan tanda-tanda waqaf (lazim, jaiz, mamnu, dll) dan washal',
          'Menghafalkan Surah Al-A’la dan memahami pesan menyucikan nama Allah yang Mahatinggi'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca & Hafalan Surah Al-A’la', 'Mengenal Tanda-Tanda Waqaf', 'Pesan Mensucikan Nama Allah']
      },
      {
        id: 'g6_c2',
        semester: 1,
        chapterNumber: 2,
        element: 'Akidah',
        chapterTitle: 'Beriman kepada Qadha dan Qadar (Takdir Muallaq & Mubram)',
        learningObjectives: [
          'Menjelaskan pengertian Qadha dan Qadar Allah Swt.',
          'Membedakan takdir muallaq (bisa diubah dengan ikhtiar dan doa) dan takdir mubram (pasti)',
          'Membiasakan sikap ikhtiar sungguh-sungguh, tawakal, dan optimis dalam meraih cita-cita'
        ],
        allocatedHours: 12,
        subTopics: ['Pengertian Qadha & Qadar', 'Takdir Muallaq & Takdir Mubram', 'Pentingnya Ikhtiar & Doa']
      },
      {
        id: 'g6_c3',
        semester: 1,
        chapterNumber: 3,
        element: 'Akhlak',
        chapterTitle: 'Sikap Tabayyun (Cek Fakta), Pemaaf, dan Berprasangka Baik (Husnuzan)',
        learningObjectives: [
          'Memahami pentingnya tabayyun dalam menyaring informasi agar terhindar dari fitnah dan hoaks',
          'Menerapkan sikap husnuzan (berprasangka baik) kepada Allah dan sesama manusia',
          'Membiasakan sikap pemaaf dan lapang dada dalam menghadapi perbedaan'
        ],
        allocatedHours: 12,
        subTopics: ['Kewajiban Tabayyun di Era Digital', 'Keutamaan Husnuzan', 'Keluhuran Sikap Pemaaf']
      },
      {
        id: 'g6_c4',
        semester: 1,
        chapterNumber: 4,
        element: 'Fikih',
        chapterTitle: 'Makanan dan Minuman Halal Lagi Baik (Halalan Thayyiban)',
        learningObjectives: [
          'Menjelaskan kriteria makanan dan minuman yang halal dan haram menurut syariat Islam',
          'Mengetahui tata cara penyembelihan hewan yang sah secara Islami',
          'Membiasakan mengonsumsi makanan halal, bergizi (thayyib), dan menjauhi zat berbahaya/narkoba'
        ],
        allocatedHours: 16,
        subTopics: ['Kriteria Makanan Halalan Thayyiban', 'Jenis Makanan & Minuman Haram', 'Adab Menyembelih Hewan']
      },
      {
        id: 'g6_c5',
        semester: 1,
        chapterNumber: 5,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kepemimpinan Khulafaur Rasyidin (Abu Bakar & Umar bin Khattab)',
        learningObjectives: [
          'Menceritakan ketegasan dan kelembutan Khalifah Abu Bakar Ash-Shiddiq (pemberantasan nabi palsu & kodifikasi mushaf)',
          'Meneladani keadilan, keberanian, dan kesederhanaan Khalifah Umar bin Khattab',
          'Menerapkan sikap kepemimpinan yang bertanggung jawab dan amanah di kelas'
        ],
        allocatedHours: 12,
        subTopics: ['Biografi & Jasa Abu Bakar', 'Keadilan Khalifah Umar', 'Keteladanan Memimpin Umat']
      },
      // SEMESTER 2
      {
        id: 'g6_c6',
        semester: 2,
        chapterNumber: 6,
        element: "Al-Qur'an Hadis",
        chapterTitle: 'Surah Al-Kafirun dan Sikap Keteguhan Iman',
        learningObjectives: [
          'Membaca dan menghafalkan Surah Al-Kafirun dengan fasih',
          'Memahami prinsip tegas dalam akidah (lakum diinukum wa liya diin) tanpa kompromi',
          'Menerapkan sikap toleransi muamalah dan hidup berdampingan secara damai'
        ],
        allocatedHours: 16,
        subTopics: ['Membaca & Hafalan Al-Kafirun', 'Keteguhan Akidah Tauhid', 'Batas Toleransi dalam Beragama']
      },
      {
        id: 'g6_c7',
        semester: 2,
        chapterNumber: 7,
        element: 'Akidah',
        chapterTitle: 'Asmaul Husna: Al-Ghaffar, Al-Afuww, Ash-Shamad, Al-Muqtadir',
        learningObjectives: [
          'Menjelaskan arti 4 Asmaul Husna: Al-Ghaffar (Maha Pengampun), Al-Afuww (Maha Pemaaf), Ash-Shamad (Tempat Bergantung), Al-Muqtadir (Maha Kuasa)',
          'Meyakini luasnya ampunan Allah bagi hamba yang bertaubat',
          'Membiasakan hanya bergantung dan memohon pertolongan kepada Allah'
        ],
        allocatedHours: 12,
        subTopics: ['Makna 4 Asmaul Husna', 'Meneladani Sifat Pengampun', 'Tawakal kepada Ash-Shamad']
      },
      {
        id: 'g6_c8',
        semester: 2,
        chapterNumber: 8,
        element: 'Akhlak',
        chapterTitle: 'Adab Menggunakan Media Sosial dan Menjaga Kehormatan Diri',
        learningObjectives: [
          'Menerapkan etika berkomunikasi yang santun di ruang digital dan media sosial',
          'Menghindari ghibah (gosip), namimah (adu domba), dan ujaran kebencian',
          'Menjaga martabat dan kehormatan diri serta nama baik keluarga dan sekolah'
        ],
        allocatedHours: 12,
        subTopics: ['Etika Digital Islami', 'Bahaya Ghibah & Namimah', 'Menjaga Muru’ah (Kehormatan Diri)']
      },
      {
        id: 'g6_c9',
        semester: 2,
        chapterNumber: 9,
        element: 'Fikih',
        chapterTitle: 'Tata Cara Shalat Jenazah dan Kepedulian Terhadap Sesama Muslim',
        learningObjectives: [
          'Menjelaskan hukum fardhu kifayah dalam pengurusan jenazah',
          'Mengetahui 4 takbir dalam shalat jenazah beserta doa-doanya',
          'Mempraktikkan tata cara shalat jenazah secara tertib'
        ],
        allocatedHours: 16,
        subTopics: ['Kewajiban Pengurusan Jenazah', '4 Takbir Shalat Jenazah', 'Praktik Shalat Jenazah']
      },
      {
        id: 'g6_c10',
        semester: 2,
        chapterNumber: 10,
        element: 'Sejarah Peradaban Islam (SPI)',
        chapterTitle: 'Kisah Dakwah Islam Nusantara oleh Wali Songo di Jawa Timur',
        learningObjectives: [
          'Menceritakan metode dakwah santun dan akulturasi budaya oleh Wali Songo (Sunan Ampel, Sunan Giri, Sunan Bonang, Sunan Drajat, dll)',
          'Memahami kearifan dakwah Islam di tanah Jawa khususnya Jawa Timur dan Pasuruan',
          'Meneladani semangat menyebarkan kebaikan dengan bijaksana dan damai'
        ],
        allocatedHours: 12,
        subTopics: ['Metode Dakwah Akulturasi Wali Songo', 'Peran Wali Songo di Jawa Timur', 'Pesan Keteladanan Dakwah Damai']
      }
    ]
  }
};
