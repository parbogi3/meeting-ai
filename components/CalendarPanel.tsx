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
    <aside className="w-72 bg-slate-100 border-r p-4 overflow-y-auto">

      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Calendar
      </h1>

      <button
        onClick={createMeeting}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl mb-4 transition"
      >
        + 새 회의 시작
      </button>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="bg-white border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50"
        >
          ◀
        </button>

        <div className="font-bold text-slate-900">
          {currentYear}년 {currentMonth + 1}월
        </div>

        <button
          onClick={nextMonth}
          className="bg-white border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["일", "월", "화", "수", "목", "금", "토"].map(
          (day) => (
            <div
              key={day}
              className="font-bold text-slate-700"
            >
              {day}
            </div>
          )
        )}

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
              meeting.created_at.split(
                "T"
              )[0] === dateString
          ).length;

          return (
            <button
              key={`${dateString}-${idx}`}
              onClick={() =>
                setSelectedDate(dateString)
              }
              className={`p-2 rounded-lg text-xs transition ${
                selectedDate === dateString
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div>{day}</div>

              {count > 0 && (
                <div className="text-[10px] text-emerald-600 font-medium">
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