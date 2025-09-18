const TOKEN_KEY = 'seedit_token';

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  
  getAuthHeader: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

export default auth;
