import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCoursesJoined } from "@/services/api/course.service";
import type { Course } from "@/services/api/course.types";

const JoinedCourseList = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        let mounted = true;

        const fetchCourses = async () => {
            if (!mounted) return;

            setLoading(true);
            setError("");

            try {
                const data = await getCoursesJoined(1, 10);
                if (mounted) {
                    setCourses(data);
                }
            } catch (err: unknown) {
                if (mounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Không tải được danh sách khóa học"
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchCourses();

        return () => {
            mounted = false;
        };
    }, []);

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
                Đang tải khóa học...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-red-500">
                {error}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
                Bạn chưa tạo khóa học nào
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
                Khóa học đã tạo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <Link
                        key={course.id}
                        to={`/courses/${course.id}`}
                        className="
                            border rounded-xl p-4
                            hover:shadow-md hover:border-gray-300
                            transition block
                        "
                    >
                        {course.thumbnailUrl && (
                            <img
                                src={course.thumbnailUrl}
                                alt={course.title}
                                className="w-full h-36 object-cover rounded-lg mb-3"
                            />
                        )}

                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {course.title}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {course.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default JoinedCourseList;
