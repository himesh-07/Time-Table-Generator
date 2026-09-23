"""
SQLAlchemy Data Models for 'Plan My Class' NEP 2020 Timetable System.
Supports Departments, Faculty, Student Groups, Multidisciplinary Subjects,
Classrooms, Laboratories, Availability, Timetables, and Constraints.
"""

from sqlalchemy import (
    Column, Integer, String, Boolean, ForeignKey, Float, Text, JSON, DateTime, Table
)
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

# Association table for Multidisciplinary / Elective Student Groups to Subjects
student_group_subjects = Table(
    "student_group_subjects",
    Base.metadata,
    Column("student_group_id", Integer, ForeignKey("student_groups.id")),
    Column("subject_id", Integer, ForeignKey("subjects.id"))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(20), default="student")  # admin, faculty, student
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    department = relationship("Department", back_populates="users")

class AcademicSession(Base):
    __tablename__ = "academic_sessions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)  # e.g., 2026-2027 (Odd Semester)
    year = Column(Integer, default=2026)
    semester_type = Column(String(10), default="Odd")  # Odd or Even
    is_active = Column(Boolean, default=True)

    timetables = relationship("Timetable", back_populates="academic_session")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(10), unique=True, nullable=False)  # e.g. CSE, ECE, MGMT
    hod_name = Column(String(100), nullable=True)

    users = relationship("User", back_populates="department")
    faculties = relationship("Faculty", back_populates="department")
    courses = relationship("Course", back_populates="department")
    classrooms = relationship("Classroom", back_populates="department")
    laboratories = relationship("Laboratory", back_populates="department")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # B.Tech Computer Science
    code = Column(String(20), nullable=False)  # BTECH-CSE
    department_id = Column(Integer, ForeignKey("departments.id"))
    duration_years = Column(Integer, default=4)

    department = relationship("Department", back_populates="courses")
    student_groups = relationship("StudentGroup", back_populates="course")

class Faculty(Base):
    __tablename__ = "faculties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    employee_code = Column(String(20), unique=True, nullable=False)
    designation = Column(String(50), default="Assistant Professor")
    department_id = Column(Integer, ForeignKey("departments.id"))
    max_weekly_hours = Column(Integer, default=16)
    preferred_start_time = Column(String(10), default="09:00")
    preferred_end_time = Column(String(10), default="16:00")

    department = relationship("Department", back_populates="faculties")
    availabilities = relationship("FacultyAvailability", back_populates="faculty")
    subjects = relationship("Subject", back_populates="primary_faculty")
    timetable_entries = relationship("TimetableEntry", back_populates="faculty")

class FacultyAvailability(Base):
    __tablename__ = "faculty_availabilities"

    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculties.id"), nullable=False)
    day_of_week = Column(String(15), nullable=False)  # Monday to Friday
    slot_index = Column(Integer, nullable=False)  # 0 to 6
    is_available = Column(Boolean, default=True)
    reason = Column(String(200), nullable=True)

    faculty = relationship("Faculty", back_populates="availabilities")

class StudentGroup(Base):
    __tablename__ = "student_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # e.g., CSE-3A, CSE-3B, ECE-5
    semester = Column(Integer, default=3)
    student_count = Column(Integer, default=60)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)

    course = relationship("Course", back_populates="student_groups")
    students = relationship("Student", back_populates="group")
    subjects = relationship("Subject", secondary=student_group_subjects, back_populates="student_groups")
    timetable_entries = relationship("TimetableEntry", back_populates="student_group")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_number = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    group_id = Column(Integer, ForeignKey("student_groups.id"), nullable=False)
    chosen_electives = Column(JSON, nullable=True)  # NEP 2020 Multidisciplinary chosen elective subject codes

    group = relationship("StudentGroup", back_populates="students")

class Subject(Base):
    """
    NEP 2020 Subject Categorization:
    - Major (Core disciplinary)
    - Minor
    - Elective (Discipline Specific Elective - DSE)
    - Multidisciplinary (Open Elective across faculties/departments)
    - AEC (Ability Enhancement Course)
    - SEC (Skill Enhancement Course)
    - VAC (Value Added Course)
    - Laboratory
    """
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    credits = Column(Integer, default=3)
    weekly_hours = Column(Integer, default=3)
    subject_type = Column(String(50), default="Major")  # Major, Minor, Elective, Multidisciplinary, AEC, SEC, VAC, Lab
    is_lab = Column(Boolean, default=False)
    required_lab_type = Column(String(50), nullable=True)  # Computer Lab, Electronics Lab, Physics Lab
    primary_faculty_id = Column(Integer, ForeignKey("faculties.id"), nullable=True)
    preferred_time_slot = Column(String(50), nullable=True)

    primary_faculty = relationship("Faculty", back_populates="subjects")
    student_groups = relationship("SubjectPreference", secondary=None, back_populates=None)
    student_groups = relationship("StudentGroup", secondary=student_group_subjects, back_populates="subjects")
    timetable_entries = relationship("TimetableEntry", back_populates="subject")

class SubjectPreference(Base):
    __tablename__ = "subject_preferences"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    preferred_day = Column(String(15), nullable=True)
    preferred_slot = Column(Integer, nullable=True)
    weight = Column(Integer, default=1)

class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(30), unique=True, nullable=False)
    building = Column(String(50), default="Main Academic Block")
    capacity = Column(Integer, default=60)
    has_projector = Column(Boolean, default=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

    department = relationship("Department", back_populates="classrooms")
    timetable_entries = relationship("TimetableEntry", back_populates="classroom")

class Laboratory(Base):
    __tablename__ = "laboratories"

    id = Column(Integer, primary_key=True, index=True)
    lab_name = Column(String(80), nullable=False)
    room_number = Column(String(30), unique=True, nullable=False)
    capacity = Column(Integer, default=35)
    equipment_type = Column(String(100), default="Computer Lab")
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

    department = relationship("Department", back_populates="laboratories")
    timetable_entries = relationship("TimetableEntry", back_populates="laboratory")

class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String(15), nullable=False)  # Monday, Tuesday, Wednesday, Thursday, Friday
    slot_index = Column(Integer, nullable=False)  # 0, 1, 2, 3, 4, 5, 6
    start_time = Column(String(10), nullable=False)  # e.g., "09:00"
    end_time = Column(String(10), nullable=False)    # e.g., "10:00"
    is_break = Column(Boolean, default=False)        # Lunch or tea break

    timetable_entries = relationship("TimetableEntry", back_populates="time_slot")

class Constraint(Base):
    __tablename__ = "constraints"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    constraint_type = Column(String(20), default="HARD")  # HARD or SOFT
    weight = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)
    description = Column(Text, nullable=True)

class Timetable(Base):
    __tablename__ = "timetables"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    academic_session_id = Column(Integer, ForeignKey("academic_sessions.id"))
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    semester = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(30), default="OPTIMAL")  # OPTIMAL, FEASIBLE, INFEASIBLE
    optimization_score = Column(Float, default=100.0)
    hard_constraints_satisfied = Column(Integer, default=100)
    soft_constraints_satisfied = Column(Float, default=95.0)
    conflicts_count = Column(Integer, default=0)

    academic_session = relationship("AcademicSession", back_populates="timetables")
    entries = relationship("TimetableEntry", back_populates="timetable", cascade="all, delete-orphan")

class TimetableEntry(Base):
    __tablename__ = "timetable_entries"

    id = Column(Integer, primary_key=True, index=True)
    timetable_id = Column(Integer, ForeignKey("timetables.id"))
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    faculty_id = Column(Integer, ForeignKey("faculties.id"))
    student_group_id = Column(Integer, ForeignKey("student_groups.id"))
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=True)
    laboratory_id = Column(Integer, ForeignKey("laboratories.id"), nullable=True)
    is_lab_session = Column(Boolean, default=False)

    timetable = relationship("Timetable", back_populates="entries")
    time_slot = relationship("TimeSlot", back_populates="timetable_entries")
    subject = relationship("Subject", back_populates="timetable_entries")
    faculty = relationship("Faculty", back_populates="timetable_entries")
    student_group = relationship("StudentGroup", back_populates="timetable_entries")
    classroom = relationship("Classroom", back_populates="timetable_entries")
    laboratory = relationship("Laboratory", back_populates="timetable_entries")
