import type { Contest } from "@/types/Contest";
import ContestCard from "@/components/contest/ContestCard";
const contests: Contest[] = [
    {
        id: 1,
        title: "Cuộc thi Python cơ bản",
        description: "Cuộc thi dành cho người mới bắt đầu học Python.",
        image: "https://picsum.photos/id/1015/600/400",
        startTime: "2025-02-01",
        endTime: "2025-02-05",
        status: "upcoming",
    },
    {
        id: 2,
        title: "Giải thuật & Cấu trúc dữ liệu",
        description: "Thử thách tư duy thuật toán nâng cao.",
        image: "https://picsum.photos/id/180/600/400",
        startTime: "2025-01-20",
        endTime: "2025-01-25",
        status: "ongoing",
    },
    {
        id: 3,
        title: "Thi Frontend ReactJS",
        description: "Đánh giá kiến thức ReactJS và TypeScript.",
        image: "https://picsum.photos/id/1/600/400",
        startTime: "2024-12-10",
        endTime: "2024-12-15",
        status: "ended",
    },
];
const ContestSection = () => {
    return (
        <section className="max-w-7xl mx-auto  px-6 contest-section">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">
                    Cuộc thi
                </h2>

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