const FilterButton = ({
    children,
    active,
    color = "gray",
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    color?: "gray" | "green" | "yellow" | "red";
    onClick: () => void;
}) => {
    const colors = {
        gray: "border-gray-300 text-gray-700",
        green: "border-green-500 text-green-600",
        yellow: "border-yellow-500 text-yellow-600",
        red: "border-red-500 text-red-600",
    };

    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2 rounded-full border text-sm
                transition-all duration-200
                ${active
                    ? "bg-gray-900 text-white border-gray-900 scale-105 shadow"
                    : `${colors[color]} hover:bg-gray-50 hover:scale-105`
                }
                active:scale-95
            `}
        >
            {children}
        </button>
    );
}
export default FilterButton;