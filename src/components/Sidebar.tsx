import React from 'react';
import {
  LayoutDashboard, Building2, Users, GraduationCap, BookOpen,
  DoorOpen, FlaskConical, Sliders, CalendarClock, TableProperties,
  UserCheck, Building, AlertTriangle, BarChart3, Download,
  Bot, Settings, ChevronRight, ChevronLeft, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { Language, Role } from '../types';
import { translations } from '../i18n/translations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  role: Role;
  conflictCount: number;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, lang, role, conflictCount,
  isCollapsed, setIsCollapsed
}) => {
  const t = translations[lang];

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard, roles: ['admin', 'faculty', 'student'] },
    { id: 'generate', label: t.navGenerate, icon: CalendarClock, roles: ['admin'], badge: 'OR-Tools' },
    { id: 'student-tt', label: t.navStudentTT, icon: TableProperties, roles: ['admin', 'faculty', 'student'] },
    { id: 'faculty-tt', label: t.navFacultyTT, icon: UserCheck, roles: ['admin', 'faculty'] },
    { id: 'room-tt', label: t.navRoomTT, icon: Building, roles: ['admin', 'faculty'] },
    { id: 'conflicts', label: t.navConflicts, icon: AlertTriangle, roles: ['admin', 'faculty'], count: conflictCount },
    { id: 'departments', label: t.navDepartments, icon: Building2, roles: ['admin'] },
    { id: 'faculty', label: t.navFaculty, icon: Users, roles: ['admin'] },
    { id: 'students', label: t.navStudents, icon: GraduationCap, roles: ['admin'] },
    { id: 'subjects', label: t.navSubjects, icon: BookOpen, roles: ['admin'], badge: 'NEP 2020' },
    { id: 'classrooms', label: t.navClassrooms, icon: DoorOpen, roles: ['admin'] },
    { id: 'laboratories', label: t.navLaboratories, icon: FlaskConical, roles: ['admin'] },
    { id: 'constraints', label: t.navConstraints, icon: Sliders, roles: ['admin'] },
    { id: 'analytics', label: t.navAnalytics, icon: BarChart3, roles: ['admin', 'faculty'] },
    { id: 'exports', label: t.navExports, icon: Download, roles: ['admin', 'faculty', 'student'] },
    { id: 'ai-assistant', label: t.navAIAssistant, icon: Bot, roles: ['admin', 'faculty', 'student'], badge: 'AI' },
    { id: 'settings', label: t.navSettings, icon: Settings, roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside
      className={`relative ${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none transition-all duration-300 ease-in-out`}
    >
      {/* Edge Toggle Button on the Slider Side */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand sidebar" : "Close sidebar"}
        aria-label={isCollapsed ? "Expand sidebar" : "Close sidebar"}
        className="absolute -right-3 top-5 z-30 w-6 h-6 bg-slate-800 border border-slate-700 text-slate-300 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white shadow-md transition-colors cursor-pointer"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Brand & Close/Open Button */}
      <div className={`p-3.5 border-b border-slate-800 flex items-center ${isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrfJJkNVbBUaCNN_fsvLCQWkQRPcxpFT9Ciopk9hQVOHDdPyLogGAybqup&s=10"
            alt="Logo"
            className="w-9 h-9 rounded-lg object-cover shadow-sm shrink-0"
          />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-base tracking-tight text-white leading-tight truncate">
                {t.appTitle}
              </h1>
            </div>
          )}
        </div>

        {/* Button in Slider Side to Close/Open */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Open sidebar" : "Close sidebar"}
          aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-blue-400" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {!isCollapsed && (
          <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
        )}
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
              } rounded-md text-xs font-medium transition-colors relative ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full">
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded ${
                      isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3 h-3 ${isActive ? 'text-blue-200' : 'text-slate-600'}`} />
                </div>
              )}

              {/* Collapsed dot badge indicator if item has count */}
              {isCollapsed && item.count !== undefined && item.count > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
