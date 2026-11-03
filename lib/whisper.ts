"use client";

import {
  WhisperWasmService,
  ModelManager,
} from "@timur00kh/whisper.wasm";

let whisper: WhisperWasmService | null = null;

export async function getWhisper() {
  if (whisper) return whisper;

  whisper = new WhisperWasmService();

  const manager = new ModelManager();

  const modelData =
    await manager.loadModel("tiny");

  await whisper.initModel(modelData);

  return whisper;
}
