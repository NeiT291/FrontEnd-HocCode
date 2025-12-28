import ContestSection from "@/components/contest/ContestSection";
import CourseSection from "@/components/course/CourseSection";
import PracticeSection from "@/components/practice/PracticeSection";

const HomePage = () => {
    return (
        <>
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Học lập trình cùng <span className="text-blue-600">HOCCODE</span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Nền tảng học lập trình từ cơ bản đến nâng cao, có bài tập thực hành và
                    thi online.
                </p>
            </section>
            {/* COURSES */}
            <CourseSection />
            <ContestSection />
            <PracticeSection />
        </>
    );
};

export default HomePage;
