import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { logout } from '~/auth/api';
import { AuthContext } from '~/auth/context';
import { Button } from '~/components/ui';
import { useAction } from '~/hooks/useAction';

export const Navbar = () => {
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
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/artworks">Artworks</NavLink>
            <NavLink to="/orders">Orders</NavLink>
          </div>
          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="text-gray-600 text-sm">{user.email}</span>
            )}
            <Button
              variant="secondary"
              onClick={handleLogout}
              disabled={logoutPending}
            >
              {logoutPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
};

export const NavLink = ({ to, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className="font-medium text-gray-900 text-sm hover:text-gray-600"
    >
      {children}
    </Link>
  );
};
