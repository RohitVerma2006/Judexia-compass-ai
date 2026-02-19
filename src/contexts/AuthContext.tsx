import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Session, User } from '@supabase/supabase-js';

interface AuthUser {
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  xp: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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

function userFromSupabase(u: User): AuthUser {
  return {
    fullName:
      u.user_metadata?.full_name ||
      u.user_metadata?.name ||
      u.email?.split('@')[0] ||
      'User',
    email: u.email || '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [xp, setXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ? userFromSupabase(sess.user) : null);
      setLoading(false);
    });

    // Then get current session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ? userFromSupabase(sess.user) : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (fullName: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin + '/dashboard',
    });
    if (result?.error) throw result.error;
    // If not redirected, session is set synchronously — onAuthStateChange will handle state
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setXP(0);
  };

  const addXP = (amount: number) => setXP(prev => prev + amount);

  const getLevel = () => LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];

  return (
    <AuthContext.Provider value={{ user, session, xp, loading, login, signup, loginWithGoogle, logout, addXP, getLevel }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
