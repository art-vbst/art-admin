import { createBrowserRouter, type RouteObject } from 'react-router';
import { AuthGuard, AuthProvider } from './auth/context';
import { Boundary } from './layout/error';
import { Layout } from './layout/layout';
import { ArtworkDetail } from './pages/artwork/detail';
import { ArtworkList } from './pages/artwork/list';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ErrorDisplay } from './pages/general/Error';
import { Login } from './pages/general/Login';
import { NotFound } from './pages/general/NotFound';
import { OrderDetail } from './pages/orders/detail';
import { OrderList } from './pages/orders/list';

const publicRoutes: RouteObject[] = [
  {
    element: <AuthGuard navigate="/" inverted />,
    children: [{ path: '/login', element: <Login /> }],
  },
];

const privateRoutes: RouteObject[] = [
  {
    element: <AuthGuard navigate="/login" />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/artworks', element: <ArtworkList /> },
      { path: '/artworks/:id', element: <ArtworkDetail /> },
      { path: '/orders', element: <OrderList /> },
      { path: '/orders/:id', element: <OrderDetail /> },
    ],
  },
];

export const router = createBrowserRouter([
  {
    element: (
      <Boundary fallback={<ErrorDisplay />}>
        <AuthProvider />
      </Boundary>
    ),
    children: [
      {
        element: <Layout />,
        children: [...publicRoutes, ...privateRoutes],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
