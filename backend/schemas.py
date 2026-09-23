"""
Pydantic Schemas for Plan My Class NEP 2020 Timetable API.
Validates requests, responses, timetable generations, analytics, and AI queries.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Token & Auth
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_name: str
    department_id: Optional[int] = None

class LoginRequest(BaseModel):
    email: str
    password: str

# Department
class DepartmentBase(BaseModel):
    name: str
    code: str
    hod_name: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentOut(DepartmentBase):
    id: int
    class Config:
        from_attributes = True

# Faculty
class FacultyBase(BaseModel):
    name: str
    email: str
    employee_code: str
    designation: str = "Assistant Professor"
    department_id: int
    max_weekly_hours: int = 16
    preferred_start_time: str = "09:00"
    preferred_end_time: str = "16:00"

class FacultyCreate(FacultyBase):
    pass

class FacultyUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    designation: Optional[str] = None
    max_weekly_hours: Optional[int] = None
    preferred_start_time: Optional[str] = None
    preferred_end_time: Optional[str] = None

class FacultyOut(FacultyBase):
    id: int
    department_name: Optional[str] = None
    class Config:
        from_attributes = True

# Student Group
class StudentGroupBase(BaseModel):
    name: str
    semester: int = 3
    student_count: int = 60
    course_id: Optional[int] = None

class StudentGroupCreate(StudentGroupBase):
    subject_ids: Optional[List[int]] = []

class StudentGroupOut(StudentGroupBase):
    id: int
    subject_ids: List[int] = []
    class Config:
        from_attributes = True

# Student
class StudentBase(BaseModel):
    enrollment_number: str
    name: str
    email: str
    group_id: int
    chosen_electives: Optional[List[str]] = []

class StudentCreate(StudentBase):
    pass

class StudentOut(StudentBase):
    id: int
    class Config:
        from_attributes = True

# Subject
class SubjectBase(BaseModel):
    name: str
    code: str
    department_id: Optional[int] = None
    credits: int = 3
    weekly_hours: int = 3
    subject_type: str = "Major"  # Major, Minor, Elective, Multidisciplinary, AEC, SEC, VAC, Lab
    is_lab: bool = False
    required_lab_type: Optional[str] = None
    primary_faculty_id: Optional[int] = None
    preferred_time_slot: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectOut(SubjectBase):
    id: int
    faculty_name: Optional[str] = None
    class Config:
        from_attributes = True

# Room & Lab
class ClassroomBase(BaseModel):
    room_number: str
    building: str = "Main Academic Block"
    capacity: int = 60
    has_projector: bool = True
    department_id: Optional[int] = None

class ClassroomCreate(ClassroomBase):
    pass

class ClassroomOut(ClassroomBase):
    id: int
    class Config:
        from_attributes = True

class LaboratoryBase(BaseModel):
    lab_name: str
    room_number: str
    capacity: int = 35
    equipment_type: str = "Computer Lab"
    department_id: Optional[int] = None

class LaboratoryCreate(LaboratoryBase):
    pass

class LaboratoryOut(LaboratoryBase):
    id: int
    class Config:
        from_attributes = True

# Constraints
class ConstraintBase(BaseModel):
    name: str
    constraint_type: str = "HARD"  # HARD or SOFT
    weight: int = 10
    is_active: bool = True
    description: Optional[str] = None

class ConstraintCreate(ConstraintBase):
    pass

class ConstraintOut(ConstraintBase):
    id: int
    class Config:
        from_attributes = True

# Timetable Generation Request
class GenerateTimetableRequest(BaseModel):
    academic_session: str = "2026-2027 (Odd Semester)"
    department_id: Optional[int] = None
    semester: int = 3
    working_days: List[str] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    start_time: str = "09:00"
    end_time: str = "17:00"
    lunch_slot: int = 3  # Slot index for lunch break (e.g. 12:00-13:00)
    avoid_consecutive_hours: bool = True
    max_consecutive_classes: int = 3
    balance_faculty_load: bool = True
    balance_student_load: bool = True
    prioritize_multidisciplinary_sync: bool = True

# Timetable Entry Output
class TimetableEntryOut(BaseModel):
    id: Optional[int] = None
    day: str
    slot_index: int
    start_time: str
    end_time: str
    is_break: bool = False
    subject_name: Optional[str] = None
    subject_code: Optional[str] = None
    subject_type: Optional[str] = None
    credits: Optional[int] = None
    faculty_name: Optional[str] = None
    student_group_name: Optional[str] = None
    room_number: Optional[str] = None
    is_lab: bool = False

class ConflictItem(BaseModel):
    conflict_type: str
    affected_entity: str
    time_slot: str
    description: str
    severity: str  # HIGH, MEDIUM, LOW
    suggested_resolution: str

class TimetableResultOut(BaseModel):
    timetable_id: int
    title: str
    status: str
    optimization_score: float
    hard_constraints_satisfied: int
    soft_constraints_satisfied: float
    conflicts: List[ConflictItem] = []
    total_classes_scheduled: int
    faculty_workload_balance: float
    classroom_utilization: float
    entries: List[TimetableEntryOut]

class AnalyticsSummary(BaseModel):
    total_faculty: int
    total_students: int
    total_subjects: int
    total_rooms: int
    total_labs: int
    scheduled_classes: int
    conflicts_count: int
    optimization_score: float
    faculty_workload: List[Dict[str, Any]]
    room_utilization: List[Dict[str, Any]]
    subject_distribution: List[Dict[str, Any]]
    daily_class_distribution: List[Dict[str, Any]]

class AIChatRequest(BaseModel):
    prompt: str
    department_id: Optional[int] = None
    context_role: Optional[str] = "admin"

class AIChatResponse(BaseModel):
    reply: str
    suggested_actions: Optional[List[str]] = []
