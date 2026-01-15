import axiosInstance from "@/services/api/axios";
import type { LoginRequest, LoginResponse } from "@/services/api/user.types";

export async function login(
  payload: LoginRequest
): Promise<string> {
  const res = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    payload
  );

  if (res.data.code !== 200) {
    throw new Error(res.data.message || "Login failed");
  }

  const token = res.data.data.token;

  // 👉 LƯU TOKEN
  localStorage.setItem("access_token", token);

  return token;
}

export async function logout(): Promise<void> {
    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {
        await axiosInstance.post("/auth/logout", {
            token,
        });
    } finally {
        // 👉 DÙ API FAIL VẪN XOÁ TOKEN LOCAL
        localStorage.removeItem("access_token");
    }
}