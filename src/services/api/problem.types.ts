import type { User } from "@/services/api/user.types";

// ================== Request =====================
export interface ProblemRequest {
    id?: number;
    title: string;
    description: string;
    contestId?: number;
    moduleId?: number;
    timeLimitMs: number;
    memoryLimitKb: number;
    difficulty?: string;
    isPublic?: boolean;
    isTheory: boolean;
    position?: number;
    testcases: Testcase[];
}
// ================== Response =====================
export interface ProblemPageResponse {
    code: number;
    message: string;
    data: ProblemPage;
}
export interface ProblemResponse {
    code: number;
    message: string;
    data: Problem;
}
export interface ProblemPage {
    total_records: number;
    total_records_page: number;
    current_page: number;
    total_pages: number;
    prev_pages: number;
    next_pages: number;
    data: Problem[];
}
export interface Problem {
    id: number;
    title: string;
    description: string;
    timeLimitMs: number;
    memoryLimitKb: number;
    difficulty: "easy" | "medium" | "hard";
    createdBy: User;
    isPublic: boolean;
    isTheory: boolean;
    createdAt: string;
    updatedAt: string;
    position: number;
    testcases: Testcase[];
    isActive?: boolean;
}
export interface Testcase {
    id?: number;
    problemId?: number;
    input: string;
    expectedOutput: string;
    isSample: boolean;
    position: number;
}