import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Play, 
  Award, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/dashboard/stats'),
      axios.get('/api/dashboard/activity'),
      axios.get('/api/dashboard/charts')
    ])
      .then(([statsRes, activityRes, chartRes]) => {
        setStats(statsRes.data);
        setActivities(activityRes.data);
        setChartData(chartRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-t-2 border-brand-500 animate-spin"></div>
          <div className="absolute inset-0 m-auto w-6 h-6 rounded-full border-b-2 border-brand-300 animate-ping"></div>
        </div>
      </div>
    );
  }

  const barData = chartData.slice(-5);
  const colors = ['#8b5cf6', '#6366f1', '#a78bfa', '#ec4899', '#f43f5e'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden glass-panel rounded-3xl p-8 border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="font-display font-bold text-3xl tracking-tight text-white">
              Ace Your Next Tech Interview
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              CODEX simulates realistic coding tests and behavioral panels with immediate AI scoring, feedback report, and targeted skill analysis.
            </p>
          </div>
          <button 
            onClick={() => navigate('/select')}
            className="flex items-center gap-2.5 px-6 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-semibold shadow-lg shadow-brand-600/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 hover:shadow-brand-500/30 group cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current text-white group-hover:scale-110 transition-transform" />
            Start AI Simulation
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-brand-600/10 blur-3xl"></div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Sessions</p>
            <h3 className="font-display font-bold text-3xl text-white">{stats?.completedInterviews || 0}</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +1 this week
            </p>
          </div>
          <div className="p-3.5 bg-brand-500/15 border border-brand-500/25 rounded-2xl text-brand-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average AI Score</p>
            <h3 className="font-display font-bold text-3xl text-white">{stats?.averageScore || 0}%</h3>
            <p className="text-[10px] text-brand-300">Target: {stats?.targetScore}%</p>
          </div>
          <div className="p-3.5 bg-indigo-500/15 border border-indigo-500/25 rounded-2xl text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Practice Time</p>
            <h3 className="font-display font-bold text-3xl text-white">{stats?.practiceHours || 0} hrs</h3>
            <p className="text-[10px] text-slate-500">Includes active simulations</p>
          </div>
          <div className="p-3.5 bg-pink-500/15 border border-pink-500/25 rounded-2xl text-pink-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Threshold</p>
            <h3 className="font-display font-bold text-xl text-white">
              {stats?.targetMet ? 'Met & Exceeded' : 'Approaching'}
            </h3>
            <p className="text-[10px] text-slate-500">Based on past 3 entries</p>
          </div>
          <div className={`p-3.5 rounded-2xl border ${
            stats?.targetMet 
              ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400' 
              : 'bg-amber-500/15 border-amber-500/25 text-amber-400'
          }`}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts & Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Overall Score Timeline</h3>
              <p className="text-xs text-slate-500">Your historical score fluctuations across mock interviews</p>
            </div>
            <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              Last {chartData.length} Attempts
            </div>
          </div>

          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.25)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b', 
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                    formatter={(value, name, props) => [`${value}%`, props.payload.label]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#scoreColor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No performance data recorded yet.
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white">Recent Score Comparison</h3>
            <p className="text-xs text-slate-500">Comparing final scores of recent sessions</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.1)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b', 
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px'
                    }}
                    formatter={(value, name, props) => [`${value}%`, props.payload.label]}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={30}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-slate-500">No mock comparisons available.</div>
            )}
          </div>

          <div className="text-xs text-slate-400 text-center font-mono">
            Bar colors match chronological attempts
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg text-white">Recent Practice Sessions</h3>
          <p className="text-xs text-slate-500">View detailed reports and AI evaluations from recent simulations</p>
        </div>

        <div className="divide-y divide-slate-800/80">
          {activities.length > 0 ? (
            activities.map((act) => (
              <div 
                key={act.id}
                className="py-4 flex items-center justify-between group hover:bg-slate-900/20 px-2 rounded-xl transition-colors duration-200 cursor-pointer"
                onClick={() => navigate(`/results/${act.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-slate-300">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                      {act.description}
                    </h4>
                    <p className="text-xs text-slate-500">{act.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`text-sm font-bold font-mono px-2.5 py-1 rounded-lg ${
                      act.score >= 80 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : act.score >= 65 
                          ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {act.score}%
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-slate-500">
              You haven't completed any sessions yet. Click "Start AI Simulation" above to practice!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
