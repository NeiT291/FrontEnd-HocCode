import CreatedCourseList from "@/components/profile/lists/CreatedCourseList";
import JoinedCourseList from "@/components/profile/lists/JoinedCourseList";
/* ================= TYPES ================= */

type MainTab = "joined" | "created";
type SubTab = "course" | "class" | "practice" | "contest";

interface Props {
    mainTab: MainTab;
    subTab: SubTab;
}

/* ================= PAGE ================= */

const ProfileContent = ({ mainTab, subTab }: Props) => {
    if (mainTab === "created" && subTab === "course") {
        return <CreatedCourseList />;
    }


    if (mainTab === "joined" && subTab === "course") {
        return <JoinedCourseList />;
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
            Hiển thị danh sách{" "}
            <strong>{subTab}</strong>{" "}
            <strong>
                {mainTab === "joined" ? "đã tham gia" : "đã tạo"}
            </strong>{" "}
            (chưa tích hợp)
        </div>
    );
};

export default ProfileContent;
