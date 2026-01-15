import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import type { Problem } from "@/services/api/problem.types";

interface Props {
    problem: Problem;
}

const difficultyMap = {
    easy: {
        label: "Dễ",
        className: "bg-green-50 text-green-700 border border-green-200",
    },
    medium: {
        label: "Trung bình",
        className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    },
    hard: {
        label: "Khó",
        className: "bg-red-50 text-red-700 border border-red-200",
    },
};

const PracticeCard = ({ problem }: Props) => {
    const difficulty = difficultyMap[problem.difficulty];

    return (
        <Link
            to={`/practice/${problem.id}`}
            className="
        practice-card
        block
        bg-white
        rounded-2xl
        shadow
        hover:shadow-lg
        transition
        p-6
        cursor-pointer
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
      "
        >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold line-clamp-1">
                    {problem.title}
                </h3>

                <span
                    className={`
            px-2.5 py-0.5
            text-xs font-medium
            rounded-full
            ${difficulty.className}
          `}
                >
                    {difficulty.label}
                </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {problem.description}
            </p>

            {/* META */}
            <div className="mt-auto space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                        Ngày tạo:{" "}
                        <span className="font-medium text-gray-700">
                            {new Date(problem.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>
                        Tác giả:{" "}
                        <span className="font-medium text-gray-700">
                            {problem.createdBy.displayName}
                        </span>
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PracticeCard;