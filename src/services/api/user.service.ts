import axiosInstance from "@/services/api/axios";

/* ================= TYPES ================= */

export interface Role {
    id: number;
    name: "ADMIN" | "USER";
}

export interface UserInfo {
    displayName: string | null;
    avatarUrl: string | null;
    email: string | null;
    role: Role;
    active: boolean;
}

interface MyInfoResponse {
    code: number;
    message: string;
    data: UserInfo;
}

/* ================= API ================= */

export async function getMyInfo(): Promise<UserInfo> {
    const res = await axiosInstance.get<MyInfoResponse>(
        "/users/my-info"
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message);
    }

    return res.data.data;
}


export interface RegisterRequest {
    username: string;
    password: string;
    repassword: string;
    display_name: string;
    email: string;
}

interface RegisterResponse {
    code: number;
    message: string;
}
/* ================= API ================= */

export async function registerUser(
    payload: RegisterRequest
): Promise<void> {
    const res = await axiosInstance.post<RegisterResponse>(
        "/users/register",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Đăng ký thất bại");
    }
}