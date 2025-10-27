import type { User } from '@art-vbst/art-types';
import type { AxiosResponse } from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { usePageData } from '~/hooks/usePageData';
import { me, refresh } from './api';

type AuthContextType = {
  loading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  loading: true,
  user: null,
  setUser: () => {},
});

export const AuthProvider = () => {
  return <AuthLoader action={me} tryRefresh />;
};

const AuthLoader = ({
  action,
  tryRefresh,
}: {
  action: () => Promise<AxiosResponse<User>>;
  tryRefresh?: boolean;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const { data, loading, error } = usePageData(action);

  useEffect(() => {
    setUser(data);
  }, [data]);

  if (tryRefresh && error?.response?.status === 401) {
    return <AuthLoader action={refresh} />;
  }

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
      <div className="grid min-h-dvh place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
      </div>
    );
  }

  const shouldNavigate = inverted ? !!user : !user;
  return shouldNavigate ? <Navigate to={navigate} /> : <Outlet />;
};
