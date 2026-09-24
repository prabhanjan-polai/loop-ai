'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Target,
  Zap,
  Sliders,
  Send,
  Layers,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CopilotPage() {
  const [query, setQuery] = useState('What should we prioritize next sprint?');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const roadmapItems = [
    {
      id: 'PRI-1',
      title: 'Fix Okta/SAML Session Timeout & Safari Refresh Bug',
      theme: 'Authentication & Access',
      impactScore: 94,
      effort: 'Medium (3 days)',
      revenueProtected: 184000,
      feedbackCount: 14,
      urgency: 'P0 - CRITICAL',
      rationale: 'Top friction driver across 6 enterprise accounts. Directly prevents contract churn escalations.',
      suggestedSquad: 'Auth & Security Squad',
    },
    {
      id: 'PRI-2',
      title: 'Deploy Self-Serve Monthly VAT Invoice Downloads',
      theme: 'Billing & Subscriptions',
      impactScore: 88,
      effort: 'Low (1.5 days)',
      revenueProtected: 110000,
      feedbackCount: 11,
      urgency: 'P1 - HIGH',
      rationale: 'Highest ROI task: Low engineering effort eliminates ~40 manual FinOps support tickets monthly.',
      suggestedSquad: 'Billing & Growth Squad',
    },
    {
      id: 'PRI-3',
      title: 'Async Background Queue for Large CSV/PDF Analytics Exports',
      theme: 'Dashboard & Analytics',
      impactScore: 76,
      effort: 'Medium (3.5 days)',
      revenueProtected: 52000,
      feedbackCount: 16,
      urgency: 'P1 - HIGH',
      rationale: 'Resolves client-side browser tab crashes when exporting >50,000 rows.',
      suggestedSquad: 'Data Platform Squad',
    },
    {
      id: 'PRI-4',
      title: 'Official Bi-Directional Linear & Jira Integration',
      theme: 'Integrations & API',
      impactScore: 68,
      effort: 'High (5 days)',
      revenueProtected: 60000,
      feedbackCount: 9,
      urgency: 'P2 - MEDIUM',
      rationale: 'Unblocks sales deal for enterprise prospect requiring automated engineering handoffs.',
      suggestedSquad: 'Ecosystem Squad',
    },
  ];

  const handleRunCopilot = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setHasRun(true);
    }, 700);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-brand-400" />
            AI Copilot & Sprint Prioritizer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic priority ranking matrix based on customer volume, sentiment urgency, and enterprise revenue impact.
          </p>
        </div>

        <button
          onClick={handleRunCopilot}
          disabled={isSynthesizing}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSynthesizing ? 'Calculating Priority Matrix...' : 'Re-Run Sprint Prioritizer'}</span>
        </button>
      </div>

      {/* Interactive Query Box */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-500 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={handleRunCopilot}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shrink-0 transition-colors"
          >
            Ask Copilot
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="font-semibold">Quick Copilot Prompts:</span>
          <button
            onClick={() => {
              setQuery('What are our highest ROI quick wins?');
              handleRunCopilot();
            }}
            className="text-brand-300 hover:underline"
          >
            &ldquo;Highest ROI quick wins?&rdquo;
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setQuery('Which bugs put enterprise revenue at risk?');
              handleRunCopilot();
            }}
            className="text-brand-300 hover:underline"
          >
            &ldquo;Which bugs threaten enterprise ARR?&rdquo;
          </button>
        </div>
      </div>

      {/* Suggested Sprint Roadmap Cards */}
      {hasRun && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-brand-400" />
              Prioritized Sprint Backlog (Ranked 1 to 4)
            </span>
            <span className="text-xs text-slate-400">
              Total Protected ARR: <strong className="text-emerald-400">$406,000</strong>
            </span>
          </div>

          <div className="space-y-3">
            {roadmapItems.map((item, idx) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-800 text-brand-300 border border-slate-700">
                      Rank #{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.urgency.startsWith('P0')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : item.urgency.startsWith('P1')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {item.urgency}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Theme: {item.theme}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.rationale}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>
                      Squad: <strong className="text-slate-200">{item.suggestedSquad}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Effort: <strong className="text-slate-200">{item.effort}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Feedback Volume: <strong className="text-slate-200">{item.feedbackCount} items</strong>
                    </span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Protected ARR
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      {formatCurrency(item.revenueProtected)}
                    </span>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Impact Score
                    </span>
                    <span className="text-sm font-bold text-brand-300">
                      {item.impactScore} / 100
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
