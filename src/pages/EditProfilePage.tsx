import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "@/assets/default-avatar.png";
import toast from "react-hot-toast";
import {
    getMyProfile,
    updateMyProfile,
    uploadAvatar,
} from "@/services/api/profile.service";
import type {
    UserProfile,
    UpdateProfilePayload,
} from "@/services/api/profile.types";

const EditProfilePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [form, setForm] = useState<UpdateProfilePayload>({
        displayName: "",
        bio: "",
        dob: "",
        phone: "",
        address: "",
    });

    /* ================= LOAD PROFILE ================= */
    useEffect(() => {
        getMyProfile().then((data) => {
            setProfile(data);
            setForm({
                displayName: data.displayName || "",
                bio: data.bio || "",
                dob: data.dob || "",
                phone: data.phone || "",
                address: data.address || "",
            });
            setAvatarPreview(data.avatarUrl || DefaultAvatar);
        });
    }, []);

    /* ================= HANDLERS ================= */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarSelect = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setAvatarPreview(preview);

        try {
            setUploadingAvatar(true);
            const res = await uploadAvatar(file);
            setAvatarPreview(res.avatarUrl);
        } catch {
            alert("Upload avatar thất bại");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            await updateMyProfile(form);
            navigate("/profile");
        } catch {
            toast.error("Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    if (!profile) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-20 text-center text-gray-500">
                Đang tải thông tin cá nhân...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-16">
                {/* ================= HEADER ================= */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Thông tin cá nhân
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Cập nhật thông tin để cá nhân hóa trải nghiệm của bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* ================= AVATAR CARD ================= */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <img
                                    src={avatarPreview || "/default-avatar.png"}
                                    alt="avatar"
                                    className="
                                    w-40 h-40 rounded-full object-cover
                                    ring-4 ring-white shadow-xl
                                    transition
                                    "
                                />

                                {/* overlay */}
                                <button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={uploadingAvatar}
                                    className="
                                    absolute inset-0 rounded-full
                                    bg-gradient-to-t from-black/70 via-black/40 to-black/20
                                    text-white text-sm font-medium
                                    opacity-0 group-hover:opacity-100
                                    flex items-center justify-center
                                    transition
                                    "
                                >
                                    {uploadingAvatar
                                        ? "Đang tải..."
                                        : "Đổi ảnh đại diện"}
                                </button>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarSelect}
                            />

                            <p className="mt-4 text-sm text-gray-500 text-center">
                                JPG hoặc PNG • Tối đa 5MB
                            </p>
                        </div>
                    </div>

                    {/* ================= FORM CARD ================= */}
                    <div className="md:col-span-2 bg-white rounded-2xl shadow p-8 space-y-6">
                        <Field label="Tên hiển thị">
                            <input
                                name="displayName"
                                value={form.displayName}
                                onChange={handleChange}
                                placeholder="Nhập tên hiển thị"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Giới thiệu">
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Viết vài dòng giới thiệu về bạn"
                                className={inputClass}
                            />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Ngày sinh">
                                <input
                                    type="date"
                                    name="dob"
                                    value={form.dob}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Số điện thoại">
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="0123456789"
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        <Field label="Địa chỉ">
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Hà Nội"
                                className={inputClass}
                            />
                        </Field>

                        {/* ================= ACTIONS ================= */}
                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <button
                                onClick={() => navigate("/profile")}
                                className="
                                px-5 py-2 rounded-lg border
                                text-gray-700
                                hover:bg-gray-50 transition
                                "
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="
                                px-6 py-2 rounded-lg
                                bg-blue-600 text-white font-medium
                                hover:bg-blue-700 transition
                                disabled:opacity-60
                                "
                            >
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;

/* ================= SMALL UI ================= */

const inputClass = `
w-full rounded-xl border border-gray-300
px-4 py-2.5 text-sm
focus:outline-none focus:ring-2 focus:ring-blue-500/30
transition
`;

const Field = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
            {label}
        </label>
        {children}
    </div>
);
