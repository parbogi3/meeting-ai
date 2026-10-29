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

  return (
  <aside className="w-80 bg-slate-800 text-white p-4 overflow-y-auto h-screen">

      <h2 className="font-bold text-lg mb-4">
        선택 날짜 회의
      </h2>

      <p className="text-sm text-gray-300 mb-4">
        {selectedDate}
      </p>

      <div className="space-y-2">
        {meetingsByDate.map((meeting) => (
          <button
            key={meeting.id}
            onClick={() =>
              setSelectedMeeting(meeting)
            }
            className={`w-full text-left p-3 rounded ${
              selectedMeeting?.id ===
              meeting.id
                ? "bg-blue-600"
                : "bg-slate-700"
            }`}
          >
            {meeting.title}
          </button>
        ))}
      </div>
    </aside>
  );
}