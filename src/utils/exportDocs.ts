import { SchoolProfile, RPEData, ProtaItem, PromesItem, DayOfWeek } from '../types';

// Helper to trigger browser download
function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate Official Header for SDN Pohjentrek II Kota Pasuruan
export function generateOfficialKopHTML(profile: SchoolProfile, documentTitle: string, subtitle?: string): string {
  return `
    <div style="font-family: 'Times New Roman', Times, serif; text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px;">
      <h3 style="margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">PEMERINTAH KOTA PASURUAN</h3>
      <h2 style="margin: 2px 0; font-size: 15pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">DINAS PENDIDIKAN DAN KEBUDAYAAN</h2>
      <h1 style="margin: 2px 0; font-size: 16pt; font-weight: bold; text-transform: uppercase;">UPT SATUAN PENDIDIKAN SDN POHJENTREK II</h1>
      <p style="margin: 2px 0; font-size: 10pt; font-style: italic;">${profile.address} | NPSN: ${profile.npsn}</p>
    </div>
    <div style="text-align: center; margin-bottom: 25px; font-family: 'Times New Roman', Times, serif;">
      <h2 style="margin: 0; font-size: 14pt; font-weight: bold; text-decoration: underline; text-transform: uppercase;">${documentTitle}</h2>
      ${subtitle ? `<p style="margin: 4px 0 0 0; font-size: 11pt; font-weight: bold;">${subtitle}</p>` : ''}
      <p style="margin: 2px 0 0 0; font-size: 10pt;">Mata Pelajaran: Pendidikan Agama Islam & Budi Pekerti | Kelas ${profile.selectedGrade} | Tahun Pelajaran ${profile.academicYear}</p>
    </div>
  `;
}

// Generate Official Signatures Footer HTML
export function generateOfficialSignatureHTML(profile: SchoolProfile): string {
  const currentDateFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return `
    <div style="margin-top: 40px; font-family: 'Times New Roman', Times, serif; font-size: 11pt; page-break-inside: avoid;">
      <table style="width: 100%; border: none; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; vertical-align: top; text-align: left; padding: 0;">
            <p style="margin: 0;">Mengetahui,</p>
            <p style="margin: 0; font-weight: bold;">${profile.headmasterTitle}</p>
            <div style="height: 70px;"></div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${profile.headmasterName}</p>
            <p style="margin: 0;">NIP. ${profile.headmasterNip}</p>
          </td>
          <td style="width: 50%; vertical-align: top; text-align: right; padding: 0;">
            <p style="margin: 0;">${profile.cityDateLocation}, ${currentDateFormatted}</p>
            <p style="margin: 0; font-weight: bold;">${profile.teacherTitle}</p>
            <div style="height: 70px;"></div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">${profile.teacherName}</p>
            <p style="margin: 0;">NIP. ${profile.teacherNip}</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

// Export RPE to Word Document (.doc) with complete day breakdowns
export function exportRPEToWord(profile: SchoolProfile, rpeData: RPEData) {
  const semTitle = rpeData.semester === 1 ? 'SEMESTER GANJIL' : 'SEMESTER GENAP';
  const kop = generateOfficialKopHTML(profile, 'RINCIAN HARI & PEKAN EFEKTIF (RPE)', semTitle);
  const signature = generateOfficialSignatureHTML(profile);
  const selectedDay: DayOfWeek = profile.teachingDays?.[0] || 'Kamis';

  const monthRows = rpeData.months
    .map(
      (m, idx) => `
      <tr>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${idx + 1}</td>
        <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">${m.monthName} ${m.year}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${m.calendarDaysCount}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${m.holidaysCount + m.sundayHolidaysCount}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${m.schoolDaysCount}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold; background-color: #e5e7eb;">${m.effectiveTeachingDaysCount}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${m.dayBreakdown['Senin'].effective}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${m.dayBreakdown['Selasa'].effective}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${m.dayBreakdown['Rabu'].effective}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">${m.dayBreakdown['Kamis'].effective}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${m.dayBreakdown['Jumat'].effective}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${m.dayBreakdown['Sabtu'].effective}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">${m.effectiveWeeks}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${m.nonEffectiveWeeks}</td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center; font-weight: bold;">${m.paiScheduleDaysCount}</td>
        <td style="border: 1px solid #000; padding: 5px; font-size: 8.5pt;">${m.nonEffectiveReasons.length > 0 ? m.nonEffectiveReasons.join(', ') : 'KBM Penuh'}</td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>RPE PAI SDN Pohjentrek II</title>
    <style>
      @page { size: landscape; margin: 15mm; }
      body { font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.2; }
      table { border-collapse: collapse; width: 100%; font-size: 9pt; }
      th { border: 1px solid #000; background-color: #f2f2f2; padding: 4px; font-weight: bold; text-align: center; }
      h4 { margin: 12px 0 4px 0; font-size: 10.5pt; }
    </style>
    </head>
    <body>
      ${kop}

      <h4>I. REKAPITULASI JUMLAH HARI & PEKAN EFEKTIF PER BULAN</h4>
      <table>
        <thead>
          <tr>
            <th rowspan="2" style="width: 3%;">No</th>
            <th rowspan="2" style="width: 14%;">Nama Bulan</th>
            <th rowspan="2" style="width: 6%;">Hari Kalender</th>
            <th rowspan="2" style="width: 5%;">Hari Libur</th>
            <th rowspan="2" style="width: 5%;">HES (Sekolah)</th>
            <th rowspan="2" style="width: 6%;">HEB (KBM)</th>
            <th colspan="6" style="width: 24%;">Rincian Hari Efektif Belajar</th>
            <th colspan="2" style="width: 10%;">Pekan</th>
            <th rowspan="2" style="width: 8%;">Tatap Muka (${selectedDay})</th>
            <th rowspan="2" style="width: 19%;">Keterangan Kegiatan</th>
          </tr>
          <tr>
            <th style="width: 4%;">Sen</th>
            <th style="width: 4%;">Sel</th>
            <th style="width: 4%;">Rab</th>
            <th style="width: 4%;">Kam</th>
            <th style="width: 4%;">Jum</th>
            <th style="width: 4%;">Sab</th>
            <th style="width: 5%;">Efektif</th>
            <th style="width: 5%;">Tdk Efektif</th>
          </tr>
        </thead>
        <tbody>
          ${monthRows}
          <tr style="background-color: #f2f2f2; font-weight: bold; text-align: center;">
            <td colspan="2" style="border: 1px solid #000; padding: 5px; text-align: center;">JUMLAH TOTAL</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.totalCalendarDays}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.totalHolidays}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.totalSchoolDays}</td>
            <td style="border: 1px solid #000; padding: 5px; background-color: #e5e7eb;">${rpeData.totalEffectiveTeachingDays}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.dayTotals['Senin'].effective}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.dayTotals['Selasa'].effective}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.dayTotals['Rabu'].effective}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.dayTotals['Kamis'].effective}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.dayTotals['Jumat'].effective}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.dayTotals['Sabtu'].effective}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.totalEffectiveWeeks}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.totalNonEffectiveWeeks}</td>
            <td style="border: 1px solid #000; padding: 5px;">${rpeData.totalPAIScheduleDays}</td>
            <td style="border: 1px solid #000; padding: 5px; text-align: center;">-</td>
          </tr>
        </tbody>
      </table>

      <h4>II. DISTRIBUSI ALOKASI WAKTU JAM PELAJARAN (JP)</h4>
      <table style="width: 70%; margin-top: 6px; font-size: 9.5pt;">
        <tr>
          <td style="border: 1px solid #000; padding: 5px; width: 65%;">1. Jumlah Pekan Efektif Semester ${rpeData.semester}</td>
          <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">= ${rpeData.totalEffectiveWeeks} Pekan</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">2. Alokasi Waktu per Pekan (PAI & BP)</td>
          <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">= ${rpeData.jpPerWeek} Jam Pelajaran (JP)</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px;">3. Jumlah Jam Pelajaran Efektif (${rpeData.totalEffectiveWeeks} x ${rpeData.jpPerWeek} JP)</td>
          <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background-color: #e5e7eb;">= ${rpeData.totalEffectiveHours} JP</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px; padding-left: 20px;">a. Kegiatan Pembelajaran Pokok (Tatap Muka)</td>
          <td style="border: 1px solid #000; padding: 5px;">= ${rpeData.allocatedHours.kbmHours} JP</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px; padding-left: 20px;">b. Asesmen Sumatif Lingkup Materi / Ulangan Harian</td>
          <td style="border: 1px solid #000; padding: 5px;">= ${rpeData.allocatedHours.assessmentHours} JP</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 5px; padding-left: 20px;">c. Jam Cadangan / Remedial / Pengayaan</td>
          <td style="border: 1px solid #000; padding: 5px;">= ${rpeData.allocatedHours.reserveHours} JP</td>
        </tr>
      </table>

      ${signature}
    </body>
    </html>
  `;

  downloadBlob(
    htmlContent,
    `RPE_Lengkap_PAI_Kelas${profile.selectedGrade}_Sem${rpeData.semester}_${profile.schoolName.replace(/\s+/g, '_')}.doc`,
    'application/msword'
  );
}

// Export Prota to Word Document (.doc)
export function exportProtaToWord(profile: SchoolProfile, protaItems: ProtaItem[]) {
  const kop = generateOfficialKopHTML(profile, 'PROGRAM TAHUNAN (PROTA)', 'KURIKULUM MERDEKA');
  const signature = generateOfficialSignatureHTML(profile);
  const defaultDay = profile.teachingDays?.[0] || 'Kamis';
  const jpPerMeeting = profile.jpPerWeek || 4;

  const totalJP = protaItems.reduce((acc, item) => acc + item.allocatedHours, 0);

  const rows = protaItems
    .map(
      (item, idx) => `
      <tr>
        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${idx + 1}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${item.semester === 1 ? 'I (Ganjil)' : 'II (Genap)'}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">Hari ${item.teachingDay || defaultDay}<br><span style="font-size: 8.5pt; font-weight: normal;">${item.numberOfMeetings || Math.ceil(item.allocatedHours / jpPerMeeting)} Pertemuan</span></td>
        <td style="border: 1px solid #000; padding: 6px; font-weight: bold;">${item.element}</td>
        <td style="border: 1px solid #000; padding: 6px;">
          <strong>Bab ${item.chapterNumber}: ${item.chapterTitle}</strong>
          <ul style="margin: 4px 0 0 16px; padding: 0;">
            ${item.learningObjectives.map(tp => `<li>${tp}</li>`).join('')}
          </ul>
        </td>
        <td style="border: 1px solid #000; padding: 6px; text-align: center; font-weight: bold;">${item.allocatedHours} JP</td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Prota PAI SDN Pohjentrek II</title>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.3; margin: 20mm; }
      table { border-collapse: collapse; width: 100%; font-size: 10pt; }
      th { border: 1px solid #000; background-color: #f2f2f2; padding: 6px; font-weight: bold; text-align: center; }
    </style>
    </head>
    <body>
      ${kop}
      <table>
        <thead>
          <tr>
            <th style="width: 4%;">No</th>
            <th style="width: 10%;">Semester</th>
            <th style="width: 12%;">Hari & Jadwal</th>
            <th style="width: 16%;">Elemen</th>
            <th style="width: 48%;">Bab / Alur Tujuan Pembelajaran (ATP)</th>
            <th style="width: 10%;">Alokasi</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background-color: #f2f2f2; font-weight: bold;">
            <td colspan="5" style="border: 1px solid #000; padding: 6px; text-align: center;">TOTAL ALOKASI WAKTU SATU TAHUN PELAJARAN</td>
            <td style="border: 1px solid #000; padding: 6px; text-align: center;">${totalJP} JP</td>
          </tr>
        </tbody>
      </table>
      ${signature}
    </body>
    </html>
  `;

  downloadBlob(
    htmlContent,
    `PROTA_PAI_Kelas${profile.selectedGrade}_${profile.schoolName.replace(/\s+/g, '_')}.doc`,
    'application/msword'
  );
}

// Export Promes to Word Document (.doc) with scheduled dates
export function exportPromesToWord(
  profile: SchoolProfile,
  rpeData: RPEData,
  promesItems: PromesItem[]
) {
  const semTitle = rpeData.semester === 1 ? 'SEMESTER GANJIL' : 'SEMESTER GENAP';
  const kop = generateOfficialKopHTML(profile, 'PROGRAM SEMESTER (PROMES)', semTitle);
  const signature = generateOfficialSignatureHTML(profile);

  // Build header row 1 (Month names), row 2 (Week numbers), row 3 (Dates)
  const monthHeaderCols = rpeData.months
    .map(m => `<th colspan="${m.totalWeeks}" style="border: 1px solid #000; text-align: center; padding: 4px;">${m.monthName.toUpperCase()}</th>`)
    .join('');

  const weekHeaderCols = rpeData.months
    .flatMap(m =>
      m.weeks.map(
        w => `<th style="border: 1px solid #000; text-align: center; padding: 2px; font-size: 7.5pt; ${!w.isEffective ? 'background-color: #d1d5db;' : ''}">M${w.weekNumber}</th>`
      )
    )
    .join('');

  const totalJP = promesItems.reduce((acc, item) => acc + item.allocatedHours, 0);

  const rows = promesItems
    .map((item, idx) => {
      const weekCells = rpeData.months
        .flatMap(m =>
          m.weeks.map(w => {
            const key = `${m.monthIndex}_${w.weekNumber}`;
            const allocated = item.allocations[key];
            if (!w.isEffective) {
              return `<td style="border: 1px solid #000; background-color: #e5e7eb; text-align: center; font-size: 8pt; color: #6b7280;">-</td>`;
            }
            return `<td style="border: 1px solid #000; text-align: center; font-weight: bold; font-size: 9pt;">${allocated ? allocated : ''}</td>`;
          })
        )
        .join('');

      return `
        <tr>
          <td style="border: 1px solid #000; padding: 4px; text-align: center;">${idx + 1}</td>
          <td style="border: 1px solid #000; padding: 4px; font-weight: bold;">${item.element}</td>
          <td style="border: 1px solid #000; padding: 4px;">
            <strong>${item.chapterTitle}</strong><br/>
            <span style="font-size: 8pt; color: #374151;">${item.learningObjective}</span>
          </td>
          <td style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: bold;">${item.allocatedHours}</td>
          ${weekCells}
        </tr>
      `;
    })
    .join('');

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Promes PAI SDN Pohjentrek II</title>
    <style>
      @page { size: landscape; margin: 12mm; }
      body { font-family: 'Times New Roman', serif; font-size: 9.5pt; line-height: 1.2; }
      table { border-collapse: collapse; width: 100%; font-size: 8pt; }
      th { border: 1px solid #000; background-color: #f2f2f2; padding: 3px; font-weight: bold; }
    </style>
    </head>
    <body>
      ${kop}
      <table>
        <thead>
          <tr>
            <th rowspan="2" style="width: 3%;">No</th>
            <th rowspan="2" style="width: 12%;">Elemen</th>
            <th rowspan="2" style="width: 32%;">Materi / Tujuan Pembelajaran</th>
            <th rowspan="2" style="width: 5%;">Jml JP</th>
            ${monthHeaderCols}
          </tr>
          <tr>
            ${weekHeaderCols}
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background-color: #f2f2f2; font-weight: bold;">
            <td colspan="3" style="border: 1px solid #000; padding: 4px; text-align: center;">TOTAL JAM PELAJARAN</td>
            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${totalJP}</td>
            <td colspan="${rpeData.totalWeeks}" style="border: 1px solid #000; padding: 4px; text-align: center;">-</td>
          </tr>
        </tbody>
      </table>
      ${signature}
    </body>
    </html>
  `;

  downloadBlob(
    htmlContent,
    `PROMES_PAI_Kelas${profile.selectedGrade}_Sem${rpeData.semester}_${profile.schoolName.replace(/\s+/g, '_')}.doc`,
    'application/msword'
  );
}

// Export to CSV / Excel
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  downloadBlob(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}
