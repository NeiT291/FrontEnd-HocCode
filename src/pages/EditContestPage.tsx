import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Camera,
    Plus,
    Trash2,
    Code,
    BookOpen,
    Pencil,
} from "lucide-react";
import toast from "react-hot-toast";

import type { Problem } from "@/services/api/problem.types";
import type { Contest } from "@/services/api/contest.types";
import {
    getContestById,
    modifyContest,
    setContestThumbnail
} from "@/services/api/contest.service";
import CreatePracticeModal from "@/components/practice/CreatePracticeModel";
import { deleteProblem } from "@/services/api/problem.service";
import EditPracticeModal from "@/components/practice/EditPracticeModel";

/* ================= UTILS ================= */

function toLocalDateTime(value: string) {
    // input datetime-local -> yyyy-MM-dd HH:mm:ss
    return value.replace("T", " ") + ":00";
}

function fromApiToInput(value: string) {
    // 2026-01-11T18:43:20.715Z -> 2026-01-11T18:43
    return value.slice(0, 16);
}

/* ================= PAGE ================= */

export default function EditContestPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [contest, setContest] = useState<Contest | null>(
        null
    );

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [previewImage, setPreviewImage] = useState<string | null>(
        null
    );
    const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [openPracticeModal, setOpenPracticeModal] =
        useState(false);

    /* ================= LOAD ================= */
    const reloadContest = async () => {
        if (!id) return;
        const data = await getContestById(Number(id));
        setContest(data);
        setProblems(data.problems);
    };
    useEffect(() => {
        if (!id) return;

        const fetchContest = async () => {
            try {
                const data = await getContestById(Number(id));

                setContest(data);
                setTitle(data.title);
                setDescription(data.description ?? "");
                setStartTime(fromApiToInput(data.startTime));
                setEndTime(fromApiToInput(data.endTime));
                setProblems(data.problems ?? []);
            } catch {
                toast.error("Không tải được cuộc thi");
            } finally {
                setLoading(false);
            }
        };

        fetchContest();
    }, [id]);

    /* ================= SAVE ================= */
    const handleDeleteProblem = async (problemId: number) => {
        if (!confirm("Xóa vấn đề này?")) return;
        await deleteProblem(problemId);
        reloadContest();
    };

    const handleSave = async () => {
        if (!contest) return;

        if (!title.trim()) {
            toast.error("Tiêu đề không được để trống");
            return;
        }

        if (!startTime || !endTime) {
            toast.error("Vui lòng chọn thời gian");
            return;
        }

        if (new Date(startTime) >= new Date(endTime)) {
            toast.error(
                "Thời gian kết thúc phải sau thời gian bắt đầu"
            );
            return;
        }

        try {
            setSaving(true);

            const updated = await modifyContest({
                id: contest.id,
                title: title.trim(),
                description,
                startTime: toLocalDateTime(startTime),
                endTime: toLocalDateTime(endTime),
            });

            setContest(updated);
            toast.success("Đã lưu thay đổi cuộc thi");
        } catch {
            toast.error("Lưu thất bại");
        } finally {
            setSaving(false);
        }
    };

    /* ================= THUMBNAIL ================= */

    const handleUploadThumbnail = async (file: File) => {
        if (!contest) return;
        try {
            setUploading(true);
            setPreviewImage(URL.createObjectURL(file));
            const url = await setContestThumbnail(contest.id, file);
            setContest({ ...contest, thumbnailUrl: url });
            toast.success("Đã cập nhật ảnh");
        } finally {
            setUploading(false);
        }
    };

    /* ================= PROBLEM ================= */

    const addProblem = (problem: Problem) => {
        setProblems((prev) => [...prev, problem]);
        toast.success("Đã thêm vấn đề");
    };

    /* ================= RENDER ================= */

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-10 shadow text-center text-gray-500">
                Đang tải cuộc thi...
            </div>
        );
    }

    if (!contest) {
        return (
            <div className="bg-white rounded-2xl p-10 shadow text-center text-red-500">
                Không tìm thấy cuộc thi
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 pb-24 space-y-10">
            {/* HEADER */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-gray-50 py-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-600"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </button>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white disabled:opacity-50"
                >
                    <Save size={16} />
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>

            <h1 className="text-3xl font-bold">
                Chỉnh sửa cuộc thi
            </h1>

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* THUMBNAIL */}
                <div className="bg-white rounded-2xl p-6 shadow space-y-4">
                    <h2 className="font-semibold">Ảnh đại diện</h2>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                        {previewImage || contest.thumbnailUrl ? (
                            <img
                                src={
                                    previewImage ?? contest.thumbnailUrl ?? ""
                                }
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                Chưa có ảnh
                            </div>
                        )}

                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 cursor-pointer">
                            <Camera className="text-white" />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const f =
                                        e.target.files?.[0];
                                    if (f)
                                        handleUploadThumbnail(
                                            f
                                        );
                                }}
                            />
                        </label>
                    </div>

                    {uploading && (
                        <p className="text-sm">
                            Đang upload ảnh...
                        </p>
                    )}
                </div>

                {/* INFO */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow space-y-6">
                    <div>
                        <label className="text-sm font-medium">
                            Tiêu đề
                        </label>
                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            className="w-full mt-1 px-4 py-2.5 border rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Mô tả
                        </label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            className="w-full mt-1 px-4 py-2.5 border rounded-xl"
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
                                    setStartTime(
                                        e.target.value
                                    )
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
                                    setEndTime(
                                        e.target.value
                                    )
                                }
                                className="w-full mt-1 px-3 py-2 border rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* PROBLEMS */}
            <div className="bg-white rounded-2xl p-6 shadow space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Vấn đề trong cuộc thi
                    </h2>

                    <button
                        onClick={() =>
                            setOpenPracticeModal(true)
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white"
                    >
                        <Plus size={16} />
                        Thêm vấn đề
                    </button>
                </div>

                {problems.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">
                        Chưa có vấn đề nào
                    </p>
                ) : (
                    <div className="space-y-3">
                        {problems.map((p, i) => (
                            <div
                                key={p.id}
                                className="flex items-center gap-2 border rounded-lg px-3 py-2"
                            >

                                <span className="text-sm text-gray-400">
                                    {i + 1}
                                </span>

                                {p.isTheory ? (
                                    <BookOpen size={16} />
                                ) : (
                                    <Code size={16} />
                                )}

                                <span className="font-medium flex-1">
                                    {p.title}
                                </span>


                                <Pencil
                                    size={14}
                                    className="cursor-pointer text-gray-500 hover:text-gray-900"
                                    onClick={() => {
                                        setEditingProblem(p);
                                    }}
                                />

                                {/* DELETE */}
                                <Trash2
                                    size={14}
                                    className="cursor-pointer text-red-500"
                                    onClick={() => handleDeleteProblem(p.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PRACTICE MODAL */}
            {openPracticeModal && (
                <CreatePracticeModal
                    contestId={contest.id}
                    isTheory={false}
                    onClose={() =>
                        setOpenPracticeModal(false)
                    }
                    onSubmit={addProblem}
                />
            )}
            {editingProblem && (
                <EditPracticeModal
                    practice={editingProblem}
                    isPublic={false}
                    onClose={() => setEditingProblem(null)}
                    onSubmit={() => {
                        setEditingProblem(null);
                        reloadContest();
                    }}
                />
            )}
        </div>
    );
}
