import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Problem, Testcase } from "@/services/api/course.types";
import { modifyProblem } from "@/services/api/problem.service";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

type UIDifficulty = "EASY" | "MEDIUM" | "HARD";
type ApiDifficulty = "easy" | "medium" | "hard";

interface Props {
    practice: Problem;
    onClose: () => void;
    onSubmit?: (data: Problem) => void;
}

/* ================= COMPONENT ================= */

export default function EditPracticeModal({
    practice,
    onClose,
    onSubmit,
}: Props) {
    /* ================= BASIC ================= */

    const [title, setTitle] = useState(practice.title);
    const [description, setDescription] = useState(
        practice.description ?? ""
    );

    const [difficulty, setDifficulty] = useState<UIDifficulty>(
        (practice.difficulty?.toUpperCase() as UIDifficulty) ??
        "EASY"
    );

    const [timeLimitMs, setTimeLimitMs] = useState(
        practice.timeLimitMs ?? 1000
    );
    const [memoryLimitKb, setMemoryLimitKb] = useState(
        practice.memoryLimitKb ?? 262144
    );

    const [testcases, setTestcases] = useState<Testcase[]>(
        practice.testcases ?? []
    );

    const [submitting, setSubmitting] = useState(false);

    /* ================= HELPERS ================= */

    const mapDifficultyToApi = (d: UIDifficulty): ApiDifficulty =>
        d.toLowerCase() as ApiDifficulty;

    /* ================= TESTCASE ================= */

    const addTestcase = () => {
        setTestcases((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(), // FE id tạm
                input: "",
                expectedOutput: "",
            },
        ]);
    };

    const updateTestcase = (
        id: number | string,
        field: "input" | "expectedOutput",
        value: string
    ) => {
        setTestcases((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, [field]: value } : t
            )
        );
    };

    const removeTestcase = (id: number | string) => {
        setTestcases((prev) => prev.filter((t) => t.id !== id));
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Tiêu đề không được để trống");
            return;
        }

        if (submitting) return;

        try {
            setSubmitting(true);

            const updatedProblem = await modifyProblem({
                id: practice.id,
                title: title.trim(),
                description,
                timeLimitMs,
                memoryLimitKb,
                difficulty: mapDifficultyToApi(difficulty),
                isPublic: true,
                testcases: testcases.map((tc) => ({
                    id:
                        typeof tc.id === "number"
                            ? tc.id
                            : undefined,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                })),
            });

            toast.success("Cập nhật bài luyện tập thành công");
            onSubmit?.(updatedProblem);
            onClose();
        } catch (error) {
            toast.error("Cập nhật thất bại, vui lòng thử lại");
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
                    <h3 className="text-lg font-semibold">
                        Chỉnh sửa bài luyện tập
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <X />
                    </button>
                </div>

                {/* BASIC */}
                <div className="space-y-4">
                    <input
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Tiêu đề"
                        className="w-full px-4 py-2 border"
                    />

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Mô tả"
                        rows={3}
                        className="w-full px-4 py-2 border"
                    />

                    {/* DIFFICULTY */}
                    <div className="flex gap-2">
                        {(
                            ["EASY", "MEDIUM", "HARD"] as UIDifficulty[]
                        ).map((d) => (
                            <button
                                key={d}
                                onClick={() =>
                                    setDifficulty(d)
                                }
                                className={`px-3 py-1 rounded-full text-sm
                                  ${difficulty === d
                                        ? d === "EASY"
                                            ? "bg-green-100 text-green-700"
                                            : d === "MEDIUM"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LIMIT */}
                <div className="flex gap-4 items-center">
                    <span className="font-medium">Time (ms)</span>
                    <input
                        type="number"
                        value={timeLimitMs}
                        onChange={(e) =>
                            setTimeLimitMs(
                                Number(e.target.value)
                            )
                        }
                        className="border px-3 py-2 rounded-xl w-40"
                    />
                    <span className="font-medium">
                        Memory (KB)
                    </span>
                    <input
                        type="number"
                        value={memoryLimitKb}
                        onChange={(e) =>
                            setMemoryLimitKb(
                                Number(e.target.value)
                            )
                        }
                        className="border px-3 py-2 rounded-xl w-40"
                    />
                </div>

                {/* TESTCASE */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Testcases</h4>
                        <button
                            onClick={addTestcase}
                            className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-900"
                        >
                            <Plus size={14} />
                            Thêm testcase
                        </button>
                    </div>

                    {testcases.map((tc) => (
                        <div
                            key={tc.id}
                            className="border p-3 space-y-2"
                        >
                            <input
                                placeholder="Input"
                                value={tc.input}
                                onChange={(e) =>
                                    updateTestcase(
                                        tc.id,
                                        "input",
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg px-2 py-1"
                            />

                            <input
                                placeholder="Output"
                                value={tc.expectedOutput}
                                onChange={(e) =>
                                    updateTestcase(
                                        tc.id,
                                        "expectedOutput",
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-lg px-2 py-1"
                            />

                            <button
                                onClick={() =>
                                    removeTestcase(tc.id)
                                }
                                className="text-xs text-red-500 flex items-center gap-1"
                            >
                                <Trash2 size={12} />
                                Xóa testcase
                            </button>
                        </div>
                    ))}
                </div>

                {/* ACTION */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-50"
                    >
                        {submitting
                            ? "Đang lưu..."
                            : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
}
