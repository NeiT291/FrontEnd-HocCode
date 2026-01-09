import { useState } from "react";
import { BookOpen, Code } from "lucide-react";
import { deleteTestcase, modifyLesson } from "@/services/api/problem.service";
import type { Problem } from "@/services/api/course.types";
import { toast } from "react-hot-toast";
/* ================= TYPES ================= */

type LessonType = "THEORY" | "PRACTICE";
type TestcaseForm = {
    id: number;              // frontend only
    input: string;
    expectedOutput: string;
};
/* ================= COMPONENT ================= */

function EditLessonModal({
    lesson,
    onClose,
    onSuccess,
}: {
    lesson: Problem;
    onClose: () => void;
    onSuccess?: () => void;
}) {
    const [type, setType] = useState<LessonType>(
        lesson.isTheory ? "THEORY" : "PRACTICE"
    );
    const [title, setTitle] = useState(lesson.title);
    const [description, setDescription] = useState(lesson.description ?? "");

    const [timeLimitMs, setTimeLimitMs] = useState(lesson.timeLimitMs ?? 1000);
    const [memoryLimitKb, setMemoryLimitKb] = useState(lesson.memoryLimitKb ?? 262144);

    const [testcases, setTestcases] = useState<TestcaseForm[]>(
        (lesson.testcases ?? []).map((tc) => ({
            id: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
        }))
    );

    /* ================= TESTCASE ================= */

    const addTestcase = () => {
        setTestcases((prev) => [
            ...prev,
            {
                id: 1,
                input: "",
                expectedOutput: "",
            },
        ]);
    };

    const updateTestcase = (
        id: number,
        field: "input" | "expectedOutput",
        value: string
    ) => {
        setTestcases((prev) =>
            prev.map((tc) =>
                tc.id === id ? { ...tc, [field]: value } : tc
            )
        );
    };

    const removeTestcase = (id: number) => {
        deleteTestcase(id);
        setTestcases((prev) => prev.filter((tc) => tc.id !== id));
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async () => {
        try {
            await modifyLesson({
                id: lesson.id,
                title,
                description,
                timeLimitMs: type === "PRACTICE" ? timeLimitMs : 0,
                memoryLimitKb: type === "PRACTICE" ? memoryLimitKb : 0,
                isTheory: type === "THEORY",
                testcases:
                    type === "PRACTICE"
                        ? testcases.map((tc, index) => ({
                            id: tc.id,
                            input: tc.input,
                            expectedOutput: tc.expectedOutput,
                            isSample: true,
                            position: index,
                        }))
                        : [],
            });

            toast.success("Cập nhật bài học thành công");
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Cập nhật bài học thất bại");
        }
    };

    const isSubmitDisabled =
        !title.trim() ||
        (type === "PRACTICE" && testcases.length === 0);

    /* ================= UI ================= */

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl space-y-6">
                <h3 className="text-lg font-semibold">Chỉnh sửa bài học</h3>

                {/* TYPE */}
                <div className="grid grid-cols-2 gap-4">
                    <LessonTypeCard
                        active={type === "THEORY"}
                        icon={<BookOpen />}
                        title="Lý thuyết"
                        description="Nội dung học tập"
                        onClick={() => setType("THEORY")}
                    />
                    <LessonTypeCard
                        active={type === "PRACTICE"}
                        icon={<Code />}
                        title="Thực hành"
                        description="Bài tập lập trình"
                        onClick={() => setType("PRACTICE")}
                    />
                </div>

                {/* BASIC INFO */}
                <input
                    placeholder="Tiêu đề bài học"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border"
                    style={{ marginBottom: "1rem" }}

                />

                <textarea
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border"
                    style={{ marginBottom: "1rem" }}
                />

                {/* PRACTICE CONFIG */}
                {type === "PRACTICE" && (
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="flex items-center">Time (ms)</span>
                            <input
                                type="number"
                                value={timeLimitMs}
                                onChange={(e) =>
                                    setTimeLimitMs(Number(e.target.value))
                                }
                                className="border px-3 py-2"
                                placeholder="Time (ms)"
                            />
                            <span className="flex items-center">Memory (KB)</span>
                            <input
                                type="number"
                                value={memoryLimitKb}
                                onChange={(e) =>
                                    setMemoryLimitKb(Number(e.target.value))
                                }
                                className="border px-3 py-2"
                                placeholder="Memory (KB)"
                            />
                        </div>

                        {/* TESTCASE LIST */}
                        <div className="space-y-3">
                            {testcases.map((tc, index) => (
                                <div
                                    key={tc.id}
                                    className="border p-3 space-y-2"
                                >
                                    <div className="text-sm font-medium">
                                        Testcase #{index + 1}
                                    </div>

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
                                        className="w-full border px-2 py-1"
                                        style={{ marginBottom: "0.2rem" }}
                                    />

                                    <input
                                        placeholder="Expected Output"
                                        value={tc.expectedOutput}
                                        onChange={(e) =>
                                            updateTestcase(
                                                tc.id,
                                                "expectedOutput",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border  px-2 py-1"
                                    />

                                    <button
                                        onClick={() => removeTestcase(tc.id)}
                                        className="text-xs text-red-500"
                                    >
                                        Xóa testcase
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={addTestcase}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                + Thêm testcase
                            </button>
                        </div>
                    </div>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Hủy</button>
                    <button
                        disabled={isSubmitDisabled}
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-50"
                    >
                        Sửa
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ================= SMALL CARD ================= */

function LessonTypeCard({
    active,
    icon,
    title,
    description,
    onClick,
}: {
    active: boolean;
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`border rounded-xl p-4 text-left ${active
                ? "border-gray-900 bg-gray-50"
                : "hover:bg-gray-50"
                }`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <div>
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-gray-500">
                        {description}
                    </div>
                </div>
            </div>
        </button>
    );
}

export default EditLessonModal;
