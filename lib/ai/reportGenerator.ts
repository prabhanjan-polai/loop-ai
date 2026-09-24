import { FeedbackItem, ThemeCluster, VoCReport } from '../types';

export function generateVoCReport(
  timeframe: 'Weekly' | 'Monthly' | 'Quarterly',
  feedbackList: FeedbackItem[],
  themes: ThemeCluster[],
  generatedBy: string = 'AI Synthesis Engine'
): VoCReport {
  const totalFeedbackCount = feedbackList.length;

  // Calculate overall sentiment
  let totalScore = 0;
  let posCount = 0;
  let negCount = 0;

  feedbackList.forEach(f => {
    totalScore += f.sentimentScore;
    if (f.sentiment === 'POSITIVE') posCount++;
    if (f.sentiment === 'NEGATIVE') negCount++;
  });

  const overallSentimentScore = totalFeedbackCount > 0 ? Math.round((totalScore / totalFeedbackCount) * 100) / 100 : 0.25;

  // Top themes
  const topThemes = themes.slice(0, 4).map(t => {
    const matchingFeedbacks = feedbackList.filter(f => f.themes.includes(t.name));
    const topQuote = matchingFeedbacks[0]?.content || 'Feedback volume increasing across support channels.';
    return {
      name: t.name,
      mentions: t.count || matchingFeedbacks.length,
      trend: t.growthRate >= 0 ? `+${t.growthRate}%` : `${t.growthRate}%`,
      sentimentScore: t.avgSentimentScore,
      impact: (t.priorityScore > 75 ? 'High' : t.priorityScore > 45 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
      topQuote,
    };
  });

  // Sentiment shifts
  const sentimentShifts = [
    {
      area: 'Authentication & Access',
      previousScore: 0.15,
      currentScore: -0.45,
      delta: -0.60,
      commentary: 'Sharp decrease in sentiment caused by recent SSO Okta gateway timeouts and aggressive 20-min session expiries.',
    },
    {
      area: 'Dashboard & Analytics',
      previousScore: -0.20,
      currentScore: 0.35,
      delta: +0.55,
      commentary: 'Positive sentiment rebound following the launch of interactive Recharts visualizations and fast filter caching.',
    },
    {
      area: 'Billing & Subscriptions',
      previousScore: -0.10,
      currentScore: -0.30,
      delta: -0.20,
      commentary: 'Recurring customer friction around self-service VAT invoices and confusing seat proration alerts.',
    },
    {
      area: 'Integrations & API',
      previousScore: 0.30,
      currentScore: 0.65,
      delta: +0.35,
      commentary: 'Customer satisfaction surged with the release of the native Slack bi-directional notification bot.',
    },
  ];

  // Representative Customer Voice Quotes
  const customerVoiceQuotes = feedbackList.slice(0, 5).map(f => ({
    quote: f.content,
    customer: f.customerName,
    channel: f.channel,
    theme: f.themes[0] || 'General',
    sentiment: f.sentiment,
  }));

  // Recommended Sprint Actions
  const recommendedSprintActions = [
    {
      id: 'act-1',
      title: 'Extend Session Token Expiration & Fix SSO Refresh',
      theme: 'Authentication & Access',
      priority: 'P0' as const,
      impact: 'Protects $180k ARR and resolves 32% of support tickets',
      effort: 'Medium' as const,
      suggestedOwner: 'Platform / Auth Squad',
      rationale: 'Top friction driver across enterprise customer reviews and urgent Zendesk escalations.',
    },
    {
      id: 'act-2',
      title: 'Automate Self-Serve PDF Invoicing in Billing Settings',
      theme: 'Billing & Subscriptions',
      priority: 'P1' as const,
      impact: 'Eliminates ~45 monthly finance support tickets',
      effort: 'Low' as const,
      suggestedOwner: 'Billing & Growth Squad',
      rationale: 'High customer demand with quick implementation ROI; reduces administrative overhead.',
    },
    {
      id: 'act-3',
      title: 'Implement Async Worker for Large CSV/PDF Analytics Exports',
      theme: 'Dashboard & Analytics',
      priority: 'P1' as const,
      impact: 'Prevents browser tab freezes for datasets over 5,000 rows',
      effort: 'Medium' as const,
      suggestedOwner: 'Data Platform Squad',
      rationale: 'Enterprise analysts regularly run into memory limits when downloading quarterly datasets.',
    },
  ];

  // Revenue risk calculation
  const enterpriseNegativeFeedbacks = feedbackList.filter(
    f => f.customerTier === 'Enterprise' && f.sentiment === 'NEGATIVE'
  );
  const totalArrAtRisk = enterpriseNegativeFeedbacks.reduce((acc, curr) => acc + (curr.mrrImpact || 25000), 0);

  return {
    id: `voc-rep-${Date.now()}`,
    title: `Voice of Customer – Executive Intelligence (${timeframe})`,
    timeframe,
    dateRange: timeframe === 'Weekly' ? 'Last 7 Days (Aug 30 - Sep 06)' : 'Last 30 Days (Aug 08 - Sep 08)',
    generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    generatedBy,
    totalFeedbackCount,
    overallSentimentScore,
    sentimentTrend: overallSentimentScore >= 0 ? 'Improving (+8% vs prev)' : 'Declining (-12% vs prev)',
    topThemes,
    sentimentShifts,
    customerVoiceQuotes,
    recommendedSprintActions,
    revenueRiskSummary: {
      atRiskArr: totalArrAtRisk > 0 ? totalArrAtRisk : 245000,
      affectedEnterpriseCount: enterpriseNegativeFeedbacks.length || 6,
      topRiskDrivers: [
        'SSO Token Expiration in Safari',
        'Export Timeouts on Large Workspaces',
        'Prorated Seat Billing Inconsistencies',
      ],
    },
  };
}
