import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  glowColor?: 'indigo' | 'emerald' | 'rose' | 'amber';
}

export function StatCard({
  title,
  value,
  change,
  isPositive,
  subtitle,
  icon: Icon,
  iconColor = 'text-brand-400',
  glowColor,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-200 border border-slate-800/80 hover:border-slate-700',
        glowColor === 'indigo' && 'hover:shadow-[0_0_20px_-3px_rgba(99,102,241,0.25)]',
        glowColor === 'emerald' && 'hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)]',
        glowColor === 'rose' && 'hover:shadow-[0_0_20px_-3px_rgba(244,63,94,0.25)]',
        glowColor === 'amber' && 'hover:shadow-[0_0_20px_-3px_rgba(245,158,11,0.25)]'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={cn('p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {change && (
          <span
            className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5',
              isPositive
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
            )}
          >
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
