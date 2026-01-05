import axiosInstance from "@/services/api/axios";
import type { CourseListResponse } from "./course.types";

export async function getAllCourses(
  page: number,
  pageSize: number
) {
  const res = await axiosInstance.get<CourseListResponse>(
    "/course/get-all",
    {
      params: {
        page,
        pageSize,
      },
    }
  );

  if (res.data.code !== 200) {
    throw new Error(res.data.message || "Không lấy được danh sách khóa học");
  }

  return res.data.data;
}
export async function searchCourses(
    keyword: string,
    page: number,
    pageSize: number
) {
    const res = await axiosInstance.get<CourseListResponse>(
        "/course/search",
        {
            params: {
                title: keyword,
                page,
                pageSize,
            },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Search course failed");
    }

    return res.data.data;
}