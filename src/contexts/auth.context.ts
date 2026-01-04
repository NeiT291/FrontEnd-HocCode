import { createContext } from "react";
import type { UserInfo } from "@/services/api/user.service";

export interface AuthContextType {
    user: UserInfo | null;
    isAuthenticated: boolean;
    setUser: (user: UserInfo | null) => void;
}

export const AuthContext =
    createContext<AuthContextType | null>(null);