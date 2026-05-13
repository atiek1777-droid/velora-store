import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, SUPABASE_READY } from '../lib/supabase.js';

// ── Local mock admin (used when Supabase not configured) ──────────────────────
const MOCK_ADMIN = { id: 'mock-admin', email: 'admin@velora.ye', role: 'admin', full_name: 'المدير العام' };

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [profile,     setProfile]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [authError,   setAuthError]   = useState('');

  // Fetch role profile from DB
  const fetchProfile = useCallback(async (authUser) => {
    if (!supabase || !authUser) return null;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    return data;
  }, []);

  useEffect(() => {
    if (!SUPABASE_READY) { setLoading(false); return; }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user);
        setProfile(p);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user);
        setProfile(p);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── Sign in ──────────────────────────────────────────────────────────────────
  const signIn = async (email, password) => {
    setAuthError('');
    if (!SUPABASE_READY) {
      // Mock login
      if (email === 'admin' && password === 'velora2024') {
        setUser(MOCK_ADMIN);
        setProfile(MOCK_ADMIN);
        return { ok: true };
      }
      setAuthError('بيانات الدخول غير صحيحة');
      return { ok: false };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setAuthError('بيانات الدخول غير صحيحة'); return { ok: false }; }
    return { ok: true };
  };

  // ── Sign out ─────────────────────────────────────────────────────────────────
  const signOut = async () => {
    if (SUPABASE_READY) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // ── Change own password ──────────────────────────────────────────────────────
  const changePassword = async (newPassword) => {
    if (!SUPABASE_READY) return { ok: true }; // mock
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return error ? { ok: false, error: error.message } : { ok: true };
  };

  // ── Create a new user (admin only) ───────────────────────────────────────────
  const createUser = async ({ email, password, full_name, role }) => {
    if (!SUPABASE_READY) return { ok: false, error: 'يتطلب Supabase' };
    // Use service_role key from edge function to create user — here we call a
    // Supabase Edge Function named "create-user" (see README for setup)
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: { email, password, full_name, role },
    });
    if (error || data?.error) return { ok: false, error: error?.message || data?.error };
    return { ok: true };
  };

  // ── Role helpers ─────────────────────────────────────────────────────────────
  const role        = profile?.role || (user ? 'order_supervisor' : null);
  const isAdmin     = role === 'admin';
  const isEditor    = role === 'admin' || role === 'editor';
  const isSupervisor= Boolean(role);

  return (
    <AuthContext.Provider value={{
      user, profile, loading, authError, setAuthError,
      signIn, signOut, changePassword, createUser,
      role, isAdmin, isEditor, isSupervisor,
      isAuthenticated: Boolean(user),
      SUPABASE_READY,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
