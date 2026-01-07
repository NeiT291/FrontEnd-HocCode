export interface Course {
    id: number;
    title: string;
    description: string;
    image: string | null;        // URL ảnh
    createdAt: string;    // ISO / yyyy-MM-dd
    createdBy: string;
}
