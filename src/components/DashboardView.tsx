import React from 'react';
import {
  Users, GraduationCap, BookOpen, DoorOpen, FlaskConical,
  CheckCircle2, AlertTriangle, Cpu, Play, Download, Bot,
  Layers, ArrowUpRight, Sparkles, Cloud
} from 'lucide-react';
import {
  Department, Faculty, StudentGroup, Subject, Classroom,
  Laboratory, OptimizationMetrics, TimetableEntry, Language
} from '../types';
import { translations } from '../i18n/translations';

interface DashboardViewProps {
  lang: Language;
  metrics: OptimizationMetrics;
  facultyCount: number;
  studentCount: number;
  subjectCount: number;
  classroomCount: number;
  labCount: number;
  conflictCount: number;
  entries: TimetableEntry[];
  subjects: Subject[];
  setActiveTab: (tab: string) => void;
  onGenerateClick: () => void;
  onExportClick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang, metrics, facultyCount, studentCount, subjectCount,
  classroomCount, labCount, conflictCount, entries, subjects,
  setActiveTab, onGenerateClick, onExportClick
}) => {
  const t = translations[lang];

  // NEP 2020 Categorization counts
  const nepCounts: Record<string, number> = {
    Major: 0, Minor: 0, Elective: 0, Multidisciplinary: 0,
    AEC: 0, SEC: 0, VAC: 0, Lab: 0
  };
  subjects.forEach(s => {
    if (nepCounts[s.subjectType] !== undefined) {
      nepCounts[s.subjectType]++;
    }
  });

  const scheduledCount = entries.filter(e => !e.isBreak).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-blue-900  to-slate-900 text-white rounded-xl p-6 shadow-sm border border-blue-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
           
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {t.appTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onGenerateClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              {t.btnGenerate}
            </button>
            <button
              onClick={onExportClick}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {t.navExports}
            </button>
          </div>
        </div>
      </div>

      {/* 8 Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Faculty */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium truncate">{t.cardFaculty}</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{facultyCount}</div>
          <div className="text-[10px] text-emerald-600 font-medium">100% Active</div>
        </div>

        {/* Total Students */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium truncate">{t.cardStudents}</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{studentCount}</div>
          <div className="text-[10px] text-slate-500 font-medium">3 Cohort Batches</div>
        </div>

        {/* Total Subjects */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium truncate">{t.cardSubjects}</span>
            <BookOpen className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{subjectCount}</div>
          <div className="text-[10px] text-purple-600 font-medium">8 NEP Streams</div>
        </div>

        {/* Classrooms */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium truncate">{t.cardRooms}</span>
            <DoorOpen className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{classroomCount}</div>
          <div className="text-[10px] text-slate-500 font-medium">Capacity 60-120</div>
        </div>

        {/* Labs */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium truncate">{t.cardLabs}</span>
            <FlaskConical className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{labCount}</div>
          <div className="text-[10px] text-teal-600 font-medium">CS & Hardware</div>
        </div>

        {/* Scheduled Classes */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium truncate">{t.cardScheduled}</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{scheduledCount}</div>
          <div className="text-[10px] text-blue-600 font-medium">Weekly Lectures</div>
        </div>

        {/* Active Conflicts */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium truncate">{t.cardConflicts}</span>
            <AlertTriangle className={`w-4 h-4 ${conflictCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
          </div>
          <div className={`text-xl font-bold ${conflictCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {conflictCount}
          </div>
          <div className={`text-[10px] font-medium ${conflictCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {conflictCount === 0 ? t.zeroConflicts : 'Requires Attention'}
          </div>
        </div>

        {/* Optimization Status */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium truncate">OR-Tools Score</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{metrics.score}%</div>
          <div className="text-[10px] text-emerald-600 font-medium">{metrics.status}</div>
        </div>
      </div>

      {/* NEP 2020 Curriculum Distribution & Architecture Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NEP 2020 Breakdown Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              
              <p className="text-xs text-slate-500">
                Course distribution across major disciplines, open electives, and skill enhancement
              </p>
            </div>
            <button
              onClick={() => setActiveTab('subjects')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              Manage Subjects <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="text-[11px] text-blue-700 font-semibold uppercase">{t.major}</div>
              <div className="text-lg font-bold text-blue-900 mt-1">{nepCounts.Major} Subjects</div>
              <div className="text-[10px] text-blue-600">4 Credits (Core CS/EC)</div>
            </div>

            <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg">
              <div className="text-[11px] text-sky-700 font-semibold uppercase">{t.minor}</div>
              <div className="text-lg font-bold text-sky-900 mt-1">{nepCounts.Minor} Subjects</div>
              <div className="text-[10px] text-sky-600">3 Credits (Inter-dept)</div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
              <div className="text-[11px] text-purple-700 font-semibold uppercase">{t.elective}</div>
              <div className="text-lg font-bold text-purple-900 mt-1">{nepCounts.Elective} Subjects</div>
              <div className="text-[10px] text-purple-600">Discipline Specialization</div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
              <div className="text-[11px] text-emerald-700 font-semibold uppercase">{t.multidisciplinary}</div>
              <div className="text-lg font-bold text-emerald-900 mt-1">{nepCounts.Multidisciplinary} Subjects</div>
              <div className="text-[10px] text-emerald-600">Open Cross-Faculty</div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="text-[11px] text-amber-700 font-semibold uppercase">{t.aec}</div>
              <div className="text-lg font-bold text-amber-900 mt-1">{nepCounts.AEC} Subjects</div>
              <div className="text-[10px] text-amber-600">Communication & Lang</div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg">
              <div className="text-[11px] text-teal-700 font-semibold uppercase">{t.sec}</div>
              <div className="text-lg font-bold text-teal-900 mt-1">{nepCounts.SEC} Subjects</div>
              <div className="text-[10px] text-teal-600">Applied Tech / Analytics</div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
              <div className="text-[11px] text-rose-700 font-semibold uppercase">{t.vac}</div>
              <div className="text-lg font-bold text-rose-900 mt-1">{nepCounts.VAC} Subjects</div>
              <div className="text-[10px] text-rose-600">Ethics, Env & IKS</div>
            </div>

            <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg">
              <div className="text-[11px] text-orange-700 font-semibold uppercase">{t.lab}</div>
              <div className="text-lg font-bold text-orange-900 mt-1">{nepCounts.Lab} Courses</div>
              <div className="text-[10px] text-orange-600">Practical Facilities</div>
            </div>
          </div>
        </div>

        {/* Optimization Health & Engine Stats */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
           

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Hard Constraints Satisfied</span>
                  <span className="text-emerald-700 font-bold">{metrics.hardConstraintsSatisfied}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${metrics.hardConstraintsSatisfied}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Zero faculty, student, or room double-booking</div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Faculty Workload Balance</span>
                  <span className="text-blue-700 font-bold">{metrics.facultyWorkloadBalance}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${metrics.facultyWorkloadBalance}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Low variance across days of the week</div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Classroom & Lab Utilization</span>
                  <span className="text-indigo-700 font-bold">{metrics.classroomUtilization}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${metrics.classroomUtilization}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Optimal capacity allocation without overcrowding</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Solver Time: 0.18s</span>
            <button
              onClick={() => setActiveTab('conflicts')}
              className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
            >
              Inspect Conflict Scanner <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Action Bar */}
      
    </div>
  );
};
