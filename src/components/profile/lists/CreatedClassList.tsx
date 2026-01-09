import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { getClassesCreated } from "@/services/api/class.service";

/* ================= COMPONENT ================= */

export default function CreatedClassList() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const fetchClasses = async () => {
            try {
                setLoading(true);
                const data = await getClassesCreated(1, 10);
                if (mounted) setClasses(data.data);
            } catch (err) {
                setError("Không tải được danh sách lớp học");
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
        return () => {
            mounted = false;
        };
    }, []);

    /* ================= ACTIONS ================= */

    const handleEdit = (id: number) => {
        navigate(`/classes/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        toast("Xóa class chưa implement");
        console.log("Delete class", id);
    };

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow text-center text-gray-500">
                Đang tải lớp học...
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
                        Lớp học đã tạo
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý các lớp học của bạn
                    </p>
                </div>

                <button
                    onClick={() => navigate("/classes/create")}
                    className="
                        inline-flex items-center gap-2
                        px-5 py-2.5 rounded-xl
                        bg-gray-900 text-white text-sm font-medium
                        hover:bg-gray-800
                    "
                >
                    <Plus size={16} />
                    Tạo lớp
                </button>
            </div>

            {/* EMPTY */}
            {classes.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    Bạn chưa tạo lớp học nào
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
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
                                    onClick={() => handleEdit(cls.id)}
                                    className="p-2 bg-white/90 rounded-lg"
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    onClick={() => handleDelete(cls.id)}
                                    className="p-2 bg-white/90 rounded-lg text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* CONTENT */}
                            <Link to={`/classes/${cls.id}`}>
                                <div className="p-5 space-y-2">
                                    <h3 className="font-semibold line-clamp-1">
                                        {cls.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {cls.description}
                                    </p>

                                    <div className="text-xs text-gray-500">
                                        Mã lớp: {cls.code}
                                    </div>

                                    {cls.courses?.length > 0 && (
                                        <div className="text-xs text-gray-500">
                                            Khóa học:{" "}
                                            {cls.courses
                                                .map((c: any) => c.title)
                                                .join(", ")}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
