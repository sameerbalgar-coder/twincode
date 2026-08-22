import { Employee, AttendanceRecord, LeaveRequest, DepartmentStat, HRMetrics } from '../types/hrms';

export const mockEmployees: Employee[] = [
  {
    id: 'EMP-1001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Principal Frontend Architect',
    department: 'Engineering',
    status: 'Active',
    joinDate: '2022-03-15',
    salary: '$145,000',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA (HQ)',
    leaveBalance: {
      casual: { total: 12, used: 3 },
      sick: { total: 10, used: 2 },
      paid: { total: 20, used: 6 },
      emergency: { total: 5, used: 0 }
    },
    attendanceToday: {
      checkIn: '08:52 AM',
      status: 'On-Time'
    },
    directReportsCount: 4,
    managerName: 'Alex Rivera',
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GraphQL']
  },
  {
    id: 'EMP-1002',
    name: 'David Chen',
    email: 'david.chen@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Product Designer',
    department: 'UI/UX Design',
    status: 'Remote',
    joinDate: '2021-11-01',
    salary: '$130,000',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX (Remote)',
    leaveBalance: {
      casual: { total: 12, used: 5 },
      sick: { total: 10, used: 1 },
      paid: { total: 20, used: 11 },
      emergency: { total: 5, used: 1 }
    },
    attendanceToday: {
      checkIn: '09:05 AM',
      status: 'On-Time'
    },
    directReportsCount: 2,
    managerName: 'Elena Rostova',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping']
  },
  {
    id: 'EMP-1003',
    name: 'Amara Okafor',
    email: 'amara.okafor@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Director of People Operations',
    department: 'People Operations',
    status: 'Active',
    joinDate: '2020-08-10',
    salary: '$150,000',
    phone: '+1 (555) 456-7890',
    location: 'San Francisco, CA (HQ)',
    leaveBalance: {
      casual: { total: 12, used: 2 },
      sick: { total: 10, used: 0 },
      paid: { total: 22, used: 5 },
      emergency: { total: 5, used: 0 }
    },
    attendanceToday: {
      checkIn: '08:40 AM',
      status: 'On-Time'
    },
    directReportsCount: 6,
    managerName: 'CEO Office',
    skills: ['Talent Strategy', 'HR Compliance', 'Employee Relations', 'Org Development']
  },
  {
    id: 'EMP-1004',
    name: 'Marcus Vance',
    email: 'marcus.vance@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Backend Engineer',
    department: 'Engineering',
    status: 'On Leave',
    joinDate: '2023-01-20',
    salary: '$138,000',
    phone: '+1 (555) 567-8901',
    location: 'Seattle, WA',
    leaveBalance: {
      casual: { total: 12, used: 7 },
      sick: { total: 10, used: 4 },
      paid: { total: 18, used: 9 },
      emergency: { total: 5, used: 0 }
    },
    attendanceToday: {
      status: 'Absent'
    },
    directReportsCount: 0,
    managerName: 'Alex Rivera',
    skills: ['Go', 'PostgreSQL', 'Docker', 'Kubernetes', 'Microservices']
  },
  {
    id: 'EMP-1005',
    name: 'Elena Rostova',
    email: 'elena.rostova@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'VP of Product & Strategy',
    department: 'Product',
    status: 'Active',
    joinDate: '2021-04-12',
    salary: '$165,000',
    phone: '+1 (555) 678-9012',
    location: 'San Francisco, CA (HQ)',
    leaveBalance: {
      casual: { total: 12, used: 4 },
      sick: { total: 10, used: 1 },
      paid: { total: 22, used: 8 },
      emergency: { total: 5, used: 0 }
    },
    attendanceToday: {
      checkIn: '08:50 AM',
      status: 'On-Time'
    },
    directReportsCount: 8,
    managerName: 'CEO Office',
    skills: ['Roadmapping', 'Agile Leadership', 'Market Analysis', 'SaaS Growth']
  },
  {
    id: 'EMP-1006',
    name: 'Kavita Patel',
    email: 'kavita.patel@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Financial Analyst',
    department: 'Finance',
    status: 'Active',
    joinDate: '2022-09-01',
    salary: '$118,000',
    phone: '+1 (555) 789-0123',
    location: 'New York, NY',
    leaveBalance: {
      casual: { total: 12, used: 3 },
      sick: { total: 10, used: 1 },
      paid: { total: 18, used: 4 },
      emergency: { total: 5, used: 0 }
    },
    attendanceToday: {
      checkIn: '09:42 AM',
      status: 'Late'
    },
    directReportsCount: 1,
    managerName: 'Jonathan Hayes',
    skills: ['Financial Modeling', 'Budgeting', 'QuickBooks', 'Excel Macros']
  },
  {
    id: 'EMP-1007',
    name: 'Lucas Morales',
    email: 'lucas.morales@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'Enterprise Account Executive',
    department: 'Sales & Marketing',
    status: 'Active',
    joinDate: '2023-06-15',
    salary: '$110,000 + OTE',
    phone: '+1 (555) 890-1234',
    location: 'Chicago, IL',
    leaveBalance: {
      casual: { total: 12, used: 1 },
      sick: { total: 10, used: 0 },
      paid: { total: 15, used: 2 },
      emergency: { total: 5, used: 0 }
    },
    attendanceToday: {
      checkIn: '09:02 AM',
      status: 'On-Time'
    },
    directReportsCount: 0,
    managerName: 'Rachel Green',
    skills: ['HubSpot CRM', 'B2B Sales', 'Contract Negotiation', 'Lead Qualification']
  },
  {
    id: 'EMP-1008',
    name: 'Zoe Katsaros',
    email: 'zoe.katsaros@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Junior DevOps Engineer',
    department: 'Engineering',
    status: 'Probation',
    joinDate: '2024-05-10',
    salary: '$92,000',
    phone: '+1 (555) 901-2345',
    location: 'San Francisco, CA (HQ)',
    leaveBalance: {
      casual: { total: 6, used: 0 },
      sick: { total: 5, used: 0 },
      paid: { total: 10, used: 0 },
      emergency: { total: 3, used: 0 }
    },
    attendanceToday: {
      checkIn: '08:35 AM',
      status: 'On-Time'
    },
    directReportsCount: 0,
    managerName: 'Sarah Jenkins',
    skills: ['AWS', 'Terraform', 'CI/CD Pipelines', 'Linux', 'Bash']
  },
  {
    id: 'EMP-1009',
    name: 'Tariq Mansoor',
    email: 'tariq.mansoor@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'Customer Success Manager',
    department: 'Customer Success',
    status: 'Remote',
    joinDate: '2022-07-18',
    salary: '$102,000',
    phone: '+1 (555) 012-3456',
    location: 'Denver, CO (Remote)',
    leaveBalance: {
      casual: { total: 12, used: 6 },
      sick: { total: 10, used: 3 },
      paid: { total: 18, used: 8 },
      emergency: { total: 5, used: 1 }
    },
    attendanceToday: {
      checkIn: '08:58 AM',
      status: 'On-Time'
    },
    directReportsCount: 3,
    managerName: 'Elena Rostova',
    skills: ['Zendesk', 'Client Retention', 'Onboarding', 'Customer Health Metrics']
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT-201',
    employeeId: 'EMP-1008',
    employeeName: 'Zoe Katsaros',
    employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    date: 'Today, Aug 22',
    checkInTime: '08:35 AM',
    checkOutTime: '--',
    workHours: '3h 15m (Active)',
    status: 'On-Time',
    ipLocation: 'SF HQ Office (192.168.1.42)',
    device: 'MacBook Pro 16"'
  },
  {
    id: 'ATT-202',
    employeeId: 'EMP-1003',
    employeeName: 'Amara Okafor',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'People Operations',
    date: 'Today, Aug 22',
    checkInTime: '08:40 AM',
    checkOutTime: '--',
    workHours: '3h 10m (Active)',
    status: 'On-Time',
    ipLocation: 'SF HQ Office (192.168.1.18)',
    device: 'MacBook Air M2'
  },
  {
    id: 'ATT-203',
    employeeId: 'EMP-1005',
    employeeName: 'Elena Rostova',
    employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Product',
    date: 'Today, Aug 22',
    checkInTime: '08:50 AM',
    checkOutTime: '--',
    workHours: '3h 00m (Active)',
    status: 'On-Time',
    ipLocation: 'SF HQ Office (192.168.1.55)',
    device: 'Dell XPS 15'
  },
  {
    id: 'ATT-204',
    employeeId: 'EMP-1001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    date: 'Today, Aug 22',
    checkInTime: '08:52 AM',
    checkOutTime: '--',
    workHours: '2h 58m (Active)',
    status: 'On-Time',
    ipLocation: 'SF HQ Office (192.168.1.24)',
    device: 'MacBook Pro M3'
  },
  {
    id: 'ATT-205',
    employeeId: 'EMP-1009',
    employeeName: 'Tariq Mansoor',
    employeeAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    department: 'Customer Success',
    date: 'Today, Aug 22',
    checkInTime: '08:58 AM',
    checkOutTime: '--',
    workHours: '2h 52m (Active)',
    status: 'Remote',
    ipLocation: 'Denver VPN (10.8.0.12)',
    device: 'ThinkPad X1 Carbon'
  },
  {
    id: 'ATT-206',
    employeeId: 'EMP-1007',
    employeeName: 'Lucas Morales',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'Sales & Marketing',
    date: 'Today, Aug 22',
    checkInTime: '09:02 AM',
    checkOutTime: '--',
    workHours: '2h 48m (Active)',
    status: 'On-Time',
    ipLocation: 'Chicago Office (192.168.4.10)',
    device: 'iPad Pro 12.9" / Mac Mini'
  },
  {
    id: 'ATT-207',
    employeeId: 'EMP-1002',
    employeeName: 'David Chen',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'UI/UX Design',
    date: 'Today, Aug 22',
    checkInTime: '09:05 AM',
    checkOutTime: '--',
    workHours: '2h 45m (Active)',
    status: 'Remote',
    ipLocation: 'Austin VPN (10.8.0.33)',
    device: 'Mac Studio M2 Max'
  },
  {
    id: 'ATT-208',
    employeeId: 'EMP-1006',
    employeeName: 'Kavita Patel',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Finance',
    date: 'Today, Aug 22',
    checkInTime: '09:42 AM',
    checkOutTime: '--',
    workHours: '2h 08m (Active)',
    status: 'Late',
    ipLocation: 'NYC Branch (192.168.3.15)',
    device: 'Surface Laptop 5'
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LV-501',
    employeeId: 'EMP-1001',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    role: 'Principal Frontend Architect',
    leaveType: 'Paid Annual Leave',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    daysCount: 5,
    reason: 'Family vacation and personal downtime after Q3 release sprint.',
    appliedDate: '2026-08-20',
    status: 'Pending',
    conflictWarning: 'Note: Marcus Vance is also scheduled off during that week'
  },
  {
    id: 'LV-502',
    employeeId: 'EMP-1002',
    employeeName: 'David Chen',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'UI/UX Design',
    role: 'Lead Product Designer',
    leaveType: 'Casual Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    daysCount: 2,
    reason: 'Attending Figma Config Regional Design Summit in Austin.',
    appliedDate: '2026-08-21',
    status: 'Pending'
  },
  {
    id: 'LV-503',
    employeeId: 'EMP-1006',
    employeeName: 'Kavita Patel',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Finance',
    role: 'Senior Financial Analyst',
    leaveType: 'Sick Leave',
    startDate: '2026-08-24',
    endDate: '2026-08-24',
    daysCount: 1,
    reason: 'Scheduled dental procedure and post-op recovery.',
    appliedDate: '2026-08-22',
    status: 'Pending'
  },
  {
    id: 'LV-504',
    employeeId: 'EMP-1004',
    employeeName: 'Marcus Vance',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    role: 'Senior Backend Engineer',
    leaveType: 'Emergency Leave',
    startDate: '2026-08-22',
    endDate: '2026-08-23',
    daysCount: 2,
    reason: 'Urgent home plumbing repair and personal matter.',
    appliedDate: '2026-08-21',
    status: 'Approved'
  },
  {
    id: 'LV-505',
    employeeId: 'EMP-1007',
    employeeName: 'Lucas Morales',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'Sales & Marketing',
    role: 'Enterprise Account Executive',
    leaveType: 'Casual Leave',
    startDate: '2026-08-15',
    endDate: '2026-08-16',
    daysCount: 2,
    reason: 'Family wedding anniversary celebration.',
    appliedDate: '2026-08-10',
    status: 'Approved'
  }
];

export const mockDepartmentStats: DepartmentStat[] = [
  { name: 'Engineering', totalEmployees: 48, presentToday: 45, onLeaveToday: 3, color: 'bg-indigo-500' },
  { name: 'Product', totalEmployees: 18, presentToday: 18, onLeaveToday: 0, color: 'bg-blue-500' },
  { name: 'UI/UX Design', totalEmployees: 14, presentToday: 13, onLeaveToday: 1, color: 'bg-purple-500' },
  { name: 'People Operations', totalEmployees: 8, presentToday: 8, onLeaveToday: 0, color: 'bg-emerald-500' },
  { name: 'Sales & Marketing', totalEmployees: 32, presentToday: 30, onLeaveToday: 2, color: 'bg-amber-500' },
  { name: 'Finance', totalEmployees: 12, presentToday: 11, onLeaveToday: 1, color: 'bg-rose-500' },
  { name: 'Customer Success', totalEmployees: 16, presentToday: 15, onLeaveToday: 1, color: 'bg-teal-500' }
];

export const mockHRMetrics: HRMetrics = {
  totalEmployees: 148,
  activeToday: 140,
  remoteToday: 34,
  onLeaveToday: 8,
  lateArrivalsToday: 3,
  pendingLeavesCount: 3,
  attendanceRate: 94.6,
  newHiresThisMonth: 6
};

