"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

import CalendarPanel from "@/components/CalendarPanel";
import MeetingList from "@/components/MeetingList";
import MeetingEditor from "@/components/MeetingEditor";
import DashboardHeader from "@/components/DashboardHeader";

type Meeting = {
  id: string;
  title: string;
  transcript: string;

  summary?: string | null;
  audio_url?: string | null;

  meeting_started_at?: string | null;
  meeting_ended_at?: string | null;

  meeting_date?: string | null;
  meeting_time?: string | null;

  meeting_location?: string | null;

  participants?: string | null;

  writer?: string | null;

  meeting_subject?: string | null;

  created_at: string;
};


export default function Home() {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] =
    useState<Meeting | null>(null);

    const [meetingStatus, setMeetingStatus] =
  useState("대기중");

const [currentDate, setCurrentDate] =
  useState<Date | null>(null);

const [selectedDate, setSelectedDate] =
  useState("");

    const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [newMeetingTitle, setNewMeetingTitle] =
    useState("");

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

    const [createCategories, setCreateCategories] =
  useState<string[]>([]);

    const categoryOptions = [
  "사업운영",
  "신규기획",
  "현장소통",
  "예산",
  "일정",
  "기타회의",
];


useEffect(() => {
  loadUserAndMeetings();

  const today = new Date();

  setCurrentDate(today);

  setSelectedDate(
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`
  );
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

  setSelectedCategories(
    data[0].categories ?? []
  );
}
  };

const createMeeting = async () => {
  if (!newMeetingTitle.trim()) {
    alert("회의 제목을 입력하세요.");
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("meetings")
    .insert({
      title: newMeetingTitle,
      transcript: "",
      summary: "",
      user_id: user.id,
      categories: createCategories,
    });

  if (error) {
    alert(error.message);
    return;
  }

  setShowCreateModal(false);

  setNewMeetingTitle("");

  setCreateCategories([]);

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
const updateCategories = async (
  updatedCategories: string[]
) => {
  if (!selectedMeeting) return;

  const { error } = await supabase
    .from("meetings")
    .update({
      categories: updatedCategories,
    })
    .eq("id", selectedMeeting.id);

  if (error) {
    alert(error.message);
    return;
  }

  setMeetings((prev) =>
    prev.map((meeting) =>
      meeting.id === selectedMeeting.id
        ? {
            ...meeting,
            categories: updatedCategories,
          }
        : meeting
    )
  );

if (selectedMeeting) {
  setSelectedMeeting({
    ...selectedMeeting,
    categories: updatedCategories,
  });
}
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
const updateMeetingInfo = async (
  field: string,
  value: string
) => {
  if (!selectedMeeting) return;

  const updatedMeeting = {
    ...selectedMeeting,
    [field]: value,
  };

  setSelectedMeeting(updatedMeeting);

  setMeetings((prev) =>
    prev.map((meeting) =>
      meeting.id === selectedMeeting.id
        ? updatedMeeting
        : meeting
    )
  );

  const { error } = await supabase
    .from("meetings")
    .update({
      [field]: value,
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

  try {
    const { data: latestMeeting, error: loadError } =
      await supabase
        .from("meetings")
        .select("*")
        .eq("id", selectedMeeting.id)
        .single();

    if (loadError) {
      alert(loadError.message);
      return;
    }

    if (
      !latestMeeting?.transcript?.trim()
    ) {
      alert("회의 원문이 없습니다.");
      return;
    }

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
            latestMeeting.transcript,
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
      ...latestMeeting,
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
  setMeetingStatus("오디오 저장중...");
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
setMeetingStatus("회의 데이터 저장중...");
    await loadUserAndMeetings();

    setMeetingStatus("완료");

alert("녹음 업로드 완료");
  } catch (error) {
    alert(
      "업로드 실패: " +
        String(error)
    );
  }
};
if (!currentDate) {
  return <div>로딩중...</div>;
}
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

  return (
      <div className="h-screen flex flex-col">

    <DashboardHeader />
    {showCreateModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-6 w-[500px] shadow-xl text-slate-900">

      <h2 className="text-2xl font-bold mb-5 text-slate-900">
        새 회의 생성
      </h2>

      <input
  value={newMeetingTitle}
  onChange={(e) =>
    setNewMeetingTitle(e.target.value)
  }
  placeholder="회의 제목 입력"
  className="w-full border rounded-xl p-3 mb-5 text-slate-900 placeholder:text-slate-400 bg-white"
/>

      <div className="mb-5">

        <div className="font-medium mb-3 text-slate-900">
  카테고리 선택
</div>

       <div className="flex flex-wrap gap-2 mb-4">

  {categoryOptions.map((category) => (
    <button
      key={category}
     onClick={async () => {
  let updatedCategories;

  if (
    createCategories.includes(
      category
    )
  ) {
    updatedCategories =
      createCategories.filter(
        (c) => c !== category
      );
  } else {
    updatedCategories = [
      ...createCategories,
      category,
    ];
  }

setCreateCategories(
  updatedCategories
);

}}
      className={`px-3 py-1 rounded-full text-sm border transition ${
        createCategories.includes(
          category
        )
          ? "bg-indigo-600 text-white border-indigo-600"
          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
      }`}
    >
      {category}
    </button>
  ))}

</div>

      </div>

      <div className="flex justify-end gap-2">

        <button
          onClick={() => {
  setShowCreateModal(false);

  setNewMeetingTitle("");
  setCreateCategories([]);
}}
          className="px-4 py-2 rounded-lg border"
        >
          취소
        </button>
       

        <button
          onClick={createMeeting}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
        >
          생성
        </button>
        
      </div>

    </div>

  </div>
)}
  <div className="flex flex-1 overflow-hidden">
<CalendarPanel
  currentYear={currentYear}
  currentMonth={currentMonth}
  calendarDays={calendarDays}
  selectedDate={selectedDate}
  meetings={meetings}
  prevMonth={prevMonth}
  nextMonth={nextMonth}
  setSelectedDate={setSelectedDate}
createMeeting={() => {
  setNewMeetingTitle("");
  setCreateCategories([]);
  setShowCreateModal(true);
}}
/>

      <MeetingList
  meetings={meetings}
  selectedMeeting={selectedMeeting}
  selectedDate={selectedDate}
  setSelectedMeeting={(meeting) => {
    setSelectedMeeting(meeting);

    setSelectedCategories(
      meeting.categories ?? []
    );
  }}
/>

<MeetingEditor
  selectedMeeting={selectedMeeting}
  renameMeeting={renameMeeting}
  deleteMeeting={deleteMeeting}
  generateSummary={generateSummary}
  uploadAudio={uploadAudio}
  updateTranscript={updateTranscript}
  onRecorded={async (file) => {
    await handleRecordedAudio(file);
    await generateSummary();
  }}
  onSpeechTranscript={(text) => {
    updateTranscript(text);
  }}
  meetingStatus={meetingStatus}

  selectedCategories={selectedCategories}
  setSelectedCategories={setSelectedCategories}
  updateCategories={updateCategories}
updateMeetingInfo={updateMeetingInfo}
/>

    </div>

  </div>
);
}