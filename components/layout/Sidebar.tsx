'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Inbox,
  Sparkles,
  Layers,
  FileText,
  TrendingUp,
  Settings,
  PlusCircle,
  Database,
  ChevronDown,
  ShieldCheck,
  Bot,
  PieChart,
  LogOut,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { FeedbackStore } from '@/lib/store';
import { User, UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Overview & Analytics',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    label: 'Feedback Inbox',
    href: '/dashboard/inbox',
    icon: Inbox,
    badge: '12',
  },
  {
    label: 'Feedback Ingestion',
    href: '/dashboard/ingestion',
    icon: PlusCircle,
  },
  {
    label: 'Theme Clustering & Heatmap',
    href: '/dashboard/themes',
    icon: Layers,
  },
  {
    label: 'Ask LOOP (RAG Q&A)',
    href: '/dashboard/ask-loop',
    icon: Bot,
    sparkle: true,
  },
  {
    label: 'Voice of Customer Reports',
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    label: 'Executive Impact',
    href: '/dashboard/executive',
    icon: PieChart,
  },
  {
    label: 'AI Copilot & Roadmap',
    href: '/dashboard/copilot',
    icon: TrendingUp,
    badge: 'AI',
  },
  {
    label: 'Workspace & RBAC',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const store = FeedbackStore.getInstance();
    setCurrentUser(store.getCurrentUser());
    const unsub = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
    });
    return unsub;
  }, []);

  const handleRoleChange = (role: UserRole) => {
    const store = FeedbackStore.getInstance();
    store.switchRole(role);
    setIsRoleDropdownOpen(false);
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0c121e]/90 backdrop-blur-xl flex flex-col h-screen fixed top-0 left-0 z-40">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                LOOP AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Customer Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Modules
        </div>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* RBAC Role Switcher & User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="w-full p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-xs font-bold text-white">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-100 truncate max-w-[110px]">
                  {currentUser?.name || 'Loading...'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-brand-400" />
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wider',
                      currentUser?.role === 'ADMIN' && 'text-amber-400',
                      currentUser?.role === 'ANALYST' && 'text-blue-400',
                      currentUser?.role === 'VIEWER' && 'text-slate-400'
                    )}
                  >
                    {currentUser?.role || 'ADMIN'}
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Role selector dropdown */}
          {isRoleDropdownOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in">
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Switch RBAC Role
              </div>
              {(['ADMIN', 'ANALYST', 'VIEWER'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors text-left mt-0.5',
                    currentUser?.role === role
                      ? 'bg-brand-600/20 text-brand-300 font-bold border border-brand-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{role}</span>
                    <span className="text-[10px] text-slate-400">
                      {role === 'ADMIN'
                        ? 'Full access + Workspace'
                        : role === 'ANALYST'
                        ? 'Ingest & run AI analysis'
                        : 'Read-only view & Ask LOOP'}
                    </span>
                  </div>
                  {currentUser?.role === role && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
