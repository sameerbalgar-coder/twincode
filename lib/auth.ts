import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { SessionUser, UserRole } from '@/types/auth';

export interface StoredUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  department: string;
  avatar: string;
  isVerified: boolean;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users_store.json');
const AUTH_SECRET = process.env.AUTH_SECRET || 'dayflow-hrms-secret-enterprise-key-2026';
export const AUTH_COOKIE_NAME = 'dayflow_session';

// Password Hashing with PBKDF2
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

// Initial Seed Users
const initialSeedUsers: StoredUser[] = [
  {
    id: 'USR-ADMIN-01',
    employeeId: 'ADM-1001',
    name: 'Amara Okafor',
    email: 'amara.okafor@dayflow.internal',
    passwordHash: hashPassword('Password123!', 'fixed_seed_salt_admin_01').hash,
    salt: 'fixed_seed_salt_admin_01',
    role: 'ADMIN',
    department: 'People Operations',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'USR-HR-01',
    employeeId: 'HR-2001',
    name: 'Elena Rostova',
    email: 'hr@dayflow.internal',
    passwordHash: hashPassword('Password123!', 'fixed_seed_salt_hr_01').hash,
    salt: 'fixed_seed_salt_hr_01',
    role: 'HR',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'USR-EMP-01',
    employeeId: 'EMP-1001',
    name: 'Alex Rivera',
    email: 'alex.rivera@dayflow.internal',
    passwordHash: hashPassword('Password123!', 'fixed_seed_salt_emp_01').hash,
    salt: 'fixed_seed_salt_emp_01',
    role: 'EMPLOYEE',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
];

// Ensure User Database
export function getUsersStore(): StoredUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(initialSeedUsers, null, 2), 'utf-8');
      return initialSeedUsers;
    }

    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw) as StoredUser[];
  } catch (error) {
    console.error('Error accessing users store:', error);
    return initialSeedUsers;
  }
}

export function saveUsersStore(users: StoredUser[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving users store:', error);
  }
}

// User Lookup Utilities
export function findUserByEmail(email: string): StoredUser | null {
  const users = getUsersStore();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function findUserByEmployeeId(empId: string): StoredUser | null {
  const users = getUsersStore();
  const normalized = empId.trim().toUpperCase();
  return users.find((u) => u.employeeId.toUpperCase() === normalized) || null;
}

export function findUserById(id: string): StoredUser | null {
  const users = getUsersStore();
  return users.find((u) => u.id === id) || null;
}

export function createUserRecord(userData: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
  const users = getUsersStore();
  const newUser: StoredUser = {
    ...userData,
    id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsersStore(users);
  return newUser;
}

// Session Token Generation & Verification (Signed HMAC Token)
export function signSessionToken(user: SessionUser, expiresInDays: number = 7): string {
  const payload = {
    user,
    exp: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
    iat: Date.now(),
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(encodedPayload)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload.user as SessionUser;
  } catch (error) {
    return null;
  }
}

// Request Helper for Server Route Handlers
export function getAuthenticatedUser(request: { cookies: { get: (name: string) => { value?: string } | undefined }; headers: { get: (name: string) => string | null } }): SessionUser | null {
  const tokenFromCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;

  const token = tokenFromCookie || tokenFromHeader;
  if (!token) return null;
  return verifySessionToken(token);
}


