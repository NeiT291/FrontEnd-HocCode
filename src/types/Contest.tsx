export interface Contest {
    id: number;
    title: string;
    description: string;
    image: string | null;
    startTime: string;
    endTime: string;
    status: "upcoming" | "ongoing" | "ended";
}