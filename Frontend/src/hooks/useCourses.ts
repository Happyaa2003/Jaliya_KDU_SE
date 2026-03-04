import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/services/api';
import { transformCourse } from '@/types';
import { toast } from 'sonner';

export const useCourses = () =>
    useQuery({ queryKey: ['courses'], queryFn: () => coursesApi.list().then((d: any[]) => d.map(transformCourse)) });

export const useCreateCourse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: coursesApi.create,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['courses'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to create course'),
    });
};

export const useUpdateCourse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => coursesApi.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to update course'),
    });
};

export const useDeleteCourse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: coursesApi.delete,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['courses'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); },
        onError: (e: any) => toast.error(e.response?.data?.detail || 'Failed to delete course'),
    });
};
