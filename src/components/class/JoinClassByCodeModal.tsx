import { X, KeyRound } from "lucide-react";

export default function JoinClassByCodeModal({
    onClose,
}: {
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                        Tham gia lớp bằng mã
                    </h3>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* Input */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">
                        Mã lớp học
                    </label>
                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                        <KeyRound size={16} className="text-gray-400" />
                        <input
                            placeholder="VD: ABC123"
                            className="flex-1 outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Action */}
                <button
                    className="
            w-full px-4 py-2 rounded-lg
            bg-gray-900 text-white
            hover:bg-gray-800
          "
                >
                    Tham gia
                </button>
            </div>
        </div>
    );
}