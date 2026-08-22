export type UserRole = 'EMPLOYEE' | 'ADMIN' | 'HR';

export interface SessionUser {
  id: string;
  employeeId: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  department?: string;
  isVerified?: boolean;
}

export interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest {
  employeeId: string;
  email: string;
  password: string;
  role: UserRole;
  name?: string;
  department?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: SessionUser;
  token?: string;
  redirectUrl?: string;
}

