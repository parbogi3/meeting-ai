import { getModel } from "./cache";

let initialized = false;

export async function initRuntime() {
  if (initialized) {
    return;
  }

  console.log("Whisper Runtime Init");

  initialized = true;
}

export async function runInference(
  pcm16k: Float32Array
) {
  await initRuntime();

  const model =
    await getModel();

  if (!model) {
    return "모델 없음";
  }

  console.log(
    "Model Size:",
    model.size
  );

  console.log(
    "PCM Length:",
    pcm16k.length
  );

  return `
모델 로드 성공

Model Size:
${model.size}

PCM Length:
${pcm16k.length}
`;
}