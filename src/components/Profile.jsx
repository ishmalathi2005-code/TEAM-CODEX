import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Shield, Target, Briefcase, Award, Save, Check } from 'lucide-react';

export default function Profile({ onProfileUpdate }) {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    targetRole: '',
    experience: '',
    targetScore: 80
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/profile')
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'targetScore' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    axios.post('/api/profile', profile)
      .then(res => {
        setIsSaving(false);
        setSavedSuccess(true);
        if (onProfileUpdate) {
          onProfileUpdate(res.data.profile);
        }
        setTimeout(() => setSavedSuccess(false), 3000);
      })
      .catch(err => {
        console.error('Error saving profile:', err);
        setIsSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-t-2 border-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-slate-900 via-slate-900/60 to-brand-950/10">
        <div className="w-20 h-20 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-3xl font-display font-bold">
          {profile.name ? profile.name.charAt(0) : 'C'}
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-display font-bold text-2xl text-white">{profile.name || 'Set Name'}</h2>
          <p className="text-sm text-brand-300 font-medium">{profile.title || 'Set Professional Title'}</p>
          <p className="text-xs text-slate-500">Exp Level: {profile.experience || 'Set Experience'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 border border-slate-800/80 space-y-6">
        <div className="border-b border-slate-800/80 pb-5">
          <h3 className="font-display font-bold text-lg text-white">General Information</h3>
          <p className="text-xs text-slate-500">These parameters customize the focus and tone of your AI interviewer simulation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" /> Full Name
            </label>
            <input 
              type="text" 
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="e.g. Alex Mercer"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-500" /> Current Title
            </label>
            <input 
              type="text" 
              name="title"
              value={profile.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Engineer"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-slate-500" /> Target Role
            </label>
            <input 
              type="text" 
              name="targetRole"
              value={profile.targetRole}
              onChange={handleChange}
              placeholder="e.g. Senior React Developer"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-500" /> Professional Experience
            </label>
            <input 
              type="text" 
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              placeholder="e.g. 3 Years"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-800/60">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-500" /> Target Simulation Score
            </label>
            <span className="text-sm font-bold font-mono text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-lg">
              {profile.targetScore}%
            </span>
          </div>
          <input 
            type="range" 
            name="targetScore"
            min="50" 
            max="100" 
            value={profile.targetScore}
            onChange={handleChange}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>50% (Competent)</span>
            <span>75% (Proficient)</span>
            <span>100% (Expert)</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
          <div className="h-10 flex items-center">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-slide-in font-medium">
                <Check className="w-4.5 h-4.5 p-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full" /> Profile settings updated successfully!
              </span>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white rounded-xl font-semibold shadow-lg shadow-brand-600/10 hover:shadow-brand-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
