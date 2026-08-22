'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Layers, 
  Users, 
  Clock, 
  CalendarClock, 
  Search, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  X,
  Sparkles,
  CreditCard,
  LayoutDashboard,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Employee } from '../types/hrms';

interface DayflowNavigationProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onSelectEmployee: (emp: Employee | null) => void;
  pendingLeavesCount?: number;
}

export const DayflowNavigation: React.FC<DayflowNavigationProps> = ({
  employees,
  selectedEmployee,
  onSelectEmployee,
  pendingLeavesCount = 3
}) => {
  const pathname = usePathname();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, exact: true },
    { name: 'Employees', href: '/admin/employees', icon: Users },
    { name: 'Attendance', href: '/admin/attendance', icon: Clock },
    { name: 'Time Off', href: '/admin/leaves', icon: CalendarClock, badge: pendingLeavesCount },
    { name: 'Payroll & Salary', href: '/admin/payroll', icon: CreditCard },
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Nav Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-lg tracking-tight">DAYFLOW</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                    HRMS
                  </span>
                </div>
                <div className="text-[10px] font-medium text-slate-400">Admin Portal</div>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.exact 
                  ? pathname === link.href 
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Employee Switcher & Admin Actions */}
          <div className="flex items-center gap-3">
            
            {/* Employee Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all shadow-2xs cursor-pointer ${
                  selectedEmployee
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-950 ring-2 ring-indigo-500/10'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
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
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}

                  <div className="text-left leading-tight hidden sm:block">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {selectedEmployee ? 'Scoped View' : 'Global Scope'}
                    </div>
                    <div className="font-bold text-xs text-slate-900 truncate max-w-[130px]">
                      {selectedEmployee ? selectedEmployee.name : 'Company-Wide'}
                    </div>
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Popover */}
              {isSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-[340px] sm:w-[380px] rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                        Admin Employee Scope
                      </span>
                    </div>
                    <button 
                      onClick={() => setIsSwitcherOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Company-Wide Option */}
                  <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
                    <button
                      onClick={() => {
                        onSelectEmployee(null);
                        setIsSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                        selectedEmployee === null
                          ? 'bg-white border-indigo-500 shadow-xs text-indigo-900 font-semibold ring-1 ring-indigo-500/20'
                          : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900">Company-Wide (All Staff)</div>
                          <div className="text-[10px] text-slate-500">Unfiltered records across all departments</div>
                        </div>
                      </div>
                      {selectedEmployee === null && (
                        <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* If employee is selected, provide direct link to their full profile */}
                  {selectedEmployee && (
                    <div className="px-3 py-2 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-xs">
                      <span className="text-indigo-900 font-semibold truncate">
                        Selected: <strong>{selectedEmployee.name}</strong>
                      </span>
                      <Link
                        href={`/admin/profile/${selectedEmployee.id}`}
                        onClick={() => setIsSwitcherOpen(false)}
                        className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 hover:underline"
                      >
                        Full Profile <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {/* Search */}
                  <div className="p-2.5 border-b border-slate-100">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search employee by name, ID, role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Employee List */}
                  <div className="max-h-[240px] overflow-y-auto p-1.5 space-y-1">
                    {filteredEmployees.map((emp) => {
                      const isSelected = selectedEmployee?.id === emp.id;
                      return (
                        <div
                          key={emp.id}
                          onClick={() => {
                            onSelectEmployee(emp);
                            setIsSwitcherOpen(false);
                          }}
                          className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                            isSelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">{emp.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{emp.role} • {emp.department}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer link to Directory */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <Link
                      href="/admin/employees"
                      onClick={() => setIsSwitcherOpen(false)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      Open Full Employee Directory <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              )}
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Amara Okafor"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900">Amara Okafor</div>
                <div className="text-[10px] text-slate-500">HR Admin</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
