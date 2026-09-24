'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  LifeBuoy,
  Smile,
  Star,
  MessageSquare,
  PhoneCall,
  Sparkles,
  Zap,
} from 'lucide-react';
import { FeedbackChannel, FeedbackItem } from '@/lib/types';

interface SimulatedSourceStreamProps {
  onStreamItem: (item: {
    content: string;
    channel: FeedbackChannel;
    customerName: string;
    customerTier: FeedbackItem['customerTier'];
    mrrImpact?: number;
  }) => void;
}

const STREAM_CANDIDATES = [
  {
    content: 'Users are complaining that the 2FA SMS code takes over 4 minutes during peak US morning hours.',
    channel: 'Support Tickets' as const,
    customerName: 'Marcus Wright (SecOps Lead)',
    customerTier: 'Enterprise' as const,
    mrrImpact: 54000,
  },
  {
    content: 'G2 Review: Best feedback tool we used this year. The automated executive summaries blew our VP away!',
    channel: 'App Reviews' as const,
    customerName: 'Sarah Jenkins (VP CS)',
    customerTier: 'Growth' as const,
    mrrImpact: 14000,
  },
  {
    content: 'Discord Community: Can we have dark mode default in the shareable links?',
    channel: 'Community Posts' as const,
    customerName: 'PixelMaster#9021',
    customerTier: 'Starter' as const,
    mrrImpact: 3600,
  },
  {
    content: 'Sales Call with Fintech Unicorn: They love the pgvector RAG accuracy and want SOC2 Type II cert before closing $120k deal.',
    channel: 'Sales Calls' as const,
    customerName: 'Gong Note: FinGuard Global',
    customerTier: 'Enterprise' as const,
    mrrImpact: 120000,
  },
  {
    content: 'NPS 10/10: Saved our PM squad 2 days of manual tagging every single week.',
    channel: 'NPS Surveys' as const,
    customerName: 'Director of Product (HealthTech)',
    customerTier: 'Growth' as const,
    mrrImpact: 22000,
  },
];

export function SimulatedSourceStream({ onStreamItem }: SimulatedSourceStreamProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamIndex, setStreamIndex] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isStreaming) {
      timer = setInterval(() => {
        const item = STREAM_CANDIDATES[streamIndex % STREAM_CANDIDATES.length];
        onStreamItem(item);
        setStreamIndex(prev => prev + 1);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isStreaming, streamIndex, onStreamItem]);

  const handleTriggerSingle = () => {
    const item = STREAM_CANDIDATES[streamIndex % STREAM_CANDIDATES.length];
    onStreamItem(item);
    setStreamIndex(prev => prev + 1);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Live Multi-Source Simulator</h3>
            <p className="text-xs text-slate-400">
              Streams synthetic events from Zendesk, Intercom, App Reviews, Discord & Gong Calls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerSingle}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>Inject 1 Event</span>
          </button>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isStreaming
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto-Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Start Live Feed</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2.5 text-center">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <LifeBuoy className="w-4 h-4 text-blue-400 mb-1" />
          <span className="text-[11px] font-bold text-slate-200">Zendesk / Support</span>
          <span className="text-[10px] text-emerald-400">Active Hook</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <Smile className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-[11px] font-bold text-slate-200">NPS Surveys</span>
          <span className="text-[10px] text-emerald-400">Active Hook</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <Star className="w-4 h-4 text-amber-400 mb-1" />
          <span className="text-[11px] font-bold text-slate-200">App Store / G2</span>
          <span className="text-[10px] text-emerald-400">Active Hook</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <MessageSquare className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-[11px] font-bold text-slate-200">Discord & Slack</span>
          <span className="text-[10px] text-emerald-400">Active Hook</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center">
          <PhoneCall className="w-4 h-4 text-purple-400 mb-1" />
          <span className="text-[11px] font-bold text-slate-200">Gong Sales Calls</span>
          <span className="text-[10px] text-emerald-400">Active Hook</span>
        </div>
      </div>
    </div>
  );
}
