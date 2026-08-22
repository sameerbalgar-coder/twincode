import { 
  Employee, 
  AttendanceRecord, 
  LeaveRequest, 
  DepartmentStat, 
  HRMetrics, 
  SystemAlert,
  ActivityItem
} from '../types/hrms';

export const mockEmployees: Employee[] = [
  {
    id: 'EMP-1001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
    role: 'Principal Frontend Architect',
    department: 'Engineering',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2022-03-15',
    salary: '$145,000 / year',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA (HQ)',
    address: '742 Evergreen Terrace, Suite 4B, San Francisco, CA 94107',
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
    managerName: 'Alex Rivera (VP Engineering)',
    skills: ['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'Web Architecture'],
    personalData: {
      dateOfBirth: '1992-06-18',
      dob: '1992-06-18',
      gender: 'Female',
      maritalStatus: 'Married',
      bloodGroup: 'O+',
      nationality: 'United States',
      residentialAddress: '742 Evergreen Terrace, San Francisco, CA 94107',
      emergencyContact: {
        name: 'Michael Jenkins',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543',
        email: 'michael.j@gmail.com'
      }
    },
    personalDetails: {
      dateOfBirth: '1992-06-18',
      dob: '1992-06-18',
      gender: 'Female',
      maritalStatus: 'Married',
      bloodGroup: 'O+',
      nationality: 'United States',
      residentialAddress: '742 Evergreen Terrace, San Francisco, CA 94107',
      emergencyContact: {
        name: 'Michael Jenkins',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543',
        email: 'michael.j@gmail.com'
      }
    },
    jobDetails: {
      employeeId: 'EMP-1001',
      designation: 'Principal Frontend Architect',
      department: 'Engineering',
      reportingManager: 'Alex Rivera (VP of Engineering)',
      employmentType: 'Full-Time Regular',
      workLocation: 'San Francisco HQ (Hybrid - Building B, Floor 4)',
      joiningDate: 'March 15, 2022',
      probationStatus: 'Confirmed',
      workEmail: 'sarah.jenkins@dayflow.io',
      workPhone: '+1 (555) 019-2831',
      slackHandle: '@sarah.jenkins'
    },
    salaryStructure: {
      annualBaseSalary: 145000,
      annualCtc: '$145,000',
      currency: '$',
      basicSalary: '$6,041.67 / mo',
      hra: '$2,416.67 / mo',
      specialAllowance: '$2,416.66 / mo',
      performanceBonus: '$12,000 / year (Quarterly)',
      pfDeductions: '$725.00 / mo',
      taxDeductions: '$1,850.00 / mo',
      netMonthlyPay: '$8,299.00 / mo',
      payFrequency: 'Monthly',
      paymentFrequency: 'Monthly',
      bankName: 'Silicon Valley National Bank',
      accountNumberMasked: '•••• •••• •••• 8492',
      ifscCode: 'SVNBUS66X',
      breakdown: {
        basicPay: 6041,
        hra: 3020,
        specialAllowance: 1812,
        performanceBonus: 1208,
        providentFundOr401k: 725,
        taxDeduction: 1812,
        healthInsuranceDeduction: 350,
        netMonthlySalary: 9194
      },
      bankDetails: {
        bankName: 'JPMorgan Chase Bank, N.A.',
        accountNumber: '•••••••• 4892',
        routingOrIfsc: '021000021',
        accountType: 'Checking'
      }
    },
    documents: [
      {
        id: 'DOC-101',
        name: 'Signed_Employment_Agreement_Sarah_Jenkins.pdf',
        title: 'Employment Agreement & NDA',
        type: 'Employment Contract',
        category: 'Contract',
        fileName: 'Sarah_Jenkins_Employment_Contract_Signed.pdf',
        fileSize: '2.4 MB',
        uploadDate: '2022-03-15',
        status: 'Verified'
      },
      {
        id: 'DOC-102',
        name: 'Passport_Copy_Verified.pdf',
        title: 'Passport & Identity Verification',
        type: 'Identity Proof / Passport',
        category: 'Identity',
        fileName: 'US_Passport_ID_Verified.pdf',
        fileSize: '1.8 MB',
        uploadDate: '2022-03-16',
        status: 'Verified'
      },
      {
        id: 'DOC-103',
        name: 'Federal_W4_Tax_Withholding_2026.pdf',
        title: 'Form W-4 & Tax Withholding 2026',
        type: 'Tax Document (W-4 / Form 16)',
        category: 'Tax',
        fileName: 'Form_W4_Tax_Declaration_2026.pdf',
        fileSize: '950 KB',
        uploadDate: '2026-01-10',
        status: 'Verified'
      },
      {
        id: 'DOC-104',
        name: 'BS_Computer_Science_Stanford_Degree.pdf',
        title: 'B.S. Computer Science Degree Certificate',
        type: 'Educational Degree',
        category: 'Education',
        fileName: 'Stanford_BS_CS_Degree_Verified.pdf',
        fileSize: '3.1 MB',
        uploadDate: '2022-03-15',
        status: 'Verified'
      }
    ],
    activities: [
      {
        id: 'ACT-1',
        type: 'attendance',
        title: 'Biometric Check-in Recorded',
        description: 'Checked in at 08:52 AM at SF HQ Office (Terminal Gate 3)',
        timestamp: 'Today, 8:52 AM',
        status: 'success'
      },
      {
        id: 'ACT-2',
        type: 'leave',
        title: 'Leave Application Submitted',
        description: 'Applied for 5 days Paid Annual Leave (Sep 01 - Sep 05)',
        timestamp: 'Yesterday, 4:30 PM',
        status: 'info'
      },
      {
        id: 'ACT-3',
        type: 'payroll',
        title: 'July Paystub Disbursed',
        description: 'Net salary of $8,299.00 credited to account ending ••••8492',
        timestamp: 'Aug 01, 2026',
        status: 'success'
      },
      {
        id: 'ACT-4',
        type: 'profile',
        title: 'Emergency Contact Verified',
        description: 'Contact details for Mark Jenkins confirmed by People Ops',
        timestamp: 'July 15, 2026',
        status: 'info'
      }
    ]
  },
  {
    id: 'EMP-1002',
    name: 'David Chen',
    email: 'david.chen@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    role: 'Lead Product Designer',
    department: 'UI/UX Design',
    employmentType: 'Full-time',
    status: 'Remote',
    joinDate: '2021-11-01',
    salary: '$130,000 / year',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX (Remote)',
    address: '1204 Congress Ave, Apt 8, Austin, TX 78701',
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
    managerName: 'Elena Rostova (VP Product)',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping', 'Design Ops'],
    personalData: {
      dateOfBirth: '1990-11-24',
      gender: 'Male',
      maritalStatus: 'Single',
      bloodGroup: 'A+',
      nationality: 'United States',
      residentialAddress: '1204 South Congress Ave, Austin, TX 78704',
      emergencyContact: {
        name: 'Linda Chen',
        relationship: 'Mother',
        phone: '+1 (555) 432-1098'
      }
    },
    personalDetails: {
      dob: '1990-09-22',
      gender: 'Male',
      nationality: 'United States',
      maritalStatus: 'Single',
      bloodGroup: 'A+ Positive',
      emergencyContact: {
        name: 'Lily Chen',
        relationship: 'Sister',
        phone: '+1 (555) 991-4455'
      }
    },
    jobDetails: {
      employeeId: 'EMP-1002',
      designation: 'Lead Product Designer',
      department: 'UI/UX Design',
      reportingManager: 'Elena Rostova (VP Product)',
      employmentType: 'Full-Time Regular',
      workLocation: 'Austin Remote Hub',
      joiningDate: 'November 01, 2021',
      probationStatus: 'Confirmed',
      workEmail: 'david.chen@dayflow.io',
      slackHandle: '@david.design'
    },
    salaryStructure: {
      annualBaseSalary: 130000,
      annualCtc: '$130,000',
      currency: '$',
      basicSalary: '$5,416.67 / mo',
      hra: '$2,166.67 / mo',
      specialAllowance: '$2,166.66 / mo',
      pfDeductions: '$650.00 / mo',
      taxDeductions: '$1,620.00 / mo',
      netMonthlyPay: '$7,480.00 / mo',
      payFrequency: 'Monthly',
      paymentFrequency: 'Monthly',
      bankName: 'Chase Premier Bank',
      accountNumberMasked: '•••• •••• •••• 3109',
      ifscCode: 'CHASUS33A'
    },
    documents: [
      {
        id: 'DOC-201',
        title: 'Design Lead Employment Agreement',
        category: 'Contract',
        fileName: 'David_Chen_Employment_Agreement.pdf',
        fileSize: '1.9 MB',
        uploadDate: '2021-11-01',
        status: 'Verified'
      }
    ]
  },
  {
    id: 'EMP-1003',
    name: 'Amara Okafor',
    email: 'amara.okafor@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    role: 'Director of People Operations',
    department: 'People Operations',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2020-08-10',
    salary: '$150,000 / year',
    phone: '+1 (555) 456-7890',
    location: 'San Francisco, CA (HQ)',
    address: '550 Mission St, San Francisco, CA 94105',
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
    skills: ['Talent Strategy', 'HR Compliance', 'Employee Relations', 'Org Development', 'Payroll']
  },
  {
    id: 'EMP-1004',
    name: 'Marcus Vance',
    email: 'marcus.vance@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    role: 'Senior Backend Engineer',
    department: 'Engineering',
    employmentType: 'Full-time',
    status: 'On Leave',
    joinDate: '2023-01-20',
    salary: '$138,000 / year',
    phone: '+1 (555) 567-8901',
    location: 'Seattle, WA',
    address: '800 5th Ave, Seattle, WA 98104',
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
    managerName: 'Alex Rivera (VP Engineering)',
    skills: ['Go', 'PostgreSQL', 'Docker', 'Kubernetes', 'Microservices', 'Redis']
  },
  {
    id: 'EMP-1005',
    name: 'Elena Rostova',
    email: 'elena.rostova@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    role: 'VP of Product & Strategy',
    department: 'Product',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2021-04-12',
    salary: '$165,000 / year',
    phone: '+1 (555) 678-9012',
    location: 'San Francisco, CA (HQ)',
    address: '101 California St, San Francisco, CA 94111',
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
    skills: ['Roadmapping', 'Agile Leadership', 'Market Analysis', 'SaaS Growth', 'Product Strategy']
  },
  {
    id: 'EMP-1006',
    name: 'Kavita Patel',
    email: 'kavita.patel@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
    role: 'Senior Financial Analyst',
    department: 'Finance',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2022-09-01',
    salary: '$118,000 / year',
    phone: '+1 (555) 789-0123',
    location: 'New York, NY',
    address: '350 5th Ave, New York, NY 10118',
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
    skills: ['Financial Modeling', 'Budgeting', 'QuickBooks', 'Excel Macros', 'Forecasting']
  },
  {
    id: 'EMP-1007',
    name: 'Lucas Morales',
    email: 'lucas.morales@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80',
    role: 'Enterprise Account Executive',
    department: 'Sales & Marketing',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2023-06-15',
    salary: '$110,000 + OTE',
    phone: '+1 (555) 890-1234',
    location: 'Chicago, IL',
    address: '233 S Wacker Dr, Chicago, IL 60606',
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
    skills: ['HubSpot CRM', 'B2B Sales', 'Contract Negotiation', 'Lead Qualification', 'Enterprise SaaS']
  },
  {
    id: 'EMP-1008',
    name: 'Zoe Katsaros',
    email: 'zoe.katsaros@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
    role: 'Junior DevOps Engineer',
    department: 'Engineering',
    employmentType: 'Contract',
    status: 'Probation',
    joinDate: '2024-05-10',
    salary: '$92,000 / year',
    phone: '+1 (555) 901-2345',
    location: 'San Francisco, CA (HQ)',
    address: '200 Folsom St, San Francisco, CA 94105',
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
    skills: ['AWS', 'Terraform', 'CI/CD Pipelines', 'Linux', 'Bash', 'Docker']
  },
  {
    id: 'EMP-1009',
    name: 'Tariq Mansoor',
    email: 'tariq.mansoor@dayflow.io',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=250&auto=format&fit=crop&q=80',
    role: 'Customer Success Manager',
    department: 'Customer Success',
    employmentType: 'Full-time',
    status: 'Remote',
    joinDate: '2022-07-18',
    salary: '$102,000 / year',
    phone: '+1 (555) 012-3456',
    location: 'Denver, CO (Remote)',
    address: '1700 Broadway, Denver, CO 80290',
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
    skills: ['Zendesk', 'Client Retention', 'Onboarding', 'Customer Health Metrics', 'Intercom']
  }
];

export const mockSystemAlerts: SystemAlert[] = [
  {
    id: 'ALT-1',
    title: 'Upcoming Company Holiday: Labor Day',
    description: 'Dayflow offices will be closed on Monday, September 1st. Automated attendance logging is paused.',
    severity: 'info',
    date: 'Aug 22, 2026',
    actionLabel: 'View Holiday Calendar'
  },
  {
    id: 'ALT-2',
    title: 'Q3 Tax Declaration & Benefit Submission Due',
    description: 'Please review and submit eligible investment proofs and health declaration before September 15th.',
    severity: 'warning',
    date: 'Aug 20, 2026',
    actionLabel: 'Submit Tax Proofs'
  },
  {
    id: 'ALT-3',
    title: 'Annual 360° Peer Performance Reviews',
    description: 'Peer feedback cycle for Q3 is now open. Submit feedback for up to 3 team members by next Friday.',
    severity: 'notice',
    date: 'Aug 18, 2026',
    actionLabel: 'Start Review'
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
