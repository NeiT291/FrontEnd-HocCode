import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { KeyRound, ChevronLeft, ChevronRight } from "lucide-react";

import ClassCard from "@/components/class/ClassCard";
import JoinClassByCodeModal from "@/components/class/JoinClassByCodeModal";
import type { Class } from "@/types/Class";
import type { ClassApi } from "@/services/api/class.types";
import { getAllClasses } from "@/services/api/class.service";

const PAGE_SIZE = 6;

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [showJoinByCode, setShowJoinByCode] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchClasses = async () => {
            try {
                const res = await getAllClasses(page, PAGE_SIZE);

                if (!isMounted) return;

                const mapped: Class[] = res.data.map(
                    (c: ClassApi) => ({
                        id: c.id,
                        name: c.title,
                        description: c.description,
                        instructor:
                            c.owner?.displayName || "Giảng viên",
                        courseCount: c.courses.length,
                        code: c.code,
                    })
                );

                setClasses(mapped);
                setTotalPages(res.total_pages);
            } catch (error) {
                console.error("Fetch classes error:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchClasses();
        return () => {
            isMounted = false;
        };
    }, [page]);

    const changePage = (p: number) => {
        setSearchParams({ page: String(p) });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <div
                            key={i}
                            className="h-48 bg-gray-200 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-6 mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Lớp học
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Danh sách các lớp học hiện có
                            </p>
                        </div>

                        <button
                            onClick={() => setShowJoinByCode(true)}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                        >
                            <KeyRound size={18} />
                            Tham gia bằng mã
                        </button>
                    </div>
                </div>

                {/* ================= GRID ================= */}
                {classes.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {classes.map((c) => (
                            <ClassCard
                                key={c.id}
                                classItem={c}
                            />
                        ))}
                    </div>
                )}

                {/* ================= PAGINATION ================= */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-14">
                        <button
                            disabled={page === 1}
                            onClick={() => changePage(page - 1)}
                            className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const p = i + 1;
                            const active = p === page;

                            return (
                                <button
                                    key={p}
                                    onClick={() => changePage(p)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium
                                        ${active
                                            ? "bg-gray-900 text-white"
                                            : "border hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <button
                            disabled={page === totalPages}
                            onClick={() => changePage(page + 1)}
                            className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* ================= MODAL ================= */}
            {showJoinByCode && (
                <JoinClassByCodeModal
                    onClose={() => setShowJoinByCode(false)}
                />
            )}
        </div>
    );
}

/* ================= UI ================= */

function EmptyState() {
    return (
        <div className="text-center py-20 text-gray-500">
            Không có lớp học
        </div>
    );
}
