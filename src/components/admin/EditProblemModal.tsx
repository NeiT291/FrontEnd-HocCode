import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Problem, Testcase } from "@/services/api/problem.types";

interface Props {
    problem: Problem;
    onClose: () => void;
    onSubmit: (problem: Problem) => void;
}

export default function EditProblemModal({
    problem,
    onClose,
    onSubmit,
}: Props) {
    const [form, setForm] = useState<Problem>({
        ...problem,
        testcases: problem.testcases.map((tc) => ({ ...tc })),
    });

    /* ================= HELPERS ================= */

    function updateProblemField<K extends keyof Problem>(
        key: K,
        value: Problem[K]
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function updateTestcaseField<
        K extends keyof Testcase
    >(index: number, key: K, value: Testcase[K]) {
        setForm((prev) => {
            const next = [...prev.testcases];
            next[index] = { ...next[index], [key]: value };
            return { ...prev, testcases: next };
        });
    }

    function addTestcase() {
        const newTestcase: Testcase = {
            input: "",
            expectedOutput: "",
            isSample: false,
            position: form.testcases.length + 1,
        };

        setForm((prev) => ({
            ...prev,
            testcases: [...prev.testcases, newTestcase],
        }));
    }

    function removeTestcase(index: number) {
        setForm((prev) => ({
            ...prev,
            testcases: prev.testcases
                .filter((_, i) => i !== index)
                .map((tc, i) => ({ ...tc, position: i + 1 })),
        }));
    }

    /* ================= RENDER ================= */

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="
                    bg-white w-full max-w-4xl
                    max-h-[90vh]
                    rounded-2xl shadow-xl
                    flex flex-col
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* ================= HEADER (FIXED) ================= */}
                <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
                    <h2 className="text-lg font-semibold">
                        Chỉnh sửa bài luyện tập
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ================= BODY (SCROLL) ================= */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* TITLE */}
                    <Field label="Tiêu đề">
                        <input
                            value={form.title}
                            onChange={(e) =>
                                updateProblemField(
                                    "title",
                                    e.target.value
                                )
                            }
                            className="w-full px-4 py-2 rounded-xl border"
                        />
                    </Field>

                    {/* DESCRIPTION */}
                    <Field label="Mô tả">
                        <textarea
                            rows={4}
                            value={form.description}
                            onChange={(e) =>
                                updateProblemField(
                                    "description",
                                    e.target.value
                                )
                            }
                            className="w-full px-4 py-2 rounded-xl border resize-none"
                        />
                    </Field>

                    {/* SETTINGS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <NumberField
                            label="Time limit (ms)"
                            value={form.timeLimitMs}
                            onChange={(v) =>
                                updateProblemField("timeLimitMs", v)
                            }
                        />

                        <NumberField
                            label="Memory (KB)"
                            value={form.memoryLimitKb}
                            onChange={(v) =>
                                updateProblemField("memoryLimitKb", v)
                            }
                        />

                        <Field label="Độ khó">
                            <select
                                value={form.difficulty}
                                onChange={(e) =>
                                    updateProblemField(
                                        "difficulty",
                                        e.target
                                            .value as Problem["difficulty"]
                                    )
                                }
                                className="w-full px-3 py-2 rounded-xl border"
                            >
                                <option value="easy">Dễ</option>
                                <option value="medium">
                                    Trung bình
                                </option>
                                <option value="hard">Khó</option>
                            </select>
                        </Field>


                    </div>

                    {/* TESTCASES */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">
                                Testcases
                            </h3>
                            <button
                                onClick={addTestcase}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm"
                            >
                                <Plus size={16} />
                                Thêm testcase
                            </button>
                        </div>

                        <div className="space-y-4">
                            {form.testcases.map((tc, index) => (
                                <div
                                    key={index}
                                    className="border rounded-xl p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            #{index + 1}
                                        </span>
                                        <button
                                            onClick={() =>
                                                removeTestcase(index)
                                            }
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <textarea
                                        rows={3}
                                        value={tc.input}
                                        placeholder="Input"
                                        onChange={(e) =>
                                            updateTestcaseField(
                                                index,
                                                "input",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                                    />

                                    <textarea
                                        rows={3}
                                        value={tc.expectedOutput}
                                        placeholder="Expected output"
                                        onChange={(e) =>
                                            updateTestcaseField(
                                                index,
                                                "expectedOutput",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                                    />

                                    <Checkbox
                                        label="Sample"
                                        checked={tc.isSample}
                                        onChange={(v) =>
                                            updateTestcaseField(
                                                index,
                                                "isSample",
                                                v
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ================= FOOTER (FIXED) ================= */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onSubmit(form)}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ================= SUB COMPONENTS ================= */

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="text-sm font-medium block mb-1">
                {label}
            </label>
            {children}
        </div>
    );
}

function NumberField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) {
    return (
        <Field label={label}>
            <input
                type="number"
                value={value}
                onChange={(e) =>
                    onChange(Number(e.target.value))
                }
                className="w-full px-3 py-2 rounded-xl border"
            />
        </Field>
    );
}

function Checkbox({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <label className="flex items-center gap-2 text-sm">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
            />
            {label}
        </label>
    );
}
