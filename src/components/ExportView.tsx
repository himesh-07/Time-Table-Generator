import React, { useState } from 'react';
import {
  Download, Printer, FileSpreadsheet, FileText, CheckCircle2,
  Layers, School, ShieldCheck, Sparkles
} from 'lucide-react';
import { TimetableEntry, StudentGroup, Faculty, Language } from '../types';
import { translations } from '../i18n/translations';
import { exportTimetableToExcel, exportTimetableToPDF } from '../utils/exportUtils';

interface ExportViewProps {
  entries: TimetableEntry[];
  studentGroups: StudentGroup[];
  facultyList: Faculty[];
  lang: Language;
}

export const ExportView: React.FC<ExportViewProps> = ({
  entries, studentGroups, facultyList, lang
}) => {
  const t = translations[lang];
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const handleExcelExport = () => {
    exportTimetableToExcel(entries, "PlanMyClass_Full_Schedule.xlsx");
    setDownloadedFormat("Excel Workbook (.xlsx)");
  };

  const handlePDFExport = () => {
    exportTimetableToPDF(entries, "Autonomous Academic Schedule", "Consolidated Multidisciplinary Timetable");
    setDownloadedFormat("Printable PDF Document (.pdf)");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-1">
          <Download className="w-3.5 h-3.5 text-blue-600" />
          Multi-Format Institutional Publishing
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t.navExports}</h2>
        <p className="text-xs text-slate-500">
          Generate publication-ready schedules for students, instructors, and departmental notice boards.
        </p>
      </div>

      {downloadedFormat && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-emerald-900">Download Initiated Successfully</div>
            <div className="text-[11px] text-emerald-700">Generated {downloadedFormat} ready for distribution.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Excel Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Microsoft Excel Export (.xlsx)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates an Excel workbook containing:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Sheet 1: Formatted Master Schedule Matrix with Days & Time Slots</li>
              <li>Sheet 2: Granular Class Allocations with Faculty & Room Assignments</li>
              <li>Calculated cell formatting for lunch intervals and lab courses</li>
              <li>Native compatibility with openpyxl and Excel 2016+</li>
            </ul>
          </div>

          <button
            onClick={handleExcelExport}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Excel Spreadsheet (.xlsx)
          </button>
        </div>

        {/* PDF Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Printable PDF Timetable (.pdf)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates a landscape publication document formatted for:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Landscape A4 notice-board printouts and administrative archival</li>
              <li>Official institution branding, academic session, and department header</li>
              <li>Distinctive subject code, instructor, and room tags per cell</li>
              <li>Formatted via jsPDF-AutoTable / ReportLab standard</li>
            </ul>
          </div>

          <button
            onClick={handlePDFExport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            Download Landscape PDF (.pdf)
          </button>
        </div>
      </div>
    </div>
  );
};
