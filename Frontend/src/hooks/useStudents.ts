import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '@/services/api';
import { transformStudent } from '@/types';
import { toast } from 'sonner';

export const useStudents = () =>
    useQuery({ queryKey: ['students'], queryFn: () => studentsApi.list().then((d: any[]) => d.map(transformStudent)) });

export const useStudent = (id: string) =>
    useQuery({ queryKey: ['students', id], queryFn: () => studentsApi.get(id).then(transformStudent), enabled: !!id });

export const useCreateStudent = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: studentsApi.create,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['students'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to create student'),
    });
};

export const useUpdateStudent = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => studentsApi.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to update student'),
    });
};

export const useDeleteStudent = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: studentsApi.delete,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['students'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to delete student'),
    });
};
