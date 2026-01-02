import { Users, UserPlus, CheckCircle } from "lucide-react";
import type { Class } from "@/types/Class";

interface Props {
    classItem: Class;
    onJoin: (id: number) => void;
}

export default function ClassCard({ classItem, onJoin }: Props) {
    const joined = classItem.status === "joined";

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col hover:shadow-md transition">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900">
                {classItem.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-2 flex-1">
                {classItem.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Users size={14} />
                {classItem.members} học viên • GV {classItem.instructor}
            </div>

            {/* Action */}
            <div className="mt-6">
                {joined ? (
                    <button
                        disabled
                        className="
              w-full flex items-center justify-center gap-2
              px-4 py-2 rounded-lg
              bg-green-50 text-green-700
              text-sm font-medium
              cursor-default
            "
                    >
                        <CheckCircle size={16} />
                        Đã tham gia
                    </button>
                ) : (
                    <button
                        disabled={classItem.status === "closed"}
                        onClick={() => onJoin(classItem.id)}
                        className="
              w-full flex items-center justify-center gap-2
              px-4 py-2 rounded-lg
              bg-gray-900 text-white
              text-sm
              hover:bg-gray-800
              disabled:opacity-40 disabled:cursor-not-allowed
            "
                    >
                        <UserPlus size={16} />
                        Tham gia lớp
                    </button>
                )}
            </div>
        </div>
    );
}