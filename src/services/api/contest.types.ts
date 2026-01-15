import type { Problem } from "@/services/api/problem.types";
import type { User } from "@/services/api/user.types";

// ================= Request ============
export interface ContestRequest{
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
}
// ================= Response ============
export interface ContestPageResponse {
  code: number;
  message: string;
  data: ContestPage;
}
export interface ContestPage {
  total_records: number;
  total_records_page: number;
  current_page: number;
  total_pages: number;
  prev_pages: number;
  next_pages: number;
  data: Contest[];
}
export interface ContestResponse {
    code: number;
    message: string;
    data: Contest;
}
export interface ContestJoinResponse {
    code: number;
    message: string;
    data: ContestJoin;
}

export interface Contest {
    id: number;
    thumbnailUrl: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    createdBy: User;
    userEnroll: User;
    problems: Problem[];
    createdAt: string;
}

export interface ContestJoin {
    id: number;
    registeredAt: string;
}