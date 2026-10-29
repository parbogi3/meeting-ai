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
  onTranscript,
  onRecorded,
  onMeetingStarted,
  onMeetingEnded,
}: MeetingRecorderProps) {
  const [recording, setRecording] =
    useState(false);

  const recognitionRef =
    useRef<any>(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const chunksRef = useRef<Blob[]>([]);

  const transcriptRef =
    useRef("");

  const meetingStartRef =
    useRef<number | null>(null);

  const startMeeting = async () => {
    try {
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

      meetingStartRef.current =
        Date.now();

      onMeetingStarted();

      transcriptRef.current = "";

      const recognition =
        new SpeechRecognition();

      recognition.lang = "ko-KR";

      recognition.continuous = true;

      recognition.interimResults = false;

      recognition.onresult = (
        event: any
      ) => {
        const latestText =
          event.results[
            event.results.length - 1
          ][0].transcript;

        transcriptRef.current +=
          latestText + "\n";

        onTranscript(
          transcriptRef.current
        );
      };

      recognition.onerror = (
        error: any
      ) => {
        console.error(
          "SpeechRecognition Error",
          error
        );
      };

      recognition.start();

      recognitionRef.current =
        recognition;

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

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
    recognitionRef.current?.stop();

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