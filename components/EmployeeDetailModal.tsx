'use client';

import React from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Briefcase, 
  Users
} from 'lucide-react';
import { Employee } from '../types/hrms';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onFocusEmployee: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  isOpen,
  onClose,
  onFocusEmployee
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Banner Header */}
        <div className="relative h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Overlay */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-3.5">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{employee.name}</h2>
                  <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                    {employee.id}
                  </span>
                </div>
                <p className="text-sm font-medium text-indigo-600">{employee.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onFocusEmployee(employee);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" /> Focus on Dashboard
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Contact & Organization */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Employment & Contact</h4>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{employee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined on {employee.joinDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reporting Manager: <strong>{employee.managerName || 'Executive Team'}</strong></span>
                </div>
              </div>
            </div>

            {/* Today's Status & Leave Balance */}
            <div className="space-y-3">
              {/* Today's Checkin */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Today's Attendance</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-800">
                      {employee.attendanceToday.checkIn ? `Check-in: ${employee.attendanceToday.checkIn}` : 'Not clocked in yet'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    employee.attendanceToday.status === 'On-Time' ? 'bg-emerald-100 text-emerald-800' :
                    employee.attendanceToday.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {employee.attendanceToday.status}
                  </span>
                </div>
              </div>

              {/* Leave Balances */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Leave Balances (2026)</h4>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <div className="text-[11px] text-slate-500">Paid Leave</div>
                    <div className="font-bold text-indigo-600 text-sm">
                      {employee.leaveBalance.paid.total - employee.leaveBalance.paid.used} / {employee.leaveBalance.paid.total} left
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <div className="text-[11px] text-slate-500">Casual Leave</div>
                    <div className="font-bold text-emerald-600 text-sm">
                      {employee.leaveBalance.casual.total - employee.leaveBalance.casual.used} / {employee.leaveBalance.casual.total} left
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <div className="text-[11px] text-slate-500">Sick Leave</div>
                    <div className="font-bold text-amber-600 text-sm">
                      {employee.leaveBalance.sick.total - employee.leaveBalance.sick.used} / {employee.leaveBalance.sick.total} left
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <div className="text-[11px] text-slate-500">Emergency</div>
                    <div className="font-bold text-purple-600 text-sm">
                      {employee.leaveBalance.emergency.total - employee.leaveBalance.emergency.used} / {employee.leaveBalance.emergency.total} left
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Competencies */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Skills & Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {employee.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

