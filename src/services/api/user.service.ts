import axiosInstance from "@/services/api/axios";
import type { UpdateUserRequest, RegisterRequest, User, UserResponse } from "@/services/api/user.types";

export async function getMyInfo(): Promise<User> {
    const res = await axiosInstance.get<UserResponse>(
        "/users/my-info"
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message);
    }

    return res.data.data;
}

export async function registerUser(
    payload: RegisterRequest
): Promise<void> {
    const res = await axiosInstance.post<UserResponse>(
        "/users/register",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Đăng ký thất bại");
    }
}
export async function updateMyProfile(payload: UpdateUserRequest) {
    const res = await axiosInstance.put(
        "/users/update",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Cập nhật thất bại");
    }

    return res.data.data;
}

export async function uploadAvatar(
    file: File
): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axiosInstance.post(
        "/users/set-avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    console.log("Upload response:", res);
    return {
        avatarUrl: URL.createObjectURL(file),
    };
}
