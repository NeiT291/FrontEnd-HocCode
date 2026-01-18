import { X, User as UserIcon } from "lucide-react";
import type { User } from "@/services/api/user.types";

interface Props {
    user: User;
    onClose: () => void;
}

export default function UserDetailModal({ user, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl relative" onClick={(e) => e.stopPropagation()}>
                {/* ===== HEADER ===== */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Thông tin người dùng
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ===== BODY ===== */}
                <div className="p-6 space-y-6">
                    {/* AVATAR */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon className="text-gray-400" size={28} />
                            )}
                        </div>

                        <div>
                            <p className="font-semibold text-gray-900">
                                {user.displayName || "Chưa đặt tên"}
                            </p>
                            <p className="text-sm text-gray-600">
                                @{user.username}
                            </p>
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="space-y-3 text-sm">
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Số điện thoại" value={user.phone} />
                        <InfoRow label="Ngày sinh" value={user.dob} />
                        <InfoRow label="Địa chỉ" value={user.address} />
                        <InfoRow
                            label="Trạng thái"
                            value={user.isActive ? "Hoạt động" : "Đã khóa"}
                        />
                    </div>

                    {/* BIO */}
                    {user.bio && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Giới thiệu
                            </p>
                            <p className="text-sm text-gray-600 whitespace-pre-line">
                                {user.bio}
                            </p>
                        </div>
                    )}

                    {/* META */}
                    <div className="pt-4 border-t text-xs text-gray-500 flex justify-between">
                        <span>
                            Tạo lúc:{" "}
                            {new Date(user.createdAt).toLocaleString()}
                        </span>
                        <span>
                            Cập nhật:{" "}
                            {new Date(user.updatedAt).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== SUB COMPONENT ===== */

function InfoRow({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-gray-500">{label}</span>
            <span className="text-gray-900 text-right">
                {value || "—"}
            </span>
        </div>
    );
}
