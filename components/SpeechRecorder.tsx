"use client";

import { useRef, useState } from "react";

interface SpeechRecorderProps {
  onTranscript: (
    text: string
  ) => void;
}

export default function SpeechRecorder({
  onTranscript,
}: SpeechRecorderProps) {
  const [recording, setRecording] =
    useState(false);

  const recognitionRef =
    useRef<any>(null);

  const startRecognition = () => {
    const SpeechRecognition =
      (window as any)
        .SpeechRecognition ||
      (window as any)
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "이 브라우저는 음성 인식을 지원하지 않습니다."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "ko-KR";

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.onresult = (
      event: any
    ) => {
      let transcript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript +
          " ";
      }

      onTranscript(
        transcript.trim()
      );
    };

    recognition.start();

    recognitionRef.current =
      recognition;

    setRecording(true);
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();

    setRecording(false);
  };

  return (
    <>
      {!recording ? (
        <button
          onClick={startRecognition}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          🎤 실시간 회의 시작
        </button>
      ) : (
        <button
          onClick={stopRecognition}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          ⏹ 회의 종료
        </button>
      )}
    </>
  );
}