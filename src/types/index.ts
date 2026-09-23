export type Role = 'admin' | 'faculty' | 'student';
export type Language = 'en' | 'hi';

export type SubjectType =
  | 'Major'
  | 'Minor'
  | 'Elective'
  | 'Multidisciplinary'
  | 'AEC'
  | 'SEC'
  | 'VAC'
  | 'Lab';

export interface Department {
  id: number;
  name: string;
  code: string;
  hodName: string;
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  employeeCode: string;
  designation: string;
  departmentId: number;
  departmentName?: string;
  maxWeeklyHours: number;
  preferredStartTime: string;
  preferredEndTime: string;
  unavailableSlots?: Array<{ day: string; slotIndex: number; reason: string }>;
}

export interface StudentGroup {
  id: number;
  name: string;
  semester: number;
  studentCount: number;
  departmentId: number;
  subjectIds: number[];
}

export interface Student {
  id: number;
  name: string;
  enrollmentNumber: string;
  email: string;
  groupId: number;
  groupName?: string;
  chosenElectives: string[];
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  departmentId: number;
  credits: number;
  weeklyHours: number;
  subjectType: SubjectType;
  isLab: boolean;
  requiredLabType?: string;
  primaryFacultyId: number;
  primaryFacultyName?: string;
  preferredTimeSlot?: string;
}

export interface Classroom {
  id: number;
  roomNumber: string;
  building: string;
  capacity: number;
  hasProjector: boolean;
  departmentId?: number;
}

export interface Laboratory {
  id: number;
  labName: string;
  roomNumber: string;
  capacity: number;
  equipmentType: string;
  departmentId?: number;
}

export interface TimeSlot {
  id: number;
  day: string;
  slotIndex: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

export interface TimetableEntry {
  id: string;
  day: string;
  slotIndex: number;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  subjectId?: number;
  subjectName?: string;
  subjectCode?: string;
  subjectType?: SubjectType;
  credits?: number;
  facultyId?: number;
  facultyName?: string;
  studentGroupId?: number;
  studentGroupName?: string;
  roomId?: number;
  roomNumber?: string;
  isLab?: boolean;
}

export interface ConstraintItem {
  id: number;
  name: string;
  type: 'HARD' | 'SOFT';
  weight: number;
  isActive: boolean;
  description: string;
}

export interface ConflictItem {
  id: string;
  conflictType: string;
  affectedEntity: string;
  timeSlot: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedResolution: string;
}

export interface OptimizationMetrics {
  status: 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE';
  score: number;
  hardConstraintsSatisfied: number;
  softConstraintsSatisfied: number;
  totalClassesScheduled: number;
  facultyWorkloadBalance: number;
  classroomUtilization: number;
}
