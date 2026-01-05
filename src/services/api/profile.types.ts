export interface UserProfileApi {
    displayName: string | null;
    dob: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    avatarUrl: string | null;
    active: boolean;
    role: {
        id: number;
        name: string;
    };
}

/* ===== UI MODEL ===== */

export interface UserProfile {
    displayName: string | null;
    dob: string | null;
    bio: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    avatarUrl: string | null;
    roleName: string;
}
export interface UpdateProfilePayload {
    displayName: string;
    bio: string;
    dob: string;
    phone: string;
    address: string;
}