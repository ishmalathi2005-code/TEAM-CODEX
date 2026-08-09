import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Key, Shield, Code2, Bot, Play, CheckCircle2, Copy, Sparkles, Terminal, Activity } from 'lucide-react';

export const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Glow Orbs Backdrop */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 glass-panel sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-wider text-slate-100 block leading-none">
                CODEX<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Interview Simulator Platform</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AUTHENTICATED SESSION</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10 space-y-8">
        
        {/* Welcome Hero Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WELCOME BACK, CANDIDATE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-heading">
                Hello, <span className="text-gradient">{user?.name || 'Developer'}</span> 👋
              </h1>
              <p className="text-slate-400 text-sm max-w-2xl">
                Your AI interview simulator workspace is configured and ready. Choose a track below to start your live technical simulation.
              </p>
            </div>

            <button 
              onClick={() => alert("Starting AI Mock Interview session...")}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer w-full md:w-auto"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Mock Interview</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* User Profile Card */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-3 text-cyan-400">
              <User className="w-5 h-5" />
              <h3 className="font-heading font-bold text-slate-100">User Profile</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-500 block font-mono">FULL NAME</span>
                <span className="font-semibold text-slate-200">{user?.name}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-500 block font-mono">EMAIL ADDRESS</span>
                <span className="font-semibold text-slate-200">{user?.email}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block font-mono">CANDIDATE ROLE</span>
                  <span className="font-semibold text-cyan-400">{user?.role || 'Full Stack Engineer'}</span>
                </div>
                <Shield className="w-5 h-5 text-cyan-500/60" />
              </div>
            </div>
          </div>

          {/* Secure JWT Inspector */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-indigo-400">
                <Key className="w-5 h-5" />
                <h3 className="font-heading font-bold text-slate-100">Active JWT Authentication Token</h3>
              </div>
              <button
                onClick={handleCopyToken}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
              >
                {copiedToken ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Bearer Token</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-cyan-300/90 break-all relative">
              <span className="text-slate-500 block text-[10px] mb-1">HEADER.PAYLOAD.SIGNATURE</span>
              {token ? (
                <span>{token}</span>
              ) : (
                <span className="text-slate-500 italic">No active token found in storage</span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center">
                <span className="text-slate-500 block font-mono text-[10px]">COMPLETED</span>
                <span className="text-xl font-bold text-slate-100 font-heading">{user?.interviewsCompleted ?? 14}</span>
                <span className="text-[10px] text-slate-400 block">Sessions</span>
              </div>
              
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center">
                <span className="text-slate-500 block font-mono text-[10px]">AVG SCORE</span>
                <span className="text-xl font-bold text-emerald-400 font-heading">{user?.avgScore ?? 92}%</span>
                <span className="text-[10px] text-slate-400 block">Performance</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center col-span-2 sm:col-span-1">
                <span className="text-slate-500 block font-mono text-[10px]">SYSTEM STATUS</span>
                <span className="text-xl font-bold text-cyan-400 font-heading flex items-center justify-center gap-1">
                  <Activity className="w-4 h-4 animate-pulse" /> 100%
                </span>
                <span className="text-[10px] text-slate-400 block">Ready to Sim</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 glass-panel py-4 px-6 text-center text-xs text-slate-500 font-mono">
        CODEX AI Interview Simulator • Authentication Module v2.4 • Connected via Axios API
      </footer>
    </div>
  );
};
