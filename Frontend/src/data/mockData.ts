import { Student, Course, Enrollment, AuditLog } from '@/types';

export const mockCourses: Course[] = [
  { id: '1', courseCode: 'CS101', courseName: 'Introduction to Computing', credits: 3 },
  { id: '2', courseCode: 'CS102', courseName: 'Data Structures and Algorithms', credits: 3 },
  { id: '3', courseCode: 'CS201', courseName: 'Object-Oriented Programming', credits: 3 },
  { id: '4', courseCode: 'CS202', courseName: 'Database Management Systems', credits: 3 },
  { id: '5', courseCode: 'CS301', courseName: 'Software Engineering', credits: 3 },
  { id: '6', courseCode: 'CS302', courseName: 'Operating Systems', credits: 3 },
  { id: '7', courseCode: 'CS401', courseName: 'Artificial Intelligence', credits: 3 },
  { id: '8', courseCode: 'CS402', courseName: 'Web Development', credits: 3 },
  { id: '9', courseCode: 'MATH101', courseName: 'Calculus I', credits: 4 },
  { id: '10', courseCode: 'MATH102', courseName: 'Linear Algebra', credits: 3 },
  { id: '11', courseCode: 'ENG101', courseName: 'Technical Writing', credits: 2 },
  { id: '12', courseCode: 'PHY101', courseName: 'Physics I', credits: 4 },
];

export const mockStudents: Student[] = [
  {
    id: '1', studentNumber: 'SMS-2025-0001', firstName: 'Maria', lastName: 'Santos',
    address: '123 Rizal St, Quezon City', birthday: '2003-05-15',
    degreeProgram: 'BSCS', enrolledCourses: ['CS101', 'CS102', 'MATH101'],
    status: 'Active', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2025-01-15T08:00:00Z',
  },
  {
    id: '2', studentNumber: 'SMS-2025-0002', firstName: 'Juan', lastName: 'Dela Cruz',
    address: '456 Bonifacio Ave, Manila', birthday: '2002-08-22',
    degreeProgram: 'BSIT', enrolledCourses: ['CS101', 'CS201', 'ENG101'],
    status: 'Active', createdAt: '2025-01-16T09:30:00Z', updatedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: '3', studentNumber: 'SMS-2025-0003', firstName: 'Ana', lastName: 'Reyes',
    address: '789 Mabini Blvd, Makati', birthday: '2003-01-10',
    degreeProgram: 'BSCS', enrolledCourses: ['CS202', 'CS301', 'MATH102'],
    status: 'Active', createdAt: '2025-01-17T11:00:00Z', updatedAt: '2025-01-17T11:00:00Z',
  },
  {
    id: '4', studentNumber: 'SMS-2025-0004', firstName: 'Carlos', lastName: 'Garcia',
    address: '321 Luna St, Pasig', birthday: '2001-11-30',
    degreeProgram: 'BSCpE', enrolledCourses: ['CS101', 'PHY101', 'MATH101'],
    status: 'Active', createdAt: '2025-01-20T14:00:00Z', updatedAt: '2025-01-20T14:00:00Z',
  },
  {
    id: '5', studentNumber: 'SMS-2025-0005', firstName: 'Liza', lastName: 'Morales',
    address: '555 Aguinaldo Highway, Cavite', birthday: '2002-03-25',
    degreeProgram: 'BSDS', enrolledCourses: ['CS101', 'MATH101', 'MATH102'],
    status: 'Inactive', createdAt: '2025-01-22T08:30:00Z', updatedAt: '2025-02-10T09:00:00Z',
  },
  {
    id: '6', studentNumber: 'SMS-2025-0006', firstName: 'Miguel', lastName: 'Torres',
    address: '88 Katipunan Ave, Quezon City', birthday: '2003-07-18',
    degreeProgram: 'BSIS', enrolledCourses: ['CS201', 'CS202', 'ENG101'],
    status: 'Active', createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: '7', studentNumber: 'SMS-2025-0007', firstName: 'Sofia', lastName: 'Cruz',
    address: '12 Commonwealth Ave, QC', birthday: '2002-12-05',
    degreeProgram: 'BSCyS', enrolledCourses: ['CS301', 'CS302', 'CS401'],
    status: 'Active', createdAt: '2025-02-05T13:00:00Z', updatedAt: '2025-02-05T13:00:00Z',
  },
  {
    id: '8', studentNumber: 'SMS-2025-0008', firstName: 'Rafael', lastName: 'Mendoza',
    address: '77 EDSA, Mandaluyong', birthday: '2001-09-14',
    degreeProgram: 'BSIT', enrolledCourses: ['CS402', 'CS301', 'ENG101'],
    status: 'Active', createdAt: '2025-02-10T08:00:00Z', updatedAt: '2025-02-10T08:00:00Z',
  },
];

export const mockEnrollments: Enrollment[] = [
  { id: '1', studentId: '1', courseId: '1', semester: '1st Semester', year: 2025, status: 'Enrolled' },
  { id: '2', studentId: '1', courseId: '2', semester: '1st Semester', year: 2025, status: 'Enrolled' },
  { id: '3', studentId: '1', courseId: '9', semester: '1st Semester', year: 2025, status: 'Enrolled' },
  { id: '4', studentId: '2', courseId: '1', semester: '1st Semester', year: 2025, status: 'Enrolled' },
  { id: '5', studentId: '2', courseId: '3', semester: '1st Semester', year: 2025, status: 'Enrolled' },
  { id: '6', studentId: '1', courseId: '3', semester: '2nd Semester', year: 2024, status: 'Completed' },
  { id: '7', studentId: '1', courseId: '11', semester: '2nd Semester', year: 2024, status: 'Completed' },
  { id: '8', studentId: '3', courseId: '4', semester: '1st Semester', year: 2025, status: 'Enrolled' },
  { id: '9', studentId: '3', courseId: '5', semester: '1st Semester', year: 2025, status: 'Enrolled' },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1', timestamp: '2025-02-28T14:32:00Z', actionType: 'Create', entity: 'Student',
    entityId: 'SMS-2025-0008', performedBy: 'admin@university.edu',
    oldValue: '', newValue: JSON.stringify({ firstName: 'Rafael', lastName: 'Mendoza', degreeProgram: 'BSIT' }),
  },
  {
    id: '2', timestamp: '2025-02-27T10:15:00Z', actionType: 'Enroll', entity: 'Enrollment',
    entityId: 'SMS-2025-0007', performedBy: 'admin@university.edu',
    oldValue: '', newValue: JSON.stringify({ courses: ['CS301', 'CS302', 'CS401'], semester: '1st Semester', year: 2025 }),
  },
  {
    id: '3', timestamp: '2025-02-25T09:00:00Z', actionType: 'Update', entity: 'Student',
    entityId: 'SMS-2025-0002', performedBy: 'admin@university.edu',
    oldValue: JSON.stringify({ address: '456 Bonifacio Ave' }),
    newValue: JSON.stringify({ address: '456 Bonifacio Ave, Manila' }),
  },
  {
    id: '4', timestamp: '2025-02-20T16:45:00Z', actionType: 'Create', entity: 'Course',
    entityId: 'CS402', performedBy: 'admin@university.edu',
    oldValue: '', newValue: JSON.stringify({ courseCode: 'CS402', courseName: 'Web Development', credits: 3 }),
  },
  {
    id: '5', timestamp: '2025-02-18T11:30:00Z', actionType: 'Delete', entity: 'Student',
    entityId: 'SMS-2025-0005', performedBy: 'admin@university.edu',
    oldValue: JSON.stringify({ firstName: 'Liza', lastName: 'Morales', status: 'Active' }),
    newValue: JSON.stringify({ status: 'Inactive' }),
  },
  {
    id: '6', timestamp: '2025-02-15T08:20:00Z', actionType: 'Create', entity: 'Student',
    entityId: 'SMS-2025-0006', performedBy: 'admin@university.edu',
    oldValue: '', newValue: JSON.stringify({ firstName: 'Miguel', lastName: 'Torres', degreeProgram: 'BSIS' }),
  },
  {
    id: '7', timestamp: '2025-02-10T13:10:00Z', actionType: 'Update', entity: 'Course',
    entityId: 'CS301', performedBy: 'admin@university.edu',
    oldValue: JSON.stringify({ credits: 2 }), newValue: JSON.stringify({ credits: 3 }),
  },
  {
    id: '8', timestamp: '2025-02-08T07:55:00Z', actionType: 'Enroll', entity: 'Enrollment',
    entityId: 'SMS-2025-0003', performedBy: 'admin@university.edu',
    oldValue: '', newValue: JSON.stringify({ courses: ['CS202', 'CS301', 'MATH102'], semester: '1st Semester', year: 2025 }),
  },
  {
    id: '9', timestamp: '2025-02-05T15:00:00Z', actionType: 'Create', entity: 'Student',
    entityId: 'SMS-2025-0007', performedBy: 'admin@university.edu',
    oldValue: '', newValue: JSON.stringify({ firstName: 'Sofia', lastName: 'Cruz', degreeProgram: 'BSCyS' }),
  },
  {
    id: '10', timestamp: '2025-01-30T09:45:00Z', actionType: 'Create', entity: 'Course',
    entityId: 'PHY101', performedBy: 'admin@university.edu',
    oldValue: '', newValue: JSON.stringify({ courseCode: 'PHY101', courseName: 'Physics I', credits: 4 }),
  },
];
