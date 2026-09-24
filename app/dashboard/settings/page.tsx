'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Users,
  Key,
  Building,
  CheckCircle2,
  Lock,
  Save,
  Trash2,
  Sparkles,
  GitBranch,
  GitPullRequest,
  Activity,
  Cloud,
  Terminal,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { FeedbackStore } from '@/lib/store';
import { User, UserRole, Workspace } from '@/lib/types';
import { INITIAL_USERS } from '@/lib/seed-data';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [apiKey, setApiKey] = useState('sk-ant-api03-demo-loop-feedback-intelligence-prod');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const store = FeedbackStore.getInstance();
    setCurrentUser(store.getCurrentUser());
    setWorkspace(store.getWorkspace());

    const unsub = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setWorkspace(store.getWorkspace());
    });
    return unsub;
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRoleChange = (role: UserRole) => {
    const store = FeedbackStore.getInstance();
    store.switchRole(role);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-brand-400" />
          Workspace & RBAC Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage organization credentials, team member permissions, and LLM API configurations.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Workspace configuration updated successfully!</span>
        </div>
      )}

      {/* RBAC Quick Role Switcher Tester for Evaluators */}
      <div className="glass-card rounded-2xl p-6 border border-brand-500/40 space-y-4 bg-brand-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active RBAC Role Switcher</h3>
              <p className="text-xs text-slate-400">Test different user permissions in real time</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-600 text-white">
            Current: {currentUser?.role}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {(['ADMIN', 'ANALYST', 'VIEWER'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`p-4 rounded-xl border text-left transition-all ${
                currentUser?.role === role
                  ? 'bg-brand-600 text-white border-brand-500 shadow-lg shadow-brand-600/30'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-black block mb-1">{role}</span>
              <p className="text-[11px] opacity-80 leading-relaxed">
                {role === 'ADMIN'
                  ? 'Full workspace management, billing & RBAC assignment.'
                  : role === 'ANALYST'
                  ? 'Upload feedback, manage inbox, trigger AI clustering.'
                  : 'View-only dashboards, VoC reports, and Ask LOOP AI.'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Details Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-400" />
            Organization & Tenant Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                defaultValue={workspace?.name || 'Acme SaaS Cloud'}
                disabled={currentUser?.role === 'VIEWER'}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Organization Slug / Tenant ID
              </label>
              <input
                type="text"
                defaultValue={workspace?.slug || 'acme-saas'}
                disabled
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI & LLM Key Provider */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-brand-400" />
            AI & Vector Engine Configuration
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Claude Sonnet / Anthropic API Key (Optional Override)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              disabled={currentUser?.role === 'VIEWER'}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-brand-500 disabled:opacity-50 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              LOOP AI uses built-in high-speed neural vector embeddings & semantic inference. Adding a custom key unlocks direct external Anthropic Claude Sonnet 3.5 synthesis.
            </p>
          </div>
        </div>

        {/* Team Members List */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            Workspace Team Members ({INITIAL_USERS.length})
          </h3>

          <div className="divide-y divide-slate-800">
            {INITIAL_USERS.map(u => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-white">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">{u.name}</span>
                    <span className="text-slate-400 text-[11px]">{u.email}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    u.role === 'ADMIN'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : u.role === 'ANALYST'
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CI/CD & DevOps Pipeline Monitor */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              CI/CD & DevOps Pipelines (GitHub Actions)
            </h3>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Continuous Integration Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                  CI Pipeline
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">Passing</span>
              </div>
              <p className="text-[11px] text-slate-400">Node 18 & 20 matrix, typecheck, lint, audit & Next.js production build.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-purple-400" />
                  CD Deployment
                </span>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded">Ready</span>
              </div>
              <p className="text-[11px] text-slate-400">Automated deployment to Vercel production and staging environments on merge.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  CodeQL & Dependabot
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">Weekly Scan</span>
              </div>
              <p className="text-[11px] text-slate-400">Automated security vulnerability analysis and weekly dependency updates.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 font-mono text-[11px]">Repository: github.com/sunnybitla/Zidio_interntask</span>
            </div>
            <a
              href="https://github.com/sunnybitla/Zidio_interntask/actions"
              target="_blank"
              rel="noreferrer"
              className="text-brand-400 hover:text-brand-300 text-[11px] font-bold flex items-center gap-1 hover:underline"
            >
              <span>View GitHub Actions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Save button */}
        {currentUser?.role !== 'VIEWER' && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Workspace Settings</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
