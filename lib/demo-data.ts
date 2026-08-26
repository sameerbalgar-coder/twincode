import type {
  EmployeeProfile,
  AttendanceRecord,
  WeeklyAttendance,
  LeaveRequest,
  PayrollRecord,
  DashboardStats,
  ActivityItem,
} from "@/lib/types";

export const demoEmployee: EmployeeProfile = {
  id: "emp-001",
  employeeId: "EMP-001",
  userId: "user-001",
  firstName: "John",
  lastName: "Doe",
  email: "employee@dayflow.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Springfield, IL 62701",
  dateOfBirth: "1990-05-15",
  gender: "Male",
  maritalStatus: "Single",
  emergencyContact: "Jane Doe",
  emergencyPhone: "+1 (555) 987-6543",
  avatarUrl: undefined,
  personalDetails: {
    firstName: "John",
    lastName: "Doe",
    email: "employee@dayflow.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Springfield, IL 62701",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    maritalStatus: "Single",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543",
  },
  jobDetails: {
    department: "Engineering",
    position: "Software Engineer",
    employmentType: "Full-time",
    joinDate: "2023-01-15",
    managerId: "mgr-001",
    managerName: "Sarah Johnson",
    workLocation: "San Francisco Office",
    employeeGrade: "L3",
  },
  salaryStructure: {
    basicSalary: 80000,
    allowances: [
      { id: "allow-1", name: "Housing Allowance", amount: 12000, type: "fixed" },
      { id: "allow-2", name: "Transport Allowance", amount: 3600, type: "fixed" },
      { id: "allow-3", name: "Performance Bonus", amount: 10, type: "percentage" },
    ],
    deductions: [
      { id: "ded-1", name: "Income Tax", amount: 15, type: "percentage" },
      { id: "ded-2", name: "Health Insurance", amount: 2400, type: "fixed" },
      { id: "ded-3", name: "Retirement Contribution", amount: 5, type: "percentage" },
    ],
    grossSalary: 95600,
    netSalary: 76480,
    currency: "USD",
    payFrequency: "Monthly",
  },
  documents: [
    {
      id: "doc-1",
      name: "Employment Contract",
      type: "PDF",
      url: "/documents/contract.pdf",
      uploadedAt: "2023-01-10T10:00:00Z",
      status: "active",
    },
    {
      id: "doc-2",
      name: "ID Card",
      type: "Image",
      url: "/documents/id-card.jpg",
      uploadedAt: "2023-01-12T14:30:00Z",
      status: "active",
    },
    {
      id: "doc-3",
      name: "Tax Form W-4",
      type: "PDF",
      url: "/documents/w4.pdf",
      uploadedAt: "2023-01-15T09:00:00Z",
      status: "active",
    },
  ],
};

export const demoAttendance: AttendanceRecord[] = [
  { id: "att-1", employeeId: "emp-001", date: "2024-01-15", checkIn: "09:00", checkOut: "17:30", status: "present", hoursWorked: 8.5 },
  { id: "att-2", employeeId: "emp-001", date: "2024-01-16", checkIn: "09:15", checkOut: "17:45", status: "present", hoursWorked: 8.5 },
  { id: "att-3", employeeId: "emp-001", date: "2024-01-17", checkIn: "09:00", checkOut: "13:00", status: "half-day", hoursWorked: 4 },
  { id: "att-4", employeeId: "emp-001", date: "2024-01-18", checkIn: "09:00", checkOut: "17:30", status: "present", hoursWorked: 8.5 },
  { id: "att-5", employeeId: "emp-001", date: "2024-01-19", checkIn: "09:00", checkOut: "17:30", status: "present", hoursWorked: 8.5 },
  { id: "att-6", employeeId: "emp-001", date: "2024-01-22", checkIn: "09:00", checkOut: "17:30", status: "present", hoursWorked: 8.5 },
  { id: "att-7", employeeId: "emp-001", date: "2024-01-23", checkIn: "09:15", checkOut: "17:45", status: "present", hoursWorked: 8.5 },
  { id: "att-8", employeeId: "emp-001", date: "2024-01-24", status: "leave", hoursWorked: 0 },
  { id: "att-9", employeeId: "emp-001", date: "2024-01-25", status: "absent", hoursWorked: 0 },
  { id: "att-10", employeeId: "emp-001", date: "2024-01-26", checkIn: "09:00", checkOut: "17:30", status: "present", hoursWorked: 8.5 },
];

export const demoLeaveRequests: LeaveRequest[] = [
  {
    id: "leave-1",
    employeeId: "emp-001",
    leaveType: "paid",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    totalDays: 3,
    remarks: "Family vacation",
    status: "approved",
    adminComment: "Approved. Enjoy your vacation!",
    appliedAt: "2024-01-20T10:00:00Z",
    reviewedAt: "2024-01-21T14:30:00Z",
    reviewedBy: "Sarah Johnson",
  },
  {
    id: "leave-2",
    employeeId: "emp-001",
    leaveType: "sick",
    startDate: "2024-01-24",
    endDate: "2024-01-24",
    totalDays: 1,
    remarks: "Doctor appointment",
    status: "approved",
    adminComment: "Approved. Get well soon!",
    appliedAt: "2024-01-23T16:00:00Z",
    reviewedAt: "2024-01-23T16:30:00Z",
    reviewedBy: "Sarah Johnson",
  },
  {
    id: "leave-3",
    employeeId: "emp-001",
    leaveType: "unpaid",
    startDate: "2024-03-01",
    endDate: "2024-03-05",
    totalDays: 5,
    remarks: "Personal matters",
    status: "pending",
    appliedAt: "2024-01-25T09:00:00Z",
  },
  {
    id: "leave-4",
    employeeId: "emp-001",
    leaveType: "paid",
    startDate: "2023-12-20",
    endDate: "2023-12-22",
    totalDays: 3,
    remarks: "Holiday break",
    status: "rejected",
    adminComment: "Insufficient notice period. Please reschedule.",
    appliedAt: "2023-12-10T10:00:00Z",
    reviewedAt: "2023-12-11T11:00:00Z",
    reviewedBy: "Sarah Johnson",
  },
];

export const demoPayroll: PayrollRecord[] = [
  {
    id: "pay-1",
    employeeId: "emp-001",
    period: "January 2024",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    basicSalary: 80000 / 12,
    allowances: [
      { id: "allow-1", name: "Housing Allowance", amount: 12000 / 12, type: "fixed" },
      { id: "allow-2", name: "Transport Allowance", amount: 3600 / 12, type: "fixed" },
      { id: "allow-3", name: "Performance Bonus", amount: 10, type: "percentage" },
    ],
    deductions: [
      { id: "ded-1", name: "Income Tax", amount: 15, type: "percentage" },
      { id: "ded-2", name: "Health Insurance", amount: 2400 / 12, type: "fixed" },
      { id: "ded-3", name: "Retirement Contribution", amount: 5, type: "percentage" },
    ],
    grossSalary: 95600 / 12,
    netSalary: 76480 / 12,
    currency: "USD",
    status: "paid",
    generatedAt: "2024-02-01T10:00:00Z",
    paidAt: "2024-02-05T09:00:00Z",
  },
  {
    id: "pay-2",
    employeeId: "emp-001",
    period: "December 2023",
    periodStart: "2023-12-01",
    periodEnd: "2023-12-31",
    basicSalary: 80000 / 12,
    allowances: [
      { id: "allow-1", name: "Housing Allowance", amount: 12000 / 12, type: "fixed" },
      { id: "allow-2", name: "Transport Allowance", amount: 3600 / 12, type: "fixed" },
      { id: "allow-3", name: "Performance Bonus", amount: 10, type: "percentage" },
    ],
    deductions: [
      { id: "ded-1", name: "Income Tax", amount: 15, type: "percentage" },
      { id: "ded-2", name: "Health Insurance", amount: 2400 / 12, type: "fixed" },
      { id: "ded-3", name: "Retirement Contribution", amount: 5, type: "percentage" },
    ],
    grossSalary: 95600 / 12,
    netSalary: 76480 / 12,
    currency: "USD",
    status: "paid",
    generatedAt: "2024-01-01T10:00:00Z",
    paidAt: "2024-01-05T09:00:00Z",
  },
  {
    id: "pay-3",
    employeeId: "emp-001",
    period: "November 2023",
    periodStart: "2023-11-01",
    periodEnd: "2023-11-30",
    basicSalary: 80000 / 12,
    allowances: [
      { id: "allow-1", name: "Housing Allowance", amount: 12000 / 12, type: "fixed" },
      { id: "allow-2", name: "Transport Allowance", amount: 3600 / 12, type: "fixed" },
      { id: "allow-3", name: "Performance Bonus", amount: 10, type: "percentage" },
    ],
    deductions: [
      { id: "ded-1", name: "Income Tax", amount: 15, type: "percentage" },
      { id: "ded-2", name: "Health Insurance", amount: 2400 / 12, type: "fixed" },
      { id: "ded-3", name: "Retirement Contribution", amount: 5, type: "percentage" },
    ],
    grossSalary: 95600 / 12,
    netSalary: 76480 / 12,
    currency: "USD",
    status: "paid",
    generatedAt: "2023-12-01T10:00:00Z",
    paidAt: "2023-12-05T09:00:00Z",
  },
];

export const demoActivities: ActivityItem[] = [
  {
    id: "act-1",
    type: "attendance_checkin",
    description: "Checked in for the day",
    timestamp: "2024-01-26T09:00:00Z",
  },
  {
    id: "act-2",
    type: "attendance_checkout",
    description: "Checked out for the day",
    timestamp: "2024-01-26T17:30:00Z",
  },
  {
    id: "act-3",
    type: "leave_submitted",
    description: "Leave request submitted",
    timestamp: "2024-01-25T09:00:00Z",
    metadata: { leaveType: "unpaid", startDate: "2024-03-01", endDate: "2024-03-05" },
  },
  {
    id: "act-4",
    type: "leave_approved",
    description: "Leave request approved",
    timestamp: "2024-01-21T14:30:00Z",
    metadata: { leaveType: "paid", startDate: "2024-02-10", endDate: "2024-02-12" },
  },
  {
    id: "act-5",
    type: "leave_rejected",
    description: "Leave request rejected",
    timestamp: "2023-12-11T11:00:00Z",
    metadata: { leaveType: "paid", startDate: "2023-12-20", endDate: "2023-12-22" },
  },
];

export function getTodayAttendance(): AttendanceRecord | null {
  const today = new Date().toISOString().split("T")[0];
  return demoAttendance.find((a) => a.date === today) || null;
}

export function getWeeklyAttendance(weekStart: string): WeeklyAttendance {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const weekRecords = demoAttendance.filter((a) => {
    const date = new Date(a.date);
    return date >= start && date <= end;
  });

  const summary = {
    present: weekRecords.filter((r) => r.status === "present").length,
    absent: weekRecords.filter((r) => r.status === "absent").length,
    halfDay: weekRecords.filter((r) => r.status === "half-day").length,
    leave: weekRecords.filter((r) => r.status === "leave").length,
    totalHours: weekRecords.reduce((sum, r) => sum + (r.hoursWorked || 0), 0),
  };

  return {
    weekStart,
    weekEnd: end.toISOString().split("T")[0],
    records: weekRecords,
    summary,
  };
}

export function getDashboardStats(): DashboardStats {
  return {
    todayAttendance: getTodayAttendance(),
    recentLeaveRequests: demoLeaveRequests.slice(0, 3),
    recentActivity: demoActivities.slice(0, 5),
  };
}