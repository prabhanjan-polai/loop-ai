'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Zap,
  FolderTree,
  DollarSign,
} from 'lucide-react';
import { FeedbackStore } from '@/lib/store';
import { ThemeCluster, FeedbackItem } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import { FeedbackCard } from '@/components/feedback/FeedbackCard';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';

export default function ThemesPage() {
  const [themes, setThemes] = useState<ThemeCluster[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [selectedThemeName, setSelectedThemeName] = useState<string | null>(null);
  const [inspectingFeedback, setInspectingFeedback] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    const store = FeedbackStore.getInstance();
    setThemes(store.getThemes());
    setFeedbacks(store.getFeedbacks());

    if (store.getThemes().length > 0 && !selectedThemeName) {
      setSelectedThemeName(store.getThemes()[0].name);
    }

    const unsub = store.subscribe(() => {
      setThemes(store.getThemes());
      setFeedbacks(store.getFeedbacks());
    });
    return unsub;
  }, [selectedThemeName]);

  const activeTheme = themes.find(t => t.name === selectedThemeName) || themes[0];
  const themeFeedbacks = feedbacks.filter(f => f.themes.includes(activeTheme?.name || ''));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-brand-400" />
            AI Theme Clustering & Growth Heatmap
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hierarchical semantic clustering of customer conversations, sub-topic hierarchies, and friction velocity.
          </p>
        </div>

        <Link
          href="/dashboard/copilot"
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Sprint Prioritization</span>
        </Link>
      </div>

      {/* Theme Growth Velocity Heatmap Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Theme Growth Heatmap Matrix
          </span>
          <span className="text-xs text-slate-400">
            Calculated over the last 30-day feedback ingestion window
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {themes.map(t => {
            const isSelected = t.name === activeTheme?.name;
            const isHighGrowth = t.growthRate >= 30;
            const isNegativeScore = t.avgSentimentScore < -0.2;

            return (
              <button
                key={t.id}
                onClick={() => setSelectedThemeName(t.name)}
                className={cn(
                  'p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group',
                  isSelected
                    ? 'bg-brand-950/40 border-brand-500 shadow-lg shadow-brand-500/20 ring-1 ring-brand-500'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t.category}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-bold px-1.5 py-0.5 rounded',
                        t.growthRate > 0
                          ? isHighGrowth
                            ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                            : 'text-amber-400 bg-amber-500/10'
                          : 'text-emerald-400 bg-emerald-500/10'
                      )}
                    >
                      {t.growthRate > 0 ? `+${t.growthRate}%` : `${t.growthRate}%`}{' '}
                      {t.growthRate >= 40 ? '↑↑↑' : t.growthRate >= 20 ? '↑↑' : '↑'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {t.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">{t.count} items</span>
                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      isNegativeScore
                        ? 'text-rose-400 bg-rose-500/10'
                        : 'text-emerald-400 bg-emerald-500/10'
                    )}
                  >
                    {t.avgSentimentScore > 0 ? `+${t.avgSentimentScore}` : t.avgSentimentScore}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Theme Deep Dive & Subtopics Tree */}
      {activeTheme && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Theme Details & Sub-Topic Tree */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
            <div className="pb-4 border-b border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-1">
                Cluster Deep Dive
              </span>
              <h2 className="text-lg font-bold text-white">{activeTheme.name}</h2>
              <p className="text-xs text-slate-400 mt-1">{activeTheme.description}</p>
            </div>

            {/* Subthemes / Hierarchical Tree */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                <FolderTree className="w-4 h-4 text-brand-400" />
                Sub-Topic Breakdown Tree
              </span>

              <div className="space-y-2.5">
                {activeTheme.subThemes.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">
                        {idx + 1}. {sub.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                        {sub.count} mentions
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      &ldquo;{sub.sampleQuote}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Action & ARR at Risk */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-950/30 via-indigo-950/20 to-slate-900 border border-brand-500/30 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block mb-1">
                  AI Suggested Product Action
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {activeTheme.suggestedAction}
                </p>
              </div>

              {activeTheme.revenueAtRisk && activeTheme.revenueAtRisk > 0 && (
                <div className="pt-2 border-t border-brand-500/20 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Enterprise Revenue at Risk:</span>
                  <span className="font-bold text-rose-400">
                    {formatCurrency(activeTheme.revenueAtRisk)} ARR
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right 2 Columns: Feedbacks in this theme */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Customer Voices in &ldquo;{activeTheme.name}&rdquo; ({themeFeedbacks.length})
              </span>
              <span className="text-xs text-slate-400">
                Ranked by urgency & impact
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {themeFeedbacks.map(fb => (
                <FeedbackCard
                  key={fb.id}
                  item={fb}
                  onInspect={item => setInspectingFeedback(item)}
                  onStatusChange={(id, st) => {
                    const store = FeedbackStore.getInstance();
                    store.updateFeedbackStatus(id, st);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      <FeedbackDrawer
        item={inspectingFeedback}
        onClose={() => setInspectingFeedback(null)}
        onStatusChange={(id, st) => {
          const store = FeedbackStore.getInstance();
          store.updateFeedbackStatus(id, st);
        }}
      />
    </div>
  );
}
