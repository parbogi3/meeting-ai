interface CalendarPanelProps {
  currentYear: number;
  currentMonth: number;
  calendarDays: (number | null)[];
  selectedDate: string;
  meetings: any[];
  prevMonth: () => void;
  nextMonth: () => void;
  setSelectedDate: (date: string) => void;
  createMeeting: () => void;
}

export default function CalendarPanel({
  currentYear,
  currentMonth,
  calendarDays,
  selectedDate,
  meetings,
  prevMonth,
  nextMonth,
  setSelectedDate,
  createMeeting,
}: CalendarPanelProps) {
  return (
    <aside className="w-72 bg-slate-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">
        Meeting AI
      </h1>

      <button
        onClick={createMeeting}
        className="w-full bg-blue-500 p-3 rounded mb-4"
      >
        + 새 회의 시작
      </button>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="bg-slate-700 px-3 py-1 rounded"
        >
          ◀
        </button>

        <div className="font-bold">
          {currentYear}년 {currentMonth + 1}월
        </div>

        <button
          onClick={nextMonth}
          className="bg-slate-700 px-3 py-1 rounded"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["일","월","화","수","목","금","토"].map((day) => (
          <div
            key={day}
            className="font-bold"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          if (!day) {
            return <div key={idx}></div>;
          }

          const dateString =
            `${currentYear}-${String(
              currentMonth + 1
            ).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;

          const count = meetings.filter(
            (meeting) =>
              meeting.created_at.split("T")[0] ===
              dateString
          ).length;

          return (
            <button
              key={`${dateString}-${idx}`}
              onClick={() =>
                setSelectedDate(dateString)
              }
              className={`p-2 rounded text-xs ${
                selectedDate === dateString
                  ? "bg-blue-500"
                  : "bg-slate-700"
              }`}
            >
              <div>{day}</div>

              {count > 0 && (
                <div className="text-[10px] text-green-300">
                  ● {count}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}