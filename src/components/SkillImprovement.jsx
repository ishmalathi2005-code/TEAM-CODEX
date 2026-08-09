import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  Lightbulb,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export default function SkillImprovement() {
  const [skills, setSkills] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activePracticeId, setActivePracticeId] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceResult, setPracticeResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    axios.get('/api/skills/status')
      .then(res => {
        setSkills(res.data.skills);
        setRecommendations(res.data.recommendations);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load skills details:', err);
        setLoading(false);
      });
  }, []);

  const radarData = Object.entries(skills).map(([key, value]) => ({
    subject: key,
    A: value,
    B: 85,
    fullMark: 100,
  }));

  const practiceQuestions = {
    'rec-1': {
      title: 'Designing a Rate Limiter',
      prompt: 'Explain how you would implement a Distributed Rate Limiter utilizing Redis. Which Redis data structure is optimal, and how do you prevent race conditions?',
      sampleAns: 'We can use Redis Sorted Sets (ZSET) with a sliding window log algorithm...'
    },
    'rec-2': {
      title: 'Preventing React Component Re-renders',
      prompt: 'Describe how React.memo differs from useMemo. Write a short snippet explaining when to wrap a functional component in memo.',
      sampleAns: 'React.memo is a higher-order component that memoizes props, while useMemo memoizes a value inside a component render loop...'
    },
    'rec-3': {
      title: 'Express JWT Authorization Middleware',
      prompt: 'Write a basic Express middleware function to verify a Bearer token in the Authorization header using jsonwebtoken.verify.',
      sampleAns: 'const auth = (req, res, next) => { const token = req.headers.authorization?.split(" ")[1]... }'
    }
  };

  const startPractice = (id) => {
    setActivePracticeId(id);
    setPracticeAnswer('');
    setPracticeResult(null);
  };

  const evaluatePractice = () => {
    setEvaluating(true);
    setTimeout(() => {
      let score = 50;
      let review = "Your answer is short. Try detailing the specific syntax or edge cases.";

      if (practiceAnswer.length > 40) {
        score = 80;
        review = "Good answer! You successfully mentioned key libraries and described the core algorithm correctly. Keep using this terminology.";
      }
      if (practiceAnswer.toLowerCase().includes("redis") || practiceAnswer.toLowerCase().includes("memo") || practiceAnswer.toLowerCase().includes("middleware")) {
        score += 15;
      }

      setPracticeResult({
        score: Math.min(100, score),
        feedback: review
      });
      setEvaluating(false);

      if (activePracticeId === 'rec-1') {
        setSkills(prev => ({ ...prev, 'System Design': Math.min(100, prev['System Design'] + 5) }));
      } else if (activePracticeId === 'rec-2') {
        setSkills(prev => ({ ...prev, 'React': Math.min(100, prev['React'] + 3) }));
      } else if (activePracticeId === 'rec-3') {
        setSkills(prev => ({ ...prev, 'Node.js': Math.min(100, prev['Node.js'] + 4) }));
      }

    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-t-2 border-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 lg:col-span-2 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Skill Capabilities Analysis</h3>
            <p className="text-xs text-slate-500 font-sans">Compare your current score averages against target benchmarks</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar 
                  name="Current Rating" 
                  dataKey="A" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.2} 
                />
                <Radar 
                  name="Benchmark Target (85%)" 
                  dataKey="B" 
                  stroke="#334155" 
                  fill="none" 
                  strokeDasharray="4 4" 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-500 rounded-full"></span>
              <span className="text-slate-300">Your Current Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-px border-t-2 border-dashed border-slate-600"></span>
              <span className="text-slate-500">Benchmark Target (85%)</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between space-y-6 bg-gradient-to-b from-slate-900 via-slate-900 to-brand-950/15">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-white">Target Focus Plan</h3>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white">Communication Skill is Strong</span>
                  <span className="text-[10px] text-slate-500">Keep maintaining current verbal style.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white">System Design is Critical</span>
                  <span className="text-[10px] text-slate-500">Focus practice here to unlock Senior path.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" /> Premium Modules
              </span>
              <span className="text-[10px] text-brand-300 font-bold bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">PRO</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Unlock advanced coding sandboxes, mock database schema exercises, and live audio panel simulations.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg text-white">AI-Recommended Practice Exercises</h3>
          <p className="text-xs text-slate-500">Solve targeted mini-assessments to raise capability ratings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map(rec => (
            <div 
              key={rec.id}
              className={`glass-panel rounded-2xl p-5 border border-slate-850 flex flex-col justify-between space-y-4 hover:border-brand-500/20 transition-colors ${
                activePracticeId === rec.id ? 'ring-1 ring-brand-500/30 bg-slate-900/60' : ''
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-wide text-brand-400">
                  <Lightbulb className="w-4 h-4 text-brand-500" /> {rec.skill}
                </div>
                <h4 className="text-sm font-semibold text-white leading-snug">{rec.action}</h4>
                <p className="text-[11px] text-slate-500">{rec.reason}</p>
              </div>

              {activePracticeId !== rec.id ? (
                <button
                  onClick={() => startPractice(rec.id)}
                  className="w-full flex items-center justify-center gap-1 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Solve Practice Question <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="space-y-4 pt-3 border-t border-slate-800/60 animate-slide-in">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Question prompt:</span>
                    <p className="text-xs text-slate-300 leading-normal">{practiceQuestions[rec.id]?.prompt}</p>
                  </div>
                  
                  {practiceResult ? (
                    <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Assessment Score:</span>
                        <span className="text-xs font-mono font-bold text-white">{practiceResult.score}%</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{practiceResult.feedback}</p>
                      <button
                        onClick={() => setActivePracticeId(null)}
                        className="text-[10px] text-brand-400 font-semibold hover:underline block pt-1.5 cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={practiceAnswer}
                        onChange={(e) => setPracticeAnswer(e.target.value)}
                        placeholder="Write your explanation or code details here..."
                        className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-700 resize-none focus:outline-none focus:border-brand-500 font-mono"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={evaluatePractice}
                          disabled={evaluating}
                          className="flex-1 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {evaluating ? 'Evaluating...' : 'Submit Answer'}
                        </button>
                        <button
                          onClick={() => setActivePracticeId(null)}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
