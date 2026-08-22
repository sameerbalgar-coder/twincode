import fs from 'fs';
import path from 'path';
import { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  DepartmentStat, 
  HRMetrics, 
  Department 
} from '../types/hrms';
import { 
  mockEmployees, 
  mockAttendanceRecords, 
  mockLeaveRequests, 
  mockDepartmentStats, 
  mockHRMetrics 
} from '../data/mockHrmsData';
import { AttendanceRecordItem, AdminLeaveItem } from '../types/admin-attendance-leave';
import { AppNotification } from '../types/notification';

interface DatabaseSchema {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  notifications: AppNotification[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'hrms_store.json');

const initialNotifications: AppNotification[] = [
  {
    id: 'NOTIF-101',
    employeeId: 'EMP-1001',
    recipientRole: 'EMPLOYEE',
    title: 'Leave Request Approved',
    message: 'Your Paid Annual Leave application (Aug 25 - Aug 28) has been approved by HR Operations.',
    type: 'leave_approved',
    isRead: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    link: '/employee/dashboard'
  },
  {
    id: 'NOTIF-102',
    employeeId: 'EMP-1001',
    recipientRole: 'EMPLOYEE',
    title: 'August 2026 Salary Slip Ready',
    message: 'Your monthly salary breakdown and direct deposit payslip is available for review.',
    type: 'payroll_update',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    link: '/employee/dashboard'
  },
  {
    id: 'NOTIF-103',
    employeeId: 'EMP-1001',
    recipientRole: 'EMPLOYEE',
    title: 'Attendance Check-in Recorded',
    message: 'Your biometric check-in at 09:02 AM has been marked On-Time.',
    type: 'attendance_alert',
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    link: '/employee/dashboard'
  },
  {
    id: 'NOTIF-201',
    employeeId: 'ALL_ADMINS',
    recipientRole: 'ADMIN',
    title: 'New Leave Request Received',
    message: 'Marcus Brody applied for 3 days of Casual Leave (Aug 24 - Aug 26).',
    type: 'leave_applied',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    link: '/admin/leaves'
  },
  {
    id: 'NOTIF-202',
    employeeId: 'ALL_ADMINS',
    recipientRole: 'ADMIN',
    title: 'Attendance Punctuality SLA Met',
    message: 'Today 94.6% attendance rate achieved across 140 active employees.',
    type: 'attendance_alert',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    link: '/admin/attendance'
  }
];

// Ensure directory and db file exist
function ensureDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseSchema = {
        employees: mockEmployees,
        attendanceRecords: mockAttendanceRecords,
        leaveRequests: mockLeaveRequests,
        notifications: initialNotifications,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content) as DatabaseSchema;
    if (!parsed.notifications || !Array.isArray(parsed.notifications)) {
      parsed.notifications = initialNotifications;
      saveDatabase(parsed);
    }
    return parsed;
  } catch (error) {
    console.error('Error reading/initializing HRMS database:', error);
    return {
      employees: mockEmployees,
      attendanceRecords: mockAttendanceRecords,
      leaveRequests: mockLeaveRequests,
      notifications: initialNotifications,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Write to database
function saveDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to HRMS database:', error);
  }
}

// ============================================================================
// EMPLOYEES CRUD
// ============================================================================

export async function getEmployees(filter?: {
  search?: string;
  department?: string;
  status?: string;
  employmentType?: string;
}): Promise<Employee[]> {
  const db = ensureDatabase();
  let result = db.employees;

  if (filter) {
    const { search, department, status, employmentType } = filter;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(s) ||
        e.email.toLowerCase().includes(s) ||
        e.role.toLowerCase().includes(s) ||
        e.id.toLowerCase().includes(s) ||
        e.department.toLowerCase().includes(s)
      );
    }
    if (department && department !== 'All') {
      result = result.filter(e => e.department === department);
    }
    if (status && status !== 'All') {
      result = result.filter(e => e.status === status);
    }
    if (employmentType && employmentType !== 'All') {
      result = result.filter(e => e.employmentType === employmentType);
    }
  }

  return result;
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const db = ensureDatabase();
  const cleanId = id.trim().toLowerCase();
  return db.employees.find(e => 
    e.id.toLowerCase() === cleanId || 
    (e.email && e.email.toLowerCase() === cleanId)
  ) || null;
}

export async function createEmployee(data: Partial<Employee>): Promise<Employee> {
  const db = ensureDatabase();
  const newId = data.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newEmployee: Employee = {
    id: newId,
    name: data.name || 'New Employee',
    email: data.email || `${newId.toLowerCase()}@dayflow.io`,
    avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: data.role || 'Associate',
    department: data.department || 'Engineering',
    employmentType: data.employmentType || 'Full-time',
    status: data.status || 'Active',
    joinDate: data.joinDate || new Date().toISOString().split('T')[0],
    salary: data.salary || '$120,000',
    phone: data.phone || '+1 (555) 000-0000',
    location: data.location || 'San Francisco, CA (HQ)',
    leaveBalance: data.leaveBalance || {
      casual: { total: 12, used: 0 },
      sick: { total: 10, used: 0 },
      paid: { total: 20, used: 0 },
      emergency: { total: 5, used: 0 }
    },
    attendanceToday: data.attendanceToday || {
      status: 'Absent'
    },
    directReportsCount: data.directReportsCount || 0,
    managerName: data.managerName || 'Alex Rivera',
    skills: data.skills || ['General'],
    personalData: data.personalData,
    salaryStructure: data.salaryStructure,
    documents: data.documents || []
  };

  db.employees.unshift(newEmployee);
  saveDatabase(db);
  return newEmployee;
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
  const db = ensureDatabase();
  const cleanId = id.trim().toLowerCase();
  const index = db.employees.findIndex(e => 
    e.id.toLowerCase() === cleanId || 
    (e.email && e.email.toLowerCase() === cleanId)
  );
  if (index === -1) return null;

  db.employees[index] = {
    ...db.employees[index],
    ...updates,
    id: db.employees[index].id // Ensure ID remains immutable
  };

  saveDatabase(db);
  return db.employees[index];
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const initialCount = db.employees.length;
  db.employees = db.employees.filter(e => e.id !== id);
  if (db.employees.length !== initialCount) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ============================================================================
// ATTENDANCE RECORDS (Daily & Weekly Views)
// ============================================================================

export async function getAttendanceRecords(filter?: {
  employeeId?: string;
  viewMode?: 'daily' | 'weekly';
  date?: string;
  search?: string;
  department?: string;
}): Promise<AttendanceRecordItem[]> {
  const db = ensureDatabase();
  const employees = db.employees;

  // Build comprehensive attendance items across all employees
  let records: AttendanceRecordItem[] = employees.map(emp => {
    const existingLog = db.attendanceRecords.find(a => a.employeeId === emp.id);
    const isOnLeave = emp.status === 'On Leave';
    
    // Determine check-in, check-out, and status
    let checkIn = existingLog?.checkInTime || (emp.attendanceToday?.checkIn || '--');
    let checkOut = existingLog?.checkOutTime || '--';
    let workHours = '8h 00m';
    let extraHours = '+0m';
    let status: AttendanceRecordItem['status'] = 'Present';
    let statusIndicator: AttendanceRecordItem['statusIndicator'] = 'green';

    if (isOnLeave) {
      status = 'Approved Leave';
      statusIndicator = 'airplane';
      checkIn = '--';
      checkOut = '--';
      workHours = '0h';
      extraHours = '0h';
    } else if (emp.attendanceToday?.status === 'Late' || existingLog?.status === 'Late') {
      status = 'Late';
      statusIndicator = 'yellow';
      workHours = '7h 15m';
      extraHours = '0h';
      checkOut = '05:30 PM';
    } else if (emp.status === 'Remote') {
      status = 'Remote';
      statusIndicator = 'green';
      workHours = '8h 15m';
      extraHours = '+15m';
      checkOut = '05:15 PM';
    } else if (!existingLog && !emp.attendanceToday?.checkIn) {
      status = 'Absent';
      statusIndicator = 'yellow';
      checkIn = '--';
      checkOut = '--';
      workHours = '0h';
      extraHours = '0h';
    } else {
      status = 'Present';
      statusIndicator = 'green';
      checkOut = '05:30 PM';
      extraHours = '+30m';
    }

    return {
      id: existingLog?.id || `ATT-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
      department: emp.department,
      date: existingLog?.date || 'Today, Aug 22',
      checkIn,
      checkOut,
      workHours,
      extraHours,
      status,
      statusIndicator,
      ipLocation: existingLog?.ipLocation || `${emp.location.split('(')[0].trim()} (192.168.1.20)`,
      device: existingLog?.device || 'Workstation'
    };
  });

  if (filter) {
    const { employeeId, search, department } = filter;
    if (employeeId && employeeId !== 'all') {
      records = records.filter(r => r.employeeId === employeeId);
    }
    if (department && department !== 'All') {
      records = records.filter(r => r.department === department);
    }
    if (search) {
      const s = search.toLowerCase();
      records = records.filter(r => 
        r.employeeName.toLowerCase().includes(s) ||
        r.employeeId.toLowerCase().includes(s) ||
        r.department.toLowerCase().includes(s)
      );
    }
  }

  return records;
}

export async function logAttendance(record: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
  const db = ensureDatabase();
  const employee = db.employees.find(e => e.id === record.employeeId);

  const newRecord: AttendanceRecord = {
    id: record.id || `ATT-${Math.floor(200 + Math.random() * 800)}`,
    employeeId: record.employeeId || 'EMP-1001',
    employeeName: record.employeeName || employee?.name || 'Staff Member',
    employeeAvatar: record.employeeAvatar || employee?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: record.department || employee?.department || 'Engineering',
    date: record.date || 'Today, Aug 22',
    checkInTime: record.checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    checkOutTime: record.checkOutTime || '--',
    workHours: record.workHours || 'Active',
    status: record.status || 'On-Time',
    ipLocation: record.ipLocation || 'SF HQ Office (192.168.1.50)',
    device: record.device || 'Workstation'
  };

  db.attendanceRecords.unshift(newRecord);
  saveDatabase(db);
  return newRecord;
}

// ============================================================================
// LEAVE REQUESTS & APPROVAL ENGINE
// ============================================================================

export async function getLeaveRequests(filter?: {
  status?: string;
  category?: string;
  employeeId?: string;
}): Promise<AdminLeaveItem[]> {
  const db = ensureDatabase();
  let list = db.leaveRequests.map(req => {
    let leaveTypeMapped: AdminLeaveItem['leaveType'] = 'Paid Time Off';
    if (req.leaveType.includes('Sick')) leaveTypeMapped = 'Sick Leave';
    else if (req.leaveType.includes('Casual')) leaveTypeMapped = 'Paid Time Off';
    else if (req.leaveType.includes('Emergency')) leaveTypeMapped = 'Emergency Leave';
    else if (req.leaveType.includes('Unpaid')) leaveTypeMapped = 'Unpaid Leave';

    return {
      id: req.id,
      employeeId: req.employeeId,
      employeeName: req.employeeName,
      employeeAvatar: req.employeeAvatar,
      department: req.department,
      role: req.role,
      leaveType: leaveTypeMapped,
      validityFrom: req.startDate,
      validityTo: req.endDate,
      allocationDays: req.daysCount,
      remarks: req.reason,
      attachmentUrl: '/documents/medical_cert_sample.pdf',
      attachmentName: req.leaveType.includes('Sick') ? 'Doctor_Medical_Certificate.pdf' : 'Travel_Itinerary_Confirmation.pdf',
      status: req.status,
      conflictWarning: req.conflictWarning,
      appliedDate: req.appliedDate,
      adminRemarks: req.adminRemarks
    };
  });

  if (filter) {
    const { status, category, employeeId } = filter;
    if (status && status !== 'All') {
      list = list.filter(l => l.status === status);
    }
    if (category && category !== 'All') {
      list = list.filter(l => l.leaveType === category);
    }
    if (employeeId && employeeId !== 'all') {
      list = list.filter(l => l.employeeId === employeeId);
    }
  }

  return list;
}

export async function createLeaveRequest(data: Partial<LeaveRequest>): Promise<LeaveRequest> {
  const db = ensureDatabase();
  const employee = db.employees.find(e => e.id === data.employeeId);

  const newRequest: LeaveRequest = {
    id: data.id || `LV-${Math.floor(500 + Math.random() * 500)}`,
    employeeId: data.employeeId || 'EMP-1001',
    employeeName: data.employeeName || employee?.name || 'Sarah Jenkins',
    employeeAvatar: data.employeeAvatar || employee?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: data.department || employee?.department || 'Engineering',
    role: data.role || employee?.role || 'Engineer',
    leaveType: data.leaveType || 'Paid Annual Leave',
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    endDate: data.endDate || new Date().toISOString().split('T')[0],
    daysCount: data.daysCount || 1,
    reason: data.reason || 'Personal time off',
    appliedDate: data.appliedDate || new Date().toISOString().split('T')[0],
    status: data.status || 'Pending',
    conflictWarning: data.conflictWarning,
    adminRemarks: data.adminRemarks
  };

  db.leaveRequests.unshift(newRequest);

  // Trigger notification for Admin/HR
  const notif: AppNotification = {
    id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    employeeId: 'ALL_ADMINS',
    recipientRole: 'ADMIN',
    title: 'New Leave Request Received',
    message: `${newRequest.employeeName} (${newRequest.department}) applied for ${newRequest.daysCount} day(s) of ${newRequest.leaveType} (${newRequest.startDate} to ${newRequest.endDate}).`,
    type: 'leave_applied',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/admin/leaves'
  };
  db.notifications.unshift(notif);

  saveDatabase(db);
  return newRequest;
}

export async function updateLeaveStatus(
  id: string, 
  status: 'Approved' | 'Rejected', 
  adminRemarks?: string
): Promise<LeaveRequest | null> {
  if (status === 'Approved') {
    const res = await approveLeaveRequest(id, adminRemarks);
    if (!res) return null;
    const db = ensureDatabase();
    return db.leaveRequests.find(l => l.id === id) || null;
  } else {
    const res = await rejectLeaveRequest(id, adminRemarks);
    if (!res) return null;
    const db = ensureDatabase();
    return db.leaveRequests.find(l => l.id === id) || null;
  }
}

export async function approveLeaveRequest(
  id: string, 
  adminRemarks?: string
): Promise<AdminLeaveItem | null> {
  const db = ensureDatabase();
  const index = db.leaveRequests.findIndex(l => l.id === id);
  if (index === -1) return null;

  const req = db.leaveRequests[index];
  req.status = 'Approved';
  if (adminRemarks) {
    req.adminRemarks = adminRemarks;
  }

  // Sync with employee's attendance & leave balance
  const empIndex = db.employees.findIndex(e => e.id === req.employeeId);
  if (empIndex !== -1) {
    const emp = db.employees[empIndex];
    emp.status = 'On Leave';
    emp.attendanceToday = {
      status: 'Absent'
    };

    // Deduct leave balance
    if (req.leaveType.includes('Sick') && emp.leaveBalance?.sick) {
      emp.leaveBalance.sick.used = Math.min(emp.leaveBalance.sick.total, emp.leaveBalance.sick.used + req.daysCount);
    } else if (emp.leaveBalance?.paid) {
      emp.leaveBalance.paid.used = Math.min(emp.leaveBalance.paid.total, emp.leaveBalance.paid.used + req.daysCount);
    }
  }

  // Trigger notification for employee
  const employeeNotif: AppNotification = {
    id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    employeeId: req.employeeId,
    recipientRole: 'EMPLOYEE',
    title: 'Leave Request Approved',
    message: `Your ${req.leaveType} application (${req.startDate} to ${req.endDate}) has been approved by HR Operations.${adminRemarks ? ` Remarks: "${adminRemarks}"` : ''}`,
    type: 'leave_approved',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/employee/dashboard'
  };
  db.notifications.unshift(employeeNotif);

  saveDatabase(db);
  
  return {
    id: req.id,
    employeeId: req.employeeId,
    employeeName: req.employeeName,
    employeeAvatar: req.employeeAvatar,
    department: req.department,
    role: req.role,
    leaveType: req.leaveType as any,
    validityFrom: req.startDate,
    validityTo: req.endDate,
    allocationDays: req.daysCount,
    remarks: req.reason,
    status: 'Approved',
    appliedDate: req.appliedDate,
    adminRemarks: req.adminRemarks
  };
}

export async function rejectLeaveRequest(
  id: string, 
  adminRemarks?: string
): Promise<AdminLeaveItem | null> {
  const db = ensureDatabase();
  const index = db.leaveRequests.findIndex(l => l.id === id);
  if (index === -1) return null;

  const req = db.leaveRequests[index];
  req.status = 'Rejected';
  if (adminRemarks) {
    req.adminRemarks = adminRemarks;
  }

  // Trigger notification for employee
  const employeeNotif: AppNotification = {
    id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    employeeId: req.employeeId,
    recipientRole: 'EMPLOYEE',
    title: 'Leave Request Rejected',
    message: `Your ${req.leaveType} application (${req.startDate} to ${req.endDate}) was rejected by HR Operations.${adminRemarks ? ` Reason: "${adminRemarks}"` : ''}`,
    type: 'leave_rejected',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/employee/dashboard'
  };
  db.notifications.unshift(employeeNotif);

  saveDatabase(db);
  
  return {
    id: req.id,
    employeeId: req.employeeId,
    employeeName: req.employeeName,
    employeeAvatar: req.employeeAvatar,
    department: req.department,
    role: req.role,
    leaveType: req.leaveType as any,
    validityFrom: req.startDate,
    validityTo: req.endDate,
    allocationDays: req.daysCount,
    remarks: req.reason,
    status: 'Rejected',
    appliedDate: req.appliedDate,
    adminRemarks: req.adminRemarks
  };
}

// ============================================================================
// NOTIFICATIONS API & STORE
// ============================================================================

export async function getNotifications(filter?: {
  employeeId?: string;
  userId?: string;
  role?: string;
}): Promise<AppNotification[]> {
  const db = ensureDatabase();
  let list = db.notifications || [];

  if (filter) {
    const { employeeId, userId, role } = filter;
    const cleanEmpId = employeeId?.trim().toLowerCase();
    const cleanUserId = userId?.trim().toLowerCase();
    const userRole = role?.toUpperCase();

    list = list.filter((n) => {
      if (n.employeeId === 'ALL' || n.recipientRole === 'ALL') return true;
      if ((userRole === 'ADMIN' || userRole === 'HR') && (n.employeeId === 'ALL_ADMINS' || n.recipientRole === 'ADMIN' || n.recipientRole === 'HR')) {
        return true;
      }
      if (cleanEmpId && n.employeeId && n.employeeId.toLowerCase() === cleanEmpId) {
        return true;
      }
      if (cleanUserId && n.userId && n.userId.toLowerCase() === cleanUserId) {
        return true;
      }
      return false;
    });
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createNotification(data: Omit<AppNotification, 'id' | 'createdAt'>): Promise<AppNotification> {
  const db = ensureDatabase();
  const newNotif: AppNotification = {
    ...data,
    id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString()
  };

  db.notifications.unshift(newNotif);
  saveDatabase(db);
  return newNotif;
}

export async function markNotificationAsRead(id: string, userIdentifier?: string): Promise<boolean> {
  const db = ensureDatabase();
  const notif = db.notifications.find((n) => n.id === id);
  if (!notif) return false;

  notif.isRead = true;
  saveDatabase(db);
  return true;
}

export async function markAllNotificationsAsRead(filter?: {
  employeeId?: string;
  userId?: string;
  role?: string;
}): Promise<number> {
  const db = ensureDatabase();
  let updatedCount = 0;

  if (filter) {
    const { employeeId, userId, role } = filter;
    const cleanEmpId = employeeId?.trim().toLowerCase();
    const cleanUserId = userId?.trim().toLowerCase();
    const userRole = role?.toUpperCase();

    db.notifications.forEach((n) => {
      let isRecipient = false;
      if (n.employeeId === 'ALL' || n.recipientRole === 'ALL') isRecipient = true;
      else if ((userRole === 'ADMIN' || userRole === 'HR') && (n.employeeId === 'ALL_ADMINS' || n.recipientRole === 'ADMIN' || n.recipientRole === 'HR')) isRecipient = true;
      else if (cleanEmpId && n.employeeId && n.employeeId.toLowerCase() === cleanEmpId) isRecipient = true;
      else if (cleanUserId && n.userId && n.userId.toLowerCase() === cleanUserId) isRecipient = true;

      if (isRecipient && !n.isRead) {
        n.isRead = true;
        updatedCount++;
      }
    });
  } else {
    db.notifications.forEach((n) => {
      if (!n.isRead) {
        n.isRead = true;
        updatedCount++;
      }
    });
  }

  saveDatabase(db);
  return updatedCount;
}

// ============================================================================
// DYNAMIC METRICS & SUMMARY
// ============================================================================

export async function getDynamicMetrics(): Promise<{
  metrics: HRMetrics;
  departmentStats: DepartmentStat[];
}> {
  const db = ensureDatabase();
  const employees = db.employees;
  const leaves = db.leaveRequests;
  const attendance = db.attendanceRecords;

  const totalEmployees = employees.length;
  const activeToday = employees.filter(e => e.status === 'Active' || e.status === 'Remote' || e.status === 'Probation').length;
  const remoteToday = employees.filter(e => e.status === 'Remote').length;
  const onLeaveToday = employees.filter(e => e.status === 'On Leave').length;
  const lateArrivalsToday = attendance.filter(a => a.status === 'Late').length;
  const pendingLeavesCount = leaves.filter(l => l.status === 'Pending').length;
  const attendanceRate = totalEmployees > 0 ? Number(((activeToday / totalEmployees) * 100).toFixed(1)) : 100;

  const departments: Department[] = [
    'Engineering',
    'Product',
    'UI/UX Design',
    'People Operations',
    'Sales & Marketing',
    'Finance',
    'Customer Success'
  ];

  const deptColors: Record<Department, string> = {
    'Engineering': 'bg-indigo-500',
    'Product': 'bg-blue-500',
    'UI/UX Design': 'bg-purple-500',
    'People Operations': 'bg-emerald-500',
    'Sales & Marketing': 'bg-amber-500',
    'Finance': 'bg-rose-500',
    'Customer Success': 'bg-teal-500'
  };

  const departmentStats: DepartmentStat[] = departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept);
    const presentCount = deptEmployees.filter(e => e.status !== 'On Leave').length;
    const leaveCount = deptEmployees.filter(e => e.status === 'On Leave').length;
    return {
      name: dept,
      totalEmployees: deptEmployees.length,
      presentToday: presentCount,
      onLeaveToday: leaveCount,
      color: deptColors[dept] || 'bg-slate-500'
    };
  });

  const metrics: HRMetrics = {
    totalEmployees,
    activeToday,
    remoteToday,
    onLeaveToday,
    lateArrivalsToday,
    pendingLeavesCount,
    attendanceRate,
    newHiresThisMonth: employees.filter(e => e.status === 'Probation').length || 4
  };

  return {
    metrics,
    departmentStats
  };
}
