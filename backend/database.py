"""
Database connection, session management, and realistic NEP 2020 seed data.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import (
    Base, Department, Course, Faculty, StudentGroup, Student,
    Subject, Classroom, Laboratory, TimeSlot, Constraint,
    AcademicSession, FacultyAvailability, User
)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./timetable.db")

# In production, connect_args is only for SQLite
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes tables and populates realistic demo data if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Department).first() is not None:
            return  # Already seeded

        # 1. Academic Session
        session_obj = AcademicSession(
            name="2026-2027 (Odd Semester)",
            year=2026,
            semester_type="Odd",
            is_active=True
        )
        db.add(session_obj)

        # 2. Departments
        dept_cse = Department(name="Computer Science & Engineering", code="CSE", hod_name="Dr. Arvind Sharma")
        dept_ece = Department(name="Electronics & Communication Engineering", code="ECE", hod_name="Dr. Meera Nambiar")
        dept_mgmt = Department(name="Management & Humanities", code="MGMT", hod_name="Dr. Ananya Iyer")
        db.add_all([dept_cse, dept_ece, dept_mgmt])
        db.commit()

        # 3. Users (Admin, Faculty, Student)
        admin_user = User(name="Dean Academic Affairs", email="admin@planmyclass.edu", hashed_password="admin", role="admin", department_id=dept_cse.id)
        faculty_user = User(name="Dr. Arvind Sharma", email="arvind.sharma@planmyclass.edu", hashed_password="faculty", role="faculty", department_id=dept_cse.id)
        student_user = User(name="Aarav Sharma", email="aarav.cse@planmyclass.edu", hashed_password="student", role="student", department_id=dept_cse.id)
        db.add_all([admin_user, faculty_user, student_user])

        # 4. Courses
        course_cse = Course(name="B.Tech Computer Science & Engineering", code="BTECH-CSE", department_id=dept_cse.id, duration_years=4)
        course_ece = Course(name="B.Tech Electronics & Communication", code="BTECH-ECE", department_id=dept_ece.id, duration_years=4)
        db.add_all([course_cse, course_ece])
        db.commit()

        # 5. Faculty Members
        faculties_data = [
            ("Dr. Arvind Sharma", "arvind.sharma@planmyclass.edu", "FAC-CS-01", "Professor & HoD", dept_cse.id, 14, "09:00", "15:00"),
            ("Dr. Priya Venkatesh", "priya.v@planmyclass.edu", "FAC-CS-02", "Associate Professor", dept_cse.id, 16, "09:00", "16:00"),
            ("Prof. Rajesh Kumar", "rajesh.k@planmyclass.edu", "FAC-CS-03", "Assistant Professor", dept_cse.id, 18, "10:00", "17:00"),
            ("Prof. Sneha Kulkarni", "sneha.k@planmyclass.edu", "FAC-CS-04", "Assistant Professor", dept_cse.id, 18, "09:00", "16:00"),
            ("Dr. Meera Nambiar", "meera.n@planmyclass.edu", "FAC-EC-01", "Professor & HoD", dept_ece.id, 14, "09:00", "15:00"),
            ("Prof. Vikram Seth", "vikram.s@planmyclass.edu", "FAC-EC-02", "Assistant Professor", dept_ece.id, 18, "09:00", "17:00"),
            ("Dr. Sunita Deshmukh", "sunita.d@planmyclass.edu", "FAC-EC-03", "Associate Professor", dept_ece.id, 16, "10:00", "16:00"),
            ("Dr. Manoj Patel", "manoj.p@planmyclass.edu", "FAC-EC-04", "Associate Professor", dept_ece.id, 16, "09:00", "16:00"),
            ("Dr. Ananya Iyer", "ananya.i@planmyclass.edu", "FAC-MG-01", "Professor", dept_mgmt.id, 12, "10:00", "15:00"),
            ("Prof. Rohan Mukherjee", "rohan.m@planmyclass.edu", "FAC-MG-02", "Assistant Professor", dept_mgmt.id, 16, "09:00", "16:00"),
            ("Dr. Kavita Nair", "kavita.n@planmyclass.edu", "FAC-HU-01", "Associate Professor", dept_mgmt.id, 16, "09:00", "15:00"),
            ("Dr. Harish Verma", "harish.v@planmyclass.edu", "FAC-VA-01", "Assistant Professor", dept_mgmt.id, 14, "10:00", "16:00"),
        ]

        faculty_records = []
        for name, email, code, desig, d_id, max_h, p_st, p_end in faculties_data:
            fac = Faculty(
                name=name, email=email, employee_code=code, designation=desig,
                department_id=d_id, max_weekly_hours=max_h,
                preferred_start_time=p_st, preferred_end_time=p_end
            )
            faculty_records.append(fac)
            db.add(fac)
        db.commit()

        # 6. Classrooms & Laboratories
        classrooms_data = [
            ("CR-101", "Academic Block A", 65, True, dept_cse.id),
            ("CR-102", "Academic Block A", 65, True, dept_cse.id),
            ("CR-201", "Academic Block B", 60, True, dept_ece.id),
            ("CR-202", "Academic Block B", 60, True, dept_ece.id),
            ("Seminar Hall-1", "Central Block", 120, True, None),
        ]
        for room_no, bld, cap, proj, d_id in classrooms_data:
            db.add(Classroom(room_number=room_no, building=bld, capacity=cap, has_projector=proj, department_id=d_id))

        labs_data = [
            ("Turing Software Systems Lab", "CL-01", 45, "Computer Lab", dept_cse.id),
            ("Ada Lovelace AI & Web Lab", "CL-02", 45, "Computer Lab", dept_cse.id),
            ("Tesla Embedded & IoT Lab", "EL-01", 40, "Electronics Lab", dept_ece.id),
        ]
        for lab_n, r_no, cap, eq, d_id in labs_data:
            db.add(Laboratory(lab_name=lab_n, room_number=r_no, capacity=cap, equipment_type=eq, department_id=d_id))
        db.commit()

        # 7. Student Groups
        group_cse_a = StudentGroup(name="CSE-3A (Artificial Intelligence Minor)", semester=3, student_count=60, course_id=course_cse.id)
        group_cse_b = StudentGroup(name="CSE-3B (Cyber Security Minor)", semester=3, student_count=55, course_id=course_cse.id)
        group_ece_a = StudentGroup(name="ECE-3A (IoT & Robotics Track)", semester=3, student_count=50, course_id=course_ece.id)
        db.add_all([group_cse_a, group_cse_b, group_ece_a])
        db.commit()

        # 8. NEP 2020 Subjects
        fac_by_name = {f.name: f.id for f in faculty_records}

        subjects_data = [
            # Major / Core
            ("Data Structures & Algorithms", "CS301", dept_cse.id, 4, 3, "Major", False, None, fac_by_name["Dr. Arvind Sharma"]),
            ("Computer Organization & Architecture", "CS302", dept_cse.id, 4, 3, "Major", False, None, fac_by_name["Dr. Priya Venkatesh"]),
            ("Digital System Design", "EC301", dept_ece.id, 4, 3, "Major", False, None, fac_by_name["Dr. Meera Nambiar"]),
            ("Signals and Systems", "EC302", dept_ece.id, 4, 3, "Major", False, None, fac_by_name["Prof. Vikram Seth"]),
            
            # Minor
            ("Database Management Systems", "CS303", dept_cse.id, 3, 3, "Minor", False, None, fac_by_name["Prof. Rajesh Kumar"]),
            ("Electronic Circuits & Devices", "EC303", dept_ece.id, 3, 3, "Minor", False, None, fac_by_name["Dr. Sunita Deshmukh"]),
            
            # Discipline-Specific Elective (DSE)
            ("Artificial Intelligence & ML", "CS304", dept_cse.id, 3, 3, "Elective", False, None, fac_by_name["Dr. Arvind Sharma"]),
            ("Microprocessors & Microcontrollers", "EC304", dept_ece.id, 3, 3, "Elective", False, None, fac_by_name["Dr. Sunita Deshmukh"]),

            # Multidisciplinary Electives (NEP 2020 Open Electives across Depts)
            ("Psychology for Engineers", "MD301", dept_mgmt.id, 2, 2, "Multidisciplinary", False, None, fac_by_name["Dr. Ananya Iyer"]),
            ("Cyber Law & Digital Ethics", "MD302", dept_mgmt.id, 2, 2, "Multidisciplinary", False, None, fac_by_name["Prof. Rohan Mukherjee"]),
            ("FinTech & Personal Finance", "MD303", dept_mgmt.id, 2, 2, "Multidisciplinary", False, None, fac_by_name["Prof. Rohan Mukherjee"]),

            # Ability Enhancement Courses (AEC)
            ("Technical Communication & Soft Skills", "AE301", dept_mgmt.id, 2, 2, "AEC", False, None, fac_by_name["Dr. Kavita Nair"]),

            # Skill Enhancement Courses (SEC)
            ("Full Stack Web Development", "SE301", dept_cse.id, 2, 2, "SEC", False, None, fac_by_name["Prof. Rajesh Kumar"]),
            ("Python for Applied Computing", "SE302", dept_cse.id, 2, 2, "SEC", False, None, fac_by_name["Prof. Sneha Kulkarni"]),

            # Value Added Courses (VAC)
            ("Environmental Science & Sustainable Living", "VA301", dept_mgmt.id, 2, 2, "VAC", False, None, fac_by_name["Dr. Harish Verma"]),
            ("Indian Knowledge Systems & Ethics", "VA302", dept_mgmt.id, 2, 2, "VAC", False, None, fac_by_name["Dr. Harish Verma"]),

            # Laboratories
            ("Data Structures Lab", "CS301L", dept_cse.id, 2, 2, "Lab", True, "Computer Lab", fac_by_name["Prof. Sneha Kulkarni"]),
            ("DBMS Lab", "CS303L", dept_cse.id, 2, 2, "Lab", True, "Computer Lab", fac_by_name["Prof. Rajesh Kumar"]),
            ("Digital Electronics Lab", "EC301L", dept_ece.id, 2, 2, "Lab", True, "Electronics Lab", fac_by_name["Prof. Vikram Seth"]),
        ]

        subject_records = []
        for name, code, d_id, cr, wh, stype, is_l, req_l, f_id in subjects_data:
            sub = Subject(
                name=name, code=code, department_id=d_id, credits=cr, weekly_hours=wh,
                subject_type=stype, is_lab=is_l, required_lab_type=req_l,
                primary_faculty_id=f_id
            )
            subject_records.append(sub)
            db.add(sub)
        db.commit()

        # Link subjects to student groups:
        # Group CSE-3A subjects: CS301, CS302, CS303, CS304 (Elective AI), MD301 (Psychology), AE301, SE301, VA301, CS301L, CS303L
        # Group CSE-3B subjects: CS301, CS302, CS303, MD303 (Fintech), AE301, SE302, VA302, CS301L, CS303L
        # Group ECE-3A subjects: EC301, EC302, EC303, EC304, MD302 (Cyber Law), AE301, VA301, EC301L
        sub_by_code = {s.code: s for s in subject_records}

        group_cse_a.subjects = [
            sub_by_code["CS301"], sub_by_code["CS302"], sub_by_code["CS303"],
            sub_by_code["CS304"], sub_by_code["MD301"], sub_by_code["AE301"],
            sub_by_code["SE301"], sub_by_code["VA301"], sub_by_code["CS301L"], sub_by_code["CS303L"]
        ]

        group_cse_b.subjects = [
            sub_by_code["CS301"], sub_by_code["CS302"], sub_by_code["CS303"],
            sub_by_code["MD303"], sub_by_code["AE301"], sub_by_code["SE302"],
            sub_by_code["VA302"], sub_by_code["CS301L"], sub_by_code["CS303L"]
        ]

        group_ece_a.subjects = [
            sub_by_code["EC301"], sub_by_code["EC302"], sub_by_code["EC303"],
            sub_by_code["EC304"], sub_by_code["MD302"], sub_by_code["AE301"],
            sub_by_code["VA301"], sub_by_code["EC301L"]
        ]
        db.commit()

        # 9. Time Slots (Monday to Friday, 7 slots per day: 09:00 to 17:00, with slot 3 = Lunch Break)
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        slots_def = [
            (0, "09:00", "10:00", False),
            (1, "10:00", "11:00", False),
            (2, "11:00", "12:00", False),
            (3, "12:00", "13:00", True),  # Lunch Break
            (4, "13:00", "14:00", False),
            (5, "14:00", "15:00", False),
            (6, "15:00", "16:00", False),
            (7, "16:00", "17:00", False),
        ]
        for day in days:
            for s_idx, st, et, is_brk in slots_def:
                db.add(TimeSlot(day_of_week=day, slot_index=s_idx, start_time=st, end_time=et, is_break=is_brk))
        db.commit()

        # 10. Constraints
        constraints_list = [
            ("No Faculty Clash", "HARD", 100, True, "A faculty member cannot teach two classes simultaneously."),
            ("No Student Group Clash", "HARD", 100, True, "A student cohort/batch cannot attend two classes at the same time."),
            ("No Classroom Clash", "HARD", 100, True, "A classroom cannot host multiple lectures in the same period."),
            ("No Laboratory Clash", "HARD", 100, True, "A lab facility cannot be double-booked."),
            ("Classroom Capacity Compliance", "HARD", 100, True, "Assigned room capacity must be >= batch strength."),
            ("Laboratory Requirement Compliance", "HARD", 100, True, "Practical/Lab subjects must strictly be scheduled in specialized labs."),
            ("Faculty Availability Compliance", "HARD", 90, True, "Do not schedule faculty in unavailable time windows."),
            ("Balanced Faculty Workload", "SOFT", 20, True, "Distribute lectures evenly across the week for instructors."),
            ("Balanced Student Workload", "SOFT", 20, True, "Distribute lectures evenly across Monday through Friday for students."),
            ("Avoid Excessive Consecutive Classes", "SOFT", 15, True, "Limit maximum consecutive lectures to 3 without a break."),
            ("Avoid Unnecessary Idle Gaps", "SOFT", 15, True, "Minimize fragmented 2+ hour gaps between classes for students."),
            ("Preferred Time Slots", "SOFT", 10, True, "Respect instructor and learner preferred morning/afternoon timings."),
            ("NEP Multidisciplinary Elective Sync", "SOFT", 25, True, "Synchronize common elective slots across departments to prevent conflicts.")
        ]
        for c_name, c_type, c_w, c_act, c_desc in constraints_list:
            db.add(Constraint(name=c_name, constraint_type=c_type, weight=c_w, is_active=c_act, description=c_desc))

        # 11. Faculty Unavailability (Dr. Sharma unavailable Thursday slots 0 & 1 for Research Council)
        db.add(FacultyAvailability(
            faculty_id=fac_by_name["Dr. Arvind Sharma"],
            day_of_week="Thursday",
            slot_index=0,
            is_available=False,
            reason="Research Council Meeting"
        ))
        db.add(FacultyAvailability(
            faculty_id=fac_by_name["Dr. Arvind Sharma"],
            day_of_week="Thursday",
            slot_index=1,
            is_available=False,
            reason="Research Council Meeting"
        ))
        db.commit()

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()
