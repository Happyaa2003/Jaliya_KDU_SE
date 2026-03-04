import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SEMESTERS } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyTableState } from '@/components/EmptyTableState';
import { Plus, Minus, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments, useCreateEnrollment, useDeleteEnrollment } from '@/hooks/useEnrollments';

export default function EnrollmentManagementPage() {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [semester, setSemester] = useState('1st Semester');
  const [year, setYear] = useState('2025');

  const { data: students = [] } = useStudents();
  const { data: courses = [] } = useCourses();
  const { data: allEnrollments = [], isLoading } = useEnrollments(selectedStudentId || undefined);
  const createEnrollment = useCreateEnrollment();
  const deleteEnrollment = useDeleteEnrollment();

  const student = students.find((s: any) => s.id === selectedStudentId);
  const currentEnrollments = allEnrollments.filter((e: any) => e.semester === semester && e.year === Number(year));
  const pastEnrollments = allEnrollments.filter((e: any) => !(e.semester === semester && e.year === Number(year)));
  const enrolledCourseIds = currentEnrollments.map((e: any) => e.course_id);
  const availableCourses = courses.filter((c: any) => !enrolledCourseIds.includes(c.id));

  const handleAdd = (courseId: string) => {
    const course = courses.find((c: any) => c.id === courseId);
    createEnrollment.mutate(
      { student_id: selectedStudentId, course_id: courseId, semester, year: Number(year) },
      { onSuccess: () => toast.success(`Enrolled in ${course?.courseCode}`) }
    );
  };

  const handleRemove = (enrollmentId: string, courseId: string) => {
    const course = courses.find((c: any) => c.id === courseId);
    deleteEnrollment.mutate(enrollmentId, {
      onSuccess: () => toast.success(`Removed ${course?.courseCode}`),
    });
  };

  const pastGrouped = pastEnrollments.reduce((acc: any, e: any) => {
    const key = `${e.semester} ${e.year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {} as Record<string, typeof pastEnrollments>);

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Enrollment Management</h1>
            <p className="page-subtitle">Manage student course enrollments</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
            <SelectTrigger className="w-full sm:w-[300px] input-field">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.filter((s: any) => s.status === 'Active').map((s: any) => (
                <SelectItem key={s.id} value={s.id}>{s.studentNumber} – {s.firstName} {s.lastName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger className="w-full sm:w-[180px] input-field"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SEMESTERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full sm:w-[120px] input-field"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['2024', '2025', '2026'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {!selectedStudentId ? (
          <div className="glass-card-subtle p-12 text-center">
            <p className="text-muted-foreground">Select a student to manage enrollments</p>
          </div>
        ) : isLoading ? (
          <div className="glass-card-subtle p-12 text-center">
            <p className="text-muted-foreground">Loading enrollments…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current */}
            <div className="table-container">
              <div className="px-6 py-4 border-b border-border/50">
                <h2 className="text-base font-semibold">Current Enrollments</h2>
                <p className="text-sm text-muted-foreground">{semester} {year}</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Course</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEnrollments.length === 0 ? <EmptyTableState message="No enrollments for this period" colSpan={3} /> :
                    currentEnrollments.map((e: any) => {
                      const course = courses.find((c: any) => c.id === e.course_id);
                      return (
                        <TableRow key={e.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">{course?.courseCode} – {course?.courseName}</TableCell>
                          <TableCell><StatusBadge status={e.status} /></TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemove(e.id, e.course_id)}>
                              <Minus className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>

            {/* Available */}
            <div className="table-container">
              <div className="px-6 py-4 border-b border-border/50">
                <h2 className="text-base font-semibold">Available Courses</h2>
                <p className="text-sm text-muted-foreground">Click + to enroll</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Course</TableHead><TableHead>Credits</TableHead><TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableCourses.slice(0, 6).map((c: any) => (
                    <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{c.courseCode} – {c.courseName}</TableCell>
                      <TableCell>{c.credits}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleAdd(c.id)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Timeline */}
            {Object.keys(pastGrouped).length > 0 && (
              <div className="lg:col-span-2 glass-card-subtle p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Course History
                </h2>
                <div className="space-y-4">
                  {Object.entries(pastGrouped).map(([period, enrollments]) => (
                    <div key={period} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <div className="w-px flex-1 bg-border" />
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-semibold text-foreground">{period}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(enrollments as any[]).map(e => {
                            const course = courses.find((c: any) => c.id === e.course_id);
                            return (
                              <Badge key={e.id} variant="outline" className="text-xs">
                                {course?.courseCode} <StatusBadge status={e.status} />
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
