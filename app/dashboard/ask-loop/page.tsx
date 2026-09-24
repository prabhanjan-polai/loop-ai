'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Quote,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Search,
  ExternalLink,
  ThumbsUp,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { FeedbackStore } from '@/lib/store';
import { RAGAnswer, RAGCitation, FeedbackItem } from '@/lib/types';
import { askLoop } from '@/lib/ai/rag';
import { cn, formatDate, getSentimentBadge } from '@/lib/utils';
import { FeedbackDrawer } from '@/components/feedback/FeedbackDrawer';

export default function AskLoopPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<RAGAnswer[]>([]);
  const [inspectingFeedback, setInspectingFeedback] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    // Initial suggested answer on load so users immediately see the power
    const store = FeedbackStore.getInstance();
    const feedbacks = store.getFeedbacks();
    askLoop('What are customers saying about onboarding?', feedbacks).then(ans => {
      setHistory([ans]);
    });
  }, []);

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsLoading(true);

    try {
      const store = FeedbackStore.getInstance();
      const feedbacks = store.getFeedbacks();
      const answer = await askLoop(questionText, feedbacks);
      setHistory(prev => [answer, ...prev]);
      setQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'What are customers saying about onboarding?',
    'Why is authentication sentiment negative?',
    'What are the most requested billing features?',
    'What should we prioritize for next sprint?',
    'How do enterprise customers feel about export performance?',
  ];

  const handleCitationClick = (citation: RAGCitation) => {
    const store = FeedbackStore.getInstance();
    const fb = store.getFeedbackById(citation.feedbackId);
    if (fb) {
      setInspectingFeedback(fb);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 text-center md:text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Ask LOOP AI
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  RAG Vector Search
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Natural language semantic intelligence over multi-channel customer feedback with verified citations.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-hallucination citations</span>
          </div>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask anything (e.g. 'What are our biggest friction points this week?')"
            className="w-full pl-4 pr-28 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-500 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition-all"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isLoading ? 'Synthesizing...' : 'Ask AI'}</span>
          </button>
        </form>

        {/* Suggested Queries */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Suggested Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAsk(q)}
                className="text-xs px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answers Stream */}
      <div className="space-y-6">
        {history.map((ans, idx) => (
          <div
            key={idx}
            className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5 animate-fade-in"
          >
            {/* User Query Question Pill */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Question
                </span>
                <h3 className="text-sm font-bold text-white">&ldquo;{ans.question}&rdquo;</h3>
              </div>
              <span className="text-xs text-slate-400">
                {Math.round(ans.confidence * 100)}% Confidence
              </span>
            </div>

            {/* AI Grounded Synthesis */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-brand-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Grounded Synthesis
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                  {ans.groundedAnswer}
                </p>
              </div>

              {/* Key Insights bullets */}
              {ans.keyInsights && ans.keyInsights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {ans.keyInsights.map((insight, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300">{insight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Citations Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-brand-400" />
                  Verified Grounded Customer Citations ({ans.citations.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Click any citation to inspect raw record
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ans.citations.map(cit => {
                  const sent = getSentimentBadge(cit.sentiment);
                  return (
                    <button
                      key={cit.id}
                      onClick={() => handleCitationClick(cit)}
                      className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-brand-500/40 text-left transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold text-slate-200 truncate">
                            {cit.customerName}
                          </span>
                          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded border', sent.color)}>
                            {sent.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 italic line-clamp-2 mb-3">
                          &ldquo;{cit.content}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{cit.channel}</span>
                        <span className="text-brand-300 font-semibold flex items-center gap-1 group-hover:text-brand-200">
                          {Math.round(cit.relevanceScore * 100)}% Match
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Follow up suggested inquiries */}
            {ans.suggestedNextQuestions && (
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 font-semibold">Suggested follow-ups:</span>
                {ans.suggestedNextQuestions.slice(0, 2).map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(sq)}
                    className="text-brand-300 hover:text-white underline hover:no-underline"
                  >
                    &ldquo;{sq}&rdquo;
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Deep-dive drawer */}
      <FeedbackDrawer
        item={inspectingFeedback}
        onClose={() => setInspectingFeedback(null)}
      />
    </div>
  );
}
