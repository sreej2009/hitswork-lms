import { MotionConfig } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { StoreProvider } from './context/StoreContext';
import { GuestOnly, RequireAuth } from './components/auth/RouteGuards';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { RootLayout, SiteLayout } from './components/layout/SiteLayout';
import { BusinessContactPage } from './pages/business/BusinessContactPage';
import { BusinessPage } from './pages/business/BusinessPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { CoursePlayerPage } from './pages/CoursePlayerPage';
import { CoursesPage } from './pages/CoursesPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AchievementsPage } from './pages/dashboard/AchievementsPage';
import { CertificateDetailPage } from './pages/dashboard/CertificateDetailPage';
import { CertificatesPage } from './pages/dashboard/CertificatesPage';
import { MyLearningPage } from './pages/dashboard/MyLearningPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { WishlistPage } from './pages/dashboard/WishlistPage';
import { TeachPage } from './pages/teach/TeachPage';
import { TeachRegisterPage } from './pages/teach/TeachRegisterPage';

// Vite's BASE_URL is "/" locally and "/<repo>/" on GitHub Pages.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <StoreProvider>
          <LearningProvider>
            <BrowserRouter basename={basename}>
              <Routes>
                <Route element={<RootLayout />}>
                  {/* Full-screen auth pages */}
                  <Route element={<GuestOnly />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                  </Route>
                  <Route path="signup" element={<Navigate to="/register" replace />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />

                  {/* Student area: sidebar layout, sign-in required */}
                  <Route element={<RequireAuth />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="dashboard" element={<OverviewPage />} />
                      <Route path="my-learning" element={<MyLearningPage />} />
                      <Route path="wishlist" element={<WishlistPage />} />
                      <Route path="certificates" element={<CertificatesPage />} />
                      <Route path="certificates/:certificateId" element={<CertificateDetailPage />} />
                      <Route path="achievements" element={<AchievementsPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>
                    <Route path="learn/:courseId" element={<CoursePlayerPage />} />
                  </Route>

                  {/* Public site */}
                  <Route element={<SiteLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="course/:id" element={<CourseDetailsPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="checkout/success" element={<CheckoutSuccessPage />} />
                    <Route path="teach" element={<TeachPage />} />
                    <Route path="teach/register" element={<TeachRegisterPage />} />
                    <Route path="business" element={<BusinessPage />} />
                    <Route path="business/contact" element={<BusinessContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </LearningProvider>
        </StoreProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
