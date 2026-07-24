import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '@/App';
import { RequireAuth, RequireRole } from '@/components/ProtectedRoute';

const Home = lazy(() => import('@/pages/Home'));
const Catalog = lazy(() => import('@/pages/Catalog'));
const Category = lazy(() => import('@/pages/Category'));
const QuizPlayer = lazy(() => import('@/pages/QuizPlayer'));
const Profile = lazy(() => import('@/pages/Profile'));
const CreatorAdmin = lazy(() => import('@/pages/CreatorAdmin'));
const EventsBoss = lazy(() => import('@/pages/EventsBoss'));
const EventsList = lazy(() => import('@/pages/EventsList'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const Community = lazy(() => import('@/pages/Community'));
const PageNotFound = lazy(() => import('@/pages/Home'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
      <p className="text-sm text-slate-600 font-mono">Plongee en cours...</p>
    </div>
  </div>
);

const withSuspense = (el: React.ReactNode) => <Suspense fallback={<PageLoader />}>{el}</Suspense>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: 'catalog', element: withSuspense(<Catalog />) },
      { path: 'category/:slug', element: withSuspense(<Category />) },
      { path: 'quiz/:id', element: withSuspense(<QuizPlayer />) },
      { path: 'events', element: withSuspense(<EventsList />) },
      { path: 'events/boss', element: withSuspense(<RequireRole roles={['admin']}><EventsBoss /></RequireRole>) },
      { path: 'leaderboards', element: withSuspense(<Leaderboard />) },
      { path: 'community', element: withSuspense(<Community />) },
      { path: 'profile', element: withSuspense(<RequireAuth><Profile /></RequireAuth>) },
      { path: 'admin', element: withSuspense(<RequireRole roles={['creator', 'admin']}><CreatorAdmin /></RequireRole>) },
      { path: 'penseurs', element: withSuspense(<Category />) },
      { path: 'otaku', element: withSuspense(<Category />) },
      { path: 'culture', element: withSuspense(<Category />) },
      { path: '*', element: withSuspense(<PageNotFound />) },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
