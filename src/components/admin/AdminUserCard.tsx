import { User as UserIcon, Trash2, RotateCcw } from "lucide-react";
import type { User } from "@/services/api/user.types";

interface Props {
    user: User;
    checked: boolean;
    onCheck: (checked: boolean) => void;
    onDelete: () => void;
    onRestore: () => void;
    onClick: () => void;
}

export default function AdminUserCard({
    user,
    checked,
    onCheck,
    onDelete,
    onRestore,
    onClick
}: Props) {
    const isInactive = user.isActive === false;
    return (
        <div
            onClick={onClick}
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
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onCheck(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
            />

            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {user.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className={`w-full h-full object-cover rounded-full ${isInactive ? "grayscale" : ""
                            }`}
                    />
                ) : (
                    <UserIcon className="text-gray-400" size={20} />
                )}
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0 flex items-center gap-4">
                <p className="font-medium text-gray-900 truncate w-1/3">
                    {user.username}
                </p>

                <p className="text-sm text-gray-600 truncate w-2/3 text-right">
                    {user.email || "Chưa có email"}
                </p>
            </div>


            {/* STATUS */}
            <span
                className={`
                    px-2 py-1 rounded-lg text-xs font-medium w-20 text-center
                    ${isInactive
                        ? "bg-gray-100 text-gray-500"
                        : "bg-green-50 text-green-600"
                    }
                `}
                style={{ marginRight: 10 }}
            >
                {isInactive ? "Đã khóa" : "Hoạt động"}
            </span>

            {/* ACTIONS */}
            <div className="flex gap-2" style={{ marginRight: 20 }}>
                {isInactive ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRestore();
                        }}
                        className="px-3 py-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100"
                    >
                        <RotateCcw size={16} />
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
