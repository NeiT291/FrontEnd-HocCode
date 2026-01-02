export type ClassStatus = "open" | "joined" | "closed";

export interface Class {
    id: number;
    name: string;
    description: string;
    instructor: string;
    members: number;
    status: ClassStatus;
}