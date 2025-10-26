import { Link, Outlet, useNavigate } from 'react-router';
import { logout } from '~/auth/api';

export const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-gray-50">
      <header className="sticky top-0 z-10 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link className="hover:text-black" to="/">
              Dashboard
            </Link>
            <Link className="hover:text-black" to="/artworks">
              Artworks
            </Link>
            <Link className="hover:text-black" to="/orders">
              Orders
            </Link>
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
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
