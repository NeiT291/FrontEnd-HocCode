import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";

import { getContestRanking } from "@/services/api/contest.service";
import type { ContestRankingPage } from "@/services/api/contest.types";

const PAGE_SIZE = 20;

export default function ContestRankingPage() {
    const { id } = useParams<{ id: string }>();
    const contestId = Number(id);

    const [page, setPage] = useState(1);
    const [ranking, setRanking] =
        useState<ContestRankingPage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contestId) return;

        const fetchRanking = async () => {
            try {
                setLoading(true);
                const data = await getContestRanking(
                    page,
                    PAGE_SIZE,
                    contestId
                );
                setRanking(data);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, [contestId, page]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
                {/* ===== HEADER ===== */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/contests/${contestId}`}
                            className="p-2 rounded-lg hover:bg-gray-200"
                        >
                            <ArrowLeft size={18} />
                        </Link>

                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="text-yellow-500" size={22} />
                            Bảng xếp hạng
                        </h1>
                    </div>
                </div>

                {/* ===== CONTENT ===== */}
                {loading && (
                    <div className="text-center text-gray-500 py-20">
                        Đang tải bảng xếp hạng...
                    </div>
                )}

                {!loading && ranking && (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-center w-16">#</th>
                                        <th className="px-4 py-3 text-left">
                                            Người dùng
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            Điểm
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            Đã giải
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            Penalty
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            AC cuối
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {ranking.data.map((item, index) => {
                                        const rank =
                                            (page - 1) * PAGE_SIZE +
                                            index +
                                            1;

                                        return (
                                            <tr
                                                key={item.user.username}
                                                className={`
                                                    border-t
                                                    hover:bg-gray-50
                                                    transition
                                                    ${rank <= 3 ? "bg-yellow-50/40" : ""}
                                                `}
                                            >
                                                {/* RANK */}
                                                <td className="px-4 py-3 text-center font-bold">
                                                    {rank === 1 && "🥇"}
                                                    {rank === 2 && "🥈"}
                                                    {rank === 3 && "🥉"}
                                                    {rank > 3 && rank}
                                                </td>

                                                {/* USER */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {item.user.avatarUrl ? (
                                                            <img
                                                                src={item.user.avatarUrl}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                                U
                                                            </div>
                                                        )}

                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {item.user.displayName ??
                                                                    item.user.username}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                @{item.user.username}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* SCORE */}
                                                <td className="px-4 py-3 text-center font-semibold text-gray-900">
                                                    {item.totalScore}
                                                </td>

                                                {/* SOLVED */}
                                                <td className="px-4 py-3 text-center">
                                                    {item.solvedCount}
                                                </td>

                                                {/* PENALTY */}
                                                <td className="px-4 py-3 text-center">
                                                    {item.penalty}
                                                </td>

                                                {/* LAST AC */}
                                                <td className="px-4 py-3 text-center text-gray-500">
                                                    {item.lastAcceptedTime
                                                        ? new Date(
                                                            item.lastAcceptedTime
                                                        ).toLocaleString("vi-VN")
                                                        : "-"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* ===== PAGINATION ===== */}
                        {ranking.total_pages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                                <span className="text-sm text-gray-500">
                                    Trang {page} / {ranking.total_pages}
                                </span>

                                <div className="flex gap-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() =>
                                            setPage((p) => p - 1)
                                        }
                                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        Trước
                                    </button>

                                    <button
                                        disabled={
                                            page === ranking.total_pages
                                        }
                                        onClick={() =>
                                            setPage((p) => p + 1)
                                        }
                                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
