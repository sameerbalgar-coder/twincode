'use client';

import React, { useState } from 'react';
import { EmployeeDashboard } from '@/components/EmployeeDashboard';
import { HRAdminDashboard } from '@/components/HRAdminDashboard';
import { mockEmployees } from '@/data/mockHrmsData';
import { Employee } from '@/types/hrms';
import { UserCheck, ShieldCheck } from 'lucide-react';

export default function Home() {
  // Shared state of employees
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  // Default logged in employee is Sarah Jenkins (Principal Frontend Architect)
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('EMP-1001');
  // Portal View Mode: 'employee' (Master UI Prompt focus) vs 'admin'
  const [portalMode, setPortalMode] = useState<'employee' | 'admin'>('employee');

  const currentEmployee = employees.find(e => e.id === currentEmployeeId) || employees[0];

  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updated.id ? updated : emp));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Portal Switcher Bar */}
      <div className="bg-slate-950 text-white px-4 py-2 text-xs border-b border-slate-800 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">Dayflow HRMS Environment</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Viewing as: <strong className="text-white">{currentEmployee.name}</strong> ({currentEmployee.role})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
            <button
              onClick={() => setPortalMode('employee')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                portalMode === 'employee'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Employee Portal</span>
            </button>

            <button
              onClick={() => setPortalMode('admin')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                portalMode === 'admin'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HR Admin Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1">
        {portalMode === 'employee' ? (
          <EmployeeDashboard
            currentEmployee={currentEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onSwitchToAdmin={() => setPortalMode('admin')}
          />
        ) : (
          <HRAdminDashboard />
        )}
      </div>
    </div>
  );
}
