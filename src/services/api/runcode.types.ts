// ================== Request ======================
export interface RunCodeRequest {
    languageId: number;
    sourceCode: string;
    input: string;
}
export interface RunTestRequest {
    problemId: number;
    languageId: number;
    language: string;
    sourceCode: string;
}

// ================== Response ======================
export interface RunCodeResponse {
    code: number;
    message: string;
    data: RunCode;
}
export interface RunCode {
    stdout: string;
    stderr: string;
    compileOutput: string;
    time: string;
    memory: number;
    statusId: number;
    status: string;
    message: string;
}

export interface RunCodeProblemResponse{
    code: number;
    message: string;
    data: RunCodeProblem;
}
export interface RunCodeProblem{
    problemId: number;
    verdict: string;
    passedCount: number;
    totalCount: number;
    testCaseResult: testCaseResult[];
}
export interface testCaseResult{
    testCaseId: number;
    stdout: string;
    stderr: string;
    compileOutput: string;
    time: string;
    memory: number;
    statusId: number;
    status: string;
    message: string;
}