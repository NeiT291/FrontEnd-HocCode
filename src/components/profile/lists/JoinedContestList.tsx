import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContestJoined } from "@/services/api/contest.service";

/* ================= COMPONENT ================= */

const JoinedContestList = () => {
    const [loading, setLoading] = useState(false);
    const [contests, setContests] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const fetchContests = async () => {
            if (!mounted) return;

            setLoading(true);
            setError("");

            try {
                const data = await getContestJoined(1, 10);
                if (mounted) {
                    setContests(data.data);
                }
            } catch (err: unknown) {
                if (mounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Không tải được danh sách cuộc thi"
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchContests();
        return () => {
            mounted = false;
        };
    }, []);

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
                Đang tải cuộc thi...
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

    if (contests.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
                Bạn chưa tham gia cuộc thi nào
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
                Cuộc thi đã tham gia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contests.map((contest) => (
                    <Link
                        key={contest.id}
                        to={`/contests/${contest.id}`}
                        className="
                            border rounded-xl p-4
                            hover:shadow-md hover:border-gray-300
                            transition block
                        "
                    >
                        {/* THUMBNAIL */}
                        {contest.thumbnailUrl ? (
                            <img
                                src={contest.thumbnailUrl}
                                alt={contest.title}
                                className="w-full h-36 object-cover rounded-lg mb-3"
                            />
                        ) : (
                            <div className="w-full h-36 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                                Không có ảnh
                            </div>
                        )}

                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {contest.title}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {contest.description}
                        </p>

                        <div className="text-xs text-gray-500 mt-2">
                            {new Date(contest.startTime).toLocaleDateString()}{" "}
                            –{" "}
                            {new Date(contest.endTime).toLocaleDateString()}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default JoinedContestList;
