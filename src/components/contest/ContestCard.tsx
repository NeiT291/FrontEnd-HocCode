import type { Contest } from "@/types/Contest";

interface Props {
    contest: Contest;
}
const statusMap: Record<
    Contest["status"],
    {
        label: string;
        container: string;
        dot: string;
    }
> = {
    upcoming: {
        label: "Sắp diễn ra",
        container: "bg-blue-50 text-blue-700 border border-blue-200",
        dot: "bg-blue-500",
    },
    ongoing: {
        label: "Đang diễn ra",
        container: "bg-green-50 text-green-700 border border-green-200",
        dot: "bg-green-500",
    },
    ended: {
        label: "Đã kết thúc",
        container: "bg-gray-100 text-gray-600 border border-gray-200",
        dot: "bg-gray-400",
    },
};
const ContestCard = ({ contest }: Props) => {
    return (
        <div
            key={contest.id}
            className="
          contest-card
          bg-white
          rounded-xl
          shadow
          hover:shadow-md
          transition
          p-4
          flex
          flex-col
          md:flex-row
          md:items-center
          gap-4
        "
        >
            {/* IMAGE */}
            <img
                src={contest.image}
                alt={contest.title}
                className="
            w-full
            md:w-40
            h-32
            object-cover
            rounded-lg
            flex-shrink-0
          "
            />

            {/* CONTENT */}
            <div className="flex-1 flex flex-col">
                {/* TITLE + STATUS */}
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold line-clamp-2">
                        {contest.title}
                    </h3>

                    <span
                        className={`
              inline-flex items-center gap-2
              px-3 py-1
              text-xs font-medium
              rounded-full
              ${statusMap[contest.status].container}
            `}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${statusMap[contest.status].dot}`}
                        />
                        {statusMap[contest.status].label}
                    </span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {contest.description}
                </p>

                {/* FOOTER */}
                <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="text-xs text-gray-500">
                        Bắt đầu: {" "}
                        {new Date(contest.startTime).toLocaleDateString("vi-VN")}
                        {"  "} - Kết thúc: {"  "}
                        {new Date(contest.endTime).toLocaleDateString("vi-VN")}
                    </div>

                    <a
                        href={`/contests/${contest.id}`}
                        className="
              px-4 py-2
              text-sm font-medium
              rounded-lg
              border border-gray-300
              hover:bg-gray-100
              transition
              whitespace-nowrap
            "
                    >
                        Xem chi tiết
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContestCard;
