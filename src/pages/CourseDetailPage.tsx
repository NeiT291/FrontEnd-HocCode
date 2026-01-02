import { useParams, Link } from "react-router-dom";
import { useState, useRef } from "react";
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

/* ================= TYPES ================= */

type LessonType = "theory" | "practice";
type LessonProgress = "not_started" | "in_progress" | "completed";

interface Lesson {
    id: number;
    title: string;
    type: LessonType;
    progress?: LessonProgress;
}

interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
}

/* ================= MOCK DATA ================= */

const course = {
    id: 1,
    title: "Lập trình C++ cơ bản",
    description:
        "Khóa học giúp bạn nắm vững kiến thức nền tảng về lập trình C++ thông qua lý thuyết dễ hiểu và bài tập thực hành trực tiếp.",
    instructor: "Nguyễn Văn A",
    createdAt: "01/03/2025",
    objectives: [
        "Nắm vững cú pháp C++ cơ bản",
        "Hiểu cấu trúc điều khiển",
        "Giải được các bài toán cơ bản",
    ],
    modules: [
        {
            id: 1,
            title: "Nhập môn C++",
            lessons: [
                {
                    id: 1,
                    title: "Giới thiệu C++",
                    type: "theory",
                    progress: "completed",
                },
                {
                    id: 2,
                    title: "Cú pháp cơ bản",
                    type: "theory",
                    progress: "in_progress",
                },
                {
                    id: 3,
                    title: "Bài tập cộng hai số",
                    type: "practice",
                    progress: "not_started",
                },
            ],
        },
        {
            id: 2,
            title: "Cấu trúc điều khiển",
            lessons: [
                {
                    id: 4,
                    title: "Câu lệnh if / else",
                    type: "theory",
                    progress: "not_started",
                },
                {
                    id: 5,
                    title: "Vòng lặp for",
                    type: "theory",
                    progress: "not_started",
                },
                {
                    id: 6,
                    title: "Bài tập vòng lặp",
                    type: "practice",
                    progress: "not_started",
                },
            ],
        },
    ] as Module[],
};

/* ================= PAGE ================= */

export default function CourseDetailPage() {
    const { id } = useParams();
    const [joined, setJoined] = useState(false);
    const [openModules, setOpenModules] = useState<number[]>([]);
    const joinRef = useRef<HTMLDivElement>(null);

    const toggleModule = (moduleId: number) => {
        setOpenModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const scrollToJoin = () => {
        joinRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                {/* ================= COURSE HEADER ================= */}
                <section className="bg-white rounded-2xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {course.title}
                    </h1>

                    <p className="mt-4 text-gray-700 max-w-3xl">
                        {course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <User size={14} />
                            Giảng viên: {course.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                            <GraduationCap size={14} />
                            Ngày tạo: {course.createdAt}
                        </span>
                    </div>
                </section>

                {/* ================= LOBBY / JOIN ================= */}
                {!joined && (
                    <section
                        ref={joinRef}
                        className="bg-white rounded-2xl shadow-sm p-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Bạn sẽ học được gì?
                        </h2>

                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {course.objectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                            ))}
                        </ul>

                        <div className="mt-8">
                            <button
                                onClick={() => setJoined(true)}
                                className="
                  px-8 py-3 rounded-xl
                  bg-gray-900 text-white
                  hover:bg-gray-800
                "
                            >
                                Tham gia học
                            </button>
                        </div>
                    </section>
                )}

                {/* ================= MODULES ================= */}
                <section className="space-y-4">
                    {course.modules.map((module) => {
                        const isOpen = openModules.includes(module.id);

                        return (
                            <div
                                key={module.id}
                                className="bg-white rounded-2xl shadow-sm"
                            >
                                {/* Module header */}
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="
                    w-full flex items-center justify-between
                    px-6 py-4 text-left
                    hover:bg-gray-50
                    rounded-2xl
                  "
                                >
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {module.title}
                                    </h2>

                                    <ChevronDown
                                        className={`transition ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {/* Lessons */}
                                {isOpen && (
                                    <div className="border-t">
                                        {module.lessons.map((lesson) => (
                                            <LessonRow
                                                key={lesson.id}
                                                lesson={lesson}
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

/* ================= COMPONENTS ================= */

function LessonRow({
    lesson,
    courseId,
    joined,
    onRequireJoin,
}: {
    lesson: Lesson;
    courseId: number;
    joined: boolean;
    onRequireJoin: () => void;
}) {
    const isTheory = lesson.type === "theory";

    const content = (
        <>
            {/* Left */}
            <div className="flex items-center gap-3">
                {isTheory ? (
                    <BookOpen size={18} className="text-blue-500" />
                ) : (
                    <Code size={18} className="text-green-600" />
                )}

                <span
                    className={`${joined ? "text-gray-900" : "text-gray-500"
                        }`}
                >
                    {lesson.title}
                </span>
            </div>

            {/* Right */}
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
                className="
          w-full flex items-center justify-between
          px-6 py-4
          hover:bg-gray-50
        "
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            to={
                isTheory
                    ? `/courses/${courseId}/lessons/${lesson.id}`
                    : `/practice/${lesson.id}?courseId=${courseId}`
            }
            className="
        flex items-center justify-between
        px-6 py-4
        hover:bg-gray-50
        transition
      "
        >
            {content}
        </Link>
    );
}

function LessonProgressBadge({
    progress,
    joined,
}: {
    progress?: LessonProgress;
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