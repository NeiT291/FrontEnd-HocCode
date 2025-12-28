import { useParams } from "react-router-dom";
import { Calendar, User } from "lucide-react";

const CourseDetailPage = () => {
    const { id } = useParams();

    // MOCK DATA (sau này replace bằng API)
    const course = {
        id,
        title: "Lập trình ReactJS & TypeScript",
        description:
            "Khóa học giúp bạn nắm vững ReactJS, TypeScript và cách xây dựng frontend hiện đại.",
        image: "https://picsum.photos/id/1/1200/500",
        createdAt: "2025-01-10",
        createdBy: "Nguyễn Văn A",
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            {/* IMAGE */}
            <img
                src={course.image}
                alt={course.title}
                className="w-full h-72 object-cover rounded-2xl mb-8"
            />

            {/* TITLE */}
            <h1 className="text-3xl font-bold mb-4">
                {course.title}
            </h1>

            {/* META */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                </div>

                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {course.createdBy}
                </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-700 leading-relaxed">
                {course.description}
            </p>
        </div>
    );
};

export default CourseDetailPage;