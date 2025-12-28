export type Difficulty = "easy" | "medium" | "hard";

export interface Practice {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    createdBy: string;
    difficulty: Difficulty;
}