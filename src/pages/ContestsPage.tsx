import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ContestCard from "@/components/contest/ContestCard";
import type { Contest } from "@/types/Contest";

const PAGE_SIZE = 5;

const mockContests: Contest[] = Array.from({ length: 18 }).map((_, i) => ({
    id: i + 1,
    title: `Cuộc thi lập trình #${i + 1}`,
    description: "Thử thách kỹ năng lập trình và tư duy thuật toán",
    image: "https://picsum.photos/id/180/1200/500",
    startTime: "2025-02-01 08:00",
    endTime: "2025-02-01 11:00",
    status:
        i % 3 === 0 ? "upcoming" : i % 3 === 1 ? "ongoing" : "ended",
}));

export default function ContestsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const totalPages = Math.ceil(mockContests.length / PAGE_SIZE);

    const contests = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return mockContests.slice(start, start + PAGE_SIZE);
    }, [page]);

    const goToPage = (p: number) => {
        setSearchParams({ page: String(p) });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900">
                    Danh sách cuộc thi
                </h1>
                <p className="text-gray-600 mt-2">
                    Tổng cộng {mockContests.length} cuộc thi
                </p>
            </div>

            {/* List */}
            <div className="space-y-6">
                {contests.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                ))}
            </div>

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
            disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed
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
                                    : "hover:bg-gray-50 hover:scale-105 cursor-pointer"
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
            disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed
          "
                >
                    Sau →
                </button>
            </div>
        </div>
    );
}