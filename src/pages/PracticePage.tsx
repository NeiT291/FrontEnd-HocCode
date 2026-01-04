import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PracticeCard from "@/components/practice/PracticeCard";
import type { Practice } from "@/types/Practice";
import type { ProblemApi } from "@/services/api/problem.types";
import { getAllProblems } from "@/services/api/problem.service";

const PAGE_SIZE = 6;

export default function PracticePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const [practices, setPractices] = useState<Practice[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchProblems = async () => {
            try {
                const res = await getAllProblems(page, PAGE_SIZE);

                if (!isMounted) return;

                const mapped: Practice[] = res.data.map(
                    (problem: ProblemApi) => ({
                        id: problem.id,
                        title: problem.title,
                        description: problem.description,
                        createdAt: problem.createdAt,
                        createdBy:
                            problem.createdBy?.displayName ||
                            "Giảng viên",
                        difficulty: problem.difficulty,
                    })
                );

                setPractices(mapped);
                setTotalPages(res.total_pages);
                setTotalRecords(res.total_records);
            } catch (error) {
                console.error("Fetch practices error:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProblems();

        return () => {
            isMounted = false;
        };
    }, [page]);

    const goToPage = (p: number) => {
        setSearchParams({ page: String(p) });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ===== LOADING ===== */
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <div
                            key={i}
                            className="h-40 bg-gray-200 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900">
                    Danh sách bài luyện tập
                </h1>
                <p className="text-gray-600 mt-2">
                    Tổng cộng {totalRecords} bài luyện tập
                </p>
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {practices.map((practice) => (
                    <PracticeCard
                        key={practice.id}
                        practice={practice}
                    />
                ))}
            </div>

            {/* Empty */}
            {practices.length === 0 && (
                <p className="text-center text-gray-500 mt-12">
                    Chưa có bài luyện tập
                </p>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-16">
                <button
                    disabled={page === 1}
                    onClick={() => goToPage(page - 1)}
                    className="
                        px-4 py-2 rounded-lg border text-sm
                        transition-all duration-200
                        hover:bg-gray-50 hover:-translate-x-0.5
                        active:scale-95
                        disabled:opacity-40 disabled:cursor-not-allowed
                    "
                >
                    ← Trước
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const active = p === page;

                    return (
                        <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`
                                w-10 h-10 rounded-lg border text-sm
                                transition-all duration-200
                                ${active
                                    ? "bg-gray-900 text-white border-gray-900 scale-110 shadow-md"
                                    : "hover:bg-gray-50 hover:scale-105"
                                }
                                active:scale-95
                            `}
                        >
                            {p}
                        </button>
                    );
                })}

                <button
                    disabled={page === totalPages}
                    onClick={() => goToPage(page + 1)}
                    className="
                        px-4 py-2 rounded-lg border text-sm
                        transition-all duration-200
                        hover:bg-gray-50 hover:translate-x-0.5
                        active:scale-95
                        disabled:opacity-40 disabled:cursor-not-allowed
                    "
                >
                    Sau →
                </button>
            </div>
        </div>
    );
}
