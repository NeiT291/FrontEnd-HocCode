import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type MainTab = "joined" | "created";
type SubTab = "course" | "class" | "practice" | "contest";

interface Props {
    mainTab: MainTab;
    subTab: SubTab;
    onChangeMain: (tab: MainTab) => void;
    onChangeSub: (tab: SubTab) => void;
}

const MAIN_TABS: { key: MainTab; label: string }[] = [
    { key: "joined", label: "Đã tham gia" },
    { key: "created", label: "Đã tạo" },
];

const SUB_TABS: { key: SubTab; label: string }[] = [
    { key: "course", label: "Khóa học" },
    { key: "class", label: "Lớp học" },
    { key: "practice", label: "Practice" },
    { key: "contest", label: "Cuộc thi" },
];

const ProfileTabs = ({
    mainTab,
    subTab,
    onChangeMain,
    onChangeSub,
}: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();

    /* ================= READ FROM URL ================= */
    useEffect(() => {
        const main = searchParams.get("main");
        const sub = searchParams.get("sub");

        if (main === "joined" || main === "created") {
            onChangeMain(main);
        }

        if (
            sub === "course" ||
            sub === "class" ||
            sub === "practice" ||
            sub === "contest"
        ) {
            onChangeSub(sub);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ================= WRITE TO URL ================= */
    useEffect(() => {
        setSearchParams(
            {
                main: mainTab,
                sub: subTab,
            },
            { replace: true }
        );
    }, [mainTab, subTab, setSearchParams]);

    return (
        <div className="bg-white rounded-2xl shadow mb-6 overflow-hidden">
            {/* ================= MAIN TABS ================= */}
            <div className="relative flex border-b">
                {MAIN_TABS.map((tab) => {
                    const active = mainTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => onChangeMain(tab.key)}
                            className={`
                            relative flex-1 py-3 text-sm font-semibold
                            transition cursor-pointer active:scale-95
                            ${active
                                    ? "text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50"
                                }
                            `}
                        >
                            {tab.label}

                            {active && (
                                <span
                                    className="
                                    absolute bottom-0 left-1/2
                                    -translate-x-1/2
                                    h-0.5 w-12
                                    bg-blue-600 rounded-full
                                    transition-all
                                    "
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ================= SUB TABS ================= */}
            <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto">
                {SUB_TABS.map((tab) => {
                    const active = subTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => onChangeSub(tab.key)}
                            className={`
                            px-4 py-2 text-sm rounded-xl whitespace-nowrap
                            transition cursor-pointer active:scale-95
                            ${active
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100"
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfileTabs;
