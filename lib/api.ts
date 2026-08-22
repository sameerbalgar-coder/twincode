import type {
  EmployeeProfile,
  AttendanceRecord,
  WeeklyAttendance,
  LeaveRequest,
  PayrollRecord,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  PersonalDetails,
} from './types';

const API_BASE = '/api/employee';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.error || 'Request failed', success: false };
    }

    return { data, error: null, success: true };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Network error', success: false };
  }
}

export const employeeApi = {
  getProfile: () => fetchApi<EmployeeProfile>('/profile'),

  updateProfile: (data: Partial<PersonalDetails> & { avatarUrl?: string }) =>
    fetchApi<EmployeeProfile>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getAttendance: (params?: { startDate?: string; endDate?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    return fetchApi<AttendanceRecord[]>(`/attendance?${searchParams.toString()}`);
  },

  getTodayAttendance: () => fetchApi<AttendanceRecord>('/attendance/today'),

  getWeeklyAttendance: (weekStart: string) =>
    fetchApi<WeeklyAttendance>(`/attendance/weekly?weekStart=${weekStart}`),

  checkIn: () => fetchApi<AttendanceRecord>('/attendance/check-in', { method: 'POST' }),

  checkOut: () => fetchApi<AttendanceRecord>('/attendance/check-out', { method: 'POST' }),

  getLeaveRequests: (params?: { page?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    return fetchApi<PaginatedResponse<LeaveRequest>>(`/leave?${searchParams.toString()}`);
  },

  createLeaveRequest: (data: {
    leaveType: 'paid' | 'sick' | 'unpaid';
    startDate: string;
    endDate: string;
    remarks?: string;
  }) =>
    fetchApi<LeaveRequest>('/leave', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getPayroll: (params?: { page?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    return fetchApi<PaginatedResponse<PayrollRecord>>(`/payroll?${searchParams.toString()}`);
  },

  getDashboardStats: () => fetchApi<DashboardStats>('/dashboard'),
};

export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ user: { id: string; email: string; name: string; role: string }; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => fetchApi<void>('/auth/logout', { method: 'POST' }),

  getMe: () =>
    fetchApi<{ id: string; email: string; name: string; role: string; employeeId?: string }>('/auth/me'),
};