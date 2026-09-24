'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Layers,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Tag,
  DollarSign,
  Copy,
  Clock,
  User,
  Share2,
} from 'lucide-react';
import { FeedbackItem } from '@/lib/types';
import { cn, formatCurrency, formatDate, getSentimentBadge, getStatusBadge } from '@/lib/utils';

interface FeedbackDrawerProps {
  item: FeedbackItem | null;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: FeedbackItem['status']) => void;
  userRole?: string;
}

export function FeedbackDrawer({
  item,
  onClose,
  onStatusChange,
  userRole,
}: FeedbackDrawerProps) {
  const [copiedJira, setCopiedJira] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  if (!item) return null;

  const sentiment = getSentimentBadge(item.sentiment);
  const status = getStatusBadge(item.status);

  const handleCreateJiraTicket = () => {
    const mockId = `PROD-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedTicketId(mockId);
    setCopiedJira(true);
    setTimeout(() => setCopiedJira(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl h-full bg-[#0c121e] border-l border-slate-800 p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Feedback Deep-Dive</h3>
                <p className="text-xs text-slate-400">Feedback ID: {item.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Customer Metadata Bar */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Customer & Channel
              </span>
              <p className="text-xs font-semibold text-slate-200 truncate">{item.customerName}</p>
              <span className="text-[11px] text-slate-400">{item.channel} • {item.customerTier}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                ARR Impact
              </span>
              <p className="text-xs font-bold text-emerald-400">{formatCurrency(item.mrrImpact)}</p>
              <span className="text-[11px] text-slate-400">Recorded {formatDate(item.createdAt)}</span>
            </div>
          </div>

          {/* Verbatim Feedback Content */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-5 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-2">
              Verbatim Feedback
            </span>
            <p className="text-sm text-slate-100 font-normal leading-relaxed italic">
              &ldquo;{item.content}&rdquo;
            </p>
          </div>

          {/* AI Auto-Classification Engine Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-brand-400" />
                AI Classification Breakdown
              </h4>
              <span className="text-xs font-semibold text-brand-300">
                {Math.round(item.confidenceScore * 100)}% Confidence
              </span>
            </div>

            {/* Sentiment Meter */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Sentiment Valence</span>
                <span className={cn('font-bold px-2 py-0.5 rounded-full border text-[11px]', sentiment.color)}>
                  {sentiment.label} ({item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore})
                </span>
              </div>
              {/* Progress bar visual */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{ width: `${Math.max(0, -item.sentimentScore * 50 + 50)}%` }}
                />
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${Math.max(0, item.sentimentScore * 50 + 50)}%` }}
                />
              </div>
            </div>

            {/* Themes & Feature Areas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Primary Theme
                </span>
                <p className="text-xs font-bold text-brand-300">{item.themes.join(', ')}</p>
                {item.subThemes && item.subThemes.length > 0 && (
                  <p className="text-[11px] text-slate-400 mt-0.5">Subtopic: {item.subThemes.join(', ')}</p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Feature Area
                </span>
                <p className="text-xs font-bold text-slate-200">{item.featureArea}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Urgency: {item.urgency}</p>
              </div>
            </div>

            {/* AI Suggested Action */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950/40 via-indigo-950/30 to-slate-900 border border-brand-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Recommended Product Action
              </span>
              <p className="text-xs font-medium text-slate-200 leading-relaxed">
                {item.themes.includes('Authentication & Access')
                  ? 'Extend session lifetime, fix SAML token expiration bug in Safari, and add biometric passkey.'
                  : item.themes.includes('Billing & Subscriptions')
                  ? 'Deploy self-serve VAT invoice PDF downloads and add explicit confirmation warning on seat additions.'
                  : item.themes.includes('Dashboard & Analytics')
                  ? 'Offload export queries to asynchronous Redis background worker to prevent client tab freezes.'
                  : 'Prioritize issue in upcoming sprint grooming with the engineering squad.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
          {/* Status workflow updater */}
          {userRole !== 'VIEWER' && onStatusChange && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Update Workflow Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['NEW', 'REVIEWED', 'ACTIONED'] as FeedbackItem['status'][]).map(st => (
                  <button
                    key={st}
                    onClick={() => onStatusChange(item.id, st)}
                    className={cn(
                      'py-2 px-3 rounded-xl text-xs font-bold border transition-all',
                      item.status === st
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Export to Jira/Linear Simulator */}
          <div className="flex gap-2">
            <button
              onClick={handleCreateJiraTicket}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              {createdTicketId ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Created {createdTicketId} in Linear</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 text-brand-400" />
                  <span>Sync to Jira / Linear</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
