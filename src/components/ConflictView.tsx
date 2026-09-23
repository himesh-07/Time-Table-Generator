import React, { useState } from 'react';
import {
  AlertTriangle, CheckCircle2, ShieldAlert, Wrench, RefreshCw,
  Info, Bug, ArrowRight, Zap
} from 'lucide-react';
import { ConflictItem, Language } from '../types';
import { translations } from '../i18n/translations';

interface ConflictViewProps {
  conflicts: ConflictItem[];
  lang: Language;
  onAutoResolve: () => void;
  onInjectTestConflict: () => void;
  onClearConflicts: () => void;
}

export const ConflictView: React.FC<ConflictViewProps> = ({
  conflicts, lang, onAutoResolve, onInjectTestConflict, onClearConflicts
}) => {
  const t = translations[lang];
  const [resolving, setResolving] = useState(false);

  const handleResolveClick = async () => {
    setResolving(true);
    setTimeout(() => {
      onAutoResolve();
      setResolving(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Deterministic Conflict Detection & Resolution
          </div>
          <h2 className="text-xl font-bold text-slate-900">{t.navConflicts}</h2>
          <p className="text-xs text-slate-500">
            Real-time audit across Faculty, Student Batches, Classrooms, Labs, and Faculty Availability.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onInjectTestConflict}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer"
            title="Inject a test clash (e.g. double-booking Dr. Sharma) to demonstrate conflict detection"
          >
            <Bug className="w-3.5 h-3.5 text-amber-600" />
            Inject Test Conflict
          </button>

          {conflicts.length > 0 && (
            <button
              onClick={handleResolveClick}
              disabled={resolving}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {resolving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Resolving via OR-Tools...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  {t.autoResolve}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Conflict Status Cards */}
      {conflicts.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-emerald-900">
            {t.noConflictsFound}
          </h3>
          <p className="text-xs text-emerald-700 max-w-xl mx-auto leading-relaxed">
            The Google OR-Tools CP-SAT engine has validated all 7 Hard Constraints: zero faculty double-booking, zero student batch overlaps, compliant classroom seating capacities, proper lab facilities, and respected instructor unavailability windows.
          </p>
          <div className="pt-2">
            <button
              onClick={onInjectTestConflict}
              className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-900"
            >
              Want to see conflict detection in action? Click here to simulate an intentional double-booking.
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-900">
                  {conflicts.length} Active Collision{conflicts.length > 1 ? 's' : ''} Detected in Schedule
                </span>
                <p className="text-[11px] text-amber-700">
                  Review the severity and proposed constraint relaxation strategies below.
                </p>
              </div>
            </div>
            <button
              onClick={handleResolveClick}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold"
            >
              Auto-Resolve
            </button>
          </div>

          {/* Table of Conflicts */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">{t.conflictType}</th>
                    <th className="py-3 px-4">{t.affectedEntity}</th>
                    <th className="py-3 px-4">{t.time}</th>
                    <th className="py-3 px-4">{t.description}</th>
                    <th className="py-3 px-4">{t.severity}</th>
                    <th className="py-3 px-4">{t.resolution}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {conflicts.map((conf) => (
                    <tr key={conf.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>{conf.conflictType}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {conf.affectedEntity}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {conf.timeSlot}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">
                        {conf.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          conf.severity === 'HIGH'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : (conf.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800')
                        }`}>
                          {conf.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-emerald-800 font-medium bg-emerald-50/50">
                        {conf.suggestedResolution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Rules Reference */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          Automated Verification Rules in Plan My Class
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900">1. Faculty Collision Check</div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Strictly guarantees &#8721; assignments &le; 1 per instructor at any given slot.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900">2. Student Cohort Check</div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Ensures student groups never have overlapping major, minor, or elective lectures.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900">3. Physical Room & Lab Double-Booking</div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Verifies zero room collision and that lab practicals strictly use approved laboratories.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900">4. Capacity & Seating Check</div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Flags any room allocation where classroom seating &lt; student cohort size.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900">5. Faculty Availability Windows</div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Blocks scheduling during research council meetings, administrative duties, or leave.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="font-semibold text-slate-900">6. Credit & Weekly Hours Parity</div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Validates that scheduled hours match mandated credits under NEP 2020 syllabus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
