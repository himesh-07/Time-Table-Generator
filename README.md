# Plan My Class — AI-Powered Conflict-Free Timetable Generation System
> **Aligned with NEP 2020 for Multidisciplinary Education Structure**  
> *Theme: Smart Automation & Academic Optimization*

---

## 📌 1. Project Overview & Problem Statement

Modern higher education under India's **National Education Policy (NEP 2020)** transitions universities from rigid single-department schedules to flexible, **choice-based and multidisciplinary credit systems**. 

Students can now combine:
- **Major disciplinary subjects** (e.g. Computer Science Algorithms)
- **Minor specializations** (e.g. Electronics circuits or AI)
- **Discipline-Specific Electives (DSE)**
- **Multidisciplinary Open Electives** (e.g. CS students taking *Psychology for Engineers* or *Cyber Law & Ethics*)
- **Ability Enhancement Courses (AEC)** (Technical Communication)
- **Skill Enhancement Courses (SEC)** (Full Stack Web, Python Analytics)
- **Value-Added Courses (VAC)** (Environmental Science, Indian Knowledge Systems)
- **Specialized Practical Laboratories** (Computer Labs, VLSI / IoT Labs)

This combinatorial explosion creates massive scheduling bottlenecks:
1. Faculty overlap and double-booking.
2. Multidisciplinary elective clashes across student cohorts.
3. Classroom and laboratory capacity mismatches.
4. Unbalanced faculty workloads and disjointed student schedules with random 3-hour gaps.

**Plan My Class** solves this through **Google OR-Tools Constraint Programming (CP-SAT)** combined with an intuitive multi-role university management portal and an integrated AI assistant.

---

## 🛠️ 2. Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons |
| **Backend** | Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy ORM |
| **Optimization** | **Google OR-Tools (CP-SAT Solver)** for Constraint Satisfaction |
| **AI Insights** | Google Gemini API (`@google/genai`) & OpenAI API |
| **Exports** | `openpyxl` (Multi-sheet Excel), `reportlab` & `jspdf` (Publication PDFs) |
| **Data Ingestion**| `python-multipart`, CSV/Excel file validation |
| **Database** | SQLite for instant development; direct drop-in for PostgreSQL |

---

## 🧠 3. Optimization Architecture (Google OR-Tools CP-SAT)

The core optimization engine uses **Constraint Programming over Satisfiability (CP-SAT)**. Mathematical optimization is handled deterministically by Google OR-Tools (not hallucinated by LLMs).

### Hard Constraints (Zero Violation Tolerance):
$$\sum_{r} X_{s, d, t, r} = 1 \quad \forall s \in \text{Sessions}$$
1. **No Faculty Clash**: A faculty member can teach at most 1 class during slot $(d, t)$.
2. **No Student Group Clash**: A student cohort can attend at most 1 lecture during slot $(d, t)$.
3. **No Room/Lab Clash**: A physical room or lab can host at most 1 class at time $(d, t)$.
4. **Room Capacity**: $\text{Room Capacity} \ge \text{Cohort Strength}$.
5. **Lab Requirement**: Lab subjects must be assigned to matching laboratory facilities (Computer Lab, Electronics Lab).
6. **Faculty Availability**: $X_{s, d, t, r} = 0$ if faculty is unavailable during $(d, t)$.
7. **Credit & Hour Satisfaction**: Total assigned slots equal the mandated credit hours.

### Soft Constraints (Weighted Penalty Minimization):
$$\min Z = w_1 \cdot \text{FacultyVariance} + w_2 \cdot \text{StudentVariance} + w_3 \cdot \text{Gaps} + w_4 \cdot \text{ConsecutiveOverload} - w_5 \cdot \text{PreferredTimes}$$
- **Faculty Workload Balance**: Penalizes days with $>4$ classes or erratic spikes.
- **Student Workload Balance**: Spreads subjects evenly across Monday through Friday.
- **Avoid Consecutive Fatigue**: Discourages more than 3 consecutive theory classes without a break.
- **Avoid Fragmented Gaps**: Prevents awkward isolated free periods between lectures.
- **Synchronized NEP Electives**: Aligns open multidisciplinary slots across departments.

---

## 🚀 4. How to Run the Application

### Option A: Running the Frontend & Integrated Engine (Vite Dev Server)
```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev
# App will run at http://localhost:3000
```

### Option B: Running the Python FastAPI Backend (Windows PowerShell)
```powershell
# 1. Create and activate a Python virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install requirements
pip install -r requirements.txt

# 3. Start the FastAPI server
uvicorn backend.main:app --reload --port 8000
# API docs available at http://localhost:8000/docs
```

### Option C: Running the Python FastAPI Backend (Linux / macOS)
```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install requirements
pip install -r requirements.txt

# 3. Run FastAPI server
uvicorn backend.main:app --reload --port 8000
```

---

## 🌐 5. Multilingual Support

The application provides instantaneous real-time localization between:
- **English (EN)**
- **हिन्दी (Hindi - HI)**

All labels, statuses, card metrics, days, subject categories, and conflict descriptions are dynamically rendered without page reload. To add a new language (e.g., Tamil, Telugu, Marathi), simply add a translation key to `src/i18n/translations.ts`.

---

## 📄 6. Exports & Demonstrations

1. **Excel Export (`openpyxl` / SheetJS)**: Generates a multi-column master schedule with clean row heights, color-coded headers, and lunch intervals.
2. **PDF Export (`reportlab` / jsPDF-AutoTable)**: Produces an official university timetable in landscape orientation suitable for printing and notice-board posting.
3. **AI Assistant**: Accessible via the sidebar or top bar to ask questions like *"Why is Dr. Sharma scheduled on Monday?"*, *"Show free rooms on Tuesday"*, or *"Audit faculty teaching hours"*.
