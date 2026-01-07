import axiosInstance from "@/services/api/axios";
import type { RunCodeResponse } from "@/services/api/runcode.types";


export async function runCodeApi(
    language: "cpp" | "java" | "python",
    code: string
): Promise<RunCodeResponse> {
    const res = await axiosInstance.post<{
        code: number;
        message: string;
        data: RunCodeResponse;
    }>("/run-code", {
        language,
        code,
    });

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Run code failed");
    }

    return res.data.data;
}