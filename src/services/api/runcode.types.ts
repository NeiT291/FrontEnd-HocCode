export interface RunCodeResponse {
    stdout: string;
    stderr: string;
    exitCode: number;
    timeMs: number;
    memoryMb: number;
}