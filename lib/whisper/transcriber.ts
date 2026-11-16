import {
  fileToAudioBuffer,
  resampleTo16k,
} from "./audio";

import { loadModel } from "./loader";
import { getModel } from "./cache";

import {
  initWorker,
  transcribeWithWorker,
} from "./worker-client";

import {
  splitAudioIntoChunks,
} from "./chunk";

let initialized = false;

export async function transcribe(
  file: File
) {
  const audioBuffer =
    await fileToAudioBuffer(file);

  const pcm16k =
    await resampleTo16k(audioBuffer);

  if (!initialized) {
    console.log(
      "[TRANSCRIBER] 모델 초기화 시작"
    );

    await loadModel();

    const modelBlob =
      await getModel();

    if (!modelBlob) {
      throw new Error(
        "모델 로드 실패"
      );
    }

    const modelBytes =
      await modelBlob.arrayBuffer();

    console.log(
      "[TRANSCRIBER] INIT START"
    );

    await initWorker(modelBytes);

    console.log(
      "[TRANSCRIBER] INIT COMPLETE"
    );

    initialized = true;
  }

  console.log(
    "[TRANSCRIBER] 전사 시작"
  );

  const chunks =
  splitAudioIntoChunks(
    pcm16k,
    16000,
    30
  );


const results: string[] = [];

for (
  let i = 0;
  i < chunks.length;
  i++
) {
  const text =
    await transcribeWithWorker(
      chunks[i]
    );

  results.push(text);
}

const transcript =
  results.join("\n");

console.log(
  "[TRANSCRIBER] 전사 완료"
);

return transcript;
}