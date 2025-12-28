import { Calendar, User } from "lucide-react";
import type { Course } from "@/types/Course";
import AppLink from "@/components/common/AppLink";

interface CourseCardProps {
    course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <div className="course-card bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
            {/* IMAGE */}
            <img
                src={course.image}
                alt={course.title}
                className="h-40 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-5 flex flex-col flex-1">
                {/* TITLE */}
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                    {course.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {course.description}
                </p>

                {/* META */}
                <div className="mt-auto space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                            Ngày tạo:{" "}
                            <span className="font-medium text-gray-700">
                                {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>
                            Tác giả:{" "}
                            <span className="font-medium text-gray-700">
                                {course.createdBy}
                            </span>
                        </span>
                    </div>
                </div>
                {/* ACTION */}
                <div className="mt-4 course-section">
                    <AppLink
                        to={`/courses/${course.id}`}
                        variant="outline"
                        className="w-full justify-center"
                    >
                        Xem chi tiết
                    </AppLink>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;