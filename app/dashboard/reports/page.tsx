'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Share2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Printer,
  Calendar,
  Layers,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { FeedbackStore } from '@/lib/store';
import { VoCReport } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const [reports, setReports] = useState<VoCReport[]>([]);
  const [activeReport, setActiveReport] = useState<VoCReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const store = FeedbackStore.getInstance();
    const allReps = store.getReports();
    setReports(allReps);
    if (allReps.length > 0 && !activeReport) {
      setActiveReport(allReps[0]);
    }

    const unsub = store.subscribe(() => {
      const updated = store.getReports();
      setReports(updated);
    });
    return unsub;
  }, [activeReport]);

  const handleGenerate = (timeframe: 'Weekly' | 'Monthly' | 'Quarterly') => {
    setIsGenerating(true);
    const store = FeedbackStore.getInstance();
    setTimeout(() => {
      const newRep = store.generateNewReport(timeframe);
      setActiveReport(newRep);
      setIsGenerating(false);
    }, 600);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-brand-400" />
            Voice of Customer (VoC) Executive Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated leadership-ready intelligence syntheses, sentiment shift analyses, and prioritized sprint roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareLink}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-brand-400" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-brand-400" />
            <span>Export PDF / Print</span>
          </button>

          <button
            onClick={() => handleGenerate('Weekly')}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate Fresh VoC Report'}</span>
          </button>
        </div>
      </div>

      {/* Timeframe Selector tabs */}
      <div className="flex items-center gap-2">
        {(['Weekly', 'Monthly', 'Quarterly'] as const).map(tf => (
          <button
            key={tf}
            onClick={() => handleGenerate(tf)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              activeReport?.timeframe === tf
                ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tf} Report
          </button>
        ))}
      </div>

      {/* Main Executive Document Sheet */}
      {activeReport && (
        <div className="glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl space-y-8 bg-[#0b101c]/95 print:bg-white print:text-black print:border-none print:shadow-none">
          {/* Document Header */}
          <div className="pb-6 border-b border-slate-800 print:border-gray-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400 print:text-indigo-600">
                  LOOP AI • EXECUTIVE INTELLIGENCE BRIEF
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white print:text-black mt-1">
                  {activeReport.title}
                </h2>
                <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                  Date Range: <strong>{activeReport.dateRange}</strong> • Generated on {activeReport.generatedAt}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-right print:bg-gray-100 print:border-gray-300">
                <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-500 block">
                  Overall Sentiment Health
                </span>
                <span className="text-lg font-black text-emerald-400 print:text-emerald-700">
                  {activeReport.overallSentimentScore > 0 ? `+${activeReport.overallSentimentScore}` : activeReport.overallSentimentScore}
                </span>
                <p className="text-[11px] text-emerald-400 print:text-emerald-600 font-semibold">{activeReport.sentimentTrend}</p>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary KPIs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-700 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              1. Key Observations & Leadership Highlights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-gray-500">
                  Total Customer Ingest
                </span>
                <p className="text-xl font-bold text-white print:text-black">{activeReport.totalFeedbackCount} Items</p>
                <p className="text-[11px] text-slate-400 print:text-gray-600">Across Support, NPS, App Reviews, Community, Sales</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-gray-500">
                  Enterprise Revenue at Risk
                </span>
                <p className="text-xl font-bold text-rose-400 print:text-red-600">
                  {formatCurrency(activeReport.revenueRiskSummary.atRiskArr)} ARR
                </p>
                <p className="text-[11px] text-slate-400 print:text-gray-600">
                  {activeReport.revenueRiskSummary.affectedEnterpriseCount} high-value accounts flagged friction
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-gray-500">
                  Top Recommended P0
                </span>
                <p className="text-sm font-bold text-brand-300 print:text-indigo-800 truncate">
                  {activeReport.recommendedSprintActions[0]?.title || 'SSO Token Expiry'}
                </p>
                <p className="text-[11px] text-slate-400 print:text-gray-600">
                  Assigned to {activeReport.recommendedSprintActions[0]?.suggestedOwner}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Sentiment Shifts Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-700 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
              2. Month-over-Month Sentiment Shifts
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 print:bg-gray-100 text-slate-400 print:text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800 print:border-gray-300">
                  <tr>
                    <th className="p-3">Product Area</th>
                    <th className="p-3">Previous</th>
                    <th className="p-3">Current</th>
                    <th className="p-3">Delta</th>
                    <th className="p-3">AI Context & Root Cause</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                  {activeReport.sentimentShifts.map((shift, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white print:text-black">{shift.area}</td>
                      <td className="p-3 text-slate-400 print:text-gray-600">{shift.previousScore}</td>
                      <td className="p-3 font-semibold text-slate-200 print:text-black">{shift.currentScore}</td>
                      <td className="p-3">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded ${
                            shift.delta > 0
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {shift.delta > 0 ? `+${shift.delta}` : shift.delta}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 print:text-gray-800 text-[11px] leading-relaxed">
                        {shift.commentary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Prioritized Sprint Action Roadmap */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-700 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
              3. Recommended Sprint Actions (Ranked by ROI)
            </h3>

            <div className="space-y-3">
              {activeReport.recommendedSprintActions.map(act => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:bg-gray-50 print:border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          act.priority === 'P0'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {act.priority}
                      </span>
                      <span className="text-xs font-bold text-white print:text-black">{act.title}</span>
                      <span className="text-[10px] text-slate-400 print:text-gray-500">({act.theme})</span>
                    </div>
                    <p className="text-xs text-slate-300 print:text-gray-700 leading-relaxed">{act.rationale}</p>
                    <p className="text-[11px] text-emerald-400 print:text-emerald-700 font-semibold">
                      Impact: {act.impact}
                    </p>
                  </div>

                  <div className="text-right sm:shrink-0">
                    <span className="text-[10px] text-slate-400 print:text-gray-500 block">Owner Squad</span>
                    <span className="text-xs font-bold text-slate-200 print:text-black">{act.suggestedOwner}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Effort: {act.effort}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Customer Voice Quotes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-700 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-400" />
              4. Representative Customer Quotes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeReport.customerVoiceQuotes.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 print:bg-gray-50 print:border-gray-200 text-xs space-y-1.5"
                >
                  <p className="text-slate-200 print:text-gray-800 italic leading-relaxed font-normal">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 print:text-gray-500 pt-1 border-t border-slate-800/80">
                    <span>{q.customer}</span>
                    <span>{q.channel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
