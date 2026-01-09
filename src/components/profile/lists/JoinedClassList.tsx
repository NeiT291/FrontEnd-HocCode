import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClassesJoined } from "@/services/api/class.service";

/* ================= COMPONENT ================= */

const JoinedClassList = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const fetchClasses = async () => {
            if (!mounted) return;

            setLoading(true);
            setError("");

            try {
                const data = await getClassesJoined(1, 10);
                if (mounted) {
                    setClasses(data.data);
                }
            } catch (err: unknown) {
                if (mounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Không tải được danh sách lớp học"
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchClasses();
        return () => {
            mounted = false;
        };
    }, []);

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
                Đang tải lớp học...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-red-500">
                {error}
            </div>
        );
    }

    if (classes.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow text-gray-500">
                Bạn chưa tham gia lớp học nào
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
                Lớp học đã tham gia
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => (
                    <Link
                        key={cls.id}
                        to={`/classes/${cls.id}`}
                        className="
                            border rounded-xl p-4
                            hover:shadow-md hover:border-gray-300
                            transition block
                        "
                    >
                        {/* COURSE THUMBNAIL (nếu có) */}
                        {cls.courses?.[0]?.thumbnailUrl && (
                            <img
                                src={cls.courses[0].thumbnailUrl}
                                alt={cls.courses[0].title}
                                className="w-full h-36 object-cover rounded-lg mb-3"
                            />
                        )}

                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {cls.title}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {cls.description}
                        </p>

                        {/* META */}
                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                            <div>Mã lớp: {cls.code}</div>

                            {cls.courses?.length > 0 && (
                                <div>
                                    Khóa học:{" "}
                                    {cls.courses
                                        .map((c: any) => c.title)
                                        .join(", ")}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default JoinedClassList;
