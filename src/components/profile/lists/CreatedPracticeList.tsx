import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Plus,
    Pencil,
    Trash2,
    Code,
    BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

import { getProblemsCreated } from "@/services/api/problem.service";

/* ================= COMPONENT ================= */

export default function CreatedPracticeList() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [practices, setPractices] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const fetchPractices = async () => {
            try {
                setLoading(true);
                const data = await getProblemsCreated(1, 10);
                if (mounted) setPractices(data.data);
            } catch (err) {
                setError("Không tải được danh sách bài luyện tập");
            } finally {
                setLoading(false);
            }
        };

        fetchPractices();
        return () => {
            mounted = false;
        };
    }, []);

    /* ================= ACTIONS ================= */

    const handleEdit = (id: number) => {
        navigate(`/practice/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        toast("Chức năng xóa bài luyện tập chưa được triển khai");
        console.log("Delete practice:", id);
    };

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow text-center text-gray-500">
                Đang tải bài luyện tập...
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
                        Bài luyện tập đã tạo
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý các bài thực hành & lý thuyết của bạn
                    </p>
                </div>

                <button
                    onClick={() => navigate("/practices/create")}
                    className="
                        inline-flex items-center gap-2
                        px-5 py-2.5 rounded-xl
                        bg-gray-900 text-white text-sm font-medium
                        hover:bg-gray-800
                    "
                >
                    <Plus size={16} />
                    Tạo bài luyện tập
                </button>
            </div>

            {/* EMPTY */}
            {practices.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    Bạn chưa tạo bài luyện tập nào
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {practices.map((practice) => (
                        <div
                            key={practice.id}
                            className="
                                group relative
                                border rounded-2xl overflow-hidden
                                bg-white
                                hover:shadow-xl hover:-translate-y-1
                                transition-all
                            "
                        >
                            {/* ACTIONS */}
                            <div
                                className="
                                    absolute top-3 right-3 z-10
                                    flex gap-2
                                    opacity-0 group-hover:opacity-100
                                "
                            >
                                <button
                                    onClick={() => handleEdit(practice.id)}
                                    className="p-2 bg-white/90 rounded-lg"
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    onClick={() => handleDelete(practice.id)}
                                    className="p-2 bg-white/90 rounded-lg text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* CONTENT */}
                            <Link to={`/practice/${practice.id}`}>
                                <div className="p-5 space-y-3">
                                    {/* TITLE + TYPE */}
                                    <div className="flex items-center gap-2">
                                        {practice.isTheory ? (
                                            <BookOpen size={16} />
                                        ) : (
                                            <Code size={16} />
                                        )}
                                        <h3 className="font-semibold line-clamp-1">
                                            {practice.title}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {practice.description}
                                    </p>

                                    {/* META */}
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <span
                                            className={`
                                                px-2 py-0.5 rounded-full
                                                ${practice.difficulty === "easy"
                                                    ? "bg-green-100 text-green-700"
                                                    : practice.difficulty === "medium"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }
                                            `}
                                        >
                                            {practice.difficulty}
                                        </span>

                                        {!practice.isTheory && (
                                            <>
                                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                    {practice.timeLimitMs} ms
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                    {practice.memoryLimitKb} KB
                                                </span>
                                            </>
                                        )}

                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                            {practice.testcases.length} testcase
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
