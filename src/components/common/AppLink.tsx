import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import './AppLink.css';
type Variant = "primary" | "outline" | "text";

interface AppLinkProps {
    to: string;
    children: ReactNode;
    variant?: Variant;
    className?: string;
}

const baseClass =
    "inline-flex items-center gap-2 transition rounded-xl font-medium";

const variantClass: Record<Variant, string> = {
    primary: "px-6 py-3 bg-blue-600 text-white hover:bg-blue-700",
    outline:
        "px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100",
    text: "text-blue-600 hover:underline",
};

const AppLink = ({
    to,
    children,
    variant = "outline",
    className = "",
}: AppLinkProps) => {
    return (
        <Link
            to={to}
            className={`${baseClass} ${variantClass[variant]} ${className}`}
        >
            {children}
        </Link>
    );
};

export default AppLink;
