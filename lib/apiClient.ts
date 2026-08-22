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

export async function fetchAttendanceApi(employeeId?: string): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams();
  if (employeeId) params.set('employeeId', employeeId);

  const res = await fetch(`/api/attendance?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch attendance');
  return json.data;
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

export async function fetchLeavesApi(status?: string): Promise<LeaveRequest[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);

  const res = await fetch(`/api/leaves?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch leaves');
  return json.data;
}

export async function updateLeaveStatusApi(
  id: string, 
  status: 'Approved' | 'Rejected', 
  adminRemarks?: string
): Promise<LeaveRequest> {
  const res = await fetch(`/api/leaves/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, adminRemarks })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to update leave status');
  return json.data;
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

