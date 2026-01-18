import { Pencil, Trash2, RotateCcw } from "lucide-react";
import type { Problem } from "@/services/api/problem.types";
interface Props {
    problem: Problem;
    checked: boolean;
    onCheck: (id: number, checked: boolean) => void;
    onEdit: (problem: Problem) => void;
    onDelete: (id: number) => void;
    onRestore: (id: number) => void;
}

export default function AdminPracticeCard({
    problem,
    checked,
    onCheck,
    onEdit,
    onDelete,
    onRestore,
}: Props) {
    const isInactive = problem.isActive === false;

    return (
        <div
            className={`
                flex items-center gap-4 px-4 py-3
                border-b last:border-b-0
                ${isInactive ? "opacity-60" : "hover:bg-gray-50"}
            `}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                    onCheck(problem.id, e.target.checked)
                }
                className="w-4 h-4 accent-blue-600"
            />

            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                    {problem.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-1">
                    {problem.description || "Chưa có mô tả"}
                </p>
            </div>

            <span
                className={`px-2 py-1 text-xs rounded-lg ${isInactive
                    ? "bg-gray-100 text-gray-500"
                    : "bg-green-50 text-green-600"
                    }`}
            >
                {isInactive ? "Vô hiệu" : "Hoạt động"}
            </span>

            <div className="flex gap-2">
                {isInactive ? (
                    <button
                        onClick={() => onRestore(problem.id)}
                        className="px-3 py-2 text-sm rounded-xl bg-green-50 text-green-600"
                        style={{ marginLeft: 55 }}
                    >
                        <RotateCcw size={16} />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => onEdit(problem)}
                            className="px-3 py-2 text-sm rounded-xl bg-blue-50 text-blue-600"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(problem.id)}
                            className="px-3 py-2 text-sm rounded-xl bg-red-50 text-red-600"
                        >
                            <Trash2 size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
