import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Session, User } from '@supabase/supabase-js';

type AppRole = 'citizen' | 'aspirant' | 'lawyer';

interface AuthUser {
  fullName: string;
  email: string;
  id: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  role: AppRole | null;
  xp: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string, role: AppRole) => Promise<void>;
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
    id: u.id,
    fullName:
      u.user_metadata?.full_name ||
      u.user_metadata?.name ||
      u.email?.split('@')[0] ||
      'User',
    email: u.email || '',
  };
}

async function fetchRole(userId: string): Promise<AppRole | null> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  return (data?.role as AppRole) || null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [xp, setXP] = useState(0);
  const [loading, setLoading] = useState(true);

  const syncUser = async (sess: Session | null) => {
    if (sess?.user) {
      setSession(sess);
      setUser(userFromSupabase(sess.user));
      const r = await fetchRole(sess.user.id);
      setRole(r);
    } else {
      setSession(null);
      setUser(null);
      setRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      syncUser(sess);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      syncUser(sess);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session?.user) {
      setSession(data.session);
      setUser(userFromSupabase(data.session.user));
      const r = await fetchRole(data.session.user.id);
      setRole(r);
    }
  };

  const signup = async (fullName: string, email: string, password: string, selectedRole: AppRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: selectedRole },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    // If user is created immediately (auto-confirm), insert role
    if (data.user) {
      await supabase.from('user_roles').insert({ user_id: data.user.id, role: selectedRole });
    }
  };

  const loginWithGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin + '/dashboard',
    });
    if (result?.error) throw result.error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setXP(0);
  };

  const addXP = (amount: number) => setXP(prev => prev + amount);
  const getLevel = () => LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];

  return (
    <AuthContext.Provider value={{ user, session, role, xp, loading, login, signup, loginWithGoogle, logout, addXP, getLevel }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
