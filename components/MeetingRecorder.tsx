"use client";

import { useRef, useState } from "react";

interface MeetingRecorderProps {
  onTranscript: (
    text: string
  ) => void;

  onRecorded: (
    file: File
  ) => Promise<void>;

  onMeetingStarted: () => void;

  onMeetingEnded: (
    duration: string
  ) => void;
}

export default function MeetingRecorder({
  onRecorded,
  onMeetingStarted,
  onMeetingEnded,
}: MeetingRecorderProps) {
  const [recording, setRecording] =
    useState(false);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const chunksRef = useRef<Blob[]>([]);

  const meetingStartRef =
    useRef<number | null>(null);

  const startMeeting = async () => {
    try {
      meetingStartRef.current =
        Date.now();

      onMeetingStarted();

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

      mediaRecorderRef.current =
        recorder;

      recorder.start();

      setRecording(true);
    } catch (error) {
      console.error(error);

      alert(
        "마이크를 사용할 수 없습니다."
      );
    }
  };

  const stopMeeting = () => {
    const meetingEnd =
      Date.now();

    const durationSeconds =
      Math.floor(
        (meetingEnd -
          (meetingStartRef.current ??
            meetingEnd)) /
          1000
      );

    const minutes =
      Math.floor(durationSeconds / 60);

    const seconds =
      durationSeconds % 60;

    const duration =
      `${minutes}분 ${seconds}초`;

    onMeetingEnded(duration);

    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      setRecording(false);
      return;
    }

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

  return !recording ? (
    <button
      onClick={startMeeting}
      className="bg-indigo-600 text-white px-4 py-2 rounded"
    >
      🎤 회의 시작
    </button>
  ) : (
    <button
      onClick={stopMeeting}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      ⏹ 회의 종료
    </button>
  );
}