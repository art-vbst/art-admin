import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';
import { Navbar } from './navbar';

export const Layout = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};
