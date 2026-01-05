import ContestSection from "@/components/contest/ContestSection";
import CourseSection from "@/components/course/CourseSection";
import PracticeSection from "@/components/practice/PracticeSection";

const HomePage = () => {
    return (
        <>
            <CourseSection />
            <ContestSection />
            <PracticeSection />
        </>
    );
};

export default HomePage;
