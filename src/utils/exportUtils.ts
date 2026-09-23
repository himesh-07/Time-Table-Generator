import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TimetableEntry } from '../types';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SLOTS = [
  { index: 0, label: "09:00 - 10:00" },
  { index: 1, label: "10:00 - 11:00" },
  { index: 2, label: "11:00 - 12:00" },
  { index: 3, label: "12:00 - 01:00 (Lunch)" },
  { index: 4, label: "01:00 - 02:00" },
  { index: 5, label: "02:00 - 03:00" },
  { index: 6, label: "03:00 - 04:00" },
  { index: 7, label: "04:00 - 05:00" },
];

export function exportTimetableToExcel(entries: TimetableEntry[], filename: string = "PlanMyClass_Timetable.xlsx") {
  const wb = XLSX.utils.book_new();

  // 1. Build Grid Matrix for Master Schedule
  const gridRows: any[] = [];
  gridRows.push(["PLAN MY CLASS — NEP 2020 MULTIDISCIPLINARY ACADEMIC TIMETABLE"]);
  gridRows.push(["Generated via Google OR-Tools Constraint Programming Engine"]);
  gridRows.push([]);
  gridRows.push(["Time Slot", ...DAYS]);

  for (const slot of SLOTS) {
    const row = [slot.label];
    for (const day of DAYS) {
      if (slot.index === 3) {
        row.push("LUNCH INTERVAL");
      } else {
        const matches = entries.filter(e => e.day === day && e.slotIndex === slot.index && !e.isBreak);
        if (matches.length > 0) {
          const text = matches.map(m => `${m.subjectCode || ''} (${m.roomNumber || ''}) - ${m.facultyName || ''} [${m.studentGroupName?.slice(0, 8) || ''}]`).join("\n");
          row.push(text);
        } else {
          row.push("— Free —");
        }
      }
    }
    gridRows.push(row);
  }

  const wsMaster = XLSX.utils.aoa_to_sheet(gridRows);
  // Set column widths
  wsMaster['!cols'] = [
    { wch: 22 },
    { wch: 32 },
    { wch: 32 },
    { wch: 32 },
    { wch: 32 },
    { wch: 32 }
  ];

  XLSX.utils.book_append_sheet(wb, wsMaster, "Master Schedule");

  // 2. Build Detailed List Sheet
  const listData = entries.filter(e => !e.isBreak).map(e => ({
    "Day": e.day,
    "Time": `${e.startTime} - ${e.endTime}`,
    "Subject Code": e.subjectCode || "",
    "Subject Name": e.subjectName || "",
    "Category": e.subjectType || "",
    "Credits": e.credits || 3,
    "Faculty": e.facultyName || "TBA",
    "Student Group": e.studentGroupName || "",
    "Room / Lab": e.roomNumber || "",
    "Is Lab": e.isLab ? "Yes" : "No"
  }));

  const wsList = XLSX.utils.json_to_sheet(listData);
  XLSX.utils.book_append_sheet(wb, wsList, "Class Allocations");

  XLSX.writeFile(wb, filename);
}

export function exportTimetableToPDF(
  entries: TimetableEntry[],
  title: string = "Autonomous Timetable",
  subtitle: string = "Computer Science & Engineering — Semester 3"
) {
  const doc = new jsPDF('landscape', 'pt', 'a4');

  // Title Banner
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138); // Blue 900
  doc.text("PLAN MY CLASS — NEP 2020 ACADEMIC SCHEDULE", 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`${title} | ${subtitle} | Google OR-Tools CP-SAT Conflict-Free Solver`, 40, 56);

  // Table Data
  const head = [["Time Slot", ...DAYS]];
  const body: any[] = [];

  for (const slot of SLOTS) {
    const row = [slot.label];
    for (const day of DAYS) {
      if (slot.index === 3) {
        row.push("LUNCH BREAK");
      } else {
        const matches = entries.filter(e => e.day === day && e.slotIndex === slot.index && !e.isBreak);
        if (matches.length > 0) {
          const lines = matches.map(m => `${m.subjectCode}: ${m.subjectName?.slice(0, 18)}\n${m.facultyName} | ${m.roomNumber}`).join("\n---\n");
          row.push(lines);
        } else {
          row.push("—");
        }
      }
    }
    body.push(row);
  }

  autoTable(doc, {
    head,
    body,
    startY: 75,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7.5,
      halign: 'center',
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 90, fontStyle: 'bold', fillColor: [248, 250, 252] },
      1: { cellWidth: 130 },
      2: { cellWidth: 130 },
      3: { cellWidth: 130 },
      4: { cellWidth: 130 },
      5: { cellWidth: 130 },
    },
    didParseCell: (data) => {
      if (data.row.index === 3) { // Lunch row
        data.cell.styles.fillColor = [241, 245, 249];
        data.cell.styles.fontStyle = 'italic';
        data.cell.styles.textColor = [100, 116, 139];
      }
    }
  });

  doc.save(`${title.replace(/\s+/g, '_')}_Schedule.pdf`);
}
