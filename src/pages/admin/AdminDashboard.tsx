import { useEffect, useState } from "react";
import {
    BookOpen,
    Trophy,
    Dumbbell,
    Users,
} from "lucide-react";
import DashboardStatCard from "@/components/admin/DashboardStatCard";
import { getDashboard } from "@/services/api/admin.service";
import type { Dashboard } from "@/services/api/admin.types";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState<Dashboard | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const data = await getDashboard();
                if (mounted) {
                    setStats(data);
                }
            } catch (err: unknown) {
                if (mounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Có lỗi xảy ra"
                    );
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchDashboard();

        return () => {
            mounted = false;
        };
    }, []);

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-[96px]"
                    />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-red-600">
                {error}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Tổng quan
                </h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStatCard
                    link="/admin/courses"
                    icon={BookOpen}
                    label="Khóa học"
                    value={stats.totalCourse}
                    color="green"
                />
                <DashboardStatCard
                    link="/admin/contests"
                    icon={Trophy}
                    label="Cuộc thi"
                    value={stats.totalContest}
                    color="purple"
                />
                <DashboardStatCard
                    link="/admin/practices"
                    icon={Dumbbell}
                    label="Luyện tập"
                    value={stats.totalProblem}
                    color="orange"
                />
                <DashboardStatCard
                    link="/admin/users"
                    icon={Users}
                    label="Người dùng"
                    value={stats.totalUser}
                    color="red"
                />
            </div>
        </div>
    );
}
