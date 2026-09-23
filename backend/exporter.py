"""
Excel and PDF Exporters for 'Plan My Class' NEP 2020 Timetables.
Uses openpyxl for multi-sheet workbooks and reportlab for publication-grade PDFs.
"""

import io
from typing import List, Dict, Any
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
SLOTS = [
    (0, "09:00 - 10:00"),
    (1, "10:00 - 11:00"),
    (2, "11:00 - 12:00"),
    (3, "12:00 - 01:00 (Lunch)"),
    (4, "01:00 - 02:00"),
    (5, "02:00 - 03:00"),
    (6, "03:00 - 04:00"),
    (7, "04:00 - 05:00"),
]

def export_timetable_to_excel(entries: List[Dict[str, Any]], title: str = "Academic Timetable") -> bytes:
    """Generates an Excel workbook with Student, Faculty, and Master Timetables."""
    wb = Workbook()
    
    # Sheet 1: Master Timetable
    ws_master = wb.active
    ws_master.title = "Master Schedule"
    ws_master.views.sheetView[0].showGridLines = True

    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    lunch_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    border_thin = Border(
        left=Side(style='thin', color='D1D5DB'),
        right=Side(style='thin', color='D1D5DB'),
        top=Side(style='thin', color='D1D5DB'),
        bottom=Side(style='thin', color='D1D5DB')
    )

    # Title Banner
    ws_master.merge_cells("A1:I1")
    title_cell = ws_master["A1"]
    title_cell.value = f"PLAN MY CLASS — NEP 2020 MULTIDISCIPLINARY SCHEDULE ({title})"
    title_cell.font = Font(name="Calibri", size=14, bold=True, color="1E3A8A")
    title_cell.alignment = Alignment(horizontal="center", vertical="center")
    ws_master.row_dimensions[1].height = 28

    # Table Header
    headers = ["Time Slot / Day"] + DAYS
    ws_master.append([])
    ws_master.append(headers)
    ws_master.row_dimensions[3].height = 24

    for col_idx in range(1, len(headers) + 1):
        cell = ws_master.cell(row=3, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = border_thin

    # Group entries by (day, slot_index)
    matrix = {(day, s_idx): [] for day in DAYS for s_idx, _ in SLOTS}
    for e in entries:
        day = e.get("day")
        s_idx = e.get("slot_index")
        if (day, s_idx) in matrix:
            matrix[(day, s_idx)].append(e)

    curr_row = 4
    for s_idx, slot_name in SLOTS:
        row_vals = [slot_name]
        ws_master.row_dimensions[curr_row].height = 45 if s_idx != 3 else 22
        
        for day in DAYS:
            if s_idx == 3:
                row_vals.append("LUNCH BREAK")
            else:
                items = matrix.get((day, s_idx), [])
                if items:
                    cell_text = "\n".join([
                        f"{it.get('subject_code', '')} - {it.get('subject_name', '')[:20]}\n{it.get('faculty_name', '')} | {it.get('room_number', '')} [{it.get('student_group_name', '')[:8]}]"
                        for it in items[:2]
                    ])
                    row_vals.append(cell_text)
                else:
                    row_vals.append("—")
        
        ws_master.append(row_vals)
        for c_idx in range(1, len(row_vals) + 1):
            cell = ws_master.cell(row=curr_row, column=c_idx)
            cell.border = border_thin
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            if s_idx == 3:
                cell.fill = lunch_fill
                cell.font = Font(name="Calibri", size=10, italic=True, color="64748B")
            else:
                cell.font = Font(name="Calibri", size=9)
        curr_row += 1

    # Column Widths
    ws_master.column_dimensions["A"].width = 22
    for col_letter in ["B", "C", "D", "E", "F"]:
        ws_master.column_dimensions[col_letter].width = 30

    output = io.BytesIO()
    wb.save(output)
    return output.getvalue()


def export_timetable_to_pdf(entries: List[Dict[str, Any]], title: str = "Academic Timetable") -> bytes:
    """Generates a high-quality landscape PDF document using reportlab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        leftMargin=20,
        rightMargin=20,
        topMargin=20,
        bottomMargin=20
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=1
    )
    sub_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )
    cell_style = ParagraphStyle(
        'GridCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        alignment=1
    )
    lunch_style = ParagraphStyle(
        'LunchCell',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#64748B'),
        alignment=1
    )

    elements = [
        Paragraph("PLAN MY CLASS — NEP 2020 MULTIDISCIPLINARY TIMETABLE", title_style),
        Paragraph(f"Autonomous Academic Schedule | Generated via Google OR-Tools CP-SAT | {title}", sub_style),
        Spacer(1, 10)
    ]

    # Group entries
    matrix = {(day, s_idx): [] for day in DAYS for s_idx, _ in SLOTS}
    for e in entries:
        day = e.get("day")
        s_idx = e.get("slot_index")
        if (day, s_idx) in matrix:
            matrix[(day, s_idx)].append(e)

    table_data = [["Time Slot"] + DAYS]
    for s_idx, slot_name in SLOTS:
        row = [slot_name]
        for day in DAYS:
            if s_idx == 3:
                row.append(Paragraph("<b>LUNCH BREAK</b>", lunch_style))
            else:
                items = matrix.get((day, s_idx), [])
                if items:
                    txt = "<br/>".join([
                        f"<b>{it.get('subject_code', '')}</b>: {it.get('subject_name', '')[:22]}<br/>"
                        f"<font color='#1E40AF'>{it.get('faculty_name', '')}</font> • <b>{it.get('room_number', '')}</b>"
                        for it in items[:2]
                    ])
                    row.append(Paragraph(txt, cell_style))
                else:
                    row.append(Paragraph("<font color='#94A3B8'>— Free —</font>", cell_style))
        table_data.append(row)

    col_widths = [85, 135, 135, 135, 135, 135]
    t = Table(table_data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E3A8A')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F8FAFC')), # Lunch row
    ]))

    elements.append(t)
    doc.build(elements)
    return buffer.getvalue()
