import { useEffect, useState } from "react";
import ContestCard from "@/components/contest/ContestCard";
import type { Contest } from "@/types/Contest";
import type { ContestApi } from "@/services/api/contest.types";
import { getAllContests } from "@/services/api/contest.service";

const ContestSection = () => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchContests = async () => {
            try {
                const res = await getAllContests(1, 6);

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
                            image: contest.thumbnailUrl ||
                                "https://picsum.photos/600/400?random=" +
                                contest.id,
                            startTime: contest.startTime,
                            endTime: contest.endTime,
                            status,
                        };
                    }
                );

                setContests(mapped);
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
    }, []);

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-6">
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-28 bg-gray-200 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-6 contest-section">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Cuộc thi</h2>

                <a
                    href="/contests"
                    className="text-sm text-blue-600 hover:underline"
                >
                    Xem tất cả →
                </a>
            </div>

            {/* LIST */}
            <div className="space-y-4">
                {contests.map((contest) => (
                    <ContestCard
                        key={contest.id}
                        contest={contest}
                    />
                ))}
            </div>
        </section>
    );
};

export default ContestSection;