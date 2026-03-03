import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { mockAuditLogs } from '@/data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PaginationControls } from '@/components/PaginationControls';
import { EmptyTableState } from '@/components/EmptyTableState';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditTrailPage() {
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pageSize = 6;

  const filtered = mockAuditLogs.filter(l => {
    const matchAction = actionFilter === 'all' || l.actionType === actionFilter;
    const matchEntity = entityFilter === 'all' || l.entity === entityFilter;
    return matchAction && matchEntity;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const actionColors: Record<string, string> = {
    Create: 'bg-success/10 text-success border-success/20',
    Update: 'bg-info/10 text-info border-info/20',
    Delete: 'bg-destructive/10 text-destructive border-destructive/20',
    Enroll: 'bg-primary/10 text-primary border-primary/20',
  };

  const formatJson = (str: string) => {
    try { return JSON.stringify(JSON.parse(str), null, 2); } catch { return str || '—'; }
  };

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Audit Trail</h1>
            <p className="page-subtitle">{mockAuditLogs.length} total logs</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={actionFilter} onValueChange={v => { setActionFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px] input-field"><SelectValue placeholder="Action Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="Create">Create</SelectItem>
              <SelectItem value="Update">Update</SelectItem>
              <SelectItem value="Delete">Delete</SelectItem>
              <SelectItem value="Enroll">Enroll</SelectItem>
            </SelectContent>
          </Select>
          <Select value={entityFilter} onValueChange={v => { setEntityFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px] input-field"><SelectValue placeholder="Entity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Course">Course</SelectItem>
              <SelectItem value="Enrollment">Enrollment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8"></TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? <EmptyTableState message="No audit logs found" colSpan={6} /> :
                paginated.map(log => (
                  <Collapsible key={log.id} asChild open={expandedId === log.id} onOpenChange={open => setExpandedId(open ? log.id : null)}>
                    <>
                      <CollapsibleTrigger asChild>
                        <TableRow className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <TableCell>
                            {expandedId === log.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                          </TableCell>
                          <TableCell className="text-sm">{format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                          <TableCell><Badge variant="outline" className={actionColors[log.actionType]}>{log.actionType}</Badge></TableCell>
                          <TableCell className="text-sm">{log.entity}</TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">{log.entityId}</TableCell>
                          <TableCell className="text-sm">{log.performedBy}</TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={6}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Old Value</p>
                                <pre className="text-xs bg-card p-3 rounded-lg overflow-auto max-h-32 border border-border/50">{formatJson(log.oldValue)}</pre>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">New Value</p>
                                <pre className="text-xs bg-card p-3 rounded-lg overflow-auto max-h-32 border border-border/50">{formatJson(log.newValue)}</pre>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))}
            </TableBody>
          </Table>
          {filtered.length > pageSize && (
            <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={pageSize} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
