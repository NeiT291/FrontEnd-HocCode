import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "@/components/course/CourseCard";
import type { Course } from "@/types/Course";
import type { Course as ApiCourse } from "@/services/api/course.types";
import { getAllCourses } from "@/services/api/course.service";

const PAGE_SIZE = 9;

export default function CoursesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const [courses, setCourses] = useState<Course[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const fetchCourses = async () => {
            try {
                const res = await getAllCourses(page, PAGE_SIZE);

                if (!isMounted) return;

                const mapped: Course[] = res.data.map(
                    (course: ApiCourse) => ({
                        id: course.id,
                        title: course.title,
                        description: course.description,
                        image:
                            "https://picsum.photos/1200/500?random=" +
                            course.id,
                        createdAt: course.createdAt,
                        createdBy:
                            course.owner?.displayName ||
                            "Giảng viên",
                    })
                );

                setCourses(mapped);
                setTotalPages(res.total_pages);
                setTotalRecords(res.total_records);
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
    }, [page]);

    const goToPage = (p: number) => {
        setSearchParams({ page: String(p) });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ===== LOADING ===== */
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <div
                            key={i}
                            className="h-80 bg-gray-200 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900">
                    Danh sách khóa học
                </h1>
                <p className="text-gray-600 mt-2">
                    Tổng cộng {totalRecords} khóa học
                </p>
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-16">
                {/* Previous */}
                <button
                    disabled={page === 1}
                    onClick={() => goToPage(page - 1)}
                    className="
                        px-4 py-2 rounded-lg border text-sm
                        transition-all duration-200
                        hover:bg-gray-50 hover:-translate-x-0.5
                        active:scale-95
                        disabled:opacity-40 disabled:hover:translate-x-0
                        disabled:cursor-not-allowed
                    "
                >
                    ← Trước
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    const isActive = page === p;

                    return (
                        <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`
                                w-10 h-10 rounded-lg text-sm border
                                flex items-center justify-center
                                transition-all duration-200
                                ${isActive
                                    ? "bg-gray-900 text-white border-gray-900 scale-110 shadow-md ring-2 ring-gray-900/20"
                                    : "hover:bg-gray-50 hover:scale-105 hover:shadow-sm"
                                }
                                active:scale-95
                            `}
                        >
                            {p}
                        </button>
                    );
                })}

                {/* Next */}
                <button
                    disabled={page === totalPages}
                    onClick={() => goToPage(page + 1)}
                    className="
                        px-4 py-2 rounded-lg border text-sm
                        transition-all duration-200
                        hover:bg-gray-50 hover:translate-x-0.5
                        active:scale-95
                        disabled:opacity-40 disabled:hover:translate-x-0
                        disabled:cursor-not-allowed
                    "
                >
                    Sau →
                </button>
            </div>
        </div>
    );
}