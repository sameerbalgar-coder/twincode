'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Employee, Department } from '../types/hrms';
import { 
  Users, 
  Search, 
  ChevronDown, 
  Check, 
  X, 
  Building2, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface EmployeeSwitcherProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onSelectEmployee: (emp: Employee | null) => void;
  onViewEmployeeDetails?: (emp: Employee) => void;
}

export const EmployeeSwitcher: React.FC<EmployeeSwitcherProps> = ({
  employees,
  selectedEmployee,
  onSelectEmployee,
  onViewEmployeeDetails
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const departments: ('All' | Department)[] = [
    'All',
    'Engineering',
    'Product',
    'UI/UX Design',
    'People Operations',
    'Sales & Marketing',
    'Finance',
    'Customer Success'
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500 text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Remote': return 'bg-sky-500 text-sky-700 bg-sky-50 border-sky-200';
      case 'On Leave': return 'bg-amber-500 text-amber-700 bg-amber-50 border-amber-200';
      case 'Probation': return 'bg-purple-500 text-purple-700 bg-purple-50 border-purple-200';
      default: return 'bg-gray-400 text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Switcher Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all shadow-xs duration-200 ${
          selectedEmployee
            ? 'bg-indigo-50/90 border-indigo-200 text-indigo-950 hover:bg-indigo-100/80 ring-2 ring-indigo-500/10'
            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {selectedEmployee ? (
            <div className="relative">
              <img
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-300"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                selectedEmployee.status === 'Active' ? 'bg-emerald-500' :
                selectedEmployee.status === 'Remote' ? 'bg-sky-500' :
                selectedEmployee.status === 'On Leave' ? 'bg-amber-500' : 'bg-purple-500'
              }`} />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}

          <div className="text-left leading-tight hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-700">
                {selectedEmployee ? 'Viewing Profile' : 'HR Admin Scope'}
              </span>
              {selectedEmployee && (
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded-full">
                  Focused
                </span>
              )}
            </div>
            <div className="font-semibold text-slate-900 truncate max-w-[150px]">
              {selectedEmployee ? selectedEmployee.name : 'All Company (Global)'}
            </div>
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-[340px] sm:w-[420px] rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Employee Context Switcher
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Option: Reset to All Company */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/70">
            <button
              onClick={() => {
                onSelectEmployee(null);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                selectedEmployee === null
                  ? 'bg-white border-indigo-500 shadow-xs ring-1 ring-indigo-500/20 text-indigo-900 font-semibold'
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">All Company View</div>
                  <div className="text-xs text-slate-500">Full HR overview & analytics across 148 staff</div>
                </div>
              </div>
              {selectedEmployee === null && (
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, role, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Department Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none mt-1">
              {departments.slice(0, 5).map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                    selectedDept === dept
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Employee List */}
          <div className="max-h-[260px] overflow-y-auto p-2 space-y-1 divide-y divide-slate-50">
            {filteredEmployees.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">No matching employees found</p>
              </div>
            ) : (
              filteredEmployees.map((emp) => {
                const isSelected = selectedEmployee?.id === emp.id;
                return (
                  <div
                    key={emp.id}
                    onClick={() => {
                      onSelectEmployee(emp);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/90 border border-indigo-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          emp.status === 'Active' ? 'bg-emerald-500' :
                          emp.status === 'Remote' ? 'bg-sky-500' :
                          emp.status === 'On Leave' ? 'bg-amber-500' : 'bg-purple-500'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {emp.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1 rounded">
                            {emp.id}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                          <span>{emp.role}</span>
                          <span>•</span>
                          <span className="text-slate-400">{emp.department}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(emp.status)}`}>
                        {emp.status}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Quick Action */}
          {selectedEmployee && onViewEmployeeDetails && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Focused on <span className="font-semibold text-slate-800">{selectedEmployee.name}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onViewEmployeeDetails(selectedEmployee);
                  setIsOpen(false);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
              >
                View 360° Profile <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

