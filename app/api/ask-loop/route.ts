import { NextRequest, NextResponse } from 'next/server';
import { FeedbackStore } from '@/lib/store';
import { askLoop } from '@/lib/ai/rag';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { success: false, error: 'question is required' },
        { status: 400 }
      );
    }

    const store = FeedbackStore.getInstance();
    const feedbacks = store.getFeedbacks();
    const ragAnswer = await askLoop(question, feedbacks);

    return NextResponse.json({
      success: true,
      data: ragAnswer,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Ask LOOP failed' },
      { status: 500 }
    );
  }
}
