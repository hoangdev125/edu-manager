import type { DashboardStats, DepartmentOption, SchoolClassOption, SubjectOption, Student } from './types/student';
import type { UserAccount } from './context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorBody.message ?? 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function uploadRequest<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorBody.message ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export const studentApi = {
  getAll: () => request<Student[]>('/students'),
  getStats: () => request<DashboardStats>('/students/stats'),
  create: (student: Omit<Student, 'activities'>) =>
    request<Student>('/students', {
      method: 'POST',
      body: JSON.stringify({ ...student, activities: [] }),
    }),
  update: (student: Student) =>
    request<Student>(`/students/${encodeURIComponent(student.id)}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    }),
  delete: (id: string) =>
    request<void>(`/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

export const authApi = {
  getUsers: () => request<UserAccount[]>('/auth/users'),
  login: (username: string, password: string) =>
    request<UserAccount>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  register: (
    username: string,
    password: string,
    fullName: string,
    role: 'admin' | 'student',
    studentId?: string
  ) =>
    request<UserAccount>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, fullName, role, studentId }),
    }),
};

export const academicApi = {
  getDepartments: () => request<DepartmentOption[]>('/academic/departments'),
  createDepartment: (name: string) =>
    request<DepartmentOption>('/academic/departments', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  updateDepartment: (id: number, name: string) =>
    request<DepartmentOption>(`/academic/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
  deleteDepartment: (id: number) =>
    request<void>(`/academic/departments/${id}`, {
      method: 'DELETE',
    }),
  getClasses: () => request<SchoolClassOption[]>('/academic/classes'),
  createClass: (code: string, departmentName: string) =>
    request<SchoolClassOption>('/academic/classes', {
      method: 'POST',
      body: JSON.stringify({ code, departmentName }),
    }),
  updateClass: (id: number, code: string, departmentName: string) =>
    request<SchoolClassOption>(`/academic/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ code, departmentName }),
    }),
  deleteClass: (id: number) =>
    request<void>(`/academic/classes/${id}`, {
      method: 'DELETE',
    }),
};

export const fileApi = {
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadRequest<{ url: string }>('/files/avatar', formData);
  },
};

export const subjectApi = {
  getAll: () => request<SubjectOption[]>('/subjects'),
  create: (code: string, name: string, credits: number) =>
    request<SubjectOption>('/subjects', {
      method: 'POST',
      body: JSON.stringify({ code, name, credits }),
    }),
  update: (id: number, code: string, name: string, credits: number) =>
    request<SubjectOption>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ code, name, credits }),
    }),
  delete: (id: number) =>
    request<void>(`/subjects/${id}`, {
      method: 'DELETE',
    }),
};
