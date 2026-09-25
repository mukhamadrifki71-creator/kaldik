import { PAIElement, ProtaItem, CPMappingEntry, SemesterType } from '../types';
import { PAI_CURRICULUM_DATABASE } from './paiCurriculum';

export interface ElementCP {
  element: PAIElement;
  deskripsiCP: string;
  kataKunci: string[];
}

export interface FaseCPData {
  fase: string;
  grades: number[];
  capaianUmum: string;
  elemen: Record<PAIElement, string>;
}

export interface CPTemplatePreset {
  id: string;
  name: string;
  description: string;
  source: string;
  itemsByGrade: Record<number, ProtaItem[]>;
}

export const FASE_CP_DATABASE: Record<string, FaseCPData> = {
  'Fase A': {
    fase: 'Fase A (Kelas 1 - 2 SD)',
    grades: [1, 2],
    capaianUmum: 'Pada akhir Fase A, peserta didik mengenal huruf hijaiyah berharakat, surah-surah pendek Al-Qur’an (Al-Fatihah, An-Nas, Al-Ikhlas, Al-Kautsar), rukun iman (iman kepada Allah, malaikat, dan rasul), Asmaul Husna, kalimat thayyibah, adab dan akhlak terpuji terhadap orang tua, guru, sesama, dan lingkungan, rukun Islam, tata cara thaharah (bersuci) dan shalat fardhu 5 waktu, serta meneladani kisah Nabi Adam a.s., Nabi Nuh a.s., Nabi Ibrahim a.s., dan masa kecil Nabi Muhammad saw.',
    elemen: {
      "Al-Qur'an Hadis": 'Peserta didik mampu mengenal huruf hijaiyah dan harakatnya, huruf hijaiyah bersambung, serta mampu melafalkan dan menghafalkan surah-surah pendek Al-Qur’an dengan baik dan benar.',
      "Akidah": 'Peserta didik mampu mengenal rukun iman kepada Allah, Malaikat-Malaikat Allah, dan Rasul-Rasul Allah, serta mengenal beberapa Asmaul Husna (Ar-Rahman, Ar-Rahim, Al-Malik, Al-Quddus, Al-Alim, Al-Khabir).',
      "Akhlak": 'Peserta didik terbiasa mempraktikkan nilai-nilai baik dalam kehidupan sehari-hari dalam ungkapan-ungkapan positif (kalimat thayyibah), bersikap santun, kasih sayang, empati, tolong-menolong, berterima kasih, dan disiplin.',
      "Fikih": 'Peserta didik mampu mengenal rukun Islam dan dua kalimat syahadat, tata cara bersuci (thaharah), berwudhu, serta memahami dan mempraktikkan gerakan dan bacaan shalat fardhu 5 waktu secara tertib.',
      "Sejarah Peradaban Islam (SPI)": 'Peserta didik mampu menceritakan secara sederhana dan meneladani kisah Nabi Adam a.s., Nabi Nuh a.s., Nabi Ibrahim a.s., serta masa kanak-kanak Nabi Muhammad saw.'
    }
  },
  'Fase B': {
    fase: 'Fase B (Kelas 3 - 4 SD)',
    grades: [3, 4],
    capaianUmum: 'Pada akhir Fase B, peserta didik mampu membaca, menghafal, dan memahami hukum tajwid dasar (alif lam syamsiyah/qamariyah, nun sukun/tanwin) pada Surah Al-Falaq, An-Nasr, Al-Hujurat: 13, dan At-Tin; memahami sifat wajib Allah, kitab-kitab Allah, Asmaul Husna, dan Rasul Allah; menerapkan akhlak mulia dalam keragaman sebagai sunnatullah, berbakti kepada orang tua/guru, dan peduli lingkungan; memahami tanda baligh, shalat berjamaah, rawatib, puasa Ramadhan, shalat Jumat, dan shalat duha; serta meneladani kisah Nabi Musa a.s., Nabi Sulaiman a.s., dan peristiwa hijrah Rasulullah saw.',
    elemen: {
      "Al-Qur'an Hadis": 'Peserta didik mampu membaca surah-surah pendek Al-Qur’an (Al-Falaq, An-Nasr, Al-Hujurat: 13, At-Tin) dengan menerapkan kaidah tajwid dasar (Alif Lam Syamsiyah/Qamariyah, Nun Sukun dan Tanwin), serta memahami pesan pokok dan hadis terkait toleransi dan silaturahmi.',
      "Akidah": 'Peserta didik mampu memahami sifat-sifat wajib bagi Allah, mengenal kitab-kitab suci Allah, beriman kepada Rasul-Rasul Allah dan Ulul Azmi, serta meneladani Asmaul Husna (Al-Wahhab, Al-Kabir, Al-Malik, Al-Quddus, As-Salam, Al-Mu’min, Al-Aziz).',
      "Akhlak": 'Peserta didik mampu menghormati keragaman sebagai sunnatullah, bersikap ikhlas, tawadhu, peduli lingkungan, berbakti kepada orang tua (birrul walidain) dan guru, serta mewujudkan persaudaraan kebangsaan.',
      "Fikih": 'Peserta didik mampu memahami konsep baligh dan tanda-tandanya, tata cara mandi wajib, keutamaan shalat berjamaah dan shalat rawatib, ibadah puasa Ramadhan, shalat Jumat, serta shalat sunnah duha dan tahajud.',
      "Sejarah Peradaban Islam (SPI)": 'Peserta didik mampu menceritakan kisah keteladanan Nabi Musa a.s., Nabi Sulaiman a.s., peristiwa hijrah Nabi Muhammad saw. ke Madinah, pembangunan Masjid Nabawi, dan Piagam Madinah.'
    }
  },
  'Fase C': {
    fase: 'Fase C (Kelas 5 - 6 SD)',
    grades: [5, 6],
    capaianUmum: 'Pada akhir Fase C, peserta didik mampu membaca, menghafal, dan memahami hukum tajwid lanjutan (mim sukun, waqaf/washal) pada Surah Al-Ma’un, Al-Balad, Al-A’la, dan Al-Kafirun; meyakini Hari Akhir (Kiamat) dan Takdir (Qadha dan Qadar); mengamalkan sikap sederhana, dermawan, qana’ah, tabayyun, husnuzan, dan etika bermedia sosial; memahami ketentuan zakat fitrah, infaq, sedekah, kurban, haji, makanan halal-haram, dan shalat jenazah; serta meneladani Fathu Makkah, Haji Wada’, Khulafaur Rasyidin, dan dakwah Wali Songo di Jawa Timur.',
    elemen: {
      "Al-Qur'an Hadis": 'Peserta didik mampu membaca surah-surah pilihan (Al-Ma’un, Al-Balad, Al-A’la, Al-Kafirun) sesuai kaidah tajwid (hukum Mim Sukun, hukum Waqaf dan Washal), menghafal, serta memahami pesan kepedulian dhuafa dan keteguhan akidah.',
      "Akidah": 'Peserta didik memahami Asmaul Husna (Al-Qawiyy, Al-Qayyum, Al-Muhyi, Al-Mumit, Al-Ba’its, Al-Ghaffar, Al-Afuww, Ash-Shamad, Al-Muqtadir), meyakini Hari Akhir, serta beriman kepada Qadha dan Qadar Allah (takdir muallaq dan mubram).',
      "Akhlak": 'Peserta didik membiasakan sikap hidup sederhana, gemar sedekah, qana’ah, tasamuh (toleransi), tabayyun dalam menyaring informasi media sosial, husnuzan, serta pemaaf.',
      "Fikih": 'Peserta didik memahami ketentuan zakat fitrah, infaq, sedekah, ibadah kurban, rukun haji dan umrah, kriteria makanan/minuman halalan thayyiban, serta tata cara shalat jenazah.',
      "Sejarah Peradaban Islam (SPI)": 'Peserta didik mampu meneladani peristiwa Fathu Makkah, pesan Khulafaur Rasyidin (Abu Bakar Ash-Shiddiq dan Umar bin Khattab), serta sejarah dan strategi dakwah santun Wali Songo di Jawa Timur.'
    }
  }
};

// Bank template CP & TP resmi terintegrasi
export const CP_TP_TEMPLATES: Record<number, {
  fase: string;
  capaianFase: string;
  elemenMap: Record<PAIElement, {
    cpElemen: string;
    tujuanPembelajaran: string[];
  }>;
}> = {
  1: {
    fase: 'Fase A (Kelas 1)',
    capaianFase: 'Peserta didik mampu mengenal huruf hijaiyah berharakat, melafalkan Surah Al-Fatihah dan Al-Ikhlas, mengenal rukun iman, kalimat thayyibah, rukun Islam, thaharah, wudhu, dan kisah Nabi Adam a.s. serta masa kecil Nabi Muhammad saw.',
    elemenMap: {
      "Al-Qur'an Hadis": {
        cpElemen: 'Mengenal huruf hijaiyah dan harakatnya, huruf bersambung, serta melafalkan Surah Al-Fatihah dan Al-Ikhlas dengan tartil.',
        tujuanPembelajaran: [
          '1.1 Menyebutkan dan melafalkan 28 huruf hijaiyah tunggal berharakat fathah, kasrah, dan dhammah secara benar.',
          '1.2 Melafalkan dan menghafal Surah Al-Fatihah ayat 1-7 dengan tartil dan lancar.',
          '1.3 Menjelaskan pesan pokok Surah Al-Fatihah tentang kasih sayang Allah dan permohonan petunjuk jalan yang lurus.',
          '1.4 Melafalkan dan menghafal Surah Al-Ikhlas serta menjelaskan pesan keesaan Allah Swt.'
        ]
      },
      "Akidah": {
        cpElemen: 'Mengenal rukun iman, meyakini keesaan Allah Swt., dan mengenal Asmaul Husna (Ar-Rahman, Ar-Rahim, Al-Malik, Al-Quddus).',
        tujuanPembelajaran: [
          '1.5 Menyebutkan enam rukun iman secara urut dan benar.',
          '1.6 Mengenal adanya Allah Swt. melalui ciptaan-Nya di alam semesta.',
          '1.7 Mengenal arti Asmaul Husna: Ar-Rahman, Ar-Rahim, Al-Malik, dan Al-Quddus beserta contoh keteladanannya.',
          '1.8 Mengenal Nabi dan Rasul sebagai manusia pilihan utusan Allah Swt.'
        ]
      },
      "Akhlak": {
        cpElemen: 'Membiasakan kalimat thayyibah (Basmalah, Hamdalah, Takbir), adab santun, bersyukur, dan kasih sayang.',
        tujuanPembelajaran: [
          '1.9 Membiasakan mengucap Basmalah sebelum beraktivitas dan Hamdalah setelah selesai beraktivitas.',
          '1.10 Menunjukkan sikap hormat dan patuh kepada orang tua dan guru dalam kehidupan sehari-hari.',
          '1.11 Menunjukkan sikap kasih sayang dan ramah terhadap sesama teman di sekolah.',
          '1.12 Membiasakan adab makan, minum, dan menjaga kebersihan diri serta lingkungan.'
        ]
      },
      "Fikih": {
        cpElemen: 'Mengenal rukun Islam, dua kalimat syahadat, tata cara bersuci (thaharah), istinja, dan praktik wudhu.',
        tujuanPembelajaran: [
          '1.13 Menyebutkan lima rukun Islam secara berurutan.',
          '1.14 Melafalkan dua kalimat syahadat (syahadatain) beserta artinya.',
          '1.15 Menjelaskan arti bersuci (thaharah), adab di kamar mandi, dan tata cara istinja yang bersih.',
          '1.16 Menyebutkan rukun wudhu dan mempraktikkan gerakan wudhu secara tertib dan benar.'
        ]
      },
      "Sejarah Peradaban Islam (SPI)": {
        cpElemen: 'Menceritakan kisah Nabi Adam a.s. dan masa kanak-kanak Nabi Muhammad saw.',
        tujuanPembelajaran: [
          '1.17 Menceritakan kisah penciptaan Nabi Adam a.s. sebagai manusia pertama.',
          '1.18 Meneladani sikap taubat, ketaatan, dan kesediaan meminta maaf dari Nabi Adam a.s.',
          '1.19 Menceritakan kelahiran dan masa kanak-kanak Nabi Muhammad saw. di Kota Makkah.',
          '1.20 Meneladani sifat jujur (Al-Amin) dan mandiri Nabi Muhammad saw. sejak kecil.'
        ]
      }
    }
  },
  2: {
    fase: 'Fase A (Kelas 2)',
    capaianFase: 'Peserta didik mampu melafalkan Surah An-Nas dan Al-Kautsar, meyakini Asmaul Husna (Al-Alim, Al-Khabir) dan 10 Malaikat, berakhlak empati dan pemaaf, memahami shalat fardhu 5 waktu, dan meneladani Nabi Nuh a.s. serta Nabi Ibrahim a.s.',
    elemenMap: {
      "Al-Qur'an Hadis": {
        cpElemen: 'Melafalkan, menghafal, dan memahami pesan Surah An-Nas dan Surah Al-Kautsar.',
        tujuanPembelajaran: [
          '2.1 Membaca Surah An-Nas dengan makhraj huruf yang tepat.',
          '2.2 Menghafalkan Surah An-Nas secara lancar dan fasih.',
          '2.3 Menjelaskan pesan perlindungan diri dari godaan setan dalam Surah An-Nas.',
          '2.4 Membaca, menghafal, dan memahami pesan bersyukur dalam Surah Al-Kautsar.'
        ]
      },
      "Akidah": {
        cpElemen: 'Mengenal Asmaul Husna (Al-Alim, Al-Khabir) dan 10 Malaikat Allah beserta tugasnya.',
        tujuanPembelajaran: [
          '2.5 Meyakini bahwa Allah Maha Mengetahui (Al-Alim) dan Maha Teliti (Al-Khabir).',
          '2.6 Menerapkan perilaku jujur dalam belajar karena meyakini pengawasan Allah Swt.',
          '2.7 Menyebutkan 10 nama Malaikat Allah yang wajib diketahui beserta tugas utamanya.',
          '2.8 Meyakini tugas Malaikat Raqib dan Atid sehingga selalu termotivasi berbuat baik.'
        ]
      },
      "Akhlak": {
        cpElemen: 'Membiasakan perilaku empati, tolong-menolong, berani mengakui kesalahan, dan memaafkan.',
        tujuanPembelajaran: [
          '2.9 Menunjukkan sikap empati dan peduli terhadap teman yang terkena musibah.',
          '2.10 Mempraktikkan sikap tolong-menolong dalam kebaikan dan ketakwaan.',
          '2.11 Memiliki keberanian untuk mengakui kesalahan dan meminta maaf dengan tulus.',
          '2.12 Menunjukkan sikap pemaaf dan tidak menyimpan dendam kepada orang lain.'
        ]
      },
      "Fikih": {
        cpElemen: 'Mengenal ketentuan shalat fardhu 5 waktu, bacaan doa, dan gerakan shalat.',
        tujuanPembelajaran: [
          '2.13 Menyebutkan nama-nama shalat fardhu 5 waktu, jumlah rakaat, dan waktu pelaksanaannya.',
          '2.14 Menjelaskan syarat sah dan syarat wajib shalat fardhu.',
          '2.15 Melafalkan bacaan shalat mulai takbiratul ihram hingga salam.',
          '2.16 Mempraktikkan shalat fardhu secara lengkap dan tuma’ninah.'
        ]
      },
      "Sejarah Peradaban Islam (SPI)": {
        cpElemen: 'Menceritakan keteladanan Nabi Nuh a.s. dan Nabi Ibrahim a.s.',
        tujuanPembelajaran: [
          '2.17 Menceritakan kisah dakwah dan pembuatan bahtera Nabi Nuh a.s.',
          '2.18 Meneladani sikap tabah dan pantang putus asa dari Nabi Nuh a.s.',
          '2.19 Menceritakan kisah pencarian kebenaran dan keteguhan iman Nabi Ibrahim a.s.',
          '2.20 Memahami asal-usul ibadah kurban dan ketaatan Nabi Ibrahim a.s. dan Nabi Ismail a.s.'
        ]
      }
    }
  },
  3: {
    fase: 'Fase B (Kelas 3)',
    capaianFase: 'Peserta didik mampu membaca Surah Al-Falaq dan An-Nasr sesuai hukum alif lam, beriman kepada 20 Sifat Wajib Allah dan 4 Kitab Suci, berakhlak tawadhu dan ikhlas, memahami puasa Ramadhan dan shalat rawatib, serta meneladani Nabi Musa a.s. dan Nabi Sulaiman a.s.',
    elemenMap: {
      "Al-Qur'an Hadis": {
        cpElemen: 'Membaca dan menghafal Surah Al-Falaq dan An-Nasr dengan tajwid hukum Alif Lam Syamsiyah dan Qamariyah.',
        tujuanPembelajaran: [
          '3.1 Membaca Surah Al-Falaq dan Surah An-Nasr dengan tartil dan tajwid yang benar.',
          '3.2 Membedakan hukum bacaan Alif Lam Syamsiyah dan Alif Lam Qamariyah serta menerapkannya.',
          '3.3 Menghafalkan Surah Al-Falaq dan An-Nasr dengan fasih.',
          '3.4 Menjelaskan kandungan Surah Al-Falaq (perlindungan dari kejahatan) dan Surah An-Nasr (pertolongan Allah).'
        ]
      },
      "Akidah": {
        cpElemen: 'Memahami 20 sifat wajib Allah, Asmaul Husna (Al-Wahhab, Al-Kabir), dan 4 Kitab Suci Allah.',
        tujuanPembelajaran: [
          '3.5 Menyebutkan 20 sifat wajib bagi Allah Swt. beserta maknanya.',
          '3.6 Mengenal Asmaul Husna Al-Wahhab (Maha Pemberi) dan Al-Kabir (Maha Besar).',
          '3.7 Menyebutkan 4 kitab suci Allah (Taurat, Zabur, Injil, Al-Qur’an) dan Nabi penerimanya.',
          '3.8 Meyakini Al-Qur’an sebagai kitab suci penyempurna dan pedoman hidup umat Islam.'
        ]
      },
      "Akhlak": {
        cpElemen: 'Menerapkan perilaku tawadhu (rendah hati), peduli lingkungan alam, dan ikhlas beramal.',
        tujuanPembelajaran: [
          '3.9 Memahami makna tawadhu dan menerapkannya dalam pergaulan di sekolah.',
          '3.10 Membiasakan menjaga kebersihan lingkungan sekolah dan hemat menggunakan air.',
          '3.11 Menjelaskan makna ikhlas dalam beribadah dan belajar tanpa mengharap pujian (riya).',
          '3.12 Membiasakan sikap dermawan dan suka menolong kaum yang lemah.'
        ]
      },
      "Fikih": {
        cpElemen: 'Memahami keutamaan shalat berjamaah, shalat sunnah rawatib, dan ibadah puasa Ramadhan.',
        tujuanPembelajaran: [
          '3.13 Menjelaskan keutamaan dan tata cara shalat berjamaah serta posisi makmum masbuq.',
          '3.14 Mengenal macam-macam shalat sunnah rawatib (qabliyah dan ba’diyah).',
          '3.15 Menjelaskan syarat, rukun, dan sunnah ibadah puasa Ramadhan.',
          '3.16 Menyebutkan hal-hal yang membatalkan puasa dan hikmah puasa bagi kesehatan jasmani dan rohani.'
        ]
      },
      "Sejarah Peradaban Islam (SPI)": {
        cpElemen: 'Menceritakan kisah keteladanan Nabi Musa a.s. dan Nabi Sulaiman a.s.',
        tujuanPembelajaran: [
          '3.17 Menceritakan keberanian Nabi Musa a.s. dalam membela kaum tertindas menghadapi Fir’aun.',
          '3.18 Meneladani sikap pemberani dan teguh dalam menegakkan kebenaran dari Nabi Musa a.s.',
          '3.19 Menceritakan kebijaksanaan, kecerdasan, dan kekuasaan Nabi Sulaiman a.s.',
          '3.20 Meneladani kerendahan hati Nabi Sulaiman a.s. serta kasih sayangnya terhadap seluruh makhluk.'
        ]
      }
    }
  },
  4: {
    fase: 'Fase B (Kelas 4)',
    capaianFase: 'Peserta didik mampu membaca Surah Al-Hujurat: 13 dan At-Tin dengan hukum nun sukun/tanwin, memahami 5 Asmaul Husna dan Rasul Ulul Azmi, menghargai keragaman, memahami tanda baligh dan mandi wajib, shalat Jumat dan duha, serta meneladani peristiwa hijrah Nabi ke Madinah.',
    elemenMap: {
      "Al-Qur'an Hadis": {
        cpElemen: 'Membaca dan menghafal Surah Al-Hujurat: 13 dan At-Tin dengan tajwid hukum Nun Sukun dan Tanwin serta memahami hadis silaturahmi.',
        tujuanPembelajaran: [
          '4.1 Membaca Q.S. Al-Hujurat/49: 13 dengan tartil sesuai kaidah tajwid.',
          '4.2 Menjelaskan dan membedakan 4 hukum nun sukun/tanwin (Izhar, Idgham, Ikhfa, Iqlab).',
          '4.3 Menghafal Surah Al-Hujurat: 13 dan Surah At-Tin dengan lancar.',
          '4.4 Memahami pesan keragaman manusia sebagai sunnatullah dan hadis tentang keutamaan silaturahmi.'
        ]
      },
      "Akidah": {
        cpElemen: 'Memahami 5 Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Mu’min, Al-Aziz) dan beriman kepada Rasul-Rasul Allah serta Ulul Azmi.',
        tujuanPembelajaran: [
          '4.5 Menjelaskan arti dan nilai moral dari 5 Asmaul Husna: Al-Malik, Al-Quddus, As-Salam, Al-Mu’min, Al-Aziz.',
          '4.6 Meneladani sifat Asmaul Husna dalam kemandirian, menjaga kebersihan, dan menyebarkan kedamaian.',
          '4.7 Menjelaskan 4 sifat wajib bagi Rasul (Siddiq, Amanah, Tabligh, Fathanah) dan sifat mustahilnya.',
          '4.8 Menyebutkan 25 nama Nabi dan Rasul serta 5 Rasul yang bergelar Ulul Azmi.'
        ]
      },
      "Akhlak": {
        cpElemen: 'Menerapkan sikap saling menghargai dalam keragaman, berbakti kepada orang tua (birrul walidain) dan guru.',
        tujuanPembelajaran: [
          '4.9 Menunjukkan sikap menghargai perbedaan suku, agama, dan budaya di lingkungan sekolah dan masyarakat.',
          '4.10 Mewujudkan persaudaraan kebangsaan (ukhuwah wathaniyah) tanpa diskriminasi.',
          '4.11 Menjelaskan keutamaan berbakti kepada orang tua (birrul walidain) dan adab terhadap guru.',
          '4.12 Mempraktikkan ucapan dan perilaku santun serta mendoakan kebaikan bagi orang tua dan guru.'
        ]
      },
      "Fikih": {
        cpElemen: 'Memahami tanda-tanda usia baligh, tata cara mandi wajib, ketentuan shalat Jumat, dan shalat duha.',
        tujuanPembelajaran: [
          '4.13 Menyebutkan tanda-tanda usia baligh menurut sudut pandang fiqih dan ilmu biologi.',
          '4.14 Menjelaskan konsekuensi baligh sebagai mukallaf (kewajiban ibadah penuh).',
          '4.15 Mempraktikkan tata cara mandi wajib setelah hadas besar secara sah.',
          '4.16 Menjelaskan syarat, rukun, dan keutamaan Shalat Jumat serta Shalat Sunnah Duha.'
        ]
      },
      "Sejarah Peradaban Islam (SPI)": {
        cpElemen: 'Menceritakan sebab dan peristiwa hijrah Rasulullah saw. ke Madinah, pembangunan Masjid Nabawi, dan Piagam Madinah.',
        tujuanPembelajaran: [
          '4.17 Menceritakan latar belakang, perjalanan, dan peristiwa penting saat hijrah Nabi saw. ke Madinah.',
          '4.18 Meneladani ketabahan Abu Bakar Ash-Shiddiq dan keberanian Ali bin Abi Thalib saat peristiwa hijrah.',
          '4.19 Menjelaskan fungsi Masjid Nabawi sebagai pusat ibadah dan pembinaan masyarakat Madinah.',
          '4.20 Menjelaskan nilai-nilai toleransi dan persatuan dalam naskah Piagam Madinah.'
        ]
      }
    }
  },
  5: {
    fase: 'Fase C (Kelas 5)',
    capaianFase: 'Peserta didik mampu membaca Surah Al-Ma’un dan Al-Balad dengan tajwid mim sukun, beriman kepada Hari Akhir dan 5 Asmaul Husna, berakhlak hidup sederhana dan toleran, memahami zakat fitrah, kurban, dan haji, serta meneladani Fathu Makkah dan Haji Wada’.',
    elemenMap: {
      "Al-Qur'an Hadis": {
        cpElemen: 'Membaca dan menghafal Surah Al-Ma’un dan Surah Al-Balad dengan tajwid hukum Mim Sukun serta memahami pesan kepedulian sosial.',
        tujuanPembelajaran: [
          '5.1 Membaca Surah Al-Ma’un dan Surah Al-Balad dengan fasih sesuai kaidah tajwid.',
          '5.2 Mengidentifikasi dan mempraktikkan hukum bacaan Mim Sukun (Ikhfa Syafawi, Idgham Mimi, Izhar Syafawi).',
          '5.3 Menghafalkan Surah Al-Ma’un dan Surah Al-Balad dengan lancar.',
          '5.4 Menjelaskan pesan Surah Al-Ma’un tentang larangan menghardik anak yatim dan enggan menolong sesama.'
        ]
      },
      "Akidah": {
        cpElemen: 'Memahami Asmaul Husna (Al-Qawiyy, Al-Qayyum, Al-Muhyi, Al-Mumit, Al-Ba’its) dan meyakini adanya Hari Akhir (Kiamat).',
        tujuanPembelajaran: [
          '5.5 Menjelaskan makna 5 Asmaul Husna terkait kekuasaan dan kehidupan dari Allah Swt.',
          '5.6 Menumbuhkan jiwa tangguh dan mandiri sebagai manifestasi iman terhadap Asmaul Husna.',
          '5.7 Menjelaskan pengertian Hari Akhir, perbedaan Kiamat Sugra (kecil) dan Kiamat Kubra (besar).',
          '5.8 Menjelaskan tahapan alam barzakh, mahsyar, hisab, mizan, surga dan neraka serta hikmah beriman pada Hari Akhir.'
        ]
      },
      "Akhlak": {
        cpElemen: 'Membiasakan gaya hidup sederhana, dermawan, menghindari riya/boros, qana’ah, dan tasamuh (toleransi).',
        tujuanPembelajaran: [
          '5.9 Menjelaskan bahaya gaya hidup boros (israf), kikir (bakhil), dan riya dalam beramal.',
          '5.10 Membiasakan hidup hemat, gemar menabung, dan suka berbagi kepada fakir miskin.',
          '5.11 Memahami makna qana’ah (merasa cukup) atas segala anugerah rezeki Allah Swt.',
          '5.12 Menerapkan sikap tasamuh (toleransi) dalam keragaman sosial dan antarumat beragama secara proporsional.'
        ]
      },
      "Fikih": {
        cpElemen: 'Memahami ketentuan zakat fitrah, infaq, sedekah, ibadah kurban, serta rukun haji dan umrah.',
        tujuanPembelajaran: [
          '5.13 Menjelaskan ketentuan zakat fitrah (syarat, rukun, waktu, takaran, dan 8 golongan mustahiq).',
          '5.14 Membedakan pengertian dan ketentuan antara zakat, infaq, sedekah, dan hadiah.',
          '5.15 Menjelaskan ketentuan ibadah kurban (syarat hewan, waktu penyembelihan, dan pembagian daging).',
          '5.16 Menjelaskan rukun, wajib, sunnah ibadah haji serta perbedaan haji dan umrah.'
        ]
      },
      "Sejarah Peradaban Islam (SPI)": {
        cpElemen: 'Menceritakan peristiwa Fathu Makkah, Khutbah Haji Wada’, dan wafatnya Rasulullah saw.',
        tujuanPembelajaran: [
          '5.17 Menceritakan latar belakang terjadinya peristiwa pembebasan Kota Makkah (Fathu Makkah).',
          '5.18 Meneladani keluhuran akhlak Rasulullah saw. yang memaafkan kaum Quraisy saat Fathu Makkah.',
          '5.19 Menjelaskan pesan-pesan moral universal dalam Khutbah Haji Wada’ (Khutbah Perpisahan).',
          '5.20 Menceritakan detik-detik wafatnya Rasulullah saw. dan kewajiban menjaga warisan Al-Qur’an dan Sunnah.'
        ]
      }
    }
  },
  6: {
    fase: 'Fase C (Kelas 6)',
    capaianFase: 'Peserta didik mampu membaca Surah Al-A’la dan Al-Kafirun dengan hukum waqaf/washal, beriman kepada Qadha dan Qadar serta 4 Asmaul Husna, berakhlak tabayyun dan beradab di media sosial, memahami makanan halal dan shalat jenazah, serta meneladani Khulafaur Rasyidin dan Wali Songo.',
    elemenMap: {
      "Al-Qur'an Hadis": {
        cpElemen: 'Membaca dan menghafal Surah Al-A’la dan Surah Al-Kafirun dengan kaidah tanda Waqaf dan Washal serta keteguhan iman.',
        tujuanPembelajaran: [
          '6.1 Membaca Surah Al-A’la dan Surah Al-Kafirun dengan tartil dan tajwid yang tepat.',
          '6.2 Mengidentifikasi dan mempraktikkan tanda-tanda waqaf (lazim, jaiz, mamnu) dan washal dalam membaca Al-Qur’an.',
          '6.3 Menghafalkan Surah Al-A’la dan Surah Al-Kafirun secara fasih.',
          '6.4 Menjelaskan prinsip keteguhan akidah tauhid dalam Surah Al-Kafirun dan batas toleransi beragama.'
        ]
      },
      "Akidah": {
        cpElemen: 'Memahami rukun iman kepada Qadha dan Qadar (takdir muallaq & mubram) serta Asmaul Husna (Al-Ghaffar, Al-Afuww, Ash-Shamad, Al-Muqtadir).',
        tujuanPembelajaran: [
          '6.5 Menjelaskan pengertian iman kepada Qadha dan Qadar Allah Swt.',
          '6.6 Membedakan takdir muallaq (bisa diupayakan dengan ikhtiar/doa) dan takdir mubram (ketetapan pasti).',
          '6.7 Membiasakan sikap ikhtiar sungguh-sungguh, tawakal, optimis, dan tidak mudah putus asa.',
          '6.8 Menjelaskan makna 4 Asmaul Husna: Al-Ghaffar, Al-Afuww, Ash-Shamad, Al-Muqtadir dan keteladanannya.'
        ]
      },
      "Akhlak": {
        cpElemen: 'Membiasakan sikap tabayyun, husnuzan, pemaaf, dan beradab dalam menggunakan teknologi digital & media sosial.',
        tujuanPembelajaran: [
          '6.9 Menjelaskan pentingnya tabayyun (cek fakta) sebelum membagikan informasi agar terhindar dari fitnah dan hoaks.',
          '6.10 Menerapkan etika berkomunikasi yang santun dan menjaga kehormatan di ruang digital/media sosial.',
          '6.11 Membiasakan berprasangka baik (husnuzan) kepada Allah Swt. dan sesama manusia.',
          '6.12 Menunjukkan sikap pemaaf dan lapang dada terhadap kesalahan orang lain.'
        ]
      },
      "Fikih": {
        cpElemen: 'Memahami kriteria makanan/minuman halalan thayyiban, penyembelihan hewan, dan tata cara shalat jenazah.',
        tujuanPembelajaran: [
          '6.13 Menjelaskan kriteria makanan dan minuman halal lagi baik (halalan thayyiban) serta bahaya zat haram/narkoba.',
          '6.14 Menjelaskan tata cara dan syarat penyembelihan hewan secara syar’i.',
          '6.15 Menjelaskan hukum fardhu kifayah dalam pengurusan dan perawatan jenazah muslim.',
          '6.16 Mempraktikkan 4 takbir dalam shalat jenazah beserta bacaan doanya secara tertib.'
        ]
      },
      "Sejarah Peradaban Islam (SPI)": {
        cpElemen: 'Meneladani kepemimpinan Khulafaur Rasyidin dan metode dakwah santun Wali Songo di Nusantara khususnya Jawa Timur.',
        tujuanPembelajaran: [
          '6.17 Menceritakan biografi dan keteladanan Khalifah Abu Bakar Ash-Shiddiq dan Umar bin Khattab.',
          '6.18 Meneladani keadilan, kesederhanaan, dan ketegasan dalam memimpin dari Khulafaur Rasyidin.',
          '6.19 Menceritakan sejarah, peran, dan strategi dakwah akulturasi budaya oleh Wali Songo di Nusantara.',
          '6.20 Meneladani kearifan para Walisongo (khususnya di Jawa Timur) dalam menyebarkan ajaran Islam secara damai.'
        ]
      }
    }
  }
};

export function getGradeFase(grade: number): string {
  if (grade <= 2) return 'Fase A';
  if (grade <= 4) return 'Fase B';
  return 'Fase C';
}

export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1 to 12
  if (month >= 7) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
}

const PAI_ELEMENT_LIST: PAIElement[] = [
  "Al-Qur'an Hadis",
  "Akidah",
  "Akhlak",
  "Fikih",
  "Sejarah Peradaban Islam (SPI)"
];

/**
 * Generates official standard 2-column CP & Materi Esensial mapping per semester (Sem 1 & Sem 2).
 * Left column: Capaian Pembelajaran (CP) Berdasarkan Elemen.
 * Right column: Materi Esensial (Ruang Lingkup Materi Pokok & Bab Terkait).
 */
export function generateStandardCPMapping(grade: number): {
  sem1: CPMappingEntry[];
  sem2: CPMappingEntry[];
} {
  const faseKey = getGradeFase(grade);
  const faseInfo = FASE_CP_DATABASE[faseKey];
  const templateInfo = CP_TP_TEMPLATES[grade] || CP_TP_TEMPLATES[4];
  const curData = PAI_CURRICULUM_DATABASE[grade] || PAI_CURRICULUM_DATABASE[4];

  const buildSemesterEntries = (sem: SemesterType): CPMappingEntry[] => {
    const semChapters = curData.chapters.filter(c => c.semester === sem);

    return PAI_ELEMENT_LIST.map((elem, idx) => {
      // Find matching chapters for this element in this semester
      const elemChapters = semChapters.filter(c => c.element === elem);

      // Get official CP description
      const cpDesc = templateInfo.elemenMap?.[elem]?.cpElemen || faseInfo?.elemen?.[elem] || `Capaian Pembelajaran Elemen ${elem}`;

      // Extract essential materials
      const essentialMaterials: string[] = elemChapters.length > 0
        ? elemChapters.map(c => `Bab ${c.chapterNumber}: ${c.chapterTitle}`)
        : [getDefaultEssentialMaterialFallback(elem, grade, sem)];

      const subTopics: string[] = elemChapters.flatMap(c => c.subTopics || []);
      const learningObjectives: string[] = elemChapters.flatMap(c => c.learningObjectives || []);
      const allocatedJP = elemChapters.reduce((sum, c) => sum + c.allocatedHours, 0) || 12;

      return {
        id: `cp_map_${grade}_s${sem}_${idx + 1}`,
        semester: sem,
        element: elem,
        cpDescription: cpDesc,
        essentialMaterials,
        subTopics,
        allocatedJP,
        learningObjectives
      };
    });
  };

  return {
    sem1: buildSemesterEntries(1),
    sem2: buildSemesterEntries(2)
  };
}

function getDefaultEssentialMaterialFallback(elem: PAIElement, grade: number, sem: SemesterType): string {
  switch (elem) {
    case "Al-Qur'an Hadis":
      return sem === 1 ? 'Membaca dan Menghafal Surah Pendek Pilihan' : 'Kaidah Tajwid dan Pesan Pokok Hadis Nabi';
    case "Akidah":
      return sem === 1 ? 'Mengenal Asmaul Husna dan Rukun Iman' : 'Meneladani Sifat-Sifat Allah dan Rasul-Nya';
    case "Akhlak":
      return sem === 1 ? 'Akhlak Terpuji terhadap Sesama & Lingkungan' : 'Adab Keseharian & Budi Pekerti Mulia';
    case "Fikih":
      return sem === 1 ? 'Ketentuan Ibadah Praktis & Thaharah' : 'Praktik Ibadah Shalat dan Amaliah Pokok';
    case "Sejarah Peradaban Islam (SPI)":
      return sem === 1 ? 'Kisah Keteladanan Nabi dan Rasul' : 'Perjuangan dan Keteladanan Sahabat Nabi';
    default:
      return 'Materi Pokok Esensial';
  }
}
