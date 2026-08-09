import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [diffFilter, setDiffFilter] = useState('All');
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/interviews/history')
      .then(res => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load history:', err);
        setLoading(false);
      });
  }, []);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.role.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const matchesDiff = diffFilter === 'All' || item.difficulty === diffFilter;
    return matchesSearch && matchesType && matchesDiff;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-t-2 border-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by technology (e.g. React)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 text-sm transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl">
            {['All', 'Technical', 'HR'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl">
            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  diffFilter === d
                    ? 'bg-slate-800 text-slate-200'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 bg-slate-900/30 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-4.5 px-6">Interview Title</th>
                <th className="py-4.5 px-6">Category</th>
                <th className="py-4.5 px-6">Difficulty</th>
                <th className="py-4.5 px-6">Evaluation Score</th>
                <th className="py-4.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-slate-900/20 transition-colors duration-150 group"
                  >
                    <td className="py-4.5 px-6 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800/40 border border-slate-750 rounded-lg text-slate-400">
                          <BookOpen className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="block text-sm">{item.role} Practice</span>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" /> {item.date}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        item.type === 'Technical' 
                          ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20' 
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}>
                        {item.type}
                      </span>
                    </td>

                    <td className="py-4.5 px-6">
                      <span className={`text-xs font-semibold ${
                        item.difficulty === 'Easy' 
                          ? 'text-emerald-400' 
                          : item.difficulty === 'Medium' 
                            ? 'text-brand-300' 
                            : 'text-rose-400'
                      }`}>
                        {item.difficulty}
                      </span>
                    </td>

                    <td className="py-4.5 px-6 font-mono font-bold">
                      <span className={`text-sm px-2.5 py-1 rounded-lg ${
                        item.score >= 80 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : item.score >= 65 
                            ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.score}%
                      </span>
                    </td>

                    <td className="py-4.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedSession(item)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors group-hover:translate-x-0.5 cursor-pointer"
                      >
                        Inspect Report <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-sm text-slate-500">
                    No matching interview logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-end animate-fade-in bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-xl h-full max-h-[90vh] rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in">
            <div className="p-6 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  {selectedSession.role} AI Evaluation
                </h3>
                <p className="text-[10px] text-slate-500">Session ID: {selectedSession.id} • Date: {selectedSession.date}</p>
              </div>
              <button 
                onClick={() => setSelectedSession(null)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Evaluation Score</span>
                  <div className="font-display font-black text-3xl text-white mt-1">{selectedSession.score}%</div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Difficulty Mode</span>
                  <div className="font-display font-black text-xl text-brand-400 mt-2">{selectedSession.difficulty}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-slate-500" /> AI Feedback Summary
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                  {selectedSession.feedback}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Identified Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.strengths?.map((str, i) => (
                      <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                        {str}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weakness Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.weaknesses?.map((weak, i) => (
                      <span key={i} className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg">
                        {weak}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800/80 bg-slate-900/20 flex gap-3">
              <button 
                onClick={() => {
                  setSelectedSession(null);
                  navigate(`/results/${selectedSession.id}`);
                }}
                className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
              >
                Launch Full Evaluation Dashboard
              </button>
              <button 
                onClick={() => setSelectedSession(null)}
                className="px-5 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
