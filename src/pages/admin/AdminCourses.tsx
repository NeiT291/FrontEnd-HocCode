import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminCourseCard from "@/components/admin/AdminCourseCard";
import SearchBar from "@/components/admin/SearchBar";

import { deleteCourses, getAllCourses, restoreCourses } from "@/services/api/admin.service";
import type { Course } from "@/services/api/course.types";

/* ================= CONSTANT ================= */

const PAGE_SIZE = 10;
type CourseStatusFilter = "all" | "active" | "inactive";

/* ================= PAGE ================= */

export default function AdminCourses() {
    const navigate = useNavigate();
    const mountedRef = useRef(true);

    /* ===== STATE ===== */
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [courses, setCourses] = useState<Course[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");

    // 🔥 TÁCH selection theo trạng thái
    const [selectedActiveIds, setSelectedActiveIds] = useState<number[]>([]);
    const [selectedInactiveIds, setSelectedInactiveIds] = useState<number[]>([]);

    const [statusFilter, setStatusFilter] =
        useState<CourseStatusFilter>("all");

    const activeCourseIds = courses
        .filter((c) => c.isActive !== false)
        .map((c) => c.id);

    /* ================= FETCH ================= */

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const isActiveParam: boolean | undefined =
                statusFilter === "active"
                    ? true
                    : statusFilter === "inactive"
                        ? false
                        : undefined;
            const res = await getAllCourses(page, PAGE_SIZE, keyword, isActiveParam);
            if (!mountedRef.current) return;

            setCourses(res.data);
            setTotalPages(res.total_pages);

            // reset selection mỗi lần load
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
        fetchCourses();
        return () => {
            mountedRef.current = false;
        };
    }, [fetchCourses]);

    /* ================= HANDLERS ================= */

    const handleEdit = (id: number) => {
        navigate(`/courses/${id}/edit`);
    };

    const handleCheck = (course: Course, checked: boolean) => {
        if (course.isActive === false) {
            setSelectedInactiveIds((prev) =>
                checked
                    ? [...prev, course.id]
                    : prev.filter((id) => id !== course.id)
            );
        } else {
            setSelectedActiveIds((prev) =>
                checked
                    ? [...prev, course.id]
                    : prev.filter((id) => id !== course.id)
            );
        }
    };

    /* ===== DELETE ===== */

    const handleDeleteSelected = async () => {
        if (selectedActiveIds.length === 0) return;

        if (
            !confirm(
                `Bạn có chắc chắn muốn xóa ${selectedActiveIds.length} khóa học đã chọn?`
            )
        ) {
            return;
        }

        try {
            await deleteCourses(selectedActiveIds);
            fetchCourses();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Xóa nhiều khóa học thất bại"
            );
        }
    };

    /* ===== RESTORE ===== */

    const handleRestoreSelected = async () => {
        if (selectedInactiveIds.length === 0) return;

        if (
            !confirm(
                `Bạn có chắc chắn muốn khôi phục ${selectedInactiveIds.length} khóa học đã chọn?`
            )
        ) {
            return;
        }

        try {
            await restoreCourses(selectedInactiveIds);
            fetchCourses();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Khôi phục nhiều khóa học thất bại"
            );
        }
    };

    const handleSearch = (value: string) => {
        setPage(1);
        setKeyword(value);
    };
    const handleChangeFilter = (value: CourseStatusFilter) => {
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
                        Quản lý khóa học
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Danh sách toàn bộ khóa học
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* FILTER */}
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            handleChangeFilter(
                                e.target.value as CourseStatusFilter
                            )
                        }
                        className="
        h-10 px-3 rounded-xl border bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-500
    "
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Chưa xóa</option>
                        <option value="inactive">Đã xóa</option>
                    </select>
                    {/* SEARCH */}
                    <SearchBar
                        placeholder="Tìm khóa học..."
                        onSearch={handleSearch}
                    />



                    {/* BULK RESTORE */}
                    {selectedInactiveIds.length > 0 && (
                        <button
                            onClick={handleRestoreSelected}
                            className="px-4 py-2 rounded-xl bg-green-600 text-white"
                        >
                            Khôi phục ({selectedInactiveIds.length})
                        </button>
                    )}

                    {/* BULK DELETE */}
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
            {!loading && courses.length > 0 && (
                <div className="flex items-center gap-4 px-4 py-2 text-sm text-gray-500 bg-gray-50 border rounded-t-xl mb-0">
                    <input
                        type="checkbox"
                        checked={
                            activeCourseIds.length > 0 &&
                            selectedActiveIds.length === activeCourseIds.length
                        }
                        onChange={(e) =>
                            setSelectedActiveIds(
                                e.target.checked ? activeCourseIds : []
                            )
                        }
                        className="w-4 h-4 accent-blue-600"
                    />
                    <div className="w-24 text-center">Ảnh</div>
                    <div className="flex-1">Khóa học</div>
                    <div className="w-24 text-center">Trạng thái</div>
                    <div className="w-36 text-center">Hành động</div>
                </div>
            )}

            {/* ===== CONTENT ===== */}
            {loading ? (
                <div className="bg-white rounded-2xl p-6 shadow animate-pulse h-40" />
            ) : courses.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow">
                    Không tìm thấy khóa học nào
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-b-xl shadow divide-y">
                        {courses.map((course) => (
                            <AdminCourseCard
                                key={course.id}
                                course={course}
                                checked={
                                    course.isActive === false
                                        ? selectedInactiveIds.includes(course.id)
                                        : selectedActiveIds.includes(course.id)
                                }
                                onCheck={(id, checked) =>
                                    handleCheck(course, checked)
                                }
                                onEdit={handleEdit}
                                onDelete={() =>
                                    deleteCourses([course.id]).then(fetchCourses)
                                }
                                onRestore={() =>
                                    restoreCourses([course.id]).then(fetchCourses)}
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
