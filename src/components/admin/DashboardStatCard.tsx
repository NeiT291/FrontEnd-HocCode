import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
    link: string;
    icon: LucideIcon;
    label: string;
    value: number | string;
    color?: "blue" | "green" | "purple" | "orange" | "red";
}

const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
};

export default function DashboardStatCard({
    link,
    icon: Icon,
    label,
    value,
    color = "blue",
}: Props) {
    const nav = useNavigate();
    const linkTo = () => {
        nav(link)
    }
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition" onClick={linkTo}>
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                    className={`w-12 h-12 flex items-center justify-center rounded-xl ${colorMap[color]}`}
                >
                    <Icon size={24} />
                </div>

                {/* Content */}
                <div>
                    <p className="text-gray-500 text-sm">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}
