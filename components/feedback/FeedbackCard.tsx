'use client';

import React from 'react';
import {
  MessageSquare,
  LifeBuoy,
  Smile,
  Star,
  PhoneCall,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { FeedbackItem } from '@/lib/types';
import { cn, formatCurrency, formatDate, formatTimeAgo, getSentimentBadge, getStatusBadge } from '@/lib/utils';

interface FeedbackCardProps {
  item: FeedbackItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onInspect: (item: FeedbackItem) => void;
  onStatusChange?: (id: string, newStatus: FeedbackItem['status']) => void;
  userRole?: string;
}

export function FeedbackCard({
  item,
  isSelected,
  onSelect,
  onInspect,
  onStatusChange,
  userRole,
}: FeedbackCardProps) {
  const sentiment = getSentimentBadge(item.sentiment);
  const status = getStatusBadge(item.status);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Support Tickets':
        return <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />;
      case 'NPS Surveys':
        return <Smile className="w-3.5 h-3.5 text-emerald-400" />;
      case 'App Reviews':
        return <Star className="w-3.5 h-3.5 text-amber-400" />;
      case 'Sales Calls':
        return <PhoneCall className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-5 transition-all duration-200 border border-slate-800/80 hover:border-slate-700 relative flex flex-col justify-between group',
        isSelected && 'border-brand-500/80 bg-brand-950/20 shadow-lg shadow-brand-500/10',
        item.urgency === 'CRITICAL' && 'border-rose-900/40'
      )}
    >
      {/* Card Header: Channel, Customer, Tier, Date */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {onSelect && userRole !== 'VIEWER' && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(item.id)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-brand-600 focus:ring-0 cursor-pointer"
              />
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-300">
              {getChannelIcon(item.channel)}
              <span>{item.channel}</span>
            </div>
            <span
              className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                item.customerTier === 'Enterprise' && 'bg-purple-500/10 text-purple-300 border-purple-500/30',
                item.customerTier === 'Growth' && 'bg-blue-500/10 text-blue-300 border-blue-500/30',
                item.customerTier === 'Starter' && 'bg-slate-800 text-slate-300 border-slate-700'
              )}
            >
              {item.customerTier}
            </span>
            {item.mrrImpact && item.mrrImpact > 0 && (
              <span className="text-[10px] font-semibold text-slate-400">
                {formatCurrency(item.mrrImpact)} ARR
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {item.urgency === 'CRITICAL' && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                <ShieldAlert className="w-3 h-3" />
                CRITICAL
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatTimeAgo(item.createdAt)}
            </span>
          </div>
        </div>

        {/* Customer label */}
        <p className="text-xs font-semibold text-slate-300 mb-2">
          {item.customerName}
        </p>

        {/* Feedback Content Text */}
        <p className="text-sm text-slate-200 leading-relaxed line-clamp-3 mb-4 font-normal">
          &ldquo;{item.content}&rdquo;
        </p>
      </div>

      {/* AI Tags, Sentiment & Workflow Status */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        {/* Themes & Feature Area Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {item.themes.map(t => (
            <span
              key={t}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-300 border border-brand-500/20"
            >
              #{t}
            </span>
          ))}
          {item.subThemes && item.subThemes.length > 0 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
              {item.subThemes[0]}
            </span>
          )}
        </div>

        {/* Footer Actions: Sentiment score + Status workflow button + Deep inspect */}
        <div className="flex items-center justify-between gap-2">
          {/* Sentiment Badge */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5',
                sentiment.color
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', sentiment.dot)} />
              {sentiment.label} ({item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore})
            </span>
            <span className="text-[10px] text-slate-400">
              {Math.round(item.confidenceScore * 100)}% AI Conf.
            </span>
          </div>

          {/* Status Workflow Selector */}
          <div className="flex items-center gap-2">
            {userRole !== 'VIEWER' && onStatusChange ? (
              <select
                value={item.status}
                onChange={e => onStatusChange(item.id, e.target.value as FeedbackItem['status'])}
                className={cn(
                  'text-[11px] font-bold px-2 py-1 rounded-lg border bg-slate-900 cursor-pointer transition-colors',
                  status.color
                )}
              >
                <option value="NEW" className="bg-slate-900 text-blue-400">1. NEW</option>
                <option value="REVIEWED" className="bg-slate-900 text-purple-400">2. REVIEWED</option>
                <option value="ACTIONED" className="bg-slate-900 text-emerald-400">3. ACTIONED</option>
              </select>
            ) : (
              <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded border', status.color)}>
                {status.label}
              </span>
            )}

            <button
              onClick={() => onInspect(item)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Inspect AI Analysis & Customer Details"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
