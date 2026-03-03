import { Users, BookOpen, ClipboardList, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { mockStudents, mockCourses, mockEnrollments, mockAuditLogs } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const activeStudents = mockStudents.filter(s => s.status === 'Active').length;
  const activeEnrollments = mockEnrollments.filter(e => e.status === 'Enrolled').length;
  const recentLogs = mockAuditLogs.slice(0, 5);

  const actionColors: Record<string, string> = {
    Create: 'bg-success/10 text-success border-success/20',
    Update: 'bg-info/10 text-info border-info/20',
    Delete: 'bg-destructive/10 text-destructive border-destructive/20',
    Enroll: 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of system activity</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={mockStudents.length} icon={Users} color="primary" trend={`${activeStudents} active`} />
          <StatCard title="Total Courses" value={mockCourses.length} icon={BookOpen} color="success" />
          <StatCard title="Active Enrollments" value={activeEnrollments} icon={ClipboardList} color="warning" />
          <StatCard title="Audit Logs" value={mockAuditLogs.length} icon={FileText} color="info" />
        </div>

        {/* Recent Activity */}
        <div className="table-container">
          <div className="px-6 py-4 border-b border-border/50">
            <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">Last 5 system logs</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs.map(log => (
                <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="text-sm">{format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={actionColors[log.actionType]}>{log.actionType}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{log.entity}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{log.entityId}</TableCell>
                  <TableCell className="text-sm">{log.performedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
