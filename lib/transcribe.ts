import { pipeline } from "@huggingface/transformers";

let transcriber: any = null;

export async function getTranscriber() {
  if (transcriber) {
    return transcriber;
  }

  transcriber = await pipeline(
    "automatic-speech-recognition",
    "Xenova/whisper-tiny"
  );

  return transcriber;
}