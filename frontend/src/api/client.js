import axios from 'axios';
import auth from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth header to all requests
apiClient.interceptors.request.use((config) => {
  const authHeader = auth.getAuthHeader();
  if (authHeader.Authorization) {
    config.headers.Authorization = authHeader.Authorization;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (email, password, role = 'viewer') =>
    apiClient.post('/auth/register', { email, password, role }),
  
  getMe: () =>
    apiClient.get('/auth/me'),
  
  // Tournament endpoints
  createTournament: (name, sport) =>
    apiClient.post('/tournaments', { name, sport }),
  
  getTournament: (tournamentId) =>
    apiClient.get(`/tournaments/${tournamentId}`),
  
  addTeam: (tournamentId, name, seed = null) =>
    apiClient.post(`/tournaments/${tournamentId}/teams`, { name, seed }),
  
  generateBracket: (tournamentId) =>
    apiClient.post(`/tournaments/${tournamentId}/bracket/generate`),
  
  // Match endpoints
  updateMatchScore: (matchId, score1, score2) =>
    apiClient.post(`/matches/${matchId}/score`, { score1, score2 }),
};
