import type { Course } from "@/services/api/course.types";
import type { User } from "@/services/api/user.types";

// ============== Request =============
export interface ClassRequest{
    id: number;
    title: string;
    code: string;
    description: string;
}
// ============== Request =============
export interface ClassPageResponse {
  code: number;
  message: string;
  data: ClassPage;
}
export interface ClassPage {
  total_records: number;
  total_records_page: number;
  current_page: number;
  total_pages: number;
  prev_pages: number;
  next_pages: number;
  data: Class[];
}
export interface ClassResponse {
    code: number;
    message: string;
    data: Class;
}
export interface ClassEnrollResponse {
    code: number;
    message: string;
    data: ClassEnroll;
}

export interface Class {
    id: number;
    title: string;
    code: string;
    description: string;
    owner: User;
    createdAt: string;
    enrollments: ClassEnroll[];
    courses: Course[];
}
export interface ClassEnroll{
    id: number;
    role: string;
    enrolledAt: string;
    progress: JSON;
}

