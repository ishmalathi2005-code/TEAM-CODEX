import apiClient from './axios';

// Mock storage key for standalone preview fallback
const MOCK_USERS_KEY = 'codex_mock_registered_users';

// Helper to get local mock users database
const getMockUsers = () => {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall back to default mock users
    }
  }
  return [
    {
      id: 'usr_demo_101',
      name: 'Alex Mercer',
      email: 'alex@codex.ai',
      password: 'password123',
      role: 'Full Stack Candidate',
      interviewsCompleted: 14,
      avgScore: 92
    }
  ];
};

// Helper to save mock users
const saveMockUser = (newUser) => {
  const users = getMockUsers();
  users.push(newUser);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

// Helper to generate fake JWT Token
const generateFakeJWT = (userId, email) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: userId, email, exp: Math.floor(Date.now() / 1000) + 86400 }));
  const signature = btoa("codex_secret_signature_key_2026");
  return `${header}.${payload}.${signature}`;
};

/**
 * Login User API
 * @param {Object} credentials - { email, password }
 */
export const loginApi = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    // If backend endpoint isn't running or network error, fallback to client mock service if enabled
    const useFallback = true;
    
    if (useFallback) {
      console.warn('⚡ [CODEX Auth] Backend API unreachable or fallback enabled. Running in client mock mode.');
      
      // Simulate network latency (400ms)
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const users = getMockUsers();
      const user = users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
      );

      if (!user) {
        const errorRes = new Error('Invalid email or password. Please check your credentials.');
        errorRes.response = { data: { message: 'Invalid email or password.' } };
        throw errorRes;
      }

      // Generate JWT Token & User payload
      const token = generateFakeJWT(user.id, user.email);
      const { password, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Login successful',
        token,
        user: userWithoutPassword
      };
    }
    
    throw error;
  }
};

/**
 * Register User API
 * @param {Object} userData - { name, email, password }
 */
export const registerApi = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    const useFallback = true;

    if (useFallback) {
      console.warn('⚡ [CODEX Auth] Backend API unreachable or fallback enabled. Registering in client mock mode.');

      await new Promise(resolve => setTimeout(resolve, 500));

      const users = getMockUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

      if (existingUser) {
        const errorRes = new Error('An account with this email address already exists.');
        errorRes.response = { data: { message: 'Email address already registered.' } };
        throw errorRes;
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'AI Candidate',
        interviewsCompleted: 0,
        avgScore: 0
      };

      saveMockUser(newUser);

      const token = generateFakeJWT(newUser.id, newUser.email);
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        message: 'Account created successfully!',
        token,
        user: userWithoutPassword
      };
    }

    throw error;
  }
};

/**
 * Fetch Current User Profile API
 */
export const getCurrentUserApi = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    const useFallback = true;

    if (useFallback) {
      const storedUser = localStorage.getItem('codex_user') || sessionStorage.getItem('codex_user');
      if (storedUser) {
        try {
          return { success: true, user: JSON.parse(storedUser) };
        } catch {
          // Invalid stored user
        }
      }
    }

    throw error;
  }
};

/**
 * Logout User API
 */
export const logoutApi = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Ignore error on logout endpoint failure (local token clearing will happen regardless)
  }
};
