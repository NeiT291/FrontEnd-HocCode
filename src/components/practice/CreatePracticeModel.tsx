import { useState } from "react";
import { Code, Plus, Trash2, X } from "lucide-react";
import type { Problem, Testcase } from "@/services/api/problem.types";
import { createProblem } from "@/services/api/problem.service";

interface Props {
    contestId?: number;
    moduleId?: number;
    isTheory: boolean;
    onClose: () => void;
    onSubmit: (practice: Problem) => void;
}

/* ================= COMPONENT ================= */

export default function CreatePracticeModal({
    contestId,
    moduleId,
    isTheory,
    onClose,
    onSubmit,
}: Props) {
    /* ================= BASIC ================= */

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [difficulty, setDifficulty] =
        useState<"EASY" | "MEDIUM" | "HARD">("EASY");

    const [timeLimitMs, setTimeLimitMs] = useState(1000);
    const [memoryLimitKb, setMemoryLimitKb] = useState(262144);

    const [testcases, setTestcases] = useState<Testcase[]>([]);
    const [submitting, setSubmitting] = useState(false);

    /* ================= HELPERS ================= */

    const mapDifficulty = (
        d: "EASY" | "MEDIUM" | "HARD"
    ): "easy" | "medium" | "hard" =>
        d.toLowerCase() as "easy" | "medium" | "hard";

    /* ================= TESTCASE ================= */

    const addTestcase = () => {
        setTestcases((prev) => [
            ...prev,
            { input: "", expectedOutput: "", isSample: true, position: 0 },
        ]);
    };

    const updateTestcase = (
        index: number,
        field: "input" | "expectedOutput",
        value: string
    ) => {
        setTestcases((prev) =>
            prev.map((tc, i) =>
                i === index ? { ...tc, [field]: value } : tc
            )
        );
    };

    const removeTestcase = (index: number) => {
        setTestcases((prev) => prev.filter((_, i) => i !== index));
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async () => {
        if (!title.trim() || submitting) return;

        try {
            setSubmitting(true);

            const createdProblem = await createProblem({
                title: title.trim(),
                contestId: contestId,
                moduleId: moduleId,
                description,
                timeLimitMs,
                memoryLimitKb,
                difficulty: mapDifficulty(difficulty),
                isTheory: isTheory,
                isPublic: true,
                testcases: testcases.map<Testcase>((tc, index) => ({
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    isSample: true,
                    position: index,
                    active: true,
                })),
            });

            onSubmit(createdProblem);
            onClose();
        } catch (error) {
            console.error("Create practice error:", error);
            alert("Tạo bài luyện tập thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= RENDER ================= */

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl space-y-6">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Code />
                        <h3 className="text-lg font-semibold">
                            Tạo bài luyện tập
                        </h3>
                    </div>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* TITLE */}
                <div>
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ví dụ: Tính tổng hai số"
                        className="w-full mt-1 px-4 py-2.5 border rounded-xl"
                    />
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="text-sm font-medium">Mô tả</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Mô tả yêu cầu bài toán"
                        className="w-full mt-1 px-4 py-2.5 border rounded-xl resize-none"
                    />
                </div>

                {/* CONFIG */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium">Độ khó</label>
                        <select
                            value={difficulty}
                            onChange={(e) =>
                                setDifficulty(
                                    e.target.value as
                                    | "EASY"
                                    | "MEDIUM"
                                    | "HARD"
                                )
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-xl"
                        >
                            <option value="EASY">Dễ</option>
                            <option value="MEDIUM">Trung bình</option>
                            <option value="HARD">Khó</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Time (ms)
                        </label>
                        <input
                            type="number"
                            value={timeLimitMs}
                            onChange={(e) =>
                                setTimeLimitMs(Number(e.target.value))
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Memory (KB)
                        </label>
                        <input
                            type="number"
                            value={memoryLimitKb}
                            onChange={(e) =>
                                setMemoryLimitKb(Number(e.target.value))
                            }
                            className="w-full mt-1 px-3 py-2 border rounded-xl"
                        />
                    </div>
                </div>

                {/* TESTCASES */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Testcase</h4>
                        <button
                            onClick={addTestcase}
                            className="flex items-center gap-1 text-sm text-gray-600"
                        >
                            <Plus size={16} />
                            Thêm testcase
                        </button>
                    </div>

                    {testcases.map((tc, index) => (
                        <div
                            key={index}
                            className="border rounded-xl p-3 space-y-2"
                        >
                            <textarea
                                placeholder="Input"
                                value={tc.input}
                                onChange={(e) =>
                                    updateTestcase(
                                        index,
                                        "input",
                                        e.target.value
                                    )
                                }
                                rows={2}
                                className="w-full border rounded-lg px-2 py-1"
                            />
                            <textarea
                                placeholder="Expected output"
                                value={tc.expectedOutput}
                                onChange={(e) =>
                                    updateTestcase(
                                        index,
                                        "expectedOutput",
                                        e.target.value
                                    )
                                }
                                rows={2}
                                className="w-full border rounded-lg px-2 py-1"
                            />
                            <button
                                onClick={() => removeTestcase(index)}
                                className="text-xs text-red-500 flex items-center gap-1"
                            >
                                <Trash2 size={14} />
                                Xóa testcase
                            </button>
                        </div>
                    ))}

                    {testcases.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Chưa có testcase
                        </p>
                    )}
                </div>

                {/* ACTION */}
                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onClose}>Hủy</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim() || submitting}
                        className="px-5 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-50"
                    >
                        {submitting ? "Đang tạo..." : "Tạo bài luyện tập"}
                    </button>
                </div>
            </div>
        </div>
    );
}
