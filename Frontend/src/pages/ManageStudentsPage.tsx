import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { mockStudents, mockCourses } from '@/data/mockData';
import { DEGREE_PROGRAMS, Student } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { PaginationControls } from '@/components/PaginationControls';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyTableState } from '@/components/EmptyTableState';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ManageStudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [search, setSearch] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const pageSize = 5;

  const filtered = students.filter(s => {
    const matchSearch = !search || s.studentNumber.toLowerCase().includes(search.toLowerCase()) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchProgram = filterProgram === 'all' || s.degreeProgram === filterProgram;
    return matchSearch && matchProgram;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = () => {
    if (!deleteTarget) return;
    setStudents(prev => prev.map(s => s.id === deleteTarget.id ? { ...s, status: 'Inactive' as const } : s));
    toast.success(`Student ${deleteTarget.studentNumber} marked as inactive`);
    setDeleteTarget(null);
  };

  const openEdit = (s: Student) => {
    setEditTarget(s);
    setEditFirstName(s.firstName);
    setEditLastName(s.lastName);
  };

  const handleEdit = () => {
    if (!editTarget) return;
    setStudents(prev => prev.map(s => s.id === editTarget.id ? { ...s, firstName: editFirstName, lastName: editLastName } : s));
    toast.success('Student updated successfully');
    setEditTarget(null);
  };

  const getProgramName = (code: string) => DEGREE_PROGRAMS.find(p => p.code === code)?.name || code;

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Manage Students</h1>
            <p className="page-subtitle">{students.length} students total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name or student number..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10 input-field" />
          </div>
          <Select value={filterProgram} onValueChange={v => { setFilterProgram(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[240px] input-field">
              <SelectValue placeholder="Filter by program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {DEGREE_PROGRAMS.map(p => <SelectItem key={p.code} value={p.code}>{p.code} – {p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Student No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Degree Program</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <EmptyTableState message="No students found" colSpan={6} />
              ) : paginated.map(s => (
                <TableRow key={s.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-sm font-medium">{s.studentNumber}</TableCell>
                  <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                  <TableCell className="text-sm">{s.degreeProgram}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.enrolledCourses.slice(0, 2).map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                      {s.enrolledCourses.length > 2 && <Badge variant="outline" className="text-xs">+{s.enrolledCourses.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/students/${s.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger><TooltipContent>View</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger><TooltipContent>Edit</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(s)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length > pageSize && (
            <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={pageSize} />
          )}
        </div>

        {/* Delete Confirm */}
        <ConfirmDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}
          title="Delete Student" description={`Are you sure you want to deactivate ${deleteTarget?.firstName} ${deleteTarget?.lastName} (${deleteTarget?.studentNumber})? This will mark the student as inactive.`}
          onConfirm={handleDelete} confirmLabel="Delete" />

        {/* Edit Drawer */}
        <Sheet open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Edit Student</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Student Number</Label>
                <Input value={editTarget?.studentNumber || ''} disabled className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={editFirstName} onChange={e => setEditFirstName(e.target.value)} className="input-field" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={editLastName} onChange={e => setEditLastName(e.target.value)} className="input-field" />
              </div>
              <Button onClick={handleEdit} className="w-full btn-glow mt-4">Save Changes</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
}
