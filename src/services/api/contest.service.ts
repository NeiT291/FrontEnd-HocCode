import axiosInstance from "@/services/api/axios";
import type {  ContestDetail, ContestDetailResponse, ContestJoinInfo, ContestListResponse, CreateContestRequest, EditContestRequest } from "@/services/api/contest.types";

export async function getAllContests(
    page = 1,
    pageSize = 6
) {
    const res = await axiosInstance.get<ContestListResponse>(
        "/contest/get-all",
        {
            params: { page, pageSize },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không lấy được danh sách cuộc thi");
    }

    return res.data.data;
}
export async function searchContests(
    keyword: string,
    page: number,
    pageSize: number
) {
    const res = await axiosInstance.get<ContestListResponse>(
        "/contest/search",
        {
            params: {
                title: keyword,
                page,
                pageSize,
            },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(
            res.data.message || "Search contest failed"
        );
    }

    return res.data.data;
}

export async function getContestCreated(
    page = 1,
    pageSize = 6
) {
    const res = await axiosInstance.get<ContestListResponse>(
        "/contest/get-created",
        {
            params: { page, pageSize },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không lấy được danh sách cuộc thi");
    }

    return res.data.data;
}
export async function getContestJoined(
    page = 1,
    pageSize = 6
) {
    const res = await axiosInstance.get<ContestListResponse>(
        "/contest/get-joined",
        {
            params: { page, pageSize },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không lấy được danh sách cuộc thi");
    }

    return res.data.data;
}
export async function getContestById(
    id: number
) {
    const res = await axiosInstance.get<ContestDetailResponse>(
        "/contest/get-by-id",
        {
            params: { id },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không lấy được danh sách cuộc thi");
    }

    return res.data.data;
}
export async function checkContestJoined(
  id: number
): Promise<ContestJoinInfo | null> {
  const res = await axiosInstance.get<{
    code: number;
    message: string;
    data: ContestJoinInfo | null;
  }>("/contest/is-join", {
    params: { id },
  });

  if (res.data.code !== 200) {
    throw new Error(res.data.message || "Check join failed");
  }

  return res.data.data;
}
export async function enrollContest(
    contestId: number
) {
    const res = await axiosInstance.get<{
    code: number;
    message: string;
    data: ContestJoinInfo | null;
  }>(
        "/contest/enroll",
        {
            params: { contestId },
        }
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Không thể tham gia cuộc thi");
    }

    return res.data.data;
}
export async function createContest(
    payload: CreateContestRequest
): Promise<ContestDetail> {
   const res = await axiosInstance.post(
        "/contest/add",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Tạo cuộc thi thất bại");
    }

    return res.data.data;
}
export async function modifyContest(
    payload: EditContestRequest
): Promise<ContestDetail> {
   const res = await axiosInstance.put(
        "/contest/modify",
        payload
    );

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Sửa cuộc thi thất bại");
    }

    return res.data.data;
}

export async function setContestThumbnail(
    contestId: number,
    file: File
): Promise<string> {
    const formData = new FormData();
    formData.append("thumbnail", file);
    formData.append("contestId", String(contestId));

    const res = await axiosInstance.post<{
        code: number;
        message: string;
        data?: { thumbnailUrl: string };
    }>("/contest/set-thumbnail", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (res.data.code !== 200) {
        throw new Error(res.data.message || "Upload thumbnail failed");
    }

    return res.data.data?.thumbnailUrl ?? "";
}