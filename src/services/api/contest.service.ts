import axiosInstance from "@/services/api/axios";
import type { ContestListResponse } from "./contest.types";

export async function getAllContests(
    page = 1,
    pageSize = 6
) {
    const res = await axiosInstance.get<ContestListResponse>(
        "/contest/get-all",
        {
            params: { page, pageSize },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không lấy được danh sách cuộc thi");
    }

    return res.data.data;
}