import {
  hasModel,
  saveModel,
} from "./cache";

export async function loadModel() {
  const exists = await hasModel();

  if (exists) {
    console.log("모델 캐시 발견");
    return;
  }

  console.log("모델 다운로드 시작");

  const response =
  await fetch("https://huggingface.co/parbogi3/meeting-ai-model/resolve/main/ggml-small.bin");

  if (!response.ok) {
  throw new Error(
    "모델 다운로드 실패"
  );
}
  
const blob =
  await response.blob();

await saveModel(blob);

  console.log("모델 다운로드 완료");
}