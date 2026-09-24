'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  Plus,
  RefreshCw,
  Search,
  Bell,
  CheckCircle,
  Shield,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { FeedbackStore } from '@/lib/store';
import { User, Workspace } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  useEffect(() => {
    const store = FeedbackStore.getInstance();
    setCurrentUser(store.getCurrentUser());
    setWorkspace(store.getWorkspace());

    const unsub = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setWorkspace(store.getWorkspace());
    });
    return unsub;
  }, []);

  const handleResetData = () => {
    setIsResetting(true);
    const store = FeedbackStore.getInstance();
    store.resetToSampleData();
    setShowNotificationToast(true);
    setTimeout(() => {
      setIsResetting(false);
      setTimeout(() => setShowNotificationToast(false), 3000);
    }, 400);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between ml-64">
      {/* Left: Workspace & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-xs font-bold text-slate-200">{workspace?.name || 'Acme SaaS Cloud'}</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold border border-emerald-500/20">
            {workspace?.plan || 'Enterprise AI'}
          </span>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Ask LOOP Quick Trigger */}
        <Link
          href="/dashboard/ask-loop"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600/30 to-violet-600/30 border border-brand-500/40 text-brand-200 hover:text-white hover:border-brand-400 text-xs font-semibold transition-all group"
        >
          <Bot className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
          <span>Ask LOOP AI</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-brand-900/50 border border-brand-700/50 rounded text-brand-300 font-mono">
            ⌘K
          </kbd>
        </Link>

        {/* Quick Ingest Button (disabled for Viewer) */}
        {currentUser?.role !== 'VIEWER' ? (
          <Link
            href="/dashboard/ingestion"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest Feedback</span>
          </Link>
        ) : (
          <span className="text-[11px] text-slate-400 px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
            Viewer Mode (Read Only)
          </span>
        )}

        {/* Reset Demo Data Button */}
        <button
          onClick={handleResetData}
          disabled={isResetting}
          title="Reset back to standard sample dataset"
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className={cn('w-4 h-4', isResetting && 'animate-spin text-brand-400')} />
        </button>

        {/* Current Active Role Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
          <Shield className="w-3 h-3 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-300">
            {currentUser?.role}
          </span>
        </div>
      </div>

      {/* Toast alert */}
      {showNotificationToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Demo dataset reset successfully!</span>
        </div>
      )}
    </header>
  );
}
