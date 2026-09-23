import React, { useState } from 'react';
import {
  Upload, FileSpreadsheet, CheckCircle2, AlertCircle,
  Download, ArrowRight, Layers, FileCheck
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FileUploadViewProps {
  lang: Language;
  onDataImported?: (type: string, data: any[]) => void;
}

export const FileUploadView: React.FC<FileUploadViewProps> = ({ lang, onDataImported }) => {
  const t = translations[lang];

  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});

  const handleSimulatedUpload = (category: string) => {
    setUploadStatus(prev => ({ ...prev, [category]: 'uploading' }));
    setTimeout(() => {
      setUploadStatus(prev => ({ ...prev, [category]: 'success' }));
    }, 800);
  };

  const downloadSampleCSV = (type: string) => {
    let content = "";
    let filename = "";

    if (type === 'faculty') {
      filename = "faculty_template.csv";
      content = "Name,Email,EmployeeCode,Designation,Department,MaxWeeklyHours,PreferredStart,PreferredEnd\nDr. Arvind Sharma,arvind@univ.edu,FAC01,Professor,CSE,14,09:00,15:00\nDr. Priya V,priya@univ.edu,FAC02,Associate Professor,CSE,16,09:00,16:00";
    } else if (type === 'subjects') {
      filename = "subjects_template.csv";
      content = "Name,Code,Category,Credits,WeeklyHours,Department,IsLab,RequiredLabType,PrimaryFaculty\nData Structures,CS301,Major,4,3,CSE,false,,Dr. Arvind Sharma\nPsychology for Engineers,MD301,Multidisciplinary,2,2,MGMT,false,,Dr. Ananya Iyer\nDS Laboratory,CS301L,Lab,2,2,CSE,true,Computer Lab,Prof. Sneha Kulkarni";
    } else {
      filename = "rooms_template.csv";
      content = "RoomNumber,Building,Capacity,Type,EquipmentType\nCR-101,Block A,70,Classroom,Projector\nCL-01,Block A,45,Laboratory,Computer Lab";
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-1">
          <Upload className="w-3.5 h-3.5 text-blue-600" />
          Batch Ingestion & Integration
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t.navSettings}</h2>
        <p className="text-xs text-slate-500">
          Upload bulk institution data via standardized CSV or Microsoft Excel spreadsheets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Faculty CSV */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Faculty Master List</h3>
            <p className="text-xs text-slate-500">
              Bulk import faculty profiles, department affiliations, teaching ceilings, and unavailable slots.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => downloadSampleCSV('faculty')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Template CSV
            </button>

            <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center">
              {uploadStatus['faculty'] === 'success' ? (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> 12 Faculty records verified!
                </div>
              ) : (
                <button
                  onClick={() => handleSimulatedUpload('faculty')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 w-full"
                >
                  {uploadStatus['faculty'] === 'uploading' ? 'Parsing CSV...' : 'Select or Drop Faculty CSV'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Subjects CSV */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">NEP 2020 Subjects Catalog</h3>
            <p className="text-xs text-slate-500">
              Import course codes, categories (Major/Minor/Elective/Multidisciplinary), credits, and lab requirements.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => downloadSampleCSV('subjects')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Template CSV
            </button>

            <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center">
              {uploadStatus['subjects'] === 'success' ? (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> 19 Courses validated!
                </div>
              ) : (
                <button
                  onClick={() => handleSimulatedUpload('subjects')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 w-full"
                >
                  {uploadStatus['subjects'] === 'uploading' ? 'Parsing CSV...' : 'Select or Drop Subjects CSV'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Rooms CSV */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Classrooms & Laboratories</h3>
            <p className="text-xs text-slate-500">
              Import room numbers, seating capacities, projector status, and specialized laboratory equipment.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => downloadSampleCSV('rooms')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download Template CSV
            </button>

            <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center">
              {uploadStatus['rooms'] === 'success' ? (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> 8 Facilities verified!
                </div>
              ) : (
                <button
                  onClick={() => handleSimulatedUpload('rooms')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 w-full"
                >
                  {uploadStatus['rooms'] === 'uploading' ? 'Parsing CSV...' : 'Select or Drop Rooms CSV'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
