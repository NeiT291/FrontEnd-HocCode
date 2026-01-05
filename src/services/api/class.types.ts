import type { UserSummary } from "@/services/api/course.types";

export interface ClassApi {
    id: number;
    title: string;
    code: string;
    description: string;
    owner: UserSummary;
    createdAt: string;
    enrollments: unknown[];
    courses: {
        id: number;
        title: string;
        slug: string;
        description: string;
    }[];
}

export interface ClassPageData {
    total_records: number;
    total_records_page: number;
    current_page: number;
    total_pages: number;
    prev_pages: number;
    next_pages: number;
    data: ClassApi[];
}

export interface ClassListResponse {
    code: number;
    message: string;
    data: ClassPageData;
}
