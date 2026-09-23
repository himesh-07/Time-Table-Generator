import React, { useState } from 'react';
import {
  Download, Printer, Filter, Calendar, Users, Building,
  Clock, BookOpen, AlertCircle, Sparkles, Check
} from 'lucide-react';
import {
  TimetableEntry, StudentGroup, Faculty, Classroom,
  Laboratory, Language, Role, SubjectType
} from '../types';
import { translations } from '../i18n/translations';
import { exportTimetableToExcel, exportTimetableToPDF } from '../utils/exportUtils';

interface TimetableViewProps {
  viewType: 'student' | 'faculty' | 'room' | 'master';
  entries: TimetableEntry[];
  studentGroups: StudentGroup[];
  facultyList: Faculty[];
  classrooms: Classroom[];
  laboratories: Laboratory[];
  lang: Language;
  role: Role;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SLOTS = [
  { index: 0, time: "09:00 - 10:00" },
  { index: 1, time: "10:00 - 11:00" },
  { index: 2, time: "11:00 - 12:00" },
  { index: 3, time: "12:00 - 01:00", isBreak: true },
  { index: 4, time: "01:00 - 02:00" },
  { index: 5, time: "02:00 - 03:00" },
  { index: 6, time: "03:00 - 04:00" },
  { index: 7, time: "04:00 - 05:00" },
];

export const TimetableView: React.FC<TimetableViewProps> = ({
  viewType, entries, studentGroups, facultyList,
  classrooms, laboratories, lang, role
}) => {
  const t = translations[lang];

  // Selected filter states
  const [selectedGroupId, setSelectedGroupId] = useState<number>(studentGroups[0]?.id || 1);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number>(facultyList[0]?.id || 1);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("CR-101");

  // Filter entries based on viewType
  let filteredEntries: TimetableEntry[] = [];
  let viewTitle = "";
  let viewSubtitle = "";

  if (viewType === 'student') {
    const group = studentGroups.find(g => g.id === selectedGroupId) || studentGroups[0];
    viewTitle = group ? group.name : "Student Timetable";
    viewSubtitle = `Semester ${group?.semester || 3} • ${group?.studentCount || 60} Enrolled Students`;
    filteredEntries = entries.filter(e => e.isBreak || e.studentGroupId === selectedGroupId);
  } else if (viewType === 'faculty') {
    const fac = facultyList.find(f => f.id === selectedFacultyId) || facultyList[0];
    viewTitle = fac ? `${fac.name} (${fac.designation})` : "Faculty Timetable";
    viewSubtitle = `${fac?.departmentName || "Academic Dept"} • Max Load: ${fac?.maxWeeklyHours || 16} hrs/week`;
    filteredEntries = entries.filter(e => e.isBreak || e.facultyId === selectedFacultyId);
  } else if (viewType === 'room') {
    viewTitle = `Facility: ${selectedRoomId}`;
    viewSubtitle = "Room / Laboratory Occupancy Matrix";
    filteredEntries = entries.filter(e => e.isBreak || e.roomNumber === selectedRoomId);
  } else {
    viewTitle = "University Master Timetable";
    viewSubtitle = "Consolidated Academic Schedule (All Departments & Streams)";
    filteredEntries = entries;
  }

  // Calculate faculty workload stats if in faculty view
  const currentFac = facultyList.find(f => f.id === selectedFacultyId);
  const facultyAssignedHours = entries.filter(e => !e.isBreak && e.facultyId === selectedFacultyId).length;
  const facultyMaxHours = currentFac?.maxWeeklyHours || 16;
  const facultyLoadPct = Math.round((facultyAssignedHours / facultyMaxHours) * 100);

  // Subject Type Color Badge Helper
  const getSubjectTypeBadge = (type?: SubjectType, isLab?: boolean) => {
    if (isLab) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">LAB</span>;
    }
    switch (type) {
      case 'Major':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Major</span>;
      case 'Minor':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">Minor</span>;
      case 'Elective':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Elective</span>;
      case 'Multidisciplinary':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">NEP Open</span>;
      case 'AEC':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">AEC</span>;
      case 'SEC':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">SEC</span>;
      case 'VAC':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">VAC</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">Core</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: View selector */}
        <div className="flex flex-wrap items-center gap-3">
          {viewType === 'student' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">{t.viewBatch}:</span>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500"
              >
                {studentGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}

          {viewType === 'faculty' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">{t.viewFaculty}:</span>
              <select
                value={selectedFacultyId}
                onChange={(e) => setSelectedFacultyId(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500"
              >
                {facultyList.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.departmentName || f.employeeCode})</option>
                ))}
              </select>
            </div>
          )}

          {viewType === 'room' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">{t.viewRoom}:</span>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500"
              >
                <optgroup label="Classrooms">
                  {classrooms.map(c => (
                    <option key={c.id} value={c.roomNumber}>{c.roomNumber} ({c.building} - Cap: {c.capacity})</option>
                  ))}
                </optgroup>
                <optgroup label="Laboratories">
                  {laboratories.map(l => (
                    <option key={l.id} value={l.roomNumber}>{l.roomNumber} ({l.labName} - Cap: {l.capacity})</option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          <div className="text-xs text-slate-400 hidden lg:inline">|</div>
          <div className="text-xs font-medium text-slate-600">
            {viewSubtitle}
          </div>
        </div>

        {/* Right: Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportTimetableToExcel(filteredEntries, `${viewTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Schedule.xlsx`)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            {t.btnExportExcel}
          </button>
          <button
            onClick={() => exportTimetableToPDF(filteredEntries, viewTitle, viewSubtitle)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            {t.btnExportPDF}
          </button>
        </div>
      </div>

      {/* Faculty Workload Meter (if in faculty view) */}
      {viewType === 'faculty' && currentFac && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
              {currentFac.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{currentFac.name} Workload Status</div>
              <div className="text-[11px] text-slate-500">
                Weekly Teaching: <span className="font-semibold text-slate-800">{facultyAssignedHours} hours</span> / max {facultyMaxHours} hours
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-48">
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span className="text-slate-600">Capacity Utilization</span>
                <span className="text-blue-700">{facultyLoadPct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${facultyLoadPct > 100 ? 'bg-rose-500' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min(100, facultyLoadPct)}%` }}
                ></div>
              </div>
            </div>
            {currentFac.unavailableSlots && currentFac.unavailableSlots.length > 0 && (
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded">
                Reserved: {currentFac.unavailableSlots.map(s => `${s.day.slice(0,3)} slot ${s.slotIndex}`).join(', ')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Weekly Schedule Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-semibold">
                <th className="py-3 px-4 w-32 border-r border-slate-800">{t.timeSlot}</th>
                {DAYS.map(d => (
                  <th key={d} className="py-3 px-3 text-center border-r border-slate-800 last:border-r-0">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {SLOTS.map((slot) => {
                const isBreakRow = slot.isBreak;

                return (
                  <tr key={slot.index} className={isBreakRow ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}>
                    {/* Time Column */}
                    <td className="py-2.5 px-3 font-semibold text-slate-700 bg-slate-50/50 border-r border-slate-200 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.time}</span>
                      </div>
                      {isBreakRow && (
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">Recess</div>
                      )}
                    </td>

                    {/* Day Columns */}
                    {DAYS.map(day => {
                      if (isBreakRow) {
                        return (
                          <td
                            key={day}
                            className="py-2 px-2 text-center text-slate-400 font-medium italic text-[11px] border-r border-slate-200 last:border-r-0 bg-slate-100/60"
                          >
                            {t.lunchBreak}
                          </td>
                        );
                      }

                      // Find matching scheduled classes in this slot for this day
                      const cellClasses = filteredEntries.filter(
                        e => !e.isBreak && e.day === day && e.slotIndex === slot.index
                      );

                      return (
                        <td
                          key={day}
                          className="p-1.5 border-r border-slate-200 last:border-r-0 align-top h-24"
                        >
                          {cellClasses.length > 0 ? (
                            <div className="space-y-1 h-full">
                              {cellClasses.map(c => (
                                <div
                                  key={c.id}
                                  className="h-full p-2 rounded-lg bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-blue-400 transition-colors"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <span className="font-bold text-slate-900 text-xs tracking-tight">
                                        {c.subjectCode}
                                      </span>
                                      {getSubjectTypeBadge(c.subjectType, c.isLab)}
                                    </div>
                                    <div className="text-[11px] font-semibold text-slate-700 line-clamp-1" title={c.subjectName}>
                                      {c.subjectName}
                                    </div>
                                  </div>

                                  <div className="pt-1.5 mt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                                    <span className="truncate max-w-[85px] font-medium text-slate-800" title={c.facultyName}>
                                      {c.facultyName}
                                    </span>
                                    <span className="bg-slate-100 text-slate-700 font-mono px-1 rounded font-bold">
                                      {c.roomNumber}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-full rounded-md border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-[10px]">
                              {t.freePeriod}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
