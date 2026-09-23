import React, { useState } from 'react';
import {
  CalendarClock, Sliders, CheckCircle2, Play, RefreshCw,
  Sparkles, Layers, Cpu, ShieldCheck, AlertCircle
} from 'lucide-react';
import {
  Department, Faculty, StudentGroup, Subject, Classroom,
  Laboratory, OptimizationMetrics, Language
} from '../types';
import { translations } from '../i18n/translations';

interface GenerateViewProps {
  lang: Language;
  departments: Department[];
  faculty: Faculty[];
  studentGroups: StudentGroup[];
  subjects: Subject[];
  classrooms: Classroom[];
  laboratories: Laboratory[];
  selectedSemester: number;
  metrics: OptimizationMetrics;
  onGenerate: (config: any) => Promise<void>;
  isGenerating: boolean;
  setActiveTab: (tab: string) => void;
}

export const GenerateView: React.FC<GenerateViewProps> = ({
  lang, departments, faculty, studentGroups, subjects,
  classrooms, laboratories, selectedSemester, metrics,
  onGenerate, isGenerating, setActiveTab
}) => {
  const t = translations[lang];

  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [semester, setSemester] = useState(selectedSemester);
  const [workingDays, setWorkingDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [lunchSlot, setLunchSlot] = useState("12:00 - 13:00");
  const [avoidConsecutive, setAvoidConsecutive] = useState(true);
  const [maxConsecutive, setMaxConsecutive] = useState(3);
  const [balanceFaculty, setBalanceFaculty] = useState(true);
  const [balanceStudent, setBalanceStudent] = useState(true);
  const [syncElectives, setSyncElectives] = useState(true);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  const handleGenerateClick = async () => {
    setGenerationSuccess(false);
    await onGenerate({
      academicYear,
      semester,
      workingDays,
      startTime,
      endTime,
      lunchSlot,
      avoidConsecutive,
      maxConsecutive,
      balanceFaculty,
      balanceStudent,
      syncElectives
    });
    setGenerationSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-1">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            Google OR-Tools CP-SAT Optimization Engine
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t.generateTitle}</h2>
          <p className="text-xs text-slate-500">
            {t.generateSubtitle}. Handles high-combinatorial NEP 2020 elective structures without manual trial-and-error.
          </p>
        </div>

        <button
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t.generating}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{t.btnGenerate}</span>
            </>
          )}
        </button>
      </div>

      {/* Generation Success Feedback */}
      {generationSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-900">{t.successMsg}</div>
              <div className="text-[11px] text-emerald-700">
                100% hard constraints satisfied • Score: {metrics.score}% • Total classes: {metrics.totalClassesScheduled}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('student-tt')}
              className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
            >
              View Schedule
            </button>
          </div>
        </div>
      )}

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Timing Parameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CalendarClock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Academic Parameters</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500"
                >
                  <option value={1}>Semester 1</option>
                  <option value={3}>Semester 3</option>
                  <option value={5}>Semester 5</option>
                  <option value={7}>Semester 7</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lunch Interval</label>
                <input
                  type="text"
                  disabled
                  value={lunchSlot}
                  className="w-full bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-600 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Start</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Daily End</label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Active Teaching Days</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => {
                  const isChecked = workingDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          if (workingDays.length > 3) setWorkingDays(workingDays.filter(x => x !== d));
                        } else {
                          setWorkingDays([...workingDays, d]);
                        }
                      }}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        isChecked
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Soft Constraints & Heuristic Weights */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Optimization Constraints (CP-SAT)</h3>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-800">Balanced Faculty Teaching Load</span>
                <p className="text-[11px] text-slate-500">Minimize daily teaching variance to prevent faculty fatigue</p>
              </div>
              <input
                type="checkbox"
                checked={balanceFaculty}
                onChange={(e) => setBalanceFaculty(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 mt-0.5"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-800">Balanced Student Weekly Load</span>
                <p className="text-[11px] text-slate-500">Target 3–4 classes/day per student cohort (avoid 6-class days)</p>
              </div>
              <input
                type="checkbox"
                checked={balanceStudent}
                onChange={(e) => setBalanceStudent(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 mt-0.5"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-800">Avoid Excessive Consecutive Classes</span>
                <p className="text-[11px] text-slate-500">Enforce break/lunch after maximum {maxConsecutive} consecutive theory hours</p>
              </div>
              <input
                type="checkbox"
                checked={avoidConsecutive}
                onChange={(e) => setAvoidConsecutive(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 mt-0.5"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-800">NEP 2020 Multidisciplinary Sync</span>
                <p className="text-[11px] text-slate-500">Synchronize common university open electives in harmonized slots</p>
              </div>
              <input
                type="checkbox"
                checked={syncElectives}
                onChange={(e) => setSyncElectives(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 mt-0.5"
              />
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                Hard Constraints Enforced (Non-Negotiable):
              </div>
              <ul className="text-[11px] text-blue-800 list-disc list-inside space-y-0.5">
                <li>Zero faculty double-booking</li>
                <li>Zero student cohort overlap</li>
                <li>Physical room capacity &ge; student count</li>
                <li>Practical sessions strictly bound to labs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Resource Readiness Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">System Readiness</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Active Departments</span>
              <span className="font-bold text-slate-900">{departments.length}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Available Faculty</span>
              <span className="font-bold text-slate-900">{faculty.length} Members</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">NEP 2020 Subjects to Schedule</span>
              <span className="font-bold text-slate-900">{subjects.length} Subjects</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Student Cohort Batches</span>
              <span className="font-bold text-slate-900">{studentGroups.length} Groups</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Classrooms Available</span>
              <span className="font-bold text-slate-900">{classrooms.length} Lecture Halls</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Laboratories Available</span>
              <span className="font-bold text-slate-900">{laboratories.length} Special Labs</span>
            </div>

            <div className="pt-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Constraint Programming model will allocate all required subject credit hours without collisions.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
