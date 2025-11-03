import type { User } from '@art-vbst/art-types';
import { MenuIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { logout } from '~/auth/api';
import { AuthContext } from '~/auth/context';
import { errorToast } from '~/components/toast';
import { Button } from '~/components/ui';
import { useAction } from '~/hooks/useAction';
import { cn } from '~/utils/format';

export const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { execute, loading: logoutPending } = useAction(() => logout());

  const handleLogout = async () => {
    await execute().catch(() => errorToast('Failed to logout'));
    navigate(0);
  };

  if (!user) return null;

  return (
    <header className="border-gray-200 border-b bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <NavContentDesktop
          user={user}
          logoutPending={logoutPending}
          handleLogout={handleLogout}
          className="hidden gap-8 md:flex"
        />
        <NavContentMobile
          user={user}
          logoutPending={logoutPending}
          handleLogout={handleLogout}
          className="md:hidden"
        />
      </nav>
    </header>
  );
};

type NavContentProps = {
  user: User;
  logoutPending: boolean;
  handleLogout: () => void;
  className?: string;
};

const NavContentDesktop = ({
  user,
  logoutPending,
  handleLogout,
  className,
}: NavContentProps) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
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
  );
};

const NavContentMobile = ({
  user,
  logoutPending,
  handleLogout,
  className,
}: NavContentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div
      className={cn('relative flex items-center justify-between', className)}
    >
      <h2 className="font-bold text-gray-900 text-lg">Admin</h2>

      <button
        type="button"
        onClick={toggleMenu}
        className="rounded p-2 text-gray-900 hover:bg-gray-100"
      >
        <MenuIcon className="h-6 w-6" />
      </button>
      {isOpen && (
        <NavMenuDropdown
          user={user}
          logoutPending={logoutPending}
          handleLogout={handleLogout}
          closeMenu={closeMenu}
        />
      )}
    </div>
  );
};

const NavMenuDropdown = ({
  user,
  logoutPending,
  handleLogout,
  closeMenu,
}: NavContentProps & { closeMenu: () => void }) => {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={closeMenu} />

      <div className="absolute top-full right-0 z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="p-4">
          <div className="mb-4 border-gray-200 border-b pb-4">
            <span className="text-gray-600 text-sm">{user.email}</span>
          </div>

          <nav className="flex flex-col gap-4">
            <NavLink to="/" onClick={closeMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/artworks" onClick={closeMenu}>
              Artworks
            </NavLink>
            <NavLink to="/orders" onClick={closeMenu}>
              Orders
            </NavLink>
          </nav>

          <div className="mt-4 border-gray-200 border-t pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              disabled={logoutPending}
              className="w-full"
            >
              {logoutPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const NavLink = ({ to, children, onClick }: NavLinkProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="font-medium text-gray-900 text-sm hover:text-gray-600"
    >
      {children}
    </Link>
  );
};
