import { Meeting } from "@/types/meeting";
import Recorder from "./Recorder";
import SpeechRecorder from "./SpeechRecorder";

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
}: MeetingEditorProps) {
  if (!selectedMeeting) {
    return (
      <main className="flex-1 bg-slate-100 p-8">
        <div className="text-black">
          회의를 선택하세요.
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-100 p-8">
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

        <Recorder
          onRecorded={onRecorded}
        />

        <SpeechRecorder
          onTranscript={onSpeechTranscript}
        />
      </div>

      <textarea
        value={selectedMeeting.transcript}
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
      </div>

      {selectedMeeting.audio_url && (
        <div className="mt-6 bg-white rounded-xl p-6 shadow">
          <h2 className="font-bold text-black mb-4">
            회의 녹음
          </h2>

          <audio
            controls
            className="w-full"
            src={selectedMeeting.audio_url}
          />

          <p className="mt-3 text-xs text-gray-500 break-all">
            {selectedMeeting.audio_url}
          </p>
        </div>
      )}
    </main>
  );
}