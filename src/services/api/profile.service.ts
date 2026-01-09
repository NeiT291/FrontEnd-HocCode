import axiosInstance from "@/services/api/axios";
import type { UserProfile } from "@/services/api/profile.types";
import type { UpdateProfilePayload } from "@/services/api/profile.types";


interface MyInfoResponse {
    code: number;
    message: string;
    data: UserProfile;
}

export async function getMyProfile(): Promise<UserProfile> {
    const res = await axiosInstance.get<MyInfoResponse>(
        "/users/my-info"
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không lấy được thông tin profile");
    }

    return res.data.data;
}
export async function updateMyProfile(payload: UpdateProfilePayload) {
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