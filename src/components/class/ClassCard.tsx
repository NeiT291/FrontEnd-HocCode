import { BookOpen, UserPlus, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { Class } from "@/types/Class";

interface Props {
    classItem: Class;
}

export default function ClassCard({ classItem }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col hover:shadow-md transition">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {classItem.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-2 flex-1 line-clamp-3">
                {classItem.description || "Chưa có mô tả"}
            </p>

            {/* Meta */}
            <div className="mt-4 space-y-1 text-sm text-gray-500">
                <div>
                    👨‍🏫 Giảng viên:{" "}
                    <span className="text-gray-700 font-medium">
                        {classItem.instructor}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <BookOpen size={14} />
                    {classItem.courseCount} khóa học
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                {/* View detail */}
                <Link
                    to={`/classes/${classItem.id}`}
                    className="
                        flex items-center justify-center gap-2
                        px-4 py-2 rounded-lg
                        border border-gray-300
                        text-sm font-medium
                        hover:bg-gray-100
                        transition
                    "
                >
                    <Eye size={16} />
                    Xem chi tiết
                </Link>

                {/* Join */}
                <button
                    className="
                        flex items-center justify-center gap-2
                        px-4 py-2 rounded-lg
                        bg-gray-900 text-white
                        text-sm font-medium
                        hover:bg-gray-800
                        transition cursor-pointer
                    "
                >
                    <UserPlus size={16} />
                    Tham gia lớp
                </button>
            </div>
        </div>
    );
}
