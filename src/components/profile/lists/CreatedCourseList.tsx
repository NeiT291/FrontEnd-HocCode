import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { getCoursesCreated } from "@/services/api/course.service";
import type { Course } from "@/services/api/course.types";

const CreatedCourseList = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string>("");

    const [openCreate, setOpenCreate] = useState(false);

    useEffect(() => {
        let mounted = true;

        const fetchCourses = async () => {
            if (!mounted) return;

            setLoading(true);
            setError("");

            try {
                const data = await getCoursesCreated(1, 10);
                if (mounted) setCourses(data);
            } catch (err: unknown) {
                if (mounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Không tải được danh sách khóa học"
                    );
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchCourses();
        return () => {
            mounted = false;
        };
    }, []);

    /* ================= ACTIONS ================= */

    const handleDelete = (id: number) => {
        console.log("Delete course:", id);
    };

    const handleEdit = (id: number) => {
        console.log("Edit course:", id);
    };

    const handleCreate = (title: string, description: string) => {
        console.log("Create course:", { title, description });
        setOpenCreate(false);
    };

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow text-gray-500 text-center">
                Đang tải khóa học...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow text-red-500 text-center">
                {error}
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl p-8 shadow space-y-8">
                {/* ================= HEADER ================= */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Khóa học đã tạo
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Quản lý và chỉnh sửa các khóa học bạn đã tạo
                        </p>
                    </div>

                    <button
                        onClick={() => setOpenCreate(true)}
                        className="
                            inline-flex items-center gap-2
                            px-5 py-2.5 rounded-xl
                            bg-gray-900 text-white text-sm font-medium
                            hover:bg-gray-800
                            active:scale-95 transition
                        "
                    >
                        <Plus size={16} />
                        Tạo khóa học
                    </button>
                </div>

                {/* ================= EMPTY ================= */}
                {courses.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        Bạn chưa tạo khóa học nào
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="
                                    group relative
                                    border rounded-2xl overflow-hidden
                                    bg-white
                                    hover:shadow-xl hover:-translate-y-1
                                    transition-all duration-200
                                "
                            >
                                {/* ACTIONS */}
                                <div className="
                                    absolute top-3 right-3 z-10
                                    flex gap-2
                                    opacity-0 group-hover:opacity-100
                                    transition
                                ">
                                    <button
                                        onClick={() => handleEdit(course.id)}
                                        className="
                                            p-2 rounded-lg bg-white/90
                                            hover:bg-gray-100
                                        "
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="
                                            p-2 rounded-lg bg-white/90
                                            text-red-600 hover:bg-red-50
                                        "
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <Link to={`/courses/${course.id}`}>
                                    {/* THUMBNAIL */}
                                    {course.thumbnailUrl ? (
                                        <div className="relative h-40">
                                            <img
                                                src={course.thumbnailUrl}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        </div>
                                    ) : (
                                        <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                                            Không có ảnh
                                        </div>
                                    )}

                                    {/* CONTENT */}
                                    <div className="p-5">
                                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                                            {course.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                                            {course.description}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= MODAL ================= */}
            {openCreate && (
                <CreateCourseModal
                    onClose={() => setOpenCreate(false)}
                    onSubmit={handleCreate}
                />
            )}
        </>
    );
};

export default CreatedCourseList;

/* ================= MODAL ================= */

function CreateCourseModal({
    onClose,
    onSubmit,
}: {
    onClose: () => void;
    onSubmit: (title: string, description: string) => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="
                bg-white rounded-2xl w-full max-w-md p-6 shadow-xl
                animate-[scaleIn_0.15s_ease-out]
            ">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                        Tạo khóa học mới
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <X />
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">
                            Tiêu đề
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="
                                w-full border rounded-xl px-3 py-2 mt-1
                                focus:outline-none focus:ring-2 focus:ring-gray-900/20
                            "
                            placeholder="Nhập tiêu đề khóa học"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Mô tả
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="
                                w-full border rounded-xl px-3 py-2 mt-1 resize-none
                                focus:outline-none focus:ring-2 focus:ring-gray-900/20
                            "
                            rows={4}
                            placeholder="Mô tả ngắn khóa học"
                        />
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-50"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={() => onSubmit(title, description)}
                        disabled={!title.trim()}
                        className="
                            px-4 py-2 text-sm rounded-xl
                            bg-gray-900 text-white
                            hover:bg-gray-800
                            disabled:opacity-50
                        "
                    >
                        Tạo khóa học
                    </button>
                </div>
            </div>
        </div>
    );
}
