import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

type SearchType = "all" | "class" | "course" | "contest" | "practice";

export default function SearchPage() {
    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("q") || "";
    const type = (searchParams.get("type") || "all") as SearchType;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Kết quả tìm kiếm
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Từ khóa: <strong>{keyword}</strong> • Loại:{" "}
                        <strong>{label(type)}</strong>
                    </p>
                </div>

                {/* Empty (placeholder) */}
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <Search className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                        Chưa có dữ liệu. (Sẽ nối API sau)
                    </p>
                </div>

                {/* Sau này:
            - type === "course" → CourseCard grid
            - type === "class" → ClassCard grid
            - type === "contest" → ContestList
            - type === "practice" → PracticeCard grid
        */}
            </div>
        </div>
    );
}

function label(type: SearchType) {
    switch (type) {
        case "class":
            return "Lớp học";
        case "course":
            return "Khóa học";
        case "contest":
            return "Cuộc thi";
        case "practice":
            return "Luyện tập";
        default:
            return "Tất cả";
    }
}