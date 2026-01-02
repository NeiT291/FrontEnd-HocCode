import ContestSection from "@/components/contest/ContestSection";
import CourseSection from "@/components/course/CourseSection";
import PracticeSection from "@/components/practice/PracticeSection";

const HomePage = () => {
    return (
        <>

            {/* COURSES */}
            <CourseSection />
            <ContestSection />
            <PracticeSection />
        </>
    );
};

export default HomePage;
