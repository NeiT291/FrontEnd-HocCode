import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import CourseCard from "@/components/course/CourseCard";
import PracticeCard from "@/components/practice/PracticeCard";
import ContestCard from "@/components/contest/ContestCard";

import type { Course } from "@/types/Course";
import type { Practice } from "@/types/Practice";
import type { Contest } from "@/types/Contest";

import type { Course as CourseApi } from "@/services/api/course.types";
import type { ProblemApi } from "@/services/api/problem.types";
import type { ContestApi } from "@/services/api/contest.types";

import { searchCourses } from "@/services/api/course.service";
import { searchProblems } from "@/services/api/problem.service";
import { searchContests } from "@/services/api/contest.service";

const PAGE_SIZE = 1;

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get("q") || "";
    const type = searchParams.get("type") || "course";
    const page = Number(searchParams.get("page")) || 1;

    const [courses, setCourses] = useState<Course[]>([]);
    const [practices, setPractices] = useState<Practice[]>([]);
    const [contests, setContests] = useState<Contest[]>([]);

    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!keyword) return;

        let mounted = true;
        setLoading(true);

        const fetchData = async () => {
            try {
                /* ===== SEARCH COURSE ===== */
                if (type === "course") {
                    const res = await searchCourses(
                        keyword,
                        page,
                        PAGE_SIZE
                    );

                    if (!mounted) return;

                    setCourses(
                        res.data.map(
                            (c: CourseApi): Course => ({
                                id: c.id,
                                title: c.title,
                                description: c.description,
                                createdAt: c.createdAt,
                                createdBy:
                                    c.owner?.displayName ||
                                    "Giảng viên",
                                image:
                                    "https://picsum.photos/600/400?random=" +
                                    c.id,
                            })
                        )
                    );

                    setTotalPages(res.total_pages);
                    setTotalRecords(res.total_records);
                    setPractices([]);
                    setContests([]);
                }

                /* ===== SEARCH PRACTICE ===== */
                if (type === "practice") {
                    const res = await searchProblems(
                        keyword,
                        page,
                        PAGE_SIZE
                    );

                    if (!mounted) return;

                    setPractices(
                        res.data.map(
                            (p: ProblemApi): Practice => ({
                                id: p.id,
                                title: p.title,
                                description: p.description,
                                createdAt: p.createdAt,
                                createdBy:
                                    p.createdBy?.displayName ||
                                    "Giảng viên",
                                difficulty: p.difficulty,
                            })
                        )
                    );

                    setTotalPages(res.total_pages);
                    setTotalRecords(res.total_records);
                    setCourses([]);
                    setContests([]);
                }
                /* ===== SEARCH CONTEST ===== */
                if (type === "contest") {
                    const res = await searchContests(
                        keyword,
                        page,
                        PAGE_SIZE
                    );

                    if (!mounted) return;

                    setContests(
                        res.data.map(
                            (c: ContestApi): Contest => ({
                                id: c.id,
                                title: c.title,
                                description: c.description,
                                startTime: c.startTime,
                                endTime: c.endTime,
                                image:
                                    "https://picsum.photos/600/400?random=" +
                                    c.id,
                                status: getContestStatus(
                                    c.startTime,
                                    c.endTime
                                ),
                            })
                        )
                    );

                    setTotalPages(res.total_pages);
                    setTotalRecords(res.total_records);

                    setCourses([]);
                    setPractices([]);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            mounted = false;
        };
    }, [keyword, type, page]);

    const goToPage = (p: number) => {
        const next = new URLSearchParams(searchParams);
        next.set("page", String(p));
        setSearchParams(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Kết quả tìm kiếm
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Từ khóa: <strong>{keyword}</strong> •{" "}
                        <strong>
                            {type === "course"
                                ? "Khóa học"
                                : type === "practice"
                                    ? "Luyện tập"
                                    : "Cuộc thi"}
                        </strong>
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({
                            length: PAGE_SIZE,
                        }).map((_, i) => (
                            <div
                                key={i}
                                className="h-56 bg-gray-200 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    courses.length === 0 &&
                    practices.length === 0 &&
                    contests.length === 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <Search className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600">
                                Không tìm thấy kết quả phù hợp
                            </p>
                        </div>
                    )}

                {/* COURSE RESULT */}
                {!loading && courses.length > 0 && (
                    <>
                        <p className="text-sm text-gray-500 mb-6">
                            Tìm thấy {totalRecords} khóa học
                        </p>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* PRACTICE RESULT */}
                {!loading && practices.length > 0 && (
                    <>
                        <p className="text-sm text-gray-500 mb-6">
                            Tìm thấy {totalRecords} bài luyện tập
                        </p>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {practices.map((p) => (
                                <PracticeCard
                                    key={p.id}
                                    practice={p}
                                />
                            ))}
                        </div>
                    </>
                )}
                {/* CONTEST RESULT */}
                {!loading && contests.length > 0 && (
                    <>
                        <p className="text-sm text-gray-500 mb-6">
                            Tìm thấy {totalRecords} cuộc thi
                        </p>

                        <div className="space-y-6">
                            {contests.map((contest) => (
                                <ContestCard
                                    key={contest.id}
                                    contest={contest}
                                />
                            ))}
                        </div>
                    </>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16">
                        <button
                            disabled={page === 1}
                            onClick={() =>
                                goToPage(page - 1)
                            }
                            className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {Array.from({
                            length: totalPages,
                        }).map((_, i) => {
                            const p = i + 1;
                            const active = p === page;

                            return (
                                <button
                                    key={p}
                                    onClick={() =>
                                        goToPage(p)
                                    }
                                    className={`w-10 h-10 rounded-lg text-sm font-medium
                                        ${active
                                            ? "bg-gray-900 text-white"
                                            : "border hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <button
                            disabled={page === totalPages}
                            onClick={() =>
                                goToPage(page + 1)
                            }
                            className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


function getContestStatus(
    startTime: string,
    endTime: string
): "upcoming" | "ongoing" | "ended" {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "upcoming";
    if (now > end) return "ended";
    return "ongoing";
}
