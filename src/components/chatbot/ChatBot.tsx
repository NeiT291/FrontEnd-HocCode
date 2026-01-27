import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

type ChatMessage = {
    role: "user" | "bot";
    content: string;
};

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "bot", content: "👋 Xin chào! Tôi là trợ lý AI, bạn cần hỗ trợ gì?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const endRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    /* ================== HIDE LOGIC ================== */

    const HIDDEN_ROUTES = ["/login"];

    const isPracticeContest =
        location.pathname.startsWith("/practice/") &&
        new URLSearchParams(location.search).has("contestId");

    const isHidden =
        HIDDEN_ROUTES.some((path) => location.pathname.startsWith(path)) ||
        isPracticeContest;

    /* ================== AUTO SCROLL ================== */

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open, loading]);

    /* ================== SEND MESSAGE ================== */

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input;
        setInput("");

        // Hiển thị message user ngay
        setMessages((prev) => [
            ...prev,
            { role: "user", content: userMessage },
        ]);

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/v1/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "*/*",
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: userMessage,
                        },
                    ],
                }),
            });

            if (!res.ok) {
                throw new Error("Chat API error");
            }

            const data = await res.json(); // { reply: string }

            setMessages((prev) => [
                ...prev,
                { role: "bot", content: data.reply },
            ]);
        } catch {

            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: "Vui lòng thử lại sau.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (isHidden) return null;

    /* ================== RENDER ================== */

    return (
        <div className="fixed bottom-4 right-4 z-[9999]">
            <div className="flex flex-col items-end">
                {/* ================= CHAT PANEL ================= */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="mb-4 w-96 h-[28rem] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden border border-gray-300"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold">Trợ lý AI</div>
                                    <div className="text-xs opacity-80">Online</div>
                                </div>
                                <button onClick={() => setOpen(false)}>
                                    <X className="w-5 h-5 cursor-pointer" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
                                <AnimatePresence initial={false}>
                                    {messages.map((m, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className={`flex ${m.role === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm break-words whitespace-normal ${m.role === "user"
                                                    ? "bg-blue-500 text-white rounded-br-md"
                                                    : "bg-white text-slate-800 rounded-bl-md"
                                                    }`}
                                            >
                                                <div className="break-words
                                                        whitespace-normal

                                                        [&_pre]:whitespace-pre-wrap
                                                        [&_pre]:break-words
                                                        [&_pre]:overflow-x-auto

                                                        [&_code]:break-words"
                                                    dangerouslySetInnerHTML={{
                                                        __html: m.content,
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}

                                    {loading && (
                                        <div className="text-sm text-slate-400">
                                            Đang trả lời...
                                        </div>
                                    )}
                                </AnimatePresence>
                                <div ref={endRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t flex gap-2 border-gray-300">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Nhập câu hỏi về công nghệ..."
                                    disabled={loading}
                                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={sendMessage}
                                    disabled={loading}
                                    className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-50 cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ================= FLOATING BUTTON ================= */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(!open)}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-xl cursor-pointer"
                >
                    <MessageCircle className="w-7 h-7" />
                </motion.button>
            </div>
        </div>
    );
}
