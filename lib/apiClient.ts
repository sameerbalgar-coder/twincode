import { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  DepartmentStat, 
  HRMetrics 
} from '../types/hrms';

export async function fetchEmployeesApi(filters?: {
  search?: string;
  department?: string;
  status?: string;
  employmentType?: string;
}): Promise<Employee[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.department) params.set('department', filters.department);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.employmentType) params.set('employmentType', filters.employmentType);

  const res = await fetch(`/api/employees?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch employees');
  return json.data;
}

export async function fetchEmployeeByIdApi(id: string): Promise<Employee> {
  const res = await fetch(`/api/employees/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch employee');
  return json.data;
}

export async function saveEmployeeApi(employee: Partial<Employee>, isNew: boolean): Promise<Employee> {
  if (isNew) {
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create employee');
    return json.data;
  } else {
    const res = await fetch(`/api/employees/${employee.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update employee');
    return json.data;
  }
}

export async function deleteEmployeeApi(id: string): Promise<void> {
  const res = await fetch(`/api/employees/${id}`, {
    method: 'DELETE'
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to delete employee');
}

export async function fetchAttendanceApi(filters?: {
  employeeId?: string;
  viewMode?: 'daily' | 'weekly';
  date?: string;
  search?: string;
  department?: string;
}): Promise<any[]> {
  const params = new URLSearchParams();
  if (filters?.employeeId) params.set('employeeId', filters.employeeId);
  if (filters?.viewMode) params.set('viewMode', filters.viewMode);
  if (filters?.date) params.set('date', filters.date);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.department) params.set('department', filters.department);

  const res = await fetch(`/api/attendance?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch attendance');
  return json.data;
}

export async function checkInApi(
  employeeId: string, 
  location?: string, 
  device?: string
): Promise<{ success: boolean; message: string; data?: AttendanceRecord; employee?: Employee }> {
  const res = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-role': 'employee',
      'x-employee-id': employeeId
    },
    body: JSON.stringify({ action: 'check-in', employeeId, location, device })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to clock in');
  return json;
}

export async function checkOutApi(
  employeeId: string
): Promise<{ success: boolean; message: string; data?: AttendanceRecord; employee?: Employee }> {
  const res = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-role': 'employee',
      'x-employee-id': employeeId
    },
    body: JSON.stringify({ action: 'check-out', employeeId })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to clock out');
  return json;
}

export async function logAttendanceApi(record: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
  const res = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to log attendance');
  return json.data;
}

export async function fetchLeavesApi(filters?: {
  employeeId?: string;
  status?: string;
  category?: string;
}): Promise<any[]> {
  const params = new URLSearchParams();
  if (filters?.employeeId) params.set('employeeId', filters.employeeId);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.category) params.set('category', filters.category);

  const res = await fetch(`/api/leaves?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch leaves');
  return json.data;
}

export async function createLeaveApi(data: {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}): Promise<{ success: boolean; message: string; data?: LeaveRequest }> {
  const res = await fetch('/api/leaves', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-user-role': 'employee',
      'x-employee-id': data.employeeId
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to submit leave request');
  return json;
}

export async function approveLeaveApi(id: string, adminRemarks?: string): Promise<any> {
  const res = await fetch(`/api/leaves/${id}/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminRemarks })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to approve leave request');
  return json.data;
}

export async function rejectLeaveApi(id: string, adminRemarks?: string): Promise<any> {
  const res = await fetch(`/api/leaves/${id}/reject`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminRemarks })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to reject leave request');
  return json.data;
}

export async function updateLeaveStatusApi(
  id: string, 
  status: 'Approved' | 'Rejected', 
  adminRemarks?: string
): Promise<LeaveRequest> {
  if (status === 'Approved') {
    return approveLeaveApi(id, adminRemarks);
  } else {
    return rejectLeaveApi(id, adminRemarks);
  }
}

export async function fetchMetricsApi(): Promise<{
  metrics: HRMetrics;
  departmentStats: DepartmentStat[];
}> {
  const res = await fetch('/api/metrics');
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch metrics');
  return json.data;
}

export async function fetchAttendanceReportApi(
  filters?: {
    employeeId?: string;
    dateFrom?: string;
    dateTo?: string;
    department?: string;
    viewMode?: 'daily' | 'weekly';
    search?: string;
  },
  role?: 'admin' | 'employee',
  authEmployeeId?: string
): Promise<{
  success: boolean;
  summary: {
    total: number;
    present: number;
    absent: number;
    halfDay: number;
    leave: number;
    attendanceRate: number;
  };
  count: number;
  data: any[];
}> {
  const params = new URLSearchParams();
  if (filters?.employeeId) params.set('employeeId', filters.employeeId);
  if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.set('dateTo', filters.dateTo);
  if (filters?.department) params.set('department', filters.department);
  if (filters?.viewMode) params.set('viewMode', filters.viewMode);
  if (filters?.search) params.set('search', filters.search);

  const headers: Record<string, string> = {};
  if (role) headers['x-user-role'] = role;
  if (authEmployeeId) headers['x-employee-id'] = authEmployeeId;

  const res = await fetch(`/api/reports/attendance?${params.toString()}`, { headers });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch attendance report');
  return json;
}

export async function fetchPayrollReportApi(
  filters?: {
    employeeId?: string;
    department?: string;
    search?: string;
  },
  role?: 'admin' | 'employee',
  authEmployeeId?: string
): Promise<{
  success: boolean;
  summary: any;
  count: number;
  data: any[];
}> {
  const params = new URLSearchParams();
  if (filters?.employeeId) params.set('employeeId', filters.employeeId);
  if (filters?.department) params.set('department', filters.department);
  if (filters?.search) params.set('search', filters.search);

  const headers: Record<string, string> = {};
  if (role) headers['x-user-role'] = role;
  if (authEmployeeId) headers['x-employee-id'] = authEmployeeId;

  const res = await fetch(`/api/reports/payroll?${params.toString()}`, { headers });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch payroll report');
  return json;
}

