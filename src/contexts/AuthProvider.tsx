import { useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import type { UserInfo } from "@/services/api/user.service";
import { getMyInfo } from "@/services/api/user.service";

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            return;
        }

        // 👉 AUTO LOAD USER KHI F5
        getMyInfo()
            .then((data) => {
                setUser(data);
            })
            .catch(() => {
                // token không hợp lệ / hết hạn
                localStorage.removeItem("access_token");
                setUser(null);
            });
    }, []);

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