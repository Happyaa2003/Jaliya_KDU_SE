import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/services/api';
import { toast } from 'sonner';

export const useEnrollments = (studentId?: string) =>
    useQuery({
        queryKey: ['enrollments', studentId],
        queryFn: () => enrollmentsApi.list(studentId),
    });

export const useCreateEnrollment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: enrollmentsApi.create,
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: ['enrollments'] });
            qc.invalidateQueries({ queryKey: ['students'] });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to create enrollment'),
    });
};

export const useDeleteEnrollment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: enrollmentsApi.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['enrollments'] });
            qc.invalidateQueries({ queryKey: ['students'] });
            qc.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to remove enrollment'),
    });
};
