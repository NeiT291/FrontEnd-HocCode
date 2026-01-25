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
import type { Problem } from "@/services/api/problem.types";
import type { Module } from "@/services/api/course.types";
import { runTest, submitCode } from "@/services/api/runcode.service";
import type { RunCodeProblem } from "@/services/api/runcode.types";
/* ================= TYPES ================= */

type Difficulty = "easy" | "medium" | "hard";
type Language = "cpp" | "java" | "python";
const LANGUAGE_MAP: Record<Language, { id: number; label: string }> = {
    cpp: { id: 54, label: "cpp" },
    java: { id: 62, label: "java" },
    python: { id: 71, label: "python" },
};
/* ================= PAGE ================= */

export default function LessonDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();

    const lessonId = Number(id);
    const courseId = Number(searchParams.get("courseId"));

    const [problem, setProblem] = useState<Problem | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [openModules, setOpenModules] = useState<number[]>([]);

    const [showSidebar, setShowSidebar] = useState(true);

    const [language, setLanguage] = useState<Language>("cpp");
    const [code, setCode] = useState(getTemplate("cpp"));
    const isTheory = problem?.isTheory;

    const [running, setRunning] = useState(false);
    const [runResult, setRunResult] = useState<RunCodeProblem | null>(null);
    const [runError, setRunError] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<RunCodeProblem | null>(null);
    const [submitError, setSubmitError] = useState("");
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
    const handleRun = async () => {
        if (!problem) return;

        try {
            setRunning(true);
            setRunError("");
            setRunResult(null);
            setSubmitResult(null);
            const res = await runTest({
                problemId: problem.id,
                languageId: LANGUAGE_MAP[language].id,
                language: LANGUAGE_MAP[language].label,
                sourceCode: code,
            });
            setRunResult(res);
        } catch (err) {
            setRunError(
                err instanceof Error ? err.message : "Run code failed"
            );
        } finally {
            setRunning(false);
        }
    };
    const handleSubmit = async () => {
        if (!problem) return;


        try {
            setSubmitting(true);
            setSubmitError("");
            setSubmitResult(null);
            setRunResult(null);
            const res = await submitCode({
                problemId: problem.id,
                languageId: LANGUAGE_MAP[language].id,
                language: LANGUAGE_MAP[language].label,
                sourceCode: code,
            });
            setSubmitResult(res);
            if (res.verdict === "Accepted") {

                const nextId = getNextLessonId(modules, problem.id);
                if (nextId) {
                    window.location.href = `/lessons/${nextId}?courseId=${courseId}`;
                }
            }
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : "Submit failed"
            );
        } finally {
            setSubmitting(false);
        }
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
                        <aside className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-4 h-fit top-4">
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
                        {/* SAMPLE TEST CASE */}
                        <div className="mt-10">
                            <h2 className="text-lg font-semibold mb-4">
                                Test case mẫu
                            </h2>

                            <div className="space-y-4">
                                {problem.testcases
                                    .filter((tc) => tc.isSample)
                                    .sort(
                                        (a, b) =>
                                            a.position - b.position
                                    )
                                    .map((tc, index) => (
                                        <TestCase
                                            key={tc.id}
                                            index={index + 1}
                                            input={tc.input}
                                            output={
                                                tc.expectedOutput
                                            }
                                        />
                                    ))}
                            </div>
                        </div>
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
                                    label={running ? "Running..." : "Run"}
                                    variant="primary"
                                    disabled={isTheory || running}
                                    onClick={handleRun}
                                />

                                <ActionButton
                                    icon={<CheckCircle size={16} />}
                                    label={submitting ? "Submitting..." : "Submit"}
                                    variant="success"
                                    disabled={submitting}
                                    onClick={handleSubmit}
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
                        {/* ================= RUN RESULT ================= */}
                        {runError && (
                            <div className="border-t p-4 text-red-600 bg-red-50 text-sm">
                                {runError}
                            </div>
                        )}

                        {runResult && (
                            <div className="border-t p-4 space-y-4 overflow-y-auto max-h-72 bg-white">
                                <div className="flex justify-between font-semibold">
                                    <span>
                                        Kết quả:{" "}
                                        {runResult.verdict}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Passed{" "}
                                        {runResult.passedCount}/
                                        {runResult.totalCount}
                                    </span>
                                </div>

                                {runResult.testCaseResult.map(
                                    (tc, index) => (
                                        <div
                                            key={
                                                tc.testCaseId
                                            }
                                            className="border rounded-xl"
                                        >
                                            <div className="px-4 py-2 bg-gray-50 flex justify-between rounded-xl">
                                                <span>
                                                    Test #
                                                    {index + 1}
                                                </span>
                                                <span
                                                    className={`font-semibold ${tc.statusId ===
                                                        3
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                        }`}
                                                >
                                                    {tc.status}
                                                </span>
                                            </div>

                                            <div className="p-4 space-y-2 text-sm">
                                                {tc.stdout && (
                                                    <ResultBlock
                                                        label="Output"
                                                        value={
                                                            tc.stdout
                                                        }
                                                    />
                                                )}
                                                {tc.stderr && (
                                                    <ResultBlock
                                                        label="Error"
                                                        value={
                                                            tc.stderr
                                                        }
                                                    />
                                                )}
                                                {tc.compileOutput && (
                                                    <ResultBlock
                                                        label="Compile Output"
                                                        value={
                                                            tc.compileOutput
                                                        }
                                                    />
                                                )}

                                                <div className="flex gap-4 text-xs text-gray-500">
                                                    <span>
                                                        {"Time: "}
                                                        {tc.time}
                                                    </span>
                                                    <span>
                                                        {"Memory: "}
                                                        {tc.memory}{" "}
                                                        KB
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                        {/* ================= SUBMIT RESULT ================= */}
                        {submitError && (
                            <div className="border-t p-4 text-red-600 bg-red-50 text-sm">
                                {submitError}
                            </div>
                        )}

                        {submitResult && (
                            <div className="border-t p-4 space-y-4 bg-green-50">
                                <div className="flex justify-between font-semibold">
                                    <span>
                                        Kết quả: {submitResult.verdict}
                                    </span>
                                    <span className="text-sm">
                                        Passed {submitResult.passedCount}/
                                        {submitResult.totalCount}
                                    </span>
                                </div>

                                {submitResult.testCaseResult.map((tc, index) => (
                                    <div
                                        key={tc.testCaseId}
                                        className="border rounded-xl bg-white"
                                    >
                                        <div className="px-4 py-2 bg-gray-50 flex justify-between rounded-xl">
                                            <span>Test #{index + 1}</span>
                                            <span
                                                className={`font-semibold ${tc.statusId === 3
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                    }`}
                                            >
                                                {tc.status}
                                            </span>
                                        </div>

                                        <div className="p-4 space-y-2 text-sm">
                                            {tc.stdout && (
                                                <ResultBlock
                                                    label="Output"
                                                    value={tc.stdout}
                                                />
                                            )}
                                            {tc.stderr && (
                                                <ResultBlock
                                                    label="Stderr"
                                                    value={tc.stderr}
                                                />
                                            )}
                                            {tc.compileOutput && (
                                                <ResultBlock
                                                    label="Compile Output"
                                                    value={tc.compileOutput}
                                                />
                                            )}

                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span>Time: {tc.time}</span>
                                                <span>Memory: {tc.memory} KB</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
    disabled,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    variant?: "primary" | "success";
    disabled?: boolean;
    onClick?: () => void;
}) {
    const base =
        "flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition";

    const styles =
        variant === "primary"
            ? "bg-gray-900 text-white hover:bg-gray-800"
            : "bg-green-600 text-white hover:bg-green-700";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${styles} ${disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer active:scale-95"
                }`}
        >
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
function getNextLessonId(
    modules: Module[],
    currentLessonId: number
): number | null {
    for (const m of modules) {
        const idx = m.problems.findIndex(p => p.id === currentLessonId);
        if (idx !== -1) {
            if (idx + 1 < m.problems.length) {
                return m.problems[idx + 1].id;
            }
        }
    }
    return null;
}
function TestCase({
    index,
    input,
    output,
}: {
    index: number;
    input: string;
    output: string;
}) {
    return (
        <div className="border rounded-xl">
            <div className="px-4 py-2 bg-gray-50 font-semibold rounded-xl">
                Test case #{index}
            </div>
            <div className="p-4 grid sm:grid-cols-2 gap-4">
                <CodeBlock label="Input" value={input} />
                <CodeBlock label="Output" value={output} />
            </div>
        </div>
    );
}
function CodeBlock({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs text-gray-500 mb-1">
                {label}
            </p>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-sm overflow-x-auto">
                {value}
            </pre>
        </div>
    );
}
function ResultBlock({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs text-gray-500 mb-1">
                {label}
            </p>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
                {value}
            </pre>
        </div>
    );
}