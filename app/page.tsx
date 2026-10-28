"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

import CalendarPanel from "@/components/CalendarPanel";
import MeetingList from "@/components/MeetingList";
import MeetingEditor from "@/components/MeetingEditor";

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

    const transcribeResponse =
      await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          audioUrl: publicUrl,
        }),
      });

    const transcribeData =
      await transcribeResponse.json();

    const transcript =
      transcribeData.transcript ?? "";

    await supabase
      .from("meetings")
      .update({
        transcript,
      })
      .eq("id", selectedMeeting.id);

    const summaryResponse =
      await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          transcript,
        }),
      });

const summaryData =
  await summaryResponse.json();

console.log("SUMMARY DATA");
console.log(summaryData);

console.log("SUMMARY VALUE");
console.log(summaryData.summary);

alert(
  "SUMMARY: " +
    summaryData.summary
);


    await supabase
      .from("meetings")
      .update({
        transcript,
        summary:
          summaryData.summary ?? "",
      })
      .eq("id", selectedMeeting.id);

    await loadUserAndMeetings();

    alert(
      "회의록 + 요약 생성 완료"
    );
  } catch (error) {
    alert(
      "업로드 실패: " +
        String(error)
    );
  }
};
const handleRecordedAudio = async (
  file: File
) => {
  if (!selectedMeeting) {
    alert("회의를 선택하세요.");
    return;
  }

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

    await loadUserAndMeetings();

    alert("녹음 업로드 완료");
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
   <CalendarPanel
  currentYear={currentYear}
  currentMonth={currentMonth}
  calendarDays={calendarDays}
  selectedDate={selectedDate}
  meetings={meetings}
  prevMonth={prevMonth}
  nextMonth={nextMonth}
  setSelectedDate={setSelectedDate}
  createMeeting={createMeeting}
/>

      <MeetingList
  meetings={meetings}
  selectedMeeting={selectedMeeting}
  selectedDate={selectedDate}
  setSelectedMeeting={setSelectedMeeting}
/>

      <MeetingEditor
  selectedMeeting={selectedMeeting}
  renameMeeting={renameMeeting}
  deleteMeeting={deleteMeeting}
  generateSummary={generateSummary}
  uploadAudio={uploadAudio}
  updateTranscript={updateTranscript}
  onRecorded={handleRecordedAudio}
/>
    </div>
  );
}