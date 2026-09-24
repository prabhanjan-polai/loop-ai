'use client';

import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';
import { FeedbackChannel, CustomerTier } from '@/lib/types';

interface CSVIngesterProps {
  onIngestBatch: (
    items: {
      content: string;
      channel: FeedbackChannel;
      customerName: string;
      customerTier?: CustomerTier;
      mrrImpact?: number;
    }[]
  ) => void;
}

const SAMPLE_CSV_CONTENT = `content,channel,customer_label,created_at
"Okta SSO token keeps expiring every 20 minutes when running large reports. Super frustrating!",Support Tickets,David Sterling (StripeX),2026-09-07T14:32:00Z
"The interactive dashboard and charts look modern and load in under 500ms. Great job!",NPS Surveys,Elena Rostova (Head of Product),2026-09-07T11:20:00Z
"Need automated monthly VAT invoice downloads sent to finance@company.com",Support Tickets,Marco Rossi (FinOps),2026-09-06T16:45:00Z
"The Slack bot sends real-time sentiment alerts to our engineering channel!",Community Posts,Samantha Reed (CS Lead),2026-09-06T10:15:00Z
"Setup wizard was slightly confusing when inviting 5+ users at once",App Reviews,Jordan Miller,2026-09-05T09:30:00Z
"Exporting 50k rows to CSV freezes the browser tab. Need async export queue",Support Tickets,Vikram Patel (Data Ops),2026-09-05T15:10:00Z
"Prospect blocked from signing $60k contract without two-way Linear sync",Sales Calls,Lisa (Account Exec),2026-09-04T18:00:00Z
"Mobile UI on iPhone 15 Pro cuts off chart labels on the right edge",App Reviews,Chloe Dupont,2026-09-04T12:45:00Z`;

export function CSVIngester({ onIngestBatch }: CSVIngesterProps) {
  const [csvText, setCsvText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleLoadSample = () => {
    setCsvText(SAMPLE_CSV_CONTENT);
    setSuccessCount(null);
  };

  const parseAndIngest = () => {
    if (!csvText.trim()) return;
    setIsProcessing(true);

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        alert('CSV must contain a header row and at least 1 data row.');
        setIsProcessing(false);
        return;
      }

      // Simple CSV parser supporting quotes
      const parsedItems: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Match CSV with quote support
        const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
        const matches: string[] = [];
        let match;
        while ((match = regex.exec(line)) !== null) {
          let val = match[1] || '';
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1).replace(/""/g, '"');
          }
          matches.push(val.trim());
          if (regex.lastIndex >= line.length) break;
        }

        const content = matches[0] || '';
        const channel = (matches[1] as FeedbackChannel) || 'Support Tickets';
        const customerName = matches[2] || 'CSV Customer';

        if (content) {
          parsedItems.push({
            content,
            channel,
            customerName,
            customerTier: 'Growth' as CustomerTier,
            mrrImpact: 18000,
          });
        }
      }

      setTimeout(() => {
        onIngestBatch(parsedItems);
        setIsProcessing(false);
        setSuccessCount(parsedItems.length);
        setCsvText('');
      }, 600);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert('Failed to parse CSV. Please check formatting.');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Bulk CSV Ingestion</h3>
            <p className="text-xs text-slate-400">
              Columns: <code className="text-brand-300 font-mono">content, channel, customer_label, created_at</code>
            </p>
          </div>
        </div>

        <button
          onClick={handleLoadSample}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-300 border border-brand-500/30 flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Sample CSV</span>
        </button>
      </div>

      <div className="my-4">
        <textarea
          rows={6}
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          placeholder={`Paste CSV data here or click "Load Sample CSV"...\n\ncontent,channel,customer_label,created_at\n"Great app!",NPS Surveys,Alex Rivera,2026-09-01`}
          className="w-full font-mono text-xs p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-500 text-slate-200 placeholder-slate-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">
          {csvText.trim() ? `${csvText.trim().split('\n').length - 1} rows detected` : 'No file loaded'}
        </span>

        <button
          onClick={parseAndIngest}
          disabled={isProcessing || !csvText.trim()}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Running Bulk AI Classifier...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Process & Ingest CSV</span>
            </>
          )}
        </button>
      </div>

      {successCount !== null && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            Successfully ingested and AI classified <strong>{successCount}</strong> feedback records!
          </span>
        </div>
      )}
    </div>
  );
}
