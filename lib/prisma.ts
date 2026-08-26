export interface PrismaUserModel {
  id: string;
  employeeId: string;
  email: string;
  passwordHash: string;
  role: 'EMPLOYEE' | 'HR' | 'ADMIN';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  employee?: PrismaEmployeeProfileModel | null;
}

export interface PrismaEmployeeProfileModel {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  address?: string | null;
  profileImage?: string | null;
  department?: string | null;
  position?: string | null;
  joiningDate?: Date | null;
}

export interface PrismaAttendanceModel {
  id: string;
  employeeId: string;
  date: Date;
  checkIn?: Date | null;
  checkOut?: Date | null;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaLeaveRequestModel {
  id: string;
  employeeId: string;
  type: 'PAID' | 'SICK' | 'UNPAID';
  startDate: Date;
  endDate: Date;
  remarks?: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaSessionModel {
  id: string;
  tokenHash: string;
  userId: string;
  user?: PrismaUserModel;
  expiresAt: Date;
  createdAt: Date;
}

export interface PrismaSalaryModel {
  id: string;
  employeeId: string;
  basicSalary: any;
  allowances: any;
  deductions: any;
  netSalary: any;
  createdAt: Date;
  updatedAt: Date;
}

// In-Memory Fallback Store
const usersStore: PrismaUserModel[] = [
  {
    id: 'USR-ADMIN-1',
    employeeId: 'ADM-1001',
    email: 'admin@dayflow.com',
    passwordHash: 'scrypt$dummy$dummy',
    role: 'ADMIN',
    emailVerified: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    employee: {
      id: 'EMP-PROF-1',
      userId: 'USR-ADMIN-1',
      firstName: 'Amara',
      lastName: 'Okafor',
      department: 'Executive',
      position: 'HR Administrator',
      phone: '+1 555-0199',
      address: '100 Dayflow Plaza, Tech District',
      joiningDate: new Date('2024-01-01')
    }
  },
  {
    id: 'USR-EMP-1',
    employeeId: 'EMP-1001',
    email: 'sarah.jenkins@dayflow.com',
    passwordHash: 'scrypt$dummy$dummy',
    role: 'EMPLOYEE',
    emailVerified: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    employee: {
      id: 'EMP-PROF-2',
      userId: 'USR-EMP-1',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      department: 'Engineering',
      position: 'Principal Frontend Architect',
      phone: '+1 555-0142',
      address: '742 Evergreen Terrace',
      joiningDate: new Date('2024-03-15')
    }
  }
];

const sessionsStore: PrismaSessionModel[] = [];
const attendancesStore: PrismaAttendanceModel[] = [];
const leavesStore: PrismaLeaveRequestModel[] = [];
const salariesStore: PrismaSalaryModel[] = [];

export interface ExtendedPrismaClient {
  user: {
    findUnique: (args: any) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  session: {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    deleteMany: (args: any) => Promise<any>;
  };
  employeeProfile: {
    findUnique: (args: any) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  attendance: {
    findUnique: (args: any) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  leaveRequest: {
    findUnique: (args: any) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  salary: {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  $queryRaw: (query: any, ...values: any[]) => Promise<any>;
}

export const prisma: ExtendedPrismaClient = {
  user: {
    async findUnique(args) {
      if (args.where?.email) {
        return usersStore.find((u) => u.email.toLowerCase() === String(args.where.email).toLowerCase()) || null;
      }
      if (args.where?.employeeId) {
        return usersStore.find((u) => u.employeeId.toUpperCase() === String(args.where.employeeId).toUpperCase()) || null;
      }
      if (args.where?.id) {
        return usersStore.find((u) => u.id === args.where.id) || null;
      }
      return null;
    },
    async findMany(args) {
      return [...usersStore];
    },
    async create(args) {
      const newUser: PrismaUserModel = {
        id: `USR-${Date.now()}`,
        employeeId: args.data.employeeId,
        email: args.data.email,
        passwordHash: args.data.passwordHash,
        role: args.data.role || 'EMPLOYEE',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        employee: args.data.employee?.create
          ? {
              id: `EMP-PROF-${Date.now()}`,
              userId: `USR-${Date.now()}`,
              firstName: args.data.employee.create.firstName,
              lastName: args.data.employee.create.lastName,
              phone: args.data.employee.create.phone || null,
              address: args.data.employee.create.address || null,
              department: args.data.employee.create.department || null,
              position: args.data.employee.create.position || null,
              joiningDate: new Date(),
            }
          : null,
      };
      usersStore.push(newUser);
      return newUser;
    },
    async update(args) {
      const user = usersStore.find((u) => u.id === args.where.id);
      if (user) Object.assign(user, args.data, { updatedAt: new Date() });
      return user || null;
    },
  },
  session: {
    async findUnique(args) {
      const session = sessionsStore.find((s) => s.tokenHash === args.where?.tokenHash);
      if (!session) return null;
      const user = usersStore.find((u) => u.id === session.userId);
      return { ...session, user };
    },
    async create(args) {
      const newSession: PrismaSessionModel = {
        id: `SESS-${Date.now()}`,
        tokenHash: args.data.tokenHash,
        userId: args.data.userId,
        expiresAt: args.data.expiresAt,
        createdAt: new Date(),
      };
      sessionsStore.push(newSession);
      return newSession;
    },
    async delete(args) {
      const idx = sessionsStore.findIndex((s) => s.id === args.where?.id);
      if (idx !== -1) sessionsStore.splice(idx, 1);
      return true;
    },
    async deleteMany(args) {
      const remaining = sessionsStore.filter((s) => s.tokenHash !== args.where?.tokenHash);
      sessionsStore.length = 0;
      sessionsStore.push(...remaining);
      return true;
    },
  },
  employeeProfile: {
    async findUnique(args) {
      return usersStore.find((u) => u.employee?.userId === args.where?.userId)?.employee || null;
    },
    async findMany() {
      return usersStore.map((u) => u.employee).filter(Boolean);
    },
    async create(args) {
      return args.data;
    },
    async update(args) {
      return args.data;
    },
  },
  attendance: {
    async findUnique(args) {
      if (args.where?.employeeId_date) {
        return (
          attendancesStore.find(
            (a) =>
              a.employeeId === args.where.employeeId_date.employeeId &&
              new Date(a.date).toDateString() === new Date(args.where.employeeId_date.date).toDateString()
          ) || null
        );
      }
      return attendancesStore.find((a) => a.id === args.where?.id) || null;
    },
    async findMany(args) {
      if (args?.where?.employeeId) {
        return attendancesStore.filter((a) => a.employeeId === args.where.employeeId);
      }
      return [...attendancesStore];
    },
    async create(args) {
      const newAttendance: PrismaAttendanceModel = {
        id: `ATT-${Date.now()}`,
        employeeId: args.data.employeeId,
        date: args.data.date,
        checkIn: args.data.checkIn || new Date(),
        checkOut: args.data.checkOut || null,
        status: args.data.status || 'PRESENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      attendancesStore.push(newAttendance);
      return newAttendance;
    },
    async update(args) {
      const att = attendancesStore.find((a) => a.id === args.where?.id);
      if (att) Object.assign(att, args.data, { updatedAt: new Date() });
      return att || null;
    },
  },
  leaveRequest: {
    async findUnique(args) {
      return leavesStore.find((l) => l.id === args.where?.id) || null;
    },
    async findMany(args) {
      if (args?.where?.employeeId) {
        return leavesStore.filter((l) => l.employeeId === args.where.employeeId);
      }
      return [...leavesStore];
    },
    async create(args) {
      const newLeave: PrismaLeaveRequestModel = {
        id: `LV-${Date.now()}`,
        employeeId: args.data.employeeId,
        type: args.data.type,
        startDate: args.data.startDate,
        endDate: args.data.endDate,
        remarks: args.data.remarks || null,
        status: args.data.status || 'PENDING',
        adminComment: null,
        reviewedBy: null,
        reviewedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      leavesStore.push(newLeave);
      return newLeave;
    },
    async update(args) {
      const lv = leavesStore.find((l) => l.id === args.where?.id);
      if (lv) Object.assign(lv, args.data, { updatedAt: new Date() });
      return lv || null;
    },
  },
  salary: {
    async findUnique(args) {
      return salariesStore.find((s) => s.employeeId === args.where?.employeeId) || null;
    },
    async create(args) {
      salariesStore.push(args.data);
      return args.data;
    },
    async update(args) {
      const sal = salariesStore.find((s) => s.employeeId === args.where?.employeeId);
      if (sal) Object.assign(sal, args.data, { updatedAt: new Date() });
      return sal || null;
    },
  },
  async $queryRaw() {
    return [{ '?column?': 1 }];
  },
};
