import CourseCard from "@/components/course/CourseCard";
import type { Course } from "@/types/Course";
const courses: Course[] = [
    {
        id: 1,
        title: "Lập trình Python cơ bản",
        description: "Học Python từ con số 0, phù hợp cho người mới bắt đầu.",
        image: "https://picsum.photos/id/1011/600/400",
        createdAt: "2025-01-10",
        createdBy: "Nguyễn Văn A",
    },
    {
        id: 2,
        title: "Java Spring Boot",
        description: "Xây dựng REST API chuyên nghiệp với Spring Boot.",
        image: "https://picsum.photos/id/180/600/400",
        createdAt: "2025-01-05",
        createdBy: "Trần Văn B",
    },
    {
        id: 3,
        title: "ReactJS & TypeScript",
        description: "Frontend hiện đại với React và TypeScript.",
        image: "https://picsum.photos/id/1/600/400",
        createdAt: "2024-12-28",
        createdBy: "Lê Thị C",
    },
    {
        id: 4,
        title: "Cấu trúc dữ liệu & Giải thuật",
        description: "Nâng cao tư duy thuật toán và kỹ năng phỏng vấn.",
        image: "https://picsum.photos/id/20/600/400",
        createdAt: "2024-12-15",
        createdBy: "Phạm Văn D",
    },
    {
        id: 5,
        title: "SQL cho người mới bắt đầu",
        description: "Làm việc với dữ liệu hiệu quả bằng SQL.",
        image: "https://picsum.photos/id/1060/600/400",
        createdAt: "2024-12-01",
        createdBy: "Hoàng Thị E",
    },
    {
        id: 6,
        title: "NodeJS Backend cơ bản",
        description: "Xây dựng backend với NodeJS và Express.",
        image: "https://picsum.photos/id/1057/600/400",
        createdAt: "2024-11-20",
        createdBy: "Nguyễn Văn F",
    },
];
const CourseSection = () => {
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
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </section>

    );
};

export default CourseSection;