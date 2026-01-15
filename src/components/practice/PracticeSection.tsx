import { useEffect, useState } from "react";
import PracticeCard from "@/components/practice/PracticeCard";
import type { Problem } from "@/services/api/problem.types";
import { getAllProblems } from "@/services/api/problem.service";

const PracticeSection = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchProblems = async () => {
            try {
                const res = await getAllProblems(1, 6);

                if (!isMounted) return;

                const mapped: Problem[] = res.data.map(
                    (problem: Problem) => ({
                        id: problem.id,
                        title: problem.title,
                        description: problem.description,
                        timeLimitMs: problem.timeLimitMs,
                        memoryLimitKb: problem.memoryLimitKb,
                        difficulty: problem.difficulty,
                        createdBy: problem.createdBy,
                        isPublic: problem.isPublic,
                        isTheory: problem.isTheory,
                        createdAt: problem.createdAt,
                        updatedAt: problem.updatedAt,
                        position: problem.position,
                        testcases: problem.testcases,
                    })
                );

                setProblems(mapped);
            } catch (error) {
                console.error("Fetch problems error:", error);
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
    }, []);

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-40 bg-gray-200 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Luyện tập</h2>

                <a
                    href="/practice"
                    className="text-sm text-blue-600 hover:underline"
                >
                    Xem tất cả →
                </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {problems.map((problems) => (
                    <PracticeCard
                        key={problems.id}
                        problem={problems}
                    />
                ))}
            </div>
        </section>
    );
};

export default PracticeSection;