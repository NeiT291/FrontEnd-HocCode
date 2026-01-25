import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Database } from "lucide-react";

import { getProblemsDone } from "@/services/api/problem.service";
import type { Problem } from "@/services/api/problem.types";

/* ================= COMPONENT ================= */

const JoinedPracticeList = () => {
    const [loading, setLoading] = useState(false);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const fetchProblems = async () => {
            if (!mounted) return;

            setLoading(true);
            setError("");

            try {
                const pageData = await getProblemsDone(1, 12);
                if (mounted) {
                    setProblems(pageData.data);
                }
            } catch (err) {
                if (mounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Không tải được danh sách bài luyện tập"
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchProblems();

        return () => {
            mounted = false;
        };
    }, []);

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
                Đang tải bài luyện tập đã làm...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-red-500">
                {error}
            </div>
        );
    }

    if (problems.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
                Bạn chưa hoàn thành bài luyện tập nào
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
                Bài luyện tập đã hoàn thành
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {problems.map((problem) => {
                    const timeLimit = `${problem.timeLimitMs / 1000}s`;
                    const memoryLimit = `${problem.memoryLimitKb / 1024}MB`;

                    return (
                        <Link
                            key={problem.id}
                            to={`/practice/${problem.id}`}
                            className="
                                border rounded-xl p-4
                                hover:shadow-md hover:border-gray-300
                                transition block
                            "
                        >
                            <div className="flex items-center justify-between mb-2">
                                <DifficultyBadge
                                    difficulty={problem.difficulty}
                                />

                            </div>

                            <h3 className="font-semibold text-gray-900 line-clamp-1">
                                {problem.title}
                            </h3>

                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {problem.description}
                            </p>

                            <div className="flex gap-4 text-xs text-gray-500 mt-3">
                                <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {timeLimit}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Database size={12} />
                                    {memoryLimit}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default JoinedPracticeList;

/* ================= UI ================= */

function DifficultyBadge({
    difficulty,
}: {
    difficulty: "easy" | "medium" | "hard";
}) {
    const styles = {
        easy: "bg-green-50 text-green-600",
        medium: "bg-yellow-50 text-yellow-600",
        hard: "bg-red-50 text-red-600",
    };

    return (
        <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[difficulty]}`}
        >
            {difficulty.toUpperCase()}
        </span>
    );
}
