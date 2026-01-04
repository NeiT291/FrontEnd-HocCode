import type { UserSummary } from "@/services/api/course.types";

export interface ContestApi {
    id: number;
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