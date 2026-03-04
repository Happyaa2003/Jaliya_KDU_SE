import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DEGREE_PROGRAMS } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ArrowLeft, Pencil, Trash2, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useStudent, useUpdateStudent, useDeleteStudent } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: student, isLoading } = useStudent(id!);
  const { data: courses = [] } = useCourses();
  const { data: enrollmentHistory = [] } = useEnrollments(id);
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDegree, setEditDegree] = useState('');

  const openEdit = () => {
    if (!student) return;
    setEditFirstName(student.firstName);
    setEditLastName(student.lastName);
    setEditAddress(student.address);
    setEditDegree(student.degreeProgram);
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!student) return;
    updateStudent.mutate(
      {
        id: student.id,
        data: {
          first_name: editFirstName,
          last_name: editLastName,
          address: editAddress,
          degree_program: editDegree,
        },
      },
      {
        onSuccess: () => {
          toast.success('Student updated successfully');
          setEditOpen(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!student) return;
    deleteStudent.mutate(student.id, {
      onSuccess: () => {
        toast.success(`${student.firstName} ${student.lastName} marked as inactive`);
        navigate('/students');
      },
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="page-container flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading student profile…</p>
        </div>
      </DashboardLayout>
    );
  }

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
  const currentCourses = courses.filter((c: any) => student.enrolledCourses.includes(c.courseCode));

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
                <div><p className="text-muted-foreground">Degree Program</p><p className="font-medium">{programName}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div><p className="text-muted-foreground">Birthday</p><p className="font-medium">{format(new Date(student.birthday), 'MMMM d, yyyy')}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div><p className="text-muted-foreground">Address</p><p className="font-medium">{student.address}</p></div>
              </div>
            </div>
            <div className="flex gap-2 mt-6 pt-6 border-t border-border/50">
              <Button variant="outline" className="flex-1" onClick={openEdit}>
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
                disabled={student.status === 'Inactive'}
              >
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
                    <TableHead>Course Code</TableHead><TableHead>Course Name</TableHead><TableHead>Credits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCourses.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No enrolled courses</TableCell></TableRow>
                  ) : currentCourses.map((c: any) => (
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
                    <TableHead>Semester</TableHead><TableHead>Year</TableHead><TableHead>Course</TableHead><TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollmentHistory.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No history</TableCell></TableRow>
                  ) : enrollmentHistory.map((e: any) => {
                    const course = courses.find((c: any) => c.id === e.course_id);
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

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader><SheetTitle>Edit Student</SheetTitle></SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Student Number</Label>
              <Input value={student.studentNumber} disabled className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} className="input-field" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={editLastName} onChange={e => setEditLastName(e.target.value)} className="input-field" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={editAddress} onChange={e => setEditAddress(e.target.value)} className="input-field" />
            </div>
            <div className="space-y-2">
              <Label>Degree Program</Label>
              <Select value={editDegree} onValueChange={setEditDegree}>
                <SelectTrigger className="input-field"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEGREE_PROGRAMS.map(p => (
                    <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleEdit}
              className="w-full btn-glow mt-4"
              disabled={updateStudent.isPending}
            >
              {updateStudent.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Deactivate Student"
        description={`Mark ${student.firstName} ${student.lastName} (${student.studentNumber}) as Inactive? This can be reversed by updating the student's status.`}
        onConfirm={handleDelete}
        confirmLabel="Deactivate"
      />
    </DashboardLayout>
  );
}
