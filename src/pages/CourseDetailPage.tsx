import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    BookOpen,
    Code,
    ChevronDown,
    GraduationCap,
    User,
    Lock,
    CheckCircle,
    Clock,
    Circle,
} from "lucide-react";
import { getCourseById, checkCourseJoined, enrollCourse, outCourse } from "@/services/api/course.service";
import type { Course, Module } from "@/services/api/course.types";
import toast from "react-hot-toast";

/* ================= UI TYPES ================= */

type LessonProgress = "not_started" | "in_progress" | "completed";

interface UiLesson {
    id: number;
    title: string;
    isTheory: boolean;
    progress: LessonProgress;
}

/* ================= PAGE ================= */

export default function CourseDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const courseId = Number(id);

    const [course, setCourse] = useState<Course | null>(null);
    const [joined, setJoined] = useState<boolean>(false);
    const [checkingJoin, setCheckingJoin] = useState(true);
    const [openModules, setOpenModules] = useState<number[]>([]);
    const joinRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (Number.isNaN(courseId)) return;

        getCourseById(courseId).then((data) => {
            const modules: Module[] = data.modules
                .sort((a, b) => a.position - b.position)
                .map((m) => ({
                    id: m.id,
                    title: m.title,
                    position: m.position,
                    createdAt: m.createdAt,
                    problems: m.problems ?? [],
                }));

            setCourse({
                ...data,
                createdAt: new Date(data.createdAt).toLocaleDateString("vi-VN"),
                updatedAt: new Date(data.updatedAt).toLocaleDateString("vi-VN"),
                modules,
            });
        });
        checkCourseJoined(courseId)
            .then((data) => {
                setJoined(Boolean(data));
            })
            .finally(() => {
                setCheckingJoin(false);
            });
    }, [courseId]);

    const toggleModule = (moduleId: number) => {
        setOpenModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleJoinCourse = async () => {
        if (localStorage.getItem("access_token") == null) {
            navigate("/login");
        } else {
            try {
                await enrollCourse(courseId);
                setJoined(true);
                toast.success("Tham gia khóa học thành công!");
            } catch (e) {
                console.error("Enroll course error:", e);
                toast.error("Không thể tham gia khóa học. Vui lòng thử lại!");
            }
        }
    };
    const handleOutCourse = async () => {

        try {
            await outCourse(courseId);
            setJoined(false);
            toast.success("Rời khóa học thành công!");
        } catch (e) {
            console.error("Enroll course error:", e);
            toast.error("Vui lòng thử lại!");
        }

    };
    const scrollToJoin = () => {
        joinRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (!course) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-gray-500">
                Đang tải khóa học...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                {/* ================= HEADER ================= */}
                <section className="bg-white rounded-2xl shadow-sm p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Thumbnail */}
                        <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                            {course.thumbnailUrl ? (
                                <img
                                    src={course.thumbnailUrl}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Không có ảnh
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="md:col-span-2">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {course.title}
                            </h1>

                            <p className="mt-4 text-gray-700">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-500 mb-6">
                                <span className="flex items-center gap-1">
                                    <User size={14} />
                                    Tạo bởi: {course.owner.displayName}
                                </span>
                                <span className="flex items-center gap-1">
                                    <GraduationCap size={14} />
                                    Ngày tạo: {course.createdAt}
                                </span>
                            </div>

                            {!checkingJoin && !joined && (
                                <button
                                    onClick={handleJoinCourse}
                                    className="px-8 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                                >
                                    Tham gia học
                                </button>
                            )}

                            {!checkingJoin && joined && (
                                <span className="inline-flex items-center gap-2 text-green-600 text-sm font-medium">
                                    <CheckCircle size={16} />
                                    Bạn đã tham gia khóa học
                                    <button
                                        onClick={handleOutCourse}
                                        className="px-8 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer transition"
                                    >
                                        Bỏ học
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* ================= MODULES ================= */}
                <section className="space-y-4">
                    {course.modules.map((module) => {
                        const isOpen = openModules.includes(module.id);

                        return (
                            <div
                                key={module.id}
                                className="bg-white rounded-2xl shadow-sm"
                            >
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 rounded-2xl"
                                >
                                    <h2 className="text-lg font-semibold">
                                        {module.title}
                                    </h2>
                                    <ChevronDown
                                        className={`transition ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="border-t">
                                        {module.problems.map((p) => (
                                            <LessonRow
                                                key={p.id}
                                                lesson={{
                                                    id: p.id,
                                                    title: p.title,
                                                    isTheory: p.isTheory,
                                                    progress: "not_started",
                                                }}
                                                moduleId={module.id}
                                                courseId={course.id}
                                                joined={joined}
                                                onRequireJoin={scrollToJoin}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </section>
            </div>
        </div>
    );
}

/* ================= LESSON ROW ================= */

function LessonRow({
    lesson,
    moduleId,
    courseId,
    joined,
    onRequireJoin,
}: {
    lesson: UiLesson;
    moduleId: number;
    courseId: number;
    joined: boolean;
    onRequireJoin: () => void;
}) {
    const isTheory = lesson.isTheory;

    const content = (
        <>
            <div className="flex items-center gap-3">
                {isTheory ? (
                    <BookOpen size={18} className="text-blue-500" />
                ) : (
                    <Code size={18} className="text-green-600" />
                )}
                <span className={joined ? "text-gray-900" : "text-gray-500"}>
                    {lesson.title}
                </span>
            </div>

            <LessonProgressBadge
                progress={lesson.progress}
                joined={joined}
            />
        </>
    );

    if (!joined) {
        return (
            <button
                onClick={onRequireJoin}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50"
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            to={`/lessons/${lesson.id}?courseId=${courseId}&module=${moduleId}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
        >
            {content}
        </Link>
    );
}

function LessonProgressBadge({
    progress,
    joined,
}: {
    progress: LessonProgress;
    joined: boolean;
}) {
    if (!joined) {
        return (
            <span className="flex items-center gap-1 text-xs text-gray-400">
                <Lock size={14} />
                Tham gia để học
            </span>
        );
    }

    switch (progress) {
        case "completed":
            return (
                <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={14} />
                    Hoàn thành
                </span>
            );
        case "in_progress":
            return (
                <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <Clock size={14} />
                    Đang học
                </span>
            );
        default:
            return (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Circle size={14} />
                    Chưa học
                </span>
            );
    }
}
