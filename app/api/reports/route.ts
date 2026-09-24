import { NextRequest, NextResponse } from 'next/server';
import { FeedbackStore } from '@/lib/store';

export async function GET() {
  const store = FeedbackStore.getInstance();
  const reports = store.getReports();
  return NextResponse.json({ success: true, reports });
}

export async function POST(req: NextRequest) {
  try {
    const { timeframe } = await req.json();
    const store = FeedbackStore.getInstance();
    const newReport = store.generateNewReport(timeframe || 'Weekly');
    return NextResponse.json({ success: true, report: newReport });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
