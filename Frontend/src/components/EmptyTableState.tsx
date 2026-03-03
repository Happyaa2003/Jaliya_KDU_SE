import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EmptyStateProps {
  message: string;
  colSpan: number;
}

export function EmptyTableState({ message, colSpan }: EmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32 text-center">
        <p className="text-muted-foreground">{message}</p>
      </TableCell>
    </TableRow>
  );
}
