/* ===== COMMON ===== */

export interface Role {
  id: number;
  name: "USER" | "ADMIN";
}

export interface UserSummary {
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
  active: boolean;
  role: Role;
}

/* ===== COURSE ===== */

export interface Lesson {
  id: number;
  title: string;
  content: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testcase {
  id: number;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  position: number;
}

export interface Problem {
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

export interface Module {
  id: number;
  title: string;
  position: number;
  createdAt: string;
  lessons: Lesson[];
  problems: Problem[];
}

export interface Course {
  id: number;
  thumbnailUrl: string | null;
  title: string;
  slug: string;
  description: string;
  owner: UserSummary;
  isPublic: boolean | null;
  createdAt: string;
  updatedAt: string;
  modules: Module[];
}

/* ===== PAGINATION ===== */

export interface CoursePageData {
  total_records: number;
  total_records_page: number;
  current_page: number;
  total_pages: number;
  prev_pages: number;
  next_pages: number;
  data: Course[];
}

export interface CourseListResponse {
  code: number;
  message: string;
  data: CoursePageData;
}