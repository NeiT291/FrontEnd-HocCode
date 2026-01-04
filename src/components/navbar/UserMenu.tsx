import { Link, useNavigate } from "react-router-dom";
import {
    User,
    BookOpen,
    GraduationCap,
    LogOut,
    LogIn,
    UserPlus,
} from "lucide-react";

import { logout } from "@/services/api/auth.service";
import { useAuth } from "@/contexts/useAuth";

const DEFAULT_AVATAR = "https://i.pravatar.cc/100?img=12";

const UserMenu = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, setUser } = useAuth();

    const handleLogout = async () => {
        await logout();
        setUser(null);              // 👉 clear user context
        navigate("/");
    };

    const avatarSrc =
        isAuthenticated && user?.avatarUrl
            ? user.avatarUrl
            : DEFAULT_AVATAR;

    const displayName =
        isAuthenticated
            ? user?.displayName ||
            user?.email ||
            "Người dùng"
            : "Khách";

    return (
        <div className="relative group ml-auto user-menu">
            {/* TRIGGER */}
            <div className="flex items-center gap-2 cursor-pointer">
                <img
                    src={avatarSrc}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full border border-gray-300 object-cover"
                />
                <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                    {displayName}
                </span>
            </div>

            {/* DROPDOWN */}
            <div
                className="
                    absolute left-0 mt-2
                    w-48
                    bg-white
                    rounded-xl
                    shadow-lg
                    border border-gray-100
                    opacity-0 invisible translate-y-2
                    group-hover:opacity-100
                    group-hover:visible
                    group-hover:translate-y-0
                    transition-all duration-200
                    z-50
                "
            >
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/profile"
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                            <User className="w-4 h-4 text-gray-400" />
                            Hồ sơ cá nhân
                        </Link>

                        <Link
                            to="/courses"
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            Khóa học
                        </Link>

                        <Link
                            to="/classes"
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                            <GraduationCap className="w-4 h-4 text-gray-400" />
                            Lớp học
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                            <LogOut className="w-4 h-4 text-red-400" />
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                            <LogIn className="w-4 h-4 text-gray-400" />
                            Đăng nhập
                        </Link>

                        <Link
                            to="/register"
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                            <UserPlus className="w-4 h-4 text-gray-400" />
                            Đăng ký
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserMenu;