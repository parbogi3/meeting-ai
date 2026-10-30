import { Meeting } from "@/types/meeting";

interface MeetingListProps {
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  selectedDate: string;
  setSelectedMeeting: (
    meeting: Meeting
  ) => void;
}

export default function MeetingList({
  meetings,
  selectedMeeting,
  selectedDate,
  setSelectedMeeting,
}: MeetingListProps) {
  const meetingsByDate = meetings.filter(
    (meeting) =>
      meeting.created_at.split("T")[0] ===
      selectedDate
  );

  const getCategoryStyle = (
    category: string
  ) => {
    switch (category) {
      case "사업운영":
        return "bg-slate-100 text-slate-700 border-slate-200";

      case "신규기획":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "현장소통":
        return "bg-sky-100 text-sky-700 border-sky-200";

      case "예산":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "일정":
        return "bg-pink-100 text-pink-700 border-pink-200";

      case "기타회의":
        return "bg-purple-100 text-purple-700 border-purple-200";

      default:
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <aside className="w-80 bg-white border-r p-4 overflow-y-auto">
      <h2 className="font-bold text-lg mb-2 text-slate-900">
        선택 날짜 회의
      </h2>

      <p className="text-sm text-slate-500 mb-4">
        {selectedDate}
      </p>

      <div className="space-y-3">
        {meetingsByDate.length === 0 && (
          <div className="text-sm text-slate-400">
            회의가 없습니다.
          </div>
        )}

        {meetingsByDate.map((meeting) => (
          <button
            key={meeting.id}
            onClick={() =>
              setSelectedMeeting(meeting)
            }
            className={`w-full text-left p-4 rounded-xl border transition ${
              selectedMeeting?.id ===
              meeting.id
                ? "bg-indigo-50 border-indigo-300"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="font-medium text-base text-slate-900">
              {meeting.title}
            </div>

            {meeting.categories &&
              meeting.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {meeting.categories.map(
                    (category) => (
                      <span
                        key={category}
                        className={`
                          text-[10px]
                          px-2
                          py-1
                          rounded-full
                          border
                          ${getCategoryStyle(
                            category
                          )}
                        `}
                      >
                        {category}
                      </span>
                    )
                  )}
                </div>
              )}

            <div className="text-xs text-slate-400 mt-2">
              {
                meeting.created_at.split(
                  "T"
                )[0]
              }
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}