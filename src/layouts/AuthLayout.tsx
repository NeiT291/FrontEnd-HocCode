import { Outlet } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
const logoVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.92,
    },
    visible: {
        opacity: 1,
        scale: 0.9,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },

};
const AuthLayout = () => {
    return (
        <div className="auth-layout min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
                <motion.div
                    variants={logoVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.03 }}
                    className="
                bg-white rounded-2xl shadow-lg
                px-10 py-12
                flex items-center justify-center mb-6
              "
                >
                    <img
                        src="/logo-text.png"
                        alt="HOCCODE Logo"
                        className="w-[320px] object-contain"
                    />
                </motion.div>
                <p className="text-lg opacity-90 max-w-md text-center">
                    Nền tảng học tập lập trình hiện đại
                </p>

                <div className="mt-10 text-sm opacity-70">
                    © 2025 HOC CODE. All rights reserved.
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-center p-6 bg-gray-50">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
