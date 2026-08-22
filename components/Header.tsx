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
  ExternalLink,
  LogOut,
  User as UserIcon,
  Shield,
  ChevronDown
} from 'lucide-react';
import { Employee } from '../types/hrms';
import { SessionUser } from '../types/auth';
import { NotificationBell } from './NotificationBell';
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync user context from /api/auth/me
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to resolve active session in Header:', err);
      }
    }
    fetchSession();
  }, []);

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

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/auth/login');
    }
  };

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
                            <span>Profile</span> <ArrowRight className="w-3.5 h-3.5" />
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
            <NotificationBell />

            {/* User Profile Dropdown & Logout Trigger */}
            <div className="relative pl-2 border-l border-slate-200" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer group"
                aria-label="User Account Menu"
              >
                <img
                  src={
                    currentUser?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser?.name || 'Amara Okafor'}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <span>{currentUser?.role === 'ADMIN' ? 'Administrator' : currentUser?.role === 'HR' ? 'People Ops' : 'Staff'}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
                  </div>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Info Header */}
                  <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 mb-1.5">
                    <div className="font-bold text-xs text-slate-900">
                      {currentUser?.name || 'Amara Okafor'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {currentUser?.email || 'amara.okafor@dayflow.internal'}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {currentUser?.role || 'ADMIN'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {currentUser?.employeeId || 'ADM-1001'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-0.5 text-xs font-semibold text-slate-700">
                    <Link
                      href="/admin/employees"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Employee Directory</span>
                    </Link>

                    <Link
                      href="/employee/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Employee Portal View</span>
                    </Link>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-bold transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
