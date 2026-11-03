import {
  fileToAudioBuffer,
  audioBufferToFloat32,
  resampleTo16k,
} from "./audio";
import { runInference }
  from "./runtime";

export async function transcribe(
  file: File
) {
  const audioBuffer =
    await fileToAudioBuffer(file);

  const pcm16k =
    await resampleTo16k(audioBuffer);

  const seconds =
  pcm16k.length / 16000;

  const transcript =
  await runInference(pcm16k);

  console.log(
    "PCM Length:",
    pcm16k.length
  );

  console.log(
    "PCM Sample:",
    pcm16k.slice(0, 10)
  );

  return `
파일명:
${file.name}

원본 샘플레이트:
${audioBuffer.sampleRate}

변환 샘플레이트:
16000

PCM 길이:
${pcm16k.length}

전사 결과:
${transcript}
`;

}
