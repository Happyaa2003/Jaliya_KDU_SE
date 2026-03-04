import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/services/api';

export const useAuditLogs = (skip = 0, limit = 100) =>
    useQuery({
        queryKey: ['audit-logs', skip, limit],
        queryFn: () => auditApi.list(skip, limit),
    });
