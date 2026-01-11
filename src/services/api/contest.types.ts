import type { Problem, UserSummary } from "@/services/api/course.types";

export interface ContestApi {
    id: number;
    thumbnailUrl: string | null;
    title: string;
    slug: string;
    description: string;
    startTime: string;
    endTime: string;
    createdBy: UserSummary;
    createdAt: string;
}

export interface ContestPageData {
    total_records: number;
    total_records_page: number;
    current_page: number;
    total_pages: number;
    prev_pages: number;
    next_pages: number;
    data: ContestApi[];
}

export interface ContestListResponse {
    code: number;
    message: string;
    data: ContestPageData;
}
export interface ContestDetailResponse {
    code: number;
    message: string;
    data: ContestDetail;
}
export interface ContestDetail {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    thumbnailUrl?: string | null;
    userEnroll: unknown | null;
    problems: Problem[];
    createdAt: string;
}
export interface ContestJoinInfo {
    id: number;
    registeredAt: string;
}
export interface CreateContestRequest {
    title: string;
    description: string;
    startTime: string; // yyyy-MM-dd HH:mm:ss
    endTime: string;   // yyyy-MM-dd HH:mm:ss
}
export interface EditContestRequest {
    id: number;
    title: string;
    description: string;
    startTime: string; // yyyy-MM-dd HH:mm:ss
    endTime: string;   // yyyy-MM-dd HH:mm:ss
}