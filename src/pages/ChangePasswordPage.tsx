import { useState } from "react";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
import { changePassword } from "@/services/api/user.service";
import { logout } from "@/services/api/auth.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* ================= SUBMIT ================= */
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới không khớp");
            return;
        }

        try {
            setLoading(true);


            await changePassword({ oldPassword: oldPassword, newPassword: newPassword });
            await logout();
            toast.success("Đổi mật khẩu thành công");
            navigate("/login")
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.log(err)
            setError("Mật khẩu cũ không đúng");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-10 bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
                    Đổi mật khẩu
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* ===== OLD PASSWORD ===== */}
                    <PasswordField
                        label="Mật khẩu cũ"
                        value={oldPassword}
                        onChange={setOldPassword}
                        show={showOld}
                        setShow={setShowOld}
                    />

                    {/* ===== NEW PASSWORD ===== */}
                    <PasswordField
                        label="Mật khẩu mới"
                        value={newPassword}
                        onChange={setNewPassword}
                        show={showNew}
                        setShow={setShowNew}
                    />

                    {/* ===== CONFIRM PASSWORD ===== */}
                    <PasswordField
                        label="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        show={showConfirm}
                        setShow={setShowConfirm}
                    />

                    {/* ===== ERROR / SUCCESS ===== */}
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                    {success && (
                        <p className="text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    {/* ===== SUBMIT ===== */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full flex items-center justify-center gap-2
                            px-4 py-3 rounded-xl
                            bg-gray-900 text-white font-medium
                            hover:bg-gray-800
                            disabled:opacity-50
                        "
                    >
                        <Save size={18} />
                        {loading ? "Đang lưu..." : "Đổi mật khẩu"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ================= COMPONENT ================= */

function PasswordField({
    label,
    value,
    onChange,
    show,
    setShow,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    setShow: (v: boolean) => void;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>

            <div className="relative">
                <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="
                        w-full pl-10 pr-10 py-2.5 rounded-xl
                        border border-gray-300
                        focus:outline-none focus:ring-2 focus:ring-gray-900
                    "
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
}
