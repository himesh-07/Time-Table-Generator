import {
  Department, Faculty, StudentGroup, Student, Subject,
  Classroom, Laboratory, TimeSlot, ConstraintItem
} from '../types';

export const initialDepartments: Department[] = [
  { id: 1, name: "Computer Science & Engineering", code: "CSE", hodName: "Dr. Arvind Sharma" },
  { id: 2, name: "Electronics & Communication Engineering", code: "ECE", hodName: "Dr. Meera Nambiar" },
  { id: 3, name: "Management Studies & Humanities", code: "MGMT", hodName: "Dr. Ananya Iyer" }
];

export const initialFaculty: Faculty[] = [
  {
    id: 1,
    name: "Dr. Arvind Sharma",
    email: "arvind.sharma@planmyclass.edu",
    employeeCode: "FAC-CS-01",
    designation: "Professor & HoD",
    departmentId: 1,
    departmentName: "Computer Science & Engineering",
    maxWeeklyHours: 14,
    preferredStartTime: "09:00",
    preferredEndTime: "15:00",
    unavailableSlots: [
      { day: "Thursday", slotIndex: 0, reason: "Research Advisory Council" },
      { day: "Thursday", slotIndex: 1, reason: "Research Advisory Council" }
    ]
  },
  {
    id: 2,
    name: "Dr. Priya Venkatesh",
    email: "priya.v@planmyclass.edu",
    employeeCode: "FAC-CS-02",
    designation: "Associate Professor",
    departmentId: 1,
    departmentName: "Computer Science & Engineering",
    maxWeeklyHours: 16,
    preferredStartTime: "09:00",
    preferredEndTime: "16:00"
  },
  {
    id: 3,
    name: "Prof. Rajesh Kumar",
    email: "rajesh.k@planmyclass.edu",
    employeeCode: "FAC-CS-03",
    designation: "Assistant Professor",
    departmentId: 1,
    departmentName: "Computer Science & Engineering",
    maxWeeklyHours: 18,
    preferredStartTime: "10:00",
    preferredEndTime: "17:00"
  },
  {
    id: 4,
    name: "Prof. Sneha Kulkarni",
    email: "sneha.k@planmyclass.edu",
    employeeCode: "FAC-CS-04",
    designation: "Assistant Professor",
    departmentId: 1,
    departmentName: "Computer Science & Engineering",
    maxWeeklyHours: 18,
    preferredStartTime: "09:00",
    preferredEndTime: "16:00"
  },
  {
    id: 5,
    name: "Dr. Meera Nambiar",
    email: "meera.n@planmyclass.edu",
    employeeCode: "FAC-EC-01",
    designation: "Professor & HoD",
    departmentId: 2,
    departmentName: "Electronics & Communication Engineering",
    maxWeeklyHours: 14,
    preferredStartTime: "09:00",
    preferredEndTime: "15:00"
  },
  {
    id: 6,
    name: "Prof. Vikram Seth",
    email: "vikram.s@planmyclass.edu",
    employeeCode: "FAC-EC-02",
    designation: "Assistant Professor",
    departmentId: 2,
    departmentName: "Electronics & Communication Engineering",
    maxWeeklyHours: 18,
    preferredStartTime: "09:00",
    preferredEndTime: "17:00"
  },
  {
    id: 7,
    name: "Dr. Sunita Deshmukh",
    email: "sunita.d@planmyclass.edu",
    employeeCode: "FAC-EC-03",
    designation: "Associate Professor",
    departmentId: 2,
    departmentName: "Electronics & Communication Engineering",
    maxWeeklyHours: 16,
    preferredStartTime: "10:00",
    preferredEndTime: "16:00"
  },
  {
    id: 8,
    name: "Dr. Manoj Patel",
    email: "manoj.p@planmyclass.edu",
    employeeCode: "FAC-EC-04",
    designation: "Associate Professor",
    departmentId: 2,
    departmentName: "Electronics & Communication Engineering",
    maxWeeklyHours: 16,
    preferredStartTime: "09:00",
    preferredEndTime: "16:00"
  },
  {
    id: 9,
    name: "Dr. Ananya Iyer",
    email: "ananya.i@planmyclass.edu",
    employeeCode: "FAC-MG-01",
    designation: "Professor",
    departmentId: 3,
    departmentName: "Management Studies & Humanities",
    maxWeeklyHours: 14,
    preferredStartTime: "10:00",
    preferredEndTime: "15:00"
  },
  {
    id: 10,
    name: "Prof. Rohan Mukherjee",
    email: "rohan.m@planmyclass.edu",
    employeeCode: "FAC-MG-02",
    designation: "Assistant Professor",
    departmentId: 3,
    departmentName: "Management Studies & Humanities",
    maxWeeklyHours: 16,
    preferredStartTime: "09:00",
    preferredEndTime: "16:00"
  },
  {
    id: 11,
    name: "Dr. Kavita Nair",
    email: "kavita.n@planmyclass.edu",
    employeeCode: "FAC-HU-01",
    designation: "Associate Professor",
    departmentId: 3,
    departmentName: "Management Studies & Humanities",
    maxWeeklyHours: 16,
    preferredStartTime: "09:00",
    preferredEndTime: "15:00"
  },
  {
    id: 12,
    name: "Dr. Harish Verma",
    email: "harish.v@planmyclass.edu",
    employeeCode: "FAC-VA-01",
    designation: "Assistant Professor",
    departmentId: 3,
    departmentName: "Management Studies & Humanities",
    maxWeeklyHours: 14,
    preferredStartTime: "10:00",
    preferredEndTime: "16:00"
  }
];

export const initialClassrooms: Classroom[] = [
  { id: 1, roomNumber: "CR-101", building: "Academic Block A", capacity: 70, hasProjector: true, departmentId: 1 },
  { id: 2, roomNumber: "CR-102", building: "Academic Block A", capacity: 70, hasProjector: true, departmentId: 1 },
  { id: 3, roomNumber: "CR-201", building: "Academic Block B", capacity: 65, hasProjector: true, departmentId: 2 },
  { id: 4, roomNumber: "CR-202", building: "Academic Block B", capacity: 65, hasProjector: true, departmentId: 2 },
  { id: 5, roomNumber: "Seminar Hall-1", building: "Central Block", capacity: 120, hasProjector: true }
];

export const initialLaboratories: Laboratory[] = [
  { id: 1, labName: "Turing Computing Lab", roomNumber: "CL-01", capacity: 45, equipmentType: "Computer Lab", departmentId: 1 },
  { id: 2, labName: "Ada Lovelace AI & Web Lab", roomNumber: "CL-02", capacity: 45, equipmentType: "Computer Lab", departmentId: 1 },
  { id: 3, labName: "Tesla IoT & Embedded Lab", roomNumber: "EL-01", capacity: 40, equipmentType: "Electronics Lab", departmentId: 2 }
];

export const initialSubjects: Subject[] = [
  // Major Core
  { id: 1, name: "Data Structures & Algorithms", code: "CS301", departmentId: 1, credits: 4, weeklyHours: 3, subjectType: "Major", isLab: false, primaryFacultyId: 1, primaryFacultyName: "Dr. Arvind Sharma" },
  { id: 2, name: "Computer Architecture", code: "CS302", departmentId: 1, credits: 4, weeklyHours: 3, subjectType: "Major", isLab: false, primaryFacultyId: 2, primaryFacultyName: "Dr. Priya Venkatesh" },
  { id: 3, name: "Digital System Design", code: "EC301", departmentId: 2, credits: 4, weeklyHours: 3, subjectType: "Major", isLab: false, primaryFacultyId: 5, primaryFacultyName: "Dr. Meera Nambiar" },
  { id: 4, name: "Signals and Systems", code: "EC302", departmentId: 2, credits: 4, weeklyHours: 3, subjectType: "Major", isLab: false, primaryFacultyId: 6, primaryFacultyName: "Prof. Vikram Seth" },

  // Minor
  { id: 5, name: "Database Management Systems", code: "CS303", departmentId: 1, credits: 3, weeklyHours: 3, subjectType: "Minor", isLab: false, primaryFacultyId: 3, primaryFacultyName: "Prof. Rajesh Kumar" },
  { id: 6, name: "Electronic Circuits & Devices", code: "EC303", departmentId: 2, credits: 3, weeklyHours: 3, subjectType: "Minor", isLab: false, primaryFacultyId: 7, primaryFacultyName: "Dr. Sunita Deshmukh" },

  // Discipline Elective (DSE)
  { id: 7, name: "Artificial Intelligence & ML", code: "CS304", departmentId: 1, credits: 3, weeklyHours: 3, subjectType: "Elective", isLab: false, primaryFacultyId: 1, primaryFacultyName: "Dr. Arvind Sharma" },
  { id: 8, name: "Microprocessors & Robotics", code: "EC304", departmentId: 2, credits: 3, weeklyHours: 3, subjectType: "Elective", isLab: false, primaryFacultyId: 7, primaryFacultyName: "Dr. Sunita Deshmukh" },

  // NEP 2020 Multidisciplinary Open Electives
  { id: 9, name: "Psychology for Engineers", code: "MD301", departmentId: 3, credits: 2, weeklyHours: 2, subjectType: "Multidisciplinary", isLab: false, primaryFacultyId: 9, primaryFacultyName: "Dr. Ananya Iyer" },
  { id: 10, name: "Cyber Law & Digital Ethics", code: "MD302", departmentId: 3, credits: 2, weeklyHours: 2, subjectType: "Multidisciplinary", isLab: false, primaryFacultyId: 10, primaryFacultyName: "Prof. Rohan Mukherjee" },
  { id: 11, name: "FinTech & Personal Finance", code: "MD303", departmentId: 3, credits: 2, weeklyHours: 2, subjectType: "Multidisciplinary", isLab: false, primaryFacultyId: 10, primaryFacultyName: "Prof. Rohan Mukherjee" },

  // Ability Enhancement (AEC)
  { id: 12, name: "Technical Communication", code: "AE301", departmentId: 3, credits: 2, weeklyHours: 2, subjectType: "AEC", isLab: false, primaryFacultyId: 11, primaryFacultyName: "Dr. Kavita Nair" },

  // Skill Enhancement (SEC)
  { id: 13, name: "Full Stack Web Development", code: "SE301", departmentId: 1, credits: 2, weeklyHours: 2, subjectType: "SEC", isLab: false, primaryFacultyId: 3, primaryFacultyName: "Prof. Rajesh Kumar" },
  { id: 14, name: "Python for Data Analytics", code: "SE302", departmentId: 1, credits: 2, weeklyHours: 2, subjectType: "SEC", isLab: false, primaryFacultyId: 4, primaryFacultyName: "Prof. Sneha Kulkarni" },

  // Value Added (VAC)
  { id: 15, name: "Environmental Science", code: "VA301", departmentId: 3, credits: 2, weeklyHours: 2, subjectType: "VAC", isLab: false, primaryFacultyId: 12, primaryFacultyName: "Dr. Harish Verma" },
  { id: 16, name: "Indian Knowledge Systems", code: "VA302", departmentId: 3, credits: 2, weeklyHours: 2, subjectType: "VAC", isLab: false, primaryFacultyId: 12, primaryFacultyName: "Dr. Harish Verma" },

  // Laboratories (Practical)
  { id: 17, name: "Data Structures Lab", code: "CS301L", departmentId: 1, credits: 2, weeklyHours: 2, subjectType: "Lab", isLab: true, requiredLabType: "Computer Lab", primaryFacultyId: 4, primaryFacultyName: "Prof. Sneha Kulkarni" },
  { id: 18, name: "DBMS Laboratory", code: "CS303L", departmentId: 1, credits: 2, weeklyHours: 2, subjectType: "Lab", isLab: true, requiredLabType: "Computer Lab", primaryFacultyId: 3, primaryFacultyName: "Prof. Rajesh Kumar" },
  { id: 19, name: "Digital Electronics Lab", code: "EC301L", departmentId: 2, credits: 2, weeklyHours: 2, subjectType: "Lab", isLab: true, requiredLabType: "Electronics Lab", primaryFacultyId: 6, primaryFacultyName: "Prof. Vikram Seth" },
];

export const initialStudentGroups: StudentGroup[] = [
  {
    id: 1,
    name: "CSE-3A (AI Elective + Psychology)",
    semester: 3,
    studentCount: 60,
    departmentId: 1,
    // Major (CS301, CS302), Minor (CS303), Elective (CS304), Multidisciplinary (MD301), AEC (AE301), SEC (SE301), VAC (VA301), Labs (CS301L, CS303L)
    subjectIds: [1, 2, 5, 7, 9, 12, 13, 15, 17, 18]
  },
  {
    id: 2,
    name: "CSE-3B (Web Elective + FinTech)",
    semester: 3,
    studentCount: 55,
    departmentId: 1,
    // Major (CS301, CS302), Minor (CS303), Multidisciplinary (MD303), AEC (AE301), SEC (SE302), VAC (VA302), Labs (CS301L, CS303L)
    subjectIds: [1, 2, 5, 11, 12, 14, 16, 17, 18]
  },
  {
    id: 3,
    name: "ECE-3A (IoT Elective + Cyber Law)",
    semester: 3,
    studentCount: 50,
    departmentId: 2,
    // Major (EC301, EC302), Minor (EC303), Elective (EC304), Multidisciplinary (MD302), AEC (AE301), VAC (VA301), Lab (EC301L)
    subjectIds: [3, 4, 6, 8, 10, 12, 15, 19]
  }
];

export const initialStudents: Student[] = [
  { id: 1, name: "Aarav Sharma", enrollmentNumber: "2024CS01", email: "aarav.s@planmyclass.edu", groupId: 1, chosenElectives: ["AI & ML", "Psychology for Engineers"] },
  { id: 2, name: "Diya Patel", enrollmentNumber: "2024CS02", email: "diya.p@planmyclass.edu", groupId: 1, chosenElectives: ["AI & ML", "Psychology for Engineers"] },
  { id: 3, name: "Rohan Gupta", enrollmentNumber: "2024CS03", email: "rohan.g@planmyclass.edu", groupId: 2, chosenElectives: ["Full Stack", "FinTech"] },
  { id: 4, name: "Ananya Deshmukh", enrollmentNumber: "2024CS04", email: "ananya.d@planmyclass.edu", groupId: 2, chosenElectives: ["Python Analytics", "FinTech"] },
  { id: 5, name: "Kabir Mehta", enrollmentNumber: "2024EC01", email: "kabir.m@planmyclass.edu", groupId: 3, chosenElectives: ["Robotics & IoT", "Cyber Law"] },
  { id: 6, name: "Ishaan Reddy", enrollmentNumber: "2024EC02", email: "ishaan.r@planmyclass.edu", groupId: 3, chosenElectives: ["Robotics & IoT", "Cyber Law"] },
];

export const initialTimeSlots: TimeSlot[] = [
  // Slot definitions replicated for Monday through Friday
  // 0: 09:00 - 10:00
  // 1: 10:00 - 11:00
  // 2: 11:00 - 12:00
  // 3: 12:00 - 13:00 (Lunch Interval)
  // 4: 13:00 - 14:00
  // 5: 14:00 - 15:00
  // 6: 15:00 - 16:00
  // 7: 16:00 - 17:00
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slotTimes = [
  { index: 0, start: "09:00", end: "10:00", isBreak: false },
  { index: 1, start: "10:00", end: "11:00", isBreak: false },
  { index: 2, start: "11:00", end: "12:00", isBreak: false },
  { index: 3, start: "12:00", end: "13:00", isBreak: true },
  { index: 4, start: "13:00", end: "14:00", isBreak: false },
  { index: 5, start: "14:00", end: "15:00", isBreak: false },
  { index: 6, start: "15:00", end: "16:00", isBreak: false },
  { index: 7, start: "16:00", end: "17:00", isBreak: false },
];

let slotCounter = 1;
for (const day of days) {
  for (const st of slotTimes) {
    initialTimeSlots.push({
      id: slotCounter++,
      day,
      slotIndex: st.index,
      startTime: st.start,
      endTime: st.end,
      isBreak: st.isBreak
    });
  }
}

export const initialConstraints: ConstraintItem[] = [
  { id: 1, name: "No Faculty Double-Booking", type: "HARD", weight: 100, isActive: true, description: "A faculty member cannot instruct two classes simultaneously." },
  { id: 2, name: "No Student Batch Clash", type: "HARD", weight: 100, isActive: true, description: "A student cohort cannot attend two distinct courses in the same slot." },
  { id: 3, name: "No Classroom Overlap", type: "HARD", weight: 100, isActive: true, description: "A classroom cannot host multiple lectures in the same period." },
  { id: 4, name: "No Laboratory Overlap", type: "HARD", weight: 100, isActive: true, description: "A lab facility cannot be double-booked across batches." },
  { id: 5, name: "Room Capacity Compliance", type: "HARD", weight: 100, isActive: true, description: "Assigned room seating capacity must be >= student cohort strength." },
  { id: 6, name: "Lab Requirement Compliance", type: "HARD", weight: 100, isActive: true, description: "Lab/practical courses must strictly take place in specialized laboratories." },
  { id: 7, name: "Faculty Availability Adherence", type: "HARD", weight: 95, isActive: true, description: "Respect verified research council, leave, or departmental commitments." },
  { id: 8, name: "Balanced Faculty Workload", type: "SOFT", weight: 25, isActive: true, description: "Evenly distribute weekly teaching assignments across Monday to Friday." },
  { id: 9, name: "Balanced Student Workload", type: "SOFT", weight: 25, isActive: true, description: "Prevent daily clustering of more than 4 heavy theory lectures for students." },
  { id: 10, name: "Avoid Gaps & Fragmented Windows", type: "SOFT", weight: 20, isActive: true, description: "Minimize random idle 2-hour gaps between lectures." },
  { id: 11, name: "Avoid >3 Consecutive Classes", type: "SOFT", weight: 20, isActive: true, description: "Ensure students and faculty have a break or lunch after 3 contiguous periods." },
  { id: 12, name: "Synchronized Multidisciplinary Slots", type: "SOFT", weight: 30, isActive: true, description: "Align university-wide open electives in harmonized time slots." },
];
