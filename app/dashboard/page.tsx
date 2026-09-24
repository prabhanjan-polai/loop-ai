'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  Inbox,
  ArrowRight,
  Layers,
  Bot,
  Filter,
  RefreshCw,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { FeedbackStore } from '@/lib/store';
import { FeedbackItem, ThemeCluster } from '@/lib/types';
import { FeedbackCard } from '@/components/feedback/FeedbackCard';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';
import { formatCurrency } from '@/lib/utils';

export default function DashboardOverviewPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [themes, setThemes] = useState<ThemeCluster[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

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

  // Compute Metrics
  const totalCount = feedbacks.length;
  const posCount = feedbacks.filter(f => f.sentiment === 'POSITIVE').length;
  const neuCount = feedbacks.filter(f => f.sentiment === 'NEUTRAL').length;
  const negCount = feedbacks.filter(f => f.sentiment === 'NEGATIVE').length;
  const negPercent = totalCount > 0 ? Math.round((negCount / totalCount) * 100) : 0;
  const actionedCount = feedbacks.filter(f => f.status === 'ACTIONED').length;
  const actionedPercent = totalCount > 0 ? Math.round((actionedCount / totalCount) * 100) : 0;

  // Chart Data: Volume Over Time (Last 7 Days)
  const volumeData = [
    { day: 'Mon', Support: 12, NPS: 6, Reviews: 4, Community: 8, Sales: 3 },
    { day: 'Tue', Support: 15, NPS: 9, Reviews: 5, Community: 10, Sales: 4 },
    { day: 'Wed', Support: 19, NPS: 12, Reviews: 7, Community: 11, Sales: 6 },
    { day: 'Thu', Support: 14, NPS: 8, Reviews: 6, Community: 9, Sales: 5 },
    { day: 'Fri', Support: 22, NPS: 15, Reviews: 9, Community: 14, Sales: 8 },
    { day: 'Sat', Support: 10, NPS: 5, Reviews: 8, Community: 12, Sales: 2 },
    { day: 'Sun', Support: feedbacks.length > 20 ? feedbacks.length : 18, NPS: 11, Reviews: 6, Community: 9, Sales: 4 },
  ];

  // Sentiment Breakdown Donut Data
  const sentimentDonutData = [
    { name: 'Positive', value: posCount, color: '#10b981' },
    { name: 'Neutral', value: neuCount, color: '#f59e0b' },
    { name: 'Negative', value: negCount, color: '#f43f5e' },
  ];

  // Top Themes Bar Data
  const themeBarData = themes.slice(0, 5).map(t => ({
    name: t.name.split(' ')[0], // Short name
    fullName: t.name,
    count: t.count,
    score: t.avgSentimentScore,
    growth: t.growthRate,
  }));

  const handleStatusChange = (id: string, newStatus: FeedbackItem['status']) => {
    const store = FeedbackStore.getInstance();
    store.updateFeedbackStatus(id, newStatus);
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback({ ...selectedFeedback, status: newStatus });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              Customer Feedback Intelligence
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-400" />
              Realtime AI Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Turn multi-channel customer feedback into data-driven product decisions and prioritized sprints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/ask-loop"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all group"
          >
            <Bot className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Ask LOOP AI</span>
          </Link>

          <Link
            href="/dashboard/ingestion"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-brand-400" />
            <span>Add Feedback</span>
          </Link>
        </div>
      </div>

      {/* Top KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Feedback"
          value={totalCount}
          change="+18% this wk"
          isPositive={true}
          subtitle="Across 5 connected channels"
          icon={Inbox}
          iconColor="text-brand-400"
          glowColor="indigo"
        />

        <StatCard
          title="Negative % Rate"
          value={`${negPercent}%`}
          change="-4.2% vs prev"
          isPositive={true}
          subtitle={`${negCount} critical / action items`}
          icon={Frown}
          iconColor="text-rose-400"
          glowColor="rose"
        />

        <StatCard
          title="Actioned Velocity"
          value={`${actionedPercent}%`}
          change="+12% resolved"
          isPositive={true}
          subtitle={`${actionedCount} issues converted to roadmap`}
          icon={TrendingUp}
          iconColor="text-emerald-400"
          glowColor="emerald"
        />

        <StatCard
          title="Top Friction Area"
          value={themes[0]?.name.split(' ')[0] || 'Authentication'}
          change={`+${themes[0]?.growthRate || 48}% surge`}
          isPositive={false}
          subtitle="Priority 1 Next Sprint"
          icon={AlertTriangle}
          iconColor="text-amber-400"
          glowColor="amber"
        />
      </div>

      {/* Visual Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Volume Over Time Area Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-400" />
                Feedback Volume Growth by Channel
              </h3>
              <p className="text-xs text-slate-400">Daily ingested feedback distribution across channels</p>
            </div>
            <span className="text-[11px] font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
              Live Aggregate
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSupport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCommunity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Support" stroke="#6366f1" fillOpacity={1} fill="url(#colorSupport)" strokeWidth={2} />
                <Area type="monotone" dataKey="Community" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCommunity)" strokeWidth={2} />
                <Area type="monotone" dataKey="Reviews" stroke="#f59e0b" fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="Sales" stroke="#a855f7" fill="none" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Sentiment Breakdown Donut */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smile className="w-4 h-4 text-emerald-400" />
              Sentiment Breakdown
            </h3>
            <p className="text-xs text-slate-400">Total customer emotional distribution</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">{totalCount}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Items</span>
            </div>
          </div>

          {/* Sentiment legend pills */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-400">{posCount}</span>
              <p className="text-[10px] text-slate-400 font-semibold">Positive</p>
            </div>
            <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/20">
              <span className="text-xs font-bold text-amber-400">{neuCount}</span>
              <p className="text-[10px] text-slate-400 font-semibold">Neutral</p>
            </div>
            <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/20">
              <span className="text-xs font-bold text-rose-400">{negCount}</span>
              <p className="text-[10px] text-slate-400 font-semibold">Negative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Themes & Growth Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top Themes Bar Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                Top Discussed Themes & Volume
              </h3>
              <p className="text-xs text-slate-400">Frequency of feedback mapped by AI topic detection</p>
            </div>
            <Link
              href="/dashboard/themes"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>Explore All Clusters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={themeBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="fullName" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: AI Quick Insights Widget */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Realtime Insights
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                LIVE
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-xs font-bold text-slate-200">SSO Timeout Spike</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Authentication complaints grew by <strong>+48%</strong> this week. 6 Enterprise customers flagged 20-min session drops.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-xs font-bold text-slate-200">Billing Invoice Demand</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Self-serve VAT invoice downloads is the #1 requested feature by finance leads.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-xs font-bold text-slate-200">Slack Integration Praise</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Sentiment on integrations reached <strong>+0.52 (Positive)</strong> following the Slack bot rollout.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/copilot"
            className="mt-4 w-full py-2.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 text-brand-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View AI Prioritized Sprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent High Urgency Feedback Feed */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-400" />
              Recent Ingested Feedback & Action Items
            </h3>
            <p className="text-xs text-slate-400">Click any card for full AI sentiment analysis, quote inspector, and Linear/Jira sync</p>
          </div>
          <Link
            href="/dashboard/inbox"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>Open Full Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.slice(0, 6).map(item => (
            <FeedbackCard
              key={item.id}
              item={item}
              onInspect={fb => setSelectedFeedback(fb)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>

      {/* Deep-dive drawer */}
      <FeedbackDrawer
        item={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
