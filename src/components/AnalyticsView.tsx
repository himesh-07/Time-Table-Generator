import React from 'react';
import {
  BarChart3, PieChart, Users, Building, Calendar,
  CheckCircle2, TrendingUp, Sparkles, Layers
} from 'lucide-react';
import {
  Faculty, Classroom, Laboratory, TimetableEntry,
  Subject, OptimizationMetrics, Language
} from '../types';
import { translations } from '../i18n/translations';

interface AnalyticsViewProps {
  lang: Language;
  metrics: OptimizationMetrics;
  facultyList: Faculty[];
  classrooms: Classroom[];
  laboratories: Laboratory[];
  subjects: Subject[];
  entries: TimetableEntry[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  lang, metrics, facultyList, classrooms, laboratories, subjects, entries
}) => {
  const t = translations[lang];

  // Faculty workload calculation
  const facultyLoads = facultyList.map(f => {
    const assigned = entries.filter(e => !e.isBreak && e.facultyId === f.id).length;
    const max = f.maxWeeklyHours || 16;
    const utilPct = Math.min(100, Math.round((assigned / max) * 100));
    return {
      faculty: f,
      assigned,
      max,
      utilPct
    };
  });

  // Daily class distribution
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const dailyCounts = days.map(day => {
    const count = entries.filter(e => !e.isBreak && e.day === day).length;
    return { day, count };
  });
  const maxDayCount = Math.max(...dailyCounts.map(d => d.count), 1);

  // Room & Lab utilization
  const allFacilities = [
    ...classrooms.map(c => ({ name: c.roomNumber, type: 'Classroom', capacity: c.capacity })),
    ...laboratories.map(l => ({ name: l.roomNumber, type: 'Laboratory', capacity: l.capacity }))
  ];

  const facilityUtil = allFacilities.map(fac => {
    const assignedHours = entries.filter(e => !e.isBreak && e.roomNumber === fac.name).length;
    // max possible teaching slots = 5 days * 7 active slots = 35
    const utilPct = Math.min(100, Math.round((assignedHours / 35) * 100));
    return {
      ...fac,
      assignedHours,
      utilPct
    };
  });

  // Subject Type Breakdown
  const typeCounts: Record<string, number> = {};
  subjects.forEach(s => {
    typeCounts[s.subjectType] = (typeCounts[s.subjectType] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            Institutional Optimization Analytics
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t.navAnalytics}</h2>
          <p className="text-xs text-slate-500">
            Workload distribution, facility utilization rates, and NEP 2020 course balancing metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-right">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Schedule Quality</div>
            <div className="text-sm font-bold text-emerald-600">{metrics.score}% Optimal</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-right">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Workload Balance</div>
            <div className="text-sm font-bold text-blue-600">{metrics.facultyWorkloadBalance}%</div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Workload Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">{t.facultyLoadDist}</h3>
            </div>
            <span className="text-[11px] text-slate-400">Assigned vs Max Cap</span>
          </div>

          <div className="space-y-3">
            {facultyLoads.map(({ faculty, assigned, max, utilPct }) => (
              <div key={faculty.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800 truncate max-w-[200px]" title={faculty.name}>
                    {faculty.name} <span className="text-[10px] text-slate-400">({faculty.employeeCode})</span>
                  </span>
                  <span className="text-slate-600 font-mono text-[11px]">
                    <strong className="text-blue-700">{assigned}</strong> / {max} hrs ({utilPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${utilPct >= 90 ? 'bg-amber-500' : 'bg-blue-600'}`}
                    style={{ width: `${utilPct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Class Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">{t.dailyLoad}</h3>
              </div>
              <span className="text-[11px] text-slate-400">Monday — Friday</span>
            </div>

            <div className="grid grid-cols-5 gap-3 pt-6 pb-2 items-end h-48">
              {dailyCounts.map(({ day, count }) => {
                const heightPct = Math.round((count / maxDayCount) * 100);
                return (
                  <div key={day} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-bold text-slate-700 font-mono">{count}</span>
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg relative flex items-end justify-center h-32 overflow-hidden">
                      <div
                        className="w-full bg-indigo-600 rounded-t-md transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">{day.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Even distribution: Average {Math.round(entries.filter(e => !e.isBreak).length / 5)} lectures/day</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Balanced Load
            </span>
          </div>
        </div>
      </div>

      {/* Facility Utilization & NEP 2020 Stream Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room & Lab Utilization */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-slate-800 text-sm">{t.roomUtilization}</h3>
            </div>
            <span className="text-[11px] text-slate-400">Weekly Slot Occupancy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facilityUtil.map((fac) => (
              <div key={fac.name} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{fac.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-white border border-slate-200 text-slate-600">
                    {fac.type}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Capacity: {fac.capacity} seats • {fac.assignedHours} hrs/wk
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-sky-600 h-1.5 rounded-full"
                    style={{ width: `${fac.utilPct}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-right font-medium text-slate-600">{fac.utilPct}% utilized</div>
              </div>
            ))}
          </div>
        </div>

        {/* NEP 2020 Subject Category Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-sm">{t.subjectDistribution}</h3>
            </div>
            <span className="text-[11px] text-slate-400">Credit Allocations</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{type}</div>
                  <div className="text-[10px] text-slate-500">NEP Syllabus Category</div>
                </div>
                <div className="text-lg font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
