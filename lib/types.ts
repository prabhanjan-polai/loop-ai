export type UserRole = 'ADMIN' | 'ANALYST' | 'VIEWER';

export type FeedbackChannel =
  | 'Support Tickets'
  | 'NPS Surveys'
  | 'App Reviews'
  | 'Community Posts'
  | 'Sales Calls';

export type FeedbackSentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export type FeedbackStatus = 'NEW' | 'REVIEWED' | 'ACTIONED';

export type CustomerTier = 'Enterprise' | 'Growth' | 'Starter' | 'Trial' | 'Free';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  plan: 'Enterprise AI' | 'Growth' | 'Free';
}

export interface FeedbackItem {
  id: string;
  content: string;
  channel: FeedbackChannel;
  customerName: string;
  customerEmail?: string;
  customerTier: CustomerTier;
  mrrImpact?: number; // Estimated Annual or Monthly Revenue impacted
  sourceUrl?: string;
  rating?: number; // 1-5 or NPS 0-10
  sentiment: FeedbackSentiment;
  sentimentScore: number; // -1.0 to +1.0
  confidenceScore: number; // 0.0 to 1.0
  themes: string[];
  subThemes?: string[];
  featureArea: string;
  status: FeedbackStatus;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  updatedAt?: string;
  workspaceId: string;
  vector?: number[];
  assignedTo?: string;
  internalNotes?: string;
}

export interface ThemeCluster {
  id: string;
  name: string;
  category: string;
  description: string;
  count: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  avgSentimentScore: number;
  growthRate: number; // percentage change e.g. +42%
  subThemes: {
    name: string;
    count: number;
    sampleQuote: string;
  }[];
  suggestedAction: string;
  priorityScore: number; // 1-100
  revenueAtRisk?: number;
}

export interface RAGCitation {
  id: string;
  feedbackId: string;
  customerName: string;
  channel: FeedbackChannel;
  content: string;
  sentiment: FeedbackSentiment;
  relevanceScore: number;
  date: string;
}

export interface RAGAnswer {
  question: string;
  summary: string;
  groundedAnswer: string;
  keyInsights: string[];
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  suggestedNextQuestions: string[];
  citations: RAGCitation[];
  confidence: number;
  generatedAt: string;
}

export interface VoCReport {
  id: string;
  title: string;
  timeframe: 'Weekly' | 'Monthly' | 'Quarterly';
  dateRange: string;
  generatedAt: string;
  generatedBy: string;
  totalFeedbackCount: number;
  overallSentimentScore: number;
  sentimentTrend: string;
  topThemes: {
    name: string;
    mentions: number;
    trend: string;
    sentimentScore: number;
    impact: 'High' | 'Medium' | 'Low';
    topQuote: string;
  }[];
  sentimentShifts: {
    area: string;
    previousScore: number;
    currentScore: number;
    delta: number;
    commentary: string;
  }[];
  customerVoiceQuotes: {
    quote: string;
    customer: string;
    channel: FeedbackChannel;
    theme: string;
    sentiment: FeedbackSentiment;
  }[];
  recommendedSprintActions: {
    id: string;
    title: string;
    theme: string;
    priority: 'P0' | 'P1' | 'P2';
    impact: string;
    effort: 'Low' | 'Medium' | 'High';
    suggestedOwner: string;
    rationale: string;
  }[];
  revenueRiskSummary: {
    atRiskArr: number;
    affectedEnterpriseCount: number;
    topRiskDrivers: string[];
  };
}

export interface FilterState {
  searchQuery: string;
  channel: string;
  sentiment: string;
  theme: string;
  status: string;
  customerTier: string;
  dateRange: string;
  urgency: string;
}
