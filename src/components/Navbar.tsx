import React from 'react';
import { SchoolProfile, SemesterType } from '../types';
import { 
  Calendar, 
  FileSpreadsheet, 
  BookOpen, 
  Sparkles, 
  Printer, 
  Settings, 
  School,
  GraduationCap,
  Award
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'kaldik' | 'rpe' | 'prota' | 'promes' | 'ai_assistant';
  setActiveTab: (tab: 'kaldik' | 'rpe' | 'prota' | 'promes' | 'ai_assistant') => void;
  profile: SchoolProfile;
  semester: SemesterType;
  setSemester: (sem: SemesterType) => void;
  onOpenProfile: () => void;
  onOpenUpload: () => void;
  onOpenPrint: () => void;
  onOpenCPTPModal: () => void;
  onChangeGrade: (grade: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  semester,
  setSemester,
  onOpenProfile,
  onOpenUpload,
  onOpenPrint,
  onOpenCPTPModal,
  onChangeGrade
}) => {
  return (
    <header className="bg-emerald-900 text-white border-b border-emerald-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand zone: single text element */}
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-700 p-2 rounded-lg text-emerald-100 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">KaldikPAI</span>
                <span className="bg-emerald-800 text-emerald-200 text-xs px-2 py-0.5 rounded font-bold border border-emerald-700">
                  TP {profile.academicYear}
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                SDN Pohjentrek II Kota Pasuruan • Kurikulum Merdeka
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-emerald-950/60 p-1 rounded-xl border border-emerald-800/60">
            <button
              onClick={() => setActiveTab('kaldik')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'kaldik'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Kalender Pendidikan</span>
            </button>

            <button
              onClick={() => setActiveTab('rpe')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'rpe'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>RPE (Pekan Efektif)</span>
            </button>

            <button
              onClick={() => setActiveTab('prota')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'prota'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Prota (Tahunan)</span>
            </button>

            <button
              onClick={() => setActiveTab('promes')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'promes'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Promes (Semester)</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_assistant')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ai_assistant'
                  ? 'bg-amber-500 text-emerald-950 font-bold shadow-sm'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-emerald-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ahli Kurikulum AI</span>
            </button>
          </nav>

          {/* Action Zone: Class Selector, Semester Switch & Actions */}
          <div className="flex items-center space-x-2">
            {/* Grade Selector */}
            <div className="flex items-center bg-emerald-950/80 rounded-lg border border-emerald-700/80 px-2 py-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-300 mr-1.5" />
              <select
                value={profile.selectedGrade}
                onChange={(e) => onChangeGrade(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value={1} className="bg-emerald-900 text-white">Kelas 1 SD (Fase A)</option>
                <option value={2} className="bg-emerald-900 text-white">Kelas 2 SD (Fase A)</option>
                <option value={3} className="bg-emerald-900 text-white">Kelas 3 SD (Fase B)</option>
                <option value={4} className="bg-emerald-900 text-white">Kelas 4 SD (Fase B)</option>
                <option value={5} className="bg-emerald-900 text-white">Kelas 5 SD (Fase C)</option>
                <option value={6} className="bg-emerald-900 text-white">Kelas 6 SD (Fase C)</option>
              </select>
            </div>

            {/* Semester Switch */}
            <div className="flex items-center bg-emerald-950/80 rounded-lg p-0.5 border border-emerald-700/80 text-xs">
              <button
                onClick={() => setSemester(1)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  semester === 1
                    ? 'bg-emerald-500 text-emerald-950 font-bold'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Sem 1
              </button>
              <button
                onClick={() => setSemester(2)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  semester === 2
                    ? 'bg-emerald-500 text-emerald-950 font-bold'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Sem 2
              </button>
            </div>

            {/* Template CP & TP Quick Button */}
            <button
              onClick={onOpenCPTPModal}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-300 transition-colors flex items-center space-x-1 shadow-xs"
              title="Buka Bank Template Otomatis Capaian Pembelajaran (CP) & Tujuan Pembelajaran (TP)"
            >
              <Award className="w-3.5 h-3.5 text-emerald-900" />
              <span className="hidden xl:inline">Template CP & TP</span>
            </button>

            {/* Upload Kaldik Trigger */}
            <button
              onClick={onOpenUpload}
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-emerald-600 transition-colors flex items-center space-x-1"
              title="Upload atau Ubah Kalender Pendidikan"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden lg:inline">Input Kaldik</span>
            </button>

            {/* Print Official Document Trigger */}
            <button
              onClick={onOpenPrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-emerald-500 transition-colors flex items-center space-x-1"
              title="Cetak Format Resmi Dinas Pendidikan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            {/* School Profile Settings */}
            <button
              onClick={onOpenProfile}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
              title="Pengaturan Guru & Sekolah"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-emerald-800 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('kaldik')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'kaldik' ? 'bg-emerald-600 font-bold text-white' : 'text-emerald-200'
            }`}
          >
            Kalender
          </button>
          <button
            onClick={() => setActiveTab('rpe')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'rpe' ? 'bg-emerald-600 font-bold text-white' : 'text-emerald-200'
            }`}
          >
            RPE
          </button>
          <button
            onClick={() => setActiveTab('prota')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'prota' ? 'bg-emerald-600 font-bold text-white' : 'text-emerald-200'
            }`}
          >
            Prota
          </button>
          <button
            onClick={() => setActiveTab('promes')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap ${
              activeTab === 'promes' ? 'bg-emerald-600 font-bold text-white' : 'text-emerald-200'
            }`}
          >
            Promes
          </button>
          <button
            onClick={onOpenCPTPModal}
            className="px-2.5 py-1 rounded-md whitespace-nowrap font-bold bg-amber-400 text-emerald-950"
          >
            ⭐ CP & TP
          </button>
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'ai_assistant' ? 'bg-amber-400 text-emerald-950 font-bold' : 'text-amber-300'
            }`}
          >
            ✨ Ahli AI
          </button>
        </div>
      </div>
    </header>
  );
};
