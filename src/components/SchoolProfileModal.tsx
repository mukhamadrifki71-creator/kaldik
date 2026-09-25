import React, { useState } from 'react';
import { SchoolProfile, DayOfWeek } from '../types';
import { X, Save, School, User, Award, Clock, CalendarCheck } from 'lucide-react';

interface SchoolProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onSave: (profile: SchoolProfile) => void;
}

export const SchoolProfileModal: React.FC<SchoolProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [formData, setFormData] = useState<SchoolProfile>({
    ...profile,
    schoolDaysPerWeek: profile.schoolDaysPerWeek || 6,
    teachingDays: profile.teachingDays && profile.teachingDays.length > 0 ? profile.teachingDays : ['Kamis']
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const currentTeachingDay = formData.teachingDays?.[0] || 'Kamis';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <School className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-lg">Profil Guru & Satuan Pendidikan</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Satuan Pendidikan */}
          <div>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <School className="w-4 h-4" /> Data Sekolah
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Satuan Pendidikan
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NPSN
                </label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Pelajaran
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder="2026/2027"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Sekolah
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kecamatan & Kota
                </label>
                <input
                  type="text"
                  value={`${formData.district}, ${formData.city}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setFormData({
                      ...formData,
                      district: parts[0]?.trim() || '',
                      city: parts[1]?.trim() || ''
                    });
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kota Titimangsa Surat
                </label>
                <input
                  type="text"
                  value={formData.cityDateLocation}
                  onChange={(e) => setFormData({ ...formData, cityDateLocation: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Guru PAI */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Data Guru Mata Pelajaran
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Guru PAI (Lengkap dengan Gelar)
                </label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Guru
                </label>
                <input
                  type="text"
                  value={formData.teacherNip}
                  onChange={(e) => setFormData({ ...formData, teacherNip: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan Guru
                </label>
                <input
                  type="text"
                  value={formData.teacherTitle}
                  onChange={(e) => setFormData({ ...formData, teacherTitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Kepala Sekolah */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Data Kepala Sekolah
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kepala Sekolah (Lengkap dengan Gelar)
                </label>
                <input
                  type="text"
                  value={formData.headmasterName}
                  onChange={(e) => setFormData({ ...formData, headmasterName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.headmasterNip}
                  onChange={(e) => setFormData({ ...formData, headmasterNip: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.headmasterTitle}
                  onChange={(e) => setFormData({ ...formData, headmasterTitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Jam Pelajaran & Hari Mengajar */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Pengaturan Jam & Jadwal Mengajar KBM
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alokasi JP per Pekan (1 Pertemuan)
                </label>
                <select
                  value={formData.jpPerWeek}
                  onChange={(e) => setFormData({ ...formData, jpPerWeek: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                >
                  <option value={4}>4 Jam Pelajaran (JP) / Pekan (1 Pertemuan = 4 JP)</option>
                  <option value={3}>3 Jam Pelajaran (JP) / Pekan (1 Pertemuan = 3 JP)</option>
                  <option value={2}>2 Jam Pelajaran (JP) / Pekan (1 Pertemuan = 2 JP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sistem Hari Sekolah
                </label>
                <select
                  value={formData.schoolDaysPerWeek}
                  onChange={(e) => setFormData({ ...formData, schoolDaysPerWeek: Number(e.target.value) as 5 | 6 })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                >
                  <option value={6}>6 Hari Sekolah (Senin - Sabtu) [Standar Kota Pasuruan]</option>
                  <option value={5}>5 Hari Sekolah (Senin - Jumat)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Hari Mengajar PAI Kelas Ini:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as DayOfWeek[]).map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setFormData({ ...formData, teachingDays: [day] })}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                        currentTeachingDay === day
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Jadwal Prota & Promes akan menghitung jumlah hari aktif untuk hari ini dan menandai tanggal pertemuannya.
                </p>
              </div>
            </div>
          </div>

          {/* Konfigurasi Masuk & Awal Belajar Aktif (Opsional) */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4" /> Tanggal Masuk & Belajar Aktif (Opsional)
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">
              Secara default sistem mendeteksi tanggal masuk dan awal belajar aktif secara otomatis dari Kalender Pendidikan (Kaldik). Anda dapat menentukan tanggal khusus jika sekolah memiliki kebijakan khusus:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Semester 1: Tanggal Masuk Sekolah
                </label>
                <input
                  type="date"
                  value={formData.semester1StartDate || ''}
                  onChange={(e) => setFormData({ ...formData, semester1StartDate: e.target.value || undefined })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Semester 1: Mulai Hari Belajar Aktif (KBM)
                </label>
                <input
                  type="date"
                  value={formData.semester1ActiveLearningDate || ''}
                  onChange={(e) => setFormData({ ...formData, semester1ActiveLearningDate: e.target.value || undefined })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
