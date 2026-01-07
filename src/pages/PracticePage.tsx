import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PracticeCard from "@/components/practice/PracticeCard";
import type { Practice } from "@/types/Practice";
import type { ProblemApi } from "@/services/api/problem.types";
import { getAllProblems } from "@/services/api/problem.service";
import SearchSection from "@/components/search/SearchSection";

const PAGE_SIZE = 6;
type Difficulty = "easy" | "medium" | "hard";

export default function PracticePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const difficulty =
        (searchParams.get("difficulty") as Difficulty) || undefined;

    const [practices, setPractices] = useState<Practice[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchProblems = async () => {
            try {
                const res = await getAllProblems(
                    page,
                    PAGE_SIZE,
                    difficulty
                );

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
    }, [page, difficulty]);

    const updateParams = (
        params: Record<string, string | undefined>
    ) => {
        const next = new URLSearchParams(searchParams);

        Object.entries(params).forEach(([key, value]) => {
            if (!value) next.delete(key);
            else next.set(key, value);
        });

        setSearchParams(next);
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
        <>
            <SearchSection />
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Danh sách bài luyện tập
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Tổng cộng {totalRecords} bài luyện tập
                    </p>
                </div>

                {/* Difficulty Filter */}
                <div className="flex flex-wrap gap-3 mb-10">
                    <FilterButton
                        active={!difficulty}
                        onClick={() =>
                            updateParams({
                                difficulty: undefined,
                                page: "1",
                            })
                        }
                    >
                        Tất cả
                    </FilterButton>

                    <FilterButton
                        color="green"
                        active={difficulty === "easy"}
                        onClick={() =>
                            updateParams({
                                difficulty: "easy",
                                page: "1",
                            })
                        }
                    >
                        Easy
                    </FilterButton>

                    <FilterButton
                        color="yellow"
                        active={difficulty === "medium"}
                        onClick={() =>
                            updateParams({
                                difficulty: "medium",
                                page: "1",
                            })
                        }
                    >
                        Medium
                    </FilterButton>

                    <FilterButton
                        color="red"
                        active={difficulty === "hard"}
                        onClick={() =>
                            updateParams({
                                difficulty: "hard",
                                page: "1",
                            })
                        }
                    >
                        Hard
                    </FilterButton>
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
                        Không có bài luyện tập phù hợp
                    </p>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16">
                        <button
                            disabled={page === 1}
                            onClick={() =>
                                updateParams({
                                    page: String(page - 1),
                                })
                            }
                            className="px-4 py-2 rounded-lg border text-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            ← Trước
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const p = i + 1;
                            const active = p === page;

                            return (
                                <button
                                    key={p}
                                    onClick={() =>
                                        updateParams({
                                            page: String(p),
                                        })
                                    }
                                    className={`w-10 h-10 rounded-lg border text-sm transition-all
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
                            onClick={() =>
                                updateParams({
                                    page: String(page + 1),
                                })
                            }
                            className="px-4 py-2 rounded-lg border text-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Sau →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

/* ================= Filter Button ================= */

function FilterButton({
    children,
    active,
    color = "gray",
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    color?: "gray" | "green" | "yellow" | "red";
    onClick: () => void;
}) {
    const colors = {
        gray: "border-gray-300 text-gray-700",
        green: "border-green-500 text-green-600",
        yellow: "border-yellow-500 text-yellow-600",
        red: "border-red-500 text-red-600",
    };

    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2 rounded-full border text-sm
                transition-all duration-200
                ${active
                    ? "bg-gray-900 text-white border-gray-900 scale-105 shadow"
                    : `${colors[color]} hover:bg-gray-50 hover:scale-105`
                }
                active:scale-95
            `}
        >
            {children}
        </button>
    );
}
