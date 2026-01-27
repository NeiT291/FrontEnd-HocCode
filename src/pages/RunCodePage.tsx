import { useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Play, Terminal, Trash2 } from "lucide-react";

import { runCodeApi } from "@/services/api/runcode.service";

/* ================= TYPES ================= */

type Language = "cpp" | "java" | "python";

/* ================= CONSTANTS ================= */

const LANGUAGE_MAP: Record<Language, number> = {
    cpp: 54,
    java: 62,
    python: 71,
};

const MONACO_LANGUAGE_MAP: Record<Language, string> = {
    cpp: "cpp",
    java: "java",
    python: "python",
};

/* ================= PAGE ================= */

export default function RunCodePage() {
    const [language, setLanguage] = useState<Language>("cpp");
    const [code, setCode] = useState(getTemplate("cpp"));
    const [input, setInput] = useState("");

    const [output, setOutput] = useState("");
    const [meta, setMeta] = useState("");
    const [error, setError] = useState("");
    const [running, setRunning] = useState(false);

    /* ===== SYNTAX CHECK ===== */
    const monaco = useMonaco();
    const [hasSyntaxError, setHasSyntaxError] = useState(false);
    const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]);

    /* ================= SYNTAX MARKER LISTENER ================= */

    useEffect(() => {
        if (!monaco) return;
        const model = monaco.editor.getModels()[0];
        if (!model) return;

        const checkMarkers = () => {
            const markers = monaco.editor.getModelMarkers({
                resource: model.uri,
            });

            const errors = markers.filter(
                (m) => m.severity === monaco.MarkerSeverity.Error
            );

            setHasSyntaxError(errors.length > 0);
            setSyntaxErrors(
                errors.map(
                    (e) => `Line ${e.startLineNumber}: ${e.message}`
                )
            );
        };

        checkMarkers();

        const disposable = monaco.editor.onDidChangeMarkers(checkMarkers);
        return () => disposable.dispose();
    }, [monaco, language, code]);

    /* ================= RUN ================= */

    const handleRun = async () => {
        if (hasSyntaxError) return;

        setRunning(true);
        setOutput("");
        setError("");
        setMeta("");

        try {
            const result = await runCodeApi({
                languageId: LANGUAGE_MAP[language],
                sourceCode: code,
                input,
            });

            if (result.compileOutput) {
                setError(result.compileOutput);
            } else if (result.stderr) {
                setError(result.stderr);
            }
            setOutput(result.stdout || "(Không có output)");

            setMeta(
                `Status: ${result.status} | Time: ${result.time ?? "-"} s | Memory: ${result.memory ?? "-"} KB`
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Run code error");
        } finally {
            setRunning(false);
        }
    };

    const handleClearOutput = () => {
        setOutput("");
        setError("");
        setMeta("");
    };

    /* ================= RENDER ================= */

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-6">
                <section className="bg-gray-700 rounded-2xl shadow-sm flex flex-col h-[620px]">

                    {/* ===== TOOLBAR ===== */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-600">
                        <select
                            value={language}
                            onChange={(e) => {
                                const lang = e.target.value as Language;
                                setLanguage(lang);
                                setCode(getTemplate(lang));
                                setOutput("");
                                setError("");
                            }}
                            className="bg-gray-800 text-white rounded px-3 py-2 text-sm"
                        >
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                        </select>

                        <ActionButton
                            icon={<Play size={16} />}
                            label={
                                hasSyntaxError
                                    ? "Fix syntax errors"
                                    : running
                                        ? "Running..."
                                        : "Run"
                            }
                            variant="primary"
                            disabled={running || hasSyntaxError}
                            onClick={handleRun}
                        />
                    </div>

                    {/* ===== EDITOR ===== */}
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            language={MONACO_LANGUAGE_MAP[language]}
                            // language={"javascript"}
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

                    {/* ===== INPUT ===== */}
                    <div className="border-t border-gray-600 bg-gray-800 px-4 py-3">
                        <label className="text-xs text-gray-300 mb-1 block">
                            Input (stdin)
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={3}
                            className="w-full bg-gray-900 text-gray-100 rounded p-2 text-sm font-mono resize-none"
                        />
                    </div>

                    {/* ===== OUTPUT ===== */}
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

                            {syntaxErrors.length > 0 && (
                                <div className="bg-red-950 border border-red-700 rounded p-2">
                                    <div className="text-xs font-semibold text-red-400 mb-1">
                                        Syntax Errors
                                    </div>
                                    {syntaxErrors.map((e, i) => (
                                        <div
                                            key={i}
                                            className="text-red-400 text-xs font-mono"
                                        >
                                            {e}
                                        </div>
                                    ))}
                                </div>
                            )}

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
            return `a = int(input())
b = int(input())
print(a + b)`;
    }
}
