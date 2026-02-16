import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  xp: number;
  login: (email: string, password: string) => void;
  signup: (fullName: string, email: string, password: string) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  getLevel: () => { title: string; min: number; max: number };
}

const AuthContext = createContext<AuthContextType | null>(null);

const LEVELS = [
  { title: 'Law Rookie', min: 0, max: 199 },
  { title: 'Legal Apprentice', min: 200, max: 499 },
  { title: 'Case Analyst', min: 500, max: 999 },
  { title: 'Advocate', min: 1000, max: 1999 },
  { title: 'Senior Counsel', min: 2000, max: Infinity },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [xp, setXP] = useState(0);

  const login = (email: string, _password: string) => {
    setUser({ fullName: email.split('@')[0], email });
  };

  const signup = (fullName: string, email: string, _password: string) => {
    setUser({ fullName, email });
  };

  const logout = () => {
    setUser(null);
    setXP(0);
  };

  const addXP = (amount: number) => {
    setXP(prev => prev + amount);
  };

  const getLevel = () => {
    return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
  };

  return (
    <AuthContext.Provider value={{ user, xp, login, signup, logout, addXP, getLevel }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
