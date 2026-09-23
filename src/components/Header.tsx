import React from 'react';
import {
  Globe, Shield, User, GraduationCap, School, Layers,
  PanelLeftOpen, PanelLeftClose, Cloud, RefreshCw, CheckCircle2
} from 'lucide-react';
import { Department, Language, Role } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  role: Role;
  setRole: (role: Role) => void;
  departments: Department[];
  selectedDeptId: number | 'all';
  setSelectedDeptId: (id: number | 'all') => void;
  selectedSemester: number;
  setSelectedSemester: (sem: number) => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onSyncToCloud?: () => Promise<void>;
  isSyncing?: boolean;
  lastSyncedTime?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  lang, setLang, role, setRole, departments,
  selectedDeptId, setSelectedDeptId, selectedSemester, setSelectedSemester,
  isSidebarCollapsed, onToggleSidebar, onSyncToCloud, isSyncing, lastSyncedTime
}) => {
  const t = translations[lang];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs shrink-0 z-10">
      {/* Left: Academic Session & Selectors */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Expand sidebar" : "Close sidebar"}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Close sidebar"}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer mr-1"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-blue-600" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-slate-600" />
            )}
          </button>
        )}

        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs border-r border-slate-200 pr-4">
          <School className="w-4 h-4 text-blue-600" />
          <span className="text-slate-900 hidden sm:inline">Session:2026-27</span>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            aria-label="Department Filter"
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">{t.allDepartments}</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 hidden md:inline">{t.semester}:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            aria-label="Semester Filter"
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={1}>Sem 1 (Foundation)</option>
            <option value={3}>Sem 3 (Core & Multidisciplinary)</option>
            <option value={5}>Sem 5 (Major Specialization)</option>
            <option value={7}>Sem 7 (Research & Capstone)</option>
          </select>
        </div>
      </div>

      {/* Right: Firebase Cloud Sync, Language & Role Switcher */}
      <div className="flex items-center gap-3">
    

        {/* Language Selector */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
              lang === 'en' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
              lang === 'hi' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-300">
            <button
              onClick={() => setRole('admin')}
              title="Switch to Administrator View"
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                role === 'admin' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Admin</span>
            </button>
            <button
              onClick={() => setRole('faculty')}
              title="Switch to Faculty View"
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                role === 'faculty' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Faculty</span>
            </button>
            <button
              onClick={() => setRole('student')}
              title="Switch to Student View"
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                role === 'student' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Student</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
