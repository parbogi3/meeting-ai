"use client";

type Meeting = {
  id: number;
  title: string;
  transcript: string;
};

interface DashboardProps {
  meeting: Meeting;
  meetings: Meeting[];
  setMeetings: React.Dispatch<
    React.SetStateAction<Meeting[]>
  >;
  setSelectedMeeting: (
    meeting: Meeting
  ) => void;
}

export default function Dashboard({
  meeting,
  meetings,
  setMeetings,
  setSelectedMeeting,
}: DashboardProps)
 {
 const updateContent = (
  e: React.ChangeEvent<HTMLTextAreaElement>
) => {
  const updatedMeeting = {
    ...meeting,
    transcript: e.target.value,
  };

  setMeetings(
    meetings.map((item) =>
      item.id === meeting.id
        ? updatedMeeting
        : item
    )
  );

  setSelectedMeeting(updatedMeeting);
};

  return (
    <div className="flex-1 bg-slate-100 p-8">
      <h1 className="text-3xl font-bold text-black mb-4">
        {meeting.title}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold text-black mb-4">
          회의 원문
        </h2>

        <textarea
          value={meeting.transcript}
          onChange={updateContent}
          className="w-full border p-3 rounded min-h-[300px] text-black"
        />
      </div>
    </div>
  );
}