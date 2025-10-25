import { Outlet } from 'react-router';

export const Layout = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Outlet />
    </div>
  );
};
