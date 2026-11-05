let worker: Worker | null = null;

export function getWorker() {
  if (worker) {

    return worker;
  }


  worker = new Worker(
    "/workers/whisper-worker.js"
  );


  worker.onerror = (
    error
  ) => {
    console.error(
      "[WORKER ERROR]",
      error
    );
  };

  return worker;
}

export async function initWorker(
  modelBytes: ArrayBuffer
) {
  const worker =
    getWorker();

  return new Promise<number>(
    (resolve, reject) => {
      const handleMessage = (
        event: MessageEvent
      ) => {
        const data =
          event.data;

        if (
          data.type ===
          "init-complete"
        ) {
          worker.removeEventListener(
            "message",
            handleMessage
          );

          resolve(
            data.runtime
          );
        }

        if (
          data.type ===
          "error"
        ) {
          worker.removeEventListener(
            "message",
            handleMessage
          );

          reject(
            new Error(
              data.error
            )
          );
        }
      };

      worker.addEventListener(
        "message",
        handleMessage
      );

      worker.postMessage({
        type: "init",
        modelBytes,
      });
    }
  );
}

export async function transcribeWithWorker(
  pcm: Float32Array
) {
  const worker =
    getWorker();

  return new Promise<string>(
    (resolve, reject) => {
      const handleMessage = (
        event: MessageEvent
      ) => {
        const data =
          event.data;

        if (
          data.type ===
          "transcribe-complete"
        ) {
          worker.removeEventListener(
            "message",
            handleMessage
          );

          resolve(
            data.transcript
          );
        }

        if (
          data.type ===
          "error"
        ) {
          worker.removeEventListener(
            "message",
            handleMessage
          );

          reject(
            new Error(
              data.error
            )
          );
        }
      };

      worker.addEventListener(
        "message",
        handleMessage
      );

      worker.postMessage({
        type: "transcribe",
        pcm,
      });
    }
  );
}