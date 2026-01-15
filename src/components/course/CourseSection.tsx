import { useEffect, useState } from "react";
import CourseCard from "@/components/course/CourseCard";
import type { Course } from "@/services/api/course.types";
import { getAllCourses } from "@/services/api/course.service";

const CourseSection = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // 🔒 tránh setState khi unmount

        const fetchCourses = async () => {
            try {
                const res = await getAllCourses(1, 6);

                if (!isMounted) return;

                const mapped: Course[] = res.data.map(
                    (course: Course) => ({
                        id: course.id,
                        thumbnailUrl: course.thumbnailUrl || "https://picsum.photos/600/400?random=" + course.id,
                        title: course.title,
                        description: course.description,
                        owner: course.owner,
                        isPublic: course.isPublic,
                        createdAt: course.createdAt,
                        updatedAt: course.updatedAt,
                        modules: course.modules,
                    })
                );

                setCourses(mapped);
            } catch (error) {
                console.error("Fetch courses error:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCourses();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-6 mb-10">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-64 bg-gray-200 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-6 mb-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">
                    Danh sách khoá học
                </h2>

                <a
                    href="/courses"
                    className="text-sm text-blue-600 hover:underline"
                >
                    Xem tất cả →
                </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                    />
                ))}
            </div>
        </section>
    );
};

export default CourseSection;