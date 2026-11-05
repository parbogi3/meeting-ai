import { getModel } from "./cache";

declare global {
  interface Window {
    Module: any;
    __whisperLoaded?: boolean;
  }
}

let instance: number | null = null;

async function ensureWhisperLoaded() {
  if (window.__whisperLoaded) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      'script[data-whisper="true"]'
    );

    if (existing) {
      window.__whisperLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");

    script.src = "/wasm/main.js";
    script.dataset.whisper = "true";

    script.onload = () => {
      window.__whisperLoaded = true;
      console.log("Whisper WASM Loaded");
      resolve();
    };

    script.onerror = () => {
      reject(
        new Error("Whisper main.js 로드 실패")
      );
    };

    document.body.appendChild(script);
  });
}

export async function initRuntime() {
  await ensureWhisperLoaded();

  if (instance) {
    return instance;
  }

  const modelBlob = await getModel();

  if (!modelBlob) {
    throw new Error("모델이 없습니다.");
  }

  const Module = window.Module;

  if (!Module) {
    throw new Error("window.Module 없음");
  }

  const modelBytes = new Uint8Array(
    await modelBlob.arrayBuffer()
  );

  try {
    Module.FS_unlink("/whisper.bin");
  } catch {}

  Module.FS_createDataFile(
    "/",
    "whisper.bin",
    modelBytes,
    true,
    true
  );

  instance = Module.init("whisper.bin");

  console.log(
    "Whisper Instance:",
    instance
  );

  return instance;
}

export async function runInference(
  pcm16k: Float32Array
) {
  const runtime =
    await initRuntime();

  const Module =
    window.Module;

  console.log(
    "Whisper Instance:",
    runtime
  );

  const rc =
    Module.full_default(
      runtime,
      pcm16k,
      "ko",
      1,
      false
    );

  console.log(
    "Return Code:",
    rc
  );

  return `
전사 작업 시작됨

Runtime:
${runtime}

Return Code:
${rc}
`;
}

