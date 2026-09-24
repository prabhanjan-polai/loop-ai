'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingDown,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  PieChart,
  Building,
} from 'lucide-react';
import { FeedbackStore } from '@/lib/store';
import { FeedbackItem, ThemeCluster } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/ui/StatCard';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';

export default function ExecutiveDashboardPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [themes, setThemes] = useState<ThemeCluster[]>([]);
  const [inspectingFeedback, setInspectingFeedback] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    const store = FeedbackStore.getInstance();
    setFeedbacks(store.getFeedbacks());
    setThemes(store.getThemes());

    const unsub = store.subscribe(() => {
      setFeedbacks(store.getFeedbacks());
      setThemes(store.getThemes());
    });
    return unsub;
  }, []);

  // Filter enterprise at-risk accounts
  const enterpriseNegative = feedbacks.filter(
    f => f.customerTier === 'Enterprise' && f.sentiment === 'NEGATIVE'
  );

  const totalRevenueAtRisk = enterpriseNegative.reduce(
    (acc, curr) => acc + (curr.mrrImpact || 35000),
    0
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <PieChart className="w-6 h-6 text-brand-400" />
            Executive & Founder Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revenue risk modeling, churn indicators, and enterprise account health tracking.
          </p>
        </div>

        <Link
          href="/dashboard/copilot"
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Open AI Copilot</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue at Risk"
          value={formatCurrency(totalRevenueAtRisk || 245000)}
          change="6 Enterprise AC"
          isPositive={false}
          subtitle="Linked to negative feedback"
          icon={DollarSign}
          iconColor="text-rose-400"
          glowColor="rose"
        />

        <StatCard
          title="Churn Risk Index"
          value="Medium (14%)"
          change="-2.1% this month"
          isPositive={true}
          subtitle="Across tier 1 contracts"
          icon={TrendingDown}
          iconColor="text-amber-400"
          glowColor="amber"
        />

        <StatCard
          title="Accounts In Danger"
          value={enterpriseNegative.length || 5}
          change="3 urgent"
          isPositive={false}
          subtitle="Authentication & billing blockers"
          icon={Building}
          iconColor="text-purple-400"
          glowColor="indigo"
        />

        <StatCard
          title="Retention Opportunity"
          value="$380k ARR"
          change="High ROI"
          isPositive={true}
          subtitle="If top 2 sprint actions deploy"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          glowColor="emerald"
        />
      </div>

      {/* Main Founder Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enterprise Accounts at Risk Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Enterprise Accounts at Risk (Negative Sentiment)
              </h3>
              <p className="text-xs text-slate-400">High-value contracts signaling friction</p>
            </div>
          </div>

          <div className="space-y-3">
            {enterpriseNegative.map(item => (
              <div
                key={item.id}
                onClick={() => setInspectingFeedback(item)}
                className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                      {item.customerName}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {item.customerTier}
                    </span>
                    <span className="text-[10px] font-bold text-rose-400">
                      {item.urgency} Urgency
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">ARR Value</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {formatCurrency(item.mrrImpact)}
                  </span>
                  <span className="text-[10px] text-brand-400 flex items-center justify-end gap-1 mt-1 group-hover:underline">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Top Churn Indicators Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Key Churn Indicators
              </h3>
              <p className="text-xs text-slate-400">Root causes identified by AI classification</p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">1. SSO / Okta Session Drops</span>
                  <span className="text-rose-400 font-bold">$184k ARR</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Developers getting logged out every 20 minutes triggers executive escalation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">2. Missing VAT Invoices</span>
                  <span className="text-amber-400 font-bold">$110k ARR</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Finance teams refusing annual renewals until automated receipts are supported.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">3. Large Export Freezes</span>
                  <span className="text-amber-400 font-bold">$52k ARR</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Operations analysts cannot download 50k+ quarterly reports without browser crashes.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/copilot"
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
          >
            <span>Review Recommended Sprint Fixes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Deep-dive drawer */}
      <FeedbackDrawer
        item={inspectingFeedback}
        onClose={() => setInspectingFeedback(null)}
      />
    </div>
  );
}
