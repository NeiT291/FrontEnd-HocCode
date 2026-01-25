import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, CheckCircle, Clock, Database } from "lucide-react";

import { getProblemById } from "@/services/api/problem.service";
import { runTest, submitCode } from "@/services/api/runcode.service";
import type {
    Problem
} from "@/services/api/problem.types";
import type { RunCodeProblem } from "@/services/api/runcode.types";
/* ================= TYPES ================= */

type Difficulty = "easy" | "medium" | "hard";
type Language = "cpp" | "java" | "python";

/* ================= LANGUAGE MAP ================= */

const LANGUAGE_MAP: Record<
    Language,
    { id: number; name: string }
> = {
    cpp: { id: 54, name: "cpp" },
    java: { id: 62, name: "java" },
    python: { id: 71, name: "python" },
};

/* ================= PAGE ================= */

export default function PracticeDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [problem, setProblem] = useState<Problem | null>(null);

    const [language, setLanguage] = useState<Language>("cpp");
    const [code, setCode] = useState(getTemplate("cpp"));

    const [running, setRunning] = useState(false);
    const [runResult, setRunResult] = useState<RunCodeProblem | null>(null);
    const [runError, setRunError] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<RunCodeProblem | null>(null);
    const [submitError, setSubmitError] = useState("");
    /* ================= FETCH PROBLEM ================= */

    useEffect(() => {
        if (!id) return;

        let mounted = true;

        getProblemById(Number(id))
            .then((data) => {
                if (mounted) setProblem(data);
            })
            .catch(() => {
                if (mounted) setProblem(null);
            });

        return () => {
            mounted = false;
        };
    }, [id]);

    /* ================= RUN CODE ================= */

    async function handleRun() {
        if (!problem) return;

        try {
            setRunning(true);
            setRunError("");
            setRunResult(null);
            setSubmitResult(null);
            const payload = {
                problemId: problem.id,
                languageId: LANGUAGE_MAP[language].id,
                language: LANGUAGE_MAP[language].name,
                sourceCode: code,
            };

            const result = await runTest(payload);
            setRunResult(result);
        } catch (err) {
            setRunError(
                err instanceof Error ? err.message : "Run code failed"
            );
        } finally {
            setRunning(false);
        }
    }
    async function handleSubmit() {
        if (!problem) return;

        try {
            setSubmitting(true);
            setSubmitError("");
            setSubmitResult(null);
            setRunResult(null);
            const payload = {
                problemId: problem.id,
                languageId: LANGUAGE_MAP[language].id,
                language: LANGUAGE_MAP[language].name,
                sourceCode: code,
            };

            const result = await submitCode(payload);
            setSubmitResult(result);
        } catch (err) {
            setSubmitError(
                err instanceof Error ? err.message : "Submit failed"
            );
        } finally {
            setSubmitting(false);
        }
    }
    /* ================= STATE RENDER ================= */

    if (!id || Number.isNaN(Number(id))) {
        return (
            <PageCenter>
                <span className="text-red-500">
                    ID bài tập không hợp lệ
                </span>
            </PageCenter>
        );
    }

    if (!problem) {
        return (
            <PageCenter>
                <span className="text-gray-500">
                    Đang tải bài tập...
                </span>
            </PageCenter>
        );
    }

    const timeLimit = `${problem.timeLimitMs / 1000}s`;
    const memoryLimit = `${problem.memoryLimitKb / 1024}MB`;

    /* ================= RENDER ================= */

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ================= PROBLEM ================= */}
                    <section className="bg-white rounded-2xl shadow-sm p-8">
                        <h1 className="text-3xl font-bold text-gray-900">
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
                    <section className="bg-white rounded-2xl shadow-sm flex flex-col h-[720px]">
                        {/* TOOLBAR */}
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <select
                                value={language}
                                onChange={(e) => {
                                    const lang =
                                        e.target.value as Language;
                                    setLanguage(lang);
                                    setCode(getTemplate(lang));
                                }}
                                className="border rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="python">Python</option>
                            </select>

                            <div className="flex gap-2">
                                <ActionButton
                                    icon={<Play size={16} />}
                                    label={
                                        running
                                            ? "Running..."
                                            : "Run"
                                    }
                                    variant="primary"
                                    onClick={handleRun}
                                    disabled={running}
                                />
                                <ActionButton
                                    icon={<CheckCircle size={16} />}
                                    label={submitting ? "Submitting..." : "Submit"}
                                    variant="success"
                                    onClick={handleSubmit}
                                    disabled={submitting || running}
                                />
                            </div>
                        </div>

                        {/* CODE EDITOR */}
                        <div className="flex-1 overflow-hidden">
                            <Editor
                                language={language}
                                value={code}
                                onChange={(v) =>
                                    setCode(v || "")
                                }
                                theme="vs-light"
                                options={{
                                    fontSize: 14,
                                    minimap: {
                                        enabled: false,
                                    },
                                    wordWrap: "on",
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
                            <div className="border-t p-4 space-y-4 overflow-y-auto max-h-72">
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
                                                        label="Stderr"
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {children}
        </div>
    );
}

function DifficultyBadge({
    difficulty,
}: {
    difficulty: Difficulty;
}) {
    const styles = {
        easy: "bg-green-50 text-green-600",
        medium: "bg-yellow-50 text-yellow-600",
        hard: "bg-red-50 text-red-600",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${styles[difficulty]}`}
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

function ActionButton({
    icon,
    label,
    variant,
    onClick,
    disabled,
}: {
    icon: React.ReactNode;
    label: string;
    variant?: "primary" | "success";
    onClick?: () => void;
    disabled?: boolean;
}) {
    const base =
        "flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition";

    const styles =
        variant === "primary"
            ? "bg-gray-900 text-white"
            : "bg-green-600 text-white";

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${base} ${styles} ${disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
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
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cout << "Hello World!";
    return 0;
}`;
        case "java":
            return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`;
        case "python":
            return `print("Hello World!")`;
    }
}
