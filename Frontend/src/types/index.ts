// Frontend type adapter — maps snake_case API response to camelCase TS types

export interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  birthday: string;
  degreeProgram: string;
  enrolledCourses: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  semester: string;
  year: number;
  status: 'Enrolled' | 'Completed' | 'Dropped';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actionType: string;
  entity: string;
  entityId: string;
  performedBy: string;
  oldValue: string;
  newValue: string;
}

export interface DegreeProgram {
  id: string;
  name: string;
  code: string;
}

export const DEGREE_PROGRAMS: DegreeProgram[] = [
  { id: '1', name: 'Bachelor of Science in Computer Science', code: 'BSCS' },
  { id: '2', name: 'Bachelor of Science in Information Technology', code: 'BSIT' },
  { id: '3', name: 'Bachelor of Science in Information Systems', code: 'BSIS' },
  { id: '4', name: 'Bachelor of Science in Computer Engineering', code: 'BSCpE' },
  { id: '5', name: 'Bachelor of Science in Data Science', code: 'BSDS' },
  { id: '6', name: 'Bachelor of Science in Cybersecurity', code: 'BSCyS' },
];

export const SEMESTERS = ['1st Semester', '2nd Semester', 'Summer'];

// ─── API response transformers ─────────────────────────────────────────────
// The backend returns snake_case; these helpers transform to camelCase for the
// existing component props.

export function transformStudent(raw: any): Student {
  return {
    id: raw.id,
    studentNumber: raw.student_number,
    firstName: raw.first_name,
    lastName: raw.last_name,
    address: raw.address,
    birthday: raw.birthday,
    degreeProgram: raw.degree_program,
    enrolledCourses: raw.enrolled_courses ?? [],
    status: raw.status,
    createdAt: raw.created_at ?? '',
    updatedAt: raw.updated_at ?? '',
  };
}

export function transformCourse(raw: any): Course {
  return {
    id: raw.id,
    courseCode: raw.course_code,
    courseName: raw.course_name,
    credits: raw.credits,
  };
}
