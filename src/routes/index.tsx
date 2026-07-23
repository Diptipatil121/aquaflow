import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute, PublicRoute } from '@/routes/ProtectedRoute';
import { PageLoader } from '@/components/ui/Loader';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const LoginPage = lazy(() => import('@/pages/Login/LoginPage'));
const SignupPage = lazy(() => import('@/pages/Signup/SignupPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/Login/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'));
const LeakDetectionPage = lazy(() => import('@/pages/LeakDetection/LeakDetectionPage'));
const DistributionPage = lazy(() => import('@/pages/Distribution/DistributionPage'));
const ReservoirPage = lazy(() => import('@/pages/Reservoir/ReservoirPage'));
const WaterQualityPage = lazy(() => import('@/pages/WaterQuality/WaterQualityPage'));
const AnalyticsPage = lazy(() => import('@/pages/Analytics/AnalyticsPage'));
const ConsumersPage = lazy(() => import('@/pages/Consumers/ConsumersPage'));
const ReportsPage = lazy(() => import('@/pages/Reports/ReportsPage'));
const MaintenancePage = lazy(() => import('@/pages/Maintenance/MaintenancePage'));
const AlertsPage = lazy(() => import('@/pages/Alerts/AlertsPage'));
const AIInsightsPage = lazy(() => import('@/pages/AIInsights/AIInsightsPage'));
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage'));

const LazyPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    <ErrorBoundary>{children}</ErrorBoundary>
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LazyPage><LoginPage /></LazyPage> },
      { path: '/signup', element: <LazyPage><SignupPage /></LazyPage> },
      { path: '/forgot-password', element: <LazyPage><ForgotPasswordPage /></LazyPage> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <LazyPage><DashboardPage /></LazyPage> },
          { path: '/leak-detection', element: <LazyPage><LeakDetectionPage /></LazyPage> },
          { path: '/distribution', element: <LazyPage><DistributionPage /></LazyPage> },
          { path: '/reservoir', element: <LazyPage><ReservoirPage /></LazyPage> },
          { path: '/water-quality', element: <LazyPage><WaterQualityPage /></LazyPage> },
          { path: '/analytics', element: <LazyPage><AnalyticsPage /></LazyPage> },
          { path: '/consumers', element: <LazyPage><ConsumersPage /></LazyPage> },
          { path: '/reports', element: <LazyPage><ReportsPage /></LazyPage> },
          { path: '/maintenance', element: <LazyPage><MaintenancePage /></LazyPage> },
          { path: '/alerts', element: <LazyPage><AlertsPage /></LazyPage> },
          { path: '/ai-insights', element: <LazyPage><AIInsightsPage /></LazyPage> },
          { path: '/settings', element: <LazyPage><SettingsPage /></LazyPage> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
