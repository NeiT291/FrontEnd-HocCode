import { useState } from "react";
import { AuthContext } from "./auth.context";
import type { UserInfo } from "@/services/api/user.service";

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<UserInfo | null>(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
