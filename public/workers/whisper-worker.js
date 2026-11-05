console.log("[Worker] Boot", Date.now());

importScripts("/wasm/main.js");

let runtime = null;
let moduleReady = false;

async function waitForModule() {
  let retry = 0;

  while (
    (!self.Module ||
      typeof self.Module.full_default !== "function") &&
    retry < 100
  ) {
    await new Promise((r) =>
      setTimeout(r, 100)
    );

    retry++;
  }

  if (
    !self.Module ||
    typeof self.Module.full_default !== "function"
  ) {
    throw new Error(
      "Whisper Module Load Failed"
    );
  }

  moduleReady = true;
}

self.onmessage = async (event) => {
  const {
    type,
    modelBytes,
    pcm,
  } = event.data;

  try {
    const Module = self.Module;

    if (type === "init") {
      if (!moduleReady) {
  await waitForModule();
}
      console.log("[Worker] Init Start");

      try {
        Module.FS_unlink(
          "/whisper.bin"
        );
      } catch {}

      Module.FS_createDataFile(
        "/",
        "whisper.bin",
        new Uint8Array(modelBytes),
        true,
        true
      );

      runtime =
        Module.init(
          "whisper.bin"
        );

      self.postMessage({
        type: "init-complete",
        runtime,
      });

      return;
    }

    if (type === "transcribe") {
      if (!runtime) {
        self.postMessage({
          type: "error",
          error:
            "Runtime not initialized",
        });

        return;
      }

      console.log(
        "[Worker] Transcribe Start"
      );

      const rc =
        Module.full_default(
          runtime,
          pcm,
          "ko",
          1,
          false
        );

      console.log(
        "[Worker] Return Code:",
        rc
      );

      const count =
        Module.get_segment_count(
          runtime
        );

      console.log(
        "[Worker] Segment Count:",
        count
      );

      let transcript = "";

      for (
        let i = 0;
        i < count;
        i++
      ) {
        const text =
          Module.get_segment_text(
            runtime,
            i
          );

        console.log(
          `[Worker] Segment ${i}:`,
          text
        );

        transcript += text;
      }

      console.log(
        "[Worker] Transcript:",
        transcript
      );

      self.postMessage({
        type:
          "transcribe-complete",
        transcript,
      });

      return;
    }

    self.postMessage({
      type: "unknown",
      payload: type,
    });
  } catch (error) {
    console.error(
      "[Worker Error]",
      error
    );

    self.postMessage({
      type: "error",
      error:
        error?.stack ||
        error?.message ||
        String(error),
    });
  }
};