import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import toast from "react-hot-toast";

import { getContestCreated } from "@/services/api/contest.service";

/* ================= COMPONENT ================= */

export default function CreatedContestList() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [contests, setContests] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const fetchContests = async () => {
            try {
                setLoading(true);
                const data = await getContestCreated(1, 10);
                if (mounted) setContests(data.data);
            } catch (err) {
                setError("Không tải được danh sách cuộc thi");
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
        return () => {
            mounted = false;
        };
    }, []);

    /* ================= ACTIONS ================= */

    const handleEdit = (id: number) => {
        navigate(`/contests/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        toast("Chức năng xóa contest chưa được triển khai");
        console.log("Delete contest:", id);
    };

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow text-center text-gray-500">
                Đang tải cuộc thi...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-8 shadow space-y-8">
            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Cuộc thi đã tạo
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý và chỉnh sửa các cuộc thi của bạn
                    </p>
                </div>

                <button
                    onClick={() => navigate("/contests/create")}
                    className="
                        inline-flex items-center gap-2
                        px-5 py-2.5 rounded-xl
                        bg-gray-900 text-white text-sm font-medium
                        hover:bg-gray-800
                    "
                >
                    <Plus size={16} />
                    Tạo cuộc thi
                </button>
            </div>

            {/* EMPTY */}
            {contests.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    Bạn chưa tạo cuộc thi nào
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contests.map((contest) => (
                        <div
                            key={contest.id}
                            className="
                                group relative
                                border rounded-2xl overflow-hidden
                                bg-white
                                hover:shadow-xl hover:-translate-y-1
                                transition-all
                            "
                        >
                            {/* ACTIONS */}
                            <div className="
                                absolute top-3 right-3 z-10
                                flex gap-2
                                opacity-0 group-hover:opacity-100
                            ">
                                <button
                                    onClick={() => handleEdit(contest.id)}
                                    className="p-2 bg-white/90 rounded-lg"
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    onClick={() => handleDelete(contest.id)}
                                    className="p-2 bg-white/90 rounded-lg text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* CONTENT */}
                            <Link to={`/contests/${contest.id}`}>
                                {/* THUMBNAIL */}
                                {contest.thumbnailUrl ? (
                                    <div className="relative h-40">
                                        <img
                                            src={contest.thumbnailUrl}
                                            alt={contest.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                ) : (
                                    <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                                        Không có ảnh
                                    </div>
                                )}

                                {/* BODY */}
                                <div className="p-5 space-y-2">
                                    <h3 className="font-semibold line-clamp-1">
                                        {contest.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {contest.description}
                                    </p>

                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                                        <Calendar size={14} />
                                        <span>
                                            {new Date(
                                                contest.startTime
                                            ).toLocaleDateString()}
                                            {" "}–{" "}
                                            {new Date(
                                                contest.endTime
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
