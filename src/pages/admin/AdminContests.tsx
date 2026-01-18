import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminContestCard from "@/components/admin/AdminContestCard";
import SearchBar from "@/components/admin/SearchBar";

import {
    deleteContests,
    getAllContests,
    restoreContests,
} from "@/services/api/admin.service";
import type { Contest } from "@/services/api/contest.types";

/* ================= CONSTANT ================= */

const PAGE_SIZE = 10;
type ContestStatusFilter = "all" | "active" | "inactive";

/* ================= PAGE ================= */

export default function AdminContests() {
    const navigate = useNavigate();
    const mountedRef = useRef(true);

    /* ===== STATE ===== */
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [contests, setContests] = useState<Contest[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");

    const [selectedActiveIds, setSelectedActiveIds] = useState<number[]>([]);
    const [selectedInactiveIds, setSelectedInactiveIds] = useState<number[]>([]);

    const [statusFilter, setStatusFilter] =
        useState<ContestStatusFilter>("all");

    const activeContestIds = contests
        .filter((c) => c.isActive !== false)
        .map((c) => c.id);

    /* ================= FETCH ================= */

    const fetchContests = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const isActiveParam: boolean | undefined =
                statusFilter === "active"
                    ? true
                    : statusFilter === "inactive"
                        ? false
                        : undefined;

            const res = await getAllContests(
                page,
                PAGE_SIZE,
                keyword,
                isActiveParam
            );

            if (!mountedRef.current) return;

            setContests(res.data);
            setTotalPages(res.total_pages);
            setSelectedActiveIds([]);
            setSelectedInactiveIds([]);
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
        fetchContests();
        return () => {
            mountedRef.current = false;
        };
    }, [fetchContests]);

    /* ================= HANDLERS ================= */

    const handleEdit = (id: number) => {
        navigate(`/contests/edit/${id}`);
    };

    const handleCheck = (contest: Contest, checked: boolean) => {
        if (contest.isActive === false) {
            setSelectedInactiveIds((prev) =>
                checked
                    ? [...prev, contest.id]
                    : prev.filter((id) => id !== contest.id)
            );
        } else {
            setSelectedActiveIds((prev) =>
                checked
                    ? [...prev, contest.id]
                    : prev.filter((id) => id !== contest.id)
            );
        }
    };

    /* ===== DELETE ===== */

    const handleDeleteSelected = async () => {
        if (selectedActiveIds.length === 0) return;

        if (
            !confirm(
                `Bạn có chắc chắn muốn xóa ${selectedActiveIds.length} cuộc thi đã chọn?`
            )
        ) {
            return;
        }

        try {
            await deleteContests(selectedActiveIds);
            fetchContests();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Xóa cuộc thi thất bại"
            );
        }
    };

    /* ===== RESTORE ===== */

    const handleRestoreSelected = async () => {
        if (selectedInactiveIds.length === 0) return;

        if (
            !confirm(
                `Bạn có chắc chắn muốn khôi phục ${selectedInactiveIds.length} cuộc thi đã chọn?`
            )
        ) {
            return;
        }

        try {
            await restoreContests(selectedInactiveIds);
            fetchContests();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Khôi phục cuộc thi thất bại"
            );
        }
    };

    const handleSearch = (value: string) => {
        setPage(1);
        setKeyword(value);
    };

    const handleChangeFilter = (value: ContestStatusFilter) => {
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
                        Quản lý cuộc thi
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Danh sách toàn bộ cuộc thi
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            handleChangeFilter(
                                e.target.value as ContestStatusFilter
                            )
                        }
                        className="h-10 px-3 rounded-xl border bg-white"
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Chưa xóa</option>
                        <option value="inactive">Đã xóa</option>
                    </select>
                    <SearchBar
                        placeholder="Tìm cuộc thi..."
                        onSearch={handleSearch}
                    />



                    {selectedInactiveIds.length > 0 && (
                        <button
                            onClick={handleRestoreSelected}
                            className="px-4 py-2 rounded-xl bg-green-600 text-white"
                        >
                            Khôi phục ({selectedInactiveIds.length})
                        </button>
                    )}

                    {selectedActiveIds.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="px-4 py-2 rounded-xl bg-red-600 text-white"
                        >
                            Xóa ({selectedActiveIds.length})
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
            {/* ===== LIST HEADER ===== */}
            {!loading && contests.length > 0 && (
                <div className="flex items-center gap-4 px-4 py-2 text-sm text-gray-500 bg-gray-50 border rounded-t-xl mb-0">
                    <input
                        type="checkbox"
                        checked={
                            activeContestIds.length > 0 &&
                            selectedActiveIds.length === activeContestIds.length
                        }
                        onChange={(e) =>
                            setSelectedActiveIds(
                                e.target.checked ? activeContestIds : []
                            )
                        }
                        className="w-4 h-4 accent-blue-600"
                    />
                    <div className="w-24 text-center">Ảnh</div>
                    <div className="flex-1">Cuộc thi</div>
                    <div className="w-28 text-center">Người tham gia</div>
                    <div className="w-24 text-center">Trạng thái</div>
                    <div className="w-20 text-center">Hành động</div>
                </div>
            )}
            {/* ===== LIST ===== */}
            {loading ? (
                <div className="bg-white rounded-2xl p-6 shadow animate-pulse h-40" />
            ) : contests.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow">
                    Không tìm thấy cuộc thi nào
                </div>
            ) : (
                <>

                    <div className="bg-white rounded-xl shadow divide-y">
                        {contests.map((contest) => (
                            <AdminContestCard
                                key={contest.id}
                                contest={contest}
                                checked={
                                    contest.isActive === false
                                        ? selectedInactiveIds.includes(contest.id)
                                        : selectedActiveIds.includes(contest.id)
                                }
                                onCheck={(id, checked) =>
                                    handleCheck(contest, checked)
                                }
                                onEdit={handleEdit}
                                onDelete={() =>
                                    deleteContests([contest.id]).then(fetchContests)
                                }
                                onRestore={() =>
                                    restoreContests([contest.id]).then(fetchContests)
                                }
                            />
                        ))}
                    </div>
                    {/* ===== PAGINATION ===== */}
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
                </>
            )}
        </div>
    );
}
