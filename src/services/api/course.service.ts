import axiosInstance from "@/services/api/axios";
import type { CourseEnrollResponse, CourseModuleResponse, CoursePageResponse, CourseRequest, CourseResponse, ModuleRequest } from "@/services/api/course.types";

export async function getAllCourses(
  page: number,
  pageSize: number
) {
  const res = await axiosInstance.get<CoursePageResponse>(
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
  const res = await axiosInstance.get<CoursePageResponse>(
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
export async function getCourseById(id: number) {
  const res = await axiosInstance.get<CourseResponse>(
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
) {
  const res = await axiosInstance.get<{
    code: number;
    message: string;
    data: CourseEnrollResponse;
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
){
    const res = await axiosInstance.post<{
        code: number;
        message: string;
        data: CourseEnrollResponse;
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
) {
    await axiosInstance.post<{
        code: number;
    }>("/course/out-course", null, {
        params: { courseId },
    });
}
export async function getCoursesCreated(
    page: number,
    pageSize: number
){
    const res = await axiosInstance.get<CoursePageResponse>(
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
) {
    const res = await axiosInstance.get<CoursePageResponse>(
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
export async function addCourse(
    payload: CourseRequest
) {
    const res = await axiosInstance.post<CourseResponse>(
        "/course/add",
        payload
    );

    return res.data.data;
}
export async function modifyCourse(payload: {
    id: number;
    title: string;
    description: string;
}) {
    const res = await axiosInstance.put<CourseResponse>(
        "/course/modify",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Modify course failed");
    }
}
export async function setCourseThumbnail(
    courseId: number,
    file: File
) {
    const formData = new FormData();
    formData.append("thumbnail", file);
    formData.append("courseId", String(courseId));

    const res = await axiosInstance.post<{
        code: number;
        message: string;
        data?: { thumbnailUrl: string };
    }>("/course/set-thumbnail", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Upload thumbnail failed");
    }

    return res.data.data?.thumbnailUrl ?? "";
}


export async function addCourseModule(
    payload: ModuleRequest
){
    const res = await axiosInstance.post<CourseModuleResponse>(
        "/course-module/add",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Thêm module thất bại");
    }
}
export async function updateModule(
    payload: ModuleRequest
) {
    const res = await axiosInstance.put<CourseModuleResponse>(
        "/course-module/modify",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Sửa module thất bại");
    }
}

export async function deleteModule(
    moduleId: number
): Promise<void> { 
    console.log("Deleting module:", moduleId);
}