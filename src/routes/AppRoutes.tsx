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
                    <Route path="/courses/:id" element={<CourseDetailPage />} />
                    <Route path="/contests/:id" element={<ContestDetailPage />} />
                    <Route path="/practice/:id" element={<PracticeDetailPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;