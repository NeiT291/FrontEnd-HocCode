import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { KeyRound, ChevronLeft, ChevronRight } from "lucide-react";

import ClassCard from "@/components/class/ClassCard";
import JoinClassByCodeModal from "@/components/class/JoinClassByCodeModal";
import type { Class } from "@/types/Class";

/* ================= MOCK DATA ================= */

const mockClasses: Class[] = Array.from({ length: 17 }).map(
    (_, i) => ({
        id: i + 1,
        name: `Lớp học ${i + 1}`,
        description: "Mô tả lớp học",
        instructor: "Giảng viên A",
        members: 20 + i,
        status: i % 4 === 0 ? "joined" : "open",
    })
);

const PAGE_SIZE = 6;
type FilterType = "all" | "joined" | "not_joined";

/* ================= PAGE ================= */

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>(mockClasses);
    const [showJoinByCode, setShowJoinByCode] = useState(false);
    const [filter, setFilter] = useState<FilterType>("all");

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || 1);

    /* ================= FILTER ================= */

    const filteredClasses = useMemo(() => {
        switch (filter) {
            case "joined":
                return classes.filter((c) => c.status === "joined");
            case "not_joined":
                return classes.filter((c) => c.status === "open");
            default:
                return classes;
        }
    }, [classes, filter]);

    /* ================= PAGINATION ================= */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredClasses.length / PAGE_SIZE)
    );

    const currentPage = Math.min(page, totalPages);

    const pagedClasses = filteredClasses.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const changePage = (p: number) => {
        setSearchParams({ page: String(p) });
    };

    /* ================= ACTIONS ================= */

    const handleJoin = (id: number) => {
        setClasses((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, status: "joined" } : c
            )
        );
    };

    const changeFilter = (f: FilterType) => {
        setFilter(f);
        setSearchParams({ page: "1" }); // reset page
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-6 mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Lớp học của bạn
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Quản lý và tham gia các lớp học
                            </p>
                        </div>

                        <button
                            onClick={() => setShowJoinByCode(true)}
                            className="
                flex items-center gap-2
                px-5 py-3 rounded-xl
                bg-gray-900 text-white
                hover:bg-gray-800
              "
                        >
                            <KeyRound size={18} />
                            Tham gia bằng mã
                        </button>
                    </div>

                    {/* ================= FILTER ================= */}
                    <div className="flex gap-2">
                        <FilterButton
                            active={filter === "all"}
                            onClick={() => changeFilter("all")}
                        >
                            Tất cả
                        </FilterButton>
                        <FilterButton
                            active={filter === "joined"}
                            onClick={() => changeFilter("joined")}
                        >
                            Đã tham gia
                        </FilterButton>
                        <FilterButton
                            active={filter === "not_joined"}
                            onClick={() => changeFilter("not_joined")}
                        >
                            Chưa tham gia
                        </FilterButton>
                    </div>
                </div>

                {/* ================= GRID ================= */}
                {pagedClasses.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {pagedClasses.map((c) => (
                            <ClassCard
                                key={c.id}
                                classItem={c}
                                onJoin={handleJoin}
                            />
                        ))}
                    </div>
                )}

                {/* ================= PAGINATION ================= */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-14">
                        {/* Prev */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => changePage(currentPage - 1)}
                            className="
                px-3 py-2 rounded-lg border
                hover:bg-gray-50
                disabled:opacity-40 disabled:cursor-not-allowed
              "
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const p = i + 1;
                            const active = p === currentPage;

                            return (
                                <button
                                    key={p}
                                    onClick={() => changePage(p)}
                                    className={`
                    w-10 h-10 rounded-lg text-sm font-medium
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

                        {/* Next */}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => changePage(currentPage + 1)}
                            className="
                px-3 py-2 rounded-lg border
                hover:bg-gray-50
                disabled:opacity-40 disabled:cursor-not-allowed
              "
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* ================= MODAL ================= */}
            {showJoinByCode && (
                <JoinClassByCodeModal
                    onClose={() => setShowJoinByCode(false)}
                />
            )}
        </div>
    );
}

/* ================= UI ================= */

function FilterButton({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
        px-4 py-2 rounded-lg text-sm font-medium transition
        ${active
                    ? "bg-gray-900 text-white"
                    : "border hover:bg-gray-50"
                }
      `}
        >
            {children}
        </button>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-20 text-gray-500">
            Không có lớp học phù hợp
        </div>
    );
}