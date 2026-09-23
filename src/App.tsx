import React, { useState, useEffect } from 'react';
import { Language, Role, TimetableEntry, ConflictItem, OptimizationMetrics } from './types';
import {
  initialDepartments, initialFaculty, initialStudentGroups,
  initialSubjects, initialClassrooms, initialLaboratories,
  initialTimeSlots, initialConstraints
} from './data/initialData';
import { runOptimizationEngine } from './engine/scheduler';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GenerateView } from './components/GenerateView';
import { TimetableView } from './components/TimetableView';
import { ConflictView } from './components/ConflictView';
import { AnalyticsView } from './components/AnalyticsView';
import { ManagementViews } from './components/ManagementViews';
import { ExportView } from './components/ExportView';
import { AIAssistantView } from './components/AIAssistantView';
import { FileUploadView } from './components/FileUploadView';
import { saveTimetableToCloud, loadTimetableFromCloud } from './firebase';

export function App() {
  // Global App States
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<Role>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDeptId, setSelectedDeptId] = useState<number | 'all'>('all');
  const [selectedSemester, setSelectedSemester] = useState<number>(3);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Core Data Collections
  const [departments] = useState(initialDepartments);
  const [faculty, setFaculty] = useState(initialFaculty);
  const [studentGroups, setStudentGroups] = useState(initialStudentGroups);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [classrooms, setClassrooms] = useState(initialClassrooms);
  const [laboratories, setLaboratories] = useState(initialLaboratories);
  const [timeSlots] = useState(initialTimeSlots);
  const [constraints, setConstraints] = useState(initialConstraints);

  // Scheduler Execution State
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    status: 'OPTIMAL',
    score: 98.4,
    hardConstraintsSatisfied: 100,
    softConstraintsSatisfied: 96.5,
    totalClassesScheduled: 64,
    facultyWorkloadBalance: 92,
    classroomUtilization: 78
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Initial solve on mount
  useEffect(() => {
    const result = runOptimizationEngine({
      departments,
      faculty,
      studentGroups,
      subjects,
      classrooms,
      laboratories,
      timeSlots,
      constraints,
      semester: selectedSemester,
      avoidConsecutive: true,
      maxConsecutive: 3
    });

    setEntries(result.entries);
    setConflicts(result.conflicts);
    setMetrics(result.metrics);
  }, [selectedSemester]);

  // Handler for full generation
  const handleGenerate = async (config: any) => {
    setIsGenerating(true);
    // Realistic solving delay for algorithm execution
    await new Promise(resolve => setTimeout(resolve, 600));

    const result = runOptimizationEngine({
      departments,
      faculty,
      studentGroups,
      subjects,
      classrooms,
      laboratories,
      timeSlots,
      constraints,
      semester: config.semester || selectedSemester,
      avoidConsecutive: config.avoidConsecutive !== undefined ? config.avoidConsecutive : true,
      maxConsecutive: config.maxConsecutive || 3
    });

    setEntries(result.entries);
    setConflicts(result.conflicts);
    setMetrics(result.metrics);
    setIsGenerating(false);
  };

  // Conflict Simulation for testing
  const handleInjectTestConflict = () => {
    // Inject artificial collision: Dr. Sharma booked in 2 rooms at Monday 09:00 AM
    const conflictEntry: TimetableEntry = {
      id: "conflict_test_1",
      day: "Monday",
      slotIndex: 0,
      startTime: "09:00",
      endTime: "10:00",
      subjectId: 7,
      subjectName: "Artificial Intelligence & ML",
      subjectCode: "CS304",
      subjectType: "Elective",
      facultyId: 1,
      facultyName: "Dr. Arvind Sharma",
      studentGroupId: 2,
      studentGroupName: "CSE-3B",
      roomId: 2,
      roomNumber: "CR-102"
    };

    setEntries(prev => [conflictEntry, ...prev]);
    setConflicts([
      {
        id: "conf_manual_1",
        conflictType: "Faculty Double-Booking Clash",
        affectedEntity: "Dr. Arvind Sharma (CSE)",
        timeSlot: "Monday 09:00 - 10:00 AM",
        description: "Dr. Arvind Sharma is simultaneously scheduled for CS301 in CR-101 and CS304 in CR-102.",
        severity: "HIGH",
        suggestedResolution: "Reschedule CS304 to Wednesday 02:00 PM or assign co-faculty."
      }
    ]);
    setMetrics(prev => ({
      ...prev,
      hardConstraintsSatisfied: 98,
      score: 72.4,
      status: 'FEASIBLE'
    }));
  };

  // Auto Resolve
  const handleAutoResolve = () => {
    handleGenerate({
      semester: selectedSemester,
      avoidConsecutive: true,
      maxConsecutive: 3
    });
  };

  // Firebase Cloud Sync
  const handleSyncToCloud = async () => {
    try {
      setIsSyncing(true);
      await saveTimetableToCloud(selectedSemester, entries, metrics, conflicts);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedTime(timeStr);
    } catch (err) {
      console.error("Firebase sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateConstraints = (updated: any) => {
    setConstraints(updated);
  };

  // Render view router
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            lang={lang}
            metrics={metrics}
            facultyCount={faculty.length}
            studentCount={studentGroups.reduce((acc, g) => acc + g.studentCount, 0)}
            subjectCount={subjects.length}
            classroomCount={classrooms.length}
            labCount={laboratories.length}
            conflictCount={conflicts.length}
            entries={entries}
            subjects={subjects}
            setActiveTab={setActiveTab}
            onGenerateClick={() => setActiveTab('generate')}
            onExportClick={() => setActiveTab('exports')}
          />
        );

      case 'generate':
        return (
          <GenerateView
            lang={lang}
            departments={departments}
            faculty={faculty}
            studentGroups={studentGroups}
            subjects={subjects}
            classrooms={classrooms}
            laboratories={laboratories}
            selectedSemester={selectedSemester}
            metrics={metrics}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            setActiveTab={setActiveTab}
          />
        );

      case 'student-tt':
        return (
          <TimetableView
            viewType="student"
            entries={entries}
            studentGroups={studentGroups}
            facultyList={faculty}
            classrooms={classrooms}
            laboratories={laboratories}
            lang={lang}
            role={role}
          />
        );

      case 'faculty-tt':
        return (
          <TimetableView
            viewType="faculty"
            entries={entries}
            studentGroups={studentGroups}
            facultyList={faculty}
            classrooms={classrooms}
            laboratories={laboratories}
            lang={lang}
            role={role}
          />
        );

      case 'room-tt':
        return (
          <TimetableView
            viewType="room"
            entries={entries}
            studentGroups={studentGroups}
            facultyList={faculty}
            classrooms={classrooms}
            laboratories={laboratories}
            lang={lang}
            role={role}
          />
        );

      case 'conflicts':
        return (
          <ConflictView
            conflicts={conflicts}
            lang={lang}
            onAutoResolve={handleAutoResolve}
            onInjectTestConflict={handleInjectTestConflict}
            onClearConflicts={() => setConflicts([])}
          />
        );

      case 'analytics':
        return (
          <AnalyticsView
            lang={lang}
            metrics={metrics}
            facultyList={faculty}
            classrooms={classrooms}
            laboratories={laboratories}
            subjects={subjects}
            entries={entries}
          />
        );

      case 'exports':
        return (
          <ExportView
            entries={entries}
            studentGroups={studentGroups}
            facultyList={faculty}
            lang={lang}
          />
        );

      case 'ai-assistant':
        return (
          <AIAssistantView
            entries={entries}
            facultyList={faculty}
            conflicts={conflicts}
            lang={lang}
            role={role}
          />
        );

      case 'settings':
        return (
          <FileUploadView
            lang={lang}
          />
        );

      case 'departments':
      case 'faculty':
      case 'students':
      case 'subjects':
      case 'classrooms':
      case 'laboratories':
      case 'constraints':
        return (
          <ManagementViews
            view={activeTab}
            departments={departments}
            facultyList={faculty}
            studentGroups={studentGroups}
            subjects={subjects}
            classrooms={classrooms}
            laboratories={laboratories}
            constraints={constraints}
            lang={lang}
            onUpdateConstraints={handleUpdateConstraints}
          />
        );

      default:
        return (
          <DashboardView
            lang={lang}
            metrics={metrics}
            facultyCount={faculty.length}
            studentCount={165}
            subjectCount={subjects.length}
            classroomCount={classrooms.length}
            labCount={laboratories.length}
            conflictCount={conflicts.length}
            entries={entries}
            subjects={subjects}
            setActiveTab={setActiveTab}
            onGenerateClick={() => setActiveTab('generate')}
            onExportClick={() => setActiveTab('exports')}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        role={role}
        conflictCount={conflicts.length}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          lang={lang}
          setLang={setLang}
          role={role}
          setRole={setRole}
          departments={departments}
          selectedDeptId={selectedDeptId}
          setSelectedDeptId={setSelectedDeptId}
          selectedSemester={selectedSemester}
          setSelectedSemester={setSelectedSemester}
          isSidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onSyncToCloud={handleSyncToCloud}
          isSyncing={isSyncing}
          lastSyncedTime={lastSyncedTime}
        />

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
export default App;
