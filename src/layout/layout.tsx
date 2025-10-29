import { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import { logout } from '~/auth/api';
import { AuthContext } from '~/auth/context';
import { useAction } from '~/hooks/useAction';

export const Layout = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { execute, loading: logoutPending } = useAction(() => logout());

  const handleLogout = async () => {
    await execute();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="border-gray-200 border-b bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-8">
            <Link
              to="/"
              className="font-medium text-gray-900 text-sm hover:text-gray-600"
            >
              Dashboard
            </Link>
            <Link
              to="/artworks"
              className="font-medium text-gray-900 text-sm hover:text-gray-600"
            >
              Artworks
            </Link>
            <Link
              to="/orders"
              className="font-medium text-gray-900 text-sm hover:text-gray-600"
            >
              Orders
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="text-gray-600 text-sm">{user.email}</span>
            )}
            <button
              type="button"
              className="font-medium text-gray-900 text-sm hover:text-gray-600"
              onClick={handleLogout}
              disabled={logoutPending}
            >
              {logoutPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
