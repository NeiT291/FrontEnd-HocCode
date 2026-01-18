import { Search } from "lucide-react";
import { useState } from "react";

interface Props {
    placeholder?: string;
    onSearch: (value: string) => void;
}

export default function SearchBar({
    placeholder = "Tìm kiếm...",
    onSearch,
}: Props) {
    const [value, setValue] = useState("");

    const handleSearch = () => {
        onSearch(value.trim());
    };

    return (
        <div className="flex gap-2">
            {/* Input */}
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 inset-y-0 my-auto text-gray-400"
                />
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    placeholder={placeholder}
                    className="
                        h-10 w-64 pl-10 pr-3 rounded-xl border
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        bg-white
                    "
                />
            </div>

            {/* Button */}
            <button
                onClick={handleSearch}
                className="
                    px-4 py-2 rounded-xl
                    bg-blue-600 text-white
                    hover:bg-blue-700 transition
                "
            >
                Tìm
            </button>
        </div>
    );
}
