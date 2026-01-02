import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "@/components/course/CourseCard";
import type { Course } from "@/types/Course";

const PAGE_SIZE = 9;

const mockCourses: Course[] = Array.from({ length: 23 }).map((_, i) => ({
    id: i + 1,
    title: `Khóa học React ${i + 1}`,
    description: "Học React từ cơ bản đến nâng cao",
    createdAt: "2025-01-01",
    createdBy: "Admin",
    image: "https://picsum.photos/id/180/1200/500",
}));

export default function CoursesPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const totalPages = Math.ceil(mockCourses.length / PAGE_SIZE);

    const courses = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return mockCourses.slice(start, start + PAGE_SIZE);
    }, [page]);

    const goToPage = (p: number) => {
        setSearchParams({ page: String(p) });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900">
                    Danh sách khóa học
                </h1>
                <p className="text-gray-600 mt-2">
                    Tổng cộng {mockCourses.length} khóa học
                </p>
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
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
      disabled:opacity-40 disabled:hover:translate-x-0 cursor-pointer disabled:cursor-not-allowed
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
                                    : "hover:bg-gray-50 hover:scale-105 hover:shadow-sm cursor-pointer "
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
      disabled:opacity-40 disabled:hover:translate-x-0 cursor-pointer disabled:cursor-not-allowed
    "
                >
                    Sau →
                </button>
            </div>
        </div>
    );
}