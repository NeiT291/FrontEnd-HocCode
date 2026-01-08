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
import PracticePage from "@/pages/PracticePage";
import ClassesPage from "@/pages/ClassesPage";
import SearchPage from "@/pages/SearchPage";
import ProfilePage from "@/pages/ProfilePage";
import EditProfilePage from "@/pages/EditProfilePage";
import LessonDetailPage from "@/pages/LessonDetailPage";
import RunCodePage from "@/pages/RunCodePage";
import EditCoursePage from "@/pages/EditCoursePage";

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

                    <Route path="/search" element={<SearchPage />} />

                    <Route path="/classes" element={<ClassesPage />} />

                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/:id" element={<CourseDetailPage />} />
                    <Route path="/courses/:id/edit" element={<EditCoursePage />} />

                    <Route path="/lessons/:id" element={<LessonDetailPage />} />

                    <Route path="/contests" element={<ContestsPage />} />
                    <Route path="/contests/:id" element={<ContestDetailPage />} />

                    <Route path="/practice" element={<PracticePage />} />
                    <Route path="/practice/:id" element={<PracticeDetailPage />} />

                    <Route path="/run-code" element={<RunCodePage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;