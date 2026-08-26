export type NotificationType = 
  | 'leave_approved' 
  | 'leave_rejected' 
  | 'leave_applied' 
  | 'attendance_alert' 
  | 'payroll_update' 
  | 'system';

export interface AppNotification {
  id: string;
  employeeId?: string;
  userId?: string;
  recipientRole?: 'ALL' | 'ADMIN' | 'HR' | 'EMPLOYEE';
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

