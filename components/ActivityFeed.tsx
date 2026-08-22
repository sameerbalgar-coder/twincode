'use client';

import React, { useState } from 'react';
import { ActivityItem, SystemAlert } from '../types/hrms';
import { 
  Bell, 
  Clock, 
  CalendarCheck, 
  CreditCard, 
  UserCheck, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  X,
  Megaphone,
  CheckCircle2
} from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
  alerts: SystemAlert[];
  onAlertAction?: (alert: SystemAlert) => void;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  alerts,
  onAlertAction,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'alerts'>('feed');
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  const visibleAlerts = alerts.filter(a => !dismissedAlertIds.includes(a.id));

  const handleDismissAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedAlertIds(prev => [...prev, id]);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'attendance':
        return <Clock className="w-4 h-4 text-emerald-600" />;
      case 'leave':
        return <CalendarCheck className="w-4 h-4 text-indigo-600" />;
      case 'payroll':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'profile':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  const getAlertSeverityStyles = (severity: SystemAlert['severity']) => {
    switch (severity) {
      case 'urgent':
        return {
          card: 'bg-rose-50/80 border-rose-200 text-rose-950',
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        };
      case 'warning':
        return {
          card: 'bg-amber-50/80 border-amber-200 text-amber-950',
          badge: 'bg-amber-100 text-amber-900 border-amber-200',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        };
      case 'notice':
        return {
          card: 'bg-indigo-50/80 border-indigo-200 text-indigo-950',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          icon: <Megaphone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        };
      default:
        return {
          card: 'bg-slate-50 border-slate-200 text-slate-900',
          badge: 'bg-slate-200 text-slate-800 border-slate-300',
          icon: <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        };
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col ${className}`}>
      
      {/* Header with Switcher Tabs */}
      <div className="p-4.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Activity & Updates</h3>
            <p className="text-[11px] text-slate-400 font-medium">Real-time workplace stream</p>
          </div>
        </div>

        {/* Pill Selector */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Activity ({activities.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1 rounded-lg transition-all relative cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Alerts
            {visibleAlerts.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {visibleAlerts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[420px]">
        
        {/* VIEW 1: ACTIVITY STREAM */}
        {activeTab === 'feed' && (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline Node Icon */}
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-slate-300 group-hover:border-indigo-500 flex items-center justify-center shadow-xs transition-colors">
                  <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-indigo-600 transition-colors" />
                </div>

                <div className="p-3 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(item.type)}
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: SYSTEM ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-2.5">
            {visibleAlerts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                <p className="font-semibold text-slate-700">All caught up!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No pending alerts or notifications.</p>
              </div>
            ) : (
              visibleAlerts.map((alert) => {
                const styles = getAlertSeverityStyles(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-2xl border ${styles.card} transition-all shadow-xs relative`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        {styles.icon}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{alert.title}</span>
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${styles.badge}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                            {alert.description}
                          </p>
                          <div className="mt-2.5 flex items-center gap-3">
                            {alert.actionLabel && (
                              <button
                                onClick={() => onAlertAction && onAlertAction(alert)}
                                className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                {alert.actionLabel} <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                            <span className="text-[10px] text-slate-400 font-medium">
                              {alert.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDismissAlert(alert.id, e)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Dismiss alert"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-center">
        <span className="text-[10px] font-medium text-slate-400">
          Syncs continuously with Dayflow HR Gateway
        </span>
      </div>

    </div>
  );
};

