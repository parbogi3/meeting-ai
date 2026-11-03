"use client";

import { useState } from "react";

export default function STTTest() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] =
  useState<number | null>(null);

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
      URL.createObjectURL(selected);

    audio.onloadedmetadata =
      () => {
        setDuration(audio.duration);
      };
  }
}}
      />

      <div className="mt-4">
        선택 파일:
        {" "}
        {file?.name ?? "없음"}
      </div>

      <div className="mt-4">
  선택 파일:
  {file?.name ?? "없음"}
</div>

<div className="mt-2">
  길이:
  {duration
    ? `${Math.round(duration)}초`
    : "미확인"}
</div>
    </div>
  );
}