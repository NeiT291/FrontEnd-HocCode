import type { Contest } from "@/services/api/contest.types";
import {
    Pencil,
    Trash2,
    RotateCcw,
    Trophy,
} from "lucide-react";

interface Props {
    contest: Contest;
    checked: boolean;
    onCheck: (id: number, checked: boolean) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onRestore: (id: number) => void;
    deleting?: boolean;
    restoring?: boolean;
}

export default function AdminContestCard({
    contest,
    checked,
    onCheck,
    onEdit,
    onDelete,
    onRestore,
    deleting = false,
    restoring = false,
}: Props) {
    const isInactive = contest.isActive === false;

    return (
        <div
            className={`
                flex items-center gap-4 px-4 py-3
                transition
                ${isInactive ? "opacity-60" : "hover:bg-gray-50"}
            `}
        >
            {/* CHECKBOX */}
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                    onCheck(contest.id, e.target.checked)
                }
                className="w-4 h-4 accent-blue-600"
            />

            {/* THUMBNAIL */}
            <div className="w-24 h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {contest.thumbnailUrl ? (
                    <img
                        src={contest.thumbnailUrl}
                        alt={contest.title}
                        className={`w-full h-full object-cover ${isInactive ? "grayscale" : ""
                            }`}
                    />
                ) : (
                    <Trophy className="text-gray-400" size={22} />
                )}
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                    {contest.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-1">
                    {contest.description || "Chưa có mô tả"}
                </p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-1 w-28 text-center">
                {contest.totalUserEnroll}
            </p>
            {/* STATUS */}
            <span
                className={`
                    px-2 py-1 rounded-lg text-xs font-medium
                    ${isInactive
                        ? "bg-gray-100 text-gray-500"
                        : "bg-green-50 text-green-600"}
                `}
            >
                {isInactive ? "Vô hiệu" : "Hoạt động"}
            </span>

            {/* ACTIONS */}
            <div className="flex gap-2">
                {isInactive ? (
                    <button
                        onClick={() => onRestore(contest.id)}
                        disabled={restoring}
                        className="px-3 py-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 text-sm"
                        style={{ marginLeft: 55 }}
                    >
                        <RotateCcw size={16} />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => onEdit(contest.id)}
                            className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(contest.id)}
                            disabled={deleting}
                            className="px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm"
                        >
                            <Trash2 size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
