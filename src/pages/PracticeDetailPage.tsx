import { useParams } from "react-router-dom";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
    Play,
    CheckCircle,
    Clock,
    Database,
} from "lucide-react";

/* ================= TYPES ================= */

type Difficulty = "easy" | "medium" | "hard";
type Language = "cpp" | "java" | "python";

/* ================= MOCK DATA ================= */

const practice = {
    id: 1,
    title: "Tính tổng hai số",
    difficulty: "easy" as Difficulty,
    description:
        "Viết chương trình nhập vào hai số nguyên A và B. In ra tổng của hai số đó.",
    timeLimit: "1s",
    memoryLimit: "256MB",
    testCases: [
        { input: "1 2", output: "3" },
        { input: "10 20", output: "30" },
    ],
};

/* ================= PAGE ================= */

export default function PracticeDetailPage() {
    const { id } = useParams();

    const [language, setLanguage] = useState<Language>("cpp");
    const [code, setCode] = useState(getTemplate("cpp"));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ================= PROBLEM ================= */}
                    <section className="bg-white rounded-2xl shadow-sm p-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {practice.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            <DifficultyBadge difficulty={practice.difficulty} />
                            <Meta icon={<Clock size={14} />} text={practice.timeLimit} />
                            <Meta icon={<Database size={14} />} text={practice.memoryLimit} />
                        </div>

                        <p className="mt-6 text-gray-700 leading-relaxed">
                            {practice.description}
                        </p>

                        {/* Test cases */}
                        <div className="mt-10">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Test case mẫu
                            </h2>

                            <div className="space-y-4">
                                {practice.testCases.map((tc, i) => (
                                    <TestCase
                                        key={i}
                                        index={i + 1}
                                        input={tc.input}
                                        output={tc.output}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ================= EDITOR ================= */}
                    <section className="bg-white rounded-2xl shadow-sm flex flex-col h-[680px]">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <select
                                value={language}
                                onChange={(e) => {
                                    const lang = e.target.value as Language;
                                    setLanguage(lang);
                                    setCode(getTemplate(lang));
                                }}
                                className="border rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-900/10"
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

                        {/* Monaco Editor */}
                        <div className="flex-1 overflow-hidden rounded-b-2xl">
                            <Editor
                                language={language}
                                value={code}
                                onChange={(v) => setCode(v || "")}
                                theme="vs-light"
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    tabSize: 2,
                                    insertSpaces: true,
                                    automaticLayout: true,
                                    scrollBeyondLastLine: false,
                                    wordWrap: "on",
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
        <div className="rounded-xl border bg-white overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b">
                <span className="text-sm font-semibold text-gray-700">
                    Test case #{index}
                </span>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <p className="text-xs font-medium text-gray-500 mb-1">
                {label}
            </p>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 text-sm font-mono overflow-x-auto">
                {value}
            </pre>
        </div>
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