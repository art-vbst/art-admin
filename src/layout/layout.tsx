import { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import { logout } from '~/auth/api';
import { AuthContext } from '~/auth/context';

export const Layout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      {user && (
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
              <button
                type="button"
                onClick={handleLogout}
                className="font-medium text-gray-900 text-sm hover:text-gray-600"
              >
                Logout
              </button>
            </div>
          </nav>
        </header>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
