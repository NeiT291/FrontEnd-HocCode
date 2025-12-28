import { useParams } from "react-router-dom";

const PracticeDetailPage = () => {
    const { id } = useParams();

    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-4">
                Chi tiết bài luyện #{id}
            </h1>

            <p className="text-gray-600">
                Trang chi tiết bài luyện (sẽ nối API sau)
            </p>
        </div>
    );
};

export default PracticeDetailPage;