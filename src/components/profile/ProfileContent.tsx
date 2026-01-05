interface Props {
    mainTab: string;
    subTab: string;
}

const ProfileContent = ({ mainTab, subTab }: Props) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-gray-600">
                Hiển thị danh sách{" "}
                <strong>{subTab}</strong>{" "}
                <strong>{mainTab === "joined" ? "đã tham gia" : "đã tạo"}</strong>
            </p>

            {/* Sau này thay bằng list card thật */}
        </div>
    );
};

export default ProfileContent;
