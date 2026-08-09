import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  AlertTriangle, 
  ChevronRight, 
  Mic, 
  MicOff, 
  Terminal, 
  Clock, 
  HelpCircle,
  LogOut
} from 'lucide-react';

export default function InterviewSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/interviews/session/${sessionId}`)
      .then(res => {
        setQuestions(res.data.questions || []);
        setSessionDetails({
          id: res.data.id,
          role: res.data.role,
          type: res.data.type,
          difficulty: res.data.difficulty
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Session loading failed:', err);
        setLoading(false);
      });
  }, [sessionId]);

  useEffect(() => {
    if (loading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, currentIdx]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = (auto = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const submissionAnswer = answer.trim() || "[No response provided within simulation duration]";

    axios.post(`/api/interviews/${sessionId}/submit`, {
      questionIndex: currentIdx,
      answer: submissionAnswer
    })
      .then(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setAnswer('');
          setTimeLeft(180);
          setIsSubmitting(false);
          setIsRecording(false);
        } else {
          axios.post(`/api/interviews/${sessionId}/finish`)
            .then(finishRes => {
              navigate(`/results/${finishRes.data.id}`);
            })
            .catch(err => {
              console.error('Failed to conclude interview:', err);
              setIsSubmitting(false);
            });
        }
      })
      .catch(err => {
        console.error('Answer submission failed:', err);
        setIsSubmitting(false);
      });
  };

  const applySTAR = () => {
    setAnswer(
      "Situation:\n[Describe the context/problem you faced]\n\n" +
      "Task:\n[Explain what goal or challenge you had to achieve]\n\n" +
      "Action:\n[Detail the specific steps YOU took to solve it]\n\n" +
      "Result:\n[Summarize the final outcomes, learnings, and metric gains]"
    );
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(currentRec => {
          if (currentRec) {
            setAnswer(prev => {
              const prefix = prev ? prev + " " : "";
              return prefix + "In my experience, resolving this involves analyzing performance trade-offs, isolating state variables, and using appropriate architectural principles efficiently.";
            });
            return false;
          }
          return false;
        });
      }, 4500);
    } else {
      setIsRecording(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-10 h-10 border-t-2 border-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isHR = sessionDetails?.type === 'HR';
  const progressPercent = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between select-none animate-fade-in">
      <header className="glass-panel border-b border-slate-800/80 px-8 py-4 flex items-center justify-between bg-slate-950/90 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to exit the interview session? Progress will be lost.")) {
                navigate('/select');
              }
            }}
            className="p-2 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Exit Session"
          >
            <LogOut className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-slate-800"></div>

          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              CODEX AI Simulator
              <span className="text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30 px-1.5 py-0.5 rounded font-mono font-medium">LIVE</span>
            </h2>
            <p className="text-xs text-slate-500">{sessionDetails?.role} • {sessionDetails?.difficulty} Module</p>
          </div>
        </div>

        <div className={`flex items-center gap-2.5 px-4 py-2 border rounded-xl font-mono text-sm font-bold transition-colors duration-300 ${
          timeLeft < 40 
            ? 'bg-rose-500/10 border-rose-500 text-rose-400 animate-pulse' 
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          <Clock className={`w-4 h-4 ${timeLeft < 40 ? 'animate-spin' : ''}`} />
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-800/50">
        <div className="bg-slate-950 p-10 flex flex-col justify-between space-y-8 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full uppercase">
                Round {currentIdx + 1} of {questions.length}
              </span>
              {timeLeft < 40 && (
                <span className="text-xs text-rose-400 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-4 h-4" /> Time limits warning
                </span>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-display font-bold text-2xl text-white leading-snug">
                {questions[currentIdx]}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {isHR 
                  ? "Describe a specific instance from your career. Be detailed and explain what you learned from the experience." 
                  : "Explain the theoretical architecture and provide code or architectural layouts demonstrating correct implementation."
                }
              </p>
            </div>
          </div>

          <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-3">
            <h4 className="text-xs font-semibold text-white flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-brand-400" /> Interview Simulation Tips:
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Give complete sentences mentioning core libraries, trade-offs, and algorithms.</li>
              <li>Toggle the <strong className="text-brand-300">Voice Dictation</strong> to dictate answers (speech simulation).</li>
              {isHR 
                ? <li>Use the <strong className="text-indigo-400">STAR Layout</strong> to format your answers professionally.</li>
                : <li>Include code blocks, imports, and variables inside the simulation console.</li>
              }
            </ul>
          </div>
        </div>

        <div className="bg-slate-950 p-8 flex flex-col justify-between space-y-6">
          <div className="flex-1 flex flex-col">
            <div className="bg-slate-900 border border-slate-800 border-b-0 rounded-t-2xl px-4 py-3 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </span>
                <div className="h-4 w-px bg-slate-800 mx-1"></div>
                <span className="font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-400" /> 
                  {isHR ? 'behavioral_answer.txt' : 'code_solution.jsx'}
                </span>
              </div>

              {isHR && (
                <button
                  onClick={applySTAR}
                  className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-md font-semibold text-[10px] transition-colors cursor-pointer"
                >
                  Apply STAR Template
                </button>
              )}
            </div>

            <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-b-2xl p-4 flex gap-4 font-mono text-sm relative overflow-hidden min-h-[300px]">
              <div className="text-slate-700 select-none text-right w-6 space-y-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={
                  isHR 
                    ? "Type your response using Situation, Task, Action, and Result parameters..."
                    : "// Write explanation or code block here...\nfunction solution() {\n  return (\n    <div>...</div>\n  );\n}"
                }
                className="flex-1 bg-transparent text-slate-300 placeholder-slate-700 border-none resize-none focus:outline-none h-full outline-none leading-6 w-full"
                spellCheck="false"
              />

              {isRecording && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 transition-all">
                  <div className="flex items-center gap-1.5 h-8">
                    <span className="w-1 h-6 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-1 h-8 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    <span className="w-1 h-4 bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></span>
                    <span className="w-1 h-7 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1 h-5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                  <p className="text-xs text-brand-300 font-mono animate-pulse">Transcribing speech in real-time...</p>
                  <button 
                    onClick={() => setIsRecording(false)}
                    className="px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel Dictation
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4.5 py-3 rounded-xl border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isRecording 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-brand-400" />}
              {isRecording ? 'Mute Dictation' : 'Dictate Response'}
            </button>

            <button
              onClick={() => handleNext(false)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-brand-600/10 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {currentIdx === questions.length - 1 ? 'Conclude Interview' : 'Submit Round'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-slate-950/80 px-8 py-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 w-72">
          <span className="text-slate-500">Progress:</span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-500 transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="font-mono text-slate-300 font-bold">{Math.round(progressPercent)}%</span>
        </div>

        <div className="flex gap-2.5">
          {questions.map((_, i) => (
            <div 
              key={i}
              className={`w-2.5 h-2.5 rounded-full border transition-all ${
                i < currentIdx 
                  ? 'bg-emerald-500 border-emerald-600' 
                  : i === currentIdx 
                    ? 'bg-brand-500 border-brand-600 ring-2 ring-brand-500/20' 
                    : 'bg-transparent border-slate-800'
              }`}
            ></div>
          ))}
        </div>
      </footer>
    </div>
  );
}
