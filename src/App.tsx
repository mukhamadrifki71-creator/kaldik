import { useState, useMemo, useEffect } from 'react';
import { 
  KaldikEvent, 
  SchoolProfile, 
  SemesterType, 
  ProtaItem, 
  AIAnalysisResult,
  DayOfWeek
} from './types';
import { DEFAULT_SCHOOL_PROFILE } from './data/defaultKaldik';
import { PAI_CURRICULUM_DATABASE } from './data/paiCurriculum';
import { calculateSemesterRPE, generatePromesMatrix } from './utils/calculator';
import { 
  loadSavedKaldikEvents, 
  saveKaldikEvents, 
  loadSavedAnalysisResult, 
  saveAnalysisResult,
  loadSavedSchoolProfile,
  saveSchoolProfile
} from './utils/kaldikStorage';

// Components
import { Navbar } from './components/Navbar';
import { KaldikViewer } from './components/KaldikViewer';
import { RPEView } from './components/RPEView';
import { ProtaView } from './components/ProtaView';
import { PromesView } from './components/PromesView';
import { AIIntegratorView } from './components/AIIntegratorView';
import { SchoolProfileModal } from './components/SchoolProfileModal';
import { KaldikUploaderModal } from './components/KaldikUploaderModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { CPTPTemplateModal } from './components/CPTPTemplateModal';

export default function App() {
  // Load saved school profile from localStorage or fallback to default
  const [profile, setProfile] = useState<SchoolProfile>(() => {
    return loadSavedSchoolProfile();
  });

  const [semester, setSemester] = useState<SemesterType>(1);
  const [activeTab, setActiveTab] = useState<'kaldik' | 'rpe' | 'prota' | 'promes' | 'ai_assistant'>('kaldik');

  // Master Kalender Pendidikan (Tersimpan di localStorage untuk Tahun Pelajaran aktif dan berlaku untuk semua kelas)
  const [events, setEvents] = useState<KaldikEvent[]>(() => {
    return loadSavedKaldikEvents(profile.academicYear);
  });

  // Cached AI analysis result (jika pernah dianalisis dengan AI)
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(() => {
    return loadSavedAnalysisResult(profile.academicYear);
  });

  // Program Tahunan (Prota) aktif untuk kelas yang dipilih
  const [protaItems, setProtaItems] = useState<ProtaItem[]>(() => {
    const cur = PAI_CURRICULUM_DATABASE[profile.selectedGrade || 4];
    const currentDay = profile.teachingDays?.[0] || 'Kamis';
    return cur ? cur.chapters.map(c => ({
      ...c,
      teachingDay: currentDay,
      numberOfMeetings: c.numberOfMeetings || Math.max(1, Math.round(c.allocatedHours / 4))
    })) : [];
  });

  // Alokasi manual per minggu pada Promes
  const [customPromesAllocations, setCustomPromesAllocations] = useState<Record<string, Record<string, number>>>({});

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isPrintOpen, setIsPrintOpen] = useState<boolean>(false);
  const [isCPTPOpen, setIsCPTPOpen] = useState<boolean>(false);

  // Simpan Kalender Pendidikan secara otomatis setiap kali ada penambahan/perubahan/penghapusan event atau upload baru
  useEffect(() => {
    saveKaldikEvents(profile.academicYear, events);
  }, [events, profile.academicYear]);

  // Simpan hasil analisis AI jika ada
  useEffect(() => {
    saveAnalysisResult(profile.academicYear, analysisResult);
  }, [analysisResult, profile.academicYear]);

  // Simpan profil sekolah saat diperbarui
  useEffect(() => {
    saveSchoolProfile(profile);
  }, [profile]);

  // Kembalikan fungsi ganti kelas ke fungsi semula:
  // Memilih kelas langsung memuat kurikulum resmi PAI kelas tersebut, sementara Kalender Pendidikan yang sudah disimpan tetap aktif.
  const handleChangeGrade = (newGrade: number) => {
    setProfile(prev => ({
      ...prev,
      selectedGrade: newGrade
    }));

    const cur = PAI_CURRICULUM_DATABASE[newGrade];
    if (cur) {
      const currentDay = profile.teachingDays?.[0] || 'Kamis';
      setProtaItems(cur.chapters.map(c => ({
        ...c,
        teachingDay: currentDay,
        numberOfMeetings: c.numberOfMeetings || Math.max(1, Math.round(c.allocatedHours / 4))
      })));
    }
    setCustomPromesAllocations({});
  };

  const handleUpdateTeachingDay = (day: DayOfWeek) => {
    setProfile(prev => ({
      ...prev,
      teachingDays: [day]
    }));

    setProtaItems(prev => prev.map(p => ({
      ...p,
      teachingDay: day
    })));
  };

  const handleResetDefaultCurriculum = () => {
    const cur = PAI_CURRICULUM_DATABASE[profile.selectedGrade];
    if (cur) {
      const currentDay = profile.teachingDays?.[0] || 'Kamis';
      setProtaItems(cur.chapters.map(c => ({
        ...c,
        teachingDay: currentDay,
        numberOfMeetings: c.numberOfMeetings || Math.max(1, Math.round(c.allocatedHours / 4))
      })));
      setCustomPromesAllocations({});
    }
  };

  const handleApplyCurriculumFromTemplate = (items: ProtaItem[]) => {
    setProtaItems(items);
    setCustomPromesAllocations({});
  };

  const handleUpdateAllocation = (protaItemId: string, weekKey: string, hours: number) => {
    setCustomPromesAllocations(prev => {
      const itemAlloc = { ...(prev[protaItemId] || {}) };
      if (hours <= 0) {
        delete itemAlloc[weekKey];
      } else {
        itemAlloc[weekKey] = hours;
      }
      return {
        ...prev,
        [protaItemId]: itemAlloc
      };
    });
  };

  const handleAutoDistributePromes = () => {
    setCustomPromesAllocations({});
  };

  // Re-calculate RPE secara otomatis dari Kalender Pendidikan tersimpan untuk kelas yang aktif
  const rpeData = useMemo(() => {
    const profileOverride = semester === 1
      ? (profile.semester1StartDate && profile.semester1ActiveLearningDate ? { startDate: profile.semester1StartDate, activeLearningDate: profile.semester1ActiveLearningDate } : undefined)
      : (profile.semester2StartDate && profile.semester2ActiveLearningDate ? { startDate: profile.semester2StartDate, activeLearningDate: profile.semester2ActiveLearningDate } : undefined);

    return calculateSemesterRPE(
      profile.academicYear,
      semester,
      profile.selectedGrade,
      profile.jpPerWeek,
      events,
      profile.schoolDaysPerWeek || 6,
      profile.teachingDays && profile.teachingDays.length > 0 ? profile.teachingDays : ['Kamis'],
      profileOverride
    );
  }, [profile.academicYear, semester, profile.selectedGrade, profile.jpPerWeek, events, profile.schoolDaysPerWeek, profile.teachingDays, profile.semester1StartDate, profile.semester1ActiveLearningDate, profile.semester2StartDate, profile.semester2ActiveLearningDate]);

  // Re-generate Promes Matrix secara otomatis
  const promesItems = useMemo(() => {
    return generatePromesMatrix(rpeData, protaItems, customPromesAllocations);
  }, [rpeData, protaItems, customPromesAllocations]);

  // Event handlers untuk Kalender Pendidikan (otomatis tersimpan ke localStorage)
  const handleAddEvent = (newEvent: KaldikEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: KaldikEvent) => {
    setEvents(prev => prev.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Menerapkan Kalender Pendidikan baru dari Upload/AI
  const handleApplyEventsFromModal = (newEvents: KaldikEvent[], result?: AIAnalysisResult) => {
    setEvents(newEvents);
    if (result) {
      setAnalysisResult(result);
    }
    setCustomPromesAllocations({});
    // Langsung simpan ke localStorage
    saveKaldikEvents(profile.academicYear, newEvents);
    if (result) {
      saveAnalysisResult(profile.academicYear, result);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        semester={semester}
        setSemester={setSemester}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
        onOpenCPTPModal={() => setIsCPTPOpen(true)}
        onChangeGrade={handleChangeGrade}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'kaldik' && (
          <KaldikViewer
            events={events}
            semester={semester}
            academicYear={profile.academicYear}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeTab === 'rpe' && (
          <RPEView
            rpeData={rpeData}
            profile={profile}
            onOpenPrint={() => setIsPrintOpen(true)}
            onUpdateTeachingDay={handleUpdateTeachingDay}
          />
        )}

        {activeTab === 'prota' && (
          <ProtaView
            protaItems={protaItems}
            profile={profile}
            events={events}
            annualTargetJP={PAI_CURRICULUM_DATABASE[profile.selectedGrade]?.totalAnnualJP || 136}
            onUpdateProtaItems={setProtaItems}
            onOpenPrint={() => setIsPrintOpen(true)}
            onResetDefaultCurriculum={handleResetDefaultCurriculum}
            onOpenCPTPModal={() => setIsCPTPOpen(true)}
            onUpdateTeachingDay={handleUpdateTeachingDay}
          />
        )}

        {activeTab === 'promes' && (
          <PromesView
            rpeData={rpeData}
            protaItems={protaItems}
            promesItems={promesItems}
            profile={profile}
            semester={semester}
            onUpdateAllocation={handleUpdateAllocation}
            onAutoDistribute={handleAutoDistributePromes}
            onOpenPrint={() => setIsPrintOpen(true)}
            onUpdateTeachingDay={handleUpdateTeachingDay}
          />
        )}

        {activeTab === 'ai_assistant' && (
          <AIIntegratorView
            profile={profile}
            rpeData={rpeData}
            protaItems={protaItems}
            analysisResult={analysisResult}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} <strong>KaldikPAI</strong> — SDN Pohjentrek II Kota Pasuruan, Jawa Timur.
          </p>
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-800 font-semibold">
              Kalender Pendidikan TP {profile.academicYear} Tersimpan
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SchoolProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={setProfile}
      />

      <KaldikUploaderModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        profile={profile}
        onApplyEvents={handleApplyEventsFromModal}
      />

      <CPTPTemplateModal
        isOpen={isCPTPOpen}
        onClose={() => setIsCPTPOpen(false)}
        profile={profile}
        onApplyCurriculum={handleApplyCurriculumFromTemplate}
      />

      <PrintPreviewModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        profile={profile}
        rpeData={rpeData}
        protaItems={protaItems}
        promesItems={promesItems}
        onChangePrintGrade={handleChangeGrade}
      />
    </div>
  );
}
