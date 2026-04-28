import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('fp_user')); } catch { return null; }
  });
  const [authError, setAuthError] = useState('');

  const login = useCallback(async (username, password) => {
    try {
      const data = await authApi.login({ username, password });
      sessionStorage.setItem('fp_token', data.token);
      sessionStorage.setItem('fp_user',  JSON.stringify(data.user));
      setUser(data.user);
      setAuthError('');
      return true;
    } catch (err) {
      setAuthError(err.message || 'Invalid credentials');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('fp_token');
    sessionStorage.removeItem('fp_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
