import type { Problem } from "@/services/api/problem.types";
import type { User } from "@/services/api/user.types";

// ================== Request ==================
export interface CourseRequest {
  id: number;
  classId: number;
  title: string;
  description: string;
  isPublic: boolean;
  modules: Module[];
}
export interface ModuleRequest {
  id?: number;
  courseId: number;
  title: string;
  position?: number;
  problems?: Problem[];
}
// ================== Response ==================
export interface CoursePageResponse {
  code: number;
  message: string;
  data: CoursePage;
}
export interface CoursePage {
  total_records: number;
  total_records_page: number;
  current_page: number;
  total_pages: number;
  prev_pages: number;
  next_pages: number;
  data: Course[];
}
export interface CourseResponse {
    code: number;
    message: string;
    data: Course;
}
export interface CourseModuleResponse {
    code: number;
    message: string;
    data: Module;
}
export interface CourseEnrollResponse{
    code: number;
    message: string;
    data: CourseEnroll;
}
export interface Course{
  id: number;
  thumbnailUrl: string;
  title: string;
  description: string;
  owner: User;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  modules: Module[];
}
export interface Module {
  id: number;
  title: string;
  position: number;
  createdAt: string;
  problems: Problem[];
}
export interface CourseEnroll{
  id: number;
  enrolledAt: string;
  progress: JSON;
}


