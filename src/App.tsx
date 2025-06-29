import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { LoadingOverlay } from './components/ui/LoadingOverlay';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageTransition } from './components/ui/PageTransition';
import { useAuth } from './hooks/useAuth';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { ResponsiveHeader } from './components/layout/ResponsiveHeader';

// Auth callback page
import { AuthCallbackPage } from './pages/AuthCallbackPage';

// Lazy-loaded components for code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const TimelinePage = lazy(() => import('./pages/TimelinePage').then(module => ({ default: module.TimelinePage })));
const UploadPage = lazy(() => import('./pages/UploadPage').then(module => ({ default: module.UploadPage })));
const TaggingPage = lazy(() => import('./pages/TaggingPage').then(module => ({ default: module.TaggingPage })));
const GamesPage = lazy(() => import('./pages/GamesPage').then(module => ({ default: module.GamesPage })));
const GameDetailPage = lazy(() => import('./pages/GameDetailPage').then(module => ({ default: module.GameDetailPage })));
const GamePlayPage = lazy(() => import('./pages/GamePlayPage').then(module => ({ default: module.GamePlayPage })));
const GameProgressPage = lazy(() => import('./pages/GameProgressPage').then(module => ({ default: module.GameProgressPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(module => ({ default: module.SearchPage })));
const ActivityPage = lazy(() => import('./pages/ActivityPage').then(module => ({ default: module.ActivityPage })));
const MessagingPage = lazy(() => import('./pages/MessagingPage').then(module => ({ default: module.MessagingPage })));
const PrivacyControlsPage = lazy(() => import('./pages/PrivacyControlsPage').then(module => ({ default: module.PrivacyControlsPage })));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage').then(module => ({ default: module.DesignSystemPage })));
const FamilyPage = lazy(() => import('./pages/FamilyPage').then(module => ({ default: module.FamilyPage })));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage').then(module => ({ default: module.SubscriptionPage })));
const SubscriptionDashboardPage = lazy(() => import('./pages/SubscriptionDashboardPage').then(module => ({ default: module.SubscriptionDashboardPage })));

function App() {
  const { user, loading } = useAuth();
  
  // Monitor performance metrics
  usePerformanceMonitor();

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-700 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading Yaadein...</p>
        </div>
      </div>
    );
  }

  // Check if user has completed onboarding
  const hasCompletedOnboarding = localStorage.getItem('memorymesh_onboarding_completed') === 'true';

  return (
    <Router>
      <ErrorBoundary>
        <PageTransition>
          <Suspense fallback={<LoadingOverlay isLoading={true} message="Loading page..." fullScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/auth" 
                element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
              />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              
              {/* Design System Route */}
              <Route path="/design-system" element={<DesignSystemPage />} />
              
              {/* Onboarding Route */}
              <Route
                path="/onboarding"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <OnboardingPage />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              {/* Subscription Routes */}
              <Route
                path="/pricing"
                element={<SubscriptionPage />}
              />
              
              <Route
                path="/subscription"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <SubscriptionDashboardPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <DashboardPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route
                path="/timeline"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <TimelinePage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/upload"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <UploadPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/tagging"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <TaggingPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              {/* Family Routes */}
              <Route
                path="/family"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <FamilyPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/family/:familyId"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <FamilyPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/family/invite"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <FamilyPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/family/roles"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <FamilyPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              {/* Games Routes */}
              <Route
                path="/games"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <GamesPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/games/:gameId"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <GameDetailPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/games/play/:gameId"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <GamePlayPage />
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/games/progress"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <GameProgressPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/search"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <SearchPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/settings"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <SettingsPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/profile"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <ProfilePage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/privacy"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <PrivacyControlsPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/activity"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <ActivityPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              <Route
                path="/messaging"
                element={
                  user ? (
                    hasCompletedOnboarding ? (
                      <Layout>
                        <MessagingPage />
                      </Layout>
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </ErrorBoundary>
    </Router>
  );
}

export default App;