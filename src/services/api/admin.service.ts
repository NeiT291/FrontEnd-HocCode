import axiosInstance from "@/services/api/axios";
import type { AdminDashboardResponse, AdminResponseNoData } from "@/services/api/admin.types";
import type { CoursePageResponse } from "@/services/api/course.types";
import type { ProblemPageResponse } from "@/services/api/problem.types";
import type { ContestPageResponse } from "./contest.types";
import type { UserPageResponse } from "./user.types";

export async function getDashboard(){
  const res = await axiosInstance.get<AdminDashboardResponse>(
    "/admin",
  );

  if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không lấy được thông tin dashboard");
    }

    return res.data.data;
}
// ============= COURSE ===============
export async function getAllCourses(
  page: number,
  pageSize: number,
  keyword?: string,
  isActive?: boolean
) {
  
  const res = await axiosInstance.get<CoursePageResponse>(
    "/admin/all-course",
    {
      params: {
        page,
        pageSize,
        title: keyword || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    }
  );

  if (res.data.code !== 200) {
    throw new Error(res.data.message || "Không lấy được danh sách khóa học");
  }
  return res.data.data;
}

export async function deleteCourses(
    courseIds: number[]
){
    if (courseIds.length === 0) return;

    const params = new URLSearchParams();
    courseIds.forEach((id) =>
        params.append("listCourseId", id.toString())
    );

    const res = await axiosInstance.delete<AdminResponseNoData>(
        "/admin/delete-courses",
        { params }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Xóa khóa học thất bại"
        );
    }
}
export async function restoreCourses(
    courseIds: number[]
){
    if (courseIds.length === 0) return;

    const params = new URLSearchParams();
    courseIds.forEach((id) =>
        params.append("listCourseId", id.toString())
    );

    const res = await axiosInstance.get<AdminResponseNoData>(
        "/admin/restore-courses",
        { params }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Khôi phục khóa học thất bại"
        );
    }
}
// ============== Problem =================
export async function getAllProblems(
  page: number,
  pageSize: number,
  keyword?: string,
  isActive?: boolean
) {
  
  const res = await axiosInstance.get<ProblemPageResponse>(
    "/admin/all-problem",
    {
      params: {
        page,
        pageSize,
        title: keyword || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    }
  );

  if (res.data.code !== 200) {
    throw new Error(res.data.message || "Không lấy được danh sách luyện tập");
  }
  return res.data.data;
}

export async function deleteProblems(
    courseIds: number[]
){
    if (courseIds.length === 0) return;

    const params = new URLSearchParams();
    courseIds.forEach((id) =>
        params.append("listProblemId", id.toString())
    );

    const res = await axiosInstance.delete<AdminResponseNoData>(
        "/admin/delete-problems",
        { params }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Xóa luyện tập thất bại"
        );
    }
}
export async function restoreProblems(
    courseIds: number[]
){
    if (courseIds.length === 0) return;

    const params = new URLSearchParams();
    courseIds.forEach((id) =>
        params.append("listProblemId", id.toString())
    );

    const res = await axiosInstance.get<AdminResponseNoData>(
        "/admin/restore-problems",
        { params }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Khôi phục luyện tập thất bại"
        );
    }
}
// =================== Contest ===============
export async function getAllContests(
  page: number,
  pageSize: number,
  keyword?: string,
  isActive?: boolean
) {
  
  const res = await axiosInstance.get<ContestPageResponse>(
    "/admin/all-contest",
    {
      params: {
        page,
        pageSize,
        title: keyword || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    }
  );

  if (res.data.code !== 200) {
    throw new Error(res.data.message || "Không lấy được danh sách cuộc thi");
  }
  return res.data.data;
}

export async function deleteContests(
    courseIds: number[]
){
    if (courseIds.length === 0) return;

    const params = new URLSearchParams();
    courseIds.forEach((id) =>
        params.append("listContestId", id.toString())
    );

    const res = await axiosInstance.delete<AdminResponseNoData>(
        "/admin/delete-contests",
        { params }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Xóa cuộc thi thất bại"
        );
    }
}
export async function restoreContests(
    courseIds: number[]
){
    if (courseIds.length === 0) return;

    const params = new URLSearchParams();
    courseIds.forEach((id) =>
        params.append("listContestId", id.toString())
    );

    const res = await axiosInstance.get<AdminResponseNoData>(
        "/admin/restore-contests",
        { params }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Khôi phục cuộc thi thất bại"
        );
    }
}
// =================== User ===============
export async function getAllUsers(
  page: number,
  pageSize: number,
  keyword?: string,
  isActive?: boolean
) {
  
  const res = await axiosInstance.get<UserPageResponse>(
    "/admin/all-user",
    {
      params: {
        page,
        pageSize,
        username: keyword || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    }
  );

  if (res.data.code !== 200) {
    throw new Error(res.data.message || "Không lấy được danh sách nguời dùng");
  }
  return res.data.data;
}

export async function deleteUsers(
    usernames: string[]
){
    if (usernames.length === 0) return;

    const params = new URLSearchParams();
    usernames.forEach((username) =>
        params.append("listUsername", username)
    );

    const res = await axiosInstance.delete<AdminResponseNoData>(
        "/admin/delete-users",
        { params }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Xóa người dùng thất bại"
        );
    }
}
export async function restoreUsers(
    usernames: string[]
){
    if (usernames.length === 0) return;

    const params = new URLSearchParams();
    usernames.forEach((username) =>
        params.append("listUsername", username)
    );

    const res = await axiosInstance.get<AdminResponseNoData>(
        "/admin/restore-users",
        { params }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Khôi phục người dùng thất bại"
        );
    }
}