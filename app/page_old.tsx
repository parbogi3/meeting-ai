"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import MeetingList from "@/components/MeetingList";

type Meeting = {
  id: string;
  title: string;
  transcript: string;
  summary?: string | null;
  audio_url?: string | null;
  created_at: string;
};

export default function Home() {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] =
    useState<Meeting | null>(null);

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const today = new Date();

  const [selectedDate, setSelectedDate] =
    useState(
      `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(
        today.getDate()
      ).padStart(2, "0")}`
    );

  useEffect(() => {
    loadUserAndMeetings();
  }, []);

  const loadUserAndMeetings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);
    setUserEmail(user.email ?? "");

    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setMeetings(data || []);

    if (data && data.length > 0) {
      setSelectedMeeting(data[0]);
    }
  };

  const createMeeting = async () => {
    const title = prompt("회의 제목 입력");

    if (!title) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("meetings")
      .insert({
        title,
        transcript: "",
        summary: "",
        user_id: user.id,
      });

    if (error) {
      alert(error.message);
      return;
    }

    await loadUserAndMeetings();
  };

  const renameMeeting = async () => {
    if (!selectedMeeting) return;

    const newTitle = prompt(
      "새 회의 제목 입력",
      selectedMeeting.title
    );

    if (!newTitle) return;

    const { error } = await supabase
      .from("meetings")
      .update({
        title: newTitle,
      })
      .eq("id", selectedMeeting.id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadUserAndMeetings();
  };

  const deleteMeeting = async () => {
    if (!selectedMeeting) return;

    const confirmed = confirm(
      "정말 삭제하시겠습니까?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("meetings")
      .delete()
      .eq("id", selectedMeeting.id);

    if (error) {
      alert(error.message);
      return;
    }

    setSelectedMeeting(null);

    await loadUserAndMeetings();
  };

  const updateTranscript = async (
    value: string
  ) => {
    if (!selectedMeeting) return;

    setSelectedMeeting({
      ...selectedMeeting,
      transcript: value,
    });

    const { error } = await supabase
      .from("meetings")
      .update({
        transcript: value,
      })
      .eq("id", selectedMeeting.id);

    if (error) {
      console.error(error);
    }
  };

  const generateSummary = async () => {
    if (!selectedMeeting) {
      alert("회의를 선택하세요.");
      return;
    }

    if (!selectedMeeting.transcript?.trim()) {
      alert("회의 원문이 없습니다.");
      return;
    }

    try {
      const response = await fetch(
        "/api/summary",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            transcript:
              selectedMeeting.transcript,
          }),
        }
      );

      const data =
        await response.json();

      console.log(data);

      if (!data.summary) {
        alert(
          JSON.stringify(
            data,
            null,
            2
          )
        );
        return;
      }

      const { error } = await supabase
        .from("meetings")
        .update({
          summary: data.summary,
        })
        .eq(
          "id",
          selectedMeeting.id
        );

      if (error) {
        alert(error.message);
        return;
      }

      const updatedMeeting = {
        ...selectedMeeting,
        summary: data.summary,
      };

      setSelectedMeeting(
        updatedMeeting
      );

      setMeetings((prev) =>
        prev.map((meeting) =>
          meeting.id ===
          selectedMeeting.id
            ? updatedMeeting
            : meeting
        )
      );

      alert("AI 요약 완료");
    } catch (error) {
      console.error(error);

      alert(
        "요약 실패: " +
          String(error)
      );
    }
  };
const uploadAudio = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (!selectedMeeting) {
    alert("회의를 선택하세요.");
    return;
  }

  const file = e.target.files?.[0];

  if (!file) return;

  try {
    const fileName =
      `${Date.now()}-${file.name}`;

    const { error } =
      await supabase.storage
        .from("audio-files")
        .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("audio-files")
      .getPublicUrl(fileName);

    const { error: updateError } =
      await supabase
        .from("meetings")
        .update({
          audio_url: publicUrl,
        })
        .eq("id", selectedMeeting.id);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    const updatedMeeting = {
      ...selectedMeeting,
      audio_url: publicUrl,
    };

    setSelectedMeeting(updatedMeeting);

    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === selectedMeeting.id
          ? updatedMeeting
          : meeting
      )
    );

    alert("음성 업로드 완료");
  } catch (error) {
    alert(
      "업로드 실패: " +
        String(error)
    );
  }
};
  const currentYear =
    currentDate.getFullYear();

  const currentMonth =
    currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(
      new Date(
        currentYear,
        currentMonth - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        currentYear,
        currentMonth + 1,
        1
      )
    );
  };

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    ),
  ];

  const meetingsByDate = useMemo(() => {
    return meetings.filter((meeting) => {
      const date =
        meeting.created_at.split(
          "T"
        )[0];

      return date === selectedDate;
    });
  }, [meetings, selectedDate]);

  return (
    <div className="flex h-screen">
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
            {currentYear}년{" "}
            {currentMonth + 1}월
          </div>

          <button
            onClick={nextMonth}
            className="bg-slate-700 px-3 py-1 rounded"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {[
            "일",
            "월",
            "화",
            "수",
            "목",
            "금",
            "토",
          ].map((day) => (
            <div
              key={day}
              className="font-bold"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, idx) => {
            if (!day)
              return <div key={idx} />;

            const dateString =
              `${currentYear}-${String(
                currentMonth + 1
              ).padStart(2, "0")}-${String(
                day
              ).padStart(2, "0")}`;

            const count =
              meetings.filter(
                (m) =>
                  m.created_at.split(
                    "T"
                  )[0] === dateString
              ).length;

            return (
              <button
                key={day}
                onClick={() =>
                  setSelectedDate(
                    dateString
                  )
                }
                className={`p-2 rounded text-xs ${
                  selectedDate ===
                  dateString
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

      <aside className="w-80 bg-slate-800 text-white p-4 overflow-y-auto">
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
                setSelectedMeeting(
                  meeting
                )
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

      <main className="flex-1 bg-slate-100 p-8">
        {selectedMeeting ? (
          <>
            <h1 className="text-3xl font-bold text-black mb-4">
              {selectedMeeting.title}
            </h1>

           <div className="flex gap-2 mb-4 flex-wrap">
  <button
    onClick={renameMeeting}
    className="bg-yellow-500 text-white px-4 py-2 rounded"
  >
    제목 변경
  </button>

  <button
    onClick={deleteMeeting}
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    회의 삭제
  </button>

  <button
    onClick={generateSummary}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    ✨ AI 요약
  </button>

  <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
    🎵 음성 업로드

    <input
      type="file"
      accept=".mp3,.wav,.m4a"
      onChange={uploadAudio}
      className="hidden"
    />
  </label>
</div>

            <textarea
              value={
                selectedMeeting.transcript
              }
              onChange={(e) =>
                updateTranscript(
                  e.target.value
                )
              }
              className="w-full min-h-[350px] border rounded p-4 text-black bg-white"
            />

            <div className="mt-6 bg-white rounded-xl p-6 shadow">
              <h2 className="font-bold text-black mb-4">
                AI 회의 요약
              </h2>

              <pre className="whitespace-pre-wrap text-black">
                {selectedMeeting.summary ||
                  "요약이 없습니다."}
              </pre>
              {selectedMeeting.audio_url && (
  <div className="mt-6 bg-white rounded-xl p-6 shadow">
    <h3 className="font-bold text-black mb-4">
      회의 녹음
    </h3>

    <audio
  controls
  className="w-full"
  src={selectedMeeting.audio_url}
  onError={() =>
    console.log(
      "오디오 로딩 실패",
      selectedMeeting.audio_url
    )
  }
/>

    <p className="mt-2 text-xs text-gray-500 break-all">
      {selectedMeeting.audio_url}
    </p>
  </div>
)}
            </div>
          </>
        ) : (
          <div className="text-black">
            회의를 선택하세요.
          </div>
        )}
      </main>
    </div>
  );
}