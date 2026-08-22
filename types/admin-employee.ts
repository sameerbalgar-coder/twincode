import { Department, EmployeeStatus, EmploymentType, DocumentRecord } from './hrms';
import { SalaryComponentConfig } from './admin-payroll';

export type DirectoryViewMode = 'grid' | 'list';

export type EmployeeStatusIndicator = 'green' | 'yellow' | 'airplane';

export interface AdminEmployeeCard {
  id: string;
  name: string;
  avatar: string;
  designation: string; // role/title
  department: Department;
  email: string;
  phone: string;
  location: string;
  managerName?: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  statusIndicator: EmployeeStatusIndicator;
  joinDate: string;
  skills: string[];
}

export interface PrivateInfoData {
  dateOfBirth: string;
  residingAddress: string;
  nationality: string;
  personalEmail: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  bloodGroup: string;
  dateOfJoining: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'Savings' | 'Current' | 'Salary';
  panNumber: string;
  uanNumber: string;
  aadhaarNumber?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  accountStatus: 'Active' | 'Suspended' | 'Terminated';
  lastPasswordReset?: string;
  forcePasswordChangeOnNextLogin: boolean;
  temporaryPassword?: string;
}

export interface FullAdminEmployeeProfile {
  id: string;
  name: string;
  avatar: string;
  designation: string;
  department: Department;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  managerName: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  skills: string[];
  documents: DocumentRecord[];
  privateInfo: PrivateInfoData;
  salaryStructure: SalaryComponentConfig;
  security: SecuritySettings;
}

export interface CreateEmployeeInput {
  id?: string;
  name: string;
  email: string;
  designation: string;
  department: Department;
  employmentType?: EmploymentType;
  location?: string;
  phone?: string;
  managerName?: string;
  joinDate?: string;
  monthlyBaseWage?: number;
}

