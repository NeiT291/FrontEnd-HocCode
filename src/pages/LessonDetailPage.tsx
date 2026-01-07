import { useParams, useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
    Play,
    CheckCircle,
    Clock,
    Database,
    BookOpen,
    Code,
    ChevronDown,
    PanelLeft
} from "lucide-react";

import { getProblemById } from "@/services/api/problem.service";
import { getCourseById } from "@/services/api/course.service";
import type { ProblemApi } from "@/services/api/problem.types";
import type { Module } from "@/services/api/course.types";

/* ================= TYPES ================= */

type Difficulty = "easy" | "medium" | "hard";
type Language = "cpp" | "java" | "python";

/* ================= PAGE ================= */

export default function LessonDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();

    const lessonId = Number(id);
    const courseId = Number(searchParams.get("courseId"));

    const [problem, setProblem] = useState<ProblemApi | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [openModules, setOpenModules] = useState<number[]>([]);

    const [showSidebar, setShowSidebar] = useState(true);

    const [language, setLanguage] = useState<Language>("cpp");
    const [code, setCode] = useState(getTemplate("cpp"));

    /* ================= LOAD CURRENT LESSON ================= */

    useEffect(() => {
        if (!lessonId) return;

        getProblemById(lessonId)
            .then(setProblem)
            .catch(() => setProblem(null));
    }, [lessonId]);

    /* ================= LOAD COURSE MODULES ================= */

    useEffect(() => {
        if (!courseId) return;

        getCourseById(courseId).then((course) => {
            const sortedModules = course.modules
                .sort((a, b) => a.position - b.position)
                .map((m) => ({
                    ...m,
                    problems: [...(m.problems ?? [])].sort(
                        (a, b) => a.position - b.position
                    ),
                }));

            setModules(sortedModules);

            const currentModule = sortedModules.find((m) =>
                m.problems.some((p) => p.id === lessonId)
            );
            if (currentModule) {
                setOpenModules([currentModule.id]);
            }
        });
    }, [courseId, lessonId]);

    const toggleModule = (moduleId: number) => {
        setOpenModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    /* ================= STATE RENDER ================= */

    if (!lessonId || Number.isNaN(lessonId)) {
        return <PageCenter>ID bài học không hợp lệ</PageCenter>;
    }

    if (!problem) {
        return <PageCenter>Đang tải bài học...</PageCenter>;
    }

    const timeLimit = `${problem.timeLimitMs / 1000}s`;
    const memoryLimit = `${problem.memoryLimitKb / 1024}MB`;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                {/* ===== TOGGLE SIDEBAR ===== */}
                <div className="mb-4 flex items-center justify-between">
                    <button
                        onClick={() => setShowSidebar((v) => !v)}
                        className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg shadow-sm bg-white hover:bg-gray-100 cursor-pointer transition"
                    >
                        <PanelLeft size={16} />
                        {showSidebar
                            ? "Ẩn nội dung khóa học"
                            : "Hiện nội dung khóa học"}
                    </button>
                </div>

                <div
                    className={`grid gap-6 transition-all
                        ${showSidebar
                            ? "grid-cols-1 lg:grid-cols-12"
                            : "grid-cols-1 lg:grid-cols-9"
                        }`}
                >
                    {/* ================= SIDEBAR ================= */}
                    {showSidebar && (
                        <aside className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-4 h-fit sticky top-4">
                            <h2 className="text-sm font-semibold text-gray-900 mb-4">
                                Nội dung khóa học
                            </h2>

                            <div className="space-y-2">
                                {modules.map((module) => {
                                    const isOpen = openModules.includes(
                                        module.id
                                    );

                                    return (
                                        <div
                                            key={module.id}
                                            className="border rounded-xl overflow-hidden"
                                        >
                                            {/* Module header */}
                                            <button
                                                onClick={() =>
                                                    toggleModule(module.id)
                                                }
                                                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-gray-50"
                                            >
                                                <span>{module.title}</span>
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition ${isOpen
                                                        ? "rotate-180"
                                                        : ""
                                                        }`}
                                                />
                                            </button>

                                            {/* Lessons */}
                                            {isOpen && (
                                                <ul className="border-t">
                                                    {module.problems.map(
                                                        (p) => {
                                                            const active =
                                                                p.id ===
                                                                lessonId;

                                                            return (
                                                                <li
                                                                    key={p.id}
                                                                >
                                                                    <Link
                                                                        to={`/lessons/${p.id}?courseId=${courseId}`}
                                                                        className={`
                                                                            flex items-center gap-2
                                                                            px-3 py-2 text-sm transition
                                                                            ${active
                                                                                ? "bg-gray-900 text-white"
                                                                                : "hover:bg-gray-100 text-gray-700"
                                                                            }
                                                                        `}
                                                                    >
                                                                        {p.isTheory ? (
                                                                            <BookOpen
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <Code
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        )}
                                                                        <span className="truncate">
                                                                            {
                                                                                p.title
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </aside>
                    )}

                    {/* ================= PROBLEM ================= */}
                    <section
                        className={`bg-white rounded-2xl shadow-sm p-8
                        ${showSidebar
                                ? "lg:col-span-4"
                                : "lg:col-span-4"
                            }`}
                    >
                        <h1 className="text-2xl font-bold text-gray-900">
                            {problem.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            <DifficultyBadge
                                difficulty={problem.difficulty}
                            />
                            <Meta
                                icon={<Clock size={14} />}
                                text={timeLimit}
                            />
                            <Meta
                                icon={<Database size={14} />}
                                text={memoryLimit}
                            />
                        </div>

                        <p className="mt-6 text-gray-700 leading-relaxed">
                            {problem.description}
                        </p>
                    </section>

                    {/* ================= EDITOR ================= */}
                    <section
                        className={`bg-gray-700 rounded-2xl shadow-sm flex flex-col h-[680px]
                        ${showSidebar
                                ? "lg:col-span-5"
                                : "lg:col-span-5"
                            }`}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
                            <select
                                value={language}
                                onChange={(e) => {
                                    const lang =
                                        e.target.value as Language;
                                    setLanguage(lang);
                                    setCode(getTemplate(lang));
                                }}
                                className="bg-gray-800 text-white rounded px-3 py-2 text-sm"
                            >
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="python">Python</option>
                            </select>

                            <div className="flex gap-2">
                                <ActionButton
                                    icon={<Play size={16} />}
                                    label="Run"
                                    variant="primary"
                                />
                                <ActionButton
                                    icon={<CheckCircle size={16} />}
                                    label="Submit"
                                    variant="success"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden rounded-b-2xl">
                            <Editor
                                language={language}
                                value={code}
                                onChange={(v) => setCode(v || "")}
                                theme="vs-dark"
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

/* ================= UI COMPONENTS ================= */

function PageCenter({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
            {children}
        </div>
    );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
    const styles = {
        easy: "bg-green-50 text-green-600 border-green-200",
        medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
        hard: "bg-red-50 text-red-600 border-red-200",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full border text-sm font-medium ${styles[difficulty]}`}
        >
            {difficulty.toUpperCase()}
        </span>
    );
}

function Meta({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <span className="flex items-center gap-1 text-sm text-gray-500">
            {icon}
            {text}
        </span>
    );
}

function ActionButton({
    icon,
    label,
    variant,
}: {
    icon: React.ReactNode;
    label: string;
    variant?: "primary" | "success";
}) {
    const base =
        "flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition cursor-pointer active:scale-95";

    const styles =
        variant === "primary"
            ? "bg-gray-900 text-white hover:bg-gray-800"
            : variant === "success"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border hover:bg-gray-50";

    return (
        <button className={`${base} ${styles}`}>
            {icon}
            {label}
        </button>
    );
}

/* ================= HELPERS ================= */

function getTemplate(lang: Language) {
    switch (lang) {
        case "cpp":
            return `#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}`;
        case "java":
            return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`;
        case "python":
            return `a, b = map(int, input().split())
print(a + b)`;
    }
}
