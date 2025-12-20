import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    required?: boolean;
    icon?: React.ReactNode;
}

const Input = ({
    label,
    error,
    required,
    icon,
    className,
    ...props
}: InputProps) => {
    return (
        <div className="space-y-1">
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
            )}

            {/* Input wrapper */}
            <div className="relative">
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </span>
                )}

                <input
                    {...props}
                    className={clsx(
                        "w-full py-2.5 rounded-xl border bg-white text-gray-800 placeholder-gray-400 transition focus:outline-none",
                        icon ? "pl-11 pr-4" : "px-4",
                        error
                            ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50"
                            : "border-gray-300 focus:ring-2 focus:ring-blue-500 hover:border-gray-400",
                        className
                    )}
                />
            </div>

            {/* Error message */}
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};

export default Input;