'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  Check, 
  HelpCircle,
  Calendar,
  Layers,
  Users,
  Clock,
  CalendarClock,
  CreditCard,
  LayoutDashboard,
  ArrowRight,
  ExternalLink
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
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search results across employees
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.skills || []).some(s => s.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [employees, searchQuery]);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, exact: true },
    { name: 'Employees', href: '/admin/employees', icon: Users },
    { name: 'Attendance', href: '/admin/attendance', icon: Clock },
    { name: 'Time Off', href: '/admin/leaves', icon: CalendarClock, badge: pendingLeavesCount },
    { name: 'Payroll & Salary', href: '/admin/payroll', icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand Logo & Navigation Links */}
          <div className="flex items-center gap-6">
            {onToggleMobileMenu && (
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-lg tracking-tight">DAYFLOW</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                    HRMS
                  </span>
                </div>
                <div className="text-[10px] font-medium text-slate-500">Enterprise Administration</div>
              </div>
            </Link>

            {/* Direct Header Navigation Tabs */}
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

          {/* Center: Live Interactive Search Bar with Dropdown */}
          <div className="flex-1 max-w-md hidden md:block relative" ref={searchContainerRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search employees, skills, departments..."
                className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>

            {/* Live Search Suggestions Popover */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                  <span>Matching Employees ({searchResults.length})</span>
                  <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => onSearchChange('')}>
                    Clear
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching records found for "{searchQuery}"
                    </div>
                  ) : (
                    searchResults.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => {
                          onSelectEmployee(emp);
                          setIsSearchFocused(false);
                          if (onViewEmployeeDetails) onViewEmployeeDetails(emp);
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{emp.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">
                              <span className="font-mono">{emp.id}</span> • {emp.role} ({emp.department})
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={`/admin/profile/${emp.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 hover:underline"
                          >
                            <span>Profile</span> <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Shortcuts in Search Footer */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <Link href="/admin/employees" className="hover:text-indigo-600 font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3" /> Directory
                    </Link>
                    <span>•</span>
                    <Link href="/admin/attendance" className="hover:text-indigo-600 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Attendance
                    </Link>
                    <span>•</span>
                    <Link href="/admin/leaves" className="hover:text-indigo-600 font-semibold flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" /> Leaves
                    </Link>
                    <span>•</span>
                    <Link href="/admin/payroll" className="hover:text-indigo-600 font-semibold flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> Payroll
                    </Link>
                  </div>
                  <span className="text-[10px] text-slate-400">ESC to dismiss</span>
                </div>
              </div>
            )}
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
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
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
                    <Link 
                      href="/admin/leaves" 
                      onClick={() => setShowNotifications(false)}
                      className="block p-2 bg-amber-50/70 border border-amber-200 rounded-xl text-xs hover:bg-amber-50 transition-colors"
                    >
                      <div className="font-semibold text-amber-900 flex items-center justify-between">
                        <span>{pendingLeavesCount} Pending Leave Approvals</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                      </div>
                      <p className="text-amber-800 text-[11px] mt-0.5">
                        New absence requests awaiting review in Leave Inbox.
                      </p>
                    </Link>
                    <Link 
                      href="/admin/attendance" 
                      onClick={() => setShowNotifications(false)}
                      className="block p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs hover:bg-slate-100 transition-colors"
                    >
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>Biometric Attendance Sync</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">Automated timestamps logged for today.</p>
                    </Link>
                    <Link 
                      href="/admin/payroll" 
                      onClick={() => setShowNotifications(false)}
                      className="block p-2 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs hover:bg-indigo-50 transition-colors"
                    >
                      <div className="font-semibold text-indigo-900 flex items-center justify-between">
                        <span>Monthly Payroll Ledger</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-700" />
                      </div>
                      <p className="text-indigo-800 text-[11px] mt-0.5">Statutory ledger ready for review.</p>
                    </Link>
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
