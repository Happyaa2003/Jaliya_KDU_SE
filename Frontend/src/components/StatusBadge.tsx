import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Active' | 'Inactive' | 'Enrolled' | 'Completed' | 'Dropped';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    Active: 'bg-success/10 text-success border-success/20 hover:bg-success/10',
    Inactive: 'bg-muted text-muted-foreground border-border hover:bg-muted',
    Enrolled: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/10',
    Completed: 'bg-success/10 text-success border-success/20 hover:bg-success/10',
    Dropped: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10',
  };

  return (
    <Badge variant="outline" className={cn('font-medium text-xs', styles[status])}>
      {status}
    </Badge>
  );
}
