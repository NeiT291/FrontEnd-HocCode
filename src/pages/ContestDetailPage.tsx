import { useParams } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

const ContestDetailPage = () => {
    const { id } = useParams();

    // MOCK DATA
    const contest = {
        id,
        title: "Cuộc thi Giải thuật & Cấu trúc dữ liệu",
        description:
            "Cuộc thi dành cho những ai muốn thử thách khả năng tư duy thuật toán.",
        image: "https://picsum.photos/id/180/1200/500",
        startTime: "2025-02-01",
        endTime: "2025-02-05",
        status: "Đang diễn ra",
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            {/* IMAGE */}
            <img
                src={contest.image}
                alt={contest.title}
                className="w-full h-72 object-cover rounded-2xl mb-8"
            />

            {/* TITLE */}
            <h1 className="text-3xl font-bold mb-4">
                {contest.title}
            </h1>

            {/* STATUS */}
            <span className="inline-block mb-4 px-3 py-1 text-sm rounded-full bg-green-50 text-green-700 border border-green-200">
                {contest.status}
            </span>

            {/* TIME */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Bắt đầu:{" "}
                    {new Date(contest.startTime).toLocaleDateString("vi-VN")}
                </div>

                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Kết thúc:{" "}
                    {new Date(contest.endTime).toLocaleDateString("vi-VN")}
                </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-700 leading-relaxed">
                {contest.description}
            </p>
        </div>
    );
};

export default ContestDetailPage;