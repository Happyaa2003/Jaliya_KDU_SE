import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT token from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sms_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('sms_token');
            localStorage.removeItem('sms_user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// ── Auth ────────────────────────────────────────────────────
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }).then((r) => r.data),
};

// ── Users (Admin Management) ─────────────────────────────────
export const usersApi = {
    list: () => api.get('/auth/users').then((r) => r.data),
    create: (email: string, password: string, full_name: string) =>
        api.post('/auth/users', { email, password, full_name }).then((r) => r.data),
    changePassword: (userId: string, newPassword: string) =>
        api.put(`/auth/users/${userId}/password`, { user_id: userId, new_password: newPassword }).then((r) => r.data),
};

// ── Students ────────────────────────────────────────────────
export const studentsApi = {
    list: () => api.get('/students/').then((r) => r.data),
    get: (id: string) => api.get(`/students/${id}`).then((r) => r.data),
    create: (data: any) => api.post('/students/', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/students/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`/students/${id}`).then((r) => r.data),
};

// ── Courses ─────────────────────────────────────────────────
export const coursesApi = {
    list: () => api.get('/courses/').then((r) => r.data),
    get: (id: string) => api.get(`/courses/${id}`).then((r) => r.data),
    create: (data: any) => api.post('/courses/', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/courses/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`/courses/${id}`).then((r) => r.data),
};

// ── Enrollments ─────────────────────────────────────────────
export const enrollmentsApi = {
    list: (studentId?: string) =>
        api.get('/enrollments/', { params: studentId ? { student_id: studentId } : {} }).then((r) => r.data),
    create: (data: any) => api.post('/enrollments/', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/enrollments/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`/enrollments/${id}`).then((r) => r.data),
};

// ── Audit Logs ───────────────────────────────────────────────
export const auditApi = {
    list: (skip = 0, limit = 100) =>
        api.get('/audit-logs/', { params: { skip, limit } }).then((r) => r.data),
};

// ── Dashboard ────────────────────────────────────────────────
export const dashboardApi = {
    stats: () => api.get('/dashboard/stats').then((r) => r.data),
};
