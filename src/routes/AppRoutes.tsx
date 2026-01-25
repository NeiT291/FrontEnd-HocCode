import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "@/pages/NotFound";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import PracticeDetailPage from "@/pages/PracticeDetailPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import ContestDetailPage from "@/pages/ContestDetailPage";
import CoursesPage from "@/pages/CoursesPage";
import ContestsPage from "@/pages/ContestsPage";
import ContestRankingPage from "@/pages/ContestRankingPage";
import PracticePage from "@/pages/PracticePage";
import SearchPage from "@/pages/SearchPage";
import ProfilePage from "@/pages/ProfilePage";
import EditProfilePage from "@/pages/EditProfilePage";
import LessonDetailPage from "@/pages/LessonDetailPage";
import RunCodePage from "@/pages/RunCodePage";
import EditCoursePage from "@/pages/EditCoursePage";
import EditContestPage from "@/pages/EditContestPage";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCourses from "@/pages/admin/AdminCourses";
import AdminContests from "@/pages/admin/AdminContests";
import AdminPractices from "@/pages/admin/AdminPractices";
import AdminUsers from "@/pages/admin/AdminUsers";
import ChangePasswordPage from "@/pages/ChangePasswordPage";

const AppRoutes = () => {
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />

                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/information" element={<EditProfilePage />} />

                    <Route path="/change-password" element={<ChangePasswordPage />} />

                    <Route path="/search" element={<SearchPage />} />

                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/:id" element={<CourseDetailPage />} />
                    <Route path="/courses/:id/edit" element={<EditCoursePage />} />

                    <Route path="/lessons/:id" element={<LessonDetailPage />} />

                    <Route path="/contests" element={<ContestsPage />} />
                    <Route path="/contests/:id" element={<ContestDetailPage />} />
                    <Route path="/contests/edit/:id" element={<EditContestPage />} />
                    <Route path="/contests/:id/ranking" element={<ContestRankingPage />} />
                    <Route path="/practice" element={<PracticePage />} />
                    <Route path="/practice/:id" element={<PracticeDetailPage />} />

                    <Route path="/run-code" element={<RunCodePage />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route path="contests" element={<AdminContests />} />
                    <Route path="practices" element={<AdminPractices />} />
                    <Route path="users" element={<AdminUsers />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;