import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    Dumbbell,
    Users,
} from "lucide-react";
import type { User } from "@/services/api/user.types";
import { getMyInfo } from "@/services/api/user.service";
import { useEffect } from "react";

const menuItems = [
    { label: "Tổng quan", path: "/admin", icon: LayoutDashboard },
    { label: "Khóa học", path: "/admin/courses", icon: BookOpen },
    { label: "Cuộc thi", path: "/admin/contests", icon: Trophy },
    { label: "Luyện tập", path: "/admin/practices", icon: Dumbbell },
    { label: "Người dùng", path: "/admin/users", icon: Users },
];

export default function AdminLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const user: User = await getMyInfo();

                if (!user || user.role?.name !== "ADMIN") {
                    navigate("/", { replace: true });
                }
            } catch {
                navigate("/", { replace: true });
            }
        };

        checkAdmin();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* ===== NAVBAR ===== */}
            <Navbar />
            {/* ===== BODY ===== */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r shadow-sm">
                    <div className="p-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/admin"}
                                    className={({ isActive }) =>
                                        `
                                        flex items-center gap-3 px-4 py-2.5 rounded-xl
                                        text-sm font-medium transition
                                        ${isActive
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }
                                    `
                                    }
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </NavLink>
                            );
                        })}
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
