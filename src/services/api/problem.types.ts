import type { UserSummary } from "@/services/api/course.types";

export interface Testcase {
    id: number;
    input: string;
    expectedOutput: string;
    isSample: boolean;
    position: number;
}

export interface ProblemApi {
    id: number;
    title: string;
    slug: string;
    description: string;
    timeLimitMs: number;
    memoryLimitKb: number;
    difficulty: "easy" | "medium" | "hard";
    createdBy: UserSummary;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    testcases: Testcase[];
}

export interface ProblemPageData {
    total_records: number;
    total_records_page: number;
    current_page: number;
    total_pages: number;
    prev_pages: number;
    next_pages: number;
    data: ProblemApi[];
}

export interface ProblemListResponse {
    code: number;
    message: string;
    data: ProblemPageData;
}
export interface ProblemDetailResponse {
    code: number;
    message: string;
    data: ProblemApi;
}