"use client";

import { useRef, useState } from "react";

interface RecorderProps {
  onRecorded: (file: File) => Promise<void>;
}

export default function Recorder({
  onRecorded,
}: RecorderProps) {
  const [recording, setRecording] =
    useState(false);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const chunksRef = useRef<Blob[]>([]);

  const startRecording =
    async () => {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder =
        new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (
        event
      ) => {
        chunksRef.current.push(
          event.data
        );
      };

      recorder.start();

      mediaRecorderRef.current =
        recorder;

      setRecording(true);
    };

  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) return;

    recorder.onstop = async () => {
      const blob = new Blob(
        chunksRef.current,
        {
          type: "audio/webm",
        }
      );

      const file = new File(
        [blob],
        `meeting-${Date.now()}.webm`,
        {
          type: "audio/webm",
        }
      );

      await onRecorded(file);
    };

    recorder.stop();

    setRecording(false);
  };

  return (
    <>
      {!recording ? (
        <button
          onClick={startRecording}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          🎙 녹음 시작
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          ⏹ 녹음 종료
        </button>
      )}
    </>
  );
}