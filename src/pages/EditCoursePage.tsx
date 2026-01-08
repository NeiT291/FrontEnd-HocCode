import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Camera,
    Plus,
    Trash2,
    BookOpen,
    Code,
    Check,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getCourseById,
    modifyCourse,
    setCourseThumbnail,
    addCourseModule,
} from "@/services/api/course.service";

import type { Course, Module, Problem } from "@/services/api/course.types";
import CreateLessonModal from "@/components/lesson/CreateLessonModal";

/* ================= PAGE ================= */

export default function EditCoursePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    /* ================= BASIC STATE ================= */

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const [course, setCourse] = useState<Course | null>(null);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [previewImage, setPreviewImage] =
        useState<string | null>(null);

    /* ================= MODULE / LESSON ================= */

    const [modules, setModules] = useState<Module[]>([]);

    const [creatingModule, setCreatingModule] =
        useState<boolean>(false);
    const [creatingModuleLoading, setCreatingModuleLoading] =
        useState<boolean>(false);
    const [newModuleTitle, setNewModuleTitle] =
        useState<string>("");

    const [openLessonModal, setOpenLessonModal] =
        useState<boolean>(false);
    const [activeModuleId, setActiveModuleId] =
        useState<number | null>(null);

    /* ================= LOAD COURSE ================= */

    useEffect(() => {
        let mounted = true;

        const fetchCourse = async () => {
            if (!id) return;

            try {
                const data = await getCourseById(Number(id));
                if (!mounted) return;

                setCourse(data);
                setTitle(data.title);
                setDescription(data.description ?? "");

                setModules(
                    (data.modules ?? []).sort(
                        (a, b) => a.position - b.position
                    )
                );
            } catch (err: unknown) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Không tải được khóa học"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
        return () => {
            mounted = false;
        };
    }, [id]);

    /* ================= COURSE ================= */

    const handleSaveCourse = async () => {
        if (!course) return;

        try {
            setSaving(true);
            await modifyCourse({
                id: course.id,
                title,
                description,
            });
            toast.success("Cập nhật khóa học thành công");
        } catch (err: unknown) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Lưu thay đổi thất bại"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleUploadThumbnail = async (file: File) => {
        if (!course) return;

        try {
            setUploading(true);
            setPreviewImage(URL.createObjectURL(file));

            const thumbnailUrl = await setCourseThumbnail(
                course.id,
                file
            );

            setCourse({ ...course, thumbnailUrl });
            toast.success("Cập nhật ảnh thành công");
        } catch (err: unknown) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Upload ảnh thất bại"
            );
        } finally {
            setUploading(false);
        }
    };

    /* ================= MODULE ================= */

    const confirmCreateModule = async () => {
        if (!course || !newModuleTitle.trim()) {
            toast.error("Vui lòng nhập tên module");
            return;
        }

        try {
            setCreatingModuleLoading(true);

            await addCourseModule({
                courseId: course.id,
                title: newModuleTitle.trim(),
                position: modules.length + 1,
            });

            toast.success("Đã thêm module");
            setNewModuleTitle("");
            setCreatingModule(false);

            // reload course để lấy id thật
            const refreshed = await getCourseById(course.id);
            setModules(refreshed.modules ?? []);
        } catch (err: unknown) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Thêm module thất bại"
            );
        } finally {
            setCreatingModuleLoading(false);
        }
    };

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-10 shadow text-center text-gray-500">
                Đang tải khóa học...
            </div>
        );
    }

    if (!course || error) {
        return (
            <div className="bg-white rounded-2xl p-10 shadow text-center text-red-500">
                {error || "Không tìm thấy khóa học"}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-10">
            {/* HEADER */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-gray-50 py-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-600"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </button>

                <button
                    onClick={handleSaveCourse}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white disabled:opacity-50"
                >
                    <Save size={16} />
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>

            {/* COURSE INFO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* THUMBNAIL */}
                <div className="bg-white rounded-2xl p-6 shadow space-y-4">
                    <h2 className="font-semibold">Ảnh đại diện</h2>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                        {previewImage || course.thumbnailUrl ? (
                            <img
                                src={
                                    previewImage ??
                                    course.thumbnailUrl ??
                                    ""
                                }
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                Chưa có ảnh
                            </div>
                        )}

                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 cursor-pointer">
                            <Camera className="text-white" />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleUploadThumbnail(f);
                                }}
                            />
                        </label>
                    </div>

                    {uploading && (
                        <p className="text-sm">Đang upload ảnh...</p>
                    )}
                </div>

                {/* BASIC INFO */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow space-y-6">
                    <label className="text-sm font-medium"> Tiêu đề </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                        placeholder="Tiêu đề khóa học"
                    />
                    <label className="text-sm font-medium"> Mô tả </label>
                    <textarea
                        rows={5}
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                        placeholder="Mô tả khóa học"
                    />
                </div>
            </div>

            {/* MODULE & LESSON */}
            <div className="bg-white rounded-2xl p-6 shadow space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Nội dung khóa học
                    </h2>

                    {!creatingModule && (
                        <button
                            onClick={() => setCreatingModule(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white"
                        >
                            <Plus size={16} />
                            Thêm module
                        </button>
                    )}
                </div>

                {/* CREATE MODULE */}
                {creatingModule && (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <input
                            autoFocus
                            value={newModuleTitle}
                            onChange={(e) =>
                                setNewModuleTitle(e.target.value)
                            }
                            className="flex-1 bg-transparent outline-none"
                            placeholder="Tên module"
                        />
                        <button
                            onClick={confirmCreateModule}
                            disabled={creatingModuleLoading}
                            className="p-2 bg-gray-900 text-white rounded-lg"
                        >
                            <Check size={16} />
                        </button>
                        <button
                            onClick={() => setCreatingModule(false)}
                            className="p-2 text-gray-500"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* MODULE LIST */}
                {modules.map((module, mi) => (
                    <div
                        key={module.id}
                        className="border rounded-xl overflow-hidden"
                    >
                        <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
                            <span className="text-sm text-gray-400">
                                Module {mi + 1}
                            </span>
                            <span className="flex-1 font-medium">
                                {module.title}
                            </span>
                            <Trash2
                                size={16}
                                className="text-gray-400"
                            />
                        </div>

                        <div className="p-4 space-y-2">
                            {(module.problems ?? []).map(
                                (lesson: Problem, li) => (
                                    <div
                                        key={lesson.id}
                                        className="flex items-center gap-3 border rounded-lg px-3 py-2"
                                    >
                                        <span className="text-xs text-gray-400">
                                            {mi + 1}.{li + 1}
                                        </span>
                                        {lesson.isTheory ? (
                                            <BookOpen size={16} />
                                        ) : (
                                            <Code size={16} />
                                        )}
                                        <span className="flex-1">
                                            {lesson.title}
                                        </span>
                                    </div>
                                )
                            )}

                            <button
                                onClick={() => {
                                    setActiveModuleId(module.id);
                                    setOpenLessonModal(true);
                                }}
                                className="text-sm text-gray-600"
                            >
                                + Thêm bài học
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* LESSON MODAL */}
            {openLessonModal && activeModuleId && (
                <CreateLessonModal />
            )}
        </div>
    );
}
