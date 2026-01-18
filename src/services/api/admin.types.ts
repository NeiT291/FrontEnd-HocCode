
export interface AdminResponseNoData {
    code: number,
    message: string
}
export interface AdminDashboardResponse {
    code: number,
    message: string,
    data: Dashboard,
}
export interface Dashboard {
    totalContest: number,
    totalCourse:  number,
    totalClass:  number,
    totalUser:  number,
    totalProblem:  number,
}
