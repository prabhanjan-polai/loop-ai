'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Layers,
  Sparkles,
  Download,
  Trash2,
  RefreshCw,
  PlusCircle,
  Clock,
  Shield,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { FeedbackStore } from '@/lib/store';
import { FeedbackChannel, FeedbackItem, FeedbackSentiment, FeedbackStatus, FilterState } from '@/lib/types';
import { FeedbackCard } from '@/components/feedback/FeedbackCard';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';
import { ManualIngestModal } from '@/components/ingestion/ManualIngestModal';
import { cn } from '@/lib/utils';

export default function FeedbackInboxPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectingFeedback, setInspectingFeedback] = useState<FeedbackItem | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState('ADMIN');

  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    channel: 'ALL',
    sentiment: 'ALL',
    theme: 'ALL',
    status: 'ALL',
    customerTier: 'ALL',
    dateRange: 'ALL',
    urgency: 'ALL',
  });

  useEffect(() => {
    const store = FeedbackStore.getInstance();
    setFeedbacks(store.filterFeedbacks(filters));
    setCurrentUserRole(store.getCurrentUser().role);

    const unsub = store.subscribe(() => {
      setFeedbacks(store.filterFeedbacks(filters));
      setCurrentUserRole(store.getCurrentUser().role);
    });
    return unsub;
  }, [filters]);

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === feedbacks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(feedbacks.map(f => f.id));
    }
  };

  const handleBatchStatus = (newStatus: FeedbackStatus) => {
    const store = FeedbackStore.getInstance();
    store.batchUpdateStatus(selectedIds, newStatus);
    setSelectedIds([]);
  };

  const handleStatusChange = (id: string, newStatus: FeedbackStatus) => {
    const store = FeedbackStore.getInstance();
    store.updateFeedbackStatus(id, newStatus);
    if (inspectingFeedback && inspectingFeedback.id === id) {
      setInspectingFeedback({ ...inspectingFeedback, status: newStatus });
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Customer', 'Channel', 'Content', 'Sentiment', 'Score', 'Status', 'Themes', 'Date'];
    const rows = feedbacks.map(f => [
      f.id,
      `"${f.customerName}"`,
      f.channel,
      `"${f.content.replace(/"/g, '""')}"`,
      f.sentiment,
      f.sentimentScore,
      f.status,
      `"${f.themes.join(', ')}"`,
      f.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `loop_feedback_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const availableThemes = [
    'ALL',
    'Authentication & Access',
    'Billing & Subscriptions',
    'Dashboard & Analytics',
    'Integrations & API',
    'Onboarding & Setup',
    'Mobile & UX Responsiveness',
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-brand-400" />
            Feedback Inbox & Triage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized multi-channel feedback with real-time AI sentiment, theme tagging, and status triage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand-400" />
            <span>Export CSV</span>
          </button>

          {currentUserRole !== 'VIEWER' && (
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Ingest Feedback</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        {/* Top Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={e => setFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search feedback content, customer names, themes, quotes..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-500 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Multi-faceted filter pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {/* Channel */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Channel
            </label>
            <select
              value={filters.channel}
              onChange={e => setFilters({ ...filters, channel: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Channels</option>
              <option value="Support Tickets">Support Tickets</option>
              <option value="NPS Surveys">NPS Surveys</option>
              <option value="App Reviews">App Reviews</option>
              <option value="Community Posts">Community Posts</option>
              <option value="Sales Calls">Sales Calls</option>
            </select>
          </div>

          {/* Sentiment */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Sentiment
            </label>
            <select
              value={filters.sentiment}
              onChange={e => setFilters({ ...filters, sentiment: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Sentiments</option>
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NEGATIVE">Negative</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Theme Cluster
            </label>
            <select
              value={filters.theme}
              onChange={e => setFilters({ ...filters, theme: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500 truncate"
            >
              {availableThemes.map(t => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Themes' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Workflow Status
            </label>
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">1. NEW</option>
              <option value="REVIEWED">2. REVIEWED</option>
              <option value="ACTIONED">3. ACTIONED</option>
            </select>
          </div>

          {/* Customer Tier */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Customer Tier
            </label>
            <select
              value={filters.customerTier}
              onChange={e => setFilters({ ...filters, customerTier: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Tiers</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Growth">Growth</option>
              <option value="Starter">Starter</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Urgency
            </label>
            <select
              value={filters.urgency}
              onChange={e => setFilters({ ...filters, urgency: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Urgencies</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (Visible when items are selected) */}
      {selectedIds.length > 0 && currentUserRole !== 'VIEWER' && (
        <div className="glass-panel rounded-xl p-3 px-4 flex items-center justify-between border border-brand-500/40 bg-brand-950/40 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-brand-300">
              {selectedIds.length} feedback item{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Mark As:</span>
            <button
              onClick={() => handleBatchStatus('REVIEWED')}
              className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-colors"
            >
              REVIEWED
            </button>
            <button
              onClick={() => handleBatchStatus('ACTIONED')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors"
            >
              ACTIONED
            </button>
          </div>
        </div>
      )}

      {/* Feedbacks Grid List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {currentUserRole !== 'VIEWER' && (
              <button
                onClick={handleSelectAll}
                className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1.5"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === feedbacks.length}
                  onChange={handleSelectAll}
                  className="rounded bg-slate-800 border-slate-700 text-brand-600 focus:ring-0 cursor-pointer"
                />
                <span>Select All</span>
              </button>
            )}
            <span className="text-xs text-slate-400">
              Showing <strong>{feedbacks.length}</strong> matching feedback items
            </span>
          </div>
        </div>

        {feedbacks.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
            <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No matching feedback found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, channels, or sentiment filters to see more results.
            </p>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  channel: 'ALL',
                  sentiment: 'ALL',
                  theme: 'ALL',
                  status: 'ALL',
                  customerTier: 'ALL',
                  dateRange: 'ALL',
                  urgency: 'ALL',
                })
              }
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-300 border border-brand-500/30 text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedbacks.map(item => (
              <FeedbackCard
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                onSelect={handleSelectOne}
                onInspect={fb => setInspectingFeedback(fb)}
                onStatusChange={handleStatusChange}
                userRole={currentUserRole}
              />
            ))}
          </div>
        )}
      </div>

      {/* Deep-Dive Drawer */}
      <FeedbackDrawer
        item={inspectingFeedback}
        onClose={() => setInspectingFeedback(null)}
        onStatusChange={handleStatusChange}
        userRole={currentUserRole}
      />

      {/* Manual Ingest Modal */}
      <ManualIngestModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={data => {
          const store = FeedbackStore.getInstance();
          store.addFeedback(data);
        }}
      />
    </div>
  );
}
