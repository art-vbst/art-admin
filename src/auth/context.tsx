import type { User } from '@art-vbst/art-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { usePageData } from '~/hooks/usePageData';
import { me } from './api';

type AuthContextType = {
  loading: boolean;
  user: User | null;
  setUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextType>({
  loading: true,
  user: null,
  setUser: () => {},
});

export const AuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const { data, loading } = usePageData(me);

  useEffect(() => {
    setUser(data);
  }, [data]);

  return (
    <AuthContext value={{ user: user ?? data, setUser, loading }}>
      <Outlet />
    </AuthContext>
  );
};

export const AuthGuard = ({
  navigate,
  inverted = false,
}: {
  navigate: string;
  inverted?: boolean;
}) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  const shouldNavigate = inverted ? !!user : !user;
  return shouldNavigate ? <Navigate to={navigate} /> : <Outlet />;
};
