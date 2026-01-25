import CreatedCourseList from "@/components/profile/lists/CreatedCourseList";
import JoinedCourseList from "@/components/profile/lists/JoinedCourseList";
import CreatedContestList from "@/components/profile/lists/CreatedContestList";
import CreatedPracticeList from "@/components/profile/lists/CreatedPracticeList";
import JoinedContestList from "@/components/profile/lists/JoinedContestList";
import JoinedPracticeList from "@/components/profile/lists/JoinedPracticeList";
/* ================= TYPES ================= */

type MainTab = "joined" | "created";
type SubTab = "course" | "practice" | "contest";

interface Props {
    mainTab: MainTab;
    subTab: SubTab;
}

/* ================= PAGE ================= */

const ProfileContent = ({ mainTab, subTab }: Props) => {
    if (mainTab === "created" && subTab === "course") {
        return <CreatedCourseList />;
    }
    if (mainTab === "created" && subTab === "contest") {
        return <CreatedContestList />;
    }
    if (mainTab === "created" && subTab === "practice") {
        return <CreatedPracticeList />;
    }

    if (mainTab === "joined" && subTab === "course") {
        return <JoinedCourseList />;
    }
    if (mainTab === "joined" && subTab === "contest") {
        return <JoinedContestList />;
    }
    if (mainTab === "joined" && subTab === "practice") {
        return <JoinedPracticeList />;
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
            Hiển thị danh sách{" "}
            <strong>{subTab}</strong>{" "}
            <strong>
                {mainTab === "joined" ? "đã tham gia" : "đã tạo"}
            </strong>{" "}
        </div>
    );
};

export default ProfileContent;
