const FieldUpdateUser = ({
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
export default FieldUpdateUser;