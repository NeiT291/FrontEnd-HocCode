import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
    Calendar,
    PlayCircle,
    Lock,
} from "lucide-react";

/* ================= TYPES ================= */

type Difficulty = "easy" | "medium" | "hard";
type ContestStatus = "upcoming" | "ongoing" | "ended";

interface ContestProblem {
    id: number;
    title: string;
    difficulty: Difficulty;
}

/* ================= MOCK DATA ================= */

const contest = {
    id: 1,
    title: "Cuộc thi lập trình tháng 3",
    description:
        "Cuộc thi kiểm tra kỹ năng lập trình, thuật toán và tư duy logic.",
    startTime: "08:00 20/03/2025",
    endTime: "11:00 20/03/2025",
    status: "ongoing" as ContestStatus,
    problems: [
        { id: 1, title: "Tính tổng hai số", difficulty: "easy" },
        { id: 2, title: "Dãy con tăng dài nhất", difficulty: "medium" },
        { id: 3, title: "Đường đi ngắn nhất", difficulty: "hard" },
    ] as ContestProblem[],
};

/* ================= PAGE ================= */

export default function ContestDetailPage() {
    const { id } = useParams();

    const [joined, setJoined] = useState(false);

    const canJoin = contest.status === "ongoing";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
                {/* ================= HEADER ================= */}
                <section className="bg-white rounded-2xl shadow-sm p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
                                    text={`${contest.startTime} → ${contest.endTime}`}
                                />
                                <ContestStatusBadge status={contest.status} />
                            </div>
                        </div>

                        {/* Join button */}
                        {!joined && (
                            <button
                                disabled={!canJoin}
                                onClick={() => setJoined(true)}
                                className="
                  flex items-center gap-2
                  px-6 py-3 rounded-xl
                  bg-gray-900 text-white
                  hover:bg-gray-800
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
                            >
                                <PlayCircle size={18} />
                                Tham gia cuộc thi
                            </button>
                        )}
                    </div>
                </section>

                {/* ================= NOT JOINED ================= */}
                {!joined && (
                    <section className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <Lock className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600">
                            Bạn cần <strong>tham gia cuộc thi</strong> để xem danh sách vấn đề.
                        </p>
                    </section>
                )}

                {/* ================= PROBLEMS (JOINED) ================= */}
                {joined && (
                    <section className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
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

/* ================= COMPONENTS ================= */

function ProblemRow({
    index,
    problem,
    contestId,
}: {
    index: number;
    problem: ContestProblem;
    contestId: number;
}) {
    return (
        <Link
            to={`/practice/${problem.id}?contestId=${contestId}`}
            className="
        group
        flex items-center justify-between
        px-5 py-4
        rounded-xl border
        bg-white
        hover:bg-gray-50
        hover:border-gray-300
        transition
      "
        >
            {/* Left */}
            <div className="flex items-center gap-5">
                {/* Index */}
                <div
                    className="
            w-9 h-9
            flex items-center justify-center
            rounded-full
            bg-gray-100
            text-gray-600
            font-semibold
            group-hover:bg-gray-200
            transition
          "
                >
                    {index}
                </div>

                {/* Title */}
                <div>
                    <p className="font-medium text-gray-900 group-hover:underline">
                        {problem.title}
                    </p>

                    <div className="mt-1">
                        <DifficultyBadge difficulty={problem.difficulty} />
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="text-sm text-gray-400 group-hover:text-gray-600 transition">
                Giải →
            </div>
        </Link>
    );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
    const styles = {
        easy: "bg-green-50 text-green-600 border-green-200",
        medium: "bg-yellow-50 text-yellow-600 border-yellow-200",
        hard: "bg-red-50 text-red-600 border-red-200",
    };

    return (
        <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full border text-xs ${styles[difficulty]}`}
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
    const styles = {
        upcoming: "bg-blue-50 text-blue-600 border-blue-200",
        ongoing: "bg-green-50 text-green-600 border-green-200",
        ended: "bg-gray-100 text-gray-500 border-gray-300",
    };

    const labels = {
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