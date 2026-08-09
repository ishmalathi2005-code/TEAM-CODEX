import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In-Memory Database for Mock REST API
const db = {
  users: [
    {
      id: 'usr_demo_101',
      name: 'Alex Mercer',
      email: 'alex@codex.ai',
      password: 'password123',
      role: 'Full Stack Candidate',
      interviewsCompleted: 14,
      avgScore: 92
    }
  ],
  profile: {
    name: 'Alex Mercer',
    title: 'Frontend Engineer',
    targetRole: 'Senior React Developer',
    experience: '3 Years',
    targetScore: 85
  },
  skills: {
    'React': 82,
    'Node.js': 65,
    'Python': 55,
    'Java': 40,
    'System Design': 50,
    'HR & Behavioral': 75,
    'Communication': 80,
    'Problem Solving': 72
  },
  history: [
    {
      id: 'session-101',
      date: '2026-08-01',
      role: 'React',
      type: 'Technical',
      difficulty: 'Medium',
      score: 78,
      feedback: 'Good understanding of React hooks and state management, but could improve on optimization hooks like useMemo.',
      strengths: ['Hooks usage', 'Component design', 'Virtual DOM explanation'],
      weaknesses: ['Performance optimization', 'Re-rendering causes'],
      breakdown: { 'Code Quality': 75, 'Communication': 85, 'Problem Solving': 74 }
    },
    {
      id: 'session-102',
      date: '2026-08-04',
      role: 'HR & Behavioral',
      type: 'HR',
      difficulty: 'Hard',
      score: 82,
      feedback: 'Strong communication skills and structure using the STAR method. Keep practicing conflict resolution situations.',
      strengths: ['STAR structure', 'Tone & clarity', 'Teamwork focus'],
      weaknesses: ['Technical translation', 'Resolving negative outcomes'],
      breakdown: { 'Code Quality': 0, 'Communication': 90, 'Problem Solving': 80 }
    },
    {
      id: 'session-103',
      date: '2026-08-06',
      role: 'Node.js',
      type: 'Technical',
      difficulty: 'Easy',
      score: 88,
      feedback: 'Excellent grasp of event loops, asynchronous flow, and core Node modules. Demonstrated strong backend foundations.',
      strengths: ['Event Loop', 'Asynchronous JS', 'Stream APIs'],
      weaknesses: ['Error handling patterns'],
      breakdown: { 'Code Quality': 86, 'Communication': 88, 'Problem Solving': 90 }
    }
  ],
  activeSessions: {}
};

// Mock Question Database
const questionsDb = {
  'React': {
    'Easy': [
      "What is the difference between State and Props in React?",
      "What are React hooks, and what are their fundamental rules?",
      "Explain the Virtual DOM and how React uses it for rendering.",
      "What is the significance of the 'key' prop in React lists?",
      "What is the difference between controlled and uncontrolled components?"
    ],
    'Medium': [
      "How do you optimize a React application to prevent unnecessary re-renders?",
      "Explain the difference between useMemo and useCallback hooks with examples.",
      "What is the Context API, and under what circumstances should you use Redux or Zustand instead?",
      "Describe the lifecycle events in functional React components using useEffect.",
      "How does React 18 handle state batching, and how can you force synchronous updates?"
    ],
    'Hard': [
      "How do React Server Components (RSC) work, and how do they differ from SSR (Server-Side Rendering)?",
      "Explain concurrent rendering in React 18, and how to utilize useTransition and useDeferredValue.",
      "What is reconciliation, and how does the Fiber reconciliation engine work under the hood?",
      "Design a custom hook in React for handling async API requests with debouncing, caching, and cleanup.",
      "How would you identify and debug memory leaks in a large-scale React application?"
    ]
  },
  'Node.js': {
    'Easy': [
      "Explain the concept of non-blocking I/O in Node.js.",
      "What is the Node.js Event Loop, and what are its primary phases?",
      "What is the difference between require() and import in Node.js?",
      "How do you handle asynchronous operations in Node.js using callbacks and Promises?",
      "What is the role of package.json and package-lock.json files?"
    ],
    'Medium': [
      "What are Streams in Node.js, and what are the different types of Streams?",
      "Explain the purpose of the cluster module and how it improves application performance.",
      "How does error handling work in Node.js, particularly with uncaughtExceptions?",
      "Describe the difference between process.nextTick() and setImmediate().",
      "How do you handle user authentication and session management in Express.js?"
    ],
    'Hard': [
      "Explain thread pool sizing in Node.js (UV_THREADPOOL_SIZE) and how it affects file system or cryptographic APIs.",
      "Describe the memory management cycle in Node.js. How do you profile and debug V8 heap memory leaks?",
      "Design a scalable event-driven architecture using Node.js EventEmitter and Redis Pub/Sub.",
      "Explain backpressure in Node.js streams and how to handle it when writing readable-writable pipes.",
      "How do you secure a production Node.js API against standard vulnerabilities (XSS, CSRF, ReDoS, SQL injection)?"
    ]
  },
  'Python': {
    'Easy': [
      "What are the main differences between Python lists and tuples?",
      "How does memory management work in Python (garbage collection and reference counting)?",
      "What are decorators in Python, and how do you write a custom decorator?",
      "Explain list comprehensions with an example.",
      "What is the difference between deep copy and shallow copy in Python?"
    ],
    'Medium': [
      "What are generators and yield in Python, and how do they save memory?",
      "Explain the Global Interpreter Lock (GIL) and its impact on multi-threaded programs.",
      "How do you perform unit testing in Python? What is patching in unittest.mock?",
      "Explain the difference between *args and **kwargs in function definitions.",
      "What are metaclasses in Python, and what are their use cases?"
    ],
    'Hard': [
      "Explain Python async/await and how the asyncio event loop schedules coroutines under the hood.",
      "How do you design a custom Context Manager in Python using both class-based and generator-based approaches?",
      "Describe method resolution order (MRO) in Python multiple inheritance and how super() resolves it.",
      "How would you optimize a CPU-bound Python script using multiprocessing, Cython, or PyPy?",
      "Explain how descriptor classes work (__get__, __set__, __delete__) and how Python properties use them internally."
    ]
  },
  'System Design': {
    'Easy': [
      "What is the difference between vertical scaling and horizontal scaling?",
      "What is a Load Balancer, and what are some common load balancing algorithms?",
      "Explain the concept of caching and when you should use a cache.",
      "What are the primary differences between SQL and NoSQL databases?",
      "What is a Content Delivery Network (CDN) and why is it used?"
    ],
    'Medium': [
      "Explain database sharding and replication. What are the trade-offs of each?",
      "Describe the CAP Theorem and explain why you cannot achieve all three properties in a distributed system.",
      "Design a rate limiter for an API. What algorithm and data store would you use?",
      "What is a message queue (e.g. RabbitMQ, Kafka) and how does it help in decoupling services?",
      "How do you design a system to handle high read traffic for a breaking news website?"
    ],
    'Hard': [
      "Design a global video streaming platform like YouTube or Netflix. Explain storage, transcoding, and delivery.",
      "How would you design a distributed ID generator (e.g., Snowflake) that generates unique, sorting-friendly IDs?",
      "Explain the consensus algorithms like Paxos or Raft. Why are they needed in distributed databases?",
      "Design a collaborative real-time editor (like Google Docs). How do you handle merge conflicts (OT vs CRDT)?",
      "Describe how you would design a logging and monitoring platform for microservices handling 100k requests/sec."
    ]
  },
  'HR & Behavioral': {
    'Easy': [
      "Tell me about yourself and your professional background.",
      "Why are you interested in joining our company?",
      "What are your greatest professional strengths and weaknesses?",
      "Describe your ideal work environment.",
      "How do you handle stress and pressure in the workplace?"
    ],
    'Medium': [
      "Describe a time when you had to work with a difficult team member. How did you handle it?",
      "Tell me about a project you completed successfully. What steps did you take to ensure success?",
      "How do you prioritize tasks and manage your time when working on multiple projects with tight deadlines?",
      "Describe a situation where you made a mistake at work. How did you rectify it and what did you learn?",
      "How do you handle constructive criticism or negative feedback from a manager or peer?"
    ],
    'Hard': [
      "Describe a time when you had to lead a project with ambiguous requirements and no clear direction. What did you do?",
      "Tell me about a time you had a major technical disagreement with a senior teammate or architect. How was it resolved?",
      "Describe a situation where you had to make a critical compromise between code quality, deadline, and feature scope.",
      "Describe a time when a project you were responsible for failed. How did you manage communication and post-mortems?",
      "How do you keep yourself motivated and continue learning in a rapidly changing technical landscape?"
    ]
  }
};

const fallbackQuestions = [
  "Describe your experience with software development lifecycle processes.",
  "How do you ensure code quality and write clean, maintainable code?",
  "What is your approach to debugging complex software issues?",
  "How do you collaborate with cross-functional teams (PMs, QA, designers)?",
  "Explain a challenging technical obstacle you overcame recently."
];

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function generateToken(id, email) {
  return `mock_token_${id}_${Date.now()}`;
}

// Custom Mock API Plugin for Vite
function mockApiPlugin() {
  return {
    name: 'mock-rest-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');

        try {
          // --- POST /api/auth/login ---
          if (req.url === '/api/auth/login' && req.method === 'POST') {
            const body = await parseBody(req);
            const user = db.users.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase());
            
            if (!user || user.password !== body.password) {
              res.statusCode = 401;
              res.end(JSON.stringify({ message: 'Invalid email or password.' }));
              return;
            }

            const token = generateToken(user.id, user.email);
            const { password, ...userWithoutPass } = user;
            res.end(JSON.stringify({
              success: true,
              message: 'Login successful',
              token,
              user: userWithoutPass
            }));
            return;
          }

          // --- POST /api/auth/register ---
          if (req.url === '/api/auth/register' && req.method === 'POST') {
            const body = await parseBody(req);
            const existing = db.users.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase());

            if (existing) {
              res.statusCode = 400;
              res.end(JSON.stringify({ message: 'Email address already registered.' }));
              return;
            }

            const newUser = {
              id: `usr_${Date.now()}`,
              name: body.name,
              email: body.email,
              password: body.password,
              role: 'AI Candidate'
            };
            db.users.push(newUser);
            db.profile.name = body.name;

            const token = generateToken(newUser.id, newUser.email);
            const { password, ...userWithoutPass } = newUser;
            res.end(JSON.stringify({
              success: true,
              message: 'Account created successfully!',
              token,
              user: userWithoutPass
            }));
            return;
          }

          // --- GET /api/auth/me ---
          if (req.url === '/api/auth/me' && req.method === 'GET') {
            const user = db.users[0];
            const { password, ...userWithoutPass } = user;
            res.end(JSON.stringify({ success: true, user: userWithoutPass }));
            return;
          }

          // --- POST /api/auth/logout ---
          if (req.url === '/api/auth/logout' && req.method === 'POST') {
            res.end(JSON.stringify({ success: true }));
            return;
          }

          // --- GET /api/profile ---
          if (req.url === '/api/profile' && req.method === 'GET') {
            res.end(JSON.stringify(db.profile));
            return;
          }

          // --- POST /api/profile ---
          if (req.url === '/api/profile' && req.method === 'POST') {
            const body = await parseBody(req);
            db.profile = { ...db.profile, ...body };
            res.end(JSON.stringify({ success: true, profile: db.profile }));
            return;
          }

          // --- GET /api/dashboard/stats ---
          if (req.url === '/api/dashboard/stats' && req.method === 'GET') {
            const completedCount = db.history.length;
            const totalScore = db.history.reduce((acc, item) => acc + item.score, 0);
            const averageScore = completedCount > 0 ? Math.round(totalScore / completedCount) : 0;
            const targetScore = db.profile.targetScore;

            res.end(JSON.stringify({
              completedInterviews: completedCount,
              averageScore: averageScore,
              practiceHours: completedCount * 1.5 + 4.5,
              targetMet: averageScore >= targetScore,
              targetScore: targetScore
            }));
            return;
          }

          // --- GET /api/dashboard/activity ---
          if (req.url === '/api/dashboard/activity' && req.method === 'GET') {
            const activity = db.history.slice(-5).reverse().map(item => ({
              id: item.id,
              date: item.date,
              description: `Completed ${item.difficulty} ${item.role} ${item.type} Interview`,
              score: item.score
            }));
            res.end(JSON.stringify(activity));
            return;
          }

          // --- GET /api/dashboard/charts ---
          if (req.url === '/api/dashboard/charts' && req.method === 'GET') {
            const chartData = db.history.map((item, idx) => ({
              attempt: idx + 1,
              date: item.date.slice(5),
              score: item.score,
              label: `${item.role} (${item.difficulty.slice(0,1)})`
            }));
            res.end(JSON.stringify(chartData));
            return;
          }

          // --- GET /api/skills/status ---
          if (req.url === '/api/skills/status' && req.method === 'GET') {
            res.end(JSON.stringify({
              skills: db.skills,
              recommendations: [
                {
                  id: 'rec-1',
                  skill: 'System Design',
                  reason: 'Score is currently 50% vs target 80%',
                  action: 'Practice scalable system architectures (YouTube, CDN design)'
                },
                {
                  id: 'rec-2',
                  skill: 'React Optimization',
                  reason: 'AI noticed weak understanding of useMemo and re-rendering on recent session',
                  action: 'Complete custom hook exercises & read about reconciliation mechanics'
                },
                {
                  id: 'rec-3',
                  skill: 'Node.js Security',
                  reason: 'No database query sanitization mentioned in your backend session answers',
                  action: 'Solve Express SQL injection and CSRF prevention modules'
                }
              ]
            }));
            return;
          }

          // --- GET /api/interviews/history ---
          if (req.url === '/api/interviews/history' && req.method === 'GET') {
            res.end(JSON.stringify(db.history));
            return;
          }

          // --- GET /api/interviews/session/:id ---
          const sessionGetRegex = /^\/api\/interviews\/session\/(session-\d+)$/;
          const sessionGetMatch = req.url.match(sessionGetRegex);
          if (sessionGetMatch && req.method === 'GET') {
            const sessionId = sessionGetMatch[1];
            const session = db.activeSessions[sessionId];
            if (session) {
              res.end(JSON.stringify({
                id: session.id,
                role: session.role,
                type: session.type,
                difficulty: session.difficulty,
                questions: session.questions
              }));
            } else {
              const questionsPool = questionsDb['React']['Medium'];
              res.end(JSON.stringify({
                id: sessionId,
                role: 'React',
                type: 'Technical',
                difficulty: 'Medium',
                questions: questionsPool
              }));
            }
            return;
          }

          // --- POST /api/interviews/start ---
          if (req.url === '/api/interviews/start' && req.method === 'POST') {
            const body = await parseBody(req);
            const { type, technology, difficulty } = body;

            const categoryKey = type === 'HR' ? 'HR & Behavioral' : (technology || 'React');
            const questionsPool = (questionsDb[categoryKey] && questionsDb[categoryKey][difficulty]) || fallbackQuestions;

            const sessionId = 'session-' + Date.now();
            db.activeSessions[sessionId] = {
              id: sessionId,
              date: new Date().toISOString().split('T')[0],
              role: categoryKey,
              type: type,
              difficulty: difficulty,
              questions: questionsPool,
              answers: Array(questionsPool.length).fill(''),
              scores: Array(questionsPool.length).fill(0),
              feedbacks: Array(questionsPool.length).fill(''),
              startTime: Date.now()
            };

            res.end(JSON.stringify({
              sessionId: sessionId,
              questions: questionsPool
            }));
            return;
          }

          // --- POST /api/interviews/:id/submit ---
          const submitRegex = /^\/api\/interviews\/(session-\d+)\/submit$/;
          const submitMatch = req.url.match(submitRegex);
          if (submitMatch && req.method === 'POST') {
            const sessionId = submitMatch[1];
            const session = db.activeSessions[sessionId];

            if (!session) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Session not found' }));
              return;
            }

            const body = await parseBody(req);
            const { questionIndex, answer } = body;
            session.answers[questionIndex] = answer;

            let score = 50;
            let feedback = "Response is a bit short. Try expanding with real-world examples, describing trade-offs or applying technical terms.";

            if (answer && answer.trim().length > 30) {
              score += 15;
              feedback = "Good core answer. To make it stronger, provide a concrete codebase scenario where you applied this principle.";
            }
            if (answer && answer.trim().length > 100) {
              score += 15;
              feedback = "Detailed response showing solid theoretical insight. You structured the explanation effectively.";
            }

            const keywords = [
              'render', 'state', 'hook', 'performance', 'virtual dom', 'asynchronous', 
              'event loop', 'callback', 'promise', 'database', 'caching', 'load balancing',
              'scaling', 'star method', 'conflict', 'deadline', 'resolution', 'reconcile',
              'useeffect', 'usememo', 'usecallback', 'middleware', 'stream', 'async', 'await'
            ];

            let matchedCount = 0;
            const answerLower = (answer || '').toLowerCase();
            keywords.forEach(word => {
              if (answerLower.includes(word)) matchedCount++;
            });

            if (matchedCount > 0) {
              score += Math.min(20, matchedCount * 5);
              feedback += ` Excellent mention of relevant concepts like: ${keywords.filter(w => answerLower.includes(w)).slice(0, 3).join(', ')}.`;
            }

            score = Math.min(100, Math.max(10, score));
            session.scores[questionIndex] = score;
            session.feedbacks[questionIndex] = feedback;

            res.end(JSON.stringify({
              success: true,
              score: score,
              feedback: feedback
            }));
            return;
          }

          // --- POST /api/interviews/:id/finish ---
          const finishRegex = /^\/api\/interviews\/(session-\d+)\/finish$/;
          const finishMatch = req.url.match(finishRegex);
          if (finishMatch && req.method === 'POST') {
            const sessionId = finishMatch[1];
            const session = db.activeSessions[sessionId];

            if (!session) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Session not found' }));
              return;
            }

            const validScores = session.scores.filter(s => s > 0);
            const finalScore = validScores.length > 0 
              ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
              : 60;

            let overallFeedback = '';
            let strengths = [];
            let weaknesses = [];

            if (session.type === 'Technical') {
              if (finalScore >= 80) {
                overallFeedback = `Excellent tech interview! You demonstrated a senior level understanding of ${session.role}. Code cleanliness, algorithmic intuition, and conceptual depth were all highly visible.`;
                strengths = [`${session.role} fundamentals`, 'Architectural design', 'Edge-case awareness'];
                weaknesses = ['Minor code documentation', 'Optimizing rare conditions'];
              } else if (finalScore >= 65) {
                overallFeedback = `Solid tech interview. You understand the core concepts of ${session.role} well. Work on explaining complex details more structurally, and prevent minor syntax bugs or shallow definitions.`;
                strengths = ['Core syntax', 'Asynchronous processing', 'Basic problem solving'];
                weaknesses = ['Complex performance optimization', 'Detailed system internals'];
              } else {
                overallFeedback = `Practicing more will help. Familiarize yourself with the foundational components of ${session.role}, run local code challenges, and concentrate on explainability and core definitions.`;
                strengths = ['Willingness to explain', 'Basic syntax familiarity'];
                weaknesses = ['Core concept definitions', 'Handling complex data scenarios', 'Error catching patterns'];
              }
            } else {
              if (finalScore >= 80) {
                overallFeedback = `Outstanding behavioral showcase. You successfully apply the STAR method (Situation, Task, Action, Result) with clear, business-driven outcomes and strong professional character.`;
                strengths = ['STAR structure alignment', 'Conflict negotiation', 'Empathetic leadership'];
                weaknesses = ['Providing negative results examples'];
              } else {
                overallFeedback = `Decent HR presentation. Remember to specify the exact Actions YOU took and the quantifiable Results achieved in your responses rather than speaking generally.`;
                strengths = ['Clear articulation', 'Positive team mentality'];
                weaknesses = ['Quantifying results metrics', 'Structuring responses under pressure'];
              }
            }

            const breakdown = {
              'Code Quality': session.type === 'Technical' ? Math.round(finalScore * 0.95 + (Math.random() * 8 - 4)) : 0,
              'Communication': Math.round(finalScore * 1.02 + (Math.random() * 6 - 3)),
              'Problem Solving': Math.round(finalScore * 0.98 + (Math.random() * 8 - 4))
            };

            Object.keys(breakdown).forEach(k => {
              breakdown[k] = Math.min(100, Math.max(10, breakdown[k]));
            });

            const finishedSession = {
              id: session.id,
              date: session.date,
              role: session.role,
              type: session.type,
              difficulty: session.difficulty,
              score: finalScore,
              feedback: overallFeedback,
              strengths: strengths,
              weaknesses: weaknesses,
              breakdown: breakdown
            };

            db.history.push(finishedSession);
            delete db.activeSessions[sessionId];

            res.end(JSON.stringify(finishedSession));
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Endpoint not found' }));

        } catch (error) {
          console.error('Mock API Error:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal Server Error', details: error.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
