import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ContestCard from "@/components/contest/ContestCard";
import type { Contest } from "@/types/Contest";
import type { ContestApi } from "@/services/api/contest.types";
import { getAllContests } from "@/services/api/contest.service";

const PAGE_SIZE = 5;

export default function ContestsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const [contests, setContests] = useState<Contest[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchContests = async () => {
            try {
                const res = await getAllContests(page, PAGE_SIZE);

                if (!isMounted) return;

                const mapped: Contest[] = res.data.map(
                    (contest: ContestApi) => {
                        const now = new Date();
                        const start = new Date(contest.startTime);
                        const end = new Date(contest.endTime);

                        let status: Contest["status"];
                        if (now < start) status = "upcoming";
                        else if (now > end) status = "ended";
                        else status = "ongoing";

                        return {
                            id: contest.id,
                            title: contest.title,
                            description: contest.description,
                            image:
                                "https://picsum.photos/1200/500?random=" +
                                contest.id,
                            startTime: contest.startTime,
                            endTime: contest.endTime,
                            status,
                        };
                    }
                );

                setContests(mapped);
                setTotalPages(res.total_pages);
                setTotalRecords(res.total_records);
            } catch (error) {
                console.error("Fetch contests error:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchContests();

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
                <div className="space-y-6">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <div
                            key={i}
                            className="h-32 bg-gray-200 rounded-xl animate-pulse"
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
                    Danh sách cuộc thi
                </h1>
                <p className="text-gray-600 mt-2">
                    Tổng cộng {totalRecords} cuộc thi
                </p>
            </div>

            {/* List */}
            <div className="space-y-6">
                {contests.map((contest) => (
                    <ContestCard
                        key={contest.id}
                        contest={contest}
                    />
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
