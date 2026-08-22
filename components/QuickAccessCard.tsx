'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, ChevronRight } from 'lucide-react';

interface QuickAccessCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  };
  accentColor: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue';
  highlightMetric?: {
    label: string;
    value: string;
  };
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  accentColor,
  highlightMetric,
  onClick,
  className = '',
  children
}) => {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50/70',
      iconBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30',
      borderHover: 'hover:border-indigo-300',
      glow: 'group-hover:bg-indigo-500/5',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      iconBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30',
      borderHover: 'hover:border-emerald-300',
      glow: 'group-hover:bg-emerald-500/5',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    amber: {
      bg: 'bg-amber-50/70',
      iconBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/30',
      borderHover: 'hover:border-amber-300',
      glow: 'group-hover:bg-amber-500/5',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200'
    },
    rose: {
      bg: 'bg-rose-50/70',
      iconBg: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
      borderHover: 'hover:border-rose-300',
      glow: 'group-hover:bg-rose-500/5',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    blue: {
      bg: 'bg-sky-50/70',
      iconBg: 'bg-sky-600 text-white shadow-md shadow-sky-600/30',
      borderHover: 'hover:border-sky-300',
      glow: 'group-hover:bg-sky-500/5',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200'
    }
  };

  const currentTheme = colorStyles[accentColor];

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-xl ${currentTheme.borderHover} hover:-translate-y-1.5 transition-all duration-300 ease-out transform active:scale-[0.98] cursor-pointer flex flex-col justify-between ${className}`}
    >
      {/* Background Accent Subtle Glow */}
      <div 
        className={`absolute -right-8 -top-8 w-28 h-28 rounded-full transition-all duration-500 pointer-events-none opacity-40 group-hover:scale-150 group-hover:opacity-70 ${currentTheme.bg}`} 
      />

      {/* Card Header & Icon */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${currentTheme.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {badge && (
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentTheme.badgeBg}`}>
                {badge.text}
              </span>
            )}
            <div className="w-7 h-7 rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-colors duration-200">
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Optional Highlight Metric or Custom Children */}
      {highlightMetric && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <span className="text-[11px] font-medium text-slate-500">{highlightMetric.label}</span>
          <span className="text-sm font-bold text-slate-900 font-mono">{highlightMetric.value}</span>
        </div>
      )}

      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

