import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Terminal, 
  History, 
  User, 
  Award,
  Cpu,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Start Interview', path: '/select', icon: Terminal },
    { name: 'Interview History', path: '/history', icon: History },
    { name: 'Skill Improvement', path: '/skills', icon: Award },
    { name: 'Candidate Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-72 glass-panel h-screen sticky top-0 flex flex-col justify-between border-r border-slate-800/80 z-20">
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-800/60">
          <div className="p-2.5 bg-brand-600/20 border border-brand-500/30 rounded-xl text-brand-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              CODEX
              <span className="text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30 px-1.5 py-0.5 rounded font-mono font-medium">AI</span>
            </h1>
            <p className="text-xs text-slate-500">Interview Simulator</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 px-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-brand-600/10 text-brand-300 font-medium border border-brand-500/10 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 
                      ${isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'}`} 
                    />
                    <span className="text-sm font-sans tracking-wide">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-6 border-t border-slate-800/60 space-y-3">
        {user && (
          <div className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
