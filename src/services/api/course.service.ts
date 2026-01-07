import axiosInstance from "@/services/api/axios";
import type { CourseListResponse, CourseDetailResponse, Course, CourseJoinInfo, CourseEnrollInfo } from "@/services/api/course.types";

export async function getAllCourses(
  page: number,
  pageSize: number
) {
  const res = await axiosInstance.get<CourseListResponse>(
    "/course/get-all",
    {
      headers: {
        skipAuth: true
      },
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
      headers: {
        skipAuth: true
      },
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
export async function getCourseById(id: number): Promise<Course> {
  const res = await axiosInstance.get<CourseDetailResponse>(
    "/course/get-by-id",
    { params: { id } }
  );

  if (res.data.code !== 200) {
    throw new Error(res.data.message || "Không lấy được chi tiết khóa học");
  }

  return res.data.data;
}
export async function checkCourseJoined(
  courseId: number
): Promise<CourseJoinInfo | null> {
  const res = await axiosInstance.get<{
    code: number;
    message: string;
    data: CourseJoinInfo | null;
  }>("/course/is-join", {
    params: { courseId },
  });

  if (res.data.code !== 200) {
    throw new Error(res.data.message || "Check join failed");
  }

  return res.data.data;
}


export async function enrollCourse(
    courseId: number
): Promise<CourseEnrollInfo> {
    const res = await axiosInstance.post<{
        code: number;
        message: string;
        data: CourseEnrollInfo;
    }>("/course/enroll", null, {
        params: { courseId },
    });

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Enroll course failed");
    }

    return res.data.data;
}
export async function outCourse(
    courseId: number
): Promise<void> {
    await axiosInstance.post<{
        code: number;
    }>("/course/out-course", null, {
        params: { courseId },
    });
}
export async function getCoursesCreated(
    page: number,
    pageSize: number
): Promise<Course[]> {
    const res = await axiosInstance.get<CourseListResponse>(
        "/course/get-course-created",
        {
            params: { page, pageSize },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Get created courses failed");
    }

    return res.data.data.data;
}
export async function getCoursesJoined(
    page: number,
    pageSize: number
): Promise<Course[]> {
    const res = await axiosInstance.get<CourseListResponse>(
        "/course/get-course-joined",
        {
            params: { page, pageSize },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Get created courses failed");
    }

    return res.data.data.data;
}
