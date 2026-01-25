import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Calendar, X } from "lucide-react";
import toast from "react-hot-toast";
import { getContestCreated, createContest, deleteContest } from "@/services/api/contest.service";
import type { Contest } from "@/services/api/contest.types"
/* ================= COMPONENT ================= */

export default function CreatedContestList() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [contests, setContests] = useState<Contest[]>([]);
    const [error, setError] = useState("");
    /* ===== CREATE FORM STATE ===== */

    const [openCreate, setOpenCreate] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const fetchContests = async () => {
        try {
            setLoading(true);
            const data = await getContestCreated(1, 10);
            setContests(data.data);
        } catch (err) {
            console.error(err);
            setError("Không tải được danh sách cuộc thi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContests();
    }, []);

    /* ================= ACTIONS ================= */
    function toLocalDateTime(value: string) {
        return value.replace("T", " ") + ":00"; // yyyy-MM-dd HH:mm:ss
    }
    const handleCreate = async () => {
        if (!title.trim()) {
            toast.error("Tiêu đề không được để trống");
            return;
        }

        if (!startTime || !endTime) {
            toast.error("Vui lòng chọn thời gian");
            return;
        }

        if (new Date(startTime) >= new Date(endTime)) {
            toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
            return;
        }

        if (submitting) return;

        try {
            setSubmitting(true);

            const newContest = await createContest({
                title: title.trim(),
                description,
                startTime: toLocalDateTime(startTime),
                endTime: toLocalDateTime(endTime),
            });

            toast.success("Tạo cuộc thi thành công");

            // reset form
            setTitle("");
            setDescription("");
            setStartTime("");
            setEndTime("");
            setOpenCreate(false);
            navigate(`/contests/edit/${newContest.id}`)
            fetchContests();
        } catch (err) {
            console.log(err)
            toast.error("Tạo cuộc thi thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoading(true);
            await deleteContest(id);   // ⬅️ đợi xóa xong
            await fetchContests();     // ⬅️ reload danh sách
            console.log("Deleted contest:", id);
        } catch (err) {
            console.error("Delete contest error:", err);
            setError("Xóa cuộc thi thất bại");
        } finally {
            setLoading(false);
        }
    };

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow text-center text-gray-500">
                Đang tải cuộc thi...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-8 shadow space-y-8">
            {/* HEADER */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold">
                        Cuộc thi đã tạo
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý và chỉnh sửa các cuộc thi của bạn
                    </p>
                </div>

                <button
                    onClick={() => setOpenCreate(true)}
                    className="
                        inline-flex items-center gap-2
                        px-5 py-2.5 rounded-xl
                        bg-gray-900 text-white text-sm font-medium
                        hover:bg-gray-800
                    "
                >
                    <Plus size={16} />
                    Tạo cuộc thi
                </button>
            </div>
            {openCreate && (
                <div className="border rounded-2xl p-6 space-y-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                            Tạo cuộc thi mới
                        </h3>
                        <button onClick={() => setOpenCreate(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Tiêu đề
                        </label>
                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            className="w-full mt-1 px-4 py-2 border rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Mô tả
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="w-full mt-1 px-4 py-2 border rounded-xl resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">
                                Bắt đầu
                            </label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) =>
                                    setStartTime(e.target.value)
                                }
                                className="w-full mt-1 px-3 py-2 border rounded-xl"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Kết thúc
                            </label>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) =>
                                    setEndTime(e.target.value)
                                }
                                className="w-full mt-1 px-3 py-2 border rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={() => setOpenCreate(false)}
                            className="px-4 py-2 rounded-xl border"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={submitting}
                            className="px-5 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-50"
                        >
                            {submitting
                                ? "Đang tạo..."
                                : "Tạo"}
                        </button>
                    </div>
                </div>
            )}
            {/* EMPTY */}
            {contests.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    Bạn chưa tạo cuộc thi nào
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contests.map((contest) => (
                        <div
                            key={contest.id}
                            className="
                                group relative
                                border rounded-2xl overflow-hidden
                                bg-white
                                hover:shadow-xl hover:-translate-y-1
                                transition-all
                            "
                        >
                            {/* ACTIONS */}
                            <div className="
                                absolute top-3 right-3 z-10
                                flex gap-2
                                opacity-0 group-hover:opacity-100
                            ">
                                <button
                                    onClick={() => navigate(`/contests/edit/${contest.id}`)}
                                    className="p-2 bg-white/90 rounded-lg"
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    onClick={() => handleDelete(contest.id)}
                                    className="p-2 bg-white/90 rounded-lg text-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* CONTENT */}
                            <Link to={`/contests/${contest.id}`}>
                                {/* THUMBNAIL */}
                                {contest.thumbnailUrl ? (
                                    <div className="relative h-40">
                                        <img
                                            src={contest.thumbnailUrl}
                                            alt={contest.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                ) : (
                                    <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                                        Không có ảnh
                                    </div>
                                )}

                                {/* BODY */}
                                <div className="p-5 space-y-2">
                                    <h3 className="font-semibold line-clamp-1">
                                        {contest.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {contest.description}
                                    </p>

                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                                        <Calendar size={14} />
                                        <span>
                                            {new Date(
                                                contest.startTime
                                            ).toLocaleDateString()}
                                            {" "}–{" "}
                                            {new Date(
                                                contest.endTime
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
