import { FeedbackItem, FilterState, ThemeCluster, User, UserRole, VoCReport, Workspace } from './types';
import { INITIAL_FEEDBACKS, INITIAL_THEMES, INITIAL_USERS, INITIAL_WORKSPACE } from './seed-data';
import { classifyFeedback } from './ai/classifier';
import { generateEmbedding } from './ai/embeddings';
import { generateVoCReport } from './ai/reportGenerator';

const STORAGE_KEYS = {
  FEEDBACKS: 'loop_feedbacks_v1',
  THEMES: 'loop_themes_v1',
  CURRENT_USER: 'loop_current_user_v1',
  WORKSPACE: 'loop_workspace_v1',
  REPORTS: 'loop_reports_v1',
};

export class FeedbackStore {
  private static instance: FeedbackStore;
  private feedbacks: FeedbackItem[] = [];
  private themes: ThemeCluster[] = [];
  private currentUser: User = INITIAL_USERS[0]; // Admin by default
  private workspace: Workspace = INITIAL_WORKSPACE;
  private reports: VoCReport[] = [];
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): FeedbackStore {
    if (!FeedbackStore.instance) {
      FeedbackStore.instance = new FeedbackStore();
    }
    return FeedbackStore.instance;
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') {
      this.feedbacks = INITIAL_FEEDBACKS;
      this.themes = INITIAL_THEMES;
      this.currentUser = INITIAL_USERS[0];
      this.workspace = INITIAL_WORKSPACE;
      this.reports = [generateVoCReport('Weekly', INITIAL_FEEDBACKS, INITIAL_THEMES, 'Alex Rivera')];
      return;
    }

    try {
      const storedFb = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
      const storedThemes = localStorage.getItem(STORAGE_KEYS.THEMES);
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const storedWs = localStorage.getItem(STORAGE_KEYS.WORKSPACE);
      const storedReps = localStorage.getItem(STORAGE_KEYS.REPORTS);

      this.feedbacks = storedFb ? JSON.parse(storedFb) : INITIAL_FEEDBACKS;
      this.themes = storedThemes ? JSON.parse(storedThemes) : INITIAL_THEMES;
      this.currentUser = storedUser ? JSON.parse(storedUser) : INITIAL_USERS[0];
      this.workspace = storedWs ? JSON.parse(storedWs) : INITIAL_WORKSPACE;
      this.reports = storedReps ? JSON.parse(storedReps) : [generateVoCReport('Weekly', this.feedbacks, this.themes, 'Alex Rivera')];
    } catch {
      this.feedbacks = INITIAL_FEEDBACKS;
      this.themes = INITIAL_THEMES;
      this.currentUser = INITIAL_USERS[0];
      this.workspace = INITIAL_WORKSPACE;
      this.reports = [generateVoCReport('Weekly', INITIAL_FEEDBACKS, INITIAL_THEMES, 'Alex Rivera')];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(this.feedbacks));
      localStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(this.themes));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      localStorage.setItem(STORAGE_KEYS.WORKSPACE, JSON.stringify(this.workspace));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Auth & RBAC
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public switchRole(role: UserRole) {
    const found = INITIAL_USERS.find(u => u.role === role) || {
      ...this.currentUser,
      role,
      name: `${role.charAt(0) + role.slice(1).toLowerCase()} User`,
    };
    this.currentUser = found;
    this.saveToStorage();
  }

  public getWorkspace(): Workspace {
    return this.workspace;
  }

  // Feedback CRUD
  public getFeedbacks(): FeedbackItem[] {
    return [...this.feedbacks];
  }

  public getFeedbackById(id: string): FeedbackItem | undefined {
    return this.feedbacks.find(f => f.id === id);
  }

  public addFeedback(input: {
    content: string;
    channel: FeedbackItem['channel'];
    customerName: string;
    customerTier?: FeedbackItem['customerTier'];
    sourceUrl?: string;
    rating?: number;
    mrrImpact?: number;
  }): FeedbackItem {
    const classification = classifyFeedback(input.content);
    const vector = generateEmbedding(input.content + ' ' + classification.themes.join(' '));

    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      content: input.content,
      channel: input.channel,
      customerName: input.customerName || 'Anonymous Customer',
      customerTier: input.customerTier || 'Growth',
      sourceUrl: input.sourceUrl,
      rating: input.rating,
      mrrImpact: input.mrrImpact || (input.customerTier === 'Enterprise' ? 36000 : 8000),
      sentiment: classification.sentiment,
      sentimentScore: classification.sentimentScore,
      confidenceScore: classification.confidenceScore,
      themes: classification.themes,
      subThemes: classification.subThemes,
      featureArea: classification.featureArea,
      status: 'NEW',
      urgency: classification.urgency,
      createdAt: new Date().toISOString(),
      workspaceId: this.workspace.id,
      vector,
    };

    this.feedbacks.unshift(newFeedback);
    this.recalculateThemes();
    this.saveToStorage();
    return newFeedback;
  }

  public updateFeedbackStatus(id: string, status: FeedbackItem['status']) {
    this.feedbacks = this.feedbacks.map(f => (f.id === id ? { ...f, status, updatedAt: new Date().toISOString() } : f));
    this.saveToStorage();
  }

  public batchUpdateStatus(ids: string[], status: FeedbackItem['status']) {
    this.feedbacks = this.feedbacks.map(f => (ids.includes(f.id) ? { ...f, status, updatedAt: new Date().toISOString() } : f));
    this.saveToStorage();
  }

  public deleteFeedback(id: string) {
    this.feedbacks = this.feedbacks.filter(f => f.id !== id);
    this.recalculateThemes();
    this.saveToStorage();
  }

  public resetToSampleData() {
    this.feedbacks = INITIAL_FEEDBACKS;
    this.themes = INITIAL_THEMES;
    this.currentUser = INITIAL_USERS[0];
    this.workspace = INITIAL_WORKSPACE;
    this.reports = [generateVoCReport('Weekly', INITIAL_FEEDBACKS, INITIAL_THEMES, 'Alex Rivera')];
    this.saveToStorage();
  }

  // Themes & Analytics
  public getThemes(): ThemeCluster[] {
    return [...this.themes];
  }

  private recalculateThemes() {
    // Dynamically update theme counts & sentiments based on active feedback
    this.themes = this.themes.map(t => {
      const matching = this.feedbacks.filter(f => f.themes.includes(t.name));
      const pos = matching.filter(f => f.sentiment === 'POSITIVE').length;
      const neu = matching.filter(f => f.sentiment === 'NEUTRAL').length;
      const neg = matching.filter(f => f.sentiment === 'NEGATIVE').length;
      const avgScore = matching.length > 0
        ? Math.round((matching.reduce((acc, curr) => acc + curr.sentimentScore, 0) / matching.length) * 100) / 100
        : t.avgSentimentScore;

      return {
        ...t,
        count: matching.length > 0 ? matching.length : t.count,
        sentimentBreakdown: { positive: pos, neutral: neu, negative: neg },
        avgSentimentScore: avgScore,
      };
    });
  }

  // Reports
  public getReports(): VoCReport[] {
    return [...this.reports];
  }

  public generateNewReport(timeframe: 'Weekly' | 'Monthly' | 'Quarterly'): VoCReport {
    const newReport = generateVoCReport(timeframe, this.feedbacks, this.themes, this.currentUser.name);
    this.reports.unshift(newReport);
    this.saveToStorage();
    return newReport;
  }

  // Filter feedbacks helper
  public filterFeedbacks(filters: FilterState): FeedbackItem[] {
    return this.feedbacks.filter(item => {
      // Search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesContent = item.content.toLowerCase().includes(query);
        const matchesCustomer = item.customerName.toLowerCase().includes(query);
        const matchesTheme = item.themes.some(t => t.toLowerCase().includes(query));
        if (!matchesContent && !matchesCustomer && !matchesTheme) return false;
      }

      // Channel
      if (filters.channel && filters.channel !== 'ALL' && item.channel !== filters.channel) {
        return false;
      }

      // Sentiment
      if (filters.sentiment && filters.sentiment !== 'ALL' && item.sentiment !== filters.sentiment) {
        return false;
      }

      // Theme
      if (filters.theme && filters.theme !== 'ALL' && !item.themes.includes(filters.theme)) {
        return false;
      }

      // Status
      if (filters.status && filters.status !== 'ALL' && item.status !== filters.status) {
        return false;
      }

      // Customer Tier
      if (filters.customerTier && filters.customerTier !== 'ALL' && item.customerTier !== filters.customerTier) {
        return false;
      }

      // Urgency
      if (filters.urgency && filters.urgency !== 'ALL' && item.urgency !== filters.urgency) {
        return false;
      }

      return true;
    });
  }
}
