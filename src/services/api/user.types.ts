// ================== Request ======================
export interface RegisterRequest {
    username: string;
    password: string;
    repassword: string;
    display_name: string;
    dob?: string;
    email: string;
    phone?: string;
    address?: string; 
}
export interface UpdateUserRequest {
    password?: string;
    displayName?: string;
    bio?: string;
    dob?: string;
    email?: string;
    phone?: string;
    address?: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LogoutRequest {
  token: string;
}
export interface ChangePasswordRequest{
    oldPassword: string;
    newPassword: string;
}
// ================== Response ======================

export interface UserResponse {
    code: number;
    message: string;
    data: User;
}
export interface UserPageResponse {
    code: number;
    message: string;
    data: UserPage;
}
export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
  };
}
export interface UserPage {
    total_records: number;
    total_records_page: number;
    current_page: number;
    total_pages: number;
    prev_pages: number;
    next_pages: number;
    data: User[];
}
export interface User{
    displayName: string | null;
    username: string;
    dob: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    avatarUrl: string | null;
    isActive: boolean;
    role: Role;
}
export interface Role {
    id: number | null;
    name: string | null;
}
