import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { mockStudents, mockCourses, mockEnrollments } from '@/data/mockData';
import { DEGREE_PROGRAMS } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Pencil, Trash2, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = mockStudents.find(s => s.id === id);

  if (!student) {
    return (
      <DashboardLayout>
        <div className="page-container flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">Student not found</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/students')}>Back to Students</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const programName = DEGREE_PROGRAMS.find(p => p.code === student.degreeProgram)?.name || student.degreeProgram;
  const currentCourses = mockCourses.filter(c => student.enrolledCourses.includes(c.courseCode));
  const enrollmentHistory = mockEnrollments.filter(e => e.studentId === student.id);

  return (
    <DashboardLayout>
      <div className="page-container">
        <Button variant="ghost" className="mb-4 -ml-2" onClick={() => navigate('/students')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="lg:col-span-1 glass-card-subtle p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <StatusBadge status={student.status} />
            </div>
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">{student.firstName[0]}{student.lastName[0]}</span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">{student.firstName} {student.lastName}</h3>
              <p className="text-sm font-mono text-primary mt-1">{student.studentNumber}</p>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Degree Program</p>
                  <p className="font-medium">{programName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Birthday</p>
                  <p className="font-medium">{format(new Date(student.birthday), 'MMMM d, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{student.address}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6 pt-6 border-t border-border/50">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/students')}>
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Courses */}
            <div className="table-container">
              <div className="px-6 py-4 border-b border-border/50">
                <h2 className="text-base font-semibold">Current Semester Courses</h2>
                <p className="text-sm text-muted-foreground">{currentCourses.length} courses enrolled</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Credits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCourses.map(c => (
                    <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono font-medium">{c.courseCode}</TableCell>
                      <TableCell>{c.courseName}</TableCell>
                      <TableCell>{c.credits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Course History */}
            <div className="table-container">
              <div className="px-6 py-4 border-b border-border/50">
                <h2 className="text-base font-semibold">Course History</h2>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Semester</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollmentHistory.map(e => {
                    const course = mockCourses.find(c => c.id === e.courseId);
                    return (
                      <TableRow key={e.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>{e.semester}</TableCell>
                        <TableCell>{e.year}</TableCell>
                        <TableCell>{course?.courseCode} – {course?.courseName}</TableCell>
                        <TableCell><StatusBadge status={e.status} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
