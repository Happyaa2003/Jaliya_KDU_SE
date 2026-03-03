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
  actionType: 'Create' | 'Update' | 'Delete' | 'Enroll';
  entity: 'Student' | 'Course' | 'Enrollment';
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
