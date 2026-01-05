import axiosInstance from "@/services/api/axios";
import type { ProblemListResponse } from "./problem.types";

export async function getAllProblems(
    page: number,
    pageSize: number,
    difficulty?: "easy" | "medium" | "hard"
) {
    const res = await axiosInstance.get<ProblemListResponse>(
        "/problems/get-all",
        {
            params: {
                page,
                pageSize,
                ...(difficulty ? { difficulty } : {}),
            },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Không lấy được danh sách bài luyện tập"
        );
    }

    return res.data.data;
}
export async function searchProblems(
    keyword: string,
    page: number,
    pageSize: number
) {
    const res = await axiosInstance.get<ProblemListResponse>(
        "/problems/search",
        {
            params: {
                title: keyword,
                page,
                pageSize,
            },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Search problem failed"
        );
    }

    return res.data.data;
}