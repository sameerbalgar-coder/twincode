'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarClock, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';

export type TabType = 'overview' | 'employees' | 'attendance' | 'leaves' | 'analytics';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingLeavesCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingLeavesCount,
  isMobileOpen,
  onCloseMobile
}) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'HR Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees Directory', icon: Users },
    { id: 'attendance', label: 'Attendance Records', icon: Clock },
    { id: 'leaves', label: 'Leave Approvals', icon: CalendarClock, badge: pendingLeavesCount },
    { id: 'analytics', label: 'Org Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                  Dayflow <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.2 rounded border border-indigo-500/30">HRMS</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Administration Portal</div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Core Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-indigo-900' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Admin Quick Info & Help */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* System Status Card */}
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-300">Biometric Sync</span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live
              </span>
            </div>
            <p className="text-[10px] text-slate-500">140 / 148 check-ins recorded today.</p>
          </div>

          {/* Quick Help & Logout */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <button className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <HelpCircle className="w-3.5 h-3.5" /> Support
            </button>
            <button className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

