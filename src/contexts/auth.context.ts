import { createContext } from "react";
import type { User } from "@/services/api/user.types";

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
}

export const AuthContext =
    createContext<AuthContextType | null>(null);