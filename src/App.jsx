import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import InterviewSelection from './components/InterviewSelection';
import InterviewSession from './components/InterviewSession';
import Results from './components/Results';
import InterviewHistory from './components/InterviewHistory';
import SkillImprovement from './components/SkillImprovement';

function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get('/api/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.error('Failed to fetch profile:', err));
  }, []);

  const isInterviewSession = location.pathname.startsWith('/interview/');

  return (
    <div className="flex min-h-screen text-slate-100 bg-slate-950">
      {!isInterviewSession && <Sidebar />}
      
      <main className="flex-1 flex flex-col min-w-0">
        {!isInterviewSession && (
          <header className="glass-panel border-b border-slate-800/60 py-5 px-8 flex items-center justify-between z-10 sticky top-0 bg-slate-950/80 backdrop-blur-md">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Candidate Hub</p>
              <h2 className="font-display font-bold text-lg text-white">
                {location.pathname === '/' && 'Welcome back, ' + (user?.name || profile?.name || 'Candidate')}
                {location.pathname === '/select' && 'Select Interview Module'}
                {location.pathname === '/history' && 'Performance & History Logs'}
                {location.pathname === '/skills' && 'Skill Improvement Plan'}
                {location.pathname === '/profile' && 'Candidate Profile Configuration'}
                {location.pathname.startsWith('/results/') && 'AI Evaluation Results'}
              </h2>
            </div>
            
            {(user || profile) && (
              <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800/80 px-4 py-2 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm border border-brand-500/30">
                  {(user?.name || profile?.name || 'C').charAt(0)}
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">{user?.name || profile?.name}</div>
                  <div className="text-[10px] text-brand-300 font-medium">{profile?.title || 'Candidate'}</div>
                </div>
              </div>
            )}
          </header>
        )}

        <div className={`flex-1 p-8 ${isInterviewSession ? 'p-0' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/select" element={<InterviewSelection />} />
            <Route path="/interview/:sessionId" element={<InterviewSession />} />
            <Route path="/results/:sessionId" element={<Results />} />
            <Route path="/history" element={<InterviewHistory />} />
            <Route path="/skills" element={<SkillImprovement />} />
            <Route path="/profile" element={<Profile onProfileUpdate={setProfile} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />

          {/* Protected Dashboard Routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
