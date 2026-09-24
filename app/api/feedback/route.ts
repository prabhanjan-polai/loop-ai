import { NextRequest, NextResponse } from 'next/server';
import { FeedbackStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  const store = FeedbackStore.getInstance();
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get('channel') || 'ALL';
  const sentiment = searchParams.get('sentiment') || 'ALL';
  const status = searchParams.get('status') || 'ALL';
  const query = searchParams.get('q') || '';

  let feedbacks = store.getFeedbacks();

  if (query) {
    const qLower = query.toLowerCase();
    feedbacks = feedbacks.filter(
      f =>
        f.content.toLowerCase().includes(qLower) ||
        f.customerName.toLowerCase().includes(qLower) ||
        f.themes.some(t => t.toLowerCase().includes(qLower))
    );
  }
  if (channel !== 'ALL') {
    feedbacks = feedbacks.filter(f => f.channel === channel);
  }
  if (sentiment !== 'ALL') {
    feedbacks = feedbacks.filter(f => f.sentiment === sentiment);
  }
  if (status !== 'ALL') {
    feedbacks = feedbacks.filter(f => f.status === status);
  }

  return NextResponse.json({
    success: true,
    count: feedbacks.length,
    feedbacks,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, channel, customerName, customerTier, sourceUrl, rating, mrrImpact } = body;

    if (!content || !channel) {
      return NextResponse.json(
        { success: false, error: 'Content and channel are required fields.' },
        { status: 400 }
      );
    }

    const store = FeedbackStore.getInstance();
    const newFeedback = store.addFeedback({
      content,
      channel,
      customerName: customerName || 'Anonymous Customer',
      customerTier: customerTier || 'Growth',
      sourceUrl,
      rating,
      mrrImpact: mrrImpact ? Number(mrrImpact) : undefined,
    });

    return NextResponse.json({
      success: true,
      feedback: newFeedback,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to ingest feedback' },
      { status: 500 }
    );
  }
}
