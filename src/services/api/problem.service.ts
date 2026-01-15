import axiosInstance, { type ApiResponseNoData } from "@/services/api/axios";
import type { ProblemPageResponse, ProblemResponse, ProblemRequest } from "@/services/api/problem.types";

export async function getAllProblems(
    page: number,
    pageSize: number,
    difficulty?: "easy" | "medium" | "hard"
) {
    const res = await axiosInstance.get<ProblemPageResponse>(
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
    const res = await axiosInstance.get<ProblemPageResponse>(
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
    const res = await axiosInstance.get<ProblemResponse>(
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
export async function createLesson(payload: ProblemRequest) {
    const res = await axiosInstance.post<ProblemResponse>(
        "/problems/add",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không tạo được bài tập");
    }
}
export async function modifyLesson(payload: ProblemRequest) {
    const res = await axiosInstance.put<ProblemResponse>(
        "/problems/modify",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không tạo được bài tập");
    }
}
export async function deleteLesson(
    lessonId: number
){
    console.log("Deleting lesson:", lessonId);
}
export async function deleteTestcase(
    id: number
){
    const res = await axiosInstance.delete<ApiResponseNoData>(
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
    const res = await axiosInstance.get<ProblemPageResponse>(
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
export async function createProblem(
    payload: ProblemRequest
) {
   const res = await axiosInstance.post<ProblemResponse>(
        "/problems/add",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Tạo bài tập thất bại");
    }

    return res.data.data;
}
export async function modifyProblem(
    payload: ProblemRequest
) {
   const res = await axiosInstance.put<ProblemResponse>(
        "/problems/modify",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Tạo bài tập thất bại");
    }

    return res.data.data;
}
export async function deleteProblem(
    problemId: number
){
    console.log(problemId);
}