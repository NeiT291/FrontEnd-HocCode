import type { Practice } from "@/types/Practice";
import PracticeCard from "@/components/practice/PracticeCard";

const practices: Practice[] = [
    {
        id: 1,
        title: "Tính tổng 2 số nguyên",
        description: "Tính tổng 2 số nguyên.",
        createdAt: "2025-01-12",
        createdBy: "Nguyễn Văn A",
        difficulty: "easy",
    },
    {
        id: 2,
        title: "Tháp Hà Nội Xuôi",
        description: "Tháp Hà Nội Xuôi.",
        createdAt: "2025-01-08",
        createdBy: "Trần Văn B",
        difficulty: "medium",
    },
    {
        id: 3,
        title: "Dãy ngoặc đúng",
        description: "Dãy ngoặc đúng.",
        createdAt: "2024-12-25",
        createdBy: "Lê Thị C",
        difficulty: "hard",
    },
];
const PracticeSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">
                    Luyện tập
                </h2>

                <a
                    href="/practice"
                    className="text-sm text-blue-600 hover:underline"
                >
                    Xem tất cả →
                </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {practices.map((practice) => (
                    <PracticeCard
                        key={practice.id}
                        practice={practice}
                    />
                ))}
            </div>
        </section>
    );
};

export default PracticeSection;