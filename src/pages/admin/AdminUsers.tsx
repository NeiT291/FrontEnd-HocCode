import { useCallback, useEffect, useRef, useState } from "react";

import AdminUserCard from "@/components/admin/AdminUserCard";
import SearchBar from "@/components/admin/SearchBar";

import {
    getAllUsers,
    deleteUsers,
    restoreUsers,
} from "@/services/api/admin.service";
import type { User } from "@/services/api/user.types";
import UserDetailModal from "@/components/admin/UserDetailModal";

/* ================= CONSTANT ================= */

const PAGE_SIZE = 10;
type UserStatusFilter = "all" | "active" | "inactive";

/* ================= PAGE ================= */

export default function AdminUsers() {
    const mountedRef = useRef(true);

    /* ===== STATE ===== */
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    // 🔥 selection theo username
    const [selectedActiveUsernames, setSelectedActiveUsernames] =
        useState<string[]>([]);
    const [selectedInactiveUsernames, setSelectedInactiveUsernames] =
        useState<string[]>([]);

    const [statusFilter, setStatusFilter] =
        useState<UserStatusFilter>("all");

    const activeUsernames = users
        .filter((u) => u.isActive !== false)
        .map((u) => u.username);

    /* ================= FETCH ================= */

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const isActiveParam: boolean | undefined =
                statusFilter === "active"
                    ? true
                    : statusFilter === "inactive"
                        ? false
                        : undefined;

            const res = await getAllUsers(
                page,
                PAGE_SIZE,
                keyword,
                isActiveParam
            );

            if (!mountedRef.current) return;

            setUsers(res.data);
            setTotalPages(res.total_pages);

            // reset selection
            setSelectedActiveUsernames([]);
            setSelectedInactiveUsernames([]);
        } catch (err: unknown) {
            if (mountedRef.current) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Có lỗi xảy ra"
                );
            }
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [page, keyword, statusFilter]);

    useEffect(() => {
        mountedRef.current = true;
        fetchUsers();
        return () => {
            mountedRef.current = false;
        };
    }, [fetchUsers]);

    /* ================= HANDLERS ================= */

    const handleCheck = (user: User, checked: boolean) => {
        if (user.isActive === false) {
            setSelectedInactiveUsernames((prev) =>
                checked
                    ? [...prev, user.username]
                    : prev.filter((u) => u !== user.username)
            );
        } else {
            setSelectedActiveUsernames((prev) =>
                checked
                    ? [...prev, user.username]
                    : prev.filter((u) => u !== user.username)
            );
        }
    };

    /* ===== DELETE ===== */

    const handleDeleteSelected = async () => {
        if (selectedActiveUsernames.length === 0) return;

        if (
            !confirm(
                `Bạn có chắc chắn muốn khóa ${selectedActiveUsernames.length} người dùng?`
            )
        ) {
            return;
        }

        try {
            await deleteUsers(selectedActiveUsernames);
            fetchUsers();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Khóa người dùng thất bại"
            );
        }
    };

    /* ===== RESTORE ===== */

    const handleRestoreSelected = async () => {
        if (selectedInactiveUsernames.length === 0) return;

        if (
            !confirm(
                `Bạn có chắc chắn muốn mở khóa ${selectedInactiveUsernames.length} người dùng?`
            )
        ) {
            return;
        }

        try {
            await restoreUsers(selectedInactiveUsernames);
            fetchUsers();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Mở khóa người dùng thất bại"
            );
        }
    };

    const handleSearch = (value: string) => {
        setPage(1);
        setKeyword(value);
    };

    const handleChangeFilter = (value: UserStatusFilter) => {
        setPage(1);
        setStatusFilter(value);
    };

    /* ================= RENDER ================= */

    return (
        <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý người dùng
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Danh sách toàn bộ người dùng
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            handleChangeFilter(
                                e.target.value as UserStatusFilter
                            )
                        }
                        className="h-10 px-3 rounded-xl border bg-white"
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Đã khóa</option>
                    </select>
                    <SearchBar
                        placeholder="Tìm theo username..."
                        onSearch={handleSearch}
                    />



                    {selectedInactiveUsernames.length > 0 && (
                        <button
                            onClick={handleRestoreSelected}
                            className="px-4 py-2 rounded-xl bg-green-600 text-white"
                        >
                            Mở khóa ({selectedInactiveUsernames.length})
                        </button>
                    )}

                    {selectedActiveUsernames.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="px-4 py-2 rounded-xl bg-red-600 text-white"
                        >
                            Khóa ({selectedActiveUsernames.length})
                        </button>
                    )}
                </div>
            </div>

            {/* ===== ERROR ===== */}
            {error && (
                <div className="bg-white rounded-2xl p-4 text-red-600 shadow">
                    {error}
                </div>
            )}

            {/* ===== CONTENT ===== */}
            {loading ? (
                <div className="bg-white rounded-2xl p-6 shadow animate-pulse h-40" />
            ) : users.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow">
                    Không tìm thấy người dùng nào
                </div>
            ) : (
                <>
                    {/* LIST HEADER */}
                    <div className="flex items-center gap-4 px-4 py-2 text-sm text-gray-500 bg-gray-50 border rounded-t-xl mb-0">
                        {/* LEFT */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <input
                                type="checkbox"
                                checked={
                                    activeUsernames.length > 0 &&
                                    selectedActiveUsernames.length === activeUsernames.length
                                }
                                onChange={(e) =>
                                    setSelectedActiveUsernames(
                                        e.target.checked ? activeUsernames : []
                                    )
                                }
                                className="w-4 h-4 accent-blue-600"
                            />

                            <div className="w-10">Avatar</div>

                            <div className="flex-1 truncate">Username</div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4">
                            <div className="w-56 text-right">Email</div>
                            <div className="w-30 text-right">Trạng thái</div>
                            <div className="w-20 text-center">Hành động</div>
                        </div>
                    </div>


                    <div className="bg-white rounded-b-xl shadow divide-y">
                        {users.map((user) => (
                            <AdminUserCard
                                key={user.username}
                                user={user}
                                checked={
                                    user.isActive === false
                                        ? selectedInactiveUsernames.includes(
                                            user.username
                                        )
                                        : selectedActiveUsernames.includes(
                                            user.username
                                        )
                                }
                                onCheck={(checked) =>
                                    handleCheck(user, checked)
                                }
                                onDelete={() =>
                                    deleteUsers([user.username]).then(
                                        fetchUsers
                                    )
                                }
                                onRestore={() =>
                                    restoreUsers([user.username]).then(
                                        fetchUsers
                                    )
                                }
                                onClick={() => setSelectedUser(user)}
                            />
                        ))}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-3 pt-4">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <span className="text-sm text-gray-600">
                                Trang {page} / {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                    {selectedUser && (
                        <UserDetailModal
                            user={selectedUser}
                            onClose={() => setSelectedUser(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
}
