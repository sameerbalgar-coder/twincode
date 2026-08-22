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
import { AttendanceRecordItem, AdminLeaveItem, StatusIndicatorType } from '../types/admin-attendance-leave';

interface DatabaseSchema {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'hrms_store.json');

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
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading/initializing HRMS database:', error);
    return {
      employees: mockEmployees,
      attendanceRecords: mockAttendanceRecords,
      leaveRequests: mockLeaveRequests,
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
  return db.employees.find(e => e.id === id) || null;
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
  const index = db.employees.findIndex(e => e.id === id);
  if (index === -1) return null;

  db.employees[index] = {
    ...db.employees[index],
    ...updates,
    id // Ensure ID remains immutable
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
// ATTENDANCE RECORDS (Daily & Weekly Views, Check-In / Check-Out)
// ============================================================================

export async function checkInAttendance(
  employeeId: string, 
  location?: string, 
  device?: string
): Promise<{ success: boolean; message: string; record?: AttendanceRecord; employee?: Employee }> {
  const db = ensureDatabase();
  const employee = db.employees.find(e => e.id === employeeId);

  if (!employee) {
    return { success: false, message: `Employee with ID ${employeeId} not found.` };
  }

  // Check if employee is on leave
  if (employee.status === 'On Leave') {
    return { success: false, message: 'You are currently on Approved Leave. Clock-in is disabled.' };
  }

  const todayStr = 'Today, Aug 22';
  const existingLogIndex = db.attendanceRecords.findIndex(
    a => a.employeeId === employeeId && (a.date === todayStr || a.date === new Date().toISOString().split('T')[0])
  );

  const existingLog = existingLogIndex !== -1 ? db.attendanceRecords[existingLogIndex] : null;

  // Prevent duplicate check-in
  if (existingLog && existingLog.checkInTime && existingLog.checkInTime !== '--') {
    if (existingLog.checkOutTime && existingLog.checkOutTime !== '--') {
      return { 
        success: false, 
        message: `Shift already completed for today (Checked out at ${existingLog.checkOutTime}). Duplicate check-in is not permitted.` 
      };
    }
    return { 
      success: false, 
      message: `Already checked in today at ${existingLog.checkInTime}. Please clock out first before starting a new shift.` 
    };
  }

  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const newRecord: AttendanceRecord = {
    id: existingLog?.id || `ATT-${Date.now().toString().slice(-6)}`,
    employeeId: employee.id,
    employeeName: employee.name,
    employeeAvatar: employee.avatar,
    department: employee.department,
    date: todayStr,
    checkInTime: timeStr,
    checkOutTime: '--',
    workHours: 'Active Shift',
    status: employee.status === 'Remote' ? 'Remote' : 'Present',
    ipLocation: location || `${employee.location.split('(')[0].trim()} (192.168.1.50)`,
    device: device || 'Workstation'
  };

  if (existingLogIndex !== -1) {
    db.attendanceRecords[existingLogIndex] = newRecord;
  } else {
    db.attendanceRecords.unshift(newRecord);
  }

  // Update employee state
  employee.attendanceToday = {
    checkIn: timeStr,
    checkOut: undefined,
    status: 'Present'
  };

  // Add activity log
  employee.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'attendance',
      title: 'Biometric Clock-In Recorded',
      description: `Clocked in at ${timeStr} (${newRecord.ipLocation})`,
      timestamp: 'Just now',
      status: 'success'
    },
    ...(employee.activities || [])
  ];

  saveDatabase(db);
  return { success: true, message: `Checked in successfully at ${timeStr}! Status: Present`, record: newRecord, employee };
}

export async function checkOutAttendance(
  employeeId: string
): Promise<{ success: boolean; message: string; record?: AttendanceRecord; employee?: Employee }> {
  const db = ensureDatabase();
  const employee = db.employees.find(e => e.id === employeeId);

  if (!employee) {
    return { success: false, message: `Employee with ID ${employeeId} not found.` };
  }

  const todayStr = 'Today, Aug 22';
  const existingLogIndex = db.attendanceRecords.findIndex(
    a => a.employeeId === employeeId && (a.date === todayStr || a.date === new Date().toISOString().split('T')[0])
  );

  const existingLog = existingLogIndex !== -1 ? db.attendanceRecords[existingLogIndex] : null;

  // Prevent invalid check-out
  if (!existingLog || !existingLog.checkInTime || existingLog.checkInTime === '--') {
    return { success: false, message: 'Cannot clock out: No active check-in record found for today.' };
  }

  if (existingLog.checkOutTime && existingLog.checkOutTime !== '--') {
    return { success: false, message: `Already clocked out at ${existingLog.checkOutTime}. Duplicate clock-out is not permitted.` };
  }

  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  // Calculate approximate duration
  let hoursLogged = '8h 05m';
  let isHalfDay = false;

  try {
    const [inHourStr, inMinRest] = existingLog.checkInTime.split(':');
    const inMin = parseInt(inMinRest.split(' ')[0], 10);
    let inHour = parseInt(inHourStr, 10);
    if (existingLog.checkInTime.includes('PM') && inHour < 12) inHour += 12;
    if (existingLog.checkInTime.includes('AM') && inHour === 12) inHour = 0;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    const diffMinutes = Math.max(10, (currentHour * 60 + currentMin) - (inHour * 60 + inMin));
    const h = Math.floor(diffMinutes / 60);
    const m = diffMinutes % 60;
    hoursLogged = `${h}h ${m < 10 ? '0' + m : m}m`;
    if (h < 4) isHalfDay = true;
  } catch {
    hoursLogged = '7h 45m';
  }

  const finalStatus: AttendanceRecord['status'] = isHalfDay ? 'Half-day' : 'Present';

  existingLog.checkOutTime = timeStr;
  existingLog.workHours = hoursLogged;
  existingLog.status = finalStatus;

  employee.attendanceToday = {
    checkIn: existingLog.checkInTime,
    checkOut: timeStr,
    status: finalStatus
  };

  employee.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'attendance',
      title: 'Biometric Clock-Out Recorded',
      description: `Clocked out at ${timeStr} • Total duration: ${hoursLogged} (Status: ${finalStatus})`,
      timestamp: 'Just now',
      status: 'info'
    },
    ...(employee.activities || [])
  ];

  saveDatabase(db);
  return { 
    success: true, 
    message: `Checked out successfully at ${timeStr}. Total time logged: ${hoursLogged}.`, 
    record: existingLog, 
    employee 
  };
}

export async function getAttendanceRecords(filter?: {
  employeeId?: string;
  viewMode?: 'daily' | 'weekly';
  date?: string;
  search?: string;
  department?: string;
}): Promise<AttendanceRecordItem[]> {
  const db = ensureDatabase();
  const employees = db.employees;

  // If querying weekly history for a single employee
  if (filter?.employeeId && filter.employeeId !== 'all' && filter.viewMode === 'weekly') {
    const emp = employees.find(e => e.id === filter.employeeId);
    if (!emp) return [];

    const existingLog = db.attendanceRecords.find(a => a.employeeId === emp.id);
    const isOnLeave = emp.status === 'On Leave';

    // Generate weekly historical day logs
    const weekDays = [
      { day: 'Today, Aug 22', in: existingLog?.checkInTime || emp.attendanceToday?.checkIn || '08:52 AM', out: existingLog?.checkOutTime || emp.attendanceToday?.checkOut || '--', hrs: existingLog?.workHours || '3h 10m', status: isOnLeave ? 'Approved Leave' : (existingLog?.status as any || 'Present'), indicator: (isOnLeave ? 'airplane' : 'green') as StatusIndicatorType },
      { day: 'Friday, Aug 21', in: '08:48 AM', out: '05:32 PM', hrs: '8h 44m', status: 'Present' as const, indicator: 'green' as const },
      { day: 'Thursday, Aug 20', in: '08:55 AM', out: '05:15 PM', hrs: '8h 20m', status: 'Present' as const, indicator: 'green' as const },
      { day: 'Wednesday, Aug 19', in: '09:30 AM', out: '01:30 PM', hrs: '4h 00m', status: 'Half-Day' as const, indicator: 'half-day' as const },
      { day: 'Tuesday, Aug 18', in: '--', out: '--', hrs: '0h 00m', status: 'Approved Leave' as const, indicator: 'airplane' as const },
      { day: 'Monday, Aug 17', in: '08:50 AM', out: '05:25 PM', hrs: '8h 35m', status: 'Present' as const, indicator: 'green' as const },
      { day: 'Friday, Aug 14', in: '--', out: '--', hrs: '0h 00m', status: 'Absent' as const, indicator: 'yellow' as const }
    ];

    return weekDays.map((wd, i) => ({
      id: `HIST-${emp.id}-${i}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar,
      department: emp.department,
      date: wd.day,
      checkIn: wd.in,
      checkOut: wd.out,
      workHours: wd.hrs,
      extraHours: wd.status === 'Present' ? '+20m' : '0m',
      status: wd.status,
      statusIndicator: wd.indicator,
      ipLocation: `${emp.location.split('(')[0].trim()} (192.168.1.50)`,
      device: 'Workstation'
    }));
  }

  // Build comprehensive attendance items across all employees
  let records: AttendanceRecordItem[] = employees.map(emp => {
    const existingLog = db.attendanceRecords.find(a => a.employeeId === emp.id);
    const isOnLeave = emp.status === 'On Leave';
    
    // Determine check-in, check-out, and status
    let checkIn = existingLog?.checkInTime || (emp.attendanceToday?.checkIn || '--');
    let checkOut = existingLog?.checkOutTime || (emp.attendanceToday?.checkOut || '--');
    let workHours = existingLog?.workHours || '8h 00m';
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
    } else if (existingLog?.status === 'Half-day' || existingLog?.status === 'Half-Day' || emp.attendanceToday?.status === 'Half-Day' || emp.attendanceToday?.status === 'Half-day') {
      status = 'Half-Day';
      statusIndicator = 'half-day';
      workHours = existingLog?.workHours || '4h 00m';
      extraHours = '0h';
    } else if (emp.attendanceToday?.status === 'Late' || existingLog?.status === 'Late') {
      status = 'Late';
      statusIndicator = 'yellow';
      workHours = '7h 15m';
      extraHours = '0h';
    } else if (emp.status === 'Remote') {
      status = 'Remote';
      statusIndicator = 'green';
      workHours = existingLog?.workHours || '8h 15m';
      extraHours = '+15m';
    } else if (!existingLog && (!emp.attendanceToday?.checkIn || emp.attendanceToday?.checkIn === '--' || emp.attendanceToday?.status === 'Absent')) {
      status = 'Absent';
      statusIndicator = 'yellow';
      checkIn = '--';
      checkOut = '--';
      workHours = '0h';
      extraHours = '0h';
    } else {
      status = 'Present';
      statusIndicator = 'green';
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
    status: record.status || 'Present',
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
    else if (req.leaveType.includes('Unpaid')) leaveTypeMapped = 'Unpaid Leave';
    else if (req.leaveType.includes('Emergency')) leaveTypeMapped = 'Emergency Leave';
    else if (req.leaveType.includes('Casual')) leaveTypeMapped = 'Casual Leave';
    else if (req.leaveType.includes('Paid')) leaveTypeMapped = 'Paid Time Off';

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
      list = list.filter(l => {
        if (category === 'Paid Time Off' || category === 'Paid Leave') {
          return l.leaveType === 'Paid Time Off' || l.leaveType === 'Casual Leave';
        }
        return l.leaveType === category;
      });
    }
    if (employeeId && employeeId !== 'all') {
      list = list.filter(l => l.employeeId === employeeId);
    }
  }

  return list;
}

export async function createLeaveRequest(data: Partial<LeaveRequest>): Promise<{ success: boolean; message: string; data?: LeaveRequest }> {
  const db = ensureDatabase();
  const employee = db.employees.find(e => e.id === data.employeeId);

  if (!employee) {
    return { success: false, message: `Employee with ID ${data.employeeId} not found.` };
  }

  if (!data.startDate || !data.endDate || !data.reason) {
    return { success: false, message: 'Start date, end date, and remarks/reason are required.' };
  }

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { success: false, message: 'Invalid date format provided.' };
  }

  if (start.getTime() > end.getTime()) {
    return { success: false, message: 'Start date cannot be later than end date.' };
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Check for duplicate / overlapping leave requests
  const existingOverlap = db.leaveRequests.find(l => {
    if (l.employeeId !== employee.id || l.status === 'Rejected') return false;
    const lStart = new Date(l.startDate);
    const lEnd = new Date(l.endDate);
    return (start <= lEnd && end >= lStart);
  });

  if (existingOverlap) {
    return { 
      success: false, 
      message: `You already have a ${existingOverlap.status} leave request (${existingOverlap.id}) overlapping this date range (${existingOverlap.startDate} to ${existingOverlap.endDate}).` 
    };
  }

  const newRequest: LeaveRequest = {
    id: data.id || `LV-${Math.floor(500 + Math.random() * 500)}`,
    employeeId: employee.id,
    employeeName: employee.name,
    employeeAvatar: employee.avatar,
    department: employee.department,
    role: employee.role,
    leaveType: data.leaveType || 'Paid Leave',
    startDate: data.startDate,
    endDate: data.endDate,
    daysCount: data.daysCount || calculatedDays,
    reason: data.reason,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    conflictWarning: data.conflictWarning,
    adminRemarks: undefined
  };

  db.leaveRequests.unshift(newRequest);

  // Add activity log to employee
  employee.activities = [
    {
      id: `ACT-${Date.now()}`,
      type: 'leave',
      title: `${newRequest.leaveType} Submitted`,
      description: `${newRequest.daysCount} day(s) from ${newRequest.startDate} to ${newRequest.endDate} (Status: Pending HR Review)`,
      timestamp: 'Just now',
      status: 'info'
    },
    ...(employee.activities || [])
  ];

  saveDatabase(db);
  return { success: true, message: 'Leave application submitted successfully for HR review.', data: newRequest };
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
      checkIn: '--',
      checkOut: '--',
      status: 'Leave'
    };

    // Deduct leave balance for Paid / Sick
    if (req.leaveType.includes('Sick') && emp.leaveBalance?.sick) {
      emp.leaveBalance.sick.used = Math.min(emp.leaveBalance.sick.total, emp.leaveBalance.sick.used + req.daysCount);
    } else if (!req.leaveType.includes('Unpaid') && emp.leaveBalance?.paid) {
      emp.leaveBalance.paid.used = Math.min(emp.leaveBalance.paid.total, emp.leaveBalance.paid.used + req.daysCount);
    }

    // Sync with attendance records: Update today or create leave log
    const todayLogIndex = db.attendanceRecords.findIndex(a => a.employeeId === emp.id);
    if (todayLogIndex !== -1) {
      db.attendanceRecords[todayLogIndex].status = 'Approved Leave';
      db.attendanceRecords[todayLogIndex].checkInTime = '--';
      db.attendanceRecords[todayLogIndex].checkOutTime = '--';
      db.attendanceRecords[todayLogIndex].workHours = '0h (On Leave)';
    } else {
      db.attendanceRecords.unshift({
        id: `ATT-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeAvatar: emp.avatar,
        department: emp.department,
        date: 'Today, Aug 22',
        checkInTime: '--',
        checkOutTime: '--',
        workHours: '0h (On Leave)',
        status: 'Approved Leave',
        ipLocation: emp.location,
        device: 'Leave Recorded'
      });
    }

    // Add activity record
    emp.activities = [
      {
        id: `ACT-${Date.now()}`,
        type: 'leave',
        title: `Leave Application Approved`,
        description: `${req.leaveType} (${req.daysCount}d) approved by HR.${adminRemarks ? ` Remarks: "${adminRemarks}"` : ''}`,
        timestamp: 'Just now',
        status: 'success'
      },
      ...(emp.activities || [])
    ];
  }

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

  const empIndex = db.employees.findIndex(e => e.id === req.employeeId);
  if (empIndex !== -1) {
    const emp = db.employees[empIndex];
    emp.activities = [
      {
        id: `ACT-${Date.now()}`,
        type: 'leave',
        title: `Leave Application Rejected`,
        description: `${req.leaveType} (${req.daysCount}d) rejected by HR.${adminRemarks ? ` Remarks: "${adminRemarks}"` : ''}`,
        timestamp: 'Just now',
        status: 'warning'
      },
      ...(emp.activities || [])
    ];
  }

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
