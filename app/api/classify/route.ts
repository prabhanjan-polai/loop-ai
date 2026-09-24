import { NextRequest, NextResponse } from 'next/server';
import { classifyFeedback } from '@/lib/ai/classifier';

export async function POST(req: NextRequest) {
  try {
    const { feedback } = await req.json();
    if (!feedback || typeof feedback !== 'string') {
      return NextResponse.json(
        { success: false, error: 'feedback text string is required' },
        { status: 400 }
      );
    }

    const result = classifyFeedback(feedback);
    return NextResponse.json({
      success: true,
      data: {
        sentiment: result.sentiment,
        score: result.sentimentScore,
        confidence: result.confidenceScore,
        themes: result.themes,
        subThemes: result.subThemes,
        featureArea: result.featureArea,
        urgency: result.urgency,
        suggestedAction: result.suggestedAction,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Classification failed' },
      { status: 500 }
    );
  }
}
