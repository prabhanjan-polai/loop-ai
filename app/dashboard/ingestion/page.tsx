'use client';

import React, { useState } from 'react';
import {
  PlusCircle,
  FileSpreadsheet,
  Radio,
  Sparkles,
  Zap,
  CheckCircle2,
  Inbox,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CSVIngester } from '@/components/ingestion/CSVIngester';
import { ManualIngestModal } from '@/components/ingestion/ManualIngestModal';
import { SimulatedSourceStream } from '@/components/ingestion/SimulatedSourceStream';
import { FeedbackStore } from '@/lib/store';
import { FeedbackChannel, FeedbackItem, CustomerTier } from '@/lib/types';

export default function IngestionPage() {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [lastIngestedCount, setLastIngestedCount] = useState<number | null>(null);

  const handleManualSubmit = (data: {
    content: string;
    channel: FeedbackChannel;
    customerName: string;
    customerTier: CustomerTier;
    mrrImpact?: number;
  }) => {
    const store = FeedbackStore.getInstance();
    store.addFeedback(data);
  };

  const handleBatchCSV = (
    items: {
      content: string;
      channel: FeedbackChannel;
      customerName: string;
      customerTier?: CustomerTier;
      mrrImpact?: number;
    }[]
  ) => {
    const store = FeedbackStore.getInstance();
    items.forEach(item => store.addFeedback(item));
    setLastIngestedCount(items.length);
    setTimeout(() => setLastIngestedCount(null), 4000);
  };

  const handleStreamSingle = (item: {
    content: string;
    channel: FeedbackChannel;
    customerName: string;
    customerTier: FeedbackItem['customerTier'];
    mrrImpact?: number;
  }) => {
    const store = FeedbackStore.getInstance();
    store.addFeedback(item);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <PlusCircle className="w-6 h-6 text-brand-400" />
            Feedback Ingestion Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect channels, upload CSV spreadsheets, or submit manual feedback with automated AI classification.
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
        >
          <Zap className="w-4 h-4" />
          <span>Manual Feedback Entry</span>
        </button>
      </div>

      {lastIngestedCount && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Successfully ingested and classified {lastIngestedCount} new feedback records!</span>
        </div>
      )}

      {/* Grid: 2 Ingestion Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: Manual Ingestion Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 w-fit mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Manual Feedback Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit single quotes, support escalations, or sales call transcripts. Real-time AI classification automatically scores sentiment, identifies themes, and flags urgent risks.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Automatic AI Extraction Includes:
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sentiment polarity (-1.0 to +1.0) and confidence</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Primary theme & sub-topic clustering</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Urgency detection & suggested product action</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-brand-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Open Manual Ingest Modal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Method 2: Bulk CSV Ingestion */}
        <CSVIngester onIngestBatch={handleBatchCSV} />
      </div>

      {/* Simulated Multi-Source Ingestion Engine */}
      <SimulatedSourceStream onStreamItem={handleStreamSingle} />

      {/* Manual Ingest Modal */}
      <ManualIngestModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSubmit={handleManualSubmit}
      />
    </div>
  );
}
