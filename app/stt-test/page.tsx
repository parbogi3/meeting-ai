"use client";

import { useState } from "react";
import { loadModel } from "@/lib/whisper/loader";
import {
  hasModel,
} from "@/lib/whisper/cache";
import {
  getModelSize,
} from "@/lib/whisper/cache";
import { transcribe }
  from "@/lib/whisper/transcriber";

export default function STTTest() {
  const [file, setFile] = useState<File | null>(
    null
  );

  const [duration, setDuration] =
    useState<number | null>(null);
    const [modelStatus, setModelStatus] =
  useState("대기");
const [transcript, setTranscript] =
  useState("");

  const [pcmInfo, setPcmInfo] =
  useState("");


  const handleModel = async () => {
  try {
    setModelStatus("다운로드 중");

    await loadModel();

    setModelStatus("준비 완료");
  } catch (error) {
    console.error(error);

    setModelStatus("실패");
  }
};

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Browser Whisper Test
      </h1>

      <input
        type="file"
        accept=".mp3,.wav,.m4a"
        onChange={(e) => {
          const selected =
            e.target.files?.[0] ?? null;

          setFile(selected);

          if (selected) {
            const audio =
              document.createElement("audio");

            audio.src =
              URL.createObjectURL(
                selected
              );

            audio.onloadedmetadata =
              () => {
                setDuration(
                  audio.duration
                );
              };
          }
        }}
      />
<button
  onClick={handleModel}
  className="
    bg-indigo-600
    text-white
    px-4
    py-2
    rounded
    mb-4
  "
>
  모델 준비
</button>
      <div className="mt-4">
        선택 파일:
        {" "}
        {file?.name ?? "없음"}
      </div>

      <div className="mt-2">
        길이:
        {" "}
        {duration
          ? `${Math.round(
              duration
            )}초`
          : "미확인"}
      </div>
      <div className="mb-4">
<button
  onClick={async () => {
    const exists = await hasModel();

    alert(
      exists
        ? "IndexedDB에 모델 있음"
        : "IndexedDB에 모델 없음"
    );
  }}
  className="
    bg-gray-600
    text-white
    px-4
    py-2
    rounded
    ml-2
  "
>
  모델 확인
</button>

<button
  onClick={async () => {
    const size =
      await getModelSize();

    alert(
      `저장 크기: ${size} bytes`
    );
  }}
>
  모델 크기 확인
</button>
<button
  onClick={async () => {
    if (!file) {
      alert("파일 선택");
      return;
    }

    const text =
  await transcribe(file);

setTranscript(text);

setPcmInfo(
  "PCM 데이터 생성 완료"
);
  }}
  className="
    bg-green-600
    text-white
    px-4
    py-2
    rounded
    ml-2
  "
>
  전사 테스트
</button>
<div className="mt-4">
  PCM 상태: {pcmInfo}
</div>
<div className="mt-6">
  <h2 className="font-bold">
    전사 결과
  </h2>

  <pre className="mt-2 border p-4 rounded">
    {transcript}
  </pre>
</div>

  모델 상태: {modelStatus}
</div>
    </div>
  );
}