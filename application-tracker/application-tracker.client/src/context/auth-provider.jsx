import React, { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authClient, useSession } from '@/lib/auth-client';

const GUEST_USER = {
  id: null,
  email: 'guest@example.com',
  firstName: 'Guest',
  lastName: '',
  picture: null,
  profilePictureUrl: null,
};

const AuthContext = createContext({
  isLogin: false,
  user: GUEST_USER,
  isLoading: true,
  login: () => { throw new Error('login() called without AuthProvider!'); },
  logout: () => { throw new Error('logout() called without AuthProvider!'); },
});

function toAppUser(sessionUser) {
  if (!sessionUser) return GUEST_USER;
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    firstName: sessionUser.firstName ?? sessionUser.name?.split(' ')[0] ?? '',
    lastName: sessionUser.lastName ?? sessionUser.name?.split(' ').slice(1).join(' ') ?? '',
    name: sessionUser.name,
    picture: sessionUser.image,
    profilePictureUrl: sessionUser.image,
    totalApplicationCount: sessionUser.totalApplicationCount,
    createdAt: sessionUser.createdAt,
  };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();

  const user = toAppUser(session?.user);
  const isLogin = !!session?.user;

  const value = useMemo(
    () => ({
      isLogin,
      user,
      isLoading: isPending,
      login: () => {
        authClient.signIn.social({ provider: 'google', callbackURL: '/' });
      },
      logout: async () => {
        await authClient.signOut();
        navigate('/login');
        toast.success('Logged out');
      },
    }),
    [isLogin, user, isPending, navigate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
