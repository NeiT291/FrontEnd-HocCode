import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Camera,
    Plus,
    Trash2,
    Pencil,
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
    updateModule,
    deleteModule,
} from "@/services/api/course.service";
import { deleteLesson } from "@/services/api/problem.service";
import type { Course, Module, Problem } from "@/services/api/course.types";
import CreateLessonModal from "@/components/lesson/CreateLessonModal";
import EditLessonModal from "@/components/lesson/EditLessonModal";

/* ================= PAGE ================= */

export default function EditCoursePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    /* ================= BASIC ================= */

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [editingLesson, setEditingLesson] = useState<Problem | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    /* ================= MODULE / LESSON ================= */

    const [modules, setModules] = useState<Module[]>([]);

    const [creatingModule, setCreatingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");

    const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
    const [editingModuleTitle, setEditingModuleTitle] = useState("");

    const [openLessonModal, setOpenLessonModal] = useState(false);
    const [activeModuleId, setActiveModuleId] = useState<number | null>(null);

    /* ================= LOAD ================= */

    const reloadCourse = async () => {
        if (!id) return;
        const data = await getCourseById(Number(id));
        setCourse(data);
        setModules(data.modules ?? []);
    };

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
                    (data.modules ?? []).sort((a, b) => a.position - b.position)
                );
            } catch (err: unknown) {
                toast.error(
                    err instanceof Error ? err.message : "Không tải được khóa học"
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
            toast.success("Đã lưu khóa học");
        } catch {
            toast.error("Lưu thất bại");
        } finally {
            setSaving(false);
        }
    };

    const handleUploadThumbnail = async (file: File) => {
        if (!course) return;
        try {
            setUploading(true);
            setPreviewImage(URL.createObjectURL(file));
            const url = await setCourseThumbnail(course.id, file);
            setCourse({ ...course, thumbnailUrl: url });
            toast.success("Đã cập nhật ảnh");
        } finally {
            setUploading(false);
        }
    };

    /* ================= MODULE ================= */

    const handleCreateModule = async () => {
        if (!course || !newModuleTitle.trim()) return;
        await addCourseModule({
            courseId: course.id,
            title: newModuleTitle,
            position: modules.length + 1,
        });
        setNewModuleTitle("");
        setCreatingModule(false);
        reloadCourse();
    };

    const handleUpdateModule = async (moduleId: number) => {
        await updateModule({
            id: moduleId,
            title: editingModuleTitle,
            courseId: Number(id),
        });
        setEditingModuleId(null);
        reloadCourse();
    };

    const handleDeleteModule = async (moduleId: number) => {
        if (!confirm("Xóa module này?")) return;
        await deleteModule(moduleId);
        reloadCourse();
    };

    /* ================= LESSON ================= */

    const handleDeleteLesson = async (lessonId: number) => {
        if (!confirm("Xóa bài học này?")) return;
        await deleteLesson(lessonId);
        reloadCourse();
    };

    /* ================= RENDER ================= */

    if (loading) return <div>Đang tải...</div>;
    if (!course) return <div>Không tìm thấy khóa học</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-10">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="text-sm flex gap-2">
                    <ArrowLeft size={16} /> Quay lại
                </button>
                <button
                    onClick={handleSaveCourse}
                    disabled={saving}
                    className="bg-gray-900 text-white px-6 py-2 rounded-xl"
                >
                    <Save size={16} /> Lưu
                </button>
            </div>

            {/* COURSE INFO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {" "}
                {/* THUMBNAIL */}{" "}
                <div className="bg-white rounded-2xl p-6 shadow space-y-4">
                    {" "}
                    <h2 className="font-semibold">Ảnh đại diện</h2>{" "}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                        {" "}
                        {previewImage || course.thumbnailUrl ? (
                            <img
                                src={previewImage ?? course.thumbnailUrl ?? ""}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                {" "}
                                Chưa có ảnh{" "}
                            </div>
                        )}{" "}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 cursor-pointer">
                            {" "}
                            <Camera className="text-white" />{" "}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleUploadThumbnail(f);
                                }}
                            />{" "}
                        </label>{" "}
                    </div>{" "}
                    {uploading && <p className="text-sm">Đang upload ảnh...</p>}{" "}
                </div>{" "}
                {/* BASIC INFO */}{" "}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow space-y-6">
                    {" "}
                    <label className="text-sm font-medium"> Tiêu đề </label>{" "}
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                        placeholder="Tiêu đề khóa học"
                    />{" "}
                    <label className="text-sm font-medium"> Mô tả </label>{" "}
                    <textarea
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                        placeholder="Mô tả khóa học"
                    />{" "}
                </div>{" "}
            </div>

            {/* MODULE / LESSON */}
            <div className="bg-white p-6 rounded-xl space-y-4">
                <div className="flex justify-between">
                    <h2 className="font-semibold">Nội dung</h2>
                    {!creatingModule && (
                        <button
                            onClick={() => setCreatingModule(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white"
                        >
                            {" "}
                            <Plus size={16} /> Thêm module{" "}
                        </button>
                    )}
                </div>

                {creatingModule && (
                    <div className="flex gap-2">
                        <input
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                            className="border rounded-xl px-3 py-2 flex-1"
                        />
                        <button onClick={handleCreateModule}>
                            <Check />
                        </button>
                        <button onClick={() => setCreatingModule(false)}>
                            <X />
                        </button>
                    </div>
                )}

                {modules.map((module) => (
                    <div key={module.id} className="border ">
                        <div className="flex items-center px-4 py-3 bg-gray-50">
                            {editingModuleId === module.id ? (
                                <>
                                    <input
                                        value={editingModuleTitle}
                                        onChange={(e) => setEditingModuleTitle(e.target.value)}
                                        className="flex-1 border rounded px-2"
                                    />
                                    <button onClick={() => handleUpdateModule(module.id)}>
                                        <Check />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1 font-medium">{module.title}</span>
                                    <Pencil
                                        size={16}
                                        onClick={() => {
                                            setEditingModuleId(module.id);
                                            setEditingModuleTitle(module.title);
                                        }}
                                        className="mr-4"
                                    />
                                    <Trash2
                                        size={16}
                                        onClick={() => handleDeleteModule(module.id)}
                                    />
                                </>
                            )}
                        </div>

                        <div className="p-4 space-y-2">
                            {(module.problems ?? []).map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="flex items-center gap-2 border rounded-lg px-3 py-2"
                                >
                                    {lesson.isTheory ? <BookOpen /> : <Code />}
                                    <span className="flex-1">{lesson.title}</span>

                                    {/* EDIT */}
                                    <Pencil
                                        size={14}
                                        className="cursor-pointer text-gray-500 hover:text-gray-900"
                                        onClick={() => {
                                            setEditingLesson(lesson);
                                        }}
                                    />

                                    {/* DELETE */}
                                    <Trash2
                                        size={14}
                                        className="cursor-pointer text-red-500"
                                        onClick={() => handleDeleteLesson(lesson.id)}
                                    />
                                </div>
                            ))}

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

            {openLessonModal && activeModuleId && (
                <CreateLessonModal
                    moduleId={activeModuleId}
                    onClose={() => setOpenLessonModal(false)}
                    onSuccess={reloadCourse}
                />
            )}
            {editingLesson && (
                <EditLessonModal
                    lesson={editingLesson}
                    onClose={() => setEditingLesson(null)}
                    onSuccess={() => {
                        setEditingLesson(null);
                        reloadCourse();
                    }}
                />
            )}
        </div>
    );
}
