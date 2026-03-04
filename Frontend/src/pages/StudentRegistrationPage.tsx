import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DEGREE_PROGRAMS } from '@/types';
import { CalendarIcon, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateStudent } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';

export default function StudentRegistrationPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState<Date>();
  const [degreeProgram, setDegreeProgram] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createStudent = useCreateStudent();
  const { data: courses = [] } = useCourses();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!address.trim()) e.address = 'Address is required';
    if (!birthday) e.birthday = 'Birthday is required';
    if (!degreeProgram) e.degreeProgram = 'Degree program is required';
    if (selectedCourses.length === 0) e.courses = 'Select at least one course';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    createStudent.mutate(
      {
        first_name: firstName,
        last_name: lastName,
        address,
        birthday: birthday ? format(birthday, 'yyyy-MM-dd') : '',
        degree_program: degreeProgram,
        enrolled_courses: selectedCourses,
      },
      {
        onSuccess: (data: any) => {
          setCreatedStudent(data);
          setShowSuccess(true);
        },
      }
    );
  };

  const handleReset = () => {
    setFirstName(''); setLastName(''); setAddress(''); setBirthday(undefined);
    setDegreeProgram(''); setSelectedCourses([]); setErrors({});
  };

  const toggleCourse = (code: string) => {
    setSelectedCourses(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
    setErrors(p => ({ ...p, courses: undefined as any }));
  };

  const clearError = (field: string) => setErrors(p => ({ ...p, [field]: undefined as any }));

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Register Student</h1>
            <p className="page-subtitle">Add a new student to the system</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-subtle p-6 md:p-8">
          {/* Student Number */}
          <div className="mb-6 p-4 bg-muted/50 rounded-xl">
            <Label className="text-xs text-muted-foreground">Auto-generated Student Number</Label>
            <p className="text-lg font-semibold font-mono text-primary mt-1">Auto-assigned on save</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
              <Input id="firstName" value={firstName} onChange={e => { setFirstName(e.target.value); clearError('firstName'); }}
                className={cn('input-field', errors.firstName && 'border-destructive')} placeholder="Enter first name" />
              {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
              <Input id="lastName" value={lastName} onChange={e => { setLastName(e.target.value); clearError('lastName'); }}
                className={cn('input-field', errors.lastName && 'border-destructive')} placeholder="Enter last name" />
              {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
            </div>
            <div className="space-y-2">
              <Label>Birthday <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('w-full justify-start text-left font-normal input-field', !birthday && 'text-muted-foreground', errors.birthday && 'border-destructive')}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthday ? format(birthday, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={birthday} onSelect={d => { setBirthday(d); clearError('birthday'); }}
                    disabled={d => d > new Date() || d < new Date('1980-01-01')}
                    initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {errors.birthday && <p className="text-xs text-destructive">{errors.birthday}</p>}
            </div>
            <div className="space-y-2">
              <Label>Degree Program <span className="text-destructive">*</span></Label>
              <Select value={degreeProgram} onValueChange={v => { setDegreeProgram(v); clearError('degreeProgram'); }}>
                <SelectTrigger className={cn('input-field', errors.degreeProgram && 'border-destructive')}>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_PROGRAMS.map(p => <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.degreeProgram && <p className="text-xs text-destructive">{errors.degreeProgram}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
              <Textarea id="address" value={address} onChange={e => { setAddress(e.target.value); clearError('address'); }}
                className={cn('input-field min-h-[80px]', errors.address && 'border-destructive')} placeholder="Enter full address" />
              {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Enrolled Courses <span className="text-destructive">*</span></Label>
              {errors.courses && <p className="text-xs text-destructive">{errors.courses}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 border rounded-xl bg-muted/30">
                {courses.map((c: any) => (
                  <label key={c.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <Checkbox checked={selectedCourses.includes(c.courseCode)} onCheckedChange={() => toggleCourse(c.courseCode)} />
                    <span className="text-sm"><span className="font-medium">{c.courseCode}</span> – {c.courseName}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border/50">
            <Button type="submit" className="btn-glow" disabled={createStudent.isPending}>
              {createStudent.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Registering...
                </div>
              ) : 'Register Student'}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>Cancel</Button>
          </div>
        </form>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="glass-card-subtle text-center sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <DialogTitle className="text-xl">Registration Successful!</DialogTitle>
              <DialogDescription>
                Student <span className="font-semibold text-foreground">{firstName} {lastName}</span> has been registered with student number <span className="font-mono font-semibold text-primary">{createdStudent?.studentNumber}</span>.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => { setShowSuccess(false); handleReset(); }} className="mt-4 btn-glow">Register Another Student</Button>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
