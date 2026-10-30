import { Meeting } from "@/types/meeting";
import MeetingRecorder from "./MeetingRecorder";

interface MeetingEditorProps {
  selectedMeeting: Meeting | null;

  renameMeeting: () => void;
  deleteMeeting: () => void;

  generateSummary: () => void;

  uploadAudio: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  updateTranscript: (
    value: string
  ) => void;

  onRecorded: (
    file: File
  ) => Promise<void>;

  onSpeechTranscript: (
    text: string
  ) => void;

meetingStatus: string;

selectedCategories: string[];
setSelectedCategories: React.Dispatch<
  React.SetStateAction<string[]>
>;

updateCategories: (
  updatedCategories: string[]
) => Promise<void>;
}

export default function MeetingEditor({
  selectedMeeting,
  renameMeeting,
  deleteMeeting,
  generateSummary,
  uploadAudio,
  updateTranscript,
  onRecorded,
  onSpeechTranscript,
  meetingStatus,

  selectedCategories,
  setSelectedCategories,
  updateCategories,
}: MeetingEditorProps){
  if (!selectedMeeting) {
    return (
      <main className="flex-1 bg-slate-50 p-8 h-screen overflow-y-auto">
        <div className="bg-white border rounded-2xl p-10 text-slate-500 shadow-sm">
          회의를 선택하세요.
        </div>
      </main>
    );
  }
const categoryOptions = [
  "사업운영",
  "신규기획",
  "현장소통",
  "예산",
  "일정",
  "기타회의",
];
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
    <main className="flex-1 bg-slate-50 p-8 overflow-y-auto">

      {/* 제목 */}
<div className="flex items-center gap-3 mb-4">

  <h1 className="text-3xl font-bold text-slate-900">
    {selectedMeeting.title}
  </h1>

<div className="flex flex-wrap gap-2">
  {selectedCategories.map((category) => (
    <span
      key={category}
      className={`px-2 py-1 text-xs rounded-full border ${getCategoryStyle(
        category
      )}`}
    >
      {category}
    </span>
  ))}
</div>

</div>
      
      <div className="flex flex-wrap gap-2 mb-4">

  {categoryOptions.map((category) => (
    <button
      key={category}
      onClick={() => {
  let updatedCategories: string[];

  if (
    selectedCategories.includes(
      category
    )
  ) {
    updatedCategories =
      selectedCategories.filter(
        (c) => c !== category
      );
  } else {
    updatedCategories = [
      ...selectedCategories,
      category,
    ];
  }

  setSelectedCategories(
    updatedCategories
  );

  updateCategories(
    updatedCategories
  );
}}
      className={`px-3 py-1 rounded-full text-sm border transition ${
        selectedCategories.includes(
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

      {/* 액션 버튼 */}
      <div className="flex gap-2 mb-4 flex-wrap">

        <button
          onClick={renameMeeting}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg transition"
        >
          제목 변경
        </button>

        <button
          onClick={deleteMeeting}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
        >
          회의 삭제
        </button>

        <button
          onClick={generateSummary}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition"
        >
          ✨ AI 요약
        </button>

        <label className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg cursor-pointer transition">
          🎵 음성 업로드

          <input
            type="file"
            accept=".mp3,.wav,.m4a"
            onChange={uploadAudio}
            className="hidden"
          />
        </label>

        <MeetingRecorder
          onTranscript={onSpeechTranscript}
          onRecorded={onRecorded}
          onMeetingStarted={() => {}}
          onMeetingEnded={(duration) => {
            console.log(
              "회의 길이:",
              duration
            );
          }}
        />
      </div>

      {/* 회의 기본 정보 */}
<div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

  <h2 className="text-base font-semibold text-slate-900 mb-2">
    회의 기본 정보
  </h2>

  <div className="grid grid-cols-4 gap-3">

    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        시간
      </label>

      <input
        value={selectedMeeting.meeting_date ?? ""}
        placeholder="14:00 ~ 15:00"
        className="w-full border rounded-md px-2 py-1 text-sm text-slate-800"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        장소
      </label>

      <input
        value={selectedMeeting.meeting_time ?? ""}
        placeholder="회의실A"
        className="w-full border rounded-md px-2 py-1 text-sm text-slate-800"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        작성자
      </label>

      <input
        value={selectedMeeting.meeting_location ?? ""}
        placeholder="AIAX산업팀 홍길동"
        className="w-full border rounded-md px-2 py-1 text-sm text-slate-800"

      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        참석자
      </label>

      <input
        value={selectedMeeting.writer ?? ""}
        placeholder="A기업 대표 김철수"
        className="w-full border rounded-md px-2 py-1 text-sm text-slate-800"
      />
    </div>

  </div>

  <div className="mt-4">

  </div>

  <div className="mt-4">

    <label className="block text-sm font-medium text-slate-600 mb-1">
      회의 안건
    </label>

    <input
      value={selectedMeeting.meeting_subject ?? ""}
      placeholder="제조업 AI융합 기반 조성 사업 성과홍보회 개최 논의"
      className="w-full border rounded-md px-2 py-1 text-sm text-slate-800"

    />

  </div>

</div>

      {/* 회의록 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <h2 className="font-bold text-slate-900 mb-3">
          회의 원문
        </h2>

        <textarea
          value={selectedMeeting.transcript}
          onChange={(e) =>
            updateTranscript(
              e.target.value
            )
          }
          className="w-full min-h-[350px] border border-slate-200 rounded-xl p-4 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {/* AI 요약 */}
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

        <h2 className="text-lg font-bold text-slate-900 mb-4">
          AI 회의 요약
        </h2>

        <pre className="whitespace-pre-wrap text-slate-700 leading-relaxed">
          {selectedMeeting.summary ||
            "요약이 없습니다."}
        </pre>

      </div>

      {/* 오디오 플레이어 */}
      {selectedMeeting.audio_url && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">

          <h2 className="text-lg font-bold text-slate-900 mb-4">
            회의 녹음
          </h2>

          <audio
            controls
            className="w-full"
            src={selectedMeeting.audio_url}
          />

          <p className="mt-3 text-xs text-slate-400 break-all">
            {selectedMeeting.audio_url}
          </p>

        </div>
      )}
    </main>
  );
}