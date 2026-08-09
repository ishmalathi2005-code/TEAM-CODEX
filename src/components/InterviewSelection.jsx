import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Terminal, Users, Code, Award, Play } from 'lucide-react';

const TECHNOLOGIES = ['React', 'Node.js', 'Python', 'System Design'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function InterviewSelection() {
  const navigate = useNavigate();
  const [type, setType] = useState('Technical');
  const [technology, setTechnology] = useState('React');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    axios.post('/api/interviews/start', {
      type,
      technology: type === 'Technical' ? technology : undefined,
      difficulty
    })
      .then(res => {
        const { sessionId } = res.data;
        navigate(`/interview/${sessionId}`);
      })
      .catch(err => {
        console.error('Failed to start interview:', err);
        setLoading(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="font-display font-bold text-2xl text-white">Start New Interview Session</h2>
        <p className="text-sm text-slate-400">Configure your simulation requirements. The AI will custom-generate questions based on your selections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" /> Select Interview Category
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setType('Technical')}
                className={`flex flex-col gap-2 p-5 rounded-xl border text-left transition-all cursor-pointer ${
                  type === 'Technical'
                    ? 'bg-brand-600/10 border-brand-500 text-brand-300 shadow-lg shadow-brand-500/5'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                <div className="p-2 bg-brand-500/20 border border-brand-500/30 rounded-lg text-brand-400 w-fit">
                  <Code className="w-5 h-5" />
                </div>
                <div className="font-semibold text-sm text-white">Technical Interview</div>
                <div className="text-xs text-slate-500">Evaluates coding algorithms, framework expertise, and system design structures.</div>
              </button>

              <button
                onClick={() => setType('HR')}
                className={`flex flex-col gap-2 p-5 rounded-xl border text-left transition-all cursor-pointer ${
                  type === 'HR'
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 w-fit">
                  <Users className="w-5 h-5" />
                </div>
                <div className="font-semibold text-sm text-white">HR & Behavioral Interview</div>
                <div className="text-xs text-slate-500">Tests soft skills, workplace collaboration, stress management, and cultural alignment.</div>
              </button>
            </div>
          </div>

          {type === 'Technical' && (
            <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4 animate-slide-in">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" /> Select Focus Technology
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TECHNOLOGIES.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setTechnology(tech)}
                    className={`px-4 py-3.5 rounded-xl border font-medium text-xs tracking-wide transition-all cursor-pointer ${
                      technology === tech
                        ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-500" /> Select Difficulty Level
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-4 py-3.5 rounded-xl border font-medium text-xs tracking-wide transition-all cursor-pointer ${
                    difficulty === diff
                      ? diff === 'Easy' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300' 
                        : diff === 'Medium'
                          ? 'bg-brand-500/10 border-brand-500 text-brand-300' 
                          : 'bg-rose-500/10 border-rose-500 text-rose-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between h-fit space-y-6 bg-gradient-to-b from-slate-900 via-slate-900 to-brand-950/10">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-white border-b border-slate-800 pb-3">Session Summary</h3>
            
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-white">{type} Interview</span>
              </div>
              {type === 'Technical' && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Focus Core:</span>
                  <span className="font-semibold text-brand-400">{technology}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Difficulty:</span>
                <span className={`font-semibold ${
                  difficulty === 'Easy' ? 'text-emerald-400' : difficulty === 'Medium' ? 'text-brand-300' : 'text-rose-400'
                }`}>{difficulty}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Questions:</span>
                <span className="font-semibold text-white">5 Simulation Rounds</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Duration:</span>
                <span className="font-semibold text-white">Flexible (3-min timer/q)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-4 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-brand-600/10 hover:shadow-brand-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Initialize Simulation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
