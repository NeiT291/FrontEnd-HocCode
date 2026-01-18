import { useCallback, useEffect, useRef, useState } from "react";

import AdminPracticeCard from "@/components/admin/AdminPracticeCard";
import SearchBar from "@/components/admin/SearchBar";

import {
    deleteProblems,
    getAllProblems,
    restoreProblems,
} from "@/services/api/admin.service";

import type { Problem } from "@/services/api/problem.types";
import EditProblemModal from "@/components/admin/EditProblemModal";

/* ================= CONSTANT ================= */

const PAGE_SIZE = 10;
type ProblemStatusFilter = "all" | "active" | "inactive";

/* ================= PAGE ================= */

export default function AdminProblems() {
    const mountedRef = useRef(true);

    /* ===== STATE ===== */
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [Problems, setProblems] = useState<Problem[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<ProblemStatusFilter>("all");
    const [editingProblem, setEditingProblem] =
        useState<Problem | null>(null);

    /* ===== SELECTION ===== */
    const [selectedActiveIds, setSelectedActiveIds] = useState<number[]>([]);
    const [selectedInactiveIds, setSelectedInactiveIds] = useState<number[]>([]);

    const activeProblemIds = Problems
        .filter((p) => p.isActive !== false)
        .map((p) => p.id);

    /* ================= FETCH ================= */

    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const isActiveParam: boolean | undefined =
                statusFilter === "active"
                    ? true
                    : statusFilter === "inactive"
                        ? false
                        : undefined;

            const res = await getAllProblems(
                page,
                PAGE_SIZE,
                keyword,
                isActiveParam
            );

            if (!mountedRef.current) return;

            setProblems(res.data);
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
        fetchProblems();
        return () => {
            mountedRef.current = false;
        };
    }, [fetchProblems]);

    /* ================= HANDLERS ================= */

    const handleEdit = (problem: Problem) => {
        setEditingProblem(problem);
    };


    const handleCheck = (Problem: Problem, checked: boolean) => {
        if (Problem.isActive === false) {
            setSelectedInactiveIds((prev) =>
                checked
                    ? [...prev, Problem.id]
                    : prev.filter((id) => id !== Problem.id)
            );
        } else {
            setSelectedActiveIds((prev) =>
                checked
                    ? [...prev, Problem.id]
                    : prev.filter((id) => id !== Problem.id)
            );
        }
    };

    /* ===== BULK DELETE ===== */

    const handleDeleteSelected = async () => {
        if (selectedActiveIds.length === 0) return;

        if (
            !confirm(
                `Bạn có chắc chắn muốn xóa ${selectedActiveIds.length} bài luyện tập?`
            )
        )
            return;

        try {
            await deleteProblems(selectedActiveIds);
            fetchProblems();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Xóa nhiều bài luyện tập thất bại"
            );
        }
    };

    /* ===== BULK RESTORE ===== */

    const handleRestoreSelected = async () => {
        if (selectedInactiveIds.length === 0) return;

        if (
            !confirm(
                `Bạn có chắc chắn muốn khôi phục ${selectedInactiveIds.length} bài luyện tập?`
            )
        )
            return;

        try {
            await restoreProblems(selectedInactiveIds);
            fetchProblems();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Khôi phục nhiều bài luyện tập thất bại"
            );
        }
    };

    const handleSearch = (value: string) => {
        setPage(1);
        setKeyword(value);
    };

    const handleChangeFilter = (value: ProblemStatusFilter) => {
        setPage(1);
        setStatusFilter(value);
    };

    /* ================= RENDER ================= */

    return (
        <div className="space-y-6">
            {/* ===== HEADER ===== */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Quản lý luyện tập
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Danh sách toàn bộ bài luyện tập
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            handleChangeFilter(
                                e.target.value as ProblemStatusFilter
                            )
                        }
                        className="h-10 px-3 rounded-xl border bg-white"
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Chưa xóa</option>
                        <option value="inactive">Đã xóa</option>
                    </select>
                    <SearchBar
                        placeholder="Tìm bài luyện tập..."
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
                <div className="bg-white p-4 rounded-xl text-red-600 shadow">
                    {error}
                </div>
            )}
            {/* ===== LIST HEADER ===== */}
            {!loading && Problems.length > 0 && (
                <div className="flex items-center px-4 py-2 text-sm text-gray-500 bg-gray-50 border rounded-t-xl mb-0">
                    {/* Checkbox + Title */}
                    <div className="flex items-center gap-3 flex-1">
                        <input
                            type="checkbox"
                            checked={
                                activeProblemIds.length > 0 &&
                                selectedActiveIds.length === activeProblemIds.length
                            }
                            onChange={(e) =>
                                setSelectedActiveIds(
                                    e.target.checked ? activeProblemIds : []
                                )
                            }
                            className="w-4 h-4 accent-blue-600"
                        />
                        <span>Tiêu đề</span>
                    </div>

                    {/* Status */}
                    <div className="w-32 text-right">
                        Trạng thái
                    </div>

                    {/* Actions */}
                    <div className="w-28 text-right">
                        Hành động
                    </div>
                </div>

            )}
            {/* ===== CONTENT ===== */}
            {loading ? (
                <div className="bg-white p-6 rounded-xl shadow animate-pulse h-40" />
            ) : Problems.length === 0 ? (
                <div className="bg-white p-10 rounded-xl text-center text-gray-500 shadow">
                    Không tìm thấy bài luyện tập
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow divide-y">
                    {Problems.map((Problem) => (
                        <AdminPracticeCard
                            key={Problem.id}
                            problem={Problem}
                            checked={
                                Problem.isActive === false
                                    ? selectedInactiveIds.includes(Problem.id)
                                    : selectedActiveIds.includes(Problem.id)
                            }
                            onCheck={(id, checked) =>
                                handleCheck(Problem, checked)
                            }
                            onEdit={handleEdit}
                            onDelete={() =>
                                deleteProblems([Problem.id]).then(fetchProblems)
                            }
                            onRestore={() =>
                                restoreProblems([Problem.id]).then(fetchProblems)
                            }
                        />
                    ))}
                </div>
            )}

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
            {editingProblem && (
                <EditProblemModal
                    problem={editingProblem}
                    onClose={() => setEditingProblem(null)}
                    onSubmit={(data) => {
                        // TODO: call updateProblem API
                        console.log("UPDATE", data);
                        setEditingProblem(null);
                        fetchProblems();
                    }}
                />
            )}
        </div>

    );
}
