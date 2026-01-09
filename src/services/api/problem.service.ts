import axiosInstance from "@/services/api/axios";
import type { ProblemListResponse, ProblemDetailResponse, CreateLessonPayload, ModifyLessonRequest } from "./problem.types";
import type { ApiResponse } from "./course.types";

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
export async function getProblemById(id: number) {
    const res = await axiosInstance.get<ProblemDetailResponse>(
        "/problems/get-by-id",
        {
            params: { id },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không lấy được bài tập");
    }

    return res.data.data;
}
export async function createLesson(payload: CreateLessonPayload) {
    const res = await axiosInstance.post<ApiResponse>(
        "/problems/add",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không tạo được bài tập");
    }
}
export async function modifyLesson(payload: ModifyLessonRequest) {
    const res = await axiosInstance.put<ApiResponse>(
        "/problems/modify",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không tạo được bài tập");
    }
}
export async function deleteLesson(
    lessonId: number
): Promise<void> {
    console.log("Deleting lesson:", lessonId);
}
export async function deleteTestcase(
    id: number
): Promise<void> {
    const res = await axiosInstance.delete<ApiResponse>(
        "/problems/delete-testcase",
        { params: { id } }
    );
    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không xóa được test case");
    }
}

export async function getProblemsCreated(
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