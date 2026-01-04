import axiosInstance from "@/services/api/axios";
import type { ProblemListResponse } from "./problem.types";

export async function getAllProblems(
    page = 1,
    pageSize = 6
) {
    const res = await axiosInstance.get<ProblemListResponse>(
        "/problems/get-all",
        {
            params: { page, pageSize },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Không lấy được danh sách bài luyện tập"
        );
    }

    return res.data.data;
}