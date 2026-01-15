import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, PlayCircle, Lock } from "lucide-react";
import {
    getContestById,
    checkContestJoined,
    enrollContest
} from "@/services/api/contest.service";
import type { Contest } from "@/services/api/contest.types";
import type { Problem } from "@/services/api/problem.types";

/* ================= PAGE ================= */

export default function ContestDetailPage() {
    const { id } = useParams<{ id: string }>();

    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [joined, setJoined] = useState(false);
    const [checkingJoin, setCheckingJoin] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    useEffect(() => {
        if (!id) return;

        const contestId = Number(id);

        const fetchData = async () => {
            try {
                const [contestData, isJoined] = await Promise.all([
                    getContestById(contestId),
                    checkContestJoined(contestId),
                ]);

                setContest(contestData);
                setJoined(Boolean(isJoined));
            } finally {
                setLoading(false);
                setCheckingJoin(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="p-10 text-center">Đang tải...</div>;
    }

    if (!contest) {
        return <div className="p-10 text-center">Không tìm thấy cuộc thi</div>;
    }

    const status = getContestStatus(contest.startTime, contest.endTime);
    const canJoin = status === "ongoing";
    const handleJoinContest = async () => {
        if (!contest || enrolling) return;

        try {
            setEnrolling(true);

            await enrollContest(contest.id);

            // Optimistic UI
            setJoined(true);
        } catch (error) {
            console.error("Enroll contest error:", error);
            alert("Không thể tham gia cuộc thi. Vui lòng thử lại.");
        } finally {
            setEnrolling(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                {/* ================= HEADER ================= */}
                <section className="bg-white rounded-2xl shadow-sm p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* ===== THUMBNAIL ===== */}
                        <div className="md:w-1/3">
                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                                {contest.thumbnailUrl ? (
                                    <img
                                        src={contest.thumbnailUrl}
                                        alt={contest.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                        Chưa có ảnh cuộc thi
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ===== INFO ===== */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {contest.title}
                                </h1>

                                <p className="mt-3 text-gray-700 max-w-2xl">
                                    {contest.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                    <Meta
                                        icon={<Calendar size={14} />}
                                        text={`${formatDate(
                                            contest.startTime
                                        )} → ${formatDate(
                                            contest.endTime
                                        )}`}
                                    />
                                    <ContestStatusBadge status={status} />
                                </div>
                            </div>

                            {/* ===== JOIN BUTTON ===== */}
                            {!checkingJoin && !joined && (
                                <button
                                    disabled={!canJoin || enrolling}
                                    onClick={handleJoinContest}
                                    className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-xl
          bg-gray-900 text-white
          hover:bg-gray-800
          disabled:opacity-40
        "
                                >
                                    <PlayCircle size={18} />
                                    {enrolling ? "Đang tham gia..." : "Tham gia cuộc thi"}
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ================= NOT JOINED ================= */}
                {!checkingJoin && !joined && (
                    <section className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <Lock className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600">
                            Bạn cần <strong>tham gia cuộc thi</strong> để xem
                            danh sách bài toán.
                        </p>
                    </section>
                )}

                {/* ================= PROBLEMS ================= */}
                {joined && (
                    <section className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-xl font-semibold mb-6">
                            Danh sách bài toán
                        </h2>

                        <div className="space-y-4">
                            {contest.problems.map((problem, index) => (
                                <ProblemRow
                                    key={problem.id}
                                    index={index + 1}
                                    problem={problem}
                                    contestId={contest.id}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

/* ================= HELPERS ================= */

function formatDate(date: string) {
    return new Date(date).toLocaleString("vi-VN");
}

type ContestStatus = "upcoming" | "ongoing" | "ended";

function getContestStatus(
    startTime: string,
    endTime: string
): ContestStatus {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "upcoming";
    if (now > end) return "ended";
    return "ongoing";
}

/* ================= COMPONENTS ================= */

function ProblemRow({
    index,
    problem,
    contestId,
}: {
    index: number;
    problem: Problem;
    contestId: number;
}) {
    return (
        <Link
            to={`/practice/${problem.id}?contestId=${contestId}`}
            className="
              group flex items-center justify-between
              px-5 py-4 rounded-xl border
              bg-white hover:bg-gray-50 hover:border-gray-300 transition
            "
        >
            <div className="flex items-center gap-5">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold">
                    {index}
                </div>

                <div>
                    <p className="font-medium text-gray-900 group-hover:underline">
                        {problem.title}
                    </p>

                    <div className="mt-1">
                        <DifficultyBadge difficulty={problem.difficulty} />
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-400 group-hover:text-gray-600">
                Giải →
            </div>
        </Link>
    );
}

/* ================= BADGES ================= */

function DifficultyBadge({
    difficulty,
}: {
    difficulty: Problem["difficulty"];
}) {
    const styles: Record<Problem["difficulty"], string> = {
        easy: "bg-green-50 text-green-600 border-green-200",
        medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
        hard: "bg-red-50 text-red-600 border-red-200",
    };

    return (
        <span
            className={`inline-block px-2 py-0.5 rounded-full border text-xs ${styles[difficulty]}`}
        >
            {difficulty.toUpperCase()}
        </span>
    );
}

function ContestStatusBadge({
    status,
}: {
    status: ContestStatus;
}) {
    const styles: Record<ContestStatus, string> = {
        upcoming: "bg-blue-50 text-blue-600 border-blue-200",
        ongoing: "bg-green-50 text-green-600 border-green-200",
        ended: "bg-gray-100 text-gray-500 border-gray-300",
    };

    const labels: Record<ContestStatus, string> = {
        upcoming: "Sắp diễn ra",
        ongoing: "Đang diễn ra",
        ended: "Đã kết thúc",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full border text-sm font-medium ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}

function Meta({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <span className="flex items-center gap-1 text-sm text-gray-500">
            {icon}
            {text}
        </span>
    );
}
