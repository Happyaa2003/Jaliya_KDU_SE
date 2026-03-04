import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyTableState } from '@/components/EmptyTableState';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';

export default function CourseManagementPage() {
  const { data: courses = [], isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openAdd = () => { setEditCourse(null); setCode(''); setName(''); setCredits(''); setErrors({}); setModalOpen(true); };
  const openEdit = (c: Course) => { setEditCourse(c); setCode(c.courseCode); setName(c.courseName); setCredits(String(c.credits)); setErrors({}); setModalOpen(true); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!code.trim()) e.code = 'Required';
    if (!name.trim()) e.name = 'Required';
    if (!credits || isNaN(Number(credits)) || Number(credits) < 1) e.credits = 'Enter valid credits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const payload = { course_code: code, course_name: name, credits: Number(credits) };
    if (editCourse) {
      updateCourse.mutate({ id: editCourse.id, data: payload }, {
        onSuccess: () => { toast.success('Course updated'); setModalOpen(false); },
      });
    } else {
      createCourse.mutate(payload, {
        onSuccess: () => { toast.success('Course added'); setModalOpen(false); },
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCourse.mutate(deleteTarget.id, {
      onSuccess: () => { toast.success('Course deleted'); setDeleteTarget(null); },
    });
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage Courses</h1>
            <p className="page-subtitle">{courses.length} courses available</p>
          </div>
          <Button onClick={openAdd} className="btn-glow"><Plus className="w-4 h-4 mr-2" /> Add Course</Button>
        </div>

        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : courses.length === 0 ? <EmptyTableState message="No courses found" colSpan={4} /> :
                courses.map((c: Course) => (
                  <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono font-medium">{c.courseCode}</TableCell>
                    <TableCell>{c.courseName}</TableCell>
                    <TableCell>{c.credits}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Edit</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(c)}><Trash2 className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="glass-card-subtle sm:max-w-md">
            <DialogHeader><DialogTitle>{editCourse ? 'Edit Course' : 'Add Course'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Course Code</Label>
                <Input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. CS501" className={`input-field ${errors.code ? 'border-destructive' : ''}`} />
                {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
              </div>
              <div className="space-y-2">
                <Label>Course Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Machine Learning" className={`input-field ${errors.name ? 'border-destructive' : ''}`} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Credits</Label>
                <Input type="number" value={credits} onChange={e => setCredits(e.target.value)} placeholder="3" className={`input-field ${errors.credits ? 'border-destructive' : ''}`} />
                {errors.credits && <p className="text-xs text-destructive">{errors.credits}</p>}
              </div>
              <Button onClick={handleSave} className="w-full btn-glow" disabled={createCourse.isPending || updateCourse.isPending}>
                {createCourse.isPending || updateCourse.isPending ? 'Saving…' : editCourse ? 'Update Course' : 'Add Course'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}
          title="Delete Course" description={`Delete ${deleteTarget?.courseCode} – ${deleteTarget?.courseName}? This action cannot be undone.`}
          onConfirm={handleDelete} confirmLabel="Delete" />
      </div>
    </DashboardLayout>
  );
}
