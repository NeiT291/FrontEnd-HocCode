import axiosInstance from "@/services/api/axios";
import type { ClassListResponse } from "./class.types";

export async function getAllClasses(
    page: number,
    pageSize: number
) {
    const res = await axiosInstance.get<ClassListResponse>(
        "/class/get-all",
        {
            params: { page, pageSize },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không lấy được danh sách lớp học");
    }

    return res.data.data;
}
export async function searchClasses(
    title: string,
    page: number,
    pageSize: number
) {
    const res = await axiosInstance.get<ClassListResponse>(
        "/class/search",
        {
            params: {
                title,
                page,
                pageSize,
            },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Không tìm kiếm được lớp học"
        );
    }

    return res.data.data;
}