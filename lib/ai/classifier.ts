import { FeedbackSentiment } from '../types';

export interface ClassificationResult {
  sentiment: FeedbackSentiment;
  sentimentScore: number; // -1.0 to 1.0
  confidenceScore: number; // 0.0 to 1.0
  themes: string[];
  subThemes: string[];
  featureArea: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  keyPhrases: string[];
  suggestedAction: string;
}

const THEME_DICTIONARY: Record<
  string,
  {
    category: string;
    keywords: string[];
    subThemes: Record<string, string[]>;
    defaultAction: string;
  }
> = {
  'Authentication & Access': {
    category: 'Security & Access',
    keywords: [
      'login', 'log in', 'signin', 'sign in', 'password', 'reset password',
      'otp', 'mfa', '2fa', 'two-factor', 'sso', 'saml', 'okta', 'auth',
      'session', 'logged out', 'logout', 'timeout', 'token', 'credentials',
      'can\'t login', 'cannot login', 'locked out'
    ],
    subThemes: {
      'Password Reset': ['password', 'reset', 'forgot', 'link expired'],
      'MFA & OTP Failure': ['otp', 'mfa', '2fa', 'code', 'sms', 'authenticator'],
      'Session Timeout': ['session', 'timeout', 'logged out', 'keeps kicking me out'],
      'SSO & SAML': ['sso', 'saml', 'okta', 'google login', 'azure ad', 'workspace login'],
    },
    defaultAction: 'Refactor session expiration handling and verify SAML/SSO token refresh flow.',
  },
  'Billing & Subscriptions': {
    category: 'Monetization',
    keywords: [
      'billing', 'invoice', 'receipt', 'charged', 'charge', 'pricing', 'subscription',
      'credit card', 'stripe', 'refund', 'overcharged', 'upgrade', 'downgrade',
      'tier', 'seat', 'license', 'payment failed', 'vat', 'tax'
    ],
    subThemes: {
      'Invoice Generation': ['invoice', 'pdf', 'receipt', 'vat', 'tax number', 'download invoice'],
      'Payment Failure': ['payment failed', 'declined', 'card error', 'stripe'],
      'Seat & License Management': ['seat', 'license', 'add user', 'member billing', 'prorated'],
      'Pricing Clarity': ['pricing', 'expensive', 'hidden fee', 'plan comparison'],
    },
    defaultAction: 'Optimize invoice PDF generation and self-serve seat management in billing portal.',
  },
  'Onboarding & Setup': {
    category: 'Product Adoption',
    keywords: [
      'onboarding', 'getting started', 'setup', 'tutorial', 'documentation', 'guide',
      'first time', 'confusing', 'where do i', 'how to', 'wizard', 'walkthrough',
      'invite team', 'team member invite', 'empty state'
    ],
    subThemes: {
      'Setup Wizard': ['wizard', 'first step', 'setup', 'blank screen', 'empty state'],
      'Team Invites': ['invite', 'invitation', 'join team', 'collaborator'],
      'Documentation & Tooltips': ['docs', 'guide', 'tutorial', 'help article', 'tooltip'],
    },
    defaultAction: 'Simplify 3-step onboarding checklist and add interactive product tours.',
  },
  'Dashboard & Analytics': {
    category: 'Core Experience',
    keywords: [
      'dashboard', 'analytics', 'chart', 'graph', 'metrics', 'kpi', 'report',
      'export', 'csv export', 'excel', 'data load', 'slow loading', 'refresh',
      'filter', 'date filter', 'visualization'
    ],
    subThemes: {
      'Slow Chart Loading': ['slow', 'lag', 'loading', 'timeout', 'performance', 'spinning'],
      'Export Data (CSV/PDF)': ['export', 'csv', 'pdf', 'download', 'excel', 'share report'],
      'Custom Date Filters': ['date range', 'filter', 'custom period', 'comparison'],
    },
    defaultAction: 'Add Redis caching layer to analytics queries and improve background export workers.',
  },
  'Integrations & API': {
    category: 'Ecosystem',
    keywords: [
      'integration', 'integrate', 'api', 'webhook', 'slack', 'jira', 'linear',
      'zapier', 'salesforce', 'hubspot', 'github', 'rate limit', 'payload',
      'sync', 'synced', 'disconnected'
    ],
    subThemes: {
      'Slack & Notifications': ['slack', 'notification', 'alert', 'bot', 'channel'],
      'Jira / Linear Sync': ['jira', 'linear', 'issue tracker', 'ticket sync', 'two-way sync'],
      'API & Webhooks': ['api key', 'webhook', 'endpoint', 'rest api', 'rate limit'],
    },
    defaultAction: 'Enhance webhook retry logic and launch one-click Linear/Jira bi-directional sync.',
  },
  'Mobile & UX Responsiveness': {
    category: 'UI/UX',
    keywords: [
      'mobile', 'ios', 'android', 'phone', 'tablet', 'screen', 'responsive',
      'overflow', 'button too small', 'modal cut off', 'ui bug', 'dark mode',
      'font size', 'cluttered'
    ],
    subThemes: {
      'Mobile Layout Glitches': ['mobile', 'phone', 'cut off', 'screen size', 'viewport'],
      'UI & Accessibility': ['font size', 'contrast', 'dark mode', 'button tap', 'accessible'],
    },
    defaultAction: 'Audit mobile viewport CSS breakpoints and ensure touch targets >= 44px.',
  },
};

const POSITIVE_LEXICON = [
  'love', 'great', 'awesome', 'amazing', 'excellent', 'fantastic', 'superb',
  'fast', 'smooth', 'easy', 'intuitive', 'helpful', 'best', 'flawless',
  'delighted', 'happy', 'impressed', 'perfect', 'game changer', 'saved time',
  'clean', 'powerful', 'slick', 'seamless', 'thank you', 'kudos', '10/10'
];

const NEGATIVE_LEXICON = [
  'terrible', 'horrible', 'awful', 'hate', 'broken', 'bug', 'crash', 'crashing',
  'fails', 'failing', 'slow', 'frustrating', 'painful', 'sucks', 'worst',
  'disappointed', 'useless', 'unusable', 'annoying', 'error', 'wrong', 'freeze',
  'frozen', 'stuck', 'issue', 'problem', 'lost data', 'waste of money', 'churn',
  'cancelling', 'unsubscribe', 'bad'
];

const CRITICAL_KEYWORDS = [
  'churn', 'cancelling', 'lost data', 'security breach', 'outage', 'unacceptable',
  'refund', 'escalate', 'lawyer', 'enterprise down', 'production broken'
];

export function classifyFeedback(text: string): ClassificationResult {
  const lower = text.toLowerCase();

  // 1. Calculate Sentiment Score
  let posCount = 0;
  let negCount = 0;

  for (const word of POSITIVE_LEXICON) {
    if (lower.includes(word)) posCount++;
  }
  for (const word of NEGATIVE_LEXICON) {
    if (lower.includes(word)) negCount++;
  }

  // Strong negative boosters
  if (lower.includes('crash') || lower.includes('broken') || lower.includes('cancelling') || lower.includes('worst')) {
    negCount += 2;
  }
  if (lower.includes('love') || lower.includes('game changer') || lower.includes('amazing')) {
    posCount += 1.5;
  }

  let sentimentScore = 0;
  const totalValence = posCount + negCount;

  if (totalValence === 0) {
    sentimentScore = 0.05; // Slightly neutral-positive default
  } else {
    sentimentScore = (posCount - negCount) / (totalValence + 1);
  }
  // Clamp between -1 and 1
  sentimentScore = Math.max(-1, Math.min(1, Math.round(sentimentScore * 100) / 100));

  let sentiment: FeedbackSentiment = 'NEUTRAL';
  if (sentimentScore >= 0.25) {
    sentiment = 'POSITIVE';
  } else if (sentimentScore <= -0.2) {
    sentiment = 'NEGATIVE';
  }

  // 2. Identify Themes and SubThemes
  const matchedThemes: string[] = [];
  const matchedSubThemes: string[] = [];
  let topFeatureArea = 'General Platform';
  let suggestedAction = 'Review customer feedback and assign to product squad.';

  let highestThemeMatches = 0;

  for (const [themeName, config] of Object.entries(THEME_DICTIONARY)) {
    let themeMatches = 0;
    for (const kw of config.keywords) {
      if (lower.includes(kw)) {
        themeMatches++;
      }
    }

    if (themeMatches > 0) {
      matchedThemes.push(themeName);
      if (themeMatches > highestThemeMatches) {
        highestThemeMatches = themeMatches;
        topFeatureArea = config.category;
        suggestedAction = config.defaultAction;
      }

      // Check subthemes
      for (const [subName, subKeywords] of Object.entries(config.subThemes)) {
        for (const subKw of subKeywords) {
          if (lower.includes(subKw) && !matchedSubThemes.includes(subName)) {
            matchedSubThemes.push(subName);
            break;
          }
        }
      }
    }
  }

  if (matchedThemes.length === 0) {
    matchedThemes.push('General UX & Usability');
    matchedSubThemes.push('General Feedback');
    topFeatureArea = 'Product Experience';
  }

  // 3. Urgency calculation
  let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  const hasCritical = CRITICAL_KEYWORDS.some(k => lower.includes(k));

  if (hasCritical || sentimentScore <= -0.7) {
    urgency = 'CRITICAL';
  } else if (sentimentScore < -0.3 || lower.includes('urgent') || lower.includes('blocking')) {
    urgency = 'HIGH';
  } else if (sentimentScore < 0.2) {
    urgency = 'MEDIUM';
  }

  // 4. Extract Key Phrases
  const words = text.replace(/[^a-zA-Z0-9 ]/g, '').split(/\s+/);
  const keyPhrases = words.filter(w => w.length > 5).slice(0, 4);

  // 5. Confidence Score (based on clarity of signals)
  const confidenceScore = Math.min(0.98, Math.max(0.72, 0.75 + (matchedThemes.length * 0.06) + (totalValence * 0.04)));

  return {
    sentiment,
    sentimentScore,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    themes: matchedThemes,
    subThemes: matchedSubThemes,
    featureArea: topFeatureArea,
    urgency,
    keyPhrases,
    suggestedAction,
  };
}
