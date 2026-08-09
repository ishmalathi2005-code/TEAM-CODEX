import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  Share2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export default function Results() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/interviews/history')
      .then(res => {
        const session = res.data.find(s => s.id === sessionId);
        if (session) {
          setResult(session);
        } else {
          if (res.data.length > 0) {
            setResult(res.data[res.data.length - 1]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching results:', err);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-t-2 border-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12 glass-panel rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-2">No Results Found</h3>
        <p className="text-xs text-slate-500 mb-6">We couldn't retrieve the details for this evaluation session.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs hover:bg-slate-850 cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const radarData = Object.entries(result.breakdown || {}).map(([key, val]) => ({
    subject: key,
    A: val,
    fullMark: 100,
  })).filter(item => item.A > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        
        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Results link copied to clipboard!");
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4" /> Share Feedback
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/20">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Performance</h3>
          
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-95">
              <circle 
                cx="88" 
                cy="88" 
                r="74" 
                className="stroke-slate-800 fill-none" 
                strokeWidth="10"
              />
              <circle 
                cx="88" 
                cy="88" 
                r="74" 
                className="stroke-brand-500 fill-none transition-all duration-1000" 
                strokeWidth="10"
                strokeDasharray="465"
                strokeDashoffset={465 - (465 * result.score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-black text-5xl text-white tracking-tight">{result.score}%</span>
              <span className="text-[10px] text-brand-300 font-mono tracking-wider font-semibold uppercase mt-0.5">AI Rating</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold text-white">
              {result.score >= 80 ? 'Distinguished Performance' : result.score >= 65 ? 'Qualified Match' : 'Development Required'}
            </h4>
            <p className="text-[10px] text-slate-500">Evaluation finished on {result.date}</p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 lg:col-span-2 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">AI Evaluation Insights</h3>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              {result.feedback}
            </p>
          </div>

          <div className="p-4.5 bg-slate-950/40 border border-slate-850 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Recommended Next practice</span>
              <p className="text-xs text-white font-medium">Study system caching modules & complex recursion methods</p>
            </div>
            <button 
              onClick={() => navigate('/skills')}
              className="text-xs text-brand-400 font-semibold flex items-center hover:text-brand-300 transition-colors cursor-pointer"
            >
              Train Skill <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> Key Strengths
            </h3>
            
            <ul className="space-y-2">
              {result.strengths?.map((str, idx) => (
                <li 
                  key={idx}
                  className="text-sm text-slate-300 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                  {str}
                </li>
              )) || <div className="text-xs text-slate-500">No core strengths registered.</div>}
            </ul>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <XCircle className="w-4.5 h-4.5 text-rose-400" /> Improvement Areas
            </h3>
            
            <ul className="space-y-2">
              {result.weaknesses?.map((weak, idx) => (
                <li 
                  key={idx}
                  className="text-sm text-slate-300 bg-rose-500/5 border border-rose-500/10 rounded-xl px-4 py-3 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]"></span>
                  {weak}
                </li>
              )) || <div className="text-xs text-slate-500">No focus gaps detected! Perfect session.</div>}
            </ul>
          </div>
        </div>

        {radarData.length > 0 && (
          <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 space-y-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-brand-400" /> Category Breakdown
            </h3>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                  <Radar 
                    name="Candidate" 
                    dataKey="A" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.2} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {Object.entries(result.breakdown || {}).map(([key, value]) => (
                value > 0 && (
                  <div key={key} className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-850">
                    <span className="text-[10px] text-slate-500 block leading-tight mb-1">{key}</span>
                    <span className="font-bold font-mono text-white text-sm">{value}%</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/select')}
          className="flex-1 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold shadow-lg shadow-brand-600/10 transition-all hover:shadow-brand-500/20 text-center cursor-pointer"
        >
          Practice Another Technology
        </button>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded-xl font-bold transition-all cursor-pointer"
        >
          View Full Dashboard
        </button>
      </div>
    </div>
  );
}
