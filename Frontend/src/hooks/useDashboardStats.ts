import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

export const useDashboardStats = () =>
    useQuery({
        queryKey: ['dashboard'],
        queryFn: dashboardApi.stats,
        refetchInterval: 30000, // refresh every 30s
    });
