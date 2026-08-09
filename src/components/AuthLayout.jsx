import React from 'react';
import { Cpu, Terminal, Shield, CheckCircle, Sparkles, Code2, Bot } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden text-slate-100">
      {/* Background Animated Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Grid Pattern Background Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Visual Showcase & Brand Messaging (Desktop) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 p-4 lg:pr-8">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-panel text-cyan-400 text-xs font-mono tracking-wide w-fit border-cyan-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>CODEX AI SIMULATOR v2.4</span>
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
                Elevate Your <br />
                <span className="text-gradient">Tech Interview</span> Mastery.
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
                Step into high-fidelity AI-simulated technical coding rounds, real-time feedback loops, and automated architectural evaluations.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl glass-panel hover:border-cyan-500/30 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">Adaptive AI Interviewer</h3>
                <p className="text-xs text-slate-400 mt-1">Contextual follow-ups based on code complexity & system design choices.</p>
              </div>

              <div className="p-4 rounded-xl glass-panel hover:border-indigo-500/30 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">Live Code Execution</h3>
                <p className="text-xs text-slate-400 mt-1">Multi-language sandbox with instant time/space complexity analysis.</p>
              </div>
            </div>

            {/* Floating Terminal Code Mockup */}
            <div className="p-4 rounded-xl glass-panel-glow border-cyan-500/30 font-mono text-xs text-slate-300 hidden sm:block relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-[10px] text-slate-500">codex-auth-stream // JWT Secured</span>
              </div>
              <div className="pt-3 space-y-1.5">
                <div className="flex items-center text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5 mr-2" />
                  <span>[AUTH_OK] Bearer token verified successfully</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-cyan-400">const</span> session = <span className="text-purple-400">await</span> CODEX.<span className="text-blue-400">startInterview</span>(&#123; mode: <span className="text-amber-300">'SYSTEM_DESIGN'</span> &#125;);
                </div>
                <div className="text-slate-500 text-[11px] pl-4">
                  // Real-time telemetry connected...
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Auth Form Container */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md">
              <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden">
                {/* Top Subtle Neon Edge Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70" />
                
                {/* Form Header */}
                <div className="mb-6 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <span className="font-heading text-xl font-bold tracking-wider text-slate-100">
                      CODEX<span className="text-cyan-400">.AI</span>
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100 font-heading">{title}</h2>
                  <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
                </div>

                {/* Form Body */}
                {children}

                {/* Form Footer */}
                <div className="mt-8 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
                  <Shield className="w-3.5 h-3.5 text-cyan-500/80" />
                  <span>Protected by 256-bit JWT Encryption</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
