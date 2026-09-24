'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Zap,
} from 'lucide-react';
import { classifyFeedback } from '@/lib/ai/classifier';
import { FeedbackChannel, FeedbackItem, CustomerTier } from '@/lib/types';
import { cn, getSentimentBadge } from '@/lib/utils';

interface ManualIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: {
    content: string;
    channel: FeedbackChannel;
    customerName: string;
    customerTier: CustomerTier;
    sourceUrl?: string;
    rating?: number;
    mrrImpact?: number;
  }) => void;
}

export function ManualIngestModal({ isOpen, onClose, onSubmit }: ManualIngestModalProps) {
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<FeedbackChannel>('Support Tickets');
  const [customerName, setCustomerName] = useState('');
  const [customerTier, setCustomerTier] = useState<CustomerTier>('Growth');
  const [mrrImpact, setMrrImpact] = useState('24000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time AI classification preview
  const [aiPreview, setAiPreview] = useState<any>(null);

  useEffect(() => {
    if (content.trim().length > 5) {
      const result = classifyFeedback(content);
      setAiPreview(result);
    } else {
      setAiPreview(null);
    }
  }, [content]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    onSubmit({
      content,
      channel,
      customerName: customerName || 'Verified Customer',
      customerTier,
      mrrImpact: Number(mrrImpact) || 0,
    });

    setIsSubmitting(false);
    setContent('');
    setCustomerName('');
    onClose();
  };

  const samplePrompts = [
    'Login page keeps crashing when clicking Okta SSO button on Safari.',
    'I love the new analytics dashboard! The speed and charts are top notch.',
    'Where can we download monthly VAT invoices? Our accounting team needs this.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Manual Feedback Ingestion</h3>
              <p className="text-xs text-slate-400">Submit multi-channel feedback with real-time AI classification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Sample Prompts */}
        <div className="my-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Try a Quick Scenario:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setContent(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-left"
              >
                &ldquo;{p.slice(0, 38)}...&rdquo;
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Field */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Customer Feedback Content *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste raw customer feedback, review text, support ticket excerpt..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-500 text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Real-time AI Classification Preview Box */}
          {aiPreview && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-brand-500/30 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  Live AI Classification
                </span>
                <span className="text-xs font-semibold text-brand-300">
                  {Math.round(aiPreview.confidenceScore * 100)}% Confidence
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Sentiment: <strong className="text-white">{aiPreview.sentiment}</strong> ({aiPreview.sentimentScore})
                </span>
                <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 font-medium">
                  Theme: {aiPreview.themes.join(', ')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Area: {aiPreview.featureArea}
                </span>
              </div>
            </div>
          )}

          {/* Channel & Customer Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Channel
              </label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as FeedbackChannel)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="Support Tickets">Support Tickets</option>
                <option value="NPS Surveys">NPS Surveys</option>
                <option value="App Reviews">App Reviews</option>
                <option value="Community Posts">Community Posts</option>
                <option value="Sales Calls">Sales Calls</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Customer Tier
              </label>
              <select
                value={customerTier}
                onChange={e => setCustomerTier(e.target.value as CustomerTier)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="Enterprise">Enterprise ($50k+ ARR)</option>
                <option value="Growth">Growth ($12k ARR)</option>
                <option value="Starter">Starter ($3k ARR)</option>
                <option value="Trial">Trial</option>
              </select>
            </div>
          </div>

          {/* Customer Name & Estimated ARR */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Customer Name / Account
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Jason Blake (Datadog)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Estimated ARR Impact ($)
              </label>
              <input
                type="number"
                value={mrrImpact}
                onChange={e => setMrrImpact(e.target.value)}
                placeholder="e.g. 24000"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold border border-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Ingest & Run AI Classifier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
