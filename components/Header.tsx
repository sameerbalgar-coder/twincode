'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  Check, 
  HelpCircle,
  Calendar,
  Layers
} from 'lucide-react';
import { Employee } from '../types/hrms';
import { EmployeeSwitcher } from './EmployeeSwitcher';

interface HeaderProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onSelectEmployee: (emp: Employee | null) => void;
  onViewEmployeeDetails?: (emp: Employee) => void;
  onToggleMobileMenu?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pendingLeavesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  employees,
  selectedEmployee,
  onSelectEmployee,
  onViewEmployeeDetails,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  pendingLeavesCount
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">Dayflow</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                    HRMS
                  </span>
                </div>
                <div className="text-[10px] font-medium text-slate-500">Enterprise HR Admin</div>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search employees, leaves, attendance records..."
                className="w-full pl-9 pr-12 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Right: Employee Switcher & Admin Actions */}
          <div className="flex items-center gap-3">
            {/* The Intuitive Employee Switcher */}
            <EmployeeSwitcher
              employees={employees}
              selectedEmployee={selectedEmployee}
              onSelectEmployee={onSelectEmployee}
              onViewEmployeeDetails={onViewEmployeeDetails}
            />

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {pendingLeavesCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                    <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
                      <div className="font-semibold text-amber-900 flex items-center gap-1">
                        <span>{pendingLeavesCount} Pending Leave Approvals</span>
                      </div>
                      <p className="text-amber-800 text-[11px] mt-0.5">
                        Sarah Jenkins and 2 others submitted leave requests for review.
                      </p>
                    </div>
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      <div className="font-semibold text-slate-800">Biometric Sync Successful</div>
                      <p className="text-slate-500 text-[11px] mt-0.5">140 employee check-ins recorded for today.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* HR Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Amara Okafor"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900">Amara Okafor</div>
                <div className="text-[10px] text-slate-500">Director of People</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

