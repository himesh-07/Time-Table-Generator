# 🗓️ NEP-2020 SmartTimetable AI


**Live Link:** https://timetable-a2006.web.app/
---
**AI-Powered Conflict-Free Timetable Generation for Multidisciplinary Education**

A full-stack, AI/optimization-driven timetable generation system built around **NEP 2020's** multidisciplinary, credit-based, choice-based education structure. The system automatically generates optimized, conflict-free timetables for students, faculty, classrooms, and laboratories — powered by **Google OR-Tools** for constraint optimization and an **AI assistant** for natural-language insights and explanations.

---

## 📌 Problem Statement

> **AI-Based Timetable Generation System aligned with NEP 2020 for Multidisciplinary Education Structure**
> Theme: *Smart Automation*

Traditional timetable creation is manual, error-prone, and cannot easily accommodate NEP 2020's flexible, credit-based, multidisciplinary curriculum where students in the same batch can choose entirely different subject combinations (majors, minors, electives, skill courses, etc.).

This system solves that by using **constraint programming** to generate schedules that are mathematically verified to be conflict-free — not randomly assembled.

---

## ✨ Key Features

- Automatic, conflict-free timetable generation (students, faculty, rooms, labs)
-  Hard constraint enforcement (no double-booking of faculty, batches, rooms, or labs)
-  Soft constraint optimization (workload balance, preferred slots, minimal gaps/clustering)
-  Full NEP 2020 support — Majors, Minors, Electives, Multidisciplinary, Ability Enhancement, Skill-based, Value-added, Lab, and Credit/Choice-based courses
-  Role-based access — **Administrator**, **Faculty**, **Student**
-  Conflict detection engine with severity levels and suggested resolutions
-  AI Assistant for natural-language Q&A about the generated timetable
-  Multilingual UI (English / Hindi, extensible)
-  Excel and PDF export of timetables
-  CSV/Excel bulk data upload with validation
-  Analytics dashboard — workload balance, room/lab utilization, conflict trends
-  Responsive design for desktop, tablet, and mobile

---

## 🏗️ Architecture

```
                    USER
                     |
                     v
          FRONTEND (React + TypeScript)
                     |
                     v
            FASTAPI BACKEND (Python)
                     |
        +------------+------------+
        |                         |
        v                         v
   SQL DATABASE               OR-TOOLS
   (SQLAlchemy ORM)          (CP Optimizer)
        |                         |
        +------------+------------+
                     |
                     v
            GENERATED TIMETABLE
                     |
        +------------+------------+
        |            |            |
        v            v            v
    Student       Faculty        Room
   Timetable     Timetable    Timetable
```

The **AI Assistant** (OpenAI / Gemini) is connected separately through the backend and answers questions using real application data — it does **not** perform the mathematical optimization itself. All scheduling is solved by **Google OR-Tools** using Constraint Satisfaction / Constraint Programming.

---

## 🧠 Optimization Approach

### Hard Constraints (must never be violated)
- Faculty cannot teach two classes at the same time
- A student/batch cannot attend two classes at the same time
- A classroom/lab cannot be double-booked
- Faculty availability must be respected
- Classroom capacity ≥ required student strength
- Lab-required subjects must use an appropriate laboratory
- Required subject credits and weekly lecture/lab hours must be satisfied

### Soft Constraints (weighted, optimized)
- Faculty/student preferred time slots
- Balanced faculty and student workload
- Minimal consecutive classes / unnecessary gaps
- Avoiding early/late classes where possible
- Even spread of subjects across the week
- Minimal lab clustering, maximal classroom utilization

The system reports an **optimization summary**: hard/soft constraints satisfied, number of conflicts, workload balance, room utilization, and an overall optimization score.

---

## 🛠️ Tech Stack

### Frontend
- React + TypeScript (Vite)
- Tailwind CSS
- Firebase (Hosting / Auth / Data)

### Backend
- Python
- FastAPI
- SQLAlchemy (ORM)
- Pydantic / Pydantic Settings

### AI / Optimization
- Google OR-Tools — core scheduling & optimization engine
- OpenAI API / Google Gemini — AI assistant, explanations, insights

### Database
- SQLite (development)
- PostgreSQL-ready for production/cloud deployment

### Data Export & Uploads
- `openpyxl` — Excel export
- `reportlab` — PDF export
- `python-multipart` — file uploads (CSV/Excel)

### Deployment
- Firebase Hosting

---

## 📁 Project Structure

```
TIME_TABLE/
│
├── .firebase/                  # Firebase build/cache
├── backend/                    # Python FastAPI backend
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                 # Pydantic schemas
│   ├── routers/                 # API route handlers
│   ├── services/                 # Business logic
│   ├── optimizer/                # OR-Tools scheduling engine
│   │   ├── scheduler.py
│   │   ├── constraints.py
│   │   └── objective.py
│   ├── ai/                       # AI assistant integration
│   │   └── assistant.py
│   ├── exports/                   # Excel/PDF export logic
│   │   ├── excel_export.py
│   │   └── pdf_export.py
│   ├── uploads/                    # Uploaded CSV/Excel files
│   ├── database.py
│   └── main.py
│
├── dist/                         # Production build output
├── node_modules/                 # Frontend dependencies
│
├── src/                          # React frontend source
│   ├── components/                # UI components
│   ├── data/                      # Static/demo data
│   ├── engine/                    # Client-side scheduling helpers
│   ├── i18n/                      # Multilingual translation files
│   ├── types/                     # TypeScript types
│   ├── utils/                     # Utility functions
│   ├── App.tsx
│   ├── firebase.ts
│   ├── index.css
│   └── main.tsx
│
├── .env.example                  # Environment variable template
├── .firebaserc
├── .gitignore
├── bun.lock
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firebase.json
├── firestore.rules
├── index.html
├── metadata.json
├── package-lock.json
├── package.json
├── README.md
├── requirements.txt
├── tsconfig.json
└── vite.config.ts
```

---

## 👥 User Roles

### 🧑‍💼 Administrator
Manage departments, courses, subjects, faculty, classrooms, labs, and student batches. Define faculty availability, constraints, and subject credits. Generate/regenerate timetables, detect conflicts, view analytics, and export data.

### 👨‍🏫 Faculty
View personal timetable, weekly schedule, assigned subjects, workload, free periods, and room/lab allocations. Submit preferred availability where permitted.

### 🎓 Student
View personal/batch timetable, subjects, classrooms, faculty, free periods, and elective/multidisciplinary classes. Switch UI language.

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
OPENAI_API_KEY=your_key_here
DATABASE_URL=sqlite:///./timetable.db
```

**Never** commit real API keys or secrets. All sensitive values are read from environment variables on the backend only — never exposed in frontend code.

---

## 📦 Backend Requirements (`requirements.txt`)

```txt
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
pydantic==2.10.4
ortools==9.11.4210
google-genai==2.4.0
openai==1.59.5
openpyxl==3.1.5
reportlab==4.2.5
python-multipart==0.0.20
python-dotenv==1.0.1
pydantic-settings==2.7.0
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/nep-smart-timetable-ai.git
cd nep-smart-timetable-ai
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows PowerShell
# source venv/bin/activate     # macOS/Linux

pip install -r ../requirements.txt
cp ../.env.example .env        # then fill in your keys
uvicorn main:app --reload
```

### 3. Frontend setup
```bash
cd ..
bun install                    # or: npm install
bun run dev                    # or: npm run dev
```

### 4. Build & deploy (Firebase Hosting)
```bash
bun run build                  # or: npm run build
firebase deploy
```

---

## 📊 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| GET/POST | `/api/departments` | Manage departments |
| GET/POST/PUT/DELETE | `/api/faculty` | Manage faculty |
| GET/POST | `/api/students` | Manage students |
| GET/POST | `/api/subjects` | Manage subjects |
| GET/POST | `/api/classrooms` | Manage classrooms |
| GET/POST | `/api/labs` | Manage laboratories |
| GET/POST | `/api/constraints` | Manage constraints |
| POST | `/api/timetable/generate` | Run OR-Tools optimization |
| GET | `/api/timetable/student/{id}` | Student timetable |
| GET | `/api/timetable/faculty/{id}` | Faculty timetable |
| GET | `/api/timetable/room/{id}` | Room timetable |
| GET | `/api/timetable/conflicts` | Conflict report |
| GET | `/api/timetable/analytics` | Analytics data |
| GET | `/api/export/excel` | Export as Excel |
| GET | `/api/export/pdf` | Export as PDF |
| POST | `/api/upload` | Bulk CSV/Excel upload |
| POST | `/api/ai/chat` | AI assistant query |

---

## 📈 Analytics

- Faculty & student workload distribution
- Room and lab utilization
- Classes per day / free slot mapping
- Conflict count and trends
- Subject distribution across the week

---

## 🌐 Multilingual Support

The UI currently supports **English** and **Hindi**, with translations managed via an extensible i18n structure so additional languages can be added without touching component logic.

---

## 🔒 Security

- API keys and database credentials are never exposed to the frontend
- All secrets are managed via environment variables
- CORS is configured explicitly for allowed origins
- All API inputs are validated via Pydantic
- Raw stack traces are never shown to end users — only clear, actionable error messages

---

## 🏆 Hackathon Priorities

1. Working timetable generation
2. Conflict-free scheduling
3. OR-Tools optimization
4. NEP 2020 multidisciplinary support
5. Faculty + student timetables
6. Simple, professional UI
7. Multilingual support
8. Excel/PDF export
9. Clean, modular architecture
10. Demo readiness

---

## 📄 License

This project is built for hackathon/educational purposes. Add your preferred license (MIT, Apache 2.0, etc.) here.
