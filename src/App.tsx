import { MotionConfig } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { InstructorProvider } from './context/InstructorContext';
import { LearningProvider } from './context/LearningContext';
import { StoreProvider } from './context/StoreContext';
import { GuestOnly, RequireAuth } from './components/auth/RouteGuards';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AdminLayout, RequireAdmin } from './components/admin/AdminChrome';
import { AdminCourseReviewPage } from './pages/admin/AdminCourseReviewPage';
import { AdminCoursesPage, AdminPendingPage } from './pages/admin/AdminCoursesPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import {
  AdminInstructorDetailPage,
  AdminInstructorsPage,
  AdminStudentDetailPage,
  AdminStudentsPage,
} from './pages/admin/AdminPeoplePages';
import {
  AdminCategoriesPage,
  AdminOrdersPage,
  AdminReportsPage,
  AdminSettingsPage,
} from './pages/admin/AdminSystemPages';
import { InstructorSidebar } from './components/instructor/InstructorChrome';
import { RequireInstructor } from './components/instructor/InstructorGate';
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
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
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
import { InstructorPublicPage } from './pages/InstructorPublicPage';
import { CourseBuilderPage } from './pages/instructor/CourseBuilderPage';
import { CoursePreviewPage } from './pages/instructor/CoursePreviewPage';
import { InstructorAnalyticsPage } from './pages/instructor/InstructorAnalyticsPage';
import { InstructorCoursesPage } from './pages/instructor/InstructorCoursesPage';
import { InstructorEarningsPage } from './pages/instructor/InstructorEarningsPage';
import { InstructorOverviewPage } from './pages/instructor/InstructorOverviewPage';
import { InstructorProfilePage } from './pages/instructor/InstructorProfilePage';
import { InstructorStudentsPage } from './pages/instructor/InstructorStudentsPage';
import { AboutPage } from './pages/info/AboutPage';
import { ContactPage } from './pages/info/ContactPage';
import { HelpPage } from './pages/info/HelpPage';
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
            <InstructorProvider>
            <BrowserRouter basename={basename}>
              <Routes>
                <Route element={<RootLayout />}>
                  {/* Full-screen auth pages */}
                  <Route element={<GuestOnly />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                  </Route>
                  <Route path="signup" element={<Navigate to="/register" replace />} />
                  <Route path="instructor/login" element={<Navigate to="/login?as=instructor" replace />} />
                  <Route path="admin/login" element={<Navigate to="/login?as=admin" replace />} />

                  {/* Admin panel: admin role only (others go to /dashboard) */}
                  <Route path="admin" element={<RequireAdmin />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminOverviewPage />} />
                      <Route path="courses" element={<AdminCoursesPage />} />
                      <Route path="courses/pending" element={<AdminPendingPage />} />
                      <Route path="courses/:courseId/review" element={<AdminCourseReviewPage />} />
                      <Route path="instructors" element={<AdminInstructorsPage />} />
                      <Route path="instructors/:id" element={<AdminInstructorDetailPage />} />
                      <Route path="students" element={<AdminStudentsPage />} />
                      <Route path="students/:id" element={<AdminStudentDetailPage />} />
                      <Route path="categories" element={<AdminCategoriesPage />} />
                      <Route path="orders" element={<AdminOrdersPage />} />
                      <Route path="reports" element={<AdminReportsPage />} />
                      <Route path="settings" element={<AdminSettingsPage />} />
                    </Route>
                  </Route>
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />

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

                    {/* Instructor area: onboarding for accounts without instructor status */}
                    <Route path="instructor" element={<RequireInstructor />}>
                      <Route element={<DashboardLayout sidebar={InstructorSidebar} label="Instructor area" />}>
                        <Route index element={<InstructorOverviewPage />} />
                        <Route path="courses" element={<InstructorCoursesPage />} />
                        <Route path="students" element={<InstructorStudentsPage />} />
                        <Route path="analytics" element={<InstructorAnalyticsPage />} />
                        <Route path="earnings" element={<InstructorEarningsPage />} />
                        <Route path="profile" element={<InstructorProfilePage />} />
                      </Route>
                      {/* Full-screen course builder and preview */}
                      <Route path="course/create" element={<CourseBuilderPage />} />
                      <Route path="course/:courseId/edit" element={<CourseBuilderPage />} />
                      <Route path="course/:courseId/preview" element={<CoursePreviewPage />} />
                    </Route>
                  </Route>

                  {/* Public site */}
                  <Route element={<SiteLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="course/:id" element={<CourseDetailsPage />} />
                    <Route path="cart" element={<CartPage />} />
                    {/* Paying needs an account; guests sign in and come back with their cart intact. */}
                    <Route element={<RequireAuth />}>
                      <Route path="checkout" element={<CheckoutPage />} />
                      <Route path="checkout/success" element={<CheckoutSuccessPage />} />
                    </Route>
                    <Route path="teach" element={<TeachPage />} />
                    <Route path="teach/register" element={<TeachRegisterPage />} />
                    <Route path="business" element={<BusinessPage />} />
                    <Route path="business/contact" element={<BusinessContactPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="help" element={<HelpPage />} />
                    <Route path="instructors/:slug" element={<InstructorPublicPage />} />
                    <Route path="support" element={<Navigate to="/help" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
            </InstructorProvider>
          </LearningProvider>
        </StoreProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
