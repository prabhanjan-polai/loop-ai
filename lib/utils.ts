import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FeedbackSentiment, FeedbackStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function getSentimentBadge(sentiment: FeedbackSentiment) {
  switch (sentiment) {
    case 'POSITIVE':
      return {
        label: 'Positive',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        dot: 'bg-emerald-400',
        hex: '#10b981',
      };
    case 'NEGATIVE':
      return {
        label: 'Negative',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        dot: 'bg-rose-400',
        hex: '#f43f5e',
      };
    case 'NEUTRAL':
    default:
      return {
        label: 'Neutral',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        dot: 'bg-amber-400',
        hex: '#f59e0b',
      };
  }
}

export function getStatusBadge(status: FeedbackStatus) {
  switch (status) {
    case 'NEW':
      return {
        label: 'New',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        step: 1,
      };
    case 'REVIEWED':
      return {
        label: 'Reviewed',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        step: 2,
      };
    case 'ACTIONED':
      return {
        label: 'Actioned',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        step: 3,
      };
  }
}

export function getChannelIconName(channel: string): string {
  switch (channel) {
    case 'Support Tickets':
      return 'LifeBuoy';
    case 'NPS Surveys':
      return 'Smile';
    case 'App Reviews':
      return 'Star';
    case 'Community Posts':
      return 'MessageSquare';
    case 'Sales Calls':
      return 'PhoneCall';
    default:
      return 'Inbox';
  }
}

export function formatCurrency(val?: number): string {
  if (!val) return '$0';
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
}
