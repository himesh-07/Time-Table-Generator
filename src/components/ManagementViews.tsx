import React, { useState } from 'react';
import {
  Building2, Users, GraduationCap, BookOpen, DoorOpen,
  FlaskConical, Sliders, Plus, Trash2, Edit2, Check, X,
  Shield, Sparkles, Filter
} from 'lucide-react';
import {
  Department, Faculty, StudentGroup, Subject, Classroom,
  Laboratory, ConstraintItem, Language, SubjectType
} from '../types';
import { translations } from '../i18n/translations';

interface ManagementViewsProps {
  view: 'departments' | 'faculty' | 'students' | 'subjects' | 'classrooms' | 'laboratories' | 'constraints';
  departments: Department[];
  facultyList: Faculty[];
  studentGroups: StudentGroup[];
  subjects: Subject[];
  classrooms: Classroom[];
  laboratories: Laboratory[];
  constraints: ConstraintItem[];
  lang: Language;
  onUpdateConstraints: (updated: ConstraintItem[]) => void;
  onAddFaculty?: (f: Faculty) => void;
  onAddSubject?: (s: Subject) => void;
}

export const ManagementViews: React.FC<ManagementViewsProps> = ({
  view, departments, facultyList, studentGroups, subjects,
  classrooms, laboratories, constraints, lang, onUpdateConstraints
}) => {
  const t = translations[lang];

  // State for toggling constraints
  const [localConstraints, setLocalConstraints] = useState<ConstraintItem[]>(constraints);

  const handleToggleConstraint = (id: number) => {
    const updated = localConstraints.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    setLocalConstraints(updated);
    onUpdateConstraints(updated);
  };

  const handleWeightChange = (id: number, weight: number) => {
    const updated = localConstraints.map(c => c.id === id ? { ...c, weight } : c);
    setLocalConstraints(updated);
    onUpdateConstraints(updated);
  };

  // 1. Departments View
  if (view === 'departments') {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.navDepartments}</h2>
            <p className="text-xs text-slate-500">Academic faculties participating in multidisciplinary course offerings.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Head of Department (HoD)</th>
                <th className="py-3 px-4">Faculty Count</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {departments.map(d => {
                const facCount = facultyList.filter(f => f.departmentId === d.id).length;
                return (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{d.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 text-slate-600">{d.hodName}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{facCount} Professors</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. Faculty View
  if (view === 'faculty') {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.navFaculty}</h2>
            <p className="text-xs text-slate-500">
              Teaching faculty profiles, workload ceilings, and availability reservations.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Name & Designation</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Max Workload</th>
                <th className="py-3 px-4">Preferred Timings</th>
                <th className="py-3 px-4">Reserved Constraints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {facultyList.map(f => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500 font-medium">{f.employeeCode}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{f.name}</div>
                    <div className="text-[11px] text-slate-500">{f.designation}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{f.departmentName}</td>
                  <td className="py-3 px-4 text-blue-700 font-bold">{f.maxWeeklyHours} hrs/week</td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {f.preferredStartTime} - {f.preferredEndTime}
                  </td>
                  <td className="py-3 px-4">
                    {f.unavailableSlots && f.unavailableSlots.length > 0 ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-semibold">
                        {f.unavailableSlots[0].day} (Slots {f.unavailableSlots.map(s => s.slotIndex).join(', ')})
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">— Fully Open —</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. Students / Batches View
  if (view === 'students') {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.navStudents}</h2>
            <p className="text-xs text-slate-500">
              Multidisciplinary cohort groups and choice-based elective enrollments under NEP 2020.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {studentGroups.map(g => {
            const groupSubjects = subjects.filter(s => g.subjectIds.includes(s.id));
            const totalCredits = groupSubjects.reduce((acc, s) => acc + s.credits, 0);

            return (
              <div key={g.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{g.name}</h3>
                    <p className="text-xs text-slate-500">Semester {g.semester} • Cohort Size: {g.studentCount}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {totalCredits} Credits
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase">Enrolled Subject Streams:</div>
                  <div className="flex flex-wrap gap-1">
                    {groupSubjects.map(s => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded border border-slate-200"
                        title={`${s.name} (${s.subjectType})`}
                      >
                        {s.code} ({s.subjectType.slice(0, 3)})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. Subjects View (NEP 2020 Categorized)
  if (view === 'subjects') {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.navSubjects}</h2>
            <p className="text-xs text-slate-500">
              Curriculum catalog under NEP 2020: Major, Minor, DSE, Multidisciplinary Open Electives, AEC, SEC, VAC, and Practical Labs.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">NEP 2020 Category</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">Hours/Week</th>
                <th className="py-3 px-4">Assigned Faculty</th>
                <th className="py-3 px-4">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subjects.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{s.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {s.subjectType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700">{s.credits} Credits</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{s.weeklyHours} hrs</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{s.primaryFacultyName || "TBA"}</td>
                  <td className="py-3 px-4">
                    {s.isLab ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        {s.requiredLabType || "Lab"}
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-500">
                        Theory
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 5. Classrooms & Laboratories
  if (view === 'classrooms' || view === 'laboratories') {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {view === 'classrooms' ? t.navClassrooms : t.navLaboratories}
            </h2>
            <p className="text-xs text-slate-500">
              Physical infrastructure facilities and seating capacities verified by CP-SAT solver.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(view === 'classrooms' ? classrooms : laboratories).map((room: any) => (
            <div key={room.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 text-base">{room.roomNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {room.capacity} Seats
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {room.building || room.labName} • {room.equipmentType || (room.hasProjector ? 'AV Projector Enabled' : 'Standard')}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Constraints View (Interactive Configuration)
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-1">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          Google OR-Tools Mathematical Formulation
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t.navConstraints}</h2>
        <p className="text-xs text-slate-500">
          Configure Hard Constraints (must be 100% satisfied) and Soft Constraints with weighted penalty coefficients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hard Constraints */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">{t.hardConstraints}</h3>
          </div>

          <div className="space-y-3">
            {localConstraints.filter(c => c.type === 'HARD').map(c => (
              <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{c.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                    ENFORCED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Constraints */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">{t.softConstraints}</h3>
          </div>

          <div className="space-y-4">
            {localConstraints.filter(c => c.type === 'SOFT').map(c => (
              <div key={c.id} className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={c.isActive}
                      onChange={() => handleToggleConstraint(c.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-slate-500">{c.description}</p>
                {c.isActive && (
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>Penalty Weight: <strong className="text-blue-700">{c.weight}</strong></span>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={c.weight}
                      onChange={(e) => handleWeightChange(c.id, Number(e.target.value))}
                      className="w-32 accent-blue-600"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
