import { initWorker } from "./worker-client";

export function createWorkerPool(
  size: number
) {
  const workers = Array.from(
    { length: size },
    () =>
      new Worker(
        "/workers/whisper-worker.js"
      )
  );

  return workers;
}