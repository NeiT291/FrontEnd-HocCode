import {
    Search,
    Users,
    BookOpen,
    Trophy,
    Code,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type SearchType = "class" | "course" | "contest" | "practice";

const FILTERS: {
    key: SearchType;
    label: string;
    icon: React.ReactNode;
}[] = [
        { key: "class", label: "Lớp học", icon: <Users size={16} /> },
        { key: "course", label: "Khóa học", icon: <BookOpen size={16} /> },
        { key: "contest", label: "Cuộc thi", icon: <Trophy size={16} /> },
        { key: "practice", label: "Luyện tập", icon: <Code size={16} /> },
    ];

export default function SearchSection() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [type, setType] = useState<SearchType>("course");

    const handleSearch = () => {
        if (!keyword.trim()) return;
        navigate(
            `/search?q=${encodeURIComponent(keyword)}&type=${type}`
        );
    };

    return (
        <section className="relative mb-16">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="h-full w-full bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-3xl" />
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-4 text-center">

                {/* Search box */}
                <div className="mt-10">
                    <div
                        className="
              flex items-center
              bg-white
              rounded-2xl
              shadow-lg
              border
              px-5 py-4
              focus-within:ring-2
              focus-within:ring-gray-900/10
              transition
            "
                    >
                        <Search className="text-gray-400 mr-3" />

                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Tìm kiếm"
                            className="
                flex-1
                text-base
                outline-none
                placeholder:text-gray-400
              "
                        />

                        <button
                            onClick={handleSearch}
                            className="
                ml-4
                px-6 py-3
                rounded-xl
                bg-gray-900
                text-white
                hover:bg-gray-800
                transition
              "
                        >
                            Tìm
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {FILTERS.map((f) => {
                        const active = f.key === type;

                        return (
                            <button
                                key={f.key}
                                onClick={() => setType(f.key)}
                                className={`
                  flex items-center gap-2
                  px-4 py-2 rounded-full text-sm
                  transition
                  ${active
                                        ? "bg-gray-900 text-white shadow"
                                        : "bg-white border hover:bg-gray-50"
                                    }
                `}
                            >
                                {f.icon}
                                {f.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}