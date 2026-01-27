import axiosInstance from "@/services/api/axios";
import type { RunCodeProblemResponse, RunCodeRequest, RunCodeResponse, RunTestRequest } from "@/services/api/runcode.types";


export async function runCodeApi(
    payload: RunCodeRequest
){
    const res = await axiosInstance.post<RunCodeResponse>(
    "/run-code",
    payload
  );
    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Run code failed");
    }

    return res.data.data;
}
export async function runTest(
    payload: RunTestRequest
){
    const res = await axiosInstance.post<RunCodeProblemResponse>(
    "/problems/run-test",
    payload
  );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Run code failed");
    }

    return res.data.data;
}
export async function submitCode(
    payload: RunTestRequest
){
    const res = await axiosInstance.post<RunCodeProblemResponse>(
    "/problems/submit",
    payload
  );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Submit failed");
    }

    return res.data.data;
}