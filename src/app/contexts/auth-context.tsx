import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../../../src/services/authService';

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
    location: string;
    role?: string;
    yearsOfExperience?: number;
    availability?: string;
    specialization?: string[];
    hourlyRate?: number;
    profileImage?: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'sahayak_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { token: string; user: User };
        setToken(parsed.token);
        setUser(parsed.user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const loggedUser = response.user as User;
    setUser(loggedUser);
    setToken(response.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: response.token, user: loggedUser }));
  };

  const signup = async (payload: {
    name: string;
    email: string;
    password: string;
    phone: string;
    location: string;
    role?: string;
    yearsOfExperience?: number;
    availability?: string;
    specialization?: string[];
    hourlyRate?: number;
    profileImage?: string;
  }) => {
    const response = await authService.signup(payload);
    const newUser = response.user as User;
    setUser(newUser);
    setToken(response.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: response.token, user: newUser }));
  };

  const logout = () => {
    if (token) {
      void authService.logout(token);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated: !!user && !!token, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
