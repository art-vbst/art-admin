import { Link, Outlet } from 'react-router';
import { useContext } from 'react';
import { logout } from '~/auth/api';
import { AuthContext } from '~/auth/context';

export const Layout = () => {
  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    // mark user as logged out; AuthGuard will redirect
    setUser as unknown;
    setUser(null as never);
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-6">
            <Link to="/" className="font-semibold hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/artworks" className="hover:text-blue-600">
              Artworks
            </Link>
            <Link to="/orders" className="hover:text-blue-600">
              Orders
            </Link>
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-black"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
