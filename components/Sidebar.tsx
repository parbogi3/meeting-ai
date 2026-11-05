type Meeting = {
  id: number;
  title: string;
  transcript: string;
};

interface SidebarProps {
  meetings: Meeting[];
  selectedId: number;
  onSelect: (meeting: Meeting) => void;
  onCreate: () => void;
}

export default function Sidebar({
  meetings,
  selectedId,
  onSelect,
  onCreate,
}: SidebarProps){
  return (
    <div className="w-72 bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-6">
        Meeting AI
      </h1>

      <button
        onClick={onCreate}
        className="w-full bg-blue-500 p-3 rounded-lg mb-6"
      >
        + 새 회의 시작
      </button>

      <h2 className="font-semibold mb-3">
        회의 목록
      </h2>

      <div className="space-y-2">
        {meetings.map((meeting) => (
          <button
            key={meeting.id}
            onClick={() => onSelect(meeting)}
            className={`w-full text-left p-3 rounded ${
  selectedId === meeting.id
    ? "bg-blue-600"
    : "bg-slate-800 hover:bg-slate-700"
}`}
          >
            {meeting.title}
          </button>
        ))}
      </div>
    </div>
  );
}
