import { Pencil, Trash2, ImageOff, RotateCcw } from "lucide-react";

interface Props {
    course: {
        id: number;
        title: string;
        description?: string;
        thumbnailUrl?: string | null;
        isActive?: boolean;
    };
    checked: boolean;
    onCheck: (id: number, checked: boolean) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onRestore: (id: number) => void;
    deleting?: boolean;
    restoring?: boolean;
}

export default function AdminCourseCard({
    course,
    checked,
    onCheck,
    onEdit,
    onDelete,
    onRestore,
    deleting = false,
    restoring = false,
}: Props) {
    const isInactive = course.isActive === false;

    return (
        <div
            className={`
                flex items-center gap-4 px-4 py-3
                bg-white border-b last:border-b-0
                transition
                ${isInactive ? "opacity-60" : "hover:bg-gray-50"}
            `}
        >
            {/* ===== CHECKBOX (ALWAYS ENABLED) ===== */}
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                    onCheck(course.id, e.target.checked)
                }
                className="w-4 h-4 accent-blue-600"
            />

            {/* ===== THUMBNAIL ===== */}
            <div className="w-24 h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                {course.thumbnailUrl ? (
                    <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className={`w-full h-full object-cover ${isInactive ? "grayscale" : ""
                            }`}
                    />
                ) : (
                    <ImageOff className="text-gray-400" size={22} />
                )}
            </div>

            {/* ===== TITLE ===== */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                    {course.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-1">
                    {course.description || "Chưa có mô tả"}
                </p>
            </div>

            {/* ===== STATUS ===== */}
            <span
                className={`
                    px-2 py-1 rounded-lg text-xs font-medium shrink-0
                    ${isInactive
                        ? "bg-gray-100 text-gray-500"
                        : "bg-green-50 text-green-600"
                    }
                `}
            >
                {isInactive ? "Vô hiệu" : "Hoạt động"}
            </span>

            {/* ===== ACTIONS ===== */}
            <div className="flex gap-2 shrink-0">
                {isInactive ? (
                    <button
                        onClick={() => onRestore(course.id)}
                        disabled={restoring}
                        className="
                            flex items-center gap-2 px-3 py-2 rounded-xl
                            bg-green-50 text-green-600 hover:bg-green-100
                            text-sm disabled:opacity-50
                        "
                        style={{ marginLeft: 45 }}
                    >
                        <RotateCcw size={16} />
                        Khôi phục
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => onEdit(course.id)}
                            className="
                                flex items-center gap-2 px-3 py-2 rounded-xl
                                bg-blue-50 text-blue-600 hover:bg-blue-100
                                text-sm
                            "
                        >
                            <Pencil size={16} />
                            Sửa
                        </button>

                        <button
                            onClick={() => onDelete(course.id)}
                            disabled={deleting}
                            className="
                                flex items-center gap-2 px-3 py-2 rounded-xl
                                bg-red-50 text-red-600 hover:bg-red-100
                                text-sm disabled:opacity-50
                            "
                        >
                            <Trash2 size={16} />
                            Xóa
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
