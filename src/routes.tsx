import { createBrowserRouter } from 'react-router';
import { ErrorBoundary } from './layout/error';
import { Layout } from './layout/layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ErrorDisplay } from './pages/general/Error';
import { Login } from './pages/general/Login';

const LayoutWithBoundary = () => {
  return (
    <ErrorBoundary fallback={<ErrorDisplay />}>
      <Layout />
    </ErrorBoundary>
  );
};

export const router = createBrowserRouter([
  {
    element: <LayoutWithBoundary />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/login', element: <Login /> },
    ],
  },
]);
