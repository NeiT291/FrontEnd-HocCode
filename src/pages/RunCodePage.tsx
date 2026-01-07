import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
    Play,
    Terminal,
    Trash2,
} from "lucide-react";

import { runCodeApi } from "@/services/api/runcode.service";

type Language = "cpp" | "java" | "python";

export default function RunCodePage() {
    const [language, setLanguage] = useState<Language>("cpp");
    const [code, setCode] = useState(getTemplate("cpp"));

    const [output, setOutput] = useState<string>("");
    const [meta, setMeta] = useState<string>("");
    const [running, setRunning] = useState(false);
    const [error, setError] = useState<string>("");

    const handleRun = async () => {
        setRunning(true);
        setOutput("");
        setError("");
        setMeta("");

        try {
            const result = await runCodeApi(language, code);

            if (result.stderr) {
                setError(result.stderr);
            }

            setOutput(result.stdout || "(Không có output)");

            setMeta(
                `Exit code: ${result.exitCode} | Time: ${result.timeMs} ms | Memory: ${result.memoryMb} MB`
            );
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Run code error");
            }
        } finally {
            setRunning(false);
        }
    };

    const handleClearOutput = () => {
        setOutput("");
        setError("");
        setMeta("");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <section className="bg-gray-700 rounded-2xl shadow-sm flex flex-col h-[760px]">
                    {/* ================= TOOLBAR ================= */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
                        <select
                            value={language}
                            onChange={(e) => {
                                const lang = e.target.value as Language;
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
                                disabled={running}
                                onClick={handleRun}
                            />
                        </div>
                    </div>

                    {/* ================= EDITOR ================= */}
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            language={language}
                            value={code}
                            onChange={(v) => setCode(v || "")}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                            }}
                        />
                    </div>

                    {/* ================= OUTPUT ================= */}
                    <div className="border-t border-gray-600 bg-gray-900 text-gray-100">
                        <div className="flex items-center justify-between px-4 py-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} />
                                <span>Output</span>
                            </div>

                            <button
                                onClick={handleClearOutput}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200"
                            >
                                <Trash2 size={14} />
                                Clear
                            </button>
                        </div>

                        <div className="px-4 pb-4 space-y-2 max-h-48 overflow-auto">
                            {error && (
                                <pre className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                                    {error}
                                </pre>
                            )}

                            <pre className="text-sm font-mono whitespace-pre-wrap">
                                {output || (
                                    <span className="text-gray-500">
                                        Chưa có output
                                    </span>
                                )}
                            </pre>

                            {meta && (
                                <div className="text-xs text-gray-400">
                                    {meta}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

/* ================= BUTTON ================= */

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
        "flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition active:scale-95";

    const styles =
        variant === "primary"
            ? "bg-gray-900 text-white hover:bg-gray-800"
            : variant === "success"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border hover:bg-gray-50";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${styles} ${disabled ? "opacity-60 cursor-not-allowed" : ""
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

/* ================= TEMPLATE ================= */

function getTemplate(lang: Language) {
    switch (lang) {
        case "cpp":
            return `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "HelloWorld";
    return 0;
}`;
        case "java":
            return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("HelloWorld");
    }
}`;
        case "python":
            return `print("HelloWorld")`;
    }
}
