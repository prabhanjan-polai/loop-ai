'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Layers,
  Inbox,
  FileText,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Star,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { FeedbackStore } from '@/lib/store';
import { UserRole } from '@/lib/types';

export default function LandingPage() {
  const handleQuickLogin = (role: UserRole) => {
    const store = FeedbackStore.getInstance();
    store.switchRole(role);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-brand-500 selection:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient glow circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              LOOP AI
            </span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Platform v1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Launch Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-6 py-12 md:py-20 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/40 text-xs font-bold text-brand-300 shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span>Turn customer feedback into product decisions</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Centralize Feedback.{' '}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
            Automate Product Intelligence.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          LOOP AI unifies support tickets, NPS surveys, app reviews, community posts, and sales calls into sentiment scores, theme clusters, RAG Q&A, and executive sprint roadmaps.
        </p>

        {/* Quick Launch Buttons with Demo Roles */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <Link
            href="/dashboard"
            onClick={() => handleQuickLogin('ADMIN')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-2xl shadow-brand-600/40 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4" />
            <span>Enter Platform (Admin Demo)</span>
          </Link>

          <Link
            href="/dashboard/ask-loop"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Bot className="w-4 h-4 text-brand-400" />
            <span>Try Ask LOOP (RAG)</span>
          </Link>
        </div>

        {/* 1-Click Role Access Strip */}
        <div className="pt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Quick Launch as Persona:
          </span>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {(['ADMIN', 'ANALYST', 'VIEWER'] as UserRole[]).map(role => (
              <Link
                key={role}
                href="/dashboard"
                onClick={() => handleQuickLogin(role)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>{role} Mode</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Highlights Grid */}
        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 w-fit">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Auto-Classification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects sentiment scores (-1.0 to +1.0), theme tags, feature area categories, and confidence levels in real time.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Theme Clustering & Heatmaps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hierarchical sub-topic grouping, growth rate tracking (↑↑↑), and friction velocity modeling across all channels.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Voice of Customer Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates executive weekly/monthly reports with sentiment shifts, revenue at risk, and exportable PDF briefs.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400 relative z-10">
        <p>© 2026 LOOP AI – Customer Feedback Intelligence Platform. Built for PMs, Founders & Success Teams.</p>
      </footer>
    </div>
  );
}
