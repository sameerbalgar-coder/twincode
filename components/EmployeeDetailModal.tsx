'use client';

import React from 'react';
import Link from 'next/link';
import { Employee } from '../types/hrms';
import { EmployeeProfileView } from './EmployeeProfileView';
import { X, ExternalLink, Users } from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onFocusEmployee?: (emp: Employee) => void;
  onUpdateEmployee?: (emp: Employee) => void;
  onEditEmployee?: (emp: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  isOpen,
  onClose,
  onFocusEmployee,
  onUpdateEmployee,
  onEditEmployee
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 z-10 max-h-[90vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              DF
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900">Dayflow 360° Personnel Dossier</span>
              <span className="text-[10px] text-slate-400 block font-mono">ID: {employee.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/profile/${employee.id}`}
              onClick={onClose}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Full Admin Dossier
            </Link>

            {onFocusEmployee && (
              <button
                onClick={() => {
                  onFocusEmployee(employee);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5" /> Focus In Portal
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <EmployeeProfileView
            employee={employee}
            onUpdateProfile={(updated) => {
              if (onUpdateEmployee) {
                onUpdateEmployee(updated);
              }
            }}
            showBackButton={false}
          />
        </div>

      </div>

    </div>
  );
};
